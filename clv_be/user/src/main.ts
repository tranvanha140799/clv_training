import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.setGlobalPrefix('api/v1');
  // const config = new DocumentBuilder()
  //   .setTitle('Users example')
  //   .setDescription('The users API description')
  //   .setVersion('1.0')
  //   .addTag('NestJS')
  //   .build();
  // const document = SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('api', app, document);

  // Pipe for validating fields (global level)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove unused fields
    }),
  );

  await app.listen(3000);
}
bootstrap();
