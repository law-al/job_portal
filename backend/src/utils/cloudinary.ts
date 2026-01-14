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

function getPublicId(url: string): string {
  if (!url) throw new BadRequestException('A url needs to be provided', ErrorCodes.BAD_REQUEST);

  const parts = url.split('/upload/');
  if (!parts[1]) throw new BadRequestException('Invalid Cloudinary URL', ErrorCodes.BAD_REQUEST);

  return parts[1].replace(/^v\d+\//, '').replace(/\.[^/.]+$/, '');
}

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

/**
 * Upload profile image to Cloudinary
 * @param fileBuffer - The file buffer to upload
 * @param userId - The user ID for folder organization
 * @returns Promise<UploadApiResponse>
 */
export const uploadProfileImageToCloudinary = (fileBuffer: Buffer, userId: string): Promise<UploadApiResponse> => {
  try {
    if (!fileBuffer || fileBuffer.length === 0) {
      throw new BadRequestException('No file uploaded', ErrorCodes.INVALID_FILE_TYPE);
    }

    const folder = 'job-portal/user-profiles';
    const publicId = `profile_${userId}_${new Date().toISOString().replace(/[:.]/g, '-')}`;

    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: 'image',
            folder: folder,
            public_id: publicId,
            transformation: [
              {
                width: 400,
                height: 400,
                crop: 'fill',
                gravity: 'face',
                quality: 'auto',
                fetch_format: 'auto',
              },
            ],
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

/**
 * Delete image from Cloudinary
 * @param publicId - The public ID of the image to delete
 * @returns Promise<void>
 */
export const deleteImageFromCloudinary = async (id: string): Promise<void> => {
  try {
    const publicId = getPublicId(id);
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    // Don't throw error, just log it
  }
};
