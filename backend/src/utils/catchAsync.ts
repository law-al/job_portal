import type { NextFunction, Request, Response } from 'express';

type AsyncFunc = (req: Request, res: Response, next: NextFunction) => void;

const asyncHandler = (fn: AsyncFunc) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error: any) {
      next(error);
    }
  };
};

export default asyncHandler;
