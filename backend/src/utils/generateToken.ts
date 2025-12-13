import config from '../config/config.js';
import type { UserModel as User } from '../generated/prisma/models/User.ts';
import jwt from 'jsonwebtoken';

export default function generateTokens(user: User) {
  const accessToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    },
    config.JWTsecret,
    { expiresIn: '15m' },
  );

  const refreshToken = jwt.sign({ id: user.id }, config.JWTsecret, {
    expiresIn: '7d',
  });

  return { accessToken, refreshToken };
}
