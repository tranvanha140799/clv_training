import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class ForgotPasswordDTO {
  @Expose()
  @IsNotEmpty()
  email: string;
}
