import type { Request, Response, NextFunction } from 'express';
import { BadRequestException } from '../exceptions/exceptions.js';
import { ErrorCodes } from '../exceptions/index.js';
import { CreateActivity, GetActivitiesByApplicationId, GetActivityById } from '../services/activities.service.js';

// NOTE: Create a new activity
export const createActivity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: companyId, applicationId } = req.params;
    const { type, message, metadata } = req.body;
    const userId = (req.user as any).id;

    if (!companyId) {
      throw new BadRequestException('Company ID is required', ErrorCodes.MISSING_COMPANY_ID);
    }

    if (!applicationId) {
      throw new BadRequestException('Application ID is required', ErrorCodes.BAD_REQUEST);
    }

    if (!type) {
      throw new BadRequestException('Activity type is required', ErrorCodes.BAD_REQUEST);
    }

    if (!message) {
      throw new BadRequestException('Activity message is required', ErrorCodes.BAD_REQUEST);
    }

    const activity = await CreateActivity(
      {
        applicationId,
        actorId: userId,
        type,
        message,
        metadata,
      },
      companyId,
    );

    res.status(201).json({
      success: true,
      message: 'Activity created successfully',
      data: activity,
    });
  } catch (error) {
    next(error);
  }
};

// NOTE: Get all activities for an application
export const getActivitiesByApplication = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: companyId, applicationId } = req.params;

    if (!companyId) {
      throw new BadRequestException('Company ID is required', ErrorCodes.MISSING_COMPANY_ID);
    }

    if (!applicationId) {
      throw new BadRequestException('Application ID is required', ErrorCodes.BAD_REQUEST);
    }

    const activities = await GetActivitiesByApplicationId(applicationId, companyId);

    res.status(200).json({
      success: true,
      data: activities,
    });
  } catch (error) {
    next(error);
  }
};

// NOTE: Get a single activity by ID
export const getActivityById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: companyId, activityId } = req.params;

    if (!companyId) {
      throw new BadRequestException('Company ID is required', ErrorCodes.MISSING_COMPANY_ID);
    }

    if (!activityId) {
      throw new BadRequestException('Activity ID is required', ErrorCodes.BAD_REQUEST);
    }

    const activity = await GetActivityById(activityId, companyId);

    res.status(200).json({
      success: true,
      data: activity,
    });
  } catch (error) {
    next(error);
  }
};
