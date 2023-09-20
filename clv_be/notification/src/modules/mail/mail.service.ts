import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Options } from 'nodemailer/lib/smtp-transport';
import { google } from 'googleapis';
import { MailerService } from '@nestjs-modules/mailer';
import {
  EMAIL_ACCOUNT,
  OAUTH_GOOGLE_CLIENT_ID,
  OAUTH_GOOGLE_SECRET,
  REFRESH_TOKEN,
} from 'src/common/env';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(
    // @InjectQueue(MAIL_QUEUE) private readonly mailQueue: Queue,
    private readonly mailerService: MailerService,
  ) {}

  private async setTransport() {
    const OAuth2 = google.auth.OAuth2;
    const oauth2Client = new OAuth2(
      OAUTH_GOOGLE_CLIENT_ID,
      OAUTH_GOOGLE_SECRET,
      'https://developers.google.com/oauthplayground',
    );

    oauth2Client.setCredentials({
      refresh_token: REFRESH_TOKEN,
    });

    const accessToken: string = await new Promise((resolve, reject) => {
      oauth2Client.getAccessToken((err, token) => {
        if (err) {
          this.logger.error(err);
          reject('Failed to create access token!');
        }
        resolve(token);
      });
    });

    const config: Options = {
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: EMAIL_ACCOUNT,
        clientId: OAUTH_GOOGLE_CLIENT_ID,
        clientSecret: OAUTH_GOOGLE_SECRET,
        accessToken,
      },
    };
    this.mailerService.addTransporter('gmail', config);
  }

  // public async sendConfirmationEmail(data: any): Promise<void> {
  //   console.log(
  //     '🚀 -> file: mail.service.ts:56 -> MailService -> sendConfirmationEmail -> data:',
  //     data,
  //   );
  //   try {
  //     await this.mailQueue.add(CONFIRM_REGISTRATION, data);
  //   } catch (error) {
  //     this.logger.error(`Error queueing registration email to user!`);

  //     throw error;
  //   }
  // }

  async sendNewPwOnSignUpMail(data: any): Promise<void> {
    await this.setTransport();
    try {
      await this.mailerService.sendMail({
        transporterName: 'gmail',
        to: data.email,
        from: EMAIL_ACCOUNT,
        subject: '[Welcome] CLV password for new account.',
        template: 'registration',
        context: {
          expireTime: '1 day',
          name: data.firstName,
          password: data.tempPassword,
          link: data.redirectUrl + data.email + '&idToken=' + data.idToken,
        },
      });
      this.logger.log('has sent a welcome email.');
    } catch (error) {
      this.logger.error(error.message);
      throw new BadRequestException(error.message);
    }
  }

  async sendForgotPwMail(data: any): Promise<void> {
    await this.setTransport();
    try {
      await this.mailerService.sendMail({
        transporterName: 'gmail',
        to: data.email,
        from: EMAIL_ACCOUNT,
        subject: '[Forgot Password] Reset your CLV password.',
        template: 'reset-password',
        context: {
          expireTime: '15 minutes',
          name: data.firstName,
          link: data.redirectUrl + data.email + '&idToken=' + data.idToken,
        },
      });
      this.logger.log('has sent an email to reset password.');
    } catch (error) {
      this.logger.error(error.message);
      throw new BadRequestException(error.message);
    }
  }
}
