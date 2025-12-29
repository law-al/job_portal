import { Router } from 'express';
import { protect } from '../middlewares/protect.js';
import { verifyCompanyMember } from '../middlewares/verifyCompanyMember.js';
import asyncHandler from '../utils/catchAsync.js';
import { createEmailTemplate } from '../controllers/email.controller.js';

const emailTemplateRoute: Router = Router();

// Create email template for a company
emailTemplateRoute.post('/:id/create', protect, verifyCompanyMember, asyncHandler(createEmailTemplate));

export default emailTemplateRoute;
