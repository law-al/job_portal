/* eslint-disable @typescript-eslint/no-explicit-any */

'use server';
import { authOptions } from '@/auth';
import { fetchWithRetry } from '@/lib/fetchWithRetry';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const addUserSchema = z.object({
  email: z.email({ message: 'Please enter a valid email address' }),
  role: z.enum(['hr', 'recruiter'], {
    message: 'Please select a role',
  }),
});

export async function addUser(prevState: any, formData: FormData) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return {
        errors: 'Session expired, Login again to perform action',
      };
    }

    const raw = {
      email: formData.get('email'),
      role: formData.get('role'),
    };

    const parsedField = addUserSchema.safeParse(raw);
    if (!parsedField.success) {
      return {
        errors: parsedField.error.flatten().fieldErrors,
      };
    }

    const response = await fetchWithRetry({
      url: `auth/invite/${session.user.companyId}`,
      options: {
        method: 'POST',
        body: JSON.stringify(parsedField.data),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.user.accessToken}`,
        },
      },
      refreshTokenHash: session.user.refreshTokenHash,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        errors:
          errorData.message || response.statusText || 'Failed to add user',
      };
    }

    const { success } = await response.json();

    revalidatePath('/users');
    redirect('/admin/users');

    return {
      success: true,
      message: 'User invited successfully',
    };
  } catch (error: any) {
    console.error('Add user error:', error);
    if (error?.digest?.startsWith('NEXT_REDIRECT')) {
      throw error;
    }
    return {
      errors: 'An unexpected error occurred. Please try again.',
    };
  }
}

// /:id/members/:memberId/role
export const changeRole = async (memberId: string, role: string) => {
  try {
    if (!memberId) {
      return {
        errors: 'Member ID is required',
      };
    }

    const session = await getServerSession(authOptions);

    if (!session?.user?.companyId || !session?.user?.accessToken) {
      return {
        errors: 'Unauthorized. Please log in again.',
      };
    }

    const companyId = session.user.companyId;
    const accessToken = session.user.accessToken;
    const refreshTokenHash = session.user.refreshTokenHash;

    const response = await fetchWithRetry({
      url: `company/${companyId}/members/${memberId}/role`,
      options: {
        method: 'PATCH',
        body: JSON.stringify({
          role,
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      },
      refreshTokenHash,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        errors:
          errorData.message || response.statusText || 'Failed to suspend user',
      };
    }

    revalidatePath('/users');
    redirect('/admin/users');
  } catch (error) {
    throw error;
  }
};

export const suspendUser = async (memberId: string) => {
  try {
    if (!memberId) {
      return {
        errors: 'Member ID is required',
      };
    }

    const session = await getServerSession(authOptions);

    if (!session?.user?.companyId || !session?.user?.accessToken) {
      return {
        errors: 'Unauthorized. Please log in again.',
      };
    }

    const companyId = session.user.companyId;
    const accessToken = session.user.accessToken;
    const refreshTokenHash = session.user.refreshTokenHash;

    const response = await fetchWithRetry({
      url: `company/${companyId}/${memberId}/suspend`,
      options: {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      },
      refreshTokenHash,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        errors:
          errorData.message || response.statusText || 'Failed to suspend user',
      };
    }

    revalidatePath('/users');
    redirect('/admin/users');
  } catch (error) {
    throw error;
  }
};

export const unSuspendUser = async (memberId: string) => {
  try {
    if (!memberId) {
      return {
        errors: 'Member ID is required',
      };
    }

    const session = await getServerSession(authOptions);

    if (!session?.user?.companyId || !session?.user?.accessToken) {
      console.log('session block entered');
      return {
        errors: 'Unauthorized. Please log in again.',
      };
    }

    const companyId = session.user.companyId;
    const accessToken = session.user.accessToken;
    const refreshTokenHash = session.user.refreshTokenHash;

    const response = await fetchWithRetry({
      url: `company/${companyId}/${memberId}/unsuspend`,
      options: {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      },
      refreshTokenHash,
    });

    if (!response.ok) {
      console.log('response block entered');
      const errorData = await response.json();
      return {
        errors:
          errorData.message ||
          response.statusText ||
          'Failed to unsuspend user',
      };
    }

    revalidatePath('/users');
    redirect('/admin/users');
  } catch (error) {
    throw error;
  }
};
