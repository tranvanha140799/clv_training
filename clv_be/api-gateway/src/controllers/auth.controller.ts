import { Body, Controller, Logger, Post } from '@nestjs/common';
import { LoginDTO, RegisterDTO, SessionTokenDTO } from 'src/dto';
import { AuthService } from 'src/services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  private logger = new Logger('API GATEWAY');

  @Post('login')
  login(@Body() loginDTO: LoginDTO) {
    this.logger.log('is redirecting request to USER_SERVICE');
    return this.authService.login(loginDTO);
  }

  @Post('register')
  register(@Body() registerDTO: RegisterDTO) {
    this.logger.log('is redirecting request to USER_SERVICE');
    return this.authService.register(registerDTO);
  }

  @Post('valid-session')
  checkSessionToken(@Body() sessionTokenDTO: SessionTokenDTO) {
    this.logger.log('is redirecting request to USER_SERVICE');
    return this.authService.checkSessionToken(sessionTokenDTO);
  }
}
