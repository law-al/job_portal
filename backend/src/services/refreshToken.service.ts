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
    // Create a new refresh token (allows multiple devices/sessions)
    const hashedToken = hashRefreshToken(payload.token);

    const newToken = await RefreshToken.create({
      userId: payload.userId,
      token: payload.token,
      hashedToken: hashedToken,
      expiresAt: payload.expiresAt,
      isRevoked: false,
    });

    logger.info(`Refresh token has been saved to db - ${new Date()}`);
    return hashedToken;
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
    const result = await RefreshToken.findOne({
      hashedToken: token,
      isRevoked: false,
      expiresAt: { $gt: new Date() },
    });

    if (!result) throw new NotFoundException('unauthorized, refresh token expired, please login again');
    return result;
  } catch (error) {
    console.error('Error finding refresh token:', error);
    throw error;
  }
};

export const revokeRefreshToken = async (token: string) => {
  try {
    const result = await RefreshToken.findOneAndUpdate(
      {
        hashedToken: token,
        isRevoked: false,
      },
      {
        $set: {
          isRevoked: true,
          revokedAt: new Date(),
        },
      },
      { new: true },
    );

    if (!result) {
      throw new NotFoundException('Refresh token not found');
    }

    logger.info(`Refresh token revoked - ${new Date()}`);
    return result;
  } catch (error) {
    logger.error('Error revoking refresh token:', error);
    throw error;
  }
};

export const revokeAllUserTokens = async (userId: string) => {
  try {
    const result = await RefreshToken.updateMany(
      {
        userId,
        isRevoked: false,
      },
      {
        $set: {
          isRevoked: true,
          revokedAt: new Date(),
        },
      },
    );

    logger.info(`All refresh tokens revoked for user ${userId} - ${new Date()}`);
    return result;
  } catch (error) {
    logger.error('Error revoking all user tokens:', error);
    throw error;
  }
};
