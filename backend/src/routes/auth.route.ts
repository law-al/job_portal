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
} from '../controllers/auth.controller.js';
import asyncHandler from '../utils/catchAsync.js';
import { protect } from '../middlewares/protect.js';
import { checkCompanyRole, checkUserRole } from '../middlewares/checkRole.js';

const authRoute: Router = Router();

authRoute.post('/register', asyncHandler(register));
authRoute.post('/login', asyncHandler(login));
authRoute.post(
  '/invite/:id',
  protect,
  checkCompanyRole(['COMPANY_ADMIN']),
  asyncHandler(inviteUser),
);
authRoute.post('/accept', asyncHandler(acceptInvite));
authRoute.get('/verify', asyncHandler(verifyAccount));
authRoute.get('/re-verify', protect, asyncHandler(reVerifyAccount));
authRoute.post('/forgot-password', asyncHandler(forgotPassword));
authRoute.post('/reset-password', asyncHandler(resetPassword));
authRoute.get('/access-token', asyncHandler(getAccessToken));

export default authRoute;
