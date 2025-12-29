import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';
import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { fetchWithRetry } from '@/lib/fetchWithRetry';
import Link from 'next/link';

interface ApplicationData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  job: {
    id: string;
    title: string;
    slug: string;
  };
  createdAt: string;
}

interface ApplicationResponse {
  success: boolean;
  data: {
    applications: ApplicationData[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export default async function LatestApplication() {
  const session = await getServerSession(authOptions);

  let latestApplications: ApplicationData[] = [];

  if (session?.user?.companyId) {
    try {
      const response = await fetchWithRetry({
        url: `application/${session.user.companyId}/fetch?page=1&limit=5`,
        options: {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        },
        refreshTokenHash: session.user.refreshTokenHash,
      });

      if (response.ok) {
        const data = (await response.json()) as ApplicationResponse;
        latestApplications = data.data?.applications || [];
      }
    } catch (error) {
      console.error('Error fetching latest applications:', error);
    }
  }

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Latest Applications</h3>

      {latestApplications.length > 0 ? (
        <div className="space-y-4">
          {latestApplications.map((app) => {
            const fullName = `${app.firstName || ''} ${app.lastName || ''}`.trim() || app.email;
            const initials = getInitials({
              firstName: app.firstName,
              lastName: app.lastName,
              email: app.email,
            });

            return (
              <Link key={app.id} href={`/admin/applications/${app.id}`} className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors -mx-2">
                <Avatar>
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{fullName}</p>
                  <p className="text-sm text-gray-500">Applied for {app.job?.title || 'Unknown Position'}</p>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-gray-500 text-center py-4">No applications yet</p>
      )}
    </div>
  );
}
