// import { Logger } from '@nestjs/common';
// import { NestFactory } from '@nestjs/core';
// import { Transport } from '@nestjs/microservices';
// import { AppModule } from './app.module';
// import { CorsOptions } from './configs/config.cors';

// const logger = new Logger('NOTIFICATION_SERVICE');

// async function bootstrap() {
//   const app = await NestFactory.createMicroservice(AppModule, {
//     transport: Transport.TCP,
//     options: {
//       host: process.env.APP_DOMAIN,
//       port: process.env.NOTIFICATION_PORT,
//       cors: CorsOptions,
//     },
//   });

//   await app.listen();

//   logger.log(`is running on port: ${process.env.NOTIFICATION_PORT}`);
// }
// bootstrap();

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from './configs/config.cors';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import {
  KAFKA_BROKER_ID,
  KAFKA_NOTIFICATION_CONSUMER_GROUP_ID,
  NOTIFICATION_PORT,
} from './common/env';
import { Partitioners } from 'kafkajs';

const logger = new Logger('NOTIFICATION_SERVICE');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(CorsOptions);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: { brokers: [KAFKA_BROKER_ID] },
      consumer: { groupId: KAFKA_NOTIFICATION_CONSUMER_GROUP_ID },
      producer: { createPartitioner: Partitioners.LegacyPartitioner },
    },
  });

  await app.startAllMicroservices().then(() => logger.log('KAFKA is running.'));

  await app.listen(NOTIFICATION_PORT);
  logger.log('is running at: http://localhost:' + NOTIFICATION_PORT);
}
bootstrap();
