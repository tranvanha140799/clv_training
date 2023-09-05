import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { map } from 'rxjs/operators';
import { Request } from 'express';
import { NOTIFICATION_SERVICE, USER_SERVICE } from './common/app.constants';
import { GET_USER_PROFILE, USER_LOG_IN } from './common/app.message-pattern';
import { firstValueFrom, lastValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(
    @Inject(USER_SERVICE) private readonly userService: ClientProxy,
    @Inject(NOTIFICATION_SERVICE) private readonly notificationService: ClientProxy
  ) {}
  private logger = new Logger('API GATEWAY');

  //* Redirect auth request to USER_SERVICE
  async redirectRequest(request: Request) {
    const { serviceName, path, ...args } = request.params;
    const startTs = Date.now();
    const pattern = { cmd: USER_LOG_IN };
    const payload = { ...request.body };

    switch (serviceName) {
      case 'auth':
      case 'user':
        this.logger.log('is redirecting request to USER_SERVICE');
        try {
          const response = await this.userService
            .send<string>(pattern, payload)
            .pipe(
              map((message: string) => ({ message, duration: Date.now() - startTs }))
            );

          return response;
        } catch (error) {
          console.log(
            '🚀 -> file: app.service.ts:38 -> AppService -> redirectRequest -> error:',
            error
          );
        }

      case 'notification':
        this.logger.log('is redirecting request to NOTIFICATION_SERVICE');
        try {
          const response = await this.notificationService
            .send<string>(pattern, payload)
            .pipe(
              map((message: string) => ({ message, duration: Date.now() - startTs }))
            );

          return response;
        } catch (error) {
          console.log(
            '🚀 -> file: app.service.ts:55 -> AppService -> redirectRequest -> error:',
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
    return this.userService
      .send<string>(pattern, payload)
      .pipe(map((message: string) => ({ message, duration: Date.now() - startTs })));
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
