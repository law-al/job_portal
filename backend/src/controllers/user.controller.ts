import type { NextFunction, Request, Response } from 'express';
import { FindUserById } from '../services/auth.service.js';
import { UserNotFoundException } from '../exceptions/exceptions.js';

export const getUser = async (req: Request, res: Response) => {
  const userId = (req.user as any).id;
  const user = await FindUserById(userId);

  if (!user) throw new UserNotFoundException();

  res.status(200).json({
    success: true,
    message: 'user fetched success',
    data: {
      email: user.email,
    },
  });
};
