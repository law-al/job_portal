import { hashSync, compareSync } from 'bcrypt';
import { prisma } from '../utils/prismaClient.js';
import { RegisterSchema, LoginUserSchema } from '../models/index.js';
import logger from '../utils/logger.js';
import {
  BadRequestException,
  UserNotFoundException,
  ValidationException,
} from '../exceptions/exceptions.js';
import crypto from 'crypto';
import { ChangePasswordSchema } from '../models/user.model.js';
import { createHash } from '../utils/createHash.js';
import { ErrorCodes } from '../exceptions/index.js';

// NOTE: Find User By Email
export const FindUserByEmail = async (email: string) => {
  try {
    return await prisma.user.findUniqueOrThrow({
      where: { email },
    });
  } catch (error: any) {
    throw new Error(`User with email "${email}" not found`);
  }
};

// NOTE: Find User By ID
export const FindUserById = async (id: string) => {
  try {
    return await prisma.user.findUniqueOrThrow({
      where: { id },
    });
  } catch (error: any) {
    throw new Error(`User with ID not found`);
  }
};

// NOTE: Register User
export const RegisterUser = async (body: any) => {
  try {
    const validatedBody = RegisterSchema.parse(body);

    const user = await prisma.user.create({
      data: {
        firstName: validatedBody.firstName,
        lastName: validatedBody.lastName,
        email: validatedBody.email,
        role: validatedBody.role,
        password: hashSync(validatedBody.password, 12),
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });

    logger.info(`User ${user.firstName} has been saved to db`);

    return user;
  } catch (error) {
    throw error;
  }
};

// NOTE: Login User
export const LoginUser = async (body: any) => {
  try {
    const validatedBody = LoginUserSchema.parse(body);
    const user = await FindUserByEmail(validatedBody.email);
    if (!user) throw new UserNotFoundException();
    const isMatch = compareSync(validatedBody.password, user.password);
    if (!isMatch)
      throw new ValidationException(
        'password incorrect',
        ErrorCodes.PASSWORD_NOT_CORRECT,
      );
    return user;
  } catch (error) {
    throw error;
  }
};

// NOTE: Update User password
export const UpdateUserPassword = async (body: any, id: string) => {
  try {
    const validatedBody = ChangePasswordSchema.parse(body);
    const user = await FindUserById(id);
    if (!user) throw new UserNotFoundException();
    await prisma.user.update({
      where: {
        id,
      },
      data: {
        password: hashSync(validatedBody.newPassword, 12),
        passwordChangedAt: new Date(),
        isPasswordChanged: true,
      },
    });
  } catch (error) {
    throw error;
  }
};

// NOTE: Delete User
export const DeleteUser = async (id: string) => {
  try {
    await prisma.user.delete({
      where: {
        id,
      },
    });

    logger.info(`User has been deleted successfully from db`);
  } catch (error) {
    throw error;
  }
};

export const GetVerifyEmailToken = async (payload: string) => {
  try {
    const { token, hashedToken } = createHash();

    const user = await prisma.user.findUnique({
      where: {
        id: payload,
      },
    });

    if (!user) throw new UserNotFoundException();

    await prisma.user.update({
      where: {
        id: user.id,
        isEmailVerified: false,
        isDeleted: false,
      },
      data: {
        emailVerificationToken: hashedToken,
        emailVerificationTokenExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
      },
    });

    return token;
  } catch (error) {
    throw error;
  }
};

export const GetVerifyPasswordToken = async (payload: string) => {
  try {
    const { token, hashedToken } = createHash();

    const user = await prisma.user.findUnique({
      where: {
        id: payload,
      },
    });

    if (!user) throw new UserNotFoundException();

    await prisma.user.update({
      where: {
        id: user.id,
        isDeleted: false,
      },
      data: {
        passwordResetToken: hashedToken,
        passwordResetTokenExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
      },
    });

    return token;
  } catch (error) {
    throw error;
  }
};

export const VerifyUserEmailToken = async (token: string) => {
  try {
    if (!token)
      throw new BadRequestException(
        'no token provided',
        ErrorCodes.TOKEN_INVALID,
      );
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await prisma.user.findFirst({
      where: {
        emailVerificationToken: hashedToken,
        emailVerificationTokenExpiresAt: {
          gte: new Date(),
        },
        isEmailVerified: false,
      },
    });

    if (!user) throw new UserNotFoundException();

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        emailVerificationToken: null,
        emailVerificationTokenExpiresAt: null,
        isEmailVerified: true,
      },
    });

    return;
  } catch (error) {
    throw error;
  }
};

export const VerifyUserPasswordToken = async (token: string) => {
  try {
    if (!token)
      throw new BadRequestException(
        'no token provided',
        ErrorCodes.TOKEN_INVALID,
      );
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: hashedToken,
        passwordResetTokenExpiresAt: {
          gte: new Date(),
        },
      },
    });

    if (!user)
      throw new BadRequestException(
        'reset link expired',
        ErrorCodes.INVALID_PASSWORD_RESET_TOKEN,
      );

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        passwordResetToken: null,
        passwordResetTokenExpiresAt: null,
      },
    });

    return user;
  } catch (error) {
    throw error;
  }
};
