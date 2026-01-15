import { Router } from 'express';
import { protect } from '../middlewares/protect.js';
import { verifyCompanyMember } from '../middlewares/verifyCompanyMember.js';
import asyncHandler from '../utils/catchAsync.js';
import { getDashboardStats } from '../controllers/stats.controller.js';
import redisCacheMiddleware from '../middlewares/redis.middleware.js';

const statsRoute: Router = Router();

// GET dashboard stats for a company
statsRoute.get('/:id', protect, verifyCompanyMember, redisCacheMiddleware({ EX: 15 * 60 }), asyncHandler(getDashboardStats));

export default statsRoute;
