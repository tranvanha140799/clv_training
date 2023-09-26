import {
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  forwardRef,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthResponseDTO, RegisterDTO } from '../../auth/dto';
import {
  ActivateUserDto,
  EditUserDto,
  ChangePasswordDTO,
} from '../../user/dto';
import { User } from '../entities/';
import { UserRepository } from '../repositories';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UserService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @Inject(forwardRef(() => UserRepository))
    private readonly userRepository: UserRepository,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}
  private readonly logger = new Logger('UserService');

  //* Add new user
  async addUser(userDto: RegisterDTO): Promise<User> {
    try {
      const newUser = this.userRepository.create(userDto);
      const user = await this.userRepository.save(newUser);

      return user;
    } catch (error) {
      this.logger.error(error.message);
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  }

  //* Search user by specific condition
  async searchUserByCondition(condition: any): Promise<User> {
    try {
      const user = await this.userRepository.findOne(condition);
      return user;
    } catch (error) {
      this.logger.error(error.message);
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: error.message,
      });
    }
  }

  //* Get an user by Id
  async searchUserById(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findOneById(id);
      return user;
    } catch (error) {
      this.logger.error(error.message);
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: error.message,
      });
    }
  }

  //* Update user status by email
  async updateUserStatusByEmail(activateDto: ActivateUserDto) {
    try {
      const user = await this.searchUserByCondition({
        where: { email: activateDto.email },
      });
      if (user) {
        await this.userRepository
          .createQueryBuilder()
          .update(User)
          .set({
            isDisable: !user.isDisable,
            isPending: !user.isPending,
          })
          .where('id = :id', { id: user.id })
          .execute();

        return { status: HttpStatus.OK, message: 'Done!' };
      } else
        throw new RpcException({
          status: HttpStatus.NOT_FOUND,
          message: 'User not found!',
        });
    } catch (error) {
      this.logger.error(error.message);
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  }

  //* Update user information by email
  async updateUserInformationByEmail(editUserDto: EditUserDto) {
    try {
      const user = await this.searchUserByCondition({
        where: { email: editUserDto.email },
      });
      if (user) {
        await this.userRepository
          .createQueryBuilder()
          .update(User)
          .set({
            firstName: editUserDto.firstName,
            lastName: editUserDto.lastName,
            globalId: editUserDto.globalId,
            officeCode: editUserDto.officeCode,
            country: editUserDto.country,
          })
          .where('id = :id', { id: user.id })
          .execute();

        return { status: HttpStatus.OK, message: 'Done!' };
      } else {
        throw new RpcException({
          status: HttpStatus.NOT_FOUND,
          message: 'User not found!',
        });
      }
    } catch (error) {
      this.logger.error(error.message);
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  }

  //* Change password (also used for new account registered with google)
  async changePassword(Dto: ChangePasswordDTO) {
    try {
      const user = await this.searchUserByCondition({
        where: { email: Dto.email },
      });
      // Verify password
      if (user) {
        // Check current password from dto and user in database
        const isVerified = await bcrypt.compare(
          Dto.currentPassword,
          user.password,
        );
        if (isVerified) {
          // Hash password from dto
          const newPassword = bcrypt.hashSync(
            Dto.newPassword,
            bcrypt.genSaltSync(),
          );
          // And then save new password
          await this.userRepository
            .createQueryBuilder()
            .update(User)
            .set({ password: newPassword })
            .where('id = :id', { id: user.id })
            .execute();

          return { status: HttpStatus.OK, message: 'Done!' };
        } else
          throw new RpcException({
            status: HttpStatus.BAD_REQUEST,
            message: 'Wrong current password!',
          });
      } else
        throw new RpcException({
          status: HttpStatus.NOT_FOUND,
          message: 'User not found!',
        });
    } catch (error) {
      this.logger.error(error.message);
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  }

  //* Change password when user forgot current password
  async resetPassword(
    userEmail: string,
    newPassword: string,
  ): Promise<AuthResponseDTO> {
    try {
      const user = await this.searchUserByCondition({
        where: { email: userEmail },
      });
      if (user) {
        const newBcryptPassword = bcrypt.hashSync(
          newPassword,
          bcrypt.genSaltSync(),
        );
        await this.userRepository
          .createQueryBuilder()
          .update(User)
          .set({ password: newBcryptPassword })
          .where('id = :id', { id: user.id })
          .execute();

        await this.cacheManager.del(userEmail);
        return this.authService.loginUser({
          email: userEmail,
          password: newPassword,
        });
      } else
        throw new RpcException({
          status: HttpStatus.BAD_REQUEST,
          message: 'This email does not exist!',
        });
    } catch (error) {
      this.logger.error(error.message);
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: 'User not found!',
      });
    }
  }

  //* Get list all users
  async getAllUsers(): Promise<User[]> {
    try {
      const listUser = await this.userRepository.find({
        order: { createdAt: 'ASC' },
      });
      if (listUser) {
        return listUser;
      } else {
        throw new RpcException({
          status: HttpStatus.NOT_FOUND,
          message: 'User not found!',
        });
      }
    } catch (error) {
      this.logger.error(error.message);
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: error.message,
      });
    }
  }
}
