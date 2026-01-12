import { prisma } from '../utils/prismaClient.js';
import { NotFoundException, BadRequestException } from '../exceptions/exceptions.js';
import { ErrorCodes } from '../exceptions/index.js';
import {
  ProfileSchema,
  UpdateProfileSchema,
  ContactSchema,
  BasicInfoSchema,
  SkillsSchema,
  ExperiencesSchema,
  EducationSchema,
  CertificationsSchema,
} from '../models/profile.model.js';

/**
 * Check if a profile is complete based on required fields
 */
export const CheckProfileCompletion = async (userId: string): Promise<boolean> => {
  try {
    const [user, profile] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { firstName: true, lastName: true },
      }),
      prisma.profile.findUnique({
        where: { userId },
      }),
    ]);

    if (!profile || !user) {
      return false;
    }

    // Required fields for profile completion
    const requiredFields = [
      user.firstName,
      user.lastName,
      profile.professionalHeadline,
      profile.aboutMe,
      profile.location,
      profile.skills && profile.skills.length > 0,
      profile.experiences && Array.isArray(profile.experiences) && (profile.experiences as unknown[]).length > 0,
    ];

    // Profile is complete if all required fields are filled
    const isComplete = requiredFields.every((field) => field !== null && field !== undefined && field !== '');

    return isComplete;
  } catch (error) {
    throw error;
  }
};

/**
 * Update user's profile completion status
 */
export const UpdateProfileCompletionStatus = async (userId: string): Promise<boolean> => {
  try {
    const isComplete = await CheckProfileCompletion(userId);

    // Update both isProfileCompleted and hasCompletedProfile to keep them in sync
    await prisma.user.update({
      where: { id: userId },
      data: {
        isProfileCompleted: isComplete,
        hasCompletedProfile: isComplete,
      },
    });

    return isComplete;
  } catch (error) {
    throw error;
  }
};

/**
 * Create or update user profile
 */
export const UpsertProfile = async (userId: string, data: any) => {
  try {
    // Validate the data
    const validatedData = UpdateProfileSchema.parse(data);

    // Check if profile exists
    const existingProfile = await prisma.profile.findUnique({
      where: { userId },
    });

    // Convert undefined to null for Prisma compatibility
    const prismaData = Object.fromEntries(Object.entries(validatedData).map(([key, value]) => [key, value === undefined ? null : value]));

    if (existingProfile) {
      // Update existing profile
      const updatedProfile = await prisma.profile.update({
        where: { userId },
        data: prismaData,
      });

      // Update profile completion status
      await UpdateProfileCompletionStatus(userId);

      return updatedProfile;
    } else {
      // Create new profile
      const newProfile = await prisma.profile.create({
        data: {
          userId,
          ...prismaData,
        },
      });

      // Update profile completion status
      await UpdateProfileCompletionStatus(userId);

      return newProfile;
    }
  } catch (error) {
    throw error;
  }
};

/**
 * Get user profile by userId
 */
export const GetProfileByUserId = async (userId: string) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            isProfileCompleted: true,
            hasCompletedProfile: true,
          },
        },
      },
    });

    if (!profile) {
      return null;
    }

    return profile;
  } catch (error) {
    throw error;
  }
};

/**
 * Update specific profile section
 */
export const UpdateProfileSection = async (userId: string, section: string, data: any) => {
  try {
    const existingProfile = await prisma.profile.findUnique({
      where: { userId },
    });

    // Validate and process data based on section
    let validatedData: any;
    let profileUpdateData: any = {};
    let userUpdateData: any = {};

    switch (section) {
      case 'contact': {
        validatedData = ContactSchema.parse(data);
        profileUpdateData = {
          linkedin: validatedData.linkedin || null,
          github: validatedData.github || null,
          location: validatedData.location || null,
        };
        break;
      }

      case 'basicInfo': {
        validatedData = BasicInfoSchema.parse(data);
        // Update User model fields
        if (validatedData.firstName !== undefined) {
          userUpdateData.firstName = validatedData.firstName || null;
        }
        if (validatedData.lastName !== undefined) {
          userUpdateData.lastName = validatedData.lastName || null;
        }
        // Update Profile model fields
        if (validatedData.professionalHeadline !== undefined) {
          profileUpdateData.professionalHeadline = validatedData.professionalHeadline || null;
        }
        if (validatedData.aboutMe !== undefined) {
          profileUpdateData.aboutMe = validatedData.aboutMe || null;
        }
        break;
      }

      case 'skills': {
        validatedData = SkillsSchema.parse(data);
        profileUpdateData = {
          skills: validatedData.skills || [],
        };
        break;
      }

      case 'experiences': {
        validatedData = ExperiencesSchema.parse(data);
        profileUpdateData = {
          experiences: validatedData.experiences || [],
        };
        break;
      }

      case 'education': {
        validatedData = EducationSchema.parse(data);
        profileUpdateData = {
          education: validatedData.education || [],
        };
        break;
      }

      case 'certifications': {
        validatedData = CertificationsSchema.parse(data);
        profileUpdateData = {
          certifications: validatedData.certifications || [],
        };
        break;
      }

      default:
        throw new BadRequestException(`Invalid section: ${section}`, ErrorCodes.BAD_REQUEST);
    }

    // Update User model if needed (for basicInfo section)
    if (Object.keys(userUpdateData).length > 0) {
      await prisma.user.update({
        where: { id: userId },
        data: userUpdateData,
      });
    }

    // Update or create Profile
    if (!existingProfile) {
      const newProfile = await prisma.profile.create({
        data: {
          userId,
          ...profileUpdateData,
        },
      });

      // Update profile completion status
      await UpdateProfileCompletionStatus(userId);

      return newProfile;
    }

    // Update existing profile
    const updatedProfile = await prisma.profile.update({
      where: { userId },
      data: profileUpdateData,
    });

    // Update profile completion status
    await UpdateProfileCompletionStatus(userId);

    return updatedProfile;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete user profile
 */
export const DeleteProfile = async (userId: string) => {
  try {
    await prisma.profile.delete({
      where: { userId },
    });

    // Update profile completion status
    await prisma.user.update({
      where: { id: userId },
      data: {
        isProfileCompleted: false,
        hasCompletedProfile: false,
      },
    });
  } catch (error) {
    throw error;
  }
};
