import {
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  forwardRef,
} from '@nestjs/common';

import { Permission, Role, User } from '../entities';
import { RoleRepository, UserRepository } from '../repositories';
import { EditRoleDto } from '../dto/role.edit.dto';
import { RoleDto } from '../dto/role.new.dto';
import { EditUserRoleDto } from '../dto/user.edit-role.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class RoleService {
  constructor(
    @Inject(forwardRef(() => RoleRepository))
    private readonly roleRepository: RoleRepository,
    private readonly userRepository: UserRepository,
  ) {}
  private readonly logger = new Logger('RoleService');

  //* Get list all roles
  async getAllRole(): Promise<Role[]> {
    try {
      const listRole = await this.roleRepository.find({
        relations: ['permissions'],
        order: { createdAt: 'ASC' },
      });
      if (listRole) {
        return listRole;
      } else
        throw new RpcException({
          status: HttpStatus.NOT_FOUND,
          message: 'No role found!',
        });
    } catch (error) {
      this.logger.error(error.message);
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: error.message,
      });
    }
  }

  //* Create new user => assign a default role ("USER") to user
  async addRole(roleDto: Role): Promise<Role> {
    try {
      const role = await this.roleRepository.save(roleDto);
      if (role) {
        return role;
      } else {
        throw new RpcException({
          status: HttpStatus.BAD_REQUEST,
          message: 'Fail to save!',
        });
      }
    } catch (error) {
      this.logger.error(error.message);
      if (error.message.includes('duplicate key')) {
        throw new RpcException({
          status: HttpStatus.CONFLICT,
          message: 'Role is already taken!',
        });
      }
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  }

  //* Create new role
  async createNewRole(roleDto: RoleDto): Promise<Role> {
    try {
      const newRoleIns = this.roleRepository.create(roleDto);
      const role = await this.roleRepository.save(newRoleIns);
      return role;
    } catch (error) {
      this.logger.error(error.message);
      if (error.message.includes('duplicate key')) {
        throw new RpcException({
          status: HttpStatus.CONFLICT,
          message: 'This role already exists!',
        });
      }
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  }

  //* Search role by condition
  async searchRoleByCondition(condition: any): Promise<Role> {
    try {
      const role = await this.roleRepository.findOne(condition);
      if (role) return role;
      else {
        throw new RpcException({
          status: HttpStatus.NOT_FOUND,
          message: 'Role not found!',
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

  //* Create new permission => Add permission to multiple selected roles (from client)
  async addListRoles(rolesDto: Role[]): Promise<Role[]> {
    try {
      const roles = await this.roleRepository.save(rolesDto);
      if (roles) return roles;
      else
        throw new RpcException({
          status: HttpStatus.BAD_REQUEST,
          message: 'Failed to save!',
        });
    } catch (error) {
      this.logger.error(error.message);
      if (error.message.includes('duplicate key')) {
        throw new RpcException({
          status: HttpStatus.CONFLICT,
          message: 'Role is already taken!',
        });
      }
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  }

  //* Search list role by condition
  async searchListRoleByCondition(condition: any): Promise<Role[]> {
    try {
      const roles = await this.roleRepository.findWithRelations(condition);
      if (roles) return roles;
      else {
        throw new RpcException({
          status: HttpStatus.NOT_FOUND,
          message: 'Role not found!',
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

  //* Edit role-permission => add (or remove) permission to (from) role; insert (or delete) record to (from) junction table
  async editRole(
    editRoleDto: EditRoleDto,
    targetListPermissions: Permission[],
  ) {
    try {
      const roleToUpdate: Role = await this.roleRepository.findOne({
        where: { name: editRoleDto.roleName },
        relations: ['permissions'],
      });

      if (!roleToUpdate) {
        throw new RpcException({
          status: HttpStatus.NOT_FOUND,
          message: 'Role not found!',
        });
      } else {
        roleToUpdate.permissions = targetListPermissions;
        await this.roleRepository.save(roleToUpdate);

        return { status: HttpStatus.OK, message: 'Done!' };
      }
    } catch (error) {
      this.logger.error(error.message);
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  }

  //* Assign a role to user
  async editUserRole(
    editUserRoleDto: EditUserRoleDto,
    targetListRoles: Role[],
  ) {
    try {
      const userToUpdate: User = await this.userRepository.findOne({
        where: { email: editUserRoleDto.email },
        relations: ['roles'],
      });

      if (!userToUpdate) {
        throw new RpcException({
          status: HttpStatus.NOT_FOUND,
          message: 'User not found!',
        });
      } else {
        userToUpdate.roles = targetListRoles;
        await this.userRepository.save(userToUpdate);

        return { status: HttpStatus.OK, message: 'Done!' };
      }
    } catch (error) {
      this.logger.error(error.message);
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  }
}
