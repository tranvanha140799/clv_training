import { Request } from 'express';
import { JwtPayload } from 'src/modules/auth/jwt/jwt.payload';

// Making a request in NestJs returns an additional property named 'user' (type JwtPayload) with a specific type (AuthReq)
export type AuthReq = Request & { user: JwtPayload }; // Request from express

export type OAuthUser = {
  email: string;
  firstName: string;
  lastName: string;
};

export type OAuthReq = Request & { user: OAuthUser };
