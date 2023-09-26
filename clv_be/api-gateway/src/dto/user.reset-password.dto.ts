import { IsEmail, IsNotEmpty, Matches, Validate } from 'class-validator';
import { IsDifferentPassword } from 'src/validator/validator.user';

export class ChangePasswordDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\S]{8,}$/, {
    message:
      'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one digit.',
  })
  @IsNotEmpty()
  currentPassword: string;

  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\S]{8,}$/, {
    message:
      'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one digit.',
  })
  @IsNotEmpty()
  @Validate(IsDifferentPassword)
  newPassword: string;
}

export class ResetPasswordDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\S]{8,}$/, {
    message:
      'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one digit.',
  })
  @IsNotEmpty()
  newPassword: string;
}
