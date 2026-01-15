import { Router } from 'express';
import { protect } from '../middlewares/protect.js';
import asyncHandler from '../utils/catchAsync.js';
import { getProfile, updateProfile, updateProfileSection, checkProfileCompletion, deleteProfile, updateProfileImage } from '../controllers/profile.controller.js';
import upload from '../middlewares/multer.js';
import redisCacheMiddleware from '../middlewares/redis.middleware.js';
import { apiRateLimiter, uploadRateLimiter } from '../middlewares/ratelimit.middleware.js';

const profileRoute: Router = Router();

// All routes require authentication
profileRoute.use(protect);

// Get user profile
profileRoute.get('/', apiRateLimiter, redisCacheMiddleware({ EX: 300 }), asyncHandler(getProfile)); // 5 minutes TTL

// Check profile completion status
profileRoute.get('/completion', apiRateLimiter, redisCacheMiddleware({ EX: 300 }), asyncHandler(checkProfileCompletion)); // 5 minutes TTL

// Create or update full profile
profileRoute.put('/', apiRateLimiter, asyncHandler(updateProfile));

// Update specific profile section
profileRoute.patch('/section/:section', apiRateLimiter, asyncHandler(updateProfileSection));

// Update profile image (rate limited for uploads)
profileRoute.post('/image', uploadRateLimiter, upload.single('image'), asyncHandler(updateProfileImage));

// Delete profile
profileRoute.delete('/', asyncHandler(deleteProfile));

export default profileRoute;
