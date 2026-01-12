'use server';

import { fetchWithRetry } from '@/lib/fetchWithRetry';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import z from 'zod';
import { API_BASE_URL } from '@/lib/config';

/* eslint-disable @typescript-eslint/no-explicit-any */

const RegisterInvitedUserSchema = z.object({
  email: z.email({ error: 'An email is required' }),
  token: z.string(),
});

export const registerInvitedUser = async (token: string, prevState: any, formData: FormData) => {
  try {
    const raw = {
      email: formData.get('email'),
      token,
    };

    const parsedField = RegisterInvitedUserSchema.safeParse(raw);

    if (!parsedField.success) {
      return {
        errors: parsedField.error.flatten().fieldErrors,
      };
    }

    const response = await fetch(`${API_BASE_URL}/auth/accept`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...parsedField.data,
        password: formData.get('password'),
      }),
      credentials: 'include',
    });

    if (!response.ok) {
      console.log(response);
      const errorRes = await response.json();
      return {
        errors: errorRes.message || 'Something went wrong',
      };
    }

    const result = await response.json();

    revalidatePath('/users');
    redirect('/');

    return {
      success: true,
      message: 'user successfully added',
    };
  } catch (error: any) {
    if (error?.digest?.startsWith('NEXT_REDIRECT')) {
      throw error;
    }
    return {
      errors: 'Something unexpected occur',
    };
  }
};
