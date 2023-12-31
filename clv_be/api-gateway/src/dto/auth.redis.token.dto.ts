import { IsEmail, IsNotEmpty } from 'class-validator';

export class SessionTokenDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  token: string;
}
