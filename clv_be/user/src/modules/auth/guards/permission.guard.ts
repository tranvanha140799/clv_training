import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { In } from 'typeorm';
import { Role } from '../../user/entities';
import { RoleService } from '../../user/services';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly roleService: RoleService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const fromRequestPermissions = this.reflector.get<string[]>(
      'PERMISSIONS',
      context.getHandler(),
    );
    // console.log(
    //   '🚀 -> file: permission.guard.ts:26 -> AuthorizationGuard -> canActivate -> fromRequestPermissions:',
    //   fromRequestPermissions,
    // );
    if (!fromRequestPermissions) return false;

    try {
      const request = context.switchToHttp().getRequest();
      // console.log(
      //   '🚀 -> file: permission.guard.ts:34 -> AuthorizationGuard -> canActivate -> request.user:',
      //   request.user,
      // );
      const userPermissions: string[] =
        await this.searchListPermissionNameByRoleId(request.user.roleIds);
      return this.hasPermission(userPermissions, fromRequestPermissions);
    } catch (error) {
      // console.log('HERE!!!');
      Logger.error(error.message);
      throw new ForbiddenException(error.message);
    }
  }

  //* Check target permission and user permission if match
  hasPermission(
    fromDbPermissions: string[],
    fromRequestPermissions: string[],
  ): boolean {
    const hasPermission = fromRequestPermissions.every((permission) =>
      fromDbPermissions.includes(permission),
    );
    // console.log(
    //   '🚀 -> file: permission.guard.ts:47 -> AuthorizationGuard -> fromRequestPermissions:',
    //   fromRequestPermissions,
    // );
    // console.log(
    //   '🚀 -> file: permission.guard.ts:46 -> AuthorizationGuard -> fromDbPermissions:',
    //   fromDbPermissions,
    // );
    if (hasPermission) return true;

    throw new ForbiddenException('Forbidden', "You don't have permission!");
  }

  //* Search list permission name by role Id
  async searchListPermissionNameByRoleId(ids: string[]): Promise<string[]> {
    const roles: Role[] = await this.roleService.searchListRoleByCondition({
      where: { id: In(ids) },
      relations: ['permissions'],
    });

    return roles.flatMap((role) =>
      role.permissions.map((permission) => permission.name),
    );
  }
}
