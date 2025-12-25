import React from 'react';
import ActivityTimeLine from './ActivityTimeLine';
import { fetchWithRetry } from '@/lib/fetchWithRetry';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';

interface ActivityResponse {
  success: boolean;
  data: Array<{
    id: string;
    type: string;
    message: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    metadata: Record<string, any> | null;
    createdAt: string;
    actor: {
      id: string;
      email: string;
    } | null;
  }>;
}

export default async function ActivityTimeLineWrapper({ applicationId }: { applicationId: string }) {
  const session = await getServerSession(authOptions);
  let activities: ActivityResponse['data'] = [];

  if (session?.user?.companyId) {
    try {
      const response = await fetchWithRetry({
        url: `activity/${session.user.companyId}/application/${applicationId}`,
        options: {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${(session.user as { accessToken?: string }).accessToken ?? ''}`,
          },
        },
        refreshTokenHash: (session.user as { refreshTokenHash?: string }).refreshTokenHash,
      });

      if (response.ok) {
        const data = (await response.json()) as ActivityResponse;
        activities = data.data || [];
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
      // Silently fail - activities will be empty array
    }
  }

  return <ActivityTimeLine activities={activities} />;
}
