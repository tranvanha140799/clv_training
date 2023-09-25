import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, from, map } from 'rxjs';
import { USER_SERVICE } from 'src/common/app.constants';
import {
  GET_USER_PROFILE,
  SEARCH_USER_BY_CONDITION,
} from 'src/common/app.message-pattern';
import { AuthReq } from 'src/common/common.types';
import { User } from 'src/entities';
import { catchRpcError } from 'src/utils';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_SERVICE)
    private readonly userService: ClientProxy
  ) {}

  getUserById() {
    const pattern = { cmd: 'GET_USER_PROFILE' };
    return firstValueFrom(
      from(
        this.userService.send(pattern, {}).pipe(
          map((res) => {
            catchRpcError(res);

            return res;
          })
        )
      )
    );
  }

  getAllUsers() {
    const pattern = { cmd: 'GET_ALL_USER' };
    try {
      const res = firstValueFrom(
        from(
          this.userService.send(pattern, {}).pipe(
            map((res) => {
              catchRpcError(res);

              return res;
            })
          )
        )
      );
      if (res) return res;
      else throw new Error('Error');
    } catch (error) {
      console.log(error.message);
    }
  }

  searchUserByCondition(condition: any) {
    const pattern = { cmd: SEARCH_USER_BY_CONDITION };

    return firstValueFrom(
      from(
        this.userService.send(pattern, condition).pipe(
          map((res) => {
            catchRpcError(res);

            return res;
          })
        )
      )
    );
  }
}
