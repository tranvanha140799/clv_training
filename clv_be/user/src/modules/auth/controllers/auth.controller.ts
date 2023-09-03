import { MessagePattern } from '@nestjs/microservices';
import { AuthResponseDTO, LoginDTO, RegisterDTO } from '../dto';
import { AuthService } from '../services/auth.service';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { User } from 'src/modules/user/entities';
import { delay, of } from 'rxjs';

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
  @Post('login')
  login(@Body() body: LoginDTO): Promise<AuthResponseDTO> {
    return this.authService.loginUser(body);
  }
}
