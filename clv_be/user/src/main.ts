import { NestFactory } from '@nestjs/core';
// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
// import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { setupSwagger } from './config/config.docs';
import { BE_PORT as USER_PORT } from './common/app.constants';
import { CorsOptions } from './config/config.cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.enableCors(CorsOptions);

  // app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.KAFKA,
  //   options: {
  //     client: {
  //       brokers: ['localhost:9092'],
  //     },
  //     consumer: {
  //       groupId: 'user-consumer',
  //     },
  //   },
  // });
  // const port = +process.env.APP_PORT || 3000;
  // app.setGlobalPrefix('api');
  // console.log('Port running on: ', port);

  // const options = new DocumentBuilder()
  //   .addBearerAuth()
  //   .setTitle('User Management')
  //   .setDescription('User Management API documentation')
  //   .setVersion('1.0')
  //   .addTag('User')
  //   .build();

  // const document = SwaggerModule.createDocument(app, options);
  // SwaggerModule.setup('api', app, document);

  // await app.startAllMicroservices().then(() => {
  //   Logger.log('[Consumer] Kafka of User Service is running!');
  // });
  setupSwagger(app);

  await app.listen(configService.get<string>(USER_PORT));

  Logger.log(
    '[User Service] is running at: localhost:' +
      configService.get<string>(USER_PORT),
  );
}
bootstrap();
