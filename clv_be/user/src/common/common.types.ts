import { Request } from 'express';
import { JwtPayload } from 'src/modules/auth/jwt/jwt.payload';

// Make a request in NestJs returns an additional property named 'user' (type JwtPayload) with specific type (AuthReq)
export type AuthReq = Request & { user: JwtPayload }; // Request from express