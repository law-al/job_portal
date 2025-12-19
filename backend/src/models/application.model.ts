import { z } from 'zod';

// Enums matching your Prisma schema
export const ApplicationStatus = z.enum(['APPLIED', 'SCREENING', 'SHORTLISTED', 'INTERVIEW', 'OFFER', 'HIRED', 'REJECTED', 'WITHDRAWN']);

// Main application schema matching Prisma model
const applicationSchema = z.object({
  id: z.string().uuid(),
  jobId: z.string().uuid(),
  userId: z.string().uuid(),
  firstName: z.string().min(1, 'First name is required').max(100, 'First name cannot exceed 100 characters'),
  lastName: z.string().min(1, 'Last name is required').max(100, 'Last name cannot exceed 100 characters'),
  email: z.string().email('Invalid email address').max(255, 'Email cannot exceed 255 characters'),
  phone: z.string().min(7, 'Phone number is too short').max(20, 'Phone number cannot exceed 20 characters'),
  currentLocation: z.string().min(1, 'Location is required').max(255, 'Location cannot exceed 255 characters'),
  linkedin: z.string().url('LinkedIn must be a valid URL').max(255, 'LinkedIn URL cannot exceed 255 characters').nullable().optional().or(z.literal('')),
  coverLetter: z.string().max(5000, 'Cover letter cannot exceed 5000 characters').nullable().optional(),
  expectedSalary: z.number().int().positive('Expected salary must be a positive number').nullable().optional(),
  portfolioUrl: z.string().url('Portfolio URL must be a valid URL').nullable().optional().or(z.literal('')),
  resumeUrl: z.string().url('Resume URL must be a valid URL').nullable().optional().or(z.literal('')),
  documentsUrls: z.array(z.string().url('Document URL must be a valid URL')).default([]),
  status: ApplicationStatus.default('APPLIED'),
  stageId: z.string().uuid().nullable().optional(),
  assignedTo: z.string().uuid().nullable().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

// Schema for creating a new application (omits auto-generated fields)
const createApplicationSchema = applicationSchema
  .omit({
    id: true,
    status: true,
    stageId: true,
    assignedTo: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    // For creation, we might receive resume/document IDs instead of URLs
    resumeId: z.string().nullable().optional(),
    supportingDocumentIds: z.array(z.string()).nullable().optional(),
  })
  .refine(
    (data) => {
      // At least one of resumeUrl or resumeId should be provided
      return data.resumeUrl || data.resumeId;
    },
    {
      message: 'Either resume URL or resume ID must be provided',
      path: ['resumeId'],
    },
  );

// Schema for updating an application (all fields optional except id)
const updateApplicationSchema = applicationSchema.partial().required({ id: true }).extend({
  // Allow updating status separately
  status: ApplicationStatus.optional(),
  // Allow updating stage assignment
  stageId: z.string().uuid().nullable().optional(),
  assignedTo: z.string().uuid().nullable().optional(),
});

// Schema for application submission (from client form)
const submitApplicationSchema = z
  .object({
    userId: z.string('A user must be present'),
    jobId: z.string('Invalid job ID'),
    firstName: z.string().min(1, 'First name is required').max(100),
    lastName: z.string().min(1, 'Last name is required').max(100),
    email: z.string().email('Invalid email address').max(255),
    phone: z.string().min(7, 'Phone number is too short').max(20, 'Phone number is too long'),
    location: z.string().min(1, 'Location is required').max(255),
    linkedin: z.string().url('LinkedIn must be a valid URL').max(255).optional().or(z.literal('')),
    coverLetter: z.string().max(5000).nullable().optional(),
    resumeId: z.string('Invalid resume ID').nullable().optional(),
    documentsId: z.array(z.string('Invalid document ID')).nullable().optional(),
    // checkedTerms: z.boolean().refine((val) => val === true, 'You must agree to the terms'),
  })
  .refine(
    (data) => {
      // At least one resume must be provided
      return data.resumeId;
    },
    {
      message: 'Either a new resume or existing resume must be provided',
      path: ['resumeId'],
    },
  );

export type ApplicationSchemaType = z.infer<typeof applicationSchema>;
export type CreateApplicationSchemaType = z.infer<typeof createApplicationSchema>;
export type UpdateApplicationSchemaType = z.infer<typeof updateApplicationSchema>;
export type SubmitApplicationSchemaType = z.infer<typeof submitApplicationSchema>;

export { applicationSchema, createApplicationSchema, updateApplicationSchema, submitApplicationSchema };
