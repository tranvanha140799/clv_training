import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { CorsOptions } from './configs/config.cors';

const logger = new Logger('NOTIFICATION SERVICE');

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.TCP,
    options: {
      host: process.env.APP_DOMAIN,
      port: process.env.NOTIFICATION_PORT,
      cors: CorsOptions,
    },
  });

  await app.listen();

  logger.log(`is running on port: ${process.env.NOTIFICATION_PORT}`);
}
bootstrap();
