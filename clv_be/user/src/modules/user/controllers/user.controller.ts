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
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import {
  ActivateUserDto,
  PermissionDto,
  EditPermissionDto,
  EditUserDto,
  EditRoleDto,
  RoleDto,
  EditUserRoleDto,
  ChangePasswordDTO,
  ResetPasswordDTO,
  ForgotPasswordDTO,
} from '../dto';
import { PermissionService, RoleService, UserService } from '../services';
import { In } from 'typeorm';
import { User, Permission, Role } from '../entities';
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
  RESET_PASSWORD,
  UPDATE_PERMISSION_ROLE,
  UPDATE_ROLE_PERMISSION,
} from 'src/common/app.user-permission';
import {
  ClientKafka,
  MessagePattern,
  RpcException,
  Transport,
} from '@nestjs/microservices';
import {
  GET_MAIL_FORGOT_PW_RESPONSE_TOPIC,
  NOTIFICATION_SERVICE,
  REDIS_FORGOT_PW_SESSION,
} from 'src/common/app.constants';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import {
  AuthResponseDTO,
  SendEmailForgotPwResponseDTO,
  SendMailResetPwLinkRequest,
} from 'src/modules/auth/dto';
import { getRandomToken } from 'src/utils';
import {
  AUTH_FORGOT_PASSWORD_URL,
  REDIS_FORGOT_PW_MAIL_EXPIRE_TIME,
} from 'src/common/env';
import {
  GET_USER_PROFILE,
  SEARCH_USER_BY_CONDITION,
} from 'src/common/app.message-pattern';
import { RPCExceptionFilter } from 'src/utils/rpc-exception.filter';
import { AuthReq } from 'src/common/common.types';

@Controller('user')
@UseFilters(new RPCExceptionFilter())
export class UserController implements OnModuleInit, OnApplicationShutdown {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @Inject(NOTIFICATION_SERVICE) private readonly mailClient: ClientKafka,
    private readonly userService: UserService,
    private readonly permissionService: PermissionService,
    private readonly roleService: RoleService,
  ) {}

  @MessagePattern({ cmd: 'ping' }, Transport.TCP)
  ping(): Promise<boolean> {
    console.log('USER PING PONG!');

    throw new RpcException({
      status: 401,
      message: 'Unauthorized!',
    });

    // return of('pong').pipe(delay(2000));
  }

  //* Get user information by Id
  // @UseGuards(AuthenticationGuard)
  @MessagePattern({ cmd: GET_USER_PROFILE }, Transport.TCP)
  async getUserById(@Req() request: AuthReq): Promise<User> {
    console.log(request.header);
    return await this.userService.searchUserById(request.user.id);
  }

  //* Activate user by email
  @HttpCode(202)
  @HasPermission(ACTIVATE_USER)
  @UseGuards(AuthorizationGuard)
  @UseGuards(AuthenticationGuard)
  @Put('activate')
  activateUserByEmail(@Body() activateDto: ActivateUserDto): Promise<void> {
    return this.userService.updateUserStatusByEmail(activateDto);
  }

  //* Edit user information by email
  @HttpCode(202)
  @UseGuards(AuthenticationGuard)
  @Put('edit')
  editUserByEmail(@Body() editUserDto: EditUserDto): Promise<void> {
    return this.userService.updateUserInformationByEmail(editUserDto);
  }

  //* Change password (also use for new account registered with Google)
  @HttpCode(202)
  @HasPermission(RESET_PASSWORD)
  @UseGuards(AuthenticationGuard)
  @Put('change-password')
  changePassword(@Body() changePasswordDTO: ChangePasswordDTO): Promise<void> {
    return this.userService.changePassword(changePasswordDTO);
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body() forgotPasswordDTO: ForgotPasswordDTO,
  ): Promise<SendEmailForgotPwResponseDTO> {
    try {
      const idToken = getRandomToken();
      const user = await this.userService.searchUserByCondition({
        where: { email: forgotPasswordDTO.email },
      });
      if (user) {
        const mailParams = new SendMailResetPwLinkRequest(
          idToken,
          user.firstName,
          user.email,
          AUTH_FORGOT_PASSWORD_URL,
        );

        const mailResponse: boolean = await new Promise<boolean>((resolve) => {
          this.mailClient
            .emit(GET_MAIL_FORGOT_PW_RESPONSE_TOPIC, JSON.stringify(mailParams))
            .subscribe((data) => {
              if (data) resolve(true);
              else resolve(false);
            });
        });

        if (mailResponse) {
          await this.cacheManager.set(
            forgotPasswordDTO.email,
            REDIS_FORGOT_PW_SESSION,
            Number(REDIS_FORGOT_PW_MAIL_EXPIRE_TIME),
          ); // Expire in 15 minutes
          await this.cacheManager.set(
            idToken,
            REDIS_FORGOT_PW_SESSION,
            Number(REDIS_FORGOT_PW_MAIL_EXPIRE_TIME),
          ); // Expire in 15 minutes
          const res: SendEmailForgotPwResponseDTO =
            new SendEmailForgotPwResponseDTO();
          res.message = 'We just sent you an email to reset your password.';
          return res;
        }
      } else throw Error('No user found with the provided email!');
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  //* Reset user password when user forgot current password
  @Post('reset-password')
  resetPassword(
    @Body() resetPasswordDTO: ResetPasswordDTO,
  ): Promise<AuthResponseDTO> {
    return this.userService.resetPassword(
      resetPasswordDTO.email,
      resetPasswordDTO.newPassword,
    );
  }

  @MessagePattern(SEARCH_USER_BY_CONDITION)
  searchUserByCondition(@Body() condition: any): Promise<User> {
    return this.userService.searchUserByCondition(condition);
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
  // @HasPermission(GET_ALL_USER)
  // @UseGuards(AuthorizationGuard)
  // @UseGuards(AuthenticationGuard)
  // @Get('list')
  @MessagePattern({ cmd: GET_ALL_USER }, Transport.TCP)
  async getAllUsers(): Promise<User[]> {
    return await this.userService.getAllUsers();
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
    const requestPatterns: string[] = [GET_MAIL_FORGOT_PW_RESPONSE_TOPIC];

    requestPatterns.forEach((topic: string) =>
      this.mailClient.subscribeToResponseOf(topic),
    );

    await this.mailClient.connect();
  }

  async onApplicationShutdown() {
    await this.mailClient.close();
  }
}
