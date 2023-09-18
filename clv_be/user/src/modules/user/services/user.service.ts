import { RegisterDTO } from '../../auth/dto';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { ActivateDto } from '../../user/dto';
import { User } from '../entities/';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../repositories';
import { EditUserDto } from '../dto/user.edit.dto';
import { ChangeDefaultPasswordDto } from '../dto/user.reset-password.dto';

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
      throw new BadRequestException(error.message);
    }
  }

  //* Search user by specific condition
  async searchUserByCondition(condition: any): Promise<User> {
    try {
      const user = await this.userRepository.findOne(condition);
      return user;
    } catch (error) {
      Logger.error(error.message);
      throw new NotFoundException(error.message);
    }
  }

  //* Get an user by Id
  async searchUserById(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findOneById(id);
      return user;
    } catch (error) {
      Logger.error(error.message);
      throw new NotFoundException(error.message);
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
        throw new Error('User not found!');
      }
    } catch (error) {
      Logger.error(error.message);
      throw new BadRequestException(error.message);
    }
  }

  //* Update user information by email
  async updateUserInformationByEmail(editUserDto: EditUserDto): Promise<void> {
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
      } else {
        throw new Error('User not found!');
      }
    } catch (error) {
      Logger.error(error.message);
      throw new BadRequestException(error.message);
    }
  }

  //* Change default password for new account registered with google
  async changeDefaultPassword(Dto: ChangeDefaultPasswordDto): Promise<void> {
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
        } else throw new Error('Wrong current password!');
      } else throw new Error('User not found!');
    } catch (error) {
      Logger.error(error.message);
      throw new BadRequestException(error.message);
    }
  }

  //* Update user password by email
  async updateUserPasswordByEmail(
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
        throw new Error('This email does not exist!');
      }
    } catch (error) {
      Logger.error(error.message);
      throw new BadRequestException(error.message);
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
        throw new Error('User not found!');
      }
    } catch (error) {
      Logger.error(error.message);
      throw new NotFoundException(error.message);
    }
  }
}
