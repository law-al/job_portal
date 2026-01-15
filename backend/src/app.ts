import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import type { Express, Request, Response } from 'express';
import rootRoute from './routes/index.js';
import errorHandler from './middlewares/errorHandler.js';
import { logInfo } from './utils/logger.js';
import { catchAllRoute } from './middlewares/catchAllRoutes.js';
import passport from 'passport';
import './oauth/passport.google.sso.js';
import { apiRateLimiter } from './middlewares/ratelimit.middleware.js';

const app: Express = express();

app.use(
  cors({
    origin: ['http://localhost:5000', 'http://localhost:3000'],
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(passport.initialize());

// Apply general rate limiting to all API routes
console.log('Root route registered');
app.use('/api/v1', apiRateLimiter, rootRoute);

app.get('/health', (req: Request, res: Response) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: new Date().toDateString(),
  };

  try {
    res.status(200).json(healthcheck);
  } catch (error: any) {
    healthcheck.message = error.message;
    res.status(503).json(healthcheck);
  }
});

app.get('/', (req: Request, res: Response) => {
  logInfo('App is running on');
  res.send('This is running');
});

app.use(catchAllRoute);

app.use(errorHandler);

export default app;
