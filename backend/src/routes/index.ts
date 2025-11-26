import { Router } from 'express';
import authRoute from './auth.route.js';
import companyRoute from './company.route.js';
import jobsRoute from './jobs.route.js';

const rootRoute: Router = Router();

rootRoute.use('/auth', authRoute);
rootRoute.use('/company', companyRoute);
rootRoute.use('/jobs', jobsRoute);

export default rootRoute;
