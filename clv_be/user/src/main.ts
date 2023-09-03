// import { Logger } from '@nestjs/common';
// import { NestFactory } from '@nestjs/core';
// import { Transport } from '@nestjs/microservices';
// import { AppModule } from './app.module';
// import { CorsOptions } from './config/config.cors';

// const logger = new Logger('USER SERVICE');

// async function bootstrap() {
//   const app = await NestFactory.createMicroservice(AppModule, {
//     transport: Transport.TCP,
//     options: {
//       host: process.env.APP_DOMAIN,
//       port: process.env.USER_PORT,
//       cors: CorsOptions,
//     },
//   });

//   await app.listen();

//   logger.log('is running on port:' + process.env.USER_PORT);
// }
// bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { USER_PORT } from './common/app.constants';
import { CorsOptions } from './config/config.cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.enableCors(CorsOptions);

  await app.listen(configService.get<string>(USER_PORT));

  Logger.log(
    '[User Service] is running at: localhost:' +
      configService.get<string>(USER_PORT),
  );
}
bootstrap();
