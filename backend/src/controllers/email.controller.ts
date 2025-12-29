import type { Response, Request, NextFunction } from 'express';
import { CreateEmailTemplate } from '../services/emailTemplate.service.js';
import { BadRequestException } from '../exceptions/exceptions.js';
import { ErrorCodes } from '../exceptions/index.js';

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

    return res.status(201).json({
      success: true,
      data: emailTemplate,
      message: 'Email template created successfully',
    });
  } catch (error) {
    next(error);
  }
};
