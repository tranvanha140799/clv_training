import { IsEmail, IsNotEmpty } from 'class-validator';

export class EditUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  globalId: string;

  officeCode: string;

  country: string;
}
