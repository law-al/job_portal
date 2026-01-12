/**
 * Application configuration
 * Centralized configuration for API endpoints
 */

// Get backend URL from environment variable
// In Docker: use container name (job-portal-backend)
// In local dev: use localhost
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

// API base URL (includes /api/v1)
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || `${BACKEND_URL}/api/v1`;
