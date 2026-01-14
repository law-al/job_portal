'use server';

import { z } from 'zod';
import { authOptions } from '@/auth';
import { getServerSession } from 'next-auth';
import { fetchWithRetry } from '@/lib/fetchWithRetry';
import { revalidatePath } from 'next/cache';

// Contact section schema
const ContactSchema = z.object({
  linkedin: z.string().url().max(255).optional().or(z.literal('')),
  github: z.string().url().max(255).optional().or(z.literal('')),
  location: z.string().max(255).optional(),
});

// Basic Info section schema
const BasicInfoSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100).optional(),
  lastName: z.string().min(1, 'Last name is required').max(100).optional(),
  professionalHeadline: z.string().max(255).optional(),
  aboutMe: z.string().max(5000).optional(),
});

// Experience entry schema
const ExperienceEntrySchema = z.object({
  title: z.string().min(1, 'Job title is required').max(255),
  company: z.string().min(1, 'Company name is required').max(255),
  location: z.string().max(255).optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional().nullable(),
  description: z.string().max(2000).optional(),
  isCurrent: z.boolean().default(false),
});

// Experiences section schema
const ExperiencesSchema = z.object({
  experiences: z.array(ExperienceEntrySchema).default([]),
});

// Education entry schema
const EducationEntrySchema = z.object({
  degree: z.string().min(1, 'Degree is required').max(255),
  institution: z.string().min(1, 'Institution name is required').max(255),
  fieldOfStudy: z.string().max(255).optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional().nullable(),
  isCurrent: z.boolean().default(false),
});

// Education section schema
const EducationSchema = z.object({
  education: z.array(EducationEntrySchema).default([]),
});

// Certification entry schema
const CertificationEntrySchema = z.object({
  name: z.string().min(1, 'Certification name is required').max(255),
  issuer: z.string().min(1, 'Issuer name is required').max(255),
  issueDate: z.string().min(1, 'Issue date is required'),
  expiryDate: z.string().optional().nullable(),
  credentialUrl: z.string().url().max(500).optional().or(z.literal('')),
});

// Certifications section schema
const CertificationsSchema = z.object({
  certifications: z.array(CertificationEntrySchema).default([]),
});

export interface ProfileActionState {
  success: boolean;
  message?: string;
  errors?: string | Record<string, string[]>;
}

/**
 * Update profile contact section
 */
export async function updateContactInfoAction(formData: { linkedin?: string; github?: string; location?: string }): Promise<ProfileActionState> {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return {
        success: false,
        errors: 'Session expired, please login again to perform this action',
      };
    }

    // Validate the form data
    const parsedData = ContactSchema.safeParse(formData);

    if (!parsedData.success) {
      return {
        success: false,
        errors: parsedData.error.flatten().fieldErrors,
      };
    }

    // Prepare request body (remove empty strings, convert to null)
    const requestBody: Record<string, string | null> = {};
    if (parsedData.data.linkedin !== undefined) {
      requestBody.linkedin = parsedData.data.linkedin || null;
    }
    if (parsedData.data.github !== undefined) {
      requestBody.github = parsedData.data.github || null;
    }
    if (parsedData.data.location !== undefined) {
      requestBody.location = parsedData.data.location || null;
    }

    // Call API
    const response = await fetchWithRetry({
      url: `profile/section/contact`,
      options: {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${(session.user as { accessToken?: string }).accessToken ?? ''}`,
        },
        credentials: 'include',
        body: JSON.stringify(requestBody),
      },
      refreshTokenHash: (session.user as { refreshTokenHash?: string }).refreshTokenHash,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to update contact info' }));

      return {
        success: false,
        errors: errorData.message || 'Failed to update contact info. Please try again.',
      };
    }

    await response.json();

    // Revalidate the profile page
    revalidatePath('/profile');

    return {
      success: true,
      message: 'Contact information updated successfully',
      errors: undefined,
    };
  } catch (error) {
    console.error('Error updating contact info:', error);
    return {
      success: false,
      errors: 'An unexpected error occurred. Please try again.',
    };
  }
}

/**
 * Update profile basic info section
 */
export async function updateBasicInfoAction(formData: { firstName?: string; lastName?: string; professionalHeadline?: string; aboutMe?: string }): Promise<ProfileActionState> {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return {
        success: false,
        errors: 'Session expired, please login again to perform this action',
      };
    }

    // Validate the form data
    const parsedData = BasicInfoSchema.safeParse(formData);

    if (!parsedData.success) {
      return {
        success: false,
        errors: parsedData.error.flatten().fieldErrors,
      };
    }

    // Prepare request body (remove undefined values)
    const requestBody: Record<string, string | null> = {};
    if (parsedData.data.firstName !== undefined) {
      requestBody.firstName = parsedData.data.firstName || null;
    }
    if (parsedData.data.lastName !== undefined) {
      requestBody.lastName = parsedData.data.lastName || null;
    }
    if (parsedData.data.professionalHeadline !== undefined) {
      requestBody.professionalHeadline = parsedData.data.professionalHeadline || null;
    }
    if (parsedData.data.aboutMe !== undefined) {
      requestBody.aboutMe = parsedData.data.aboutMe || null;
    }

    // Call API
    const response = await fetchWithRetry({
      url: `profile/section/basicInfo`,
      options: {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${(session.user as { accessToken?: string }).accessToken ?? ''}`,
        },
        credentials: 'include',
        body: JSON.stringify(requestBody),
      },
      refreshTokenHash: (session.user as { refreshTokenHash?: string }).refreshTokenHash,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to update basic information' }));

      return {
        success: false,
        errors: errorData.message || 'Failed to update basic information. Please try again.',
      };
    }

    await response.json();

    // Revalidate the profile page
    revalidatePath('/profile');

    return {
      success: true,
      message: 'Basic information updated successfully',
      errors: undefined,
    };
  } catch (error) {
    console.error('Error updating basic info:', error);
    return {
      success: false,
      errors: 'An unexpected error occurred. Please try again.',
    };
  }
}

/**
 * Update profile experiences section
 */
export async function updateExperiencesAction(formData: {
  experiences: Array<{
    title: string;
    company: string;
    location?: string;
    startDate: string;
    endDate?: string | null;
    description?: string;
    isCurrent?: boolean;
  }>;
}): Promise<ProfileActionState> {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return {
        success: false,
        errors: 'Session expired, please login again to perform this action',
      };
    }

    // Validate the form data
    const parsedData = ExperiencesSchema.safeParse(formData);

    if (!parsedData.success) {
      return {
        success: false,
        errors: parsedData.error.flatten().fieldErrors,
      };
    }

    // Call API
    const response = await fetchWithRetry({
      url: `profile/section/experiences`,
      options: {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${(session.user as { accessToken?: string }).accessToken ?? ''}`,
        },
        credentials: 'include',
        body: JSON.stringify(parsedData.data),
      },
      refreshTokenHash: (session.user as { refreshTokenHash?: string }).refreshTokenHash,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to update experiences' }));

      return {
        success: false,
        errors: errorData.message || 'Failed to update experiences. Please try again.',
      };
    }

    await response.json();

    // Revalidate the profile page
    revalidatePath('/profile');

    return {
      success: true,
      message: 'Experiences updated successfully',
      errors: undefined,
    };
  } catch (error) {
    console.error('Error updating experiences:', error);
    return {
      success: false,
      errors: 'An unexpected error occurred. Please try again.',
    };
  }
}

/**
 * Update profile education section
 */
export async function updateEducationAction(formData: {
  education: Array<{
    degree: string;
    institution: string;
    fieldOfStudy?: string;
    startDate: string;
    endDate?: string | null;
    isCurrent?: boolean;
  }>;
}): Promise<ProfileActionState> {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return {
        success: false,
        errors: 'Session expired, please login again to perform this action',
      };
    }

    // Validate the form data
    const parsedData = EducationSchema.safeParse(formData);

    if (!parsedData.success) {
      return {
        success: false,
        errors: parsedData.error.flatten().fieldErrors,
      };
    }

    // Call API
    const response = await fetchWithRetry({
      url: `profile/section/education`,
      options: {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${(session.user as { accessToken?: string }).accessToken ?? ''}`,
        },
        credentials: 'include',
        body: JSON.stringify(parsedData.data),
      },
      refreshTokenHash: (session.user as { refreshTokenHash?: string }).refreshTokenHash,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to update education' }));

      return {
        success: false,
        errors: errorData.message || 'Failed to update education. Please try again.',
      };
    }

    await response.json();

    // Revalidate the profile page
    revalidatePath('/profile');

    return {
      success: true,
      message: 'Education updated successfully',
      errors: undefined,
    };
  } catch (error) {
    console.error('Error updating education:', error);
    return {
      success: false,
      errors: 'An unexpected error occurred. Please try again.',
    };
  }
}

/**
 * Update profile certifications section
 */
export async function updateCertificationsAction(formData: {
  certifications: Array<{
    name: string;
    issuer: string;
    issueDate: string;
    expiryDate?: string | null;
    credentialUrl?: string;
  }>;
}): Promise<ProfileActionState> {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return {
        success: false,
        errors: 'Session expired, please login again to perform this action',
      };
    }

    // Validate the form data
    const parsedData = CertificationsSchema.safeParse(formData);

    if (!parsedData.success) {
      return {
        success: false,
        errors: parsedData.error.flatten().fieldErrors,
      };
    }

    // Call API
    const response = await fetchWithRetry({
      url: `profile/section/certifications`,
      options: {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${(session.user as { accessToken?: string }).accessToken ?? ''}`,
        },
        credentials: 'include',
        body: JSON.stringify(parsedData.data),
      },
      refreshTokenHash: (session.user as { refreshTokenHash?: string }).refreshTokenHash,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to update certifications' }));

      return {
        success: false,
        errors: errorData.message || 'Failed to update certifications. Please try again.',
      };
    }

    await response.json();

    // Revalidate the profile page
    revalidatePath('/profile');

    return {
      success: true,
      message: 'Certifications updated successfully',
      errors: undefined,
    };
  } catch (error) {
    console.error('Error updating certifications:', error);
    return {
      success: false,
      errors: 'An unexpected error occurred. Please try again.',
    };
  }
}

/**
 * Update profile image
 */
export async function updateProfileImageAction(formData: FormData): Promise<ProfileActionState> {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return {
        success: false,
        errors: 'Session expired, please login again to perform this action',
      };
    }

    const imageFile = formData.get('image') as File | null;

    if (!imageFile) {
      return {
        success: false,
        errors: 'No image file provided',
      };
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(imageFile.type)) {
      return {
        success: false,
        errors: 'Invalid file type. Only JPEG, PNG, and WebP images are allowed',
      };
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (imageFile.size > maxSize) {
      return {
        success: false,
        errors: 'File size too large. Maximum size is 5MB',
      };
    }

    // Create FormData for the API request
    const uploadFormData = new FormData();
    uploadFormData.append('image', imageFile);

    // Call API
    const response = await fetchWithRetry({
      url: `profile/image`,
      options: {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${(session.user as { accessToken?: string }).accessToken ?? ''}`,
        },
        credentials: 'include',
        body: uploadFormData,
      },
      refreshTokenHash: (session.user as { refreshTokenHash?: string }).refreshTokenHash,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to update profile image' }));

      return {
        success: false,
        errors: errorData.message || 'Failed to update profile image. Please try again.',
      };
    }

    await response.json();

    // Revalidate the profile page
    revalidatePath('/profile');

    return {
      success: true,
      message: 'Profile image updated successfully',
      errors: undefined,
    };
  } catch (error) {
    console.error('Error updating profile image:', error);
    return {
      success: false,
      errors: 'An unexpected error occurred. Please try again.',
    };
  }
}
