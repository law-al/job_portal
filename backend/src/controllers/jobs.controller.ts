import type { NextFunction, Request, Response } from 'express';
import { BadRequestException, NotFoundException } from '../exceptions/exceptions.js';
import {
  CloseJob,
  OpenJob,
  FindCompanyJobs,
  CreateJob,
  DeleteJob,
  FindJobBySlug,
  UpdateJob,
  FindCompanyJob,
  FindCompanyPipelines,
  GetPipelineStages,
} from '../services/jobs.service.js';
import { ErrorCodes } from '../exceptions/index.js';

export const createJob = async (req: Request, res: Response, next: NextFunction) => {
  const { id: companyId } = req.params;
  const userId = (req.user as any).id;

  await CreateJob({
    ...req.body,
    companyId: companyId,
    createdBy: userId,
  });

  res.status(201).json({
    success: true,
    message: 'job created successfully',
  });
};

export const editJob = async (req: Request, res: Response, next: NextFunction) => {
  const { id: companyId, slug } = req.params;
  const body = req.body;

  if (!slug) throw new BadRequestException('a job slug is required', ErrorCodes.MISSING_JOB_ID);

  const job = await FindJobBySlug(slug);

  if (!job) throw new NotFoundException(`job with slug ${slug} not found`);

  // Verify job belongs to the company
  if (job.companyId !== companyId) {
    throw new BadRequestException('Job does not belong to this company', ErrorCodes.BAD_REQUEST);
  }

  // Check if job is closed - prevent editing closed jobs
  if (job.status === 'CLOSE' || job.isClosed) {
    throw new BadRequestException('cannot update closed jobs', ErrorCodes.JOB_ALREADY_CLOSED);
  }

  await UpdateJob(job.id, {
    ...body,
    companyId: job.companyId,
    createdBy: job.createdBy,
  });

  res.status(200).json({
    success: true,
    message: 'job updated successfully',
  });
};

export const closeJob = async (req: Request, res: Response, next: NextFunction) => {
  const { id: companyId, slug } = req.params;

  if (!slug) throw new BadRequestException('a job slug is required', ErrorCodes.MISSING_JOB_ID);
  if (!companyId) throw new BadRequestException('a company id is required', ErrorCodes.MISSING_COMPANY_ID);

  const job = await FindJobBySlug(slug);

  if (!job) throw new NotFoundException(`job with slug ${slug} not found`);

  // Verify job belongs to the company
  if (job.companyId !== companyId) {
    throw new BadRequestException('Job does not belong to this company', ErrorCodes.BAD_REQUEST);
  }

  if (job.status === 'CLOSE') {
    return res.status(200).json({
      success: false,
      message: 'job is already closed',
    });
  }

  await CloseJob(job.id);

  res.status(200).json({
    success: true,
    message: 'job closed successfully',
  });
};

export const openJob = async (req: Request, res: Response, next: NextFunction) => {
  const { id: companyId, slug } = req.params;
  const company = (req as any).company;

  if (!slug) throw new BadRequestException('a job slug is required', ErrorCodes.MISSING_JOB_ID);
  if (!companyId) throw new BadRequestException('a company id is required', ErrorCodes.MISSING_COMPANY_ID);

  const job = await FindJobBySlug(slug);

  if (!job) throw new NotFoundException(`job with slug ${slug} not found`);

  // Verify job belongs to the company
  if (job.companyId !== companyId) {
    throw new BadRequestException('Job does not belong to this company', ErrorCodes.BAD_REQUEST);
  }

  if (job.status === 'OPEN') {
    return res.status(200).json({
      success: false,
      message: 'job is already open',
    });
  }

  await OpenJob(job.id);

  res.status(200).json({
    success: true,
    message: 'job opened successfully',
  });
};

export const getCompanyJobs = async (req: Request, res: Response, next: NextFunction) => {
  const { id: companyId } = req.params;
  if (!companyId) throw new BadRequestException('a company id is required', ErrorCodes.MISSING_COMPANY_ID);

  const jobs = await FindCompanyJobs(companyId);

  res.status(200).json({
    success: true,
    message: 'jobs fetched successfully',
    data: { jobs },
  });
};

export const getCompanyJob = async (req: Request, res: Response, next: NextFunction) => {
  const { id: companyId, slug } = req.params;
  const company = (req as any).company;

  if (!slug) throw new BadRequestException('a job slug is required', ErrorCodes.MISSING_JOB_ID);

  const job = await FindCompanyJob(company.id, slug);

  if (!job) throw new NotFoundException(`job with slug ${slug} not found`);

  res.status(200).json({
    success: true,
    message: 'jobs fetched successfully',
    data: { job },
  });
};

export const deleteJob = async (req: Request, res: Response, next: NextFunction) => {
  const { id: companyId, slug } = req.params;

  if (!slug) throw new BadRequestException('a job slug is required', ErrorCodes.MISSING_JOB_ID);

  const job = await FindJobBySlug(slug);

  if (!job) throw new NotFoundException(`job with slug ${slug} not found`);

  // Verify job belongs to the company
  if (job.companyId !== companyId) {
    throw new BadRequestException('Job does not belong to this company', ErrorCodes.BAD_REQUEST);
  }

  // Note: We allow deleting closed jobs, but you can add a check here if needed
  // if (job.status === 'CLOSE' && job.applications?.length > 0) {
  //   throw new BadRequestException('Cannot delete closed jobs with applications', ErrorCodes.BAD_REQUEST);
  // }

  await DeleteJob(job.id);

  res.status(200).json({
    success: true,
    message: 'job deleted successfully',
  });
};

export const getCompanyPipelines = async (req: Request, res: Response, next: NextFunction) => {
  const { id: companyId } = req.params;
  if (!companyId) throw new BadRequestException('a company id is required', ErrorCodes.MISSING_COMPANY_ID);

  const pipelines = await FindCompanyPipelines(companyId);

  res.status(200).json({
    success: true,
    message: 'pipelines fetched successfully',
    data: { pipelines },
  });
};

export const getPipelineStages = async (req: Request, res: Response, next: NextFunction) => {
  const { id: companyId } = req.params;
  const { pipelineName } = req.query;

  if (!companyId) throw new BadRequestException('a company id is required', ErrorCodes.MISSING_COMPANY_ID);
  if (!pipelineName || typeof pipelineName !== 'string') {
    throw new BadRequestException('pipeline name is required', ErrorCodes.BAD_REQUEST);
  }

  const stages = await GetPipelineStages(companyId, pipelineName);

  res.status(200).json({
    success: true,
    message: 'pipeline stages fetched successfully',
    data: { stages: stages || [] },
  });
};
