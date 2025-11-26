import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import type { Express, Request, Response } from 'express';
import rootRoute from './routes/index.js';
import errorHandler from './middlewares/errorHandler.js';
import { logInfo } from './utils/logger.js';
import { catchAllRoute } from './middlewares/catchAllRoutes.js';

const app: Express = express();

app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

console.log('Root route registered');
app.use('/api/v1', rootRoute);

app.get('/', (req: Request, res: Response) => {
  logInfo('App is running on');
  res.send('This is running');
});

app.use(catchAllRoute);

app.use(errorHandler);

export default app;
