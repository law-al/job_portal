import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary';
import config from '../config/config.js';
import { BadRequestException } from '../exceptions/exceptions.js';
import { ErrorCodes } from '../exceptions/index.js';

cloudinary.config({
  cloud_name: config.cloudinaryCloudName,
  api_key: config.cloudinaryApiKey,
  api_secret: config.cloudinaryApiSecret,
  secure: true,
});

export const cloudinaryFolderName = 'job-portal/company/logos';

export const uploadToCloudinary = (
  fileBuffer: Buffer,

  folderName: string,
): Promise<UploadApiResponse> => {
  const sanitizedName = folderName.replace(/[^a-zA-Z0-9-_]/g, '_').replace(/\s+/g, '_');

  const folder = `${sanitizedName}/logos`;

  const publicId = `${sanitizedName}_${new Date().toISOString().replace(/[:.]/g, '-')}`;

  try {
    if (!fileBuffer || fileBuffer.length === 0) throw new BadRequestException('No file uploaded', ErrorCodes.INVALID_FILE_TYPE);

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
