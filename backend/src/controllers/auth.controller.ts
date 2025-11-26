import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import {
  FindUserByEmail,
  FindUserById,
  GetVerifyEmailToken,
  GetVerifyPasswordToken,
  LoginUser,
  RegisterUser,
  UpdateUserPassword,
  VerifyUserEmailToken,
  VerifyUserPasswordToken,
} from '../services/auth.service.js';
import config from '../config/config.js';
import {
  FindRefreshToken,
  FindTokenByUser,
  saveRefreshTokenToDB,
} from '../services/refreshToken.service.js';
import logger from '../utils/logger.js';
import {
  sendForgetPasswordEmail,
  sendInvitationEmail,
  sendVerificationEmail,
} from '../services/mail.service.js';
import {
  BadRequestException,
  TokenExpiredException,
  UserNotFoundException,
} from '../exceptions/exceptions.js';
import { decodeJwt } from '../services/index.js';
import { AcceptUser, InviteUser } from '../services/company.service.js';
import type { CompanyRole } from '../generated/prisma/enums.js';
import { ErrorCodes } from '../exceptions/index.js';

interface UserPayload {
  id: string;
  firstName: string;
  lastName: string;
}

const getToken = (payload: UserPayload, minutes: number) => {
  return jwt.sign(payload, config.JWTsecret, {
    expiresIn: `${minutes}m`,
  });
};

const response = (res: Response, statusCode: number = 200, message: string) => {
  return res.status(statusCode).json({ success: true, message });
};

// NOTE: Register Account
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const newUser = await RegisterUser(req.body);

  const accessToken = getToken(
    {
      id: newUser.id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
    },
    10,
  );

  const refreshToken = getToken(
    {
      id: newUser.id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
    },
    7 * 24 * 30,
  );

  await saveRefreshTokenToDB({
    userId: newUser.id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  res.cookie('access', accessToken, {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    maxAge: 5 * 60 * 1000,
  });

  res.cookie('refresh', refreshToken, {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  const verifyToken = await GetVerifyEmailToken(newUser.id);

  logger.info(`verification link has been sent successfully`);

  response(res, 201, 'User registered successfully');

  await sendVerificationEmail(newUser.email, verifyToken);
  console.log('email sent');
};

// NOTE: User login
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = await LoginUser(req.body);
  const accessToken = getToken(
    {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    10,
  );

  const refreshToken = getToken(
    {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    7 * 24 * 30,
  );

  await saveRefreshTokenToDB({
    userId: user.id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  res.cookie('access', accessToken, {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    maxAge: 5 * 60 * 1000,
  });

  res.cookie('refresh', refreshToken, {
    // httpOnly: true,
    // secure: config.nodeEnv === 'production',
    // sameSite: 'strict',
    // maxAge: 5 * 60 * 1000,
    // path: '/',

    httpOnly: true,
    secure: config.nodeEnv === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  response(res, 201, 'User login successful');
};

// NOTE: Verify Account
export const verifyAccount = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const verifyToken = req.query.token as string;
  await VerifyUserEmailToken(verifyToken);
  response(res, 200, 'Account successfully verified');
};

// NOTE: Re Verify Account
export const reVerifyAccount = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = await FindUserById(req.user.id);
  if (user.isEmailVerified)
    throw new BadRequestException(
      'User already verified',
      ErrorCodes.USER_ALREADY_VERIFIED,
    );
  const verifyToken = await GetVerifyEmailToken(user.id);
  logger.info(`verification link has been sent successfully`);
  response(res, 200, 'Verification link sent');

  await sendVerificationEmail(req.user.email, verifyToken);
  console.log('email sent');
};

// NOTE: Forgot Password
export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = await FindUserByEmail(req.body.email);
  const verifyToken = await GetVerifyPasswordToken(user.id);
  logger.info(`verification link has been sent successfully`);

  console.log(`+++++++++++++++++${user.email}`);
  res.status(200).json({ success: true, message: 'password reset link sent' });

  console.log(`+++++++++++++++++${user.email}`);
  await sendForgetPasswordEmail(user.email, verifyToken);
};

// NOTE: Reset Password
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const verifyToken = req.query.reset as string;
  const user = await VerifyUserPasswordToken(verifyToken);
  await UpdateUserPassword(req.body, user.id);

  res
    .status(200)
    .json({ success: true, message: 'password successfully changed' });
};

// NOTE: Invite user
export const inviteUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const email = req.body.email;
  const role = req.body.role as CompanyRole;
  const { id: companyId } = req.params;

  if (!email)
    throw new BadRequestException(
      'An email must be provided',
      ErrorCodes.MISSING_REQUIRED_FIELD,
    );
  if (!role)
    throw new BadRequestException(
      'A role must be provided',
      ErrorCodes.MISSING_REQUIRED_FIELD,
    );
  if (!companyId)
    throw new BadRequestException(
      'A company ID must be provided',
      ErrorCodes.JOB_ALREADY_CLOSED,
    );
  const {
    email: inviteeEmail,
    token,
    role: inviteeRole,
    companyName,
  } = await InviteUser(email, role, companyId, req.user.id);

  logger.info(
    `Invitation sent to ${inviteeEmail} for company ${companyName} with role ${inviteeRole}`,
  );

  res.status(200).json({
    success: true,
    message: 'Company invite has been sent',
  });

  await sendInvitationEmail(inviteeEmail, token, companyName, role);
};

// NOTE: Accept invite
export const acceptInvite = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { token } = req.query;
  const result = await AcceptUser({ ...req.body, token });

  res.status(200).json({
    success: true,
    message: 'Invitation accepted successfully',
    data: result,
  });
};

// NOTE: Get access
export const getAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const refreshTokenFromCookie = req.cookies.refreshToken;
  console.log(refreshTokenFromCookie);

  await FindRefreshToken(refreshTokenFromCookie);

  const decoded = decodeJwt(refreshTokenFromCookie);
  if (!decoded || !decoded.id) throw new TokenExpiredException();
  const user = await FindUserById(decoded.id);

  const accessToken = getToken(
    {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    10,
  );

  res.cookie('access', accessToken, {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    maxAge: 5 * 60 * 1000,
  });

  logger.info('Access token sent successfully');
  response(res, 200, 'token sent successfully');
};
