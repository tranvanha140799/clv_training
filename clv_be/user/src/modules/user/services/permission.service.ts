import {
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  forwardRef,
} from '@nestjs/common';
import { Permission, Role } from '../entities';
import { PermissionRepository } from '../repositories';
import { EditPermissionDto, PermissionDto } from '../dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class PermissionService {
  constructor(
    @Inject(forwardRef(() => PermissionRepository))
    private readonly permissionRepository: PermissionRepository,
  ) {}
  private readonly logger = new Logger('PermissionService');

  //* Get list all permissions
  async getAllPermission(): Promise<Permission[]> {
    try {
      const listPermission = await this.permissionRepository.find({
        relations: ['roles'],
        order: { createdAt: 'ASC' },
      });
      if (listPermission) return listPermission;
      else
        throw new RpcException({
          status: HttpStatus.NOT_FOUND,
          message: 'No permission found!',
        });
    } catch (error) {
      this.logger.error(error.message);
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: error.message,
      });
    }
  }

  //* Create new permission
  async addPermission(permissionDto: PermissionDto): Promise<Permission> {
    try {
      const newPermissionIns = this.permissionRepository.create(permissionDto);
      const permission = await this.permissionRepository.save(newPermissionIns);
      return permission;
    } catch (error) {
      this.logger.error(error.message);
      if (error.message.includes('duplicate key')) {
        throw new RpcException({
          status: HttpStatus.CONFLICT,
          message: 'This permission already exists!',
        });
      }
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  }

  //* Edit permission-role => add (or remove) permission to (from) role; insert (or delete) record to (from) junction table
  async editPermission(
    editPermissionDto: EditPermissionDto,
    targetListRoles: Role[],
  ) {
    try {
      const permissionToUpdate: Permission =
        await this.permissionRepository.findOne({
          where: {
            name: editPermissionDto.permissionName,
          },
          relations: ['roles'],
        });

      if (!permissionToUpdate) {
        throw new RpcException({
          status: HttpStatus.NOT_FOUND,
          message: 'Permission not found!',
        });
      } else {
        permissionToUpdate.roles = targetListRoles;
        await this.permissionRepository.save(permissionToUpdate);

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

  //* Search list permission by condition
  async searchListPermissionByCondition(condition: any): Promise<Permission[]> {
    try {
      const permissions =
        await this.permissionRepository.findWithRelations(condition);
      if (permissions) {
        return permissions;
      } else {
        throw new RpcException({
          status: HttpStatus.NOT_FOUND,
          message: 'Permission not found!',
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

  //* Create new role => Add multiple selected permissions to role (from client)
  async addListPermissions(
    permissionsDto: Permission[],
  ): Promise<Permission[]> {
    try {
      const permissions = await this.permissionRepository.save(permissionsDto);
      if (permissions) {
        return permissions;
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
          message: 'Permission is already taken!',
        });
      }
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  }
}
