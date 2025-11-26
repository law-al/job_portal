import { z } from 'zod';

export const RegisterCompanySchema = z.object({
  userId: z.string().uuid(),

  name: z
    .string()
    .min(1, 'Name is required')
    .max(255, 'Name must be less than 255 characters'),

  description: z.string().min(1, 'Description is required'),

  website: z
    .string()
    .url('Must be a valid URL')
    .max(255, 'Website URL must be less than 255 characters'),

  address: z.string().min(1, 'Address is required'),

  logo: z
    .string()
    .url('Must be a valid URL')
    .max(255, 'Logo URL must be less than 255 characters'),
});

export type RegisterCompanySchema = z.infer<typeof RegisterCompanySchema>;

export const UpdateCompanySchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(255, 'Name must be less than 255 characters'),

  description: z.string().min(1, 'Description is required'),

  website: z
    .string()
    .url('Must be a valid URL')
    .max(255, 'Website URL must be less than 255 characters'),

  address: z.string().min(1, 'Address is required'),

  logo: z
    .string()
    .url('Must be a valid URL')
    .max(255, 'Logo URL must be less than 255 characters'),
});

export const AcceptInviteSchema = z.object({
  token: z.string({
    error: 'A token is required',
  }),

  firstName: z
    .string()
    .min(1, 'Firstname is required')
    .max(255, 'Name must be less than 255 characters'),

  lastName: z
    .string()
    .min(1, 'Lastname is required')
    .max(255, 'Name must be less than 255 characters'),

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
