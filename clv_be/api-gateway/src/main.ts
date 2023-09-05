import { CorsOptions } from './configs/config.cors';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RpcExceptionToHttpExceptionFilter } from './utils/exception.filter';

const logger = new Logger('API GATEWAY');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new RpcExceptionToHttpExceptionFilter());

  app.enableCors(CorsOptions);

  await app.listen(process.env.GATEWAY_PORT);

  logger.log('is running on port: ' + process.env.GATEWAY_PORT);
}
bootstrap();
