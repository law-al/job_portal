'use server';
/**/

import { z } from 'zod';
import { authOptions } from '@/auth';
import { getServerSession } from 'next-auth';
import { fetchWithRetry } from '@/lib/fetchWithRetry';
import { revalidatePath } from 'next/cache';

const emailTemplateMetadataSchema = z.object({
  fromName: z.string().max(100).optional(),
  fromEmail: z.string().email().max(255).optional(),
  replyTo: z.string().email().max(255).optional(),
  backgroundColor: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .optional(),
});

const createEmailTemplateSchema = z.object({
  templateType: z.enum(['welcome', 'password', 'application', 'interview', 'jobalert', 'verification', 'offer', 'rejection', 'stage_update', 'custom']),
  name: z.string().min(1, 'Template name is required').max(255),
  description: z.string().max(500).optional(),
  subject: z.string().min(1, 'Subject is required').max(255),
  preheader: z.string().max(150).optional(),
  content: z.string().min(1, 'Content is required'),
  editorState: z.string().min(1, 'Editor state is required'),
  variables: z.array(z.string()).default([]).optional(),
  metadata: emailTemplateMetadataSchema.optional(),
  isActive: z.boolean().default(true).optional(),
  isDefault: z.boolean().default(false).optional(),
  tags: z.array(z.string()).default([]).optional(),
});

type EmailTemplateActionState = {
  success?: boolean;
  errors?: string | Record<string, string[]>;
  message?: string;
};

export async function createEmailTemplateAction(formData: {
  templateType: string;
  name: string;
  description?: string;
  subject: string;
  preheader?: string;
  content: string;
  editorState: string;
  variables?: string[];
  metadata?: {
    fromName?: string;
    fromEmail?: string;
    replyTo?: string;
    backgroundColor?: string;
  };
  isActive?: boolean;
  isDefault?: boolean;
  tags?: string[];
}): Promise<EmailTemplateActionState> {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return {
        success: false,
        errors: 'Session expired, please login again to perform this action',
      };
    }

    const companyId = (session.user as { companyId?: string }).companyId;
    if (!companyId) {
      return {
        success: false,
        errors: 'Company ID not found. Please ensure you are associated with a company.',
      };
    }

    // Validate the form data
    const parsedData = createEmailTemplateSchema.safeParse(formData);

    if (!parsedData.success) {
      return {
        success: false,
        errors: parsedData.error.flatten().fieldErrors,
      };

      /*
      {
          email: ["Invalid email"],
          age: ["Number must be greater than or equal to 18"]
      }
      */
    }

    // Validate editorState is valid JSON
    try {
      JSON.parse(parsedData.data.editorState);
    } catch {
      return {
        success: false,
        errors: { editorState: ['Editor state must be valid JSON'] },
      };
    }

    // Prepare request body
    const requestBody = {
      ...parsedData.data,
      variables: parsedData.data.variables || [],
      tags: parsedData.data.tags || [],
      isActive: parsedData.data.isActive ?? true,
      isDefault: parsedData.data.isDefault ?? false,
    };

    // Call API
    const response = await fetchWithRetry({
      url: `email/${companyId}/create`,
      options: {
        method: 'POST',
        body: JSON.stringify(requestBody),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${(session.user as { accessToken?: string }).accessToken ?? ''}`,
        },
      },
      refreshTokenHash: (session.user as { refreshTokenHash?: string }).refreshTokenHash,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to create email template' }));

      return {
        success: false,
        errors: errorData.message || 'Failed to create email template. Please try again.',
      };
    }

    const responseData = await response.json().catch(() => ({ message: 'Email template created successfully' }));

    // Revalidate the email templates page
    revalidatePath('/admin/settings');

    return {
      success: true,
      message: responseData.message || 'Email template created successfully',
    };
  } catch (error) {
    console.error('Create email template error:', error);
    return {
      success: false,
      errors: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.',
    };
  }
}

// Fetch email templates for a company
export async function fetchEmailTemplatesAction(filters?: { templateType?: string; isActive?: boolean; isDefault?: boolean; search?: string; page?: number; limit?: number }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return {
        success: false,
        error: 'Session expired, please login again',
        data: [],
        pagination: null,
      };
    }

    const companyId = (session.user as { companyId?: string }).companyId;
    if (!companyId) {
      return {
        success: false,
        error: 'Company ID not found. Please ensure you are associated with a company.',
        data: [],
        pagination: null,
      };
    }

    // Build query string
    const queryParams = new URLSearchParams();
    if (filters?.templateType) queryParams.append('templateType', filters.templateType);
    if (filters?.isActive !== undefined) queryParams.append('isActive', filters.isActive.toString());
    if (filters?.isDefault !== undefined) queryParams.append('isDefault', filters.isDefault.toString());
    if (filters?.search) queryParams.append('search', filters.search);
    if (filters?.page) queryParams.append('page', filters.page.toString());
    if (filters?.limit) queryParams.append('limit', filters.limit.toString());

    const queryString = queryParams.toString();
    const url = `email/${companyId}${queryString ? `?${queryString}` : ''}`;

    const response = await fetchWithRetry({
      url,
      options: {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${(session.user as { accessToken?: string }).accessToken ?? ''}`,
        },
      },
      refreshTokenHash: (session.user as { refreshTokenHash?: string }).refreshTokenHash,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to fetch email templates' }));

      return {
        success: false,
        error: errorData.message || 'Failed to fetch email templates. Please try again.',
        data: [],
        pagination: null,
      };
    }

    const responseData = await response.json().catch(() => ({ data: [], pagination: null }));

    return {
      success: true,
      data: responseData.data || [],
      pagination: responseData.pagination || null,
      message: responseData.message || 'Email templates fetched successfully',
    };
  } catch (error) {
    console.error('Fetch email templates error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.',
      data: [],
      pagination: null,
    };
  }
}

// Update email template
const updateEmailTemplateSchema = z.object({
  templateId: z.string().min(1, 'Template ID is required'),
  name: z.string().min(1, 'Template name is required').max(255).optional(),
  description: z.string().max(500).optional(),
  subject: z.string().min(1, 'Subject is required').max(255).optional(),
  preheader: z.string().max(150).optional(),
  content: z.string().min(1, 'Content is required').optional(),
  editorState: z.string().min(1, 'Editor state is required').optional(),
  variables: z.array(z.string()).optional(),
  metadata: emailTemplateMetadataSchema.optional(),
  isActive: z.boolean().optional(),
  isDefault: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
});

export async function updateEmailTemplateAction(formData: {
  templateId: string;
  name?: string;
  description?: string;
  subject?: string;
  preheader?: string;
  content?: string;
  editorState?: string;
  variables?: string[];
  metadata?: {
    fromName?: string;
    fromEmail?: string;
    replyTo?: string;
    backgroundColor?: string;
  };
  isActive?: boolean;
  isDefault?: boolean;
  tags?: string[];
}): Promise<EmailTemplateActionState> {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return {
        success: false,
        errors: 'Session expired, please login again to perform this action',
      };
    }

    const companyId = (session.user as { companyId?: string }).companyId;
    if (!companyId) {
      return {
        success: false,
        errors: 'Company ID not found. Please ensure you are associated with a company.',
      };
    }

    if (!formData.templateId) {
      return {
        success: false,
        errors: 'Template ID is required',
      };
    }

    // Validate the form data
    const parsedData = updateEmailTemplateSchema.safeParse(formData);

    if (!parsedData.success) {
      return {
        success: false,
        errors: parsedData.error.flatten().fieldErrors,
      };
    }

    // Validate editorState is valid JSON if provided
    if (parsedData.data.editorState) {
      try {
        JSON.parse(parsedData.data.editorState);
      } catch {
        return {
          success: false,
          errors: { editorState: ['Editor state must be valid JSON'] },
        };
      }
    }

    // Prepare request body (exclude templateId from body, it goes in URL)
    const { templateId, ...requestBody } = parsedData.data;

    // Remove undefined values
    const cleanRequestBody: Record<string, unknown> = {};
    Object.keys(requestBody).forEach((key) => {
      const value = requestBody[key as keyof typeof requestBody];
      if (value !== undefined) {
        cleanRequestBody[key] = value;
      }
    });

    // Call API
    const response = await fetchWithRetry({
      url: `email/${companyId}/template/${templateId}`,
      options: {
        method: 'PUT',
        body: JSON.stringify(cleanRequestBody),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${(session.user as { accessToken?: string }).accessToken ?? ''}`,
        },
      },
      refreshTokenHash: (session.user as { refreshTokenHash?: string }).refreshTokenHash,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to update email template' }));

      return {
        success: false,
        errors: errorData.message || 'Failed to update email template. Please try again.',
      };
    }

    const responseData = await response.json().catch(() => ({ message: 'Email template updated successfully' }));

    // Revalidate the email templates page
    revalidatePath('/admin/settings');

    return {
      success: true,
      message: responseData.message || 'Email template updated successfully',
    };
  } catch (error) {
    console.error('Update email template error:', error);
    return {
      success: false,
      errors: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.',
    };
  }
}
