import { Router } from 'express';
import { protect } from '../middlewares/protect.js';
import asyncHandler from '../utils/catchAsync.js';
import { getProfile, updateProfile, updateProfileSection, checkProfileCompletion, deleteProfile } from '../controllers/profile.controller.js';

const profileRoute: Router = Router();

// All routes require authentication
profileRoute.use(protect);

// Get user profile
profileRoute.get('/', asyncHandler(getProfile));

// Check profile completion status
profileRoute.get('/completion', asyncHandler(checkProfileCompletion));

// Create or update full profile
profileRoute.put('/', asyncHandler(updateProfile));

// Update specific profile section
profileRoute.patch('/section/:section', asyncHandler(updateProfileSection));

// Delete profile
profileRoute.delete('/', asyncHandler(deleteProfile));

export default profileRoute;
