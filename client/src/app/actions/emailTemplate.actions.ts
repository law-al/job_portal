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

    const companyId = (session.user as any).companyId;
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
