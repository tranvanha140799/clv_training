import {
  Body,
  Controller,
  HttpStatus,
  Inject,
  OnApplicationShutdown,
  OnModuleInit,
  UseFilters,
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
import { ACTIVATE_USER, GET_ALL_USER } from 'src/common/migration.permission';
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
  CHANGE_PASSWORD,
  CHANGE_PERMISSION_ROLE,
  CHANGE_ROLE_PERMISSION,
  CHANGE_USER_ROLE,
  CREATE_PERMISSION,
  CREATE_ROLE,
  FORGOT_PASSWORD,
  GET_PERMISSIONS,
  GET_ROLES,
  GET_USER_PROFILE,
  SEARCH_ROLE_BY_CONDITION,
  SEARCH_USER_BY_CONDITION,
  UPDATE_USER_INFO,
} from 'src/common/app.message-pattern';
import { RPCExceptionFilter } from 'src/utils/rpc-exception.filter';
import { RESET_PASSWORD } from 'src/common/app.user-permission';

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
    throw new RpcException({
      status: HttpStatus.UNAUTHORIZED,
      message: 'Unauthorized!',
    });

    // return of('pong').pipe(delay(2000));
  }

  //* Get user information by Id
  @MessagePattern({ cmd: GET_USER_PROFILE }, Transport.TCP)
  async getUserById({ userId }: { userId: string }): Promise<User> {
    return await this.userService.searchUserById(userId);
  }

  //* Activate user by email
  @MessagePattern({ cmd: ACTIVATE_USER }, Transport.TCP)
  activateUserByEmail(@Body() activateDto: ActivateUserDto) {
    return this.userService.updateUserStatusByEmail(activateDto);
  }

  //* Edit user information by email
  @MessagePattern({ cmd: UPDATE_USER_INFO }, Transport.TCP)
  editUserByEmail(@Body() editUserDto: EditUserDto) {
    return this.userService.updateUserInformationByEmail(editUserDto);
  }

  //* Change password (also use for new account registered with Google)
  @MessagePattern({ cmd: CHANGE_PASSWORD }, Transport.TCP)
  changePassword(@Body() changePasswordDTO: ChangePasswordDTO) {
    return this.userService.changePassword(changePasswordDTO);
  }

  @MessagePattern({ cmd: FORGOT_PASSWORD }, Transport.TCP)
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
      } else
        throw new RpcException({
          status: HttpStatus.NOT_FOUND,
          message: 'No user found with the provided email!',
        });
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  }

  //* Reset user password when user forgot current password
  @MessagePattern({ cmd: RESET_PASSWORD }, Transport.TCP)
  resetPassword(
    @Body() resetPasswordDTO: ResetPasswordDTO,
  ): Promise<AuthResponseDTO> {
    return this.userService.resetPassword(
      resetPasswordDTO.email,
      resetPasswordDTO.newPassword,
    );
  }

  @MessagePattern({ cmd: SEARCH_USER_BY_CONDITION }, Transport.TCP)
  searchUserByCondition(@Body() condition: any): Promise<User> {
    return this.userService.searchUserByCondition(condition);
  }

  //* Edit user role by email
  @MessagePattern({ cmd: CHANGE_USER_ROLE }, Transport.TCP)
  async editUserRoleByEmail(@Body() editUserRoleDto: EditUserRoleDto) {
    // Check if rolesName does exist role (rolesName must contains at least 1 roleName "MASTER")
    if (!editUserRoleDto.rolesName.length) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Roles must not be empty!',
      });
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
    } else
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: 'No role found!',
      });
  }

  //* Get list all users
  @MessagePattern({ cmd: GET_ALL_USER }, Transport.TCP)
  async getAllUsers(): Promise<User[]> {
    return await this.userService.getAllUsers();
  }

  //* Create new permission
  @MessagePattern({ cmd: CREATE_PERMISSION }, Transport.TCP)
  async createPermission(@Body() permissionDto: PermissionDto) {
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

      return { status: HttpStatus.OK, message: 'Done!' };
    }
  }

  //* Create new role
  @MessagePattern({ cmd: CREATE_ROLE }, Transport.TCP)
  async createRole(@Body() roleDto: RoleDto) {
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

      return { status: HttpStatus.OK, message: 'Done!' };
    }
  }

  //* Get list all roles
  @MessagePattern({ cmd: GET_ROLES }, Transport.TCP)
  getListRole(): Promise<Role[]> {
    return this.roleService.getAllRole();
  }

  //* Get list all permissions
  @MessagePattern({ cmd: GET_PERMISSIONS }, Transport.TCP)
  getListPermission(): Promise<Permission[]> {
    return this.permissionService.getAllPermission();
  }

  //* Change permission -> role relation
  @MessagePattern({ cmd: CHANGE_PERMISSION_ROLE }, Transport.TCP)
  async changePermissionRole(@Body() editPermissionDto: EditPermissionDto) {
    // Check if rolesName does exist role (rolesName must contains at least 1 roleName "MASTER")
    if (!editPermissionDto.rolesName.length) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Roles must not be empty!',
      });
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
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: 'No role found!',
      });
    }
  }

  //* Change role -> permission relation
  @MessagePattern({ cmd: CHANGE_ROLE_PERMISSION }, Transport.TCP)
  async changeRolePermission(@Body() editRoleDto: EditRoleDto) {
    // Check if permissionsName does exist permission (permissionsName must contains at least 1 permissionName "MASTER")
    // if (!editRoleDto.rolesName.length) {
    //   throw new BadRequestException('Roles must not be empty!');
    // }
    const targetListPermissions =
      await this.permissionService.searchListPermissionByCondition({
        where: { name: In(editRoleDto.permissionsName) },
      });
    // Then edit permission
    if (targetListPermissions.length)
      return await this.roleService.editRole(
        editRoleDto,
        targetListPermissions,
      );
    else
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: 'No role found!',
      });
  }

  //* Permission guard for API gateway
  @MessagePattern({ cmd: SEARCH_ROLE_BY_CONDITION }, Transport.TCP)
  async searchListRoleByCondition({ ids }: { ids: string[] }): Promise<Role[]> {
    return await this.roleService.searchListRoleByCondition({
      where: { id: In(ids) },
      relations: ['permissions'],
    });
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
