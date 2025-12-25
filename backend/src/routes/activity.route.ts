import { Router } from 'express';
import asyncHandler from '../utils/catchAsync.js';
import { createActivity, getActivitiesByApplication, getActivityById } from '../controllers/activity.controller.js';
import { protect } from '../middlewares/protect.js';
import { verifyCompanyMember } from '../middlewares/verifyCompanyMember.js';

const activityRoute: Router = Router();

// All activity routes require authentication and company membership
activityRoute.post('/:id/application/:applicationId', protect, verifyCompanyMember, asyncHandler(createActivity));
activityRoute.get('/:id/application/:applicationId', protect, verifyCompanyMember, asyncHandler(getActivitiesByApplication));
activityRoute.get('/:id/:activityId', protect, verifyCompanyMember, asyncHandler(getActivityById));

export default activityRoute;
