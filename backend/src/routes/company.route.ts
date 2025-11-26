import { Router } from 'express';
import {
  changeCompanyLogo,
  changeUserRole,
  getCompany,
  getCompanyMembers,
  register,
  removeMember,
  update,
} from '../controllers/company.controller.js';
import asyncHandler from '../utils/catchAsync.js';
import { protect } from '../middlewares/protect.js';
import { checkCompanyRole, checkUserRole } from '../middlewares/checkRole.js';
import upload from '../middlewares/multer.js';

const companyRoute: Router = Router();

companyRoute.post(
  '/register',
  protect,
  checkUserRole('COMPANY'),
  upload.single('logo'),
  asyncHandler(register),
);
companyRoute.get('/:id', asyncHandler(getCompany));
companyRoute.get(
  '/:id/members',
  protect,
  checkCompanyRole(['COMPANY_ADMIN']),
  asyncHandler(getCompanyMembers),
);
companyRoute.post(
  '/:id/:memberId/role',
  protect,
  checkCompanyRole(['COMPANY_ADMIN']),
  asyncHandler(changeUserRole),
);
companyRoute.put(
  '/:id/update',
  protect,
  checkCompanyRole(['COMPANY_ADMIN']),
  asyncHandler(update),
);
companyRoute.patch(
  '/:id/change-logo',
  protect,
  checkCompanyRole(['COMPANY_ADMIN']),
  upload.single('logo'),
  asyncHandler(changeCompanyLogo),
);
companyRoute.delete(
  '/:id/:memberId/delete',
  protect,
  checkCompanyRole(['COMPANY_ADMIN']),
  asyncHandler(removeMember),
);

export default companyRoute;
