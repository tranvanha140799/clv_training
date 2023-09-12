import { IsNotEmpty, IsUppercase } from 'class-validator';

export class EditRoleDto {
  @IsNotEmpty()
  @IsUppercase()
  roleName: string;

  @IsNotEmpty()
  permissionsName: string[];
}
