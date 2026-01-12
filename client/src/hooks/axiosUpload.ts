/* eslint-disable @typescript-eslint/no-explicit-any */

import axios, { AxiosError } from 'axios';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { refreshAccessToken } from '@/lib/refreshToken';
import { API_BASE_URL } from '@/lib/config';

export function useAxiosFetchFiles({ session }: { session: any }) {
  const [data, setData] = useState();
  const [progress, setProgress] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  console.log(session?.user);

  const handleFileUploadToServer = async (url: string, file: File) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('resume', file);

      const accessToken = (session?.user as any)?.accessToken;

      const makeRequest = async (token: string) => {
        console.log('Making request......');
        const response = await axios.post(url, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
            setProgress(progress);
          },
          maxRedirects: 0,
        });

        console.log(response);
        return response;
      };

      let response;
      try {
        response = await makeRequest(accessToken);
      } catch (error) {
        // If 401, try to refresh token and retry
        if ((error as AxiosError)?.response?.status === 401) {
          try {
            const newAccessToken = await refreshAccessToken((session?.user as any)?.refreshTokenHash);
            if (newAccessToken) {
              response = await makeRequest(newAccessToken);
            } else {
              throw new Error('Failed to refresh token');
            }
          } catch (refreshError) {
            toast.error('Session expired. Please login again.');
            throw refreshError;
          }
        } else {
          throw error;
        }
      }

      setLoading(false);
      setData(response.data.data);
      return response.data;
    } catch (error: any) {
      setLoading(false);
      setProgress(0);
      const errorMessage = error?.response?.data?.message || 'Failed to upload file';
      toast.error(errorMessage);
      throw error;
    }
  };

  return { data, progress, loading, handleFileUploadToServer };
}

export function useAxiosFileUpload({ session }: { session: any }) {
  const [data, setData] = useState();
  const [progress, setProgress] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  console.log(session?.user);

  const handleFileUploadToServer = async (url: string, file: File) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('resume', file);

      const accessToken = (session?.user as any)?.accessToken;

      const makeRequest = async (token: string) => {
        console.log('Making request......');
        const response = await axios.post(url, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
            setProgress(progress);
          },
          maxRedirects: 0,
        });

        console.log(response);
        return response;
      };

      let response;
      try {
        response = await makeRequest(accessToken);
      } catch (error) {
        // If 401, try to refresh token and retry
        if ((error as AxiosError)?.response?.status === 401) {
          try {
            const newAccessToken = await refreshAccessToken((session?.user as any)?.refreshTokenHash);
            if (newAccessToken) {
              response = await makeRequest(newAccessToken);
            } else {
              throw new Error('Failed to refresh token');
            }
          } catch (refreshError) {
            toast.error('Session expired. Please login again.');
            throw refreshError;
          }
        } else {
          throw error;
        }
      }

      setLoading(false);
      setData(response.data.data);
      return response.data;
    } catch (error: any) {
      setLoading(false);
      setProgress(0);
      const errorMessage = error?.response?.data?.message || 'Failed to upload file';
      toast.error(errorMessage);
      throw error;
    }
  };

  return { data, progress, loading, handleFileUploadToServer };
}

export function useAxiosFileDelete({ session }: { session: any }) {
  const [deleted, setDeleted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileDeleteFromServer = async (id: string) => {
    try {
      setLoading(true);

      const accessToken = (session?.user as any)?.accessToken;

      const makeRequest = async (token: string) => {
        console.log('Making delete request......');
        const response = await axios.delete(`${API_BASE_URL}/document/${id}`, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(response);
        return response;
      };

      let response;
      try {
        response = await makeRequest(accessToken);
      } catch (error) {
        // If 401, try to refresh token and retry
        if ((error as AxiosError)?.response?.status === 401) {
          try {
            const newAccessToken = await refreshAccessToken((session?.user as any)?.refreshTokenHash);
            if (newAccessToken) {
              // Retry with new token
              response = await makeRequest(newAccessToken);
            } else {
              throw new Error('Failed to refresh token');
            }
          } catch (refreshError) {
            toast.error('Session expired. Please login again.');
            throw refreshError;
          }
        } else {
          throw error;
        }
      }

      setLoading(false);
      setDeleted(true);
    } catch (error: any) {
      console.log(error);
      const errorMessage = error?.response?.data?.message || 'Failed to delete file';
      toast.error(errorMessage);
      setDeleted(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { deleted, loading, handleFileDeleteFromServer };
}
