import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthResponseDTO, LoginDTO, RegisterDTO } from '../dto';
import { User } from '../../user/entities';
import { RoleService, UserService } from '../../user/services';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly jwtService: JwtService,
  ) {}

  //* Test service for GET method (will be deleted later)
  async getAllUsers(): Promise<User[]> {
    console.log(await this.userService.getAllUsers());
    return this.userService.getAllUsers();
  }

  //* Register new user
  async registerUser(userDto: RegisterDTO): Promise<AuthResponseDTO> {
    try {
      // Create new user
      const user = await this.userService.addUser(userDto);
      // Get role
      const role = await this.roleService.searchRoleByCondition({
        where: { name: 'USER' },
        relations: ['users'],
      });
      role.users.push(user);
      // Insert to junction table
      const savedRole = await this.roleService.addRole(role);
      // Return JWT if success
      return this.generateAccessToken(user, [savedRole.id]);
    } catch (error) {
      Logger.error(error.message);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
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
        throw new Error('Email does not exist');
      }
      // Verify password
      const isVerified = await bcrypt.compare(userDto.password, user.password);
      if (isVerified) {
        const roleIdList = user.roles.map((role) => {
          return role.id;
        });
        // Return JWT when succeed
        return this.generateAccessToken(user, roleIdList);
      } else {
        throw new BadRequestException('Wrong password');
      }
    } catch (error) {
      Logger.error(error.message);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  //* Generate access token when successfully registered/logged in
  generateAccessToken(user: User, roleIdList: string[]): AuthResponseDTO {
    const response: AuthResponseDTO = new AuthResponseDTO();
    response.accessToken = this.jwtService.sign({
      id: user.id,
      email: user.email,
      roleIds: roleIdList,
    });

    return response;
  }

  //* Decode token & get user information
  verifyAccessToken(accessToken: string) {
    try {
      return this.jwtService.verify(accessToken);
    } catch (error) {
      console.log(
        '🚀 -> file: auth.service.ts:92 -> AuthService -> verifyAccessToken -> error:',
        error,
      );
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
        throw new HttpException('Token has expired', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      Logger.error(error.message);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
