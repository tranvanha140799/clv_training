import { IsNotEmpty, IsUppercase } from 'class-validator';

export class PermissionDto {
  @IsNotEmpty()
  @IsUppercase()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  rolesName: string[];
}
