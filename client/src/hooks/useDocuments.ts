/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { fetchWithRetry } from '@/lib/fetchWithRetry';
import api from '@/lib/api';
import { refreshAccessToken } from '@/lib/refreshToken';
import type { AxiosError } from 'axios';

interface Document {
  id: string;
  key: string;
  url: string;
  originalName: string;
  mimetype: string;
  size: number;
  createdAt: string;
}

interface DocumentResponse {
  success: boolean;
  message: string;
  data: Document[];
}

/**
 * Hook to fetch user's uploaded resumes/documents
 * Better name: useDocumentFetch or useResumeFetch
 */
export function useDocumentFetch({ session, documentType }: { session: any; documentType: string }) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = useCallback(async () => {
    if (!session?.user) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const accessToken = (session.user as any)?.accessToken;
      const refreshTokenHash = (session.user as any)?.refreshTokenHash;

      const makeRequest = async (token: string) => {
        const response = await fetchWithRetry({
          url: `document/${documentType}`,
          options: {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            credentials: 'include',
          },
          refreshTokenHash,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Failed to fetch documents' }));
          throw new Error(errorData.message || 'Failed to fetch documents');
        }

        const result: DocumentResponse = await response.json();
        return result.data;
      };

      let data;
      try {
        data = await makeRequest(accessToken);
      } catch (err: any) {
        // If 401, try to refresh token and retry
        if (err?.message?.includes('401') || (err as Response)?.status === 401) {
          try {
            const newAccessToken = await refreshAccessToken(refreshTokenHash);
            if (newAccessToken) {
              data = await makeRequest(newAccessToken);
            } else {
              throw new Error('Failed to refresh token');
            }
          } catch (refreshError) {
            toast.error('Session expired. Please login again.');
            throw refreshError;
          }
        } else {
          throw err;
        }
      }

      setDocuments(data || []);
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to fetch documents';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [session, documentType]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return {
    documents,
    loading,
    error,
    refetch: fetchDocuments,
  };
}

/**
 * Hook to upload a document/resume
 * Better name: useDocumentUpload (replaces useAxiosFileUpload)
 */
export function useDocumentUpload({ session }: { session: any }) {
  const [data, setData] = useState<any>(null);
  const [progress, setProgress] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const uploadDocument = useCallback(
    async (file: File, documentType: 'resume' | 'cover_letter' | 'supporting_document' = 'resume') => {
      if (!session?.user) {
        toast.error('Please login to upload documents');
        return;
      }

      try {
        setLoading(true);
        setProgress(0);

        const formData = new FormData();
        formData.append(documentType === 'resume' ? 'resume' : 'document', file);

        const accessToken = (session.user as any)?.accessToken;
        const refreshTokenHash = (session.user as any)?.refreshTokenHash;

        const makeRequest = async (token: string) => {
          // Use different endpoints based on document type
          const endpoint = documentType === 'resume' ? 'document/resume' : 'document/supporting-document';

          const response = await api.post(endpoint, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total) {
                const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setProgress(progress);
              }
            },
          });

          return response;
        };

        let response;
        try {
          response = await makeRequest(accessToken);
        } catch (error) {
          // If 401, try to refresh token and retry
          if ((error as AxiosError)?.response?.status === 401) {
            try {
              const newAccessToken = await refreshAccessToken(refreshTokenHash);
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

        console.log('response data', response.data.data);
        setData(response.data.data);
        return response.data.data;
      } catch (err: any) {
        const errorMessage = err?.response?.data?.message || 'Failed to upload document';
        toast.error(errorMessage);
        throw err;
      } finally {
        setLoading(false);
        setProgress(0);
      }
    },
    [session],
  );

  return {
    data,
    progress,
    loading,
    uploadDocument,
  };
}

/**
 * Hook to delete a document
 * Better name: useDocumentDelete (replaces useAxiosFileDelete)
 */
export function useDocumentDelete({ session }: { session: any }) {
  const [loading, setLoading] = useState<boolean>(false);
  const [deleted, setDeleted] = useState<boolean>(false);

  const deleteDocument = useCallback(
    async (documentId: string) => {
      if (!session?.user) {
        toast.error('Please login to delete documents');
        return;
      }

      try {
        setLoading(true);

        const accessToken = (session.user as any)?.accessToken;
        const refreshTokenHash = (session.user as any)?.refreshTokenHash;

        const makeRequest = async (token: string) => {
          const response = await api.delete(`document/${documentId}`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });

          return response.data;
        };

        try {
          await makeRequest(accessToken);
        } catch (error) {
          // If 401, try to refresh token and retry
          if ((error as AxiosError)?.response?.status === 401) {
            try {
              const newAccessToken = await refreshAccessToken(refreshTokenHash);
              if (newAccessToken) {
                await makeRequest(newAccessToken);
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

        setDeleted(true);
        toast.success('Document deleted successfully');
        return true;
      } catch (err: any) {
        const errorMessage = err?.response?.data?.message || 'Failed to delete document';
        setDeleted(false);
        toast.error(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [session],
  );

  return {
    deleted,
    loading,
    deleteDocument,
  };
}
