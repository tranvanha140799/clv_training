import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { map } from 'rxjs/operators';
import { NOTIFICATION_SERVICE, USER_SERVICE } from './common/app.constants';

@Injectable()
export class AppService {
  constructor(
    @Inject(USER_SERVICE) private readonly userService: ClientProxy,
    @Inject(NOTIFICATION_SERVICE) private readonly notificationService: ClientProxy
  ) {}

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
