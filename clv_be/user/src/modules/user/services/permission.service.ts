import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { Permission, Role } from '../entities';
import { PermissionRepository } from '../repositories';
import { EditPermissionDto, PermissionDto } from '../dto';

@Injectable()
export class PermissionService {
  constructor(
    @Inject(forwardRef(() => PermissionRepository))
    private readonly permissionRepository: PermissionRepository,
  ) {}

  //* Get list all permissions
  async getAllPermission(): Promise<Permission[]> {
    try {
      const listPermission = await this.permissionRepository.find({
        relations: ['roles'],
        order: { createdAt: 'ASC' },
      });
      if (listPermission) {
        return listPermission;
      } else {
        throw new Error('No permission found!');
      }
    } catch (error) {
      Logger.error(error.message);
      throw new NotFoundException(error.message);
    }
  }

  //* Create new permission
  async addPermission(permissionDto: PermissionDto): Promise<Permission> {
    try {
      const newPermissionIns = this.permissionRepository.create(permissionDto);
      const permission = await this.permissionRepository.save(newPermissionIns);
      return permission;
    } catch (error) {
      Logger.error(error.message);
      if (error.message.includes('duplicate key')) {
        throw new ConflictException('This permission already exists!');
      }
      throw new BadRequestException(error.message);
    }
  }

  //* Edit permission-role => add (or remove) permission to (from) role; insert (or delete) record to (from) junction table
  async editPermission(
    editPermissionDto: EditPermissionDto,
    targetListRoles: Role[],
  ): Promise<void> {
    try {
      const permissionToUpdate: Permission =
        await this.permissionRepository.findOne({
          where: {
            name: editPermissionDto.permissionName,
          },
          relations: ['roles'],
        });

      if (!permissionToUpdate) {
        throw new Error('Permission not found!');
      } else {
        permissionToUpdate.roles = targetListRoles;
        await this.permissionRepository.save(permissionToUpdate);
      }
    } catch (error) {
      Logger.error(error.message);
      throw new BadRequestException(error.message);
    }
  }

  //* Search list permission by condition
  async searchListPermissionByCondition(condition: any): Promise<Permission[]> {
    try {
      const permissions =
        await this.permissionRepository.findWithRelations(condition);
      if (permissions) {
        return permissions;
      } else {
        throw new Error('Permission not found!');
      }
    } catch (error) {
      Logger.error(error.message);
      throw new NotFoundException(error.message);
    }
  }

  //* Create new role => Add multiple selected permissions to role (from client)
  async addListPermissions(
    permissionsDto: Permission[],
  ): Promise<Permission[]> {
    try {
      const permissions = await this.permissionRepository.save(permissionsDto);
      if (permissions) {
        return permissions;
      } else {
        throw new Error('Fail to save!');
      }
    } catch (error) {
      Logger.error(error.message);
      if (error.message.includes('duplicate key')) {
        throw new ConflictException('Permission is already taken!');
      }
      throw new BadRequestException(error.message);
    }
  }
}
