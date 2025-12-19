import { Router } from 'express';
import authRoute from './auth.route.js';
import companyRoute from './company.route.js';
import jobsRoute from './jobs.route.js';
import applicationRoute from './application.route.js';
import documentRoute from './document.route.js';

const rootRoute: Router = Router();

rootRoute.use('/auth', authRoute);
rootRoute.use('/company', companyRoute);
rootRoute.use('/jobs', jobsRoute);
rootRoute.use('/application', applicationRoute);
rootRoute.use('/document', documentRoute);

export default rootRoute;
