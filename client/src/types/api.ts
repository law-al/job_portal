/**
 * API response types
 */

import { Pagination } from './common';

// Generic API response
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// Dashboard stats response
export interface DashboardStatsResponse {
  success: boolean;
  message: string;
  data: {
    totalUsers: {
      value: string;
      change: string;
      positive: boolean;
    };
    activeJobs: {
      value: string;
      change: string;
      positive: boolean;
    };
    newApplications: {
      value: string;
      change: string;
      positive: boolean;
    };
  };
}

// Document response
export interface Document {
  id: string;
  key: string;
  url: string;
  originalName: string;
  mimetype: string;
  size: number;
  createdAt: string;
}

export interface DocumentResponse {
  success: boolean;
  message: string;
  data?: Document[];
}

// Refresh token response
export interface RefreshTokenResponse {
  success: boolean;
  accessToken: string;
  refreshTokenHash: string;
  accessTokenExpiresAt: number;
}

// Fetch options
export interface FetchOptions extends RequestInit {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: BodyInit | null;
  credentials?: RequestCredentials;
  headers?: HeadersInit;
}
