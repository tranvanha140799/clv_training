import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';

import { Permission, Role, User } from '../entities';
import { RoleRepository, UserRepository } from '../repositories';
import { EditRoleDto } from '../dto/role.edit.dto';
import { RoleDto } from '../dto/role.new.dto';
import { EditUserRoleDto } from '../dto/user.edit-role.dto';

@Injectable()
export class RoleService {
  constructor(
    @Inject(forwardRef(() => RoleRepository))
    private readonly roleRepository: RoleRepository,
    private readonly userRepository: UserRepository,
  ) {}

  //* Get list all roles
  async getAllRole(): Promise<Role[]> {
    try {
      const listRole = await this.roleRepository.find({
        relations: ['permissions'],
        order: { createdAt: 'ASC' },
      });
      if (listRole) {
        return listRole;
      } else {
        throw new Error('No role found!');
      }
    } catch (error) {
      Logger.error(error.message);
      throw new NotFoundException(error.message);
    }
  }

  //* Create new user => assign a default role ("USER") to user
  async addRole(roleDto: Role): Promise<Role> {
    try {
      const role = await this.roleRepository.save(roleDto);
      if (role) {
        return role;
      } else {
        throw new Error('Fail to save!');
      }
    } catch (error) {
      Logger.error(error.message);
      if (error.message.includes('duplicate key')) {
        throw new ConflictException('Role is already taken!');
      }
      throw new BadRequestException(error.message);
    }
  }

  //* Create new role
  async createNewRole(roleDto: RoleDto): Promise<Role> {
    try {
      const newRoleIns = this.roleRepository.create(roleDto);
      const role = await this.roleRepository.save(newRoleIns);
      return role;
    } catch (error) {
      Logger.error(error.message);
      if (error.message.includes('duplicate key')) {
        throw new ConflictException('This role already exists!');
      }
      throw new BadRequestException(error.message);
    }
  }

  //* Search role by condition
  async searchRoleByCondition(condition: any): Promise<Role> {
    try {
      const role = await this.roleRepository.findOne(condition);
      if (role) {
        return role;
      } else {
        throw new NotFoundException('Role not found!');
      }
    } catch (error) {
      Logger.error(error.message);
      throw new NotFoundException(error.message);
    }
  }

  //* Create new permission => Add permission to multiple selected roles (from client)
  async addListRoles(rolesDto: Role[]): Promise<Role[]> {
    try {
      const roles = await this.roleRepository.save(rolesDto);
      if (roles) {
        return roles;
      } else {
        throw new Error('Fail to save!');
      }
    } catch (error) {
      Logger.error(error.message);
      if (error.message.includes('duplicate key')) {
        throw new ConflictException('Role is already taken!');
      }
      throw new BadRequestException(error.message);
    }
  }

  //* Search list role by condition
  async searchListRoleByCondition(condition: any): Promise<Role[]> {
    try {
      const roles = await this.roleRepository.findWithRelations(condition);
      if (roles) {
        return roles;
      } else {
        throw new Error('Role not found!');
      }
    } catch (error) {
      Logger.error(error.message);
      throw new NotFoundException(error.message);
    }
  }

  //* Edit role-permission => add (or remove) permission to (from) role; insert (or delete) record to (from) junction table
  async editRole(
    editRoleDto: EditRoleDto,
    targetListPermissions: Permission[],
  ): Promise<void> {
    try {
      const roleToUpdate: Role = await this.roleRepository.findOne({
        where: { name: editRoleDto.roleName },
        relations: ['permissions'],
      });

      if (!roleToUpdate) {
        throw new Error('Role not found!');
      } else {
        roleToUpdate.permissions = targetListPermissions;
        await this.roleRepository.save(roleToUpdate);
      }
    } catch (error) {
      Logger.error(error.message);
      throw new BadRequestException(error.message);
    }
  }

  //* Assign a role to user
  async editUserRole(
    editUserRoleDto: EditUserRoleDto,
    targetListRoles: Role[],
  ): Promise<void> {
    try {
      const userToUpdate: User = await this.userRepository.findOne({
        where: { email: editUserRoleDto.email },
        relations: ['roles'],
      });

      if (!userToUpdate) {
        throw new Error('User not found!');
      } else {
        userToUpdate.roles = targetListRoles;
        await this.userRepository.save(userToUpdate);
      }
    } catch (error) {
      Logger.error(error.message);
      throw new BadRequestException(error.message);
    }
  }
}
