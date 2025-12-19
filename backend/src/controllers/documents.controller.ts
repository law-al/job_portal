import type { Response, Request, NextFunction } from 'express';
import { BadRequestException } from '../exceptions/exceptions.js';
import { ErrorCodes } from '../exceptions/index.js';
import { uploadFileToBucket, deleteFileFromBucket } from '../utils/aws.js';
import { SaveDocumentToDb, DeleteDocumentFromDb, GetUserResumes } from '../services/document.service.js';

export const saveResume = async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req.user as any).id;
  const resume = req.file;

  if (!resume) {
    throw new BadRequestException('a resume needs to be uploaded', ErrorCodes.BAD_REQUEST);
  }

  const results = await uploadFileToBucket(resume, 'resume');

  const savedDocument = await SaveDocumentToDb(results, userId);

  if (!savedDocument) {
    throw new BadRequestException('failed to save documents', ErrorCodes.BAD_REQUEST);
  }

  res.status(200).json({
    success: true,
    message: 'resume uploaded successfully',
    data: {
      id: savedDocument.id,
      key: savedDocument.key,
      originalName: savedDocument.originalName,
      url: savedDocument.url,
      size: savedDocument.size,
    },
  });
};

export const getUserResumes = async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req.user as any).id;

  try {
    const resumes = await GetUserResumes(userId);

    res.status(200).json({
      success: true,
      message: 'Resumes fetched successfully',
      data: resumes,
    });
  } catch (error) {
    throw error;
  }
};

export const saveSupportingDocument = async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req.user as any).id;
  const document = req.file;

  if (!document) {
    throw new BadRequestException('a document needs to be uploaded', ErrorCodes.BAD_REQUEST);
  }

  const results = await uploadFileToBucket(document, 'supporting_document');

  const savedDocument = await SaveDocumentToDb(results, userId);

  if (!savedDocument) {
    throw new BadRequestException('failed to save document', ErrorCodes.BAD_REQUEST);
  }

  res.status(200).json({
    success: true,
    message: 'Supporting document uploaded successfully',
    data: {
      id: savedDocument.id,
      key: savedDocument.key,
      originalName: savedDocument.originalName,
      url: savedDocument.url,
      size: savedDocument.size,
    },
  });
};

export const deleteDocument = async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req.user as any).id;
  const { id: documentId } = req.params;

  if (!documentId) {
    throw new BadRequestException('Document ID is required', ErrorCodes.BAD_REQUEST);
  }

  try {
    // Delete from MongoDB and get the file key
    const { key } = await DeleteDocumentFromDb(documentId, userId);

    // Delete from S3
    await deleteFileFromBucket(key);

    res.status(200).json({
      success: true,
      message: 'Document deleted successfully',
    });
  } catch (error) {
    // If MongoDB deletion failed, don't try to delete from S3
    // If MongoDB deletion succeeded but S3 deletion failed, log it but still return success
    // since the document is already removed from the database
    if (error instanceof Error && error.message.includes('Document not found')) {
      throw error;
    }
    if (error instanceof Error && error.message.includes('permission')) {
      throw error;
    }
    // Log S3 deletion errors but don't fail the request since DB deletion succeeded
    console.error('Failed to delete file from S3:', error);
    res.status(200).json({
      success: true,
      message: 'Document deleted from database. Note: File may still exist in storage.',
    });
  }
};
