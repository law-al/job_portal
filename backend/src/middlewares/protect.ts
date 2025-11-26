import type { NextFunction, Request, Response } from 'express';
import asyncHandler from '../utils/catchAsync.js';
import {
  BadRequestException,
  TokenExpiredException,
} from '../exceptions/exceptions.js';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import config from '../config/config.js';
import { prisma } from '../utils/prismaClient.js';
import { decodeJwt } from '../services/index.js';

export const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) throw new BadRequestException('JWT not found');

    const decoded = decodeJwt(accessToken);

    if (!decoded || !decoded.id) throw new TokenExpiredException();

    const user = await prisma.user.findFirst({
      where: {
        id: decoded.id,
      },
    });

    if (user?.passwordChangedAt && decoded.iat) {
      const passwordChanged =
        decoded.iat < +new Date(user.passwordChangedAt).getTime() / 1000;

      if (passwordChanged) throw new BadRequestException('please login again');
    }

    req.user = user;
    next();
  },
);
