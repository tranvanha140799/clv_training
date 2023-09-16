import { Module } from '@nestjs/common';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import {
  EMAIL_ADDRESS,
  EMAIL_HOST,
  EMAIL_PASSWORD,
  EMAIL_PORT,
} from 'src/common/env';
// import { BullModule } from '@nestjs/bull';
// import { MAIL_QUEUE } from 'src/common/app.constant';
import { MailProcessor } from './mail.processor';

@Module({
  imports: [
    ConfigModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => ({
        transport: {
          host: EMAIL_HOST,
          port: +EMAIL_PORT,
          secure: true,
          auth: {
            user: EMAIL_ADDRESS,
            pass: EMAIL_PASSWORD,
          },
          tls: { rejectUnauthorized: false },
        },
        defaults: { from: '"CLV Mailer" <noreply@clv.com>' },
        template: {
          dir: __dirname + '/templates',
          adapter: new HandlebarsAdapter(),
          options: { strict: true },
        },
      }),
    }),
    // BullModule.registerQueue({ name: MAIL_QUEUE }),
  ],
  controllers: [MailController],
  providers: [MailProcessor, MailService],
  exports: [MailService],
})
export class MailModule {}
