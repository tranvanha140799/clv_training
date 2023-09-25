import {
  Injectable,
  Inject,
  Logger,
  UseFilters,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, map } from 'rxjs/operators';
import { Request } from 'express';
import { NOTIFICATION_SERVICE, USER_SERVICE } from './common/app.constants';
import { AUTH_LOG_IN } from './common/app.message-pattern';
import { firstValueFrom, from, of } from 'rxjs';

@Injectable()
export class AppService {
  constructor(
    @Inject(USER_SERVICE) private readonly userService: ClientProxy,
    @Inject(NOTIFICATION_SERVICE) private readonly notificationService: ClientProxy
  ) {}
  private logger = new Logger('API GATEWAY');

  //* Redirect auth request to USER_SERVICE
  // @UseFilters(new RPCExceptionFilter())
  async redirectRequest(request: Request) {
    const { serviceName, path, ...args } = request.params;
    const startTs = Date.now();
    const pattern = { cmd: AUTH_LOG_IN };
    const payload = { ...request.body };

    switch (serviceName) {
      case 'auth':
      case 'user':
        this.logger.log('is redirecting request to USER_SERVICE');
        try {
          const response = await firstValueFrom(
            from(
              this.userService
                .send<string>(pattern, payload)
                .pipe(
                  map((message: string) => ({
                    message,
                    duration: Date.now() - startTs,
                  }))
                )
                .pipe(catchError((val) => of({ error: val.message })))
            )
          );
          console.log(
            '🚀 -> file: app.service.ts:39 -> AppService -> redirectRequest -> response:',
            response
          );

          return response;
        } catch (error) {
          console.log(
            '🚀 -> file: app.service.ts:38 -> AppService -> redirectRequest -> error:',
            error
          );
        }
      default:
        return;
    }
  }

  pingUser() {
    const startTs = Date.now();
    const pattern = { cmd: 'ping' };
    const payload = {};
    return this.userService.send<string>(pattern, payload).pipe(
      map((response) => {
        if (typeof response === 'object' && response) {
          const { status, message } = response;
          if (status === 401) throw new UnauthorizedException(message);
        }

        return { response, duration: Date.now() - startTs };
      })
    );
  }

  pingNotification() {
    const startTs = Date.now();
    const pattern = { cmd: 'ping' };
    const payload = {};
    return this.notificationService
      .send<string>(pattern, payload)
      .pipe(map((message: string) => ({ message, duration: Date.now() - startTs })));
  }
}
