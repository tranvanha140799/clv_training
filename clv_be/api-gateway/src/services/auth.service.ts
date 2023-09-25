import { Inject, Injectable } from '@nestjs/common';
import { firstValueFrom, from, map } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { LoginDTO, RegisterDTO, SessionTokenDTO } from 'src/dto';
import {
  AUTH_CHECK_VALID_SESSION,
  AUTH_LOG_IN,
  AUTH_REGISTER,
} from 'src/common/app.message-pattern';
import { USER_SERVICE } from 'src/common/app.constants';
import { catchRpcError } from '../utils';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_SERVICE)
    private readonly userService: ClientProxy
  ) {}

  login(loginDTO: LoginDTO) {
    const pattern = { cmd: AUTH_LOG_IN };
    return firstValueFrom(
      from(
        this.userService.send<string, LoginDTO>(pattern, loginDTO).pipe(
          map((res) => {
            catchRpcError(res);

            return res;
          })
        )
      )
    );
  }

  register(registerDTO: RegisterDTO) {
    const pattern = { cmd: AUTH_REGISTER };
    return firstValueFrom(
      from(
        this.userService.send<string, RegisterDTO>(pattern, registerDTO).pipe(
          map((res) => {
            catchRpcError(res);

            return res;
          })
        )
      )
    );
  }

  checkSessionToken(sessionTokenDTO: SessionTokenDTO) {
    const pattern = { cmd: AUTH_CHECK_VALID_SESSION };
    return firstValueFrom(
      from(
        this.userService.send<string, SessionTokenDTO>(pattern, sessionTokenDTO).pipe(
          map((res) => {
            catchRpcError(res);

            return res;
          })
        )
      )
    );
  }
}
