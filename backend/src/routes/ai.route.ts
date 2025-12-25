import { Router } from 'express';
import { protect } from '../middlewares/protect.js';
import { verifyCompanyMember } from '../middlewares/verifyCompanyMember.js';
import { checkCompanyRole } from '../middlewares/checkRole.js';
import asyncHandler from '../utils/catchAsync.js';
import { getResumeReview } from '../controllers/ai.controller.js';

const aiRoute: Router = Router();

// aiRoute.get('/:id/resume/analyze', protect, verifyCompanyMember, checkCompanyRole(['ADMIN', 'HR']));
aiRoute.post('/resume/analyze', asyncHandler(getResumeReview));

export default aiRoute;
