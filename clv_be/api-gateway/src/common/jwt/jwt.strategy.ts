import {
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './jwt.payload';
import { UserService } from 'src/services/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger('JWT_STRATEGY');
  constructor(private readonly userService: UserService) {
    super({
      // Extract information from header jwt
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
      passReqToCallback: true,
    });
  }

  //* Authorize user & return user information
  async validate(request: Request, payload: JwtPayload): Promise<JwtPayload> {
    try {
      const { id, email } = payload;
      // Set access token from header Authorization
      payload.accessToken = request.headers.authorization.split(' ')[1];
      // If it exists means that token is unexpired but user still log out then block request with that token

      const user = await this.userService.searchUserByCondition({
        where: { id, email },
      });

      if (!user) {
        this.logger.error('No user found!');
        throw new UnauthorizedException('No user found!');
      }

      // User exists
      return payload;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
