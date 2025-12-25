import { prisma } from '../utils/prismaClient.js';
import { NotFoundException, BadRequestException, ForbiddenException } from '../exceptions/exceptions.js';
import { ErrorCodes } from '../exceptions/index.js';

interface CreateActivityData {
  applicationId: string;
  actorId: string;
  type: string;
  message: string;
  metadata?: Record<string, any>;
}

// NOTE: Create a new activity
export const CreateActivity = async (data: CreateActivityData, companyId: string) => {
  try {
    // Validate required fields
    if (!data.applicationId || !data.type || !data.message) {
      throw new BadRequestException('Application ID, type, and message are required', ErrorCodes.BAD_REQUEST);
    }

    // Verify application exists and belongs to company
    const application = await prisma.application.findFirst({
      where: {
        id: data.applicationId,
        companyId,
      },
      select: {
        id: true,
      },
    });

    if (!application) {
      throw new NotFoundException('Application not found', ErrorCodes.APPLICATION_NOT_FOUND);
    }

    // Verify actor is a member of the company
    if (data.actorId) {
      const userCompany = await prisma.userCompany.findFirst({
        where: {
          userId: data.actorId,
          companyId,
          status: 'ACTIVE',
        },
      });

      if (!userCompany) {
        throw new ForbiddenException('Actor is not a member of this company', ErrorCodes.FORBIDDEN);
      }
    }

    // Validate activity type
    const validTypes = [
      'STAGE_CHANGED',
      'STATUS_CHANGED',
      'ASSIGNED',
      'UNASSIGNED',
      'NOTE_ADDED',
      'COMMENT',
      'EMAIL_SENT',
      'INTERVIEW_SCHEDULED',
      'INTERVIEW_UPDATED',
      'INTERVIEW_CANCELED',
      'FILE_UPLOADED',
      'PIPELINE_AUTOMATION',
      'APPLICATION_CREATED',
    ];

    if (!validTypes.includes(data.type)) {
      throw new BadRequestException(`Invalid activity type. Must be one of: ${validTypes.join(', ')}`, ErrorCodes.BAD_REQUEST);
    }

    // Create the activity
    const activity = await prisma.applicationActivity.create({
      data: {
        applicationId: data.applicationId,
        actorId: data.actorId || null,
        type: data.type as any,
        message: data.message,
        metadata: data.metadata || {},
      },
      include: {
        actor: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    return {
      id: activity.id,
      applicationId: activity.applicationId,
      actor: activity.actor
        ? {
            id: activity.actor.id,
            email: activity.actor.email,
          }
        : null,
      type: activity.type,
      message: activity.message,
      metadata: activity.metadata,
      createdAt: activity.createdAt,
    };
  } catch (error) {
    throw error;
  }
};

// NOTE: Get all activities for an application
export const GetActivitiesByApplicationId = async (applicationId: string, companyId: string) => {
  try {
    // Verify application exists and belongs to company
    const application = await prisma.application.findFirst({
      where: {
        id: applicationId,
        companyId,
      },
      select: {
        id: true,
      },
    });

    if (!application) {
      throw new NotFoundException('Application not found', ErrorCodes.APPLICATION_NOT_FOUND);
    }

    const activities = await prisma.applicationActivity.findMany({
      where: {
        applicationId,
      },
      include: {
        actor: {
          select: {
            id: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return activities.map((activity) => ({
      id: activity.id,
      applicationId: activity.applicationId,
      actor: activity.actor
        ? {
            id: activity.actor.id,
            email: activity.actor.email,
          }
        : null,
      type: activity.type,
      message: activity.message,
      metadata: activity.metadata,
      createdAt: activity.createdAt,
    }));
  } catch (error) {
    throw error;
  }
};

// NOTE: Get a single activity by ID
export const GetActivityById = async (activityId: string, companyId: string) => {
  try {
    const activity = await prisma.applicationActivity.findFirst({
      where: {
        id: activityId,
        application: {
          companyId,
        },
      },
      include: {
        actor: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    if (!activity) {
      throw new NotFoundException('Activity not found', ErrorCodes.RECORD_NOT_FOUND);
    }

    return {
      id: activity.id,
      applicationId: activity.applicationId,
      actor: activity.actor
        ? {
            id: activity.actor.id,
            email: activity.actor.email,
          }
        : null,
      type: activity.type,
      message: activity.message,
      metadata: activity.metadata,
      createdAt: activity.createdAt,
    };
  } catch (error) {
    throw error;
  }
};
