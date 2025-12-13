import { hashSync, compareSync } from 'bcrypt';
import { prisma } from '../utils/prismaClient.js';
import { RegisterSchema, LoginUserSchema } from '../models/index.js';
import logger from '../utils/logger.js';
import { BadRequestException, UserNotFoundException, ValidationException } from '../exceptions/exceptions.js';
import crypto from 'crypto';
import { ChangePasswordSchema, RegisterOauthSchema, RegisterUserCompanySchema } from '../models/user.model.js';
import { createHash } from '../utils/createHash.js';
import { ErrorCodes } from '../exceptions/index.js';

// NOTE: Find User By Email
export const FindUserByEmail = async (email: string) => {
  try {
    return await prisma.user.findUnique({
      where: { email },
    });
  } catch {
    throw new UserNotFoundException();
  }
};

// NOTE: Find User By ID
export const FindUserById = async (id: string) => {
  try {
    return await prisma.user.findUniqueOrThrow({
      where: { id },
    });
  } catch {
    throw new UserNotFoundException();
  }
};

// NOTE: Register User
export const RegisterUser = async (body: any) => {
  try {
    const validatedBody = RegisterSchema.parse(body);

    const user = await prisma.user.create({
      data: {
        email: validatedBody.email,
        role: 'USER',
        password: hashSync(validatedBody.password, 12),
      },
    });

    logger.info(`User ${user.email} has been saved to db`);

    return user;
  } catch (error) {
    throw error;
  }
};

export const RegisterUserCompany = async (body: any) => {
  try {
    const validatedBody = RegisterUserCompanySchema.parse(body);

    const user = await prisma.user.findFirst({
      where: {
        email: validatedBody.email,
      },
    });

    if (user) throw new BadRequestException('email already in use', ErrorCodes.EMAIL_ALREADY_EXISTS);

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: validatedBody.email,
          password: hashSync(validatedBody.password, 12),
          role: 'COMPANY',
        },
      });

      const company = await tx.company.create({
        data: {
          createdBy: user.id,
          address: validatedBody.address,
          description: validatedBody.description,
          logo: validatedBody.logo,
          name: validatedBody.name,
          website: validatedBody.website,
        },
      });

      const userCompany = await tx.userCompany.create({
        data: {
          userId: user.id,
          companyId: company.id,
          role: 'ADMIN',
        },
      });

      return { user, company, userCompany };
    });

    return result;
  } catch (error) {
    throw error;
  }
};

export const RegisterOauthUser = async (body: any) => {
  try {
    const validatedBody = RegisterOauthSchema.parse(body);

    const user = await prisma.user.upsert({
      where: {
        email: validatedBody.email,
      },
      update: {
        provider: validatedBody.provider,
        providerId: validatedBody.providerId,
      },
      create: {
        email: validatedBody.email,
        provider: validatedBody.provider,
        providerId: validatedBody.providerId,
        isVerified: true,
        role: validatedBody.role,
      },
    });

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
    if (!user.password && user.providerId) return user;
    if (!user.password) throw new BadRequestException('Password must be provided', ErrorCodes.USER_NOT_FOUND);
    const isMatch = compareSync(validatedBody.password, user.password);
    if (!isMatch) throw new ValidationException('Incorrect password', ErrorCodes.PASSWORD_NOT_CORRECT);

    console.log(user);
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
        password: hashSync(validatedBody.password, 12),
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
    if (!token) throw new BadRequestException('no token provided', ErrorCodes.TOKEN_INVALID);
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

    if (!user) throw new BadRequestException('Token expired', ErrorCodes.EMAIL_LINK_EXPIRED);

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        emailVerificationToken: null,
        emailVerificationTokenExpiresAt: null,
        isEmailVerified: true,
        isVerified: true,
      },
    });

    return user;
  } catch (error) {
    throw error;
  }
};

export const VerifyUserPasswordToken = async (token: string) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: hashedToken,
        passwordResetTokenExpiresAt: {
          gte: new Date(),
        },
      },
    });

    if (!user) throw new BadRequestException('reset link expired', ErrorCodes.INVALID_PASSWORD_RESET_TOKEN);

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

export const VerifyUserPasswordExpiredToken = async (token: string) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: hashedToken,
        passwordResetTokenExpiresAt: {
          lte: new Date(),
        },
      },
    });

    if (!user) throw new BadRequestException('A verification link has been sent', ErrorCodes.BAD_GATEWAY);

    return user;
  } catch (error) {
    throw error;
  }
};
