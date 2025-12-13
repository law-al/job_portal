import type { NextFunction, Request, Response } from 'express';
import asyncHandler from '../utils/catchAsync.js';
import { BadRequestException, InvalidTokenException, JWTNotPresent, TokenExpiredException, UnauthorizedException } from '../exceptions/exceptions.js';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import config from '../config/config.js';
import { prisma } from '../utils/prismaClient.js';
import { decodeJwt } from '../services/index.js';
import { ErrorCodes } from '../exceptions/index.js';
import type { UserModel } from '../generated/prisma/models/User.ts';

export const protect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization) {
    throw new UnauthorizedException('No authorization header present');
  }

  const token = authorization.split(' ')[1];

  if (!token) {
    throw new JWTNotPresent('No token present');
  }

  let decoded;
  try {
    decoded = decodeJwt(token);
  } catch (error) {
    throw new InvalidTokenException('Invalid or malformed token');
  }

  if (!decoded || !decoded.id) {
    throw new InvalidTokenException('Token payload is invalid');
  }

  const user = await prisma.user.findFirst({
    where: {
      id: decoded.id,
    },
  });

  if (!user) {
    throw new UnauthorizedException('User no longer exists');
  }

  if (user.passwordChangedAt && decoded.iat) {
    const passwordChanged = decoded.iat < +new Date(user.passwordChangedAt).getTime() / 1000;
    if (passwordChanged) {
      throw new TokenExpiredException('Password was changed. Please login again');
    }
  }

  req.user = user as UserModel;
  next();
});
