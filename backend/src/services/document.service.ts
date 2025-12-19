import mongoose from 'mongoose';
import { Document } from '../models/document/document.model.js';
import { deleteFileFromBucket } from '../utils/aws.js';
import { NotFoundException, ForbiddenException } from '../exceptions/exceptions.js';

interface Data {
  key: string;
  type: 'resume' | 'cover_letter' | 'supporting_document' | 'other';
  originalName: string;
  url: string;
  mimetype: string;
  size: number;
}

export const SaveDocumentToDb = async (data: Data, userId: string) => {
  const session = await mongoose.startSession();
  try {
    const createdDocs = await session.withTransaction(async () => {
      const docs = await Document.create(
        [
          {
            documentType: data.type,
            key: data.key,
            originalName: data.originalName,
            url: data.url,
            mimetype: data.mimetype,
            size: data.size,
            userId,
          },
        ],
        { session },
      );
      return docs[0];
    });
    return createdDocs;
  } catch (error) {
    await deleteFileFromBucket(data.key);
    throw error;
  } finally {
    session.endSession();
  }
};

// Alias for backward compatibility
export const SaveResumeToDb = SaveDocumentToDb;

export const DeleteDocumentFromDb = async (documentId: string, userId: string) => {
  try {
    // Find the document
    const document = await Document.findById(documentId);

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    // Verify the user owns this document
    if (document.userId !== userId) {
      throw new ForbiddenException('You do not have permission to delete this document');
    }

    // Get the key before deleting (needed for S3 deletion)
    const fileKey = document.key;

    // Delete from MongoDB
    await Document.findByIdAndDelete(documentId);

    // Return the key so it can be deleted from S3
    return { success: true, key: fileKey };
  } catch (error) {
    throw error;
  }
};

export const GetUserResumes = async (userId: string) => {
  try {
    const resumes = await Document.find({
      userId,
      documentType: 'resume',
    })
      .select('id key url originalName mimetype size createdAt updatedAt')
      .sort({ createdAt: -1 }); // Most recent first

    return resumes.map((resume) => ({
      id: resume._id.toString(),
      key: resume.key,
      url: resume.url,
      originalName: resume.originalName,
      mimetype: resume.mimetype,
      size: resume.size,
      createdAt: resume.createdAt,
    }));
  } catch (error) {
    throw error;
  }
};
