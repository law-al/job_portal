import { Router } from 'express';
import { protect } from '../middlewares/protect.js';
import { verifyCompanyMember } from '../middlewares/verifyCompanyMember.js';
import asyncHandler from '../utils/catchAsync.js';
import { createEmailTemplate, getEmailTemplates, getEmailTemplateById, updateEmailTemplate } from '../controllers/email.controller.js';
import redisCacheMiddleware from '../middlewares/redis.middleware.js';

const emailTemplateRoute: Router = Router();

// Create email template for a company
emailTemplateRoute.post('/:id/create', protect, verifyCompanyMember, asyncHandler(createEmailTemplate));

// Fetch all email templates for a company
emailTemplateRoute.get('/:id', protect, verifyCompanyMember, redisCacheMiddleware({ EX: 1800 }), asyncHandler(getEmailTemplates)); // 30 minutes TTL

// Fetch a single email template by ID
emailTemplateRoute.get('/:id/template/:templateId', protect, verifyCompanyMember, redisCacheMiddleware({ EX: 1800 }), asyncHandler(getEmailTemplateById)); // 30 minutes TTL

// Update email template
emailTemplateRoute.put('/:id/template/:templateId', protect, verifyCompanyMember, asyncHandler(updateEmailTemplate));

export default emailTemplateRoute;
