import React from 'react';
import Card from '../../../../../components/Card';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { fetchWithRetry } from '@/lib/fetchWithRetry';

interface Stat {
  label: string;
  value: string;
  change: string;
  positive: boolean;
  neutral: boolean;
}

interface DashboardStatsResponse {
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

export default async function CardWrapper() {
  const session = await getServerSession(authOptions);

  // Default stats for loading/error state
  const defaultStats: Stat[] = [
    {
      label: 'Total Users',
      value: '0',
      change: 'Loading...',
      positive: true,
      neutral: true,
    },
    {
      label: 'Active Jobs',
      value: '0',
      change: 'Loading...',
      positive: true,
      neutral: true,
    },
    {
      label: 'New Applications',
      value: '0',
      change: 'Loading...',
      positive: true,
      neutral: true,
    },
  ];

  let stats: Stat[] = defaultStats;

  if (session?.user?.companyId) {
    try {
      const response = await fetchWithRetry({
        url: `stats/${session.user.companyId}`,
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
        const data = (await response.json()) as DashboardStatsResponse;
        if (data.data) {
          stats = [
            {
              label: 'Total Users',
              value: data.data.totalUsers.value,
              change: data.data.totalUsers.change,
              positive: data.data.totalUsers.positive,
              neutral: false,
            },
            {
              label: 'Active Jobs',
              value: data.data.activeJobs.value,
              change: data.data.activeJobs.change,
              positive: data.data.activeJobs.positive,
              neutral: false,
            },
            {
              label: 'New Applications',
              value: data.data.newApplications.value,
              change: data.data.newApplications.change,
              positive: data.data.newApplications.positive,
              neutral: false,
            },
          ];
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat) => (
        <Card key={stat.label} stat={stat} />
      ))}
    </div>
  );
}
