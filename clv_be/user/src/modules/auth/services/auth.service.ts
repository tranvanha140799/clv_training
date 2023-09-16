import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthResponseDTO, LoginDTO, RegisterDTO } from '../dto';
import { User } from '../../user/entities';
import { RoleService, UserService } from '../../user/services';
import { ClientKafka, RpcException } from '@nestjs/microservices';
import { JwtPayload } from '../jwt/jwt.payload';
import { OAuthUser } from 'src/common/common.types';
import { generateRandomPassword, getRandomToken } from 'src/utils';
import {
  GET_MAILING_ON_SIGNUP_RESPONSE_TOPIC,
  NOTIFICATION_SERVICE,
  REDIS_CHANGE_PW_SESSION,
} from 'src/common/app.constants';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { SendChangePwMailRequest } from '../dto/send-mail-request.dto';
import { AUTH_RESET_PASSWORD_URL } from 'src/common/env';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    @Inject(NOTIFICATION_SERVICE) private readonly mailingClient: ClientKafka,
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly jwtService: JwtService,
  ) {}

  //* Register new user
  async registerUser(userDto: RegisterDTO): Promise<AuthResponseDTO> {
    try {
      // Check if registered email already exists on database
      const user = await this.userService.searchUserByCondition({
        where: { email: userDto.email },
      });
      if (user) {
        throw new BadRequestException(
          'Email already exists! Please use another.',
        );
      }
      // Create new user
      const newUser = await this.userService.addUser(userDto);
      // Get role
      const role = await this.roleService.searchRoleByCondition({
        where: { name: 'USER' },
        relations: ['users'],
      });
      role.users.push(newUser);
      // Insert to junction table
      const savedRole = await this.roleService.addRole(role);
      // Return JWT if success
      return this.generateAccessToken(newUser, [savedRole.id]);
    } catch (error) {
      Logger.error(error.message);
      throw new BadRequestException(error.message);
    }
  }

  //* Login user
  async loginUser(userDto: LoginDTO): Promise<AuthResponseDTO> {
    try {
      // Find user by email
      const user = await this.userService.searchUserByCondition({
        where: { email: userDto.email },
        relations: ['roles'],
      });
      if (!user) {
        throw new Error('Email does not exist!');
      }
      // Verify password
      const isVerified = await bcrypt.compare(userDto.password, user.password);
      if (isVerified) {
        const roleIdList = user.roles.map((role) => role.id);
        // Return JWT when succeed
        return this.generateAccessToken(user, roleIdList);
      } else {
        throw new RpcException('Wrong password!');
      }
    } catch (error) {
      Logger.error(error.message);
      throw new BadRequestException(error.message);
    }
  }

  //* Login with GoogleOAuth
  async googleLogin(userDto: OAuthUser): Promise<AuthResponseDTO> {
    const defaultPassword: string = generateRandomPassword();
    try {
      const user = await this.userService.searchUserByCondition({
        where: { email: userDto.email },
        relations: ['roles'],
      });

      if (user) {
        // When this email exists in system
        const roleIdList = user.roles.map((role) => role.id);
        // Return JWT if success
        return this.generateAccessToken(user, roleIdList);
      } else {
        // When this email first time registers to the system
        const newUserDto: RegisterDTO = {
          firstName: userDto.firstName,
          lastName: userDto.lastName,
          email: userDto.email,
          password: defaultPassword,
          role: null,
        };
        // Create new user
        const user = await this.userService.addUser(newUserDto);
        // Get role
        const role = await this.roleService.searchRoleByCondition({
          where: { name: 'USER' },
          relations: ['users'],
        });
        role.users.push(user);
        //Insert to junction table
        const savedRole = await this.roleService.addRole(role);

        // Send mail notification user about new password
        if (user) {
          const idToken = getRandomToken();

          const mailingParams = new SendChangePwMailRequest(
            idToken,
            defaultPassword,
            user.firstName,
            user.email,
            AUTH_RESET_PASSWORD_URL,
          );
          const mailingResponse = await new Promise<boolean>((resolve) => {
            this.mailingClient
              .emit(
                GET_MAILING_ON_SIGNUP_RESPONSE_TOPIC,
                JSON.stringify(mailingParams),
              )
              .subscribe((data) => {
                if (data) resolve(true);
                else resolve(false);
              });
          });
          if (mailingResponse) {
            await this.cacheManager.set(
              idToken,
              REDIS_CHANGE_PW_SESSION,
              Number(process.env.REDIS_NEW_PW_MAIL_EXPIRE_TIME),
            ); // Expire in 1 day

            console.log(mailingResponse);
            return this.generateAccessToken(user, [savedRole.id]);
          }
        }
      }
    } catch (error) {
      Logger.error(error.message);
      throw new BadRequestException(error.message);
    }
  }

  //* Generate access token when successfully registered/logged in
  generateAccessToken(user: User, roleIdList: string[]): AuthResponseDTO {
    const response: AuthResponseDTO = new AuthResponseDTO();
    response.accessToken = this.jwtService.sign({
      id: user.id,
      email: user.email,
      roleIds: roleIdList,
    } as JwtPayload);

    return response;
  }

  //* Decode token & get user information
  verifyAccessToken(accessToken: string) {
    try {
      return this.jwtService.verify(accessToken);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  //* Handle user logout: add access token to blacklist (using cache-manager)
  async addAccessTokenBlackList(accessToken: string, userId: string) {
    try {
      const payloadFromToken = this.verifyAccessToken(accessToken);
      const currentTime = Math.floor(Date.now() / 1000);
      const accessTokenRemainingTime: number =
        (payloadFromToken.exp - currentTime) * 1000; // the remaining time of the token is also the time it will be in blacklist
      if (accessTokenRemainingTime > 0) {
        // TODO: Implement cache-manager logic here...
        console.log(userId, accessTokenRemainingTime);
      } else {
        throw new BadRequestException('Token has expired!');
      }
    } catch (error) {
      Logger.error(error.message);
      throw new BadRequestException(error.message);
    }
  }
}
