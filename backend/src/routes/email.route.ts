import { Router } from 'express';
import { protect } from '../middlewares/protect.js';
import { verifyCompanyMember } from '../middlewares/verifyCompanyMember.js';
import asyncHandler from '../utils/catchAsync.js';
import { createEmailTemplate, getEmailTemplates, getEmailTemplateById, updateEmailTemplate } from '../controllers/email.controller.js';

const emailTemplateRoute: Router = Router();

// Create email template for a company
emailTemplateRoute.post('/:id/create', protect, verifyCompanyMember, asyncHandler(createEmailTemplate));

// Fetch all email templates for a company
emailTemplateRoute.get('/:id', protect, verifyCompanyMember, asyncHandler(getEmailTemplates));

// Fetch a single email template by ID
emailTemplateRoute.get('/:id/template/:templateId', protect, verifyCompanyMember, asyncHandler(getEmailTemplateById));

// Update email template
emailTemplateRoute.put('/:id/template/:templateId', protect, verifyCompanyMember, asyncHandler(updateEmailTemplate));

export default emailTemplateRoute;
