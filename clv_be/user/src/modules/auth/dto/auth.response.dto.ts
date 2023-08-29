import { Expose } from 'class-transformer';
import { Role } from 'src/modules/user/entities';

export class AuthResponseDTO {
  @Expose()
  accessToken: string;

  @Expose()
  userInfo: {
    email: string;
    firstName: string;
    lastName: string;
    isPending?: boolean;
    isDisable?: boolean;
    globalId?: string;
    officeCode?: string;
    country?: string;
    roles: Role[];
  };

  idToken?: string;
}
