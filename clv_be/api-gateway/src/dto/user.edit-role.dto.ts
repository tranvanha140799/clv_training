import { IsEmail, IsNotEmpty } from 'class-validator';

export class EditUserRoleDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  rolesName: string[];
}
