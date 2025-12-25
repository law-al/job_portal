'use server';

import { z } from 'zod';
import { authOptions } from '@/auth';
import { getServerSession } from 'next-auth';
import { fetchWithRetry } from '@/lib/fetchWithRetry';
import { revalidatePath } from 'next/cache';

const CreateNoteSchema = z.object({
  content: z.string().min(1, 'Note content is required').max(5000, 'Note content cannot exceed 5000 characters'),
  applicationId: z.uuid('Invalid application ID'),
});

const UpdateNoteSchema = z.object({
  content: z.string().min(1, 'Note content is required').max(5000, 'Note content cannot exceed 5000 characters'),
  noteId: z.string(),
});

// Create a new note
export const createNoteAction = async (applicationId: string, content: string) => {
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

    // Validate input
    const parsed = CreateNoteSchema.safeParse({ content, applicationId });
    if (!parsed.success) {

      return {
        success: false,
        errors: parsed.error.flatten().fieldErrors,
      };
    }

    const companyId = session.user.companyId as string;

    console.log('It got here');

    const response = await fetchWithRetry({
      url: `note/${companyId}/application/${applicationId}`,
      options: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${(session.user as { accessToken?: string }).accessToken ?? ''}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          content: parsed.data.content,
        }),
      },
      refreshTokenHash: (session.user as { refreshTokenHash?: string }).refreshTokenHash,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to create note' }));

      return {
        success: false,
        error: errorData.message || 'Failed to create note. Please try again.',
      };
    }

    const result = await response.json();

    // Revalidate the application detail page to show the new note
    revalidatePath(`/admin/applications/${applicationId}`);

    return {
      success: true,
      message: 'Note created successfully',
      data: result.data,
    };
  } catch (error) {
    console.error('Error creating note:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.',
    };
  }
};

// Update a note
export const updateNoteAction = async (noteId: string, content: string, applicationId: string) => {
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

    // Validate input
    const parsed = UpdateNoteSchema.safeParse({ content, noteId });
    if (!parsed.success) {
      return {
        success: false,
        error: (parsed.error as any)?.errors[0]?.message || 'Invalid note data',
      };
    }

    const companyId = session.user.companyId as string;

    const response = await fetchWithRetry({
      url: `note/${companyId}/${noteId}`,
      options: {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${(session.user as { accessToken?: string }).accessToken ?? ''}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          content: parsed.data.content,
        }),
      },
      refreshTokenHash: (session.user as { refreshTokenHash?: string }).refreshTokenHash,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to update note' }));

      return {
        success: false,
        error: errorData.message || 'Failed to update note. Please try again.',
      };
    }

    const result = await response.json();

    // Revalidate the application detail page
    revalidatePath(`/admin/applications/${applicationId}`);

    return {
      success: true,
      message: 'Note updated successfully',
      data: result.data,
    };
  } catch (error) {
    console.error('Error updating note:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.',
    };
  }
};

// Delete a note
export const deleteNoteAction = async (noteId: string, applicationId: string) => {
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

    if (!noteId) {
      return {
        success: false,
        error: 'Note ID is required',
      };
    }

    const companyId = session.user.companyId as string;

    const response = await fetchWithRetry({
      url: `note/${companyId}/${noteId}`,
      options: {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${(session.user as { accessToken?: string }).accessToken ?? ''}`,
        },
        credentials: 'include',
      },
      refreshTokenHash: (session.user as { refreshTokenHash?: string }).refreshTokenHash,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to delete note' }));

      return {
        success: false,
        error: errorData.message || 'Failed to delete note. Please try again.',
      };
    }

    // Revalidate the application detail page
    revalidatePath(`/admin/applications/${applicationId}`);

    return {
      success: true,
      message: 'Note deleted successfully',
    };
  } catch (error) {
    console.error('Error deleting note:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.',
    };
  }
};
