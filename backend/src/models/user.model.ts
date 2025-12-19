import { z } from 'zod';

// UserRole enum validation (optional)
export const UserRoleEnum = z.enum(['USER', 'COMPANY'], {
  message: 'Role must be either JOB_SEEKER or COMPANY',
});

export type UserRoleType = z.infer<typeof UserRoleEnum>;

export const RegisterSchema = z.object({
  email: z
    .email({ message: 'Invalid email address.' })
    .min(5, { message: 'Email must be at least 5 characters.' })
    .max(255, { message: 'Email cannot exceed 255 characters.' })
    .toLowerCase()
    .trim(),

  role: UserRoleEnum.optional(),

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

export const RegisterUserCompanySchema = z.object({
  email: z
    .email({ message: 'Invalid email address.' })
    .min(5, { message: 'Email must be at least 5 characters.' })
    .max(255, { message: 'Email cannot exceed 255 characters.' })
    .toLowerCase()
    .trim(),

  name: z.string().min(1, 'Name is required').max(255, 'Name must be less than 255 characters'),

  description: z.string().min(1, 'Description is required'),

  website: z.string().url('Must be a valid URL').max(255, 'Website URL must be less than 255 characters'),

  address: z.string().min(1, 'Address is required'),

  logo: z.string().url('Must be a valid URL').max(255, 'Logo URL must be less than 255 characters'),

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

export const RegisterOauthSchema = z.object({
  email: z
    .email({ message: 'Invalid email address.' })
    .min(5, { message: 'Email must be at least 5 characters.' })
    .max(255, { message: 'Email cannot exceed 255 characters.' })
    .toLowerCase()
    .trim(),

  role: UserRoleEnum,

  provider: z.string().min(1, { message: 'Provider is required.' }),

  providerId: z.string().min(1, { message: 'Provider ID is required.' }),
});

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

  password: z.string({
    error: 'Password is required.',
  }),
});

export type LoginUserType = z.infer<typeof LoginUserSchema>;

export const ChangePasswordSchema = z
  .object({
    password: z
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

    confirmPassword: z.string({
      error: 'Confirmation of new password is required.',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'New passwords do not match.',
    path: ['confirmNewPassword'],
  });

export type ChangePasswordType = z.infer<typeof ChangePasswordSchema>;
