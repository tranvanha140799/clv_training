// import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { MailModule } from './modules/mail/mail.module';
// import { REDIS_HOST, REDIS_PORT } from './common/env';

@Module({
  imports: [
    MailModule,
    // BullModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: async () => ({
    //     redis: { host: REDIS_HOST, port: +REDIS_PORT },
    //   }),
    // }),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        EMAIL_HOST: Joi.string().required(),
        EMAIL_PORT: Joi.number().required(),
        EMAIL_ADDRESS: Joi.string().required(),
        EMAIL_PASSWORD: Joi.string().required(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
      }),
    }),
  ],
})
export class AppModule {}
