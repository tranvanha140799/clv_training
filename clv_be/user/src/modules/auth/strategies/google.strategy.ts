import { PassportStrategy } from '@nestjs/passport';
import {
  Profile,
  Strategy,
  StrategyOptions,
  VerifyCallback,
} from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import {
  OAUTH_GOOGLE_CLIENT_ID,
  OAUTH_GOOGLE_REDIRECT,
  OAUTH_GOOGLE_SECRET,
} from 'src/common/env';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: OAUTH_GOOGLE_CLIENT_ID,
      clientSecret: OAUTH_GOOGLE_SECRET,
      callbackURL: OAUTH_GOOGLE_REDIRECT,
      scope: ['email', 'profile'],
    } as StrategyOptions);
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
    };
    done(null, user);
  }
}
