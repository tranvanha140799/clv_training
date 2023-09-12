import { IsNotEmpty, IsUppercase } from 'class-validator';

export class EditPermissionDto {
  @IsNotEmpty()
  @IsUppercase()
  permissionName: string;

  @IsNotEmpty()
  rolesName: string[];
}
