import type { NextFunction, Request, Response } from 'express';
import { BadRequestException, ForbiddenException, NotFoundException } from '../exceptions/exceptions.js';
import { FindCompanyById, FindCompanyMember } from '../services/company.service.js';
import { ErrorCodes } from '../exceptions/index.js';

/**
 * Middleware to verify:
 * 1. Company ID exists in params
 * 2. Company exists
 * 3. User is a member of the company
 * 4. User status is ACTIVE (not BLOCKED, SUSPENDED, or REMOVED)
 *
 * Attaches company and member to req object for use in controllers
 */
export const verifyCompanyMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req.user as any).id;
    if (!userId) {
      throw new ForbiddenException('Authentication required');
    }

    // Get companyId from route params
    const { id: companyId } = req.params;
    if (!companyId) {
      throw new BadRequestException('Company ID is required', ErrorCodes.MISSING_COMPANY_ID);
    }

    // Verify company exists
    const company = await FindCompanyById(companyId);
    if (!company) {
      throw new NotFoundException(`company with id ${companyId} not found`);
    }

    // Verify user is a member of this specific company
    const member = await FindCompanyMember(companyId, userId);
    if (!member) {
      throw new ForbiddenException('You are not a member of this company');
    }

    // Check if user's status allows them to perform actions
    if (member.status === 'BLOCKED' || member.status === 'SUSPENDED' || member.status === 'REMOVED') {
      throw new ForbiddenException(`Your account is ${member.status.toLowerCase()}. You cannot perform this action.`);
    }

    // Attach company and member to request for use in controllers
    (req as any).company = company;
    (req as any).companyMember = member;

    next();
  } catch (error) {
    next(error);
  }
};
