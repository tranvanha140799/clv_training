import { CorsOptions } from './configs/config.cors';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(CorsOptions);
  await app.listen(process.env.GATEWAY_PORT);
  Logger.log(
    'API GATEWAY is running at: http://localhost:' + process.env.GATEWAY_PORT
  );
}
bootstrap();
