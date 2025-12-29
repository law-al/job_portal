import type { Request, Response, NextFunction } from 'express';
import { uploadFilesToBucket, uploadFileToBucket } from '../utils/aws.js';
import { BadRequestException, NotFoundException } from '../exceptions/exceptions.js';
import { ErrorCodes } from '../exceptions/index.js';
import {
  CreateApplication,
  GetApplicationsByCompanyId,
  GetApplicationByIdAndCompanyId,
  GetApplicationsByUserId,
  SaveDocumentsToDb,
  MoveApplicationStage,
  AssignApplicationToUser,
  RejectApplication,
} from '../services/applications.service.js';

export const sendApplication = async (req: Request, res: Response, next: NextFunction) => {
  console.log('Entered');
  console.log(req.body);
  const userId = (req.user as any).id;

  const results = await CreateApplication({ ...req.body, userId });

  // const result = await CreateJobApplication(req.body, resumes, supportingDocuments);

  res.status(201).json({
    success: true,
    message: 'application successful',
  });
};

// NOTE: FETCH APPLICATION (Admin)
export const fetchApplications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: companyId } = req.params;
    const { page, limit, status, jobId, assignedTo, search } = req.query;

    if (!companyId) {
      throw new BadRequestException('Company ID is required', ErrorCodes.MISSING_COMPANY_ID);
    }

    const options: {
      page?: number;
      limit?: number;
      status?: string;
      jobId?: string;
      assignedTo?: string;
      search?: string;
    } = {};

    if (page) options.page = parseInt(page as string);
    if (limit) options.limit = parseInt(limit as string);
    if (status) options.status = status as string;
    if (jobId) options.jobId = jobId as string;
    if (assignedTo) options.assignedTo = assignedTo as string;
    if (search) options.search = search as string;

    const applications = await GetApplicationsByCompanyId(companyId, options);

    res.status(200).json({
      success: true,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// NOTE: GET SINGLE APPLICATION (Admin)
export const getApplication = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: companyId, applicationId } = req.params;

    if (!companyId) {
      throw new BadRequestException('Company ID is required', ErrorCodes.MISSING_COMPANY_ID);
    }

    if (!applicationId) {
      throw new BadRequestException('Application ID is required', ErrorCodes.BAD_REQUEST);
    }

    const application = await GetApplicationByIdAndCompanyId(applicationId, companyId);

    console.log(application);

    res.status(200).json({
      success: true,
      data: {
        application,
      },
    });
  } catch (error) {
    next(error);
  }
};

// NOTE: MOVE APPLICATION TO DIFFERENT STAGE (Admin)
export const moveApplicationStage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: companyId, applicationId } = req.params;
    const { stageId } = req.body;
    const userId = (req.user as any).id;

    if (!companyId) {
      throw new BadRequestException('Company ID is required', ErrorCodes.MISSING_COMPANY_ID);
    }

    if (!applicationId) {
      throw new BadRequestException('Application ID is required', ErrorCodes.BAD_REQUEST);
    }

    if (!stageId) {
      throw new BadRequestException('Stage ID is required', ErrorCodes.BAD_REQUEST);
    }

    const updatedApplication = await MoveApplicationStage(applicationId, companyId, stageId, userId);

    // Check if status was automatically updated to OFFER
    const maxOrder = Math.max(...updatedApplication.job.pipelineStages.map((s) => s.order));
    const isFinalStage = updatedApplication.pipelineStage?.order === maxOrder;
    const statusUpdated = isFinalStage && updatedApplication.status === 'OFFER';

    res.status(200).json({
      success: true,
      message: statusUpdated ? 'Application moved to final stage. Status automatically updated to OFFER.' : 'Application stage updated successfully',
      data: {
        application: updatedApplication,
        statusUpdated,
        isFinalStage,
      },
    });
  } catch (error) {
    next(error);
  }
};

// NOTE: ASSIGN APPLICATION TO USER (Admin)
export const assignApplicationToUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: companyId, applicationId } = req.params;
    const { assignedTo } = req.body;
    const userId = (req.user as any).id;

    if (!companyId) {
      throw new BadRequestException('Company ID is required', ErrorCodes.MISSING_COMPANY_ID);
    }

    if (!applicationId) {
      throw new BadRequestException('Application ID is required', ErrorCodes.BAD_REQUEST);
    }

    const updatedApplication = await AssignApplicationToUser(applicationId, companyId, assignedTo || null, userId);

    res.status(200).json({
      success: true,
      message: assignedTo ? 'Application assigned successfully' : 'Application unassigned successfully',
      data: {
        application: updatedApplication,
      },
    });
  } catch (error) {
    next(error);
  }
};

// NOTE: REJECT APPLICATION (Admin)
export const rejectApplication = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: companyId, applicationId } = req.params;
    const userId = (req.user as any).id;

    if (!companyId) {
      throw new BadRequestException('Company ID is required', ErrorCodes.MISSING_COMPANY_ID);
    }

    if (!applicationId) {
      throw new BadRequestException('Application ID is required', ErrorCodes.BAD_REQUEST);
    }

    const updatedApplication = await RejectApplication(applicationId, companyId, userId);

    res.status(200).json({
      success: true,
      message: 'Application rejected successfully',
      data: {
        application: updatedApplication,
      },
    });
  } catch (error) {
    next(error);
  }
};

// NOTE: GET USER APPLICATIONS (For Job Seekers)
export const getUserApplications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const authenticatedUserId = (req.user as any).id;
    const { page, limit, status, jobId, search } = req.query;

    if (!userId) {
      throw new BadRequestException('User ID is required', ErrorCodes.BAD_REQUEST);
    }

    // Security: Users can only fetch their own applications
    if (userId !== authenticatedUserId) {
      throw new BadRequestException('Unauthorized: You can only fetch your own applications', ErrorCodes.BAD_REQUEST);
    }

    const options: {
      page?: number;
      limit?: number;
      status?: string;
      jobId?: string;
      search?: string;
    } = {};

    if (page) options.page = parseInt(page as string);
    if (limit) options.limit = parseInt(limit as string);
    if (status) options.status = status as string;
    if (jobId) options.jobId = jobId as string;
    if (search) options.search = search as string;

    const applications = await GetApplicationsByUserId(userId, options);

    res.status(200).json({
      success: true,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};
