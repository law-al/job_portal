import { z } from 'zod';

// Email template types enum matching the mongoose model
export const EmailTemplateTypeEnum = z.enum(['welcome', 'password', 'application', 'interview', 'jobalert', 'verification', 'offer', 'rejection', 'stage_update', 'custom']);

export type EmailTemplateType = z.infer<typeof EmailTemplateTypeEnum>;

// Metadata schema for email template settings
const emailTemplateMetadataSchema = z.object({
  fromName: z.string().max(100, 'From name cannot exceed 100 characters').optional(),
  fromEmail: z.string().email('Invalid email address').max(255, 'From email cannot exceed 255 characters').optional(),
  replyTo: z.string().email('Invalid email address').max(255, 'Reply-to email cannot exceed 255 characters').optional(),
  backgroundColor: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Background color must be a valid hex color')
    .default('#ffffff')
    .optional(),
});

// Main email template schema matching the mongoose model
const emailTemplateSchema = z.object({
  id: z.string().optional(), // MongoDB _id as string
  companyId: z.string().uuid('Invalid company ID'),
  templateType: EmailTemplateTypeEnum,
  name: z.string().min(1, 'Template name is required').max(255, 'Template name cannot exceed 255 characters'),
  description: z.string().max(500, 'Description cannot exceed 500 characters').optional(),
  subject: z.string().min(1, 'Subject is required').max(255, 'Subject cannot exceed 255 characters'),
  preheader: z.string().max(150, 'Preheader cannot exceed 150 characters').optional(),
  content: z.string().min(1, 'Content is required'),
  editorState: z.string().min(1, 'Editor state is required'),
  variables: z.array(z.string()).default([]),
  metadata: emailTemplateMetadataSchema.optional(),
  isActive: z.boolean().default(true),
  isDefault: z.boolean().default(false),
  lastEditedBy: z.string().uuid('Invalid user ID'),
  version: z.number().int().positive().default(1).optional(),
  tags: z.array(z.string()).default([]),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

const createEmailTemplateSchema = emailTemplateSchema
  .omit({
    id: true,
    version: true,
    createdAt: true,
    updatedAt: true,
    companyId: true, // Will be provided from route params
    lastEditedBy: true, // Will be provided from authenticated user
  })
  .extend({
    // These will be added in the service from params/auth
    companyId: z.string().uuid('Invalid company ID').optional(),
    lastEditedBy: z.string().uuid('Invalid user ID').optional(),
  })
  .refine(
    (data) => {
      // Validate that editorState is valid JSON
      try {
        JSON.parse(data.editorState);
        return true;
      } catch {
        return false;
      }
    },
    {
      message: 'Editor state must be valid JSON',
      path: ['editorState'],
    },
  );

// Schema for updating an email template (all fields optional except identifying fields)
const updateEmailTemplateSchema = z
  .object({
    id: z.string().min(1, 'Template ID is required'),
    name: z.string().min(1, 'Template name is required').max(255, 'Template name cannot exceed 255 characters').optional(),
    description: z.string().max(500, 'Description cannot exceed 500 characters').optional(),
    subject: z.string().min(1, 'Subject is required').max(255, 'Subject cannot exceed 255 characters').optional(),
    preheader: z.string().max(150, 'Preheader cannot exceed 150 characters').optional(),
    content: z.string().min(1, 'Content is required').optional(),
    editorState: z.string().min(1, 'Editor state is required').optional(),
    variables: z.array(z.string()).optional(),
    metadata: emailTemplateMetadataSchema.optional(),
    isActive: z.boolean().optional(),
    isDefault: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      // If editorState is provided, validate it's valid JSON
      if (data.editorState) {
        try {
          JSON.parse(data.editorState);
          return true;
        } catch {
          return false;
        }
      }
      return true;
    },
    {
      message: 'Editor state must be valid JSON',
      path: ['editorState'],
    },
  );

// Type exports
export type EmailTemplateSchemaType = z.infer<typeof emailTemplateSchema>;
export type CreateEmailTemplateSchemaType = z.infer<typeof createEmailTemplateSchema>;
export type UpdateEmailTemplateSchemaType = z.infer<typeof updateEmailTemplateSchema>;

// Schema exports
export { emailTemplateSchema, createEmailTemplateSchema, updateEmailTemplateSchema, emailTemplateMetadataSchema };
