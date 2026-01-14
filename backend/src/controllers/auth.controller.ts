import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import {
  FindUserByEmail,
  FindUserById,
  GetVerifyEmailToken,
  GetVerifyPasswordToken,
  LoginUser,
  RegisterOauthUser,
  RegisterUser,
  RegisterUserCompany,
  UpdateUserPassword,
  VerifyUserEmailToken,
  VerifyUserPasswordExpiredToken,
  VerifyUserPasswordToken,
} from '../services/auth.service.js';
import config from '../config/config.js';
import { FindRefreshToken, FindTokenByUser, saveRefreshTokenToDB, revokeRefreshToken, revokeAllUserTokens } from '../services/refreshToken.service.js';
import logger from '../utils/logger.js';
import { sendForgetPasswordEmail, sendInvitationEmail, sendVerificationEmail } from '../services/mail.service.js';
import { BadRequestException, InvalidTokenException, TokenExpiredException, UserNotFoundException } from '../exceptions/exceptions.js';
import { decodeJwt } from '../services/index.js';
import { AcceptInvitedUser, CheckInviteToken, FindCompaniesByUserID, FindCompanyByUserID, InviteUser } from '../services/company.service.js';
import type { CompanyRole, UserRole } from '../generated/prisma/enums.js';
import { ErrorCodes } from '../exceptions/index.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import generateTokens from '../utils/generateToken.js';
import type { User } from '../generated/prisma/browser.js';
import { emailQueue } from '../queues/email.queue.js';

type JobName = 'verification' | 'forgot-password' | 'invite';

// NOTE: Register Account
export const register = async (req: Request, res: Response, next: NextFunction) => {
  const newUser = await RegisterUser(req.body);

  const { accessToken, refreshToken } = generateTokens(newUser);

  const refreshTokenHash = await saveRefreshTokenToDB({
    userId: newUser.id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  const verifyToken = await GetVerifyEmailToken(newUser.id);

  // queues
  await emailQueue.add('verification' as JobName, { email: newUser.email, token: verifyToken });

  logger.info(`verification link has been sent successfully`);

  res.status(201).json({
    success: true,
    message: 'User registered, proceed to verify email',
    data: {
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      role: newUser.role,
      isVerified: newUser.isVerified,
      accessToken,
      refreshTokenHash,
    },
  });
};

// NOTE: User login
export const login = async (req: Request, res: Response, next: NextFunction) => {
  let companyId: string | null = null;
  let companyRole: string | null = null;

  const user = await LoginUser(req.body);

  // check if user is an company and get user companyId and role
  const userCompany = await FindCompanyByUserID(user.id);

  if (userCompany) {
    companyId = userCompany.companyId;
    companyRole = userCompany.role;
  }

  const { accessToken, refreshToken } = generateTokens(user);

  const refreshTokenHash = await saveRefreshTokenToDB({
    userId: user.id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  res.status(200).json({
    success: true,
    message: 'User login successful',
    data: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isVerified: user.isVerified,
      companyId,
      companyRole,
      accessToken,
      refreshTokenHash,
    },
  });
};

export const registerUserCompany = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    throw new BadRequestException('No file uploaded', ErrorCodes.FILE_UPLOAD_FAILED);
  }

  if (!req.body.name) {
    throw new BadRequestException('Company name must be provided', ErrorCodes.MISSING_COMPANY_ID);
  }

  const result = await uploadToCloudinary(req.file.buffer, req.body.name);

  const { user, company } = await RegisterUserCompany({
    ...req.body,
    logo: result.secure_url,
  });

  const { accessToken, refreshToken } = generateTokens(user);

  const refreshTokenHash = await saveRefreshTokenToDB({
    userId: user.id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  const verifyToken = await GetVerifyEmailToken(user.id);

  await emailQueue.add('verification' as JobName, { email: user.email, token: verifyToken });

  logger.info(`verification link has been sent successfully`);

  res.status(201).json({
    success: true,
    message: 'User registered, proceed to verify email',
    data: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      companyId: company.id,
      isVerified: user.isVerified,
      accessToken,
      refreshTokenHash,
    },
  });
};

export const oAuth = async (req: Request, res: Response, next: NextFunction) => {
  console.log('oauth entered');
  const user = await RegisterOauthUser(req.body);

  let companyId: string | null = null;
  let companyRole: string | null = null;

  // check if user is an company and get user companyId and role
  const userCompany = await FindCompanyByUserID(user.id);

  if (userCompany) {
    companyId = userCompany.companyId;
    companyRole = userCompany.role;
  }

  const { accessToken, refreshToken } = generateTokens(user);

  const refreshTokenHash = await saveRefreshTokenToDB({
    userId: user.id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  res.status(200).json({
    success: true,
    data: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isVerified: user.isVerified,
      companyId,
      companyRole,
      accessToken,
      refreshTokenHash,
    },
  });
};

// NOTE: Verify Account
export const verifyAccount = async (req: Request, res: Response, next: NextFunction) => {
  const verifyToken = req.query.token as string;
  const user = await VerifyUserEmailToken(verifyToken);
  res.status(200).json({
    success: true,
    message: 'Email successfully verified',
    data: { isVerified: user.isVerified },
  });
};

// NOTE: Re Verify Account
export const reVerifyAccount = async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req.user as any).id;

  const user = await FindUserById(userId);
  if (user.isEmailVerified) throw new BadRequestException('User already verified', ErrorCodes.USER_ALREADY_VERIFIED);
  const verifyToken = await GetVerifyEmailToken(user.id);
  await emailQueue.add('verification' as JobName, { email: user.email, token: verifyToken });
  logger.info(`verification link has been sent successfully`);
  res.status(200).json({
    success: true,
    message: 'User registered, proceed to verify email',
    data: { email: user.email, role: user.role },
  });
};

// NOTE: Forgot Password
export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  const user = await FindUserByEmail(req.body.email);

  if (!user) {
    throw new UserNotFoundException();
  }

  const verifyToken = await GetVerifyPasswordToken(user.id);

  await emailQueue.add('forgot-password' as JobName, { email: user.email, token: verifyToken });

  logger.info(`verification link has been sent successfully`);

  res.status(200).json({ success: true, message: 'password reset link sent' });
};

// NOTE: Reset Password
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  const verifyToken = req.query.reset as string;
  if (!verifyToken) throw new BadRequestException('no token provided', ErrorCodes.TOKEN_INVALID);

  const user = await VerifyUserPasswordToken(verifyToken);

  await UpdateUserPassword(req.body, user.id);

  res.status(200).json({ success: true, message: 'password successfully changed' });
};

// NOTE: Resend Password Reset Link
export const resendPasswordResetLink = async (req: Request, res: Response, next: NextFunction) => {
  const verifyToken = req.query.reset as string;
  if (!verifyToken) throw new BadRequestException('no token provided', ErrorCodes.TOKEN_INVALID);

  const user = await VerifyUserPasswordExpiredToken(verifyToken);

  const token = await GetVerifyPasswordToken(user.id);

  await emailQueue.add('forgot-password' as JobName, { email: user.email, token: verifyToken });

  res.status(200).json({ success: true, message: 'password reset link sent' });
};

// NOTE: Invite user
export const inviteUser = async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req.user as any).id;
  const companyId = (req as any).company.id;

  const email = req.body.email;
  const role = (req.body.role as string).toUpperCase() as CompanyRole;

  if (!email) throw new BadRequestException('An email must be provided', ErrorCodes.MISSING_REQUIRED_FIELD);
  if (!role) throw new BadRequestException('A role must be provided', ErrorCodes.MISSING_REQUIRED_FIELD);
  if (!companyId) throw new BadRequestException('A company ID must be provided', ErrorCodes.MISSING_COMPANY_ID);
  const { email: inviteeEmail, token, role: inviteeRole, companyName } = await InviteUser(email, role, companyId, userId);

  await emailQueue.add('invite' as JobName, { email: inviteeEmail, token, companyName, role });

  logger.info(`Invitation sent to ${inviteeEmail} for company ${companyName} with role ${inviteeRole}`);

  res.status(200).json({
    success: true,
    message: 'Company invite has been sent',
  });
};

// NOTE: Check invite
export const checkInvite = async (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.query;

  if (!token) {
    throw new BadRequestException('No token provided', ErrorCodes.INVALID_INVITE_RESET_TOKEN);
  }

  const result = await CheckInviteToken(token as string);

  const user = await FindUserByEmail(result.email);

  const userExist = user ? true : false;

  res.status(200).json({
    success: true,
    message: '',
    data: { ...result, userExist },
  });
};

// NOTE: Accept invite
export const acceptInvite = async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body);
  const { email, password, token } = req.body;

  const user = await AcceptInvitedUser({ email, password }, token);

  res.status(200).json({
    success: true,
    message: 'user invite success',
    data: user,
  });
};

// NOTE: Get access
export const getAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  const { refreshTokenId } = req.params;

  if (!refreshTokenId) {
    throw new InvalidTokenException();
  }

  const { token } = await FindRefreshToken(refreshTokenId);

  const decoded = decodeJwt(token);

  if (!decoded || !decoded.id) throw new TokenExpiredException();

  const user = await FindUserById(decoded.id);

  if (!user) throw new BadRequestException('unauthorized', ErrorCodes.USER_NOT_FOUND);

  // Check if user is active and not deleted
  if (!user.isActive) {
    throw new BadRequestException('User account is inactive', ErrorCodes.BAD_REQUEST);
  }

  if (user.isDeleted) {
    throw new BadRequestException('User account has been deleted', ErrorCodes.BAD_REQUEST);
  }

  // Check if password was changed after token was issued
  if (decoded.iat && user?.passwordChangedAt) {
    const passwordChangeTimestamp = new Date(user?.passwordChangedAt).getTime();
    const tokenIssuedTimestamp = decoded?.iat * 1000;

    if (passwordChangeTimestamp > tokenIssuedTimestamp) {
      throw new BadRequestException('Password was changed. Please login again', ErrorCodes.BAD_REQUEST);
    }
  }

  const { accessToken } = generateTokens(user);

  res.status(200).json({
    success: true,
    data: {
      accessToken,
    },
  });
};

// NOTE: Logout - Revoke refresh token
export const logout = async (req: Request, res: Response, next: NextFunction) => {
  const { refreshTokenId } = req.body;
  const userId = (req.user as any)?.id;

  try {
    // If refreshTokenId is provided, revoke that specific token
    if (refreshTokenId) {
      await revokeRefreshToken(refreshTokenId);
    } else if (userId) {
      // If no token provided but user is authenticated, revoke all user tokens
      await revokeAllUserTokens(userId);
    } else {
      throw new BadRequestException('Refresh token ID or authentication required', ErrorCodes.BAD_REQUEST);
    }

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};

// NOTE: Get Logged In User
export const getUser = async (req: Request, res: Response) => {
  const userId = (req.user as any).id;
  const user = await FindUserById(userId);

  if (!user) throw new UserNotFoundException();

  res.status(200).json({
    success: true,
    message: 'user fetched success',
    data: {
      email: user.email,
    },
  });
};
