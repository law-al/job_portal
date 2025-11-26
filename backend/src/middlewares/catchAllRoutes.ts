import type { NextFunction, Request, Response } from 'express';
import { ApiError } from '../exceptions/index.js';

export const catchAllRoute = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const error = new ApiError(`Not Found - ${req.originalUrl}`, 401, null);
  next(error);
};
