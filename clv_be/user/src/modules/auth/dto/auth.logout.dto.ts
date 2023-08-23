import { IsNotEmpty } from 'class-validator';

export class LogOutDTO {
  @IsNotEmpty()
  accessToken: string;
}
