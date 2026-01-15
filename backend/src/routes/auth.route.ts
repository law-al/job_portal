import { Router } from 'express';
import {
  login,
  register,
  forgotPassword,
  reVerifyAccount,
  resetPassword,
  verifyAccount,
  getAccessToken,
  acceptInvite,
  inviteUser,
  resendPasswordResetLink,
  getUser,
  registerUserCompany,
  oAuth,
  checkInvite,
  logout,
} from '../controllers/auth.controller.js';
import asyncHandler from '../utils/catchAsync.js';
import { protect } from '../middlewares/protect.js';
import { checkCompanyRole, checkUserRole } from '../middlewares/checkRole.js';
import passport from 'passport';
import upload from '../middlewares/multer.js';
import { verifyCompanyMember } from '../middlewares/verifyCompanyMember.js';
import { authRateLimiter, strictAuthRateLimiter } from '../middlewares/ratelimit.middleware.js';

const authRoute: Router = Router();

const GOOGLE_FAILURE_URL = 'http://localhost:5000/auth/fail';

// register - rate limited to prevent spam
authRoute.post('/register', authRateLimiter, asyncHandler(register));
authRoute.post('/register-company', authRateLimiter, upload.single('logo'), asyncHandler(registerUserCompany));
// login - rate limited to prevent brute force
authRoute.post('/login', authRateLimiter, asyncHandler(login));
authRoute.post('/invite/:id', protect, verifyCompanyMember, checkCompanyRole(['ADMIN']), asyncHandler(inviteUser));
authRoute.get('/invite/check', asyncHandler(checkInvite));
authRoute.post('/accept', asyncHandler(acceptInvite));
authRoute.get('/verify', asyncHandler(verifyAccount));
authRoute.get('/re-verify', protect, asyncHandler(reVerifyAccount));
// Password reset - stricter rate limit
authRoute.post('/forgot-password', strictAuthRateLimiter, asyncHandler(forgotPassword));
authRoute.post('/reset-password', strictAuthRateLimiter, asyncHandler(resetPassword));
authRoute.get('/resend-reset-password', strictAuthRateLimiter, asyncHandler(resendPasswordResetLink));
authRoute.get('/refresh/:refreshTokenId', asyncHandler(getAccessToken));
authRoute.post('/logout', protect, asyncHandler(logout));
authRoute.post('/oauth', authRateLimiter, asyncHandler(oAuth));
authRoute.get('/user', protect, asyncHandler(getUser));

export default authRoute;
