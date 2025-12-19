'use server';

import { z } from 'zod';
import { authOptions } from '@/auth';
import { getServerSession } from 'next-auth';
import { fetchWithRetry } from '@/lib/fetchWithRetry';
import { redirect } from 'next/navigation';

interface ApplicationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  resumeId: string;
  coverLetter: string | null;
  supportingDocumentIds: string[] | null;
  checkedTerms: boolean;
}

const SupportingDocumentSchema = z.object({
  id: z.string(),
});

const ApplicationFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email('A valid email is required'),
  phone: z.string().min(7, 'Phone number is too short').max(20, 'Phone number is too long'),
  location: z.string().min(1, 'Location is required').max(255),
  linkedin: z.url('LinkedIn must be a valid URL').max(255).optional().or(z.literal('')),
  resumeId: z.string().nullable(),
  existingResumeId: z.string().nullable(),
  coverLetter: z.string().max(5000).nullable(),
  supportingDocuments: z.array(SupportingDocumentSchema).nullable(),
  checkedTerms: z.boolean().refine((val) => val === true, 'You must agree to the terms'),
});

// Example usage in sendApplication
export const sendApplicationAction = async (applicationData: ApplicationData, jobId: string) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return {
        errors: 'Session expired, please login again to perform this action',
      };
    }

    const parsed = ApplicationFormSchema.safeParse(applicationData);
    if (!parsed.success) {
      return {
        errors: parsed.error.flatten().fieldErrors,
      };
    }

    const data = parsed.data;

    const formData = new FormData();

    formData.append('jobId', jobId);
    formData.append('firstName', data.firstName);
    formData.append('lastName', data.lastName);
    formData.append('email', data.email);
    formData.append('phone', data.phone);
    formData.append('location', data.location);
    formData.append('linkedin', data.linkedin || '');
    formData.append('checkedTerms', data.checkedTerms ? 'true' : 'false');

    if (data.coverLetter) {
      formData.append('coverLetter', data.coverLetter);
    }

    if (data.resumeId) {
      formData.append('resumeId', data.resumeId);
    } else if (data.existingResumeId) {
      formData.append('resumeId', data.existingResumeId);
    }

    if (data.supportingDocuments && data.supportingDocuments.length > 0) {
      for (const doc of data.supportingDocuments) {
        if (doc.id) {
          // Backend multer is configured with field name "documents"
          formData.append('documentsId', doc.id);
        }
      }
    }

    console.log(formData);

    const response = await fetchWithRetry({
      url: 'application/send',
      options: {
        method: 'POST',
        body: formData,
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${(session.user as { accessToken?: string }).accessToken ?? ''}`,
        },
      },
      refreshTokenHash: (session.user as { refreshTokenHash?: string }).refreshTokenHash,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to submit application' }));

      return {
        errors: errorData.message || 'Failed to submit application. Please try again.',
      };
    }
  } catch (error) {
    console.log(error);
    return {
      errors: error || 'An unexpected error occurred. Please try again.',
    };
  }

  redirect('/jobs');
};
