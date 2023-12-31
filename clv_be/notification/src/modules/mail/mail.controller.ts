import { Controller } from '@nestjs/common';
import { EventPattern, Transport } from '@nestjs/microservices';
import { MailService } from './mail.service';
import {
  GET_MAIL_ON_REGISTER_RESPONSE_TOPIC,
  GET_MAIL_FORGOT_PW_RESPONSE_TOPIC,
} from 'src/common/app.constant';

@Controller()
export class MailController {
  constructor(private readonly mailService: MailService) {}

  // @EventPattern({ cmd: 'send-message' })
  // @MessagePattern(GET_MAIL_ON_REGISTER_RESPONSE_TOPIC)
  // async sendConfirmationEmail(data: any): Promise<void> {
  //   return this.mailService.sendConfirmationEmail(data);
  // }

  @EventPattern(GET_MAIL_ON_REGISTER_RESPONSE_TOPIC, Transport.KAFKA)
  async sendNewPwOnSignUpMail(data: any): Promise<void> {
    await this.mailService.sendNewPwOnSignUpMail(data);
  }

  @EventPattern(GET_MAIL_FORGOT_PW_RESPONSE_TOPIC, Transport.KAFKA)
  async sendResetPwMail(data: any): Promise<void> {
    await this.mailService.sendForgotPwMail(data);
  }
}
