/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { authOptions } from '@/auth';
import { fetchWithRetry } from '@/lib/fetchWithRetry';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const createJobSchema = z.object({
  title: z.string().min(1, 'Job title is required').max(255),
  description: z.string().min(1, 'Job description is required'),
  location: z.string().min(1, 'Location is required').max(255),
  jobType: z.enum([
    'FULL_TIME',
    'PART_TIME',
    'CONTRACT',
    'INTERNSHIP',
    'TEMPORARY',
    'SEASONAL',
    'REMOTE',
    'HYBRID',
    'IN_OFFICE',
    'FREELANCE',
    'VOLUNTEER',
    'CONSULTANT',
  ]),
  experienceLevel: z.enum([
    'INTERN',
    'ENTRY',
    'JUNIOR',
    'MID',
    'SENIOR',
    'LEAD',
  ]),
  salary_range: z.string().max(255).nullable().optional(),
  deadline: z.string().nullable().optional(),
  slot: z.number().int().positive().nullable().optional(),
  isRemote: z.boolean().default(false),
  pipelineStages: z
    .array(
      z.object({
        name: z.string().min(1).max(100),
        order: z.number().int().min(0),
      })
    )
    .default([]),
  pipelineName: z.string().max(255).optional(),
});

type JobActionState = {
  errors?: string | Record<string, string[]>;
};

export async function createJobAction(
  prevState: JobActionState | null,
  formData: FormData
): Promise<JobActionState> {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return {
        errors: 'Session expired, please login again to perform this action',
      };
    }

    const companyId = (session.user as any).companyId;
    if (!companyId) {
      return {
        errors:
          'Company ID not found. Please ensure you are associated with a company.',
      };
    }

    // Extract form data
    const jobTitle = formData.get('jobTitle');
    const location = formData.get('location');
    const jobType = formData.get('jobType');
    const experienceLevel = formData.get('experienceLevel');
    const salary = formData.get('salary');
    const deadline = formData.get('applicationDeadline');
    const description = formData.get('description');
    const isRemote = formData.get('isRemote') === 'true';
    const slot = formData.get('slot');
    const pipelineName = formData.get('pipelineName');

    // Extract pipeline stages
    const stageNames = formData.getAll('stages[]');
    const stageOrders = formData.getAll('stageOrder[]');

    const pipelineStages = stageNames.map((name, index) => ({
      name: name.toString(),
      order: Number(stageOrders[index]) || index,
    }));

    // Prepare data for validation
    const jobData = {
      title: jobTitle?.toString() || '',
      description: description?.toString() || '',
      location: location?.toString() || '',
      jobType: jobType?.toString() as z.infer<
        typeof createJobSchema
      >['jobType'],
      experienceLevel: experienceLevel?.toString() as z.infer<
        typeof createJobSchema
      >['experienceLevel'],
      salary_range: salary?.toString() || null,
      deadline: deadline?.toString() || null,
      slot: slot ? Number(slot) : null,
      isRemote,
      pipelineStages,
      pipelineName: pipelineName?.toString() || undefined,
    };

    // Validate data
    const parsedData = createJobSchema.safeParse(jobData);
    if (!parsedData.success) {
      return {
        errors: parsedData.error.flatten().fieldErrors,
      };
    }

    // Prepare request body
    const requestBody = {
      ...parsedData.data,
      deadline: parsedData.data.deadline
        ? new Date(parsedData.data.deadline).toISOString()
        : null,
    };

    // Call API
    const response = await fetchWithRetry({
      url: `jobs/${companyId}/create`,
      options: {
        method: 'POST',
        body: JSON.stringify(requestBody),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      },
      refreshTokenHash: (session.user as any).refreshTokenHash,
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: 'Failed to create job' }));
      return {
        errors: errorData.message || 'Failed to create job. Please try again.',
      };
    }

    // Revalidate and redirect on success
    revalidatePath('/admin/jobs');
    redirect('/admin/jobs');
  } catch (error: unknown) {
    throw error;
  }
}

export async function closeJobAction(jobSlug: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return {
        errors: 'Session expired, please login again to perform this action',
      };
    }

    const companyId = (session.user as any).companyId;
    if (!companyId) {
      return {
        errors:
          'Company ID not found. Please ensure you are associated with a company.',
      };
    }

    const response = await fetchWithRetry({
      url: `jobs/${companyId}/close/${jobSlug}`,
      options: {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${(session.user as any).accessToken}`,
        },
      },
      refreshTokenHash: (session.user as any).refreshTokenHash,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: 'Failed to close job',
      }));
      return {
        errors: errorData.message || 'Failed to close job. Please try again.',
      };
    }

    revalidatePath('/admin/jobs');
    return {
      success: true,
      message: 'Job closed successfully',
    };
  } catch (error: unknown) {
    console.error('Close job error:', error);
    return {
      errors: 'An unexpected error occurred. Please try again.',
    };
  }
}

export async function openJobAction(jobSlug: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return {
        errors: 'Session expired, please login again to perform this action',
      };
    }

    const companyId = (session.user as any).companyId;
    if (!companyId) {
      return {
        errors:
          'Company ID not found. Please ensure you are associated with a company.',
      };
    }

    const response = await fetchWithRetry({
      url: `jobs/${companyId}/open/${jobSlug}`,
      options: {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${(session.user as any).accessToken}`,
        },
      },
      refreshTokenHash: (session.user as any).refreshTokenHash,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: 'Failed to open job',
      }));
      return {
        errors: errorData.message || 'Failed to open job. Please try again.',
      };
    }

    revalidatePath('/admin/jobs');
    return {
      success: true,
      message: 'Job opened successfully',
    };
  } catch (error: unknown) {
    console.error('Open job error:', error);
    return {
      errors: 'An unexpected error occurred. Please try again.',
    };
  }
}

export async function updateJobAction(
  jobSlug: string,
  jobData: {
    title: string;
    description: string;
    location: string;
    jobType: string;
    experienceLevel: string;
    salary_range?: string;
    isRemote: boolean;
    slot?: string;
    deadline?: string;
  }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return {
        errors: 'Session expired, please login again to perform this action',
      };
    }

    const companyId = (session.user as any).companyId;
    if (!companyId) {
      return {
        errors:
          'Company ID not found. Please ensure you are associated with a company.',
      };
    }

    // Prepare request body
    const requestBody = {
      title: jobData.title,
      description: jobData.description,
      location: jobData.location,
      jobType: jobData.jobType,
      experienceLevel: jobData.experienceLevel,
      salary_range: jobData.salary_range || null,
      isRemote: jobData.isRemote,
      slot: jobData.slot ? Number(jobData.slot) : null,
      deadline: jobData.deadline
        ? new Date(jobData.deadline).toISOString()
        : null,
    };

    const response = await fetchWithRetry({
      url: `jobs/${companyId}/edit/${jobSlug}`,
      options: {
        method: 'PUT',
        body: JSON.stringify(requestBody),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${(session.user as any).accessToken}`,
        },
      },
      refreshTokenHash: (session.user as any).refreshTokenHash,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: 'Failed to update job',
      }));
      return {
        errors: errorData.message || 'Failed to update job. Please try again.',
      };
    }

    revalidatePath('/admin/jobs');
    revalidatePath(`/admin/jobs/${jobSlug}`);
    return {
      success: true,
      message: 'Job updated successfully',
    };
  } catch (error: unknown) {
    console.error('Update job error:', error);
    return {
      errors: 'An unexpected error occurred. Please try again.',
    };
  }
}
