// export const CreateJobApplication = async ({ body, resumes }) => {};

import mongoose from 'mongoose';
import { uploadFilesToBucket } from '../utils/aws.js';
import { Document } from '../models/document/document.model.js';
import { submitApplicationSchema } from '../models/application.model.js';
import { FindJobId, GetPipelineStagesByJobId } from './jobs.service.js';
import { BadRequestException, NotFoundException } from '../exceptions/exceptions.js';
import { FindUserById } from './auth.service.js';
import { prisma } from '../utils/prismaClient.js';

// NOTE: Create Application
export const CreateApplication = async (body: any) => {
  try {
    const validatedBody = submitApplicationSchema.parse({ ...body, documentsId: Array.isArray(body.documentsId) ? body.documentsId : [body.documentsId] });

    const job = await FindJobId(validatedBody.jobId);
    const user = await FindUserById(validatedBody.userId);
    if (!job) throw new NotFoundException('Job not found');
    if (!user) throw new NotFoundException('User not found');

    // const pipelineStages = await GetPipelineStagesByJobId(job.id);

    return await prisma.application.create({
      data: {
        currentLocation: validatedBody.location,
        email: validatedBody.email,
        firstName: validatedBody.firstName,
        lastName: validatedBody.lastName,
        phone: validatedBody.phone,
        coverLetter: validatedBody.coverLetter || '',
        jobId: validatedBody.jobId,
        userId: validatedBody.userId,
        resumeId: validatedBody.resumeId || null,
        documentsIds: validatedBody.documentsId || [],
      },
    });
  } catch (error) {
    throw error;
  }
};

export const SaveDocumentsToDb = async ({ resumes, supportingDocuments }: { resumes: Express.Multer.File[] | []; supportingDocuments: Express.Multer.File[] | [] }) => {
  try {
    if (resumes && resumes.length > 0) {
      const results = await uploadFilesToBucket(resumes, 'resume');
    }

    if (supportingDocuments && supportingDocuments.length > 0) {
      const result = await uploadFilesToBucket(supportingDocuments, 'resume');
      console.log(result);
    }
  } catch (error) {}
};

export const SaveResumeToDb = async (resumes: Express.Multer.File[] | [], type: string = 'resume') => {
  let uploadedDocument: {
    key: string;
    type: string | null;
    originalName: string;
    url: string;
  }[] = [];

  const session = await mongoose.startSession();

  try {
    if (resumes && resumes.length > 0) {
      uploadedDocument = await uploadFilesToBucket(resumes, type);
    }

    if (uploadedDocument.length > 0) {
      await session.withTransaction(async () => {
        for (const result of uploadedDocument) {
          await Document.create(
            [
              {
                documentType: type,
                createdAt: result.key,
                originalName: result.originalName,
                key: result.key,
                url: result.url,
              },
            ],
            { session },
          );
        }
      });
    }
  } catch (error) {}
};
