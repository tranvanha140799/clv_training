import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthReq } from 'src/common/common.types';
import { UserService } from 'src/services/user.service';
import { AuthenticationGuard, AuthorizationGuard } from '../guards';
import {
  ActivateUserDto,
  ChangePasswordDTO,
  EditPermissionDto,
  EditRoleDto,
  EditUserDto,
  EditUserRoleDto,
  ForgotPasswordDTO,
  PermissionDto,
  ResetPasswordDTO,
  RoleDto,
} from 'src/dto';
import { HasPermission } from 'src/decorators';
import {
  ADD_PERMISSION,
  ADD_ROLE,
  ASSIGN_ROLE_TO_USER,
  GET_ALL_PERMISSIONS,
  GET_ALL_ROLES,
  GET_ALL_USER,
  RESET_PASSWORD,
  UPDATE_PERMISSION_ROLE,
  UPDATE_ROLE_PERMISSION,
  ACTIVATE_USER,
} from 'src/common/app.user-permission';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  private logger = new Logger('API GATEWAY');

  @UseGuards(AuthenticationGuard)
  @Get('profile')
  getUserById(@Req() request: AuthReq) {
    this.logger.log('is redirecting request to USER_SERVICE');
    return this.userService.getUserById(request.user.id);
  }

  //* Get list all users
  @HasPermission(GET_ALL_USER)
  @UseGuards(AuthorizationGuard)
  @UseGuards(AuthenticationGuard)
  @Get('list')
  getAllUsers() {
    this.logger.log('is redirecting request to USER_SERVICE');
    return this.userService.getAllUsers();
  }

  @UseGuards(AuthenticationGuard)
  @Put('edit')
  editUserByEmail(@Body() userUserDto: EditUserDto) {
    return this.userService.updateUserInformationByEmail(userUserDto);
  }

  //* Activate user by email
  @HasPermission(ACTIVATE_USER)
  @UseGuards(AuthorizationGuard)
  @UseGuards(AuthenticationGuard)
  @Put('activate')
  activateUser(@Body() activateDto: ActivateUserDto) {
    return this.userService.activateUser(activateDto);
  }

  //* Change password (also use for new account registered with Google)
  @HasPermission(RESET_PASSWORD)
  @UseGuards(AuthenticationGuard)
  @Put('change-password')
  changePassword(@Body() changePasswordDTO: ChangePasswordDTO) {
    return this.userService.changePassword(changePasswordDTO);
  }

  @Post('forgot-password')
  forgotPassword(@Body() forgotPasswordDTO: ForgotPasswordDTO) {
    return this.userService.forgotPassword(forgotPasswordDTO);
  }

  @Post('reset-password')
  resetPassword(@Body() resetPasswordDTO: ResetPasswordDTO) {
    return this.userService.resetPassword(resetPasswordDTO);
  }

  //* Get list all roles
  @HasPermission(GET_ALL_ROLES)
  @UseGuards(AuthorizationGuard)
  @UseGuards(AuthenticationGuard)
  @Get('list-role')
  getListRole() {
    return this.userService.getAllRole();
  }

  //* Create new role
  @HasPermission(ADD_ROLE)
  @UseGuards(AuthorizationGuard)
  @UseGuards(AuthenticationGuard)
  @Post('new-role')
  createRole(@Body() roleDto: RoleDto) {
    return this.userService.createRole(roleDto);
  }

  //* Get list all permissions
  @HasPermission(GET_ALL_PERMISSIONS)
  @UseGuards(AuthorizationGuard)
  @UseGuards(AuthenticationGuard)
  @Get('list-permission')
  getListPermission() {
    return this.userService.getAllPermission();
  }

  //* Create new permission
  @HasPermission(ADD_PERMISSION)
  @UseGuards(AuthorizationGuard)
  @UseGuards(AuthenticationGuard)
  @Post('new-permission')
  createPermission(@Body() permissionDto: PermissionDto) {
    return this.userService.createPermission(permissionDto);
  }

  //* Edit user role by email
  @HasPermission(ASSIGN_ROLE_TO_USER)
  @UseGuards(AuthorizationGuard)
  @UseGuards(AuthenticationGuard)
  @Put('role')
  changeUserRole(@Body() editUserRoleDto: EditUserRoleDto) {
    return this.userService.changeUserRole(editUserRoleDto);
  }

  //* Change permission -> role relation
  @HasPermission(UPDATE_PERMISSION_ROLE)
  @UseGuards(AuthorizationGuard)
  @UseGuards(AuthenticationGuard)
  @Put('edit-permission-role')
  changePermissionRole(@Body() editPermissionDto: EditPermissionDto) {
    return this.userService.changePermissionRole(editPermissionDto);
  }

  //* Change role -> permission relation
  @HasPermission(UPDATE_ROLE_PERMISSION)
  @UseGuards(AuthorizationGuard)
  @UseGuards(AuthenticationGuard)
  @Put('edit-role-permission')
  changeRolePermission(@Body() editRoleDto: EditRoleDto) {
    return this.userService.changeRolePermission(editRoleDto);
  }
}
