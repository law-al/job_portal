/* eslint-disable @typescript-eslint/no-explicit-any */

import axios, { AxiosError } from 'axios';

export const api = axios.create({
  baseURL: `http://localhost:5000/api/v1`,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    console.log(error);
    const originalRequest: any = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await api.get('/auth/access-token', { withCredentials: true });

        return api(originalRequest);
      } catch (err) {
        console.error('Token refresh failed:', err);
        // window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  },
);

export default api;
