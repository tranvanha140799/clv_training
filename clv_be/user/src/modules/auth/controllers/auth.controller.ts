import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { AuthResponseDTO, LoginDTO, RegisterDTO } from '../dto';
import { AuthService } from '../services/auth.service';
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { delay, firstValueFrom, from, of } from 'rxjs';
import { USER_LOG_IN } from 'src/common/app.message-pattern';
import { ExceptionFilterRpc } from 'src/utils/rpc-exception.filter';
import { GoogleOauthGuard } from '../guards/google.guard';
import { ConfigService } from '@nestjs/config';
import { GOOGLE_REDIRECT_URL } from 'src/common/app.constants';
import { OAuthReq } from 'src/common/common.types';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @MessagePattern({ cmd: 'ping' })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ping(_: any) {
    console.log('USER PING PONG!');

    return of('pong').pipe(delay(2000));
  }

  //* Register new user
  @Post('register')
  register(@Body() body: RegisterDTO): Promise<AuthResponseDTO> {
    return this.authService.registerUser(body);
  }

  //* Login by email & password
  @MessagePattern({ cmd: USER_LOG_IN })
  @UseFilters(new ExceptionFilterRpc())
  @Post('login')
  async login(@Body() body: LoginDTO): Promise<AuthResponseDTO> {
    // try {
    const response = await firstValueFrom(
      from(this.authService.loginUser(body)),
    );
    return response;
    // } catch (error) {
    //   console.log(
    //     '🚀 -> file: auth.controller.ts:41 -> AuthController -> login -> error:',
    //     error,
    //   );
    //   // const statusCode = error.getStatus();
    //   const message = error.message;
    //   return {
    //     status: 'error',
    //     // statusCode,
    //     message,
    //     data: null,
    //   };
    // }
  }

  //* Login with google
  @UseGuards(GoogleOauthGuard)
  @EventPattern('REDIRECT')
  @Get('google')
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
}
