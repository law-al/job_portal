import { Router } from 'express';
import upload from '../middlewares/multer.js';
import asyncHandler from '../utils/catchAsync.js';
import { sendApplication, fetchApplications, getApplication, moveApplicationStage, assignApplicationToUser, rejectApplication } from '../controllers/application.controller.js';
import { protect } from '../middlewares/protect.js';
import { verifyCompanyMember } from '../middlewares/verifyCompanyMember.js';

const applicationRoute: Router = Router();

// Public route - for job seekers to submit applications
applicationRoute.post('/send', protect, upload.none(), asyncHandler(sendApplication));

// Admin routes - for company members to fetch applications
// More specific route must come first
applicationRoute.get('/:id/fetch/:applicationId', protect, verifyCompanyMember, asyncHandler(getApplication));
applicationRoute.get('/:id/fetch', protect, verifyCompanyMember, asyncHandler(fetchApplications));
applicationRoute.patch('/:id/move-stage/:applicationId', protect, verifyCompanyMember, asyncHandler(moveApplicationStage));
applicationRoute.patch('/:id/assign/:applicationId', protect, verifyCompanyMember, asyncHandler(assignApplicationToUser));
applicationRoute.patch('/:id/reject/:applicationId', protect, verifyCompanyMember, asyncHandler(rejectApplication));

export default applicationRoute;
