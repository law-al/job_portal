import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary';
import config from '../config/config.js';
import { BadRequestException } from '../exceptions/exceptions.js';

cloudinary.config({
  cloud_name: config.cloudinaryCloudName,
  api_key: config.cloudinaryApiKey,
  api_secret: config.cloudinaryApiSecret,
  secure: true,
});

export const cloudinaryFolderName = 'job-portal/company/logos';

export const uploadToCloudinary = (
  fileBuffer: Buffer,
  folder: string,
  publicId: string,
): Promise<UploadApiResponse> => {
  try {
    if (!fileBuffer || fileBuffer.length === 0)
      throw new BadRequestException('No file uploaded');

    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: 'auto',
            folder: folder,
            public_id: publicId,
          },
          (error, result) => {
            if (error) {
              return reject(error);
            }
            resolve(result as UploadApiResponse);
          },
        )
        .end(fileBuffer);
    });
  } catch (error) {
    throw error;
  }
};
