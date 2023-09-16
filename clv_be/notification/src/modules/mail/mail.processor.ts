import { MailerService } from '@nestjs-modules/mailer';
import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Job } from 'bull';
import { CONFIRM_REGISTRATION, MAIL_QUEUE } from 'src/common/app.constant';

@Injectable()
@Processor(MAIL_QUEUE)
export class MailProcessor {
  private readonly logger = new Logger(MailProcessor.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  @Process(CONFIRM_REGISTRATION) // Here is the name of the executed process
  public async confirmRegistration(job: Job<{ data: any }>) {
    this.logger.log(
      `Sending confirm registration email to '${job.data.data.email}'`,
    );
    try {
      return this.mailerService.sendMail({
        to: job.data.data.email,
        from: this.configService.get('EMAIL_ADDRESS'),
        subject: 'Registration',
        template: './registration',
        context: {
          expireTime: '1 day',
          name: job.data.data.firstName,
          password: job.data.data.tempPassword,
          link:
            job.data.data.redirectUrl +
            job.data.data.email +
            '&idToken=' +
            job.data.data.idToken,
        },
      });
    } catch {
      this.logger.error(
        `Failed to send confirmation email to '${job.data.data.email}'`,
      );
    }
  }

  @OnQueueActive()
  public onActive(job: Job) {
    this.logger.debug(`Processing job ${job.id} of type ${job.name}`);
  }

  @OnQueueCompleted()
  public onComplete(job: Job) {
    this.logger.debug(`Completed job ${job.id} of type ${job.name}`);
  }

  @OnQueueFailed()
  public onError(job: Job<any>, error: any) {
    this.logger.error(
      `Failed job ${job.id} of type ${job.name}: ${error.message}`,
      error.stack,
    );
  }
}
