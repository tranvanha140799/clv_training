import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('CLV training')
    .setDescription('CLV training API description')
    .setVersion('1.0')
    .addTag('Microservice USER')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  writeFileSync('./swagger-docs.json', JSON.stringify(document));
}
