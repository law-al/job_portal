import { Router } from 'express';
import asyncHandler from '../utils/catchAsync.js';
import { createNote, getNotesByApplication, getNoteById, updateNote, deleteNote } from '../controllers/note.controller.js';
import { protect } from '../middlewares/protect.js';
import { verifyCompanyMember } from '../middlewares/verifyCompanyMember.js';

const noteRoute: Router = Router();

// All note routes require authentication and company membership
noteRoute.post('/:id/application/:applicationId', protect, verifyCompanyMember, asyncHandler(createNote));
noteRoute.get('/:id/application/:applicationId', protect, verifyCompanyMember, asyncHandler(getNotesByApplication));
noteRoute.get('/:id/:noteId', protect, verifyCompanyMember, asyncHandler(getNoteById));
noteRoute.patch('/:id/:noteId', protect, verifyCompanyMember, asyncHandler(updateNote));
noteRoute.delete('/:id/:noteId', protect, verifyCompanyMember, asyncHandler(deleteNote));

export default noteRoute;
