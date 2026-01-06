'use client';

import { Calendar } from 'lucide-react';
import React from 'react';
import { formatDistanceToNowStrict } from 'date-fns';
import Link from 'next/link';
import { getInitials } from '@/lib/utils';
import type { Application } from '@/types';

interface ApplicationListProps {
  applications: Application[];
}

const getStatusStyles = (status: string) => {
  const statusUpper = status.toUpperCase();
  switch (statusUpper) {
    case 'APPLIED':
      return 'bg-blue-50 text-blue-700';
    case 'SCREENING':
    case 'SHORTLISTED':
      return 'bg-purple-50 text-purple-700';
    case 'INTERVIEW':
      return 'bg-indigo-50 text-indigo-700';
    case 'OFFER':
      return 'bg-green-50 text-green-700';
    case 'HIRED':
      return 'bg-green-100 text-green-800';
    case 'REJECTED':
      return 'bg-red-50 text-red-700';
    case 'WITHDRAWN':
      return 'bg-gray-100 text-gray-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

const formatStatus = (status: string) => {
  return status
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export default function ApplicationList({ applications }: ApplicationListProps) {
  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-lg p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No applications found</h3>
        <p className="text-sm text-gray-500 max-w-md mx-auto">You haven&apos;t applied to any jobs yet. Start browsing jobs to find your next opportunity.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 mb-6">
      {applications.map((app) => {
        const companyName = app.job.company?.name || 'Unknown Company';
        const companyInitials = getInitials({
          name: companyName,
          default: 'C',
        });
        const appliedDate = formatDistanceToNowStrict(new Date(app.createdAt), { addSuffix: true });
        const statusDisplay = app.pipelineStage?.name || formatStatus(app.status);

        return (
          <div key={app.id} className="bg-white rounded-lg p-6 flex items-center justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center text-xl font-semibold bg-blue-100 text-blue-700">{companyInitials}</div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">{app.job.title}</h3>
                <p className="text-gray-600">{companyName}</p>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Applied {appliedDate}</span>
              </div>

              <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusStyles(app.status)}`}>{statusDisplay}</span>

              <Link href={`/jobs/${app.job.slug}`} className="px-6 py-2 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors">
                View Details
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
