/* eslint-disable @typescript-eslint/no-explicit-any */

import { API_BASE_URL } from './config';

interface RefreshTokenResponse {
  success: boolean;
  data: {
    accessToken: string;
  };
  message?: string;
}

/**
 * Refreshes the access token using the refresh token hash from the session
 * @param refreshTokenHash - Refresh token hash.
 * @returns The new access token or null if refresh fails
 */
export async function refreshAccessToken(refreshTokenHash: string): Promise<string | null> {
  try {
    const tokenHash = refreshTokenHash;

    console.log(refreshTokenHash);

    if (!tokenHash) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${API_BASE_URL}/auth/refresh/${tokenHash}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Token refresh failed' }));
      throw new Error(errorData.message || 'Token refresh failed');
    }

    const result: RefreshTokenResponse = await response.json();

    if (!result.data?.accessToken) {
      throw new Error('Invalid response from refresh endpoint');
    }
    return result.data.accessToken;
  } catch (error: any) {
    console.error('Token refresh failed:', error);
    throw error;
  }
}
