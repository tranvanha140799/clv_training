import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ActivateDto, PermissionDto, ResetPwDto } from '../dto';
import { EditPermissionDto } from '../dto/permission.edit.dto';
import { PermissionService, RoleService, UserService } from '../services';
import { In } from 'typeorm';
import { ApiTags } from '@nestjs/swagger';
import { User, Permission } from '../entities';
import { AuthService } from '../../auth/services/auth.service';
import { AuthReq } from 'src/common/common.types';
import { AuthenticationGuard } from 'src/modules/auth/guards';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly permissionService: PermissionService,
    private readonly roleService: RoleService,
  ) {}

  //* Get user information by Id
  @UseGuards(AuthenticationGuard)
  @Get('profile')
  getUserById(@Req() request: AuthReq): Promise<User> {
    return this.userService.searchUserById(request.user.id);
  }

  //* Activate user by email
  @HttpCode(202)
  @UseGuards(AuthenticationGuard)
  @Put('activate')
  activateUserByEmail(@Body() activateDto: ActivateDto): Promise<void> {
    return this.userService.updateUserStatusByEmail(activateDto);
  }

  //* Reset user password
  @HttpCode(202)
  @Put('reset-password')
  resetPassword(@Body() resetPwDto: ResetPwDto): Promise<void> {
    return this.userService.resetPw(resetPwDto);
  }

  //* Get list all users
  @UseGuards(AuthenticationGuard)
  @Get('list')
  getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  //* Create new permission
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

  //* Get list permission
  @UseGuards(AuthenticationGuard)
  @Get('list-permission')
  getListPermission(): Promise<Permission[]> {
    return this.permissionService.getAllPermission();
  }

  //* Change permission role
  @UseGuards(AuthenticationGuard)
  @Put('edit-permission-role')
  async changePermissionRole(
    @Body() editPermissionDto: EditPermissionDto,
  ): Promise<void> {
    // Check if role does exist
    if (editPermissionDto.rolesName.length < 1) {
      throw new HttpException(
        'Roles must not be empty',
        HttpStatus.BAD_REQUEST,
      );
    }
    const targetListRoles = await this.roleService.searchListRoleByCondition({
      where: { name: In(editPermissionDto.rolesName) },
    });
    // Then create new permission
    if (targetListRoles.length > 0) {
      return await this.permissionService.editPermission(
        editPermissionDto,
        targetListRoles,
      );
    } else {
      throw new HttpException('no role found', HttpStatus.BAD_REQUEST);
    }
  }
}
