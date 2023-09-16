import {
  ClientKafka,
  EventPattern,
  MessagePattern,
  Transport,
} from '@nestjs/microservices';
import { AuthResponseDTO, LoginDTO, RegisterDTO } from '../dto';
import { AuthService } from '../services/auth.service';
import {
  Body,
  Controller,
  Get,
  Inject,
  OnApplicationShutdown,
  OnModuleInit,
  Post,
  Req,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { delay, firstValueFrom, from, of } from 'rxjs';
// import { USER_LOG_IN } from 'src/common/app.message-pattern';
import { ExceptionFilterRpc } from 'src/utils/rpc-exception.filter';
import { GoogleOauthGuard } from '../guards/google.guard';
import { ConfigService } from '@nestjs/config';
import {
  GET_MAILING_ON_SIGNUP_RESPONSE_TOPIC,
  GOOGLE_REDIRECT_URL,
  NOTIFICATION_SERVICE,
} from 'src/common/app.constants';
import { OAuthReq } from 'src/common/common.types';
import { USER_LOG_IN } from 'src/common/app.message-pattern';

@Controller('auth')
export class AuthController implements OnModuleInit, OnApplicationShutdown {
  constructor(
    @Inject(NOTIFICATION_SERVICE) private readonly mailingClient: ClientKafka,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @MessagePattern({ cmd: 'ping' }, Transport.TCP)
  ping() {
    console.log('USER PING PONG!');

    return of('pong').pipe(delay(2000));
  }

  //* Register new user
  @Post('register')
  register(@Body() body: RegisterDTO): Promise<AuthResponseDTO> {
    return this.authService.registerUser(body);
  }

  //* Login by email & password
  @MessagePattern({ cmd: USER_LOG_IN }, Transport.TCP)
  @UseFilters(new ExceptionFilterRpc())
  @Post('login')
  async login(@Body() body: LoginDTO): Promise<AuthResponseDTO> {
    const response = await firstValueFrom(
      from(this.authService.loginUser(body)),
    );
    return response;
  }

  //* Redirect to google login page
  @Get('google')
  @UseGuards(GoogleOauthGuard)
  @EventPattern('REDIRECT')
  async googleAuth() {}

  //* Login with google
  @Get('google-redirect')
  @UseGuards(GoogleOauthGuard)
  async googleAuthRedirect(@Req() req: OAuthReq, @Res() res: any) {
    const data = await this.authService.googleLogin(req.user);
    if (data)
      res.redirect(
        this.configService.get(GOOGLE_REDIRECT_URL) + data.accessToken,
      );
    else res.redirect('http://localhost:3000/login');
  }

  async onModuleInit() {
    const requestPatterns: string[] = [GET_MAILING_ON_SIGNUP_RESPONSE_TOPIC];

    requestPatterns.forEach((topic: string) =>
      this.mailingClient.subscribeToResponseOf(topic),
    );

    await this.mailingClient.connect();
  }

  async onApplicationShutdown() {
    await this.mailingClient.close();
  }
}
