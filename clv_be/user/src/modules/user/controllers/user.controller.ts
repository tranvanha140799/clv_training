import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  OnApplicationShutdown,
  OnModuleInit,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ActivateDto, PermissionDto } from '../dto';
import { EditPermissionDto } from '../dto/permission.edit.dto';
import { PermissionService, RoleService, UserService } from '../services';
import { In } from 'typeorm';
import { User, Permission, Role } from '../entities';
import { AuthReq } from 'src/common/common.types';
import {
  AuthenticationGuard,
  AuthorizationGuard,
} from 'src/modules/auth/guards';
import { HasPermission } from 'src/decorators';
import {
  ACTIVATE_USER,
  ADD_PERMISSION,
  GET_ALL_USER,
} from 'src/common/migration.permission';
import {
  ADD_ROLE,
  ASSIGN_ROLE_TO_USER,
  GET_ALL_PERMISSIONS,
  GET_ALL_ROLES,
  UPDATE_PERMISSION_ROLE,
  UPDATE_ROLE_PERMISSION,
} from 'src/common/app.user-permission';
import { EditUserDto } from '../dto/user.edit.dto';
import { EditRoleDto } from '../dto/role.edit.dto';
import { RoleDto } from '../dto/role.new.dto';
import { EditUserRoleDto } from '../dto/user.edit-role.dto';
import { ClientKafka } from '@nestjs/microservices';
import {
  GET_MAILING_ON_SIGNUP_RESPONSE_TOPIC,
  // GET_MAILING_RESET_PW_RESPONSE_TOPIC,
  NOTIFICATION_SERVICE,
} from 'src/common/app.constants';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
// import { MessagePattern } from '@nestjs/microservices';
// import { GET_USER_PROFILE } from 'src/common/app.message-pattern';

@Controller('user')
export class UserController implements OnModuleInit, OnApplicationShutdown {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    @Inject(NOTIFICATION_SERVICE) private readonly mailingClient: ClientKafka,
    private readonly userService: UserService,
    private readonly permissionService: PermissionService,
    private readonly roleService: RoleService,
  ) {}

  //* Get user information by Id
  // @MessagePattern(GET_USER_PROFILE)
  @UseGuards(AuthenticationGuard)
  @Get('profile')
  getUserById(@Req() request: AuthReq): Promise<User> {
    return this.userService.searchUserById(request.user.id);
  }

  //* Activate user by email
  @HttpCode(202)
  @HasPermission(ACTIVATE_USER)
  @UseGuards(AuthorizationGuard)
  @UseGuards(AuthenticationGuard)
  @Put('activate')
  activateUserByEmail(@Body() activateDto: ActivateDto): Promise<void> {
    return this.userService.updateUserStatusByEmail(activateDto);
  }

  //* Edit user information by email
  @HttpCode(202)
  @UseGuards(AuthenticationGuard)
  @Put('edit')
  editUserByEmail(@Body() editUserDto: EditUserDto): Promise<void> {
    return this.userService.updateUserInformationByEmail(editUserDto);
  }

  //* Edit user role by email
  @HttpCode(202)
  @HasPermission(ASSIGN_ROLE_TO_USER)
  @UseGuards(AuthorizationGuard)
  @UseGuards(AuthenticationGuard)
  @Put('role')
  async editUserRoleByEmail(
    @Body() editUserRoleDto: EditUserRoleDto,
  ): Promise<void> {
    // Check if rolesName does exist role (rolesName must contains at least 1 roleName "MASTER")
    if (!editUserRoleDto.rolesName.length) {
      throw new BadRequestException('Roles must not be empty!');
    }
    const targetListRoles = await this.roleService.searchListRoleByCondition({
      where: { name: In(editUserRoleDto.rolesName) },
    });
    // Then edit user
    if (targetListRoles.length) {
      return await this.roleService.editUserRole(
        editUserRoleDto,
        targetListRoles,
      );
    } else {
      throw new BadRequestException('No role found!');
    }
  }

  //* Get list all users
  @HasPermission(GET_ALL_USER)
  @UseGuards(AuthorizationGuard)
  @UseGuards(AuthenticationGuard)
  @Get('list')
  getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  //* Create new permission
  @HasPermission(ADD_PERMISSION)
  @UseGuards(AuthorizationGuard)
  @UseGuards(AuthenticationGuard)
  @Post('new-permission')
  async createPermission(@Body() permissionDto: PermissionDto): Promise<void> {
    // Check if role does exist
    const roles = await this.roleService.searchListRoleByCondition({
      where: { name: In(permissionDto.rolesName) },
      relations: ['permissions'],
    });
    // Then create new permission
    const permission =
      await this.permissionService.addPermission(permissionDto);
    // Update relationship between Role and Permission
    if (roles && permission) {
      roles.map((role) => role.permissions.push(permission));
      await this.roleService.addListRoles(roles);
    }
  }

  //* Create new role
  @HasPermission(ADD_ROLE)
  @UseGuards(AuthorizationGuard)
  @UseGuards(AuthenticationGuard)
  @Post('new-role')
  async createRole(@Body() roleDto: RoleDto): Promise<void> {
    const permissions = [];
    // If user assign role with permission(s)
    if (roleDto.permissionsName.length) {
      // Check if permission does exist
      permissions.push(
        ...(await this.permissionService.searchListPermissionByCondition({
          where: { name: In(roleDto.permissionsName) },
          relations: ['roles'],
        })),
      );
    }
    // Then create new role
    const role = await this.roleService.createNewRole(roleDto);
    // Update relationship between Role and Permission (if roleDto.permissionsName.length)
    if (permissions.length && role) {
      permissions.map((permission) => permission.roles.push(role));
      await this.permissionService.addListPermissions(permissions);
    }
  }

  //* Get list all roles
  @HasPermission(GET_ALL_ROLES)
  @UseGuards(AuthorizationGuard)
  @UseGuards(AuthenticationGuard)
  @Get('list-role')
  getListRole(): Promise<Role[]> {
    return this.roleService.getAllRole();
  }

  //* Get list all permissions
  @HasPermission(GET_ALL_PERMISSIONS)
  @UseGuards(AuthorizationGuard)
  @UseGuards(AuthenticationGuard)
  @Get('list-permission')
  getListPermission(): Promise<Permission[]> {
    return this.permissionService.getAllPermission();
  }

  //* Change permission -> role relation
  @HasPermission(UPDATE_PERMISSION_ROLE)
  @UseGuards(AuthorizationGuard)
  @UseGuards(AuthenticationGuard)
  @Put('edit-permission-role')
  async changePermissionRole(
    @Body() editPermissionDto: EditPermissionDto,
  ): Promise<void> {
    // Check if rolesName does exist role (rolesName must contains at least 1 roleName "MASTER")
    if (!editPermissionDto.rolesName.length) {
      throw new BadRequestException('Roles must not be empty!');
    }
    const targetListRoles = await this.roleService.searchListRoleByCondition({
      where: { name: In(editPermissionDto.rolesName) },
    });
    // Then edit permission
    if (targetListRoles.length) {
      return await this.permissionService.editPermission(
        editPermissionDto,
        targetListRoles,
      );
    } else {
      throw new BadRequestException('No role found!');
    }
  }

  //* Change role -> permission relation
  @HasPermission(UPDATE_ROLE_PERMISSION)
  @UseGuards(AuthorizationGuard)
  @UseGuards(AuthenticationGuard)
  @Put('edit-role-permission')
  async changeRolePermission(@Body() editRoleDto: EditRoleDto): Promise<void> {
    // Check if permissionsName does exist permission (permissionsName must contains at least 1 permissionName "MASTER")
    // if (!editRoleDto.rolesName.length) {
    //   throw new BadRequestException('Roles must not be empty!');
    // }
    const targetListPermissions =
      await this.permissionService.searchListPermissionByCondition({
        where: { name: In(editRoleDto.permissionsName) },
      });
    // Then edit permission
    if (targetListPermissions.length) {
      return await this.roleService.editRole(
        editRoleDto,
        targetListPermissions,
      );
    } else {
      throw new BadRequestException('No role found!');
    }
  }

  async onModuleInit() {
    const requestPatterns: string[] = [GET_MAILING_ON_SIGNUP_RESPONSE_TOPIC];

    requestPatterns.forEach((topic: string) =>
      this.mailingClient.subscribeToResponseOf(topic),
    );

    await this.mailingClient.connect();
  }

  async onApplicationShutdown() {
    await this.mailingClient.close();
  }
}
