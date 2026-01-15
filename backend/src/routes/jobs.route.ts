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
import redisCacheMiddleware from '../middlewares/redis.middleware.js';

const jobsRoute: Router = Router();

// Public routes - for job seekers
jobsRoute.get('/all', redisCacheMiddleware({ EX: 300 }), asyncHandler(getAllJobs)); // 5 minutes TTL
jobsRoute.get('/:slug', redisCacheMiddleware({ EX: 600 }), asyncHandler(getJob)); // 10 minutes TTL

// GET routes - only need company membership verification
jobsRoute.get('/:id/fetch', protect, verifyCompanyMember, redisCacheMiddleware({ EX: 20 }), asyncHandler(getCompanyJobs));
jobsRoute.get('/:id/fetch/:slug', protect, verifyCompanyMember, asyncHandler(getCompanyJob));
jobsRoute.get('/:id/pipelines', protect, verifyCompanyMember, redisCacheMiddleware({ EX: 3600 }), asyncHandler(getCompanyPipelines)); // 1 hour TTL
jobsRoute.get('/:id/pipeline/stages', protect, verifyCompanyMember, redisCacheMiddleware({ EX: 3600 }), asyncHandler(getPipelineStages)); // 1 hour TTL

// POST/PUT/PATCH/DELETE routes - need both company membership and role verification
jobsRoute.post('/:id/create', protect, verifyCompanyMember, checkCompanyRole(['ADMIN', 'HR']), asyncHandler(createJob));
jobsRoute.put('/:id/edit/:slug', protect, verifyCompanyMember, checkCompanyRole(['ADMIN', 'HR']), asyncHandler(editJob));
jobsRoute.patch('/:id/close/:slug', protect, verifyCompanyMember, checkCompanyRole(['ADMIN', 'HR']), asyncHandler(closeJob));
jobsRoute.patch('/:id/open/:slug', protect, verifyCompanyMember, checkCompanyRole(['ADMIN', 'HR']), asyncHandler(openJob));
jobsRoute.delete('/:id/delete/:slug', protect, verifyCompanyMember, checkCompanyRole(['ADMIN', 'HR']), asyncHandler(deleteJob));

export default jobsRoute;
