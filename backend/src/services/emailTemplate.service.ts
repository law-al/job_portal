import { BadRequestException, NotFoundException } from '../exceptions/exceptions.js';
import { ErrorCodes } from '../exceptions/index.js';
import { EmailTemplate } from '../models/emailTemplate/email.model.js';
import { createEmailTemplateSchema, updateEmailTemplateSchema } from '../models/emailTemplate/emailZod.model.js';

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

// Fetch email templates for a company with optional filters
export const FindCompanyEmailTemplates = async (data: {
  companyId: string;
  templateType?: string;
  isActive?: boolean;
  isDefault?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  try {
    if (!data.companyId) {
      throw new BadRequestException('Company ID must be provided', ErrorCodes.MISSING_COMPANY_ID);
    }

    const page = data.page || 1;
    const limit = data.limit || 10;
    const skip = (page - 1) * limit;

    // Build query filter
    const filter: any = {
      companyId: data.companyId,
    };

    if (data.templateType) {
      filter.templateType = data.templateType;
    }

    if (data.isActive !== undefined) {
      filter.isActive = data.isActive;
    }

    if (data.isDefault !== undefined) {
      filter.isDefault = data.isDefault;
    }

    if (data.search) {
      filter.name = { $regex: data.search, $options: 'i' };
    }

    // Fetch templates with pagination
    const [templates, total] = await Promise.all([EmailTemplate.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit).lean(), EmailTemplate.countDocuments(filter)]);

    const totalPages = Math.ceil(total / limit);

    return {
      templates,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  } catch (error) {
    throw error;
  }
};

// Fetch a single email template by ID
export const FindEmailTemplateById = async (templateId: string, companyId: string) => {
  try {
    if (!templateId) {
      throw new BadRequestException('Template ID must be provided', ErrorCodes.BAD_REQUEST);
    }

    if (!companyId) {
      throw new BadRequestException('Company ID must be provided', ErrorCodes.MISSING_COMPANY_ID);
    }

    const template = await EmailTemplate.findOne({
      _id: templateId,
      companyId: companyId,
    }).lean();

    if (!template) {
      return null;
    }

    return template;
  } catch (error) {
    throw error;
  }
};

// Update email template
export const UpdateEmailTemplate = async (data: { templateId: string; companyId: string; userId: string; body: any }) => {
  try {
    // Validate required parameters
    if (!data.templateId) {
      throw new BadRequestException('Template ID must be provided', ErrorCodes.BAD_REQUEST);
    }

    if (!data.companyId) {
      throw new BadRequestException('Company ID must be provided', ErrorCodes.MISSING_COMPANY_ID);
    }

    if (!data.userId) {
      throw new BadRequestException('User ID must be provided', ErrorCodes.MISSING_USER_ID);
    }

    // Check if template exists and belongs to the company
    const existingTemplate = await EmailTemplate.findOne({
      _id: data.templateId,
      companyId: data.companyId,
    });

    if (!existingTemplate) {
      throw new NotFoundException('Email template not found');
    }

    // Validate the request body with Zod schema
    const validatedBody = updateEmailTemplateSchema.parse({
      id: data.templateId,
      ...data.body,
    });

    // Prepare update data (exclude id from update)
    const { id, ...updateData } = validatedBody;

    // Check if content, subject, or preheader changed (for version increment)
    const contentChanged = updateData.content !== undefined && updateData.content !== existingTemplate.content;
    const subjectChanged = updateData.subject !== undefined && updateData.subject !== existingTemplate.subject;
    const preheaderChanged = updateData.preheader !== undefined && updateData.preheader !== existingTemplate.preheader;

    // Prepare final update object with additional fields
    const finalUpdateData: any = {
      ...updateData,
      lastEditedBy: data.userId,
    };

    // Increment version if content-related fields changed
    if (contentChanged || subjectChanged || preheaderChanged) {
      finalUpdateData.version = (existingTemplate.version || 1) + 1;
    }

    // Update the template
    const updatedTemplate = await EmailTemplate.findByIdAndUpdate(
      data.templateId,
      {
        $set: finalUpdateData,
      },
      {
        new: true,
        runValidators: true,
      },
    ).lean();

    if (!updatedTemplate) {
      throw new NotFoundException('Email template not found after update');
    }

    return updatedTemplate;
  } catch (error) {
    throw error;
  }
};
