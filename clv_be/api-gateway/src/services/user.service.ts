import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, from, map } from 'rxjs';
import { USER_SERVICE } from 'src/common/app.constants';
import {
  GET_ALL_USER,
  ACTIVATE_USER,
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
  RESET_PASSWORD,
  SEARCH_ROLE_BY_CONDITION,
  SEARCH_USER_BY_CONDITION,
  UPDATE_USER_INFO,
} from 'src/common/app.message-pattern';
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
import { Role, User } from 'src/entities';
import { catchRpcError } from 'src/utils';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_SERVICE)
    private readonly userService: ClientProxy
  ) {}

  getUserById(userId: string) {
    const pattern = { cmd: GET_USER_PROFILE };
    try {
      const response = firstValueFrom(
        from(
          this.userService.send(pattern, { userId }).pipe(
            map((res) => {
              catchRpcError(res);

              return res;
            })
          )
        )
      );
      if (response) return response;
      else throw new Error('Error');
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  getAllUsers() {
    const pattern = { cmd: GET_ALL_USER };
    try {
      const res = firstValueFrom(
        from(
          this.userService.send(pattern, {}).pipe(
            map((res) => {
              catchRpcError(res);

              return res;
            })
          )
        )
      );
      if (res) return res;
      else throw new Error('Error');
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  //* Check if user exists for authentication guard
  async searchUserByCondition(condition: any): Promise<User> {
    const pattern = { cmd: SEARCH_USER_BY_CONDITION };
    try {
      const response = await this.userService
        .send(pattern, condition)
        .pipe(
          map((res) => {
            catchRpcError(res);

            return res;
          })
        )
        .toPromise();

      return response;
    } catch (err) {
      console.log(err);
    }
  }

  //* Check if user has permission to a specified route
  async searchListRoleByCondition(ids: string[]): Promise<Role[]> {
    const pattern = { cmd: SEARCH_ROLE_BY_CONDITION };
    try {
      const response = await this.userService
        .send(pattern, { ids })
        .pipe(
          map((res) => {
            catchRpcError(res);

            return res;
          })
        )
        .toPromise();

      return response;
    } catch (err) {
      console.log(err);
    }
  }

  updateUserInformationByEmail(editUserDto: EditUserDto) {
    const pattern = { cmd: UPDATE_USER_INFO };
    try {
      const response = firstValueFrom(
        from(
          this.userService.send(pattern, editUserDto).pipe(
            map((res) => {
              catchRpcError(res);

              return res;
            })
          )
        )
      );

      return response;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  activateUser(activateUserDto: ActivateUserDto) {
    const pattern = { cmd: ACTIVATE_USER };
    try {
      const response = firstValueFrom(
        from(
          this.userService.send(pattern, activateUserDto).pipe(
            map((res) => {
              console.log(
                '🚀 -> file: user.service.ts:157 -> UserService -> map -> res:',
                res
              );
              catchRpcError(res);

              return res;
            })
          )
        )
      );

      return response;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  changePassword(changePasswordDTO: ChangePasswordDTO) {
    const pattern = { cmd: CHANGE_PASSWORD };
    try {
      const response = firstValueFrom(
        from(
          this.userService.send(pattern, changePasswordDTO).pipe(
            map((res) => {
              catchRpcError(res);

              return res;
            })
          )
        )
      );

      return response;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  forgotPassword(forgotPasswordDTO: ForgotPasswordDTO) {
    const pattern = { cmd: FORGOT_PASSWORD };
    try {
      const response = firstValueFrom(
        from(
          this.userService.send(pattern, forgotPasswordDTO).pipe(
            map((res) => {
              catchRpcError(res);

              return res;
            })
          )
        )
      );

      return response;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  resetPassword(resetPasswordDTO: ResetPasswordDTO) {
    const pattern = { cmd: RESET_PASSWORD };
    try {
      const response = firstValueFrom(
        from(
          this.userService.send(pattern, resetPasswordDTO).pipe(
            map((res) => {
              catchRpcError(res);

              return res;
            })
          )
        )
      );

      return response;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  createRole(roleDto: RoleDto) {
    const pattern = { cmd: CREATE_ROLE };
    try {
      const response = firstValueFrom(
        from(
          this.userService.send(pattern, roleDto).pipe(
            map((res) => {
              catchRpcError(res);

              return res;
            })
          )
        )
      );

      return response;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  createPermission(permissionDto: PermissionDto) {
    const pattern = { cmd: CREATE_PERMISSION };
    try {
      const response = firstValueFrom(
        from(
          this.userService.send(pattern, permissionDto).pipe(
            map((res) => {
              catchRpcError(res);

              return res;
            })
          )
        )
      );

      return response;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  getAllRole() {
    const pattern = { cmd: GET_ROLES };
    try {
      const response = firstValueFrom(
        from(
          this.userService.send(pattern, {}).pipe(
            map((res) => {
              catchRpcError(res);

              return res;
            })
          )
        )
      );

      return response;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  getAllPermission() {
    const pattern = { cmd: GET_PERMISSIONS };
    try {
      const response = firstValueFrom(
        from(
          this.userService.send(pattern, {}).pipe(
            map((res) => {
              catchRpcError(res);

              return res;
            })
          )
        )
      );

      return response;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  changeUserRole(editUserRoleDto: EditUserRoleDto) {
    const pattern = { cmd: CHANGE_USER_ROLE };
    try {
      const response = firstValueFrom(
        from(
          this.userService.send(pattern, editUserRoleDto).pipe(
            map((res) => {
              catchRpcError(res);

              return res;
            })
          )
        )
      );

      return response;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  changePermissionRole(editPermissionDto: EditPermissionDto) {
    const pattern = { cmd: CHANGE_PERMISSION_ROLE };
    try {
      const response = firstValueFrom(
        from(
          this.userService.send(pattern, editPermissionDto).pipe(
            map((res) => {
              catchRpcError(res);

              return res;
            })
          )
        )
      );

      return response;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  changeRolePermission(editRoleDto: EditRoleDto) {
    const pattern = { cmd: CHANGE_ROLE_PERMISSION };
    try {
      const response = firstValueFrom(
        from(
          this.userService.send(pattern, editRoleDto).pipe(
            map((res) => {
              catchRpcError(res);

              return res;
            })
          )
        )
      );

      return response;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
