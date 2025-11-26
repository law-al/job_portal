import type { NextFunction, Request, Response } from 'express';
import {
  BadRequestException,
  NotFoundException,
} from '../exceptions/exceptions.js';
import {
  FindCompanyById,
  FindCompanyMember,
} from '../services/company.service.js';
import {
  CloseJob,
  FindCompanyJobs,
  CreateJob,
  DeleteJob,
  FindJobBySlug,
  UpdateJob,
  FindCompanyJob,
} from '../services/jobs.service.js';
import { ErrorCodes } from '../exceptions/index.js';

export const createJob = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id: companyId } = req.params;

  if (!companyId)
    throw new BadRequestException(
      'a company id needs to be provided',
      ErrorCodes.MISSING_COMPANY_ID,
    );

  const company = await FindCompanyById(companyId);

  const member = await FindCompanyMember(companyId, req.user.id);

  await CreateJob({
    ...req.body,
    companyId: company.id,
    createdBy: member?.userId,
  });

  res.status(201).json({
    success: true,
    message: 'job created successfully',
  });
};

export const editJob = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { slug } = req.params;
  const body = req.body;

  if (!slug)
    throw new BadRequestException(
      'a job id is required',
      ErrorCodes.MISSING_JOB_ID,
    );

  const job = await FindJobBySlug(slug);

  if (!job) throw new NotFoundException(`job with slug ${slug} not found`);

  if (job.status === 'CLOSE')
    throw new BadRequestException(
      'cannot update closed jobs',
      ErrorCodes.JOB_ALREADY_CLOSED,
    );

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

export const closeJob = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { slug } = req.params;

  if (!slug)
    throw new BadRequestException(
      'a job id is required',
      ErrorCodes.MISSING_JOB_ID,
    );

  const job = await FindJobBySlug(slug);

  if (!job) throw new NotFoundException(`job with slug ${slug} not found`);

  if (job.status === 'CLOSE') {
    return res.status(200).json({
      success: false,
      message: 'job closed already',
    });
  }

  await CloseJob(job.id);

  res.status(200).json({
    success: true,
    message: 'job closed successfully',
  });
};

export const getCompanyJobs = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id: companyId } = req.params;

  if (!companyId)
    throw new BadRequestException(
      'a company id is required',
      ErrorCodes.MISSING_COMPANY_ID,
    );

  const company = await FindCompanyById(companyId);

  if (!company)
    throw new NotFoundException(`company with id ${companyId} not found`);

  const jobs = await FindCompanyJobs(companyId);

  res.status(200).json({
    success: true,
    message: 'jobs fetched successfully',
    data: { jobs },
  });
};

export const getCompanyJob = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id: companyId } = req.params;
  const { slug } = req.params;

  if (!companyId)
    throw new BadRequestException(
      'a company id is required',
      ErrorCodes.MISSING_COMPANY_ID,
    );
  if (!slug)
    throw new BadRequestException(
      'a job id needs to be provided',
      ErrorCodes.MISSING_JOB_ID,
    );

  const company = await FindCompanyById(companyId);

  if (!company)
    throw new NotFoundException(`company with id ${companyId} not found`);

  const job = await FindCompanyJob(company.id, slug);

  if (!job) throw new NotFoundException(`job with slug ${slug} not found`);

  res.status(200).json({
    success: true,
    message: 'jobs fetched successfully',
    data: { job },
  });
};

export const deleteJob = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { slug } = req.params;

  if (!slug)
    throw new BadRequestException(
      'a job id is required',
      ErrorCodes.MISSING_JOB_ID,
    );

  const job = await FindJobBySlug(slug);

  if (!job) throw new NotFoundException(`job with slug ${slug} not found`);

  await DeleteJob(job.id);

  res.status(200).json({
    success: true,
    message: 'job deleted successfully',
  });
};

export const CreatePipeline = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {};
