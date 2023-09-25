import { Controller, Get, Logger, Req, UseGuards } from '@nestjs/common';
import { AuthReq } from 'src/common/common.types';
import { UserService } from 'src/services/user.service';
import { AuthenticationGuard } from '../guards';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  private logger = new Logger('API GATEWAY');

  // @UseGuards(AuthenticationGuard)
  @Get('profile')
  getUserById() {
    this.logger.log('is redirecting request to USER_SERVICE');
    return this.userService.getUserById();
  }

  // @UseGuards(AuthenticationGuard)
  @Get('list')
  getAllUsers() {
    this.logger.log('is redirecting request to USER_SERVICE');
    return this.userService.getAllUsers();
  }
}
