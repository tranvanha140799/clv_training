import { IsNotEmpty } from 'class-validator';
import { LoginDTO } from './auth.login.dto';
import { Role } from 'src/modules/user/entities';

export class RegisterDTO extends LoginDTO {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  role: Role;
}
