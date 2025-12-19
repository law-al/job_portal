import { Router } from 'express';
import upload from '../middlewares/multer.js';
import asyncHandler from '../utils/catchAsync.js';
import { sendApplication } from '../controllers/application.controller.js';
import { protect } from '../middlewares/protect.js';

const applicationRoute: Router = Router();

applicationRoute.post('/send', protect, upload.none(), asyncHandler(sendApplication));

export default applicationRoute;
