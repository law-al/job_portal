import { Router } from 'express';
import authRoute from './auth.route.js';
import companyRoute from './company.route.js';
import jobsRoute from './jobs.route.js';
import applicationRoute from './application.route.js';
import documentRoute from './document.route.js';
import aiRoute from './ai.route.js';
import noteRoute from './note.route.js';
import activityRoute from './activity.route.js';
import statsRoute from './stats.route.js';
import emailRoute from './email.route.js';

const rootRoute: Router = Router();

rootRoute.use('/auth', authRoute);
rootRoute.use('/company', companyRoute);
rootRoute.use('/jobs', jobsRoute);
rootRoute.use('/application', applicationRoute);
rootRoute.use('/document', documentRoute);
rootRoute.use('/ai', aiRoute);
rootRoute.use('/note', noteRoute);
rootRoute.use('/activity', activityRoute);
rootRoute.use('/stats', statsRoute);
rootRoute.use('/email', emailRoute);

export default rootRoute;
