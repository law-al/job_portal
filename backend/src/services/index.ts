import jwt, { type JwtPayload } from 'jsonwebtoken';
import config from '../config/config.js';
import { TokenExpiredException } from '../exceptions/exceptions.js';

interface IJwtPayload extends JwtPayload {
  id: string;
  firstname: string;
  lastname: string;
  iat?: number;
}

export const decodeJwt = (JWTToken: string) => {
  try {
    return jwt.verify(JWTToken, config.JWTsecret) as IJwtPayload;
  } catch (error) {
    throw new TokenExpiredException();
  }
};
