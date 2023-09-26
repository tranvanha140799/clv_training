import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { CorsOptions } from './config/config.cors';
import { Logger } from '@nestjs/common';

const logger = new Logger('VESSEL_SERVICE');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(CorsOptions);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: process.env.APP_DOMAIN,
      port: +process.env.VESSEL_PORT,
    },
  });

  await app.startAllMicroservices();

  await app.listen(process.env.VESSEL_PORT);

  logger.log('is running on port:' + process.env.VESSEL_PORT);
}
bootstrap();
