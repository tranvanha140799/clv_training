import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { map, zip } from 'rxjs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/ping-a')
  pingServiceA() {
    return this.appService.pingNotification();
  }

  @Get('/ping-b')
  pingServiceB() {
    return this.appService.pingUser();
  }

  @Get('/ping-all')
  pingAll() {
    return zip(this.appService.pingNotification(), this.appService.pingUser()).pipe(
      map(([pongServiceA, pongServiceB]) => ({
        pongServiceA,
        pongServiceB,
      }))
    );
  }
}
