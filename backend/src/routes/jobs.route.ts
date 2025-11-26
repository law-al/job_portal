import { Router } from 'express';
import { protect } from '../middlewares/protect.js';
import { checkCompanyRole } from '../middlewares/checkRole.js';
import asyncHandler from '../utils/catchAsync.js';
import {
  closeJob,
  createJob,
  deleteJob,
  editJob,
  getCompanyJob,
  getCompanyJobs,
} from '../controllers/jobs.controller.js';

const jobsRoute: Router = Router();

jobsRoute.get('/:id/fetch', protect, asyncHandler(getCompanyJobs));
jobsRoute.get('/:id/fetch/:slug', protect, asyncHandler(getCompanyJob));

jobsRoute.post(
  '/:id/create',
  protect,
  checkCompanyRole(['COMPANY_ADMIN', 'HR']),
  asyncHandler(createJob),
);

jobsRoute.put(
  '/:id/edit/:slug',
  protect,
  checkCompanyRole(['COMPANY_ADMIN', 'HR']),
  asyncHandler(editJob),
);

jobsRoute.patch(
  '/:id/close/:slug',
  protect,
  checkCompanyRole(['COMPANY_ADMIN', 'HR']),
  asyncHandler(closeJob),
);

jobsRoute.delete(
  '/:id/delete/:slug',
  protect,
  checkCompanyRole(['COMPANY_ADMIN', 'HR']),
  asyncHandler(deleteJob),
);

export default jobsRoute;
