'use server';

import { z } from 'zod';
import { authOptions } from '@/auth';
import { getServerSession } from 'next-auth';
import { fetchWithRetry } from '@/lib/fetchWithRetry';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

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

    console.log(data.existingResumeId);

    if (data.coverLetter) {
      formData.append('coverLetter', data.coverLetter);
    }

    formData.append('resumeId', data.resumeId || data.existingResumeId || '');

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

    console.log('success');
  } catch (error) {
    console.log(error);
    // toast.error(``);
    return {
      errors: error || 'An unexpected error occurred. Please try again.',
    };
  }

  redirect('/jobs');
};

// Move application to different pipeline stage
export const moveApplicationStageAction = async (applicationId: string, stageId: string) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return {
        success: false,
        error: 'Session expired, please login again to perform this action',
      };
    }

    if (!session.user?.companyId) {
      return {
        success: false,
        error: 'Company ID not found. Please ensure you are associated with a company.',
      };
    }

    if (!applicationId || !stageId) {
      return {
        success: false,
        error: 'Application ID and Stage ID are required',
      };
    }

    const companyId = session.user.companyId as string;

    const response = await fetchWithRetry({
      url: `application/${companyId}/move-stage/${applicationId}`,
      options: {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${(session.user as { accessToken?: string }).accessToken ?? ''}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          stageId,
        }),
      },
      refreshTokenHash: (session.user as { refreshTokenHash?: string }).refreshTokenHash,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to move application stage' }));

      return {
        success: false,
        error: errorData.message || 'Failed to move application stage. Please try again.',
      };
    }

    const responseData = await response.json().catch(() => ({ message: 'Application stage moved successfully' }));

    // Revalidate the application detail page
    revalidatePath(`/admin/applications/${applicationId}`);

    return {
      success: true,
      message: responseData.message || 'Application stage moved successfully',
      statusUpdated: responseData.data?.statusUpdated || false,
      isFinalStage: responseData.data?.isFinalStage || false,
    };
  } catch (error) {
    console.error('Error moving application stage:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.',
    };
  }
};

// Reject application
export const rejectApplicationAction = async (applicationId: string) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return {
        success: false,
        error: 'Session expired, please login again to perform this action',
      };
    }

    if (!session.user?.companyId) {
      return {
        success: false,
        error: 'Company ID not found. Please ensure you are associated with a company.',
      };
    }

    if (!applicationId) {
      return {
        success: false,
        error: 'Application ID is required',
      };
    }

    const companyId = session.user.companyId as string;

    const response = await fetchWithRetry({
      url: `application/${companyId}/reject/${applicationId}`,
      options: {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${(session.user as { accessToken?: string }).accessToken ?? ''}`,
        },
        credentials: 'include',
      },
      refreshTokenHash: (session.user as { refreshTokenHash?: string }).refreshTokenHash,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to reject application' }));

      return {
        success: false,
        error: errorData.message || 'Failed to reject application. Please try again.',
      };
    }

    // Revalidate the application detail page
    revalidatePath(`/admin/applications/${applicationId}`);

    return {
      success: true,
      message: 'Application rejected successfully',
    };
  } catch (error) {
    console.error('Error rejecting application:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.',
    };
  }
};

// Assign application to user
export const assignApplicationAction = async (applicationId: string, assignedTo: string | null) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return {
        success: false,
        error: 'Session expired, please login again to perform this action',
      };
    }

    if (!session.user?.companyId) {
      return {
        success: false,
        error: 'Company ID not found. Please ensure you are associated with a company.',
      };
    }

    if (!applicationId) {
      return {
        success: false,
        error: 'Application ID is required',
      };
    }

    const companyId = session.user.companyId as string;

    const response = await fetchWithRetry({
      url: `application/${companyId}/assign/${applicationId}`,
      options: {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${(session.user as { accessToken?: string }).accessToken ?? ''}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          assignedTo,
        }),
      },
      refreshTokenHash: (session.user as { refreshTokenHash?: string }).refreshTokenHash,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to assign application' }));

      return {
        success: false,
        error: errorData.message || 'Failed to assign application. Please try again.',
      };
    }

    // Revalidate the application detail page
    revalidatePath(`/admin/applications/${applicationId}`);

    return {
      success: true,
      message: assignedTo ? 'Application assigned successfully' : 'Application unassigned successfully',
    };
  } catch (error) {
    console.error('Error assigning application:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.',
    };
  }
};
