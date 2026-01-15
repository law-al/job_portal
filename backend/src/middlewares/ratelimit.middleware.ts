import type { NextFunction, Response, Request } from 'express';
import fs from 'fs';
import path from 'path';
import { setRedisRateLimit } from '../utils/redis.js';
import type { RedisArgument } from 'redis';

const luascript = fs.readFileSync(path.join(process.cwd(), 'src', 'lua', 'limiter.lua'), 'utf-8') as RedisArgument;

interface RateLimitOptions {
  limit: number; // Number of requests
  window: number; // Time window in seconds
}

const rateLimiterMiddleware = ({ limit, window }: RateLimitOptions) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get client IP address (considering proxies)
      const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.ip || req.socket.remoteAddress || 'unknown';
      const route = req.originalUrl || req.path;

      const key = `rate_limit:${route}:${ip}`;

      const allowed = await setRedisRateLimit({
        script: luascript,
        key,
        limit: limit.toString(),
        window: window.toString(),
      });

      if (allowed === 1) {
        next();
      } else {
        res.status(429).json({
          success: false,
          message: 'Too many requests. Please try again later.',
          retryAfter: window,
        });
      }
    } catch (error) {
      console.log('Error from rate limiter middleware', error);
      // Fail open - allow request if rate limiter fails
      next();
    }
  };
};

// Pre-configured rate limiters for different use cases
export const authRateLimiter = rateLimiterMiddleware({ limit: 5, window: 900 }); // 5 requests per 15 minutes
export const strictAuthRateLimiter = rateLimiterMiddleware({ limit: 3, window: 900 }); // 3 requests per 15 minutes (password reset, etc.)
export const publicRateLimiter = rateLimiterMiddleware({ limit: 100, window: 60 }); // 100 requests per minute
export const apiRateLimiter = rateLimiterMiddleware({ limit: 200, window: 60 }); // 200 requests per minute
export const uploadRateLimiter = rateLimiterMiddleware({ limit: 10, window: 60 }); // 10 uploads per minute

export default rateLimiterMiddleware;
