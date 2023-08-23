import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './jwt.payload';
import { UserService } from 'src/modules/user/services/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      // Extract information from header jwt
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'uthinkucanguessit',
      passReqToCallback: true,
    });
  }

  //* Authorize user & return user information
  async validate(req: Request, payload: JwtPayload): Promise<JwtPayload> {
    const { id, email } = payload;
    try {
      // Set access token from header Authorization
      payload.accessToken = req.headers.authorization.split(' ')[1];
      // If it exists means that token is unexpired but user still log out then block request with that token

      const user = await this.userService.searchUserByCondition({
        where: { id: id, email: email },
      });

      if (!user) {
        throw new UnauthorizedException();
      }
    } catch (error) {
      Logger.error(error.message);
      throw new UnauthorizedException(error.message);
    }

    // User exist
    return payload;
  }
}
