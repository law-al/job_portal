import crypto from 'crypto';
import RefreshToken from '../models/refreshToken.model.js';
import logger from '../utils/logger.js';
import { NotFoundException } from '../exceptions/exceptions.js';

interface RefreshTokenType {
  userId: string;
  token: string;
  expiresAt: Date;
}

const hashRefreshToken = (token: string): string => {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  return hashedToken;
};

export const saveRefreshTokenToDB = async (payload: RefreshTokenType) => {
  try {
    const refreshToken = await RefreshToken.findOneAndUpdate(
      {
        userId: payload.userId,
        expiresAt: {
          $gt: new Date(),
        },
      },
      {
        $set: {
          token: hashRefreshToken(payload.token),
          expiresAt: payload.expiresAt,
        },
      },
      { upsert: true, new: true },
    );

    logger.info(`Refresh token has been saved to db - ${new Date()}`);
    return refreshToken;
  } catch (error) {
    logger.error('Error saving refresh token:', error);
    throw error;
  }
};

export const FindTokenByUser = async (userId: string) => {
  try {
    const result = await RefreshToken.findOne({
      userId,
      isRevoked: false,
      expiresAt: { $gt: new Date() },
    });

    return result;
  } catch (error) {
    console.error('Error finding refresh token:', error);
    throw error;
  }
};

export const FindRefreshToken = async (token: string) => {
  try {
    console.log(token);
    const result = await RefreshToken.findOne({
      token: hashRefreshToken(token),
      isRevoked: false,
      expiresAt: { $gt: new Date() },
    });

    if (!result)
      throw new NotFoundException('Wrong token');
  } catch (error) {
    console.error('Error finding refresh token:', error);
    throw error;
  }
};
