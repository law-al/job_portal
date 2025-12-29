import { BadRequestException } from '../exceptions/exceptions.js';
import { ErrorCodes } from '../exceptions/index.js';
import { EmailTemplate } from '../models/emailTemplate/email.model.js';
import { createEmailTemplateSchema } from '../models/emailTemplate/emailZod.model.js';

export const CreateEmailTemplate = async (data: { companyId: string; userId: string; body: any }) => {
  try {
    // Validate required parameters
    if (!data.companyId) {
      throw new BadRequestException('Company ID must be provided', ErrorCodes.MISSING_COMPANY_ID);
    }
    if (!data.userId) {
      throw new BadRequestException('User ID must be provided', ErrorCodes.MISSING_USER_ID);
    }

    // Validate the request body with Zod schema
    const validatedBody = createEmailTemplateSchema.parse({
      ...data.body,
      companyId: data.companyId,
      lastEditedBy: data.userId,
    });

    // Create the email template
    const createdEmailTemplate = await EmailTemplate.create({
      ...validatedBody,
      companyId: data.companyId,
      lastEditedBy: data.userId,
    });

    return createdEmailTemplate;
  } catch (error) {
    throw error;
  }
};
