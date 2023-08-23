import { RegisterDTO } from '../../auth/dto';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  forwardRef,
} from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
import { ActivateDto, ResetPwDto } from '../../user/dto';
import { User } from '../entities/';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../repositories';

@Injectable()
export class UserService {
  constructor(
    @Inject(forwardRef(() => UserRepository))
    private readonly userRepository: UserRepository,
  ) {}

  //* Add new user
  async addUser(userDto: RegisterDTO): Promise<User> {
    try {
      const newUser = this.userRepository.create(userDto);
      const user = await this.userRepository.save(newUser);

      return user;
    } catch (error) {
      Logger.error(error.message);
      if (error.message.includes('duplicate key')) {
        throw new HttpException('Email is already taken', HttpStatus.CONFLICT);
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  //* Search user by specific condition
  async searchUserByCondition(condition: any): Promise<User> {
    try {
      const user = await this.userRepository.findOne(condition);
      return user;
    } catch (error) {
      Logger.error(error.message);
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  //* Get an user by Id
  async searchUserById(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findOneById(id);
      return user;
    } catch (error) {
      Logger.error(error.message);
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  //* Update user status by email
  async updateUserStatusByEmail(activateDto: ActivateDto): Promise<void> {
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
      } else {
        throw new Error('user not found');
      }
    } catch (error) {
      Logger.error(error.message);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  //* Update user password by email
  async updateUserPwByEmail(
    userEmail: string,
    temporaryPw: string,
  ): Promise<User> {
    try {
      const user = await this.searchUserByCondition({
        where: { email: userEmail },
      });
      if (user) {
        temporaryPw = bcrypt.hashSync(temporaryPw, bcrypt.genSaltSync());
        await this.userRepository
          .createQueryBuilder()
          .update(User)
          .set({
            password: temporaryPw,
          })
          .where('id = :id', { id: user.id })
          .execute();
        return user;
      } else {
        throw new Error('This email does not exist');
      }
    } catch (error) {
      Logger.error(error.message);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  //* Reset user password
  async resetPw(resetPwDto: ResetPwDto): Promise<void> {
    try {
      const user = await this.searchUserByCondition({
        where: { email: resetPwDto.email },
      });
      // Verify password
      if (user) {
        //check current password from dto and user in db
        const isVerified = await bcrypt.compare(
          resetPwDto.currentPassword,
          user.password,
        );
        if (isVerified) {
          // hash password from dto
          const newPw = bcrypt.hashSync(
            resetPwDto.newPassword,
            bcrypt.genSaltSync(),
          );
          // and then save new password
          await this.userRepository
            .createQueryBuilder()
            .update(User)
            .set({
              password: newPw,
            })
            .where('id = :id', { id: user.id })
            .execute();
        } else {
          throw new Error('wrong current password');
        }
      } else {
        throw new Error('user not found');
      }
    } catch (error) {
      Logger.error(error.message);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  //* Get list all users
  async getAllUsers(): Promise<User[]> {
    try {
      const listUser = await this.userRepository.find({
        order: {
          createdAt: 'ASC',
        },
      });
      if (listUser) {
        return listUser;
      } else {
        throw new Error('user not found');
      }
    } catch (error) {
      Logger.error(error.message);
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}
