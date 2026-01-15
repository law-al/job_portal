import type { Response, Request, NextFunction } from 'express';
import { CreateEmailTemplate, FindCompanyEmailTemplates, FindEmailTemplateById, UpdateEmailTemplate } from '../services/emailTemplate.service.js';
import { BadRequestException, NotFoundException } from '../exceptions/exceptions.js';
import { ErrorCodes } from '../exceptions/index.js';
import { deleteRedisData } from '../utils/redis.js';

export const createEmailTemplate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: companyId } = req.params;
    const userId = (req.user as any)?.id;

    if (!companyId) {
      throw new BadRequestException('Company ID is required', ErrorCodes.MISSING_COMPANY_ID);
    }

    if (!userId) {
      throw new BadRequestException('User ID is required', ErrorCodes.MISSING_USER_ID);
    }

    const body = req.body;

    const emailTemplate = await CreateEmailTemplate({ companyId, userId, body });

    // Invalidate email template cache
    await deleteRedisData(`email/${companyId}`);

    return res.status(201).json({
      success: true,
      data: emailTemplate,
      message: 'Email template created successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Fetch email templates for a company
export const getEmailTemplates = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: companyId } = req.params;
    const { templateType, isActive, isDefault, search, page, limit } = req.query;

    if (!companyId) {
      throw new BadRequestException('Company ID is required', ErrorCodes.MISSING_COMPANY_ID);
    }

    const queryParams: {
      companyId: string;
      templateType?: string;
      isActive?: boolean;
      isDefault?: boolean;
      search?: string;
      page?: number;
      limit?: number;
    } = {
      companyId,
    };

    if (templateType) {
      queryParams.templateType = templateType as string;
    }

    if (isActive !== undefined) {
      queryParams.isActive = isActive === 'true' ? true : false;
    }

    if (isDefault !== undefined) {
      queryParams.isDefault = isDefault === 'true' ? true : false;
    }

    if (search) {
      queryParams.search = search as string;
    }

    if (page) {
      queryParams.page = parseInt(page as string, 10);
    }

    if (limit) {
      queryParams.limit = parseInt(limit as string, 10);
    }

    const result = await FindCompanyEmailTemplates(queryParams);

    return res.status(200).json({
      success: true,
      data: result.templates,
      pagination: result.pagination,
      message: 'Email templates fetched successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Fetch a single email template by ID
export const getEmailTemplateById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: companyId, templateId } = req.params;

    if (!companyId) {
      throw new BadRequestException('Company ID is required', ErrorCodes.MISSING_COMPANY_ID);
    }

    if (!templateId) {
      throw new BadRequestException('Template ID is required', ErrorCodes.BAD_REQUEST);
    }

    const template = await FindEmailTemplateById(templateId, companyId);

    if (!template) {
      throw new NotFoundException('Email template not found');
    }

    return res.status(200).json({
      success: true,
      data: template,
      message: 'Email template fetched successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Update email template
export const updateEmailTemplate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: companyId, templateId } = req.params;
    const userId = (req.user as any)?.id;

    if (!companyId) {
      throw new BadRequestException('Company ID is required', ErrorCodes.MISSING_COMPANY_ID);
    }

    if (!templateId) {
      throw new BadRequestException('Template ID is required', ErrorCodes.BAD_REQUEST);
    }

    if (!userId) {
      throw new BadRequestException('User ID is required', ErrorCodes.MISSING_USER_ID);
    }

    const body = req.body;

    const updatedTemplate = await UpdateEmailTemplate({
      templateId,
      companyId,
      userId,
      body,
    });

    // Invalidate email template cache
    await deleteRedisData(`email/${companyId}`);

    return res.status(200).json({
      success: true,
      data: updatedTemplate,
      message: 'Email template updated successfully',
    });
  } catch (error) {
    next(error);
  }
};
