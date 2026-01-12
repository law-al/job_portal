/* eslint-disable @typescript-eslint/no-explicit-any */

import { API_BASE_URL } from './config';

interface FetchOptions {
  url: string | URL | Request;
  options?: RequestInit | undefined;
  refreshTokenHash?: string;
}

// call backend to refresh token
const refreshFn = async (refreshTokenHash?: string) => {
  if (!refreshTokenHash) {
    throw new Error('NO_REFRESH_TOKEN');
  }

  const res = await fetch(`${API_BASE_URL}/auth/refresh/${refreshTokenHash}`, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  if (!res.ok) {
    const errorRes = await res.json();

    throw new Error(errorRes?.message || 'unauthorized');
  }

  const result = await res.json();
  return result?.data?.accessToken ?? null;
};

export async function fetchWithRetry({ url, options, refreshTokenHash }: FetchOptions) {
  try {
    let res = await fetch(`${API_BASE_URL}/${url}`, options);

    if (res.status === 401) {
      const newAccessToken = await refreshFn(refreshTokenHash);

      res = await fetch(`${API_BASE_URL}/${url}`, {
        ...options,
        headers: {
          ...options?.headers,
          Authorization: `Bearer ${newAccessToken}`,
        },
      });

      return res;
    }

    return res;
  } catch (err: any) {
    throw err;
  }
}
