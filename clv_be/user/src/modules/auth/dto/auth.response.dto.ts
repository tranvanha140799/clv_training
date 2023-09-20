import { Expose } from 'class-transformer';
// import { Role } from 'src/modules/user/entities';

export class AuthResponseDTO {
  @Expose()
  accessToken: string;

  idToken?: string;
}

export class SendEmailForgotPwResponseDTO {
  @Expose()
  message: string;
}

export class ValidTokenDTO {
  @Expose()
  isValid: boolean;
}
