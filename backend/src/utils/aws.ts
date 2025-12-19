import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import config from '../config/config.js';
import { randomUUID } from 'crypto';
import type { DocumentType } from '../models/document/document.model.js';

const s3Client = new S3Client({
  credentials: {
    accessKeyId: config.AwsAccessKey,
    secretAccessKey: config.AwsSecretKey,
  },
  region: config.AwsRegion,
});

const getParams = (file: Express.Multer.File) => {
  const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');

  return {
    Bucket: config.AwsBucketName,
    Key: `uploads/${Date.now()}-${randomUUID()}-${sanitizedName}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };
};

export const uploadFilesToBucket = async (files: Express.Multer.File[], type: string | null = 'general') => {
  try {
    const uploadPromises = files.map((file) => {
      const params = getParams(file);
      const command = new PutObjectCommand(params);
      s3Client.send(command);

      return {
        key: params.Key,
        type,
        originalName: file.originalname,
        url: `https://${config.AwsBucketName}.s3.${config.AwsRegion}.amazonaws.com/${params.Key}`,
      };
    });

    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error('Failed to upload files to S3:', error);
    throw new Error('File upload failed');
  }
};

export const uploadFileToBucket = async (file: Express.Multer.File, type: DocumentType) => {
  try {
    const params = getParams(file);
    const command = new PutObjectCommand(params);
    const result = await s3Client.send(command);

    return {
      key: params.Key,
      type,
      originalName: file.originalname,
      url: `https://${config.AwsBucketName}.s3.${config.AwsRegion}.amazonaws.com/${params.Key}`,
      mimetype: file.mimetype,
      size: file.size,
    };
  } catch (error) {
    console.error('Failed to upload files to S3:', error);
    throw new Error('File upload failed');
  }
};

export const deleteFileFromBucket = async (fileKey: string) => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: config.AwsBucketName,
      Key: fileKey,
    });

    await s3Client.send(command);
    return { success: true, deletedKey: fileKey };
  } catch (error) {
    console.error('Failed to delete file from S3:', error);
    throw new Error('File deletion failed');
  }
};
