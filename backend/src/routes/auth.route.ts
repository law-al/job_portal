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

const authRoute: Router = Router();

const GOOGLE_FAILURE_URL = 'http://localhost:3000/auth/fail';

// register
authRoute.post('/register', asyncHandler(register));
authRoute.post('/register-company', upload.single('logo'), asyncHandler(registerUserCompany));
// login
authRoute.post('/login', asyncHandler(login));
authRoute.post('/invite/:companyId', protect, checkCompanyRole(['ADMIN']), asyncHandler(inviteUser));
authRoute.get('/invite/check', asyncHandler(checkInvite));
authRoute.post('/accept', asyncHandler(acceptInvite));
authRoute.get('/verify', asyncHandler(verifyAccount));
authRoute.get('/re-verify', protect, asyncHandler(reVerifyAccount));
authRoute.post('/forgot-password', asyncHandler(forgotPassword));
authRoute.post('/reset-password', asyncHandler(resetPassword));
authRoute.get('/resend-reset-password', asyncHandler(resendPasswordResetLink));
authRoute.get('/refresh/:refreshTokenId', asyncHandler(getAccessToken));
authRoute.post('/logout', protect, asyncHandler(logout));
authRoute.post('/oauth', asyncHandler(oAuth));
authRoute.get('/user', protect, asyncHandler(getUser));

export default authRoute;
