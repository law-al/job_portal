import { Router } from 'express';
import upload from '../middlewares/multer.js';
import asyncHandler from '../utils/catchAsync.js';
import { saveResume, saveSupportingDocument, deleteDocument, getUserResumes } from '../controllers/documents.controller.js';
import { protect } from '../middlewares/protect.js';

const documentRoute: Router = Router();

documentRoute.get('/resumes', protect, asyncHandler(getUserResumes));
documentRoute.post('/resume', protect, upload.single('resume'), asyncHandler(saveResume));
documentRoute.post('/supporting-document', protect, upload.single('document'), asyncHandler(saveSupportingDocument));
documentRoute.delete('/:id', protect, asyncHandler(deleteDocument));

export default documentRoute;
