import { Partitioners } from 'kafkajs';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { CorsOptions } from './config/config.cors';
import {
  APP_DOMAIN,
  KAFKA_BROKER_ID,
  KAFKA_USER_CONSUMER_GROUP_ID,
  USER_PORT,
} from './common/env';

const logger = new Logger('USER_SERVICE');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(CorsOptions);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: APP_DOMAIN,
      port: +USER_PORT,
    },
  });
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: { brokers: [KAFKA_BROKER_ID] },
      consumer: { groupId: KAFKA_USER_CONSUMER_GROUP_ID },
      producer: { createPartitioner: Partitioners.LegacyPartitioner },
    },
  });

  await app.startAllMicroservices();
  await app.listen(USER_PORT);

  logger.log('is running on port:' + USER_PORT);
}
bootstrap();

// import { MicroserviceOptions, Transport } from '@nestjs/microservices';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   app.enableCors(CorsOptions);
//   app.connectMicroservice<MicroserviceOptions>({
//     transport: Transport.KAFKA,
//     options: {
//       client: { brokers: [KAFKA_BROKER_ID] },
//       consumer: { groupId: KAFKA_USER_CONSUMER_GROUP_ID },
//       producer: { createPartitioner: Partitioners.LegacyPartitioner },
//     },
//   });

//   await app.startAllMicroservices().then(() => logger.log('KAFKA is running.'));

//   await app.listen(USER_PORT);
//   logger.log('is running at: localhost:' + USER_PORT);
// }
// bootstrap();
