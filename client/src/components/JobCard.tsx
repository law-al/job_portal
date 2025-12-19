import React from 'react';
import Link from 'next/link';
import { MapPin, Briefcase, DollarSign, Clock, User } from 'lucide-react';

export interface JobCardProps {
  id: string;
  slug: string;
  title: string;
  company?: string;
  location: string;
  salary_range?: string | null;
  jobType?: string;
  experienceLevel?: string;
  isRemote?: boolean;
  status?: string;
  isClosed?: boolean;
  deadline?: string | null;
  createdAt?: string;
  buttonText?: string;
  buttonHref?: string;
  onButtonClick?: () => void;
  className?: string;
}

const formatJobType = (jobType?: string): string => {
  if (!jobType) return '';
  return jobType
    .split('_')
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
};

const formatExperienceLevel = (level?: string): string => {
  if (!level) return '';
  return level.charAt(0) + level.slice(1).toLowerCase();
};

const formatDate = (dateString?: string | null): string => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export default function JobCard({
  id,
  slug,
  title,
  company,
  location,
  salary_range,
  jobType,
  experienceLevel,
  isRemote,
  status,
  isClosed,
  deadline,
  createdAt,
  buttonText = 'View Details',
  buttonHref,
  onButtonClick,
  className = '',
}: JobCardProps) {
  const isJobClosed = isClosed || status === 'CLOSE' || status === 'CLOSED';

  // Default href to job detail page if not provided
  const href = buttonHref || `/jobs/${slug || id}`;

  return (
    <div
      className={`bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 ${className}`}
    >
      {/* Header */}
      <div className='mb-4'>
        <h3 className='font-semibold text-lg text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors'>
          {title}
        </h3>
        {company && (
          <p className='text-gray-600 text-sm font-medium'>{company}</p>
        )}
      </div>

      {/* Job Details */}
      <div className='space-y-2 mb-4'>
        {/* Location */}
        <div className='flex items-center gap-2 text-gray-600 text-sm'>
          <MapPin className='w-4 h-4 text-gray-400 shrink-0' />
          <span className='line-clamp-1'>
            {location}
            {isRemote && (
              <span className='ml-1 text-blue-600 font-medium'>(Remote)</span>
            )}
          </span>
        </div>

        {/* Salary */}
        {salary_range && (
          <div className='flex items-center gap-2 text-gray-600 text-sm'>
            <DollarSign className='w-4 h-4 text-gray-400 shrink-0' />
            <span>{salary_range}</span>
          </div>
        )}

        {/* Job Type */}
        {jobType && (
          <div className='flex items-center gap-2 text-gray-600 text-sm'>
            <Briefcase className='w-4 h-4 text-gray-400 shrink-0' />
            <span>{formatJobType(jobType)}</span>
          </div>
        )}

        {/* Experience Level */}
        {experienceLevel && (
          <div className='flex items-center gap-2 text-gray-600 text-sm'>
            <User className='w-4 h-4 text-gray-400 shrink-0' />
            <span>{formatExperienceLevel(experienceLevel)}</span>
          </div>
        )}

        {/* Posted Date */}
        {createdAt && (
          <div className='flex items-center gap-2 text-gray-500 text-xs'>
            <Clock className='w-3 h-3 text-gray-400 shrink-0' />
            <span>Posted {formatDate(createdAt)}</span>
          </div>
        )}
      </div>

      {/* Tags */}
      <div className='flex flex-wrap gap-2 mb-4'>
        {jobType && (
          <span className='px-3 py-1 bg-blue-50 text-blue-600 text-xs rounded-full font-medium'>
            {formatJobType(jobType)}
          </span>
        )}
        {isRemote && (
          <span className='px-3 py-1 bg-green-50 text-green-600 text-xs rounded-full font-medium'>
            Remote
          </span>
        )}
        {experienceLevel && (
          <span className='px-3 py-1 bg-purple-50 text-purple-600 text-xs rounded-full font-medium'>
            {formatExperienceLevel(experienceLevel)}
          </span>
        )}
        {isJobClosed && (
          <span className='px-3 py-1 bg-red-50 text-red-600 text-xs rounded-full font-medium'>
            Closed
          </span>
        )}
      </div>

      {/* Action Button */}
      {onButtonClick ? (
        <button
          onClick={onButtonClick}
          disabled={isJobClosed}
          className={`w-full py-2.5 rounded-lg font-medium transition-colors ${
            isJobClosed
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 hover:border-gray-300'
          }`}
        >
          {buttonText}
        </button>
      ) : (
        <Link
          href={href}
          className={`block w-full py-2.5 text-center rounded-lg font-medium transition-colors ${
            isJobClosed
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none'
              : 'bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 hover:border-gray-300'
          }`}
        >
          {buttonText}
        </Link>
      )}
    </div>
  );
}
