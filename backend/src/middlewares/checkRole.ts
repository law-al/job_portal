import type { NextFunction, Request, Response } from 'express';
import type { CompanyRole, UserRole } from '../generated/prisma/enums.js';
import { FindUserById } from '../services/auth.service.js';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '../exceptions/exceptions.js';
import {
  FindCompanyById,
  FindCompanyMember,
} from '../services/company.service.js';

export const checkUserRole = (role: UserRole) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.id) {
        throw new ForbiddenException('Authentication required');
      }

      const user = await FindUserById(req.user.id);

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
      const { id: companyId } = req.params;

      if (!companyId) {
        throw new BadRequestException(`company with ${companyId} not found`);
      }

      if (!req.user?.id) {
        throw new ForbiddenException('Authentication required');
      }
      const company = await FindCompanyById(companyId);
      const member = await FindCompanyMember(company.id, req.user.id);

      if (!member)
        throw new NotFoundException(`member not found for this company`);
      if (!member.role)
        throw new BadRequestException(`member does not have a role`);

      if (!roles.includes(member.role))
        throw new ForbiddenException('Insufficient permissions');

      next();
    } catch (error) {
      next(error);
    }
  };
};
