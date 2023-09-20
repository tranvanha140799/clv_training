import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './jwt.payload';
import { UserService } from 'src/modules/user/services/user.service';
import { JWT_SECRET } from 'src/common/env';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger('JWT_STRATEGY');
  constructor(private readonly userService: UserService) {
    super({
      // Extract information from header jwt
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET,
      passReqToCallback: true,
    });
  }

  //* Authorize user & return user information
  async validate(request: Request, payload: JwtPayload): Promise<JwtPayload> {
    const { id, email } = payload;
    try {
      // Set access token from header Authorization
      payload.accessToken = request.headers.authorization.split(' ')[1];
      // If it exists means that token is unexpired but user still log out then block request with that token

      const user = await this.userService.searchUserByCondition({
        where: { id: id, email: email },
      });

      if (!user) {
        this.logger.error('no user found!');
        throw new UnauthorizedException();
      }
    } catch (error) {
      this.logger.error(error.message);
      throw new UnauthorizedException(error.message);
    }

    // User exists
    return payload;
  }
}
