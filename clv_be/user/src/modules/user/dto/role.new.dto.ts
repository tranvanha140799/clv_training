import { IsNotEmpty, IsUppercase } from 'class-validator';

export class RoleDto {
  @IsNotEmpty()
  @IsUppercase()
  name: string;

  @IsNotEmpty()
  permissionsName: string[];
}
