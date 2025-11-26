import { z } from 'zod';

// UserRole enum validation (optional)
export const UserRoleEnum = z.enum(['JOB_SEEKER', 'COMPANY'], {
  message: 'Role must be either JOB_SEEKER or COMPANY',
});

export type UserRoleType = z.infer<typeof UserRoleEnum>;

export const RegisterSchema = z.object({
  firstName: z
    .string({
      error: 'First name is required.',
    })
    .min(2, { message: 'First name must be at least 2 characters.' })
    .max(50, { message: 'First name cannot exceed 50 characters.' })
    .trim(),

  lastName: z
    .string({
      error: 'Last name is required.',
    })
    .min(2, { message: 'Last name must be at least 2 characters.' })
    .max(50, { message: 'Last name cannot exceed 50 characters.' })
    .trim(),

  email: z
    .string({
      error: 'Email is required.',
    })
    .email({ message: 'Invalid email address.' })
    .min(5, { message: 'Email must be at least 5 characters.' })
    .max(255, { message: 'Email cannot exceed 255 characters.' })
    .toLowerCase()
    .trim(),

  role: UserRoleEnum,

  password: z
    .string({
      error: 'Password is required.',
    })
    .min(8, { message: 'Password must be at least 8 characters.' })
    .max(100, { message: 'Password cannot exceed 100 characters.' })
    .regex(/[A-Z]/, {
      message: 'Password must contain at least one uppercase letter.',
    })
    .regex(/[a-z]/, {
      message: 'Password must contain at least one lowercase letter.',
    })
    .regex(/[0-9]/, { message: 'Password must contain at least one number.' }),
});

export type RegisterType = z.infer<typeof RegisterSchema>;

export const LoginUserSchema = z.object({
  email: z
    .string({
      error: 'Email is required.',
    })
    .email({ message: 'Invalid email address.' })
    .min(5, { message: 'Email must be at least 5 characters.' })
    .max(255, { message: 'Email cannot exceed 255 characters.' })
    .toLowerCase()
    .trim(),

  password: z
    .string({
      error: 'Password is required.',
    })
    .min(8, { message: 'Password must be at least 8 characters.' })
    .max(100, { message: 'Password cannot exceed 100 characters.' })
    .regex(/[A-Z]/, {
      message: 'Password must contain at least one uppercase letter.',
    })
    .regex(/[a-z]/, {
      message: 'Password must contain at least one lowercase letter.',
    })
    .regex(/[0-9]/, {
      message: 'Password must contain at least one number.',
    }),
});

export type LoginUserType = z.infer<typeof LoginUserSchema>;

export const ChangePasswordSchema = z
  .object({
    newPassword: z
      .string({
        error: 'New password is required.',
      })
      .min(8, { message: 'New password must be at least 8 characters.' })
      .max(100, { message: 'New password cannot exceed 100 characters.' })
      .regex(/[A-Z]/, {
        message: 'New password must contain at least one uppercase letter.',
      })
      .regex(/[a-z]/, {
        message: 'New password must contain at least one lowercase letter.',
      })
      .regex(/[0-9]/, {
        message: 'New password must contain at least one number.',
      }),

    confirmNewPassword: z.string({
      error: 'Confirmation of new password is required.',
    }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'New passwords do not match.',
    path: ['confirmNewPassword'],
  });

export type ChangePasswordType = z.infer<typeof ChangePasswordSchema>;
