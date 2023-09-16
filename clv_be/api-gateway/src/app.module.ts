import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { NOTIFICATION_SERVICE, USER_SERVICE } from './common/app.constants';
import { providers } from './configs/config.provider';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: USER_SERVICE,
        transport: Transport.TCP,
        options: {
          host: process.env.APP_DOMAIN,
          port: +process.env.USER_PORT,
        },
      },
      {
        name: NOTIFICATION_SERVICE,
        transport: Transport.TCP,
        options: {
          host: process.env.APP_DOMAIN,
          port: +process.env.NOTIFICATION_PORT,
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService, ...providers],
})
export class AppModule {}
