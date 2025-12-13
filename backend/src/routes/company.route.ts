import { Router } from 'express';
import {
  changeCompanyLogo,
  changeUserRole,
  getCompany,
  getCompanyMembers,
  getCompanyMember,
  register,
  removeMember,
  update,
  suspendMember,
  unsuspendMember,
} from '../controllers/company.controller.js';
import asyncHandler from '../utils/catchAsync.js';
import { protect } from '../middlewares/protect.js';
import { checkCompanyRole, checkUserRole } from '../middlewares/checkRole.js';
import upload from '../middlewares/multer.js';

const companyRoute: Router = Router();

companyRoute.post('/register', protect, checkUserRole('COMPANY'), upload.single('logo'), asyncHandler(register));

companyRoute.get('/find', protect, checkCompanyRole(['ADMIN']), asyncHandler(getCompany));

companyRoute.get('/:id/members', protect, checkCompanyRole(['ADMIN']), asyncHandler(getCompanyMembers));
companyRoute.get('/:id/members/:memberId', protect, checkCompanyRole(['ADMIN']), asyncHandler(getCompanyMember));

companyRoute.patch('/:id/members/:memberId/role', protect, checkCompanyRole(['ADMIN']), asyncHandler(changeUserRole));
companyRoute.put('/:id/update', protect, checkCompanyRole(['ADMIN']), asyncHandler(update));
companyRoute.patch('/:id/change-logo', protect, checkCompanyRole(['ADMIN']), upload.single('logo'), asyncHandler(changeCompanyLogo));
companyRoute.delete('/:id/:memberId/delete', protect, checkCompanyRole(['ADMIN']), asyncHandler(removeMember));
companyRoute.patch('/:id/:memberId/suspend', protect, checkCompanyRole(['ADMIN']), asyncHandler(suspendMember));
companyRoute.patch('/:id/:memberId/unsuspend', protect, checkCompanyRole(['ADMIN']), asyncHandler(unsuspendMember));

export default companyRoute;
