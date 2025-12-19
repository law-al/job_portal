import { Router } from 'express';
import { protect } from '../middlewares/protect.js';
import { checkCompanyRole } from '../middlewares/checkRole.js';
import { verifyCompanyMember } from '../middlewares/verifyCompanyMember.js';
import asyncHandler from '../utils/catchAsync.js';
import {
  closeJob,
  openJob,
  createJob,
  deleteJob,
  editJob,
  getCompanyJob,
  getCompanyJobs,
  getCompanyPipelines,
  getPipelineStages,
  getAllJobs,
  getJob,
} from '../controllers/jobs.controller.js';

const jobsRoute: Router = Router();

// Public routes - for job seekers
jobsRoute.get('/all', asyncHandler(getAllJobs));
jobsRoute.get('/:slug', asyncHandler(getJob));

// GET routes - only need company membership verification
jobsRoute.get('/:id/fetch', protect, verifyCompanyMember, asyncHandler(getCompanyJobs));
jobsRoute.get('/:id/fetch/:slug', protect, verifyCompanyMember, asyncHandler(getCompanyJob));
jobsRoute.get('/:id/pipelines', protect, verifyCompanyMember, asyncHandler(getCompanyPipelines));
jobsRoute.get('/:id/pipeline/stages', protect, verifyCompanyMember, asyncHandler(getPipelineStages));

// POST/PUT/PATCH/DELETE routes - need both company membership and role verification
jobsRoute.post('/:id/create', protect, verifyCompanyMember, checkCompanyRole(['ADMIN', 'HR']), asyncHandler(createJob));
jobsRoute.put('/:id/edit/:slug', protect, verifyCompanyMember, checkCompanyRole(['ADMIN', 'HR']), asyncHandler(editJob));
jobsRoute.patch('/:id/close/:slug', protect, verifyCompanyMember, checkCompanyRole(['ADMIN', 'HR']), asyncHandler(closeJob));
jobsRoute.patch('/:id/open/:slug', protect, verifyCompanyMember, checkCompanyRole(['ADMIN', 'HR']), asyncHandler(openJob));
jobsRoute.delete('/:id/delete/:slug', protect, verifyCompanyMember, checkCompanyRole(['ADMIN', 'HR']), asyncHandler(deleteJob));

export default jobsRoute;
