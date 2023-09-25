import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
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
  GET_MAIL_ON_REGISTER_RESPONSE_TOPIC,
  NOTIFICATION_SERVICE,
  REDIS_CHANGE_PW_SESSION,
} from 'src/common/app.constants';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { SendMailChangePwRequest } from '../dto/send-mail-request.dto';
import {
  AUTH_CHANGE_DEFAULT_PASSWORD_URL,
  REDIS_NEW_PW_MAIL_EXPIRE_TIME,
} from 'src/common/env';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @Inject(NOTIFICATION_SERVICE) private readonly mailClient: ClientKafka,
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly jwtService: JwtService,
  ) {}
  private readonly logger = new Logger('AuthService');

  //* Register new user
  async registerUser(userDto: RegisterDTO): Promise<AuthResponseDTO> {
    try {
      // Check if registered email already exists on database
      const user = await this.userService.searchUserByCondition({
        where: { email: userDto.email },
      });
      if (user)
        throw new RpcException({
          status: HttpStatus.BAD_REQUEST,
          message: 'Email already exists! Please use another.',
        });

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
      this.logger.error(error.message);
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
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
      if (!user)
        throw new RpcException({
          status: HttpStatus.BAD_REQUEST,
          message: 'Email does not exist!',
        });

      // Verify password
      const isVerified = await bcrypt.compare(userDto.password, user.password);
      if (isVerified) {
        const roleIdList = user.roles.map((role) => role.id);
        // Return JWT when succeed
        return this.generateAccessToken(user, roleIdList);
      } else
        throw new RpcException({
          status: HttpStatus.BAD_REQUEST,
          message: 'Wrong password!',
        });
    } catch (error) {
      this.logger.error(error.message);
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
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

          const mailParams = new SendMailChangePwRequest(
            idToken,
            defaultPassword,
            user.firstName,
            user.email,
            AUTH_CHANGE_DEFAULT_PASSWORD_URL,
          );
          const mailResponse = await new Promise<boolean>((resolve) => {
            this.mailClient
              .emit(
                GET_MAIL_ON_REGISTER_RESPONSE_TOPIC,
                JSON.stringify(mailParams),
              )
              .subscribe((data) => {
                if (data) resolve(true);
                else resolve(false);
              });
          });
          if (mailResponse) {
            await this.cacheManager.set(
              idToken,
              REDIS_CHANGE_PW_SESSION,
              Number(REDIS_NEW_PW_MAIL_EXPIRE_TIME),
            ); // Expire in 1 day

            return this.generateAccessToken(user, [savedRole.id]);
          }
        }
      }
    } catch (error) {
      this.logger.error(error.message);
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
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
      throw new Error('Invalid token!');
    }
  }

  //* Check if session token is valid
  async checkSessionToken(email: string, token: string): Promise<boolean> {
    const validMail = await this.cacheManager.get(email);
    const validToken = await this.cacheManager.get(token);
    if (validMail && validToken && validMail === validToken) return true;

    return false;
  }
}
