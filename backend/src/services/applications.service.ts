// export const CreateJobApplication = async ({ body, resumes }) => {};

import mongoose from 'mongoose';
import { uploadFilesToBucket } from '../utils/aws.js';
import { Document } from '../models/document/document.model.js';
import { submitApplicationSchema } from '../models/application.model.js';
import { FindJobId, GetPipelineStagesByJobId } from './jobs.service.js';
import { BadRequestException, NotFoundException } from '../exceptions/exceptions.js';
import { ErrorCodes } from '../exceptions/index.js';
import { FindUserById } from './auth.service.js';
import { prisma } from '../utils/prismaClient.js';
import { FindCompanyByJobId } from './company.service.js';
import { CreateActivity } from './activities.service.js';

interface Resume {
  url: string;
  originalName: string;
  size: string;
}

// NOTE: Create Application
export const CreateApplication = async (body: any) => {
  try {
    const documentsId = body.documentsId && Array.isArray(body.documentsId) ? body.documentsId : body.documentsId ? [body.documentsId] : [];
    const validatedBody = submitApplicationSchema.parse({ ...body, documentsId });

    const job = await FindJobId(validatedBody.jobId);
    const user = await FindUserById(validatedBody.userId);
    if (!job) throw new NotFoundException('Job not found');
    if (!user) throw new NotFoundException('User not found');

    const company = await FindCompanyByJobId(validatedBody.jobId);

    const pipelineStages = await GetPipelineStagesByJobId(job.id);

    const application = await prisma.application.create({
      data: {
        currentLocation: validatedBody.location,
        email: validatedBody.email,
        firstName: validatedBody.firstName,
        lastName: validatedBody.lastName,
        phone: validatedBody.phone,
        coverLetter: validatedBody.coverLetter || '',
        companyId: company.id,
        jobId: validatedBody.jobId,
        userId: validatedBody.userId,
        resumeId: validatedBody.resumeId || null,
        stageId: pipelineStages[0]?.id || null,
        documentsIds: validatedBody.documentsId || [],
      },
    });

    // Create APPLICATION_CREATED activity
    try {
      await CreateActivity(
        {
          applicationId: application.id,
          actorId: validatedBody.userId,
          type: 'APPLICATION_CREATED',
          message: `${validatedBody.firstName} ${validatedBody.lastName} applied for ${job.title}`,
          metadata: {
            jobTitle: job.title,
            jobId: job.id,
          },
        },
        company.id,
      );
    } catch (error) {
      // Log error but don't fail the application creation
      console.error('Failed to create activity for application creation:', error);
    }

    return application;
  } catch (error) {
    throw error;
  }
};

// NOTE: GET SINGLE APPLICATION BY ID AND COMPANY ID
export const GetApplicationById = async (id: string) => {
  try {
    let resume: Resume | null;
    const application = await prisma.application.findFirst({
      where: {
        id,
      },
    });

    if (!application) {
      throw new NotFoundException(`Application with id ${id} not found`);
    }

    return application;
  } catch (error) {
    throw error;
  }
};

// NOTE: GET SINGLE APPLICATION BY ID AND COMPANY ID
export const GetApplicationByIdAndCompanyId = async (applicationId: string, companyId: string) => {
  try {
    let resume: Resume | null = null;

    const application = await prisma.application.findFirst({
      where: {
        id: applicationId,
        companyId, // Ensure application belongs to the company
      },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            slug: true,
            status: true,
            description: true,
            location: true,
            jobType: true,
            experienceLevel: true,
            salary_range: true,
            isRemote: true,
            createdAt: true,
            pipelineStages: {
              select: {
                id: true,
                jobId: true,
                name: true,
                order: true,
              },
              orderBy: {
                order: 'asc',
              },
            },
          },
        },
        pipelineStage: {
          select: {
            id: true,
            name: true,
            order: true,
          },
        },
        applicant: {
          select: {
            id: true,
            email: true,
          },
        },
        assigned: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
          },
        },
      },
    });

    if (!application) {
      throw new NotFoundException(`Application with id ${applicationId} not found`);
    }

    // Fetch resume if resumeId exists (using mongoose Document model)
    if (application.resumeId) {
      resume = await Document.findById(application.resumeId);
    }

    return { ...application, resume };
  } catch (error) {
    throw error;
  }
};

export const GetApplicationsByCompanyId = async (
  companyId: string,
  options?: {
    page?: number;
    limit?: number;
    status?: string;
    jobId?: string;
    assignedTo?: string;
    search?: string;
  },
) => {
  try {
    const page = options?.page || 1;
    const limit = options?.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {
      companyId,
    };

    // Add filters
    if (options?.status) {
      where.status = options.status;
    }

    if (options?.jobId) {
      where.jobId = options.jobId;
    }

    if (options?.assignedTo) {
      where.assignedTo = options.assignedTo;
    }

    if (options?.search) {
      where.OR = [
        {
          firstName: {
            contains: options.search,
            mode: 'insensitive',
          },
        },
        {
          lastName: {
            contains: options.search,
            mode: 'insensitive',
          },
        },
        {
          email: {
            contains: options.search,
            mode: 'insensitive',
          },
        },
        {
          job: {
            title: {
              contains: options.search,
              mode: 'insensitive',
            },
          },
        },
      ];
    }

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where,
        include: {
          job: {
            select: {
              id: true,
              title: true,
              slug: true,
              status: true,
            },
          },
          pipelineStage: {
            select: {
              id: true,
              name: true,
              order: true,
            },
          },
          applicant: {
            select: {
              id: true,
              email: true,
            },
          },
          assigned: {
            select: {
              id: true,
              user: {
                select: {
                  id: true,
                  email: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.application.count({ where }),
    ]);

    return {
      applications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    throw error;
  }
};

// NOTE: GET APPLICATIONS BY USER ID (For Job Seekers)
export const GetApplicationsByUserId = async (
  userId: string,
  options?: {
    page?: number;
    limit?: number;
    status?: string;
    jobId?: string;
    search?: string;
  },
) => {
  try {
    const page = options?.page || 1;
    const limit = options?.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {
      userId,
    };

    // Add filters
    if (options?.status) {
      where.status = options.status;
    }

    if (options?.jobId) {
      where.jobId = options.jobId;
    }

    if (options?.search) {
      where.OR = [
        {
          job: {
            title: {
              contains: options.search,
              mode: 'insensitive',
            },
          },
        },
        {
          job: {
            company: {
              name: {
                contains: options.search,
                mode: 'insensitive',
              },
            },
          },
        },
      ];
    }

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where,
        include: {
          job: {
            select: {
              id: true,
              title: true,
              slug: true,
              status: true,
              company: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          pipelineStage: {
            select: {
              id: true,
              name: true,
              order: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.application.count({ where }),
    ]);

    return {
      applications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    throw error;
  }
};

export const SaveDocumentsToDb = async ({ resumes, supportingDocuments }: { resumes: Express.Multer.File[] | []; supportingDocuments: Express.Multer.File[] | [] }) => {
  try {
    if (resumes && resumes.length > 0) {
      const results = await uploadFilesToBucket(resumes, 'resume');
    }

    if (supportingDocuments && supportingDocuments.length > 0) {
      const result = await uploadFilesToBucket(supportingDocuments, 'resume');
      console.log(result);
    }
  } catch (error) {}
};

// NOTE: ASSIGN APPLICATION TO USER
export const AssignApplicationToUser = async (applicationId: string, companyId: string, assignedTo: string | null, actorId: string) => {
  try {
    // Verify application belongs to company
    const application = await prisma.application.findFirst({
      where: {
        id: applicationId,
        companyId,
      },
      include: {
        assigned: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!application) {
      throw new NotFoundException(`Application with id ${applicationId} not found`);
    }

    // Verify assigned user is a member of the company if assignedTo is provided
    if (assignedTo) {
      const userCompany = await prisma.userCompany.findFirst({
        where: {
          id: assignedTo,
          companyId,
          status: 'ACTIVE',
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      });

      if (!userCompany) {
        throw new BadRequestException('Assigned user is not a member of this company', ErrorCodes.BAD_REQUEST);
      }
    }

    const oldAssignedEmail = application.assigned?.user?.email || null;
    // FIND USER BASED ON ASSIGNED TO ID
    const newAssignedEmail = assignedTo
      ? await prisma.userCompany
          .findFirst({
            where: { id: assignedTo },
            include: { user: { select: { email: true } } },
          }) // after promise is resolved, get user email
          .then((uc) => uc?.user.email || null)
      : null;

    // Update application assignment
    const updatedApplication = await prisma.application.update({
      where: {
        id: applicationId,
      },
      data: {
        assignedTo: assignedTo || null,
      },
      include: {
        assigned: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
      },
    });

    // Create ASSIGNED or UNASSIGNED activity
    try {
      if (assignedTo && !oldAssignedEmail) {
        // New assignment
        await CreateActivity(
          {
            applicationId,
            actorId,
            type: 'ASSIGNED',
            message: assignedTo ? `Assigned to ${newAssignedEmail || 'team member'}` : 'Unassigned',
            metadata: {
              assignedTo,
              assignedToEmail: newAssignedEmail,
            },
          },
          companyId,
        );
      } else if (!assignedTo && oldAssignedEmail) {
        // Unassignment
        await CreateActivity(
          {
            applicationId,
            actorId,
            type: 'UNASSIGNED',
            message: `Unassigned from ${oldAssignedEmail}`,
            metadata: {
              previousAssignedTo: application.assigned?.id || null,
              previousAssignedToEmail: oldAssignedEmail,
            },
          },
          companyId,
        );
      } else if (assignedTo && oldAssignedEmail && oldAssignedEmail !== newAssignedEmail) {
        // Reassignment
        await CreateActivity(
          {
            applicationId,
            actorId,
            type: 'ASSIGNED',
            message: `Reassigned from ${oldAssignedEmail} to ${newAssignedEmail || 'team member'}`,
            metadata: {
              fromAssignedTo: application.assigned?.id || null,
              fromAssignedToEmail: oldAssignedEmail,
              toAssignedTo: assignedTo,
              toAssignedToEmail: newAssignedEmail,
            },
          },
          companyId,
        );
      }
    } catch (error) {
      // Log error but don't fail the assignment
      console.error('Failed to create activity for assignment:', error);
    }

    return updatedApplication;
  } catch (error) {
    throw error;
  }
};

// NOTE: MOVE APPLICATION TO DIFFERENT PIPELINE STAGE
export const MoveApplicationStage = async (applicationId: string, companyId: string, stageId: string, actorId?: string) => {
  try {
    // Verify application belongs to company
    const application = await prisma.application.findFirst({
      where: {
        id: applicationId,
        companyId,
      },
      include: {
        job: {
          include: {
            pipelineStages: true,
          },
        },
        pipelineStage: {
          select: {
            id: true,
            name: true,
            order: true,
          },
        },
      },
    });

    if (!application) {
      throw new NotFoundException(`Application with id ${applicationId} not found`);
    }

    // Verify stage belongs to the same job
    const newStage = application.job.pipelineStages.find((stage) => stage.id === stageId);

    if (!newStage) {
      throw new BadRequestException('Pipeline stage does not belong to this job', ErrorCodes.BAD_REQUEST);
    }

    const oldStageName = application.pipelineStage?.name || 'Applied';
    const newStageName = newStage.name;

    // Check if this is the final stage (highest order)
    const maxOrder = Math.max(...application.job.pipelineStages.map((s) => s.order));
    const isFinalStage = newStage.order === maxOrder;

    // Determine if status should be updated to OFFER
    const shouldUpdateToOffer = isFinalStage && application.status !== 'OFFER' && application.status !== 'HIRED' && application.status !== 'REJECTED';

    // Update application stage and optionally status
    const updatedApplication = await prisma.application.update({
      where: {
        id: applicationId,
      },
      data: {
        stageId,
        ...(shouldUpdateToOffer && { status: 'OFFER' }),
      },
      include: {
        pipelineStage: {
          select: {
            id: true,
            name: true,
            order: true,
          },
        },
        job: {
          include: {
            pipelineStages: true,
          },
        },
      },
    });

    // Create STAGE_CHANGED activity
    if (actorId && oldStageName !== newStageName) {
      try {
        let activityMessage = `Moved from ${oldStageName} to ${newStageName}`;
        const activityMetadata: Record<string, any> = {
          fromStage: oldStageName,
          toStage: newStageName,
          fromStageId: application.pipelineStage?.id || null,
          toStageId: stageId,
        };

        // If reached final stage and status was updated, add that info
        if (shouldUpdateToOffer) {
          activityMessage = `Reached final stage: ${newStageName}. Status automatically updated to OFFER.`;
          activityMetadata.isFinalStage = true;
          activityMetadata.statusUpdated = true;
          activityMetadata.newStatus = 'OFFER';
          activityMetadata.previousStatus = application.status;
        }

        await CreateActivity(
          {
            applicationId,
            actorId,
            type: 'STAGE_CHANGED',
            message: activityMessage,
            metadata: activityMetadata,
          },
          companyId,
        );
      } catch (error) {
        // Log error but don't fail the stage update
        console.error('Failed to create activity for stage change:', error);
      }
    }

    return updatedApplication;
  } catch (error) {
    throw error;
  }
};

// NOTE: REJECT APPLICATION
export const RejectApplication = async (applicationId: string, companyId: string, actorId: string) => {
  try {
    // Verify application belongs to company
    const application = await prisma.application.findFirst({
      where: {
        id: applicationId,
        companyId,
      },
      include: {
        job: {
          select: {
            id: true,
            title: true,
          },
        },
        pipelineStage: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!application) {
      throw new NotFoundException(`Application with id ${applicationId} not found`);
    }

    // Check if already rejected
    if (application.status === 'REJECTED') {
      throw new BadRequestException('Application is already rejected', ErrorCodes.BAD_REQUEST);
    }

    const previousStatus = application.status;

    // Update application status to REJECTED
    const updatedApplication = await prisma.application.update({
      where: {
        id: applicationId,
      },
      data: {
        status: 'REJECTED',
      },
      include: {
        job: {
          select: {
            id: true,
            title: true,
          },
        },
        pipelineStage: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Create STATUS_CHANGED activity
    try {
      await CreateActivity(
        {
          applicationId,
          actorId,
          type: 'STATUS_CHANGED',
          message: `Application status changed from ${previousStatus} to REJECTED`,
          metadata: {
            fromStatus: previousStatus,
            toStatus: 'REJECTED',
            jobTitle: application.job.title,
            jobId: application.job.id,
          },
        },
        companyId,
      );
    } catch (error) {
      // Log error but don't fail the rejection
      console.error('Failed to create activity for rejection:', error);
    }

    return updatedApplication;
  } catch (error) {
    throw error;
  }
};

export const SaveResumeToDb = async (resumes: Express.Multer.File[] | [], type: string = 'resume') => {
  let uploadedDocument: {
    key: string;
    type: string | null;
    originalName: string;
    url: string;
  }[] = [];

  const session = await mongoose.startSession();

  try {
    if (resumes && resumes.length > 0) {
      uploadedDocument = await uploadFilesToBucket(resumes, type);
    }

    if (uploadedDocument.length > 0) {
      await session.withTransaction(async () => {
        for (const result of uploadedDocument) {
          await Document.create(
            [
              {
                documentType: type,
                createdAt: result.key,
                originalName: result.originalName,
                key: result.key,
                url: result.url,
              },
            ],
            { session },
          );
        }
      });
    }
  } catch (error) {}
};
