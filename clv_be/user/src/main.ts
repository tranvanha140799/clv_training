import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { BE_PORT as USER_PORT } from './common/app.constants';
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
