import type { Request, Response, NextFunction } from 'express';
import { UpsertProfile, GetProfileByUserId, UpdateProfileSection, DeleteProfile, CheckProfileCompletion, UpdateProfileImage } from '../services/profile.service.js';
import { BadRequestException } from '../exceptions/exceptions.js';
import { ErrorCodes } from '../exceptions/index.js';
import { uploadProfileImageToCloudinary } from '../utils/cloudinary.js';
import { deleteRedisData } from '../utils/redis.js';

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

    // Invalidate profile cache
    await deleteRedisData('profile');

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

    // Invalidate profile cache
    await deleteRedisData('profile');

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

    // Invalidate profile cache
    await deleteRedisData('profile');

    res.status(200).json({
      success: true,
      message: 'Profile deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user profile image
 * POST /api/v1/profile/image
 */
export const updateProfileImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req.user as any).id;

    if (!userId) {
      throw new BadRequestException('User ID is required', ErrorCodes.BAD_REQUEST);
    }

    if (!req.file) {
      throw new BadRequestException('No image file provided', ErrorCodes.BAD_REQUEST);
    }

    // Validate file type
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedMimeTypes.includes(req.file.mimetype)) {
      throw new BadRequestException('Invalid file type. Only JPEG, PNG, and WebP images are allowed', ErrorCodes.INVALID_FILE_TYPE);
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (req.file.size > maxSize) {
      throw new BadRequestException('File size too large. Maximum size is 5MB', ErrorCodes.INVALID_FILE_TYPE);
    }

    // Upload to Cloudinary
    const uploadResult = await uploadProfileImageToCloudinary(req.file.buffer, userId);

    // Update user profile image
    const updatedUser = await UpdateProfileImage(userId, uploadResult.secure_url);

    // Invalidate profile cache
    await deleteRedisData('profile');

    res.status(200).json({
      success: true,
      message: 'Profile image updated successfully',
      data: {
        user: updatedUser,
        imageUrl: uploadResult.secure_url,
      },
    });
  } catch (error) {
    next(error);
  }
};
