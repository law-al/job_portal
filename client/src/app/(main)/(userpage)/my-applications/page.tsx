import React from 'react';
import { MyApplicationsProvider } from './provider';
import MyApplications from './components/Myapplications';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { fetchWithRetry } from '@/lib/fetchWithRetry';

interface SearchParams {
  tab?: string;
  sortBy?: string;
  search?: string;
  page?: string;
  limit?: string;
  status?: string;
  jobId?: string;
}

interface ApplicationResponse {
  success: boolean;
  data: {
    applications: Array<{
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      status: string;
      createdAt: string;
      updatedAt: string;
      job: {
        id: string;
        title: string;
        slug: string;
        status: string;
        company: {
          id: string;
          name: string;
        };
      };
      pipelineStage: {
        id: string;
        name: string;
        order: number;
      } | null;
    }>;
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export default async function MyApplicationsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const session = await getServerSession(authOptions);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session?.user as any)?.id;

  if (!session || !userId) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-red-600">Please log in to view your applications.</p>
        </div>
      </div>
    );
  }

  let applications: ApplicationResponse['data']['applications'] = [];
  let pagination: ApplicationResponse['data']['pagination'] = {
    page: Number(params.page) || 1,
    limit: Number(params.limit) || 20,
    total: 0,
    totalPages: 0,
  };

  // Build query string
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.set('page', params.page);
  if (params.limit) queryParams.set('limit', params.limit);
  if (params.status) queryParams.set('status', params.status);
  if (params.jobId) queryParams.set('jobId', params.jobId);
  if (params.search) queryParams.set('search', params.search);

  const queryString = queryParams.toString();

  try {
    const response = await fetchWithRetry({
      url: `application/user/${userId}/fetch${queryString ? `?${queryString}` : ''}`,
      options: {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          Authorization: `Bearer ${((session?.user as any)?.accessToken as string) ?? ''}`,
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      refreshTokenHash: (session.user as any)?.refreshTokenHash,
    });

    if (response.ok) {
      const data = (await response.json()) as ApplicationResponse;
      applications = data.data?.applications || [];
      pagination = data.data?.pagination || pagination;
    }
  } catch (error) {
    console.error('Error fetching user applications:', error);
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        <MyApplicationsProvider>
          <MyApplications params={params} applications={applications} pagination={pagination} />
        </MyApplicationsProvider>
      </div>
    </div>
  );
}
