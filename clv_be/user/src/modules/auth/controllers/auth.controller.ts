import {
  ClientKafka,
  EventPattern,
  MessagePattern,
  Transport,
} from '@nestjs/microservices';
import { AuthResponseDTO, LoginDTO, RegisterDTO, ValidTokenDTO } from '../dto';
import { AuthService } from '../services/auth.service';
import {
  Body,
  Controller,
  Get,
  Inject,
  OnApplicationShutdown,
  OnModuleInit,
  Req,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { GoogleOauthGuard } from '../guards';
import { ConfigService } from '@nestjs/config';
import {
  GET_MAIL_ON_REGISTER_RESPONSE_TOPIC,
  GOOGLE_REDIRECT_URL,
  NOTIFICATION_SERVICE,
} from 'src/common/app.constants';
import { OAuthReq } from 'src/common/common.types';
import {
  AUTH_CHECK_VALID_SESSION,
  AUTH_LOG_IN,
  AUTH_REGISTER,
} from 'src/common/app.message-pattern';
import { SessionTokenDTO } from '../dto/auth.redis.token.dto';
import { RPCExceptionFilter } from 'src/utils/rpc-exception.filter';

@Controller('auth')
@UseFilters(new RPCExceptionFilter())
export class AuthController implements OnModuleInit, OnApplicationShutdown {
  constructor(
    @Inject(NOTIFICATION_SERVICE) private readonly mailClient: ClientKafka,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  // @MessagePattern({ cmd: 'ping' }, Transport.TCP)
  // ping() {
  //   console.log('USER PING PONG!');

  //   throw new RpcException({
  //     status: 401,
  //     message: 'Unauthorized!',
  //   });

  //   // return of('pong').pipe(delay(2000));
  // }

  //* Register new user
  @MessagePattern({ cmd: AUTH_REGISTER }, Transport.TCP)
  register(@Body() body: RegisterDTO): Promise<AuthResponseDTO> {
    return this.authService.registerUser(body);
  }

  //* Login by email & password
  @MessagePattern({ cmd: AUTH_LOG_IN }, Transport.TCP)
  login(@Body() body: LoginDTO): Promise<AuthResponseDTO> {
    return this.authService.loginUser(body);
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
    else res.redirect('http://localhost:3000/auth/login');
  }

  //* Check if session token is valid
  @MessagePattern({ cmd: AUTH_CHECK_VALID_SESSION }, Transport.TCP)
  async checkSessionToken(
    @Body() sessionTokenDTO: SessionTokenDTO,
  ): Promise<ValidTokenDTO> {
    const response = new ValidTokenDTO();
    response.isValid = await this.authService.checkSessionToken(
      sessionTokenDTO.email,
      sessionTokenDTO.token,
    );
    return response;
  }

  async onModuleInit() {
    const requestPatterns: string[] = [GET_MAIL_ON_REGISTER_RESPONSE_TOPIC];

    requestPatterns.forEach((topic: string) =>
      this.mailClient.subscribeToResponseOf(topic),
    );

    await this.mailClient.connect();
  }

  async onApplicationShutdown() {
    await this.mailClient.close();
  }
}
