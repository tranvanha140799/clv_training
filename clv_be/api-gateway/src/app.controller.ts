import { All, Controller, Get, Logger, UseFilters } from '@nestjs/common';
import { AppService } from './app.service';
import { map, zip } from 'rxjs';
import { RPCExceptionFilter } from './utils';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  private logger = new Logger('API GATEWAY');

  @Get('/ping-a')
  pingServiceA() {
    return this.appService.pingNotification();
  }

  @UseFilters(new RPCExceptionFilter())
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

  // @All('/:serviceName/:path')
  // redirectRequest(@Req() request: Request) {
  //   return this.appService.redirectRequest(request);
  // }
}
