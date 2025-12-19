'use client';

import { MapPin, Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

export default function Filters() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read current values from URL
  const currentSearch = searchParams.get('search') || '';
  const currentLocation = searchParams.get('location') || '';
  const currentSalaryMax = searchParams.get('salaryMax') || '150';
  const currentJobTypes = searchParams.get('jobType')?.split(',') || [];
  const currentExperience = searchParams.get('experienceLevel') || '';

  const updateURL = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    router.replace(`/jobs?${params.toString()}`);
  };

  const handleSearchChange = (value: string) => {
    if (value.length >= 3) {
      updateURL({ search: value });
    } else if (value.length === 0) {
      updateURL({ search: null });
    }
  };

  const handleLocationChange = (value: string) => {
    if (value.length >= 3) {
      updateURL({ location: value });
    } else if (value.length === 0) {
      updateURL({ location: null });
    }
  };

  const handleSalaryChange = (value: string) => {
    updateURL({ salaryMax: value });
  };

  const toggleJobType = (type: string) => {
    const types = currentJobTypes.includes(type)
      ? currentJobTypes.filter((t) => t !== type)
      : [...currentJobTypes, type];

    updateURL({ jobType: types.length > 0 ? types.join(',') : null });
  };

  const handleExperienceChange = (level: string) => {
    updateURL({ experienceLevel: level });
  };

  const clearAllFilters = () => {
    router.replace('/jobs');
  };

  return (
    <aside className='w-72 shrink-0'>
      <div className='bg-white rounded-lg p-6 shadow-sm sticky top-8'>
        <h2 className='text-xl font-bold text-gray-900 mb-6'>Filters</h2>

        {/* Job Title Search */}
        <div className='mb-6'>
          <label className='block text-sm font-semibold text-gray-900 mb-3'>
            Job title
          </label>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
            <input
              type='text'
              defaultValue={currentSearch}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder='e.g. Product Designer'
              className='w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
        </div>

        {/* Location */}
        <div className='mb-6'>
          <label className='block text-sm font-semibold text-gray-900 mb-3'>
            Location
          </label>
          <div className='relative'>
            <MapPin className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
            <input
              type='text'
              defaultValue={currentLocation}
              onChange={(e) => handleLocationChange(e.target.value)}
              placeholder='e.g. San Francisco, CA'
              className='w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
        </div>

        {/* Salary Range */}
        <div className='mb-6'>
          <label className='block text-sm font-semibold text-gray-900 mb-3'>
            Salary Range
          </label>
          <div className='px-2'>
            <input
              type='range'
              min='50'
              max='200'
              value={currentSalaryMax}
              onChange={(e) => handleSalaryChange(e.target.value)}
              className='w-full h-2 bg-blue-600 rounded-lg appearance-none cursor-pointer'
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${
                  ((parseInt(currentSalaryMax) - 50) / 150) * 100
                }%, #e5e7eb ${
                  ((parseInt(currentSalaryMax) - 50) / 150) * 100
                }%)`,
              }}
            />
            <div className='flex justify-between mt-2 text-sm text-gray-600'>
              <span>$50k</span>
              <span>${currentSalaryMax}k</span>
            </div>
          </div>
        </div>

        {/* Job Type */}
        <div className='mb-6'>
          <label className='block text-sm font-semibold text-gray-900 mb-3'>
            Job Type
          </label>
          <div className='space-y-3'>
            {['Full-time', 'Part-time', 'Contract'].map((type) => (
              <label
                key={type}
                className='flex items-center gap-3 cursor-pointer'
              >
                <input
                  type='checkbox'
                  checked={currentJobTypes.includes(type)}
                  onChange={() => toggleJobType(type)}
                  className='w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
                />
                <span className='text-sm text-gray-700'>{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Experience Level */}
        <div className='mb-8'>
          <label className='block text-sm font-semibold text-gray-900 mb-3'>
            Experience Level
          </label>
          <div className='space-y-3'>
            {['Entry Level', 'Mid Level', 'Senior Level'].map((level) => (
              <label
                key={level}
                className='flex items-center gap-3 cursor-pointer'
              >
                <input
                  type='radio'
                  name='experience'
                  checked={currentExperience === level}
                  onChange={() => handleExperienceChange(level)}
                  className='w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500'
                />
                <span className='text-sm text-gray-700'>{level}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={clearAllFilters}
          className='w-full py-3 text-gray-600 hover:text-gray-900 font-medium transition-colors border border-gray-200 rounded-lg hover:bg-gray-50'
        >
          Clear All Filters
        </button>
      </div>
    </aside>
  );
}
