'use client';

import { Button } from '@/components/ui/button';
import { Bookmark } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';

interface JobData {
  id: string;
  slug: string;
  title: string;
  companyId: string;
  company?: { id: string; name: string; logo?: string | null } | null;
  location: string;
  salary_range?: string | null;
  jobType?: string | null;
  experienceLevel?: string | null;
  isRemote?: boolean | null;
  deadline?: string | null;
}

export default function JobHeader({ job }: { job: JobData }) {
  const [isSaved, setIsSaved] = useState(false);

  const formatJobType = (jobType?: string) => {
    if (!jobType) return undefined;
    return jobType
      .split('_')
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  };

  const formatExperienceLevel = (experienceLevel?: string) => {
    if (!experienceLevel) return undefined;
    return experienceLevel.charAt(0) + experienceLevel.slice(1).toLowerCase();
  };

  const formatDate = (date?: string) => {
    if (!date) return undefined;
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className='bg-white rounded-lg p-8 shadow-sm mb-6'>
      <div className='flex items-start justify-between mb-4'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>{job.title}</h1>
          <p className='text-gray-600'>
            {job.company?.name} • {job.location} (
            {job.isRemote ? 'Remote' : 'In-Office'})
          </p>
        </div>
        <button
          onClick={() => setIsSaved(!isSaved)}
          className='w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center hover:bg-teal-700 transition-colors'
        >
          <Bookmark
            className={`w-5 h-5 text-white ${isSaved ? 'fill-white' : ''}`}
          />
        </button>
      </div>

      <div className='flex items-center gap-4 mb-6'>
        <span className='px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full'>
          {formatJobType(job.jobType ?? undefined)}
        </span>
        <span className='px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full'>
          {formatExperienceLevel(job.experienceLevel ?? undefined)}
        </span>
        <span className='text-sm text-gray-600'>
          Posted {formatDate(job.deadline ?? undefined)}
        </span>
      </div>

      <div className='flex gap-3'>
        <Button
          variant='default'
          className='py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors'
          size='lg'
          asChild
        >
          <Link href={`/jobs/${job.id}/apply`}>Apply Now</Link>
        </Button>
        <Button variant='outline' size='lg' asChild>
          <Link href={`/jobs/${job.id}/save`}>Save Job</Link>
        </Button>
      </div>
    </div>
  );
}
