import type { NextFunction, Request, Response } from 'express';
import type { CompanyRole, UserRole } from '../generated/prisma/enums.js';
import { FindUserById } from '../services/auth.service.js';
import { ForbiddenException } from '../exceptions/exceptions.js';

export const checkUserRole = (role: UserRole) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req.user as any).id;
      if (!userId) {
        throw new ForbiddenException('Authentication required');
      }

      const user = await FindUserById(userId);

      if (user.role !== role) {
        throw new ForbiddenException('Insufficient permissions');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export const checkCompanyRole = (roles: CompanyRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // This middleware should be used AFTER verifyCompanyMember
      // which already verifies company membership and user status
      const companyMember = (req as any).companyMember;

      if (!companyMember) {
        throw new ForbiddenException('Company membership verification required. Use verifyCompanyMember middleware first.');
      }

      // Check if user's role in this company allows the action
      if (!roles.includes(companyMember.role)) {
        throw new ForbiddenException('Insufficient permissions');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
