import { MessagePattern } from '@nestjs/microservices';
import { AuthResponseDTO, LoginDTO, RegisterDTO } from '../dto';
import { AuthService } from '../services/auth.service';
import { Body, Controller, Get, Post, UseFilters } from '@nestjs/common';
import { User } from 'src/modules/user/entities';
import { delay, firstValueFrom, from, of } from 'rxjs';
import { USER_LOG_IN } from 'src/common/app.message-pattern';
import { ExceptionFilterRpc } from 'src/utils/rpc-exception.filter';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'ping' })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ping(_: any) {
    console.log('USER PING PONG!');

    return of('pong').pipe(delay(2000));
  }

  //* Test api for GET method (wil be deleted later)
  @Get('users')
  getAll(): Promise<User[]> {
    return this.authService.getAllUsers();
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
  async login(@Body() body: LoginDTO): Promise<any> {
    try {
      const response = await firstValueFrom(
        from(this.authService.loginUser(body)),
      );
      return response;
    } catch (error) {
      console.log(
        '🚀 -> file: auth.controller.ts:41 -> AuthController -> login -> error:',
        error,
      );
      // const statusCode = error.getStatus();
      const message = error.message;
      return {
        status: 'error',
        // statusCode,
        message,
        data: null,
      };
    }
  }
}
