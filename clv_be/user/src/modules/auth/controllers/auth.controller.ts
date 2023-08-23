import { AuthResponseDTO, LoginDTO, RegisterDTO } from '../dto';
import { AuthService } from '../services/auth.service';
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/modules/user/entities';
import { AuthenticationGuard } from '../guards';
import { AuthReq } from 'src/common/common.types';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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

  //* Logout user
  @UseGuards(AuthenticationGuard)
  @Post('logout')
  async getUserLogout(@Req() request: AuthReq) {
    // const token = request.headers.authorization.split(' ')[1];
    // const decodedToken = this.authService.verifyAccessToken(token);

    await this.authService.addAccessTokenBlackList(
      request.user.accessToken,
      request.user.id,
    );
  }
}
