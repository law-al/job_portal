import type { Request, Response, NextFunction } from 'express';
import { UpsertProfile, GetProfileByUserId, UpdateProfileSection, DeleteProfile, CheckProfileCompletion } from '../services/profile.service.js';
import { BadRequestException } from '../exceptions/exceptions.js';
import { ErrorCodes } from '../exceptions/index.js';

/**
 * Get user profile
 * GET /api/v1/profile
 */
export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req.user as any).id;

    if (!userId) {
      throw new BadRequestException('User ID is required', ErrorCodes.BAD_REQUEST);
    }

    const profile = await GetProfileByUserId(userId);

    if (!profile) {
      return res.status(200).json({
        success: true,
        message: 'Profile not found',
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile fetched successfully',
      data: { profile },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create or update user profile
 * PUT /api/v1/profile
 */
export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req.user as any).id;

    if (!userId) {
      throw new BadRequestException('User ID is required', ErrorCodes.BAD_REQUEST);
    }

    const profile = await UpsertProfile(userId, req.body);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: { profile },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update specific profile section
 * PATCH /api/v1/profile/section/:section
 */
export const updateProfileSection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req.user as any).id;
    const { section } = req.params;

    if (!userId) {
      throw new BadRequestException('User ID is required', ErrorCodes.BAD_REQUEST);
    }

    if (!section) {
      throw new BadRequestException('Section name is required', ErrorCodes.BAD_REQUEST);
    }

    // Valid sections (grouped)
    const validSections = ['contact', 'basicInfo', 'skills', 'experiences', 'education', 'certifications'];

    if (!validSections.includes(section)) {
      throw new BadRequestException(`Invalid section: ${section}. Valid sections are: ${validSections.join(', ')}`, ErrorCodes.BAD_REQUEST);
    }

    const profile = await UpdateProfileSection(userId, section, req.body);

    res.status(200).json({
      success: true,
      message: `${section} updated successfully`,
      data: { profile },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Check profile completion status
 * GET /api/v1/profile/completion
 */
export const checkProfileCompletion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req.user as any).id;

    if (!userId) {
      throw new BadRequestException('User ID is required', ErrorCodes.BAD_REQUEST);
    }

    const isComplete = await CheckProfileCompletion(userId);

    res.status(200).json({
      success: true,
      message: 'Profile completion status fetched successfully',
      data: { isComplete },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user profile
 * DELETE /api/v1/profile
 */
export const deleteProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req.user as any).id;

    if (!userId) {
      throw new BadRequestException('User ID is required', ErrorCodes.BAD_REQUEST);
    }

    await DeleteProfile(userId);

    res.status(200).json({
      success: true,
      message: 'Profile deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
