import type { Request, Response, NextFunction } from 'express';
import { uploadFilesToBucket, uploadFileToBucket } from '../utils/aws.js';
import { BadRequestException } from '../exceptions/exceptions.js';
import { ErrorCodes } from '../exceptions/index.js';
import { CreateApplication, SaveDocumentsToDb } from '../services/applications.service.js';

export const sendApplication = async (req: Request, res: Response, next: NextFunction) => {
  console.log('Entered');
  console.log(req.body);
  const userId = (req.user as any).id;

  const results = await CreateApplication({ ...req.body, userId });

  // const result = await CreateJobApplication(req.body, resumes, supportingDocuments);

  res.status(201).json({
    success: true,
    message: 'application successful',
  });
};
