'use client';
import { ChevronDown, Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function JobsFilter() {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const router = useRouter();

  const handleQuery = (
    value: string,
    type: 'search' | 'status' | 'date' | 'reset'
  ) => {
    switch (type) {
      case 'search':
        if (value.length > 2) {
          params.delete('status');
          params.delete('date');
          params.set('search', value);
        } else if (value.length < 3) {
          params.delete('search');
        }
        break;
      case 'status':
        params.set('status', value);
        break;
      case 'date':
        params.set('date', value);
        break;
      case 'reset':
        params.delete('status');
        params.delete('date');
        params.delete('search');
        break;
    }
    router.replace(`/admin/jobs?${params.toString()}`);
  };

  return (
    <div className='p-6'>
      <div className='flex gap-4 items-center'>
        {/* Search */}
        <div className='flex-1'>
          <div className='relative'>
            <Search
              className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
              size={20}
            />
            <input
              type='text'
              placeholder='Search by Job Title, Company...'
              defaultValue={params.get('search') || ''}
              onChange={(e) => handleQuery(e.target.value, 'search')}
              className='w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-gray-50'
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className='relative'>
          <select
            value={params.get('status') || 'all'}
            onChange={(e) => handleQuery(e.target.value, 'status')}
            className='appearance-none pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white cursor-pointer'
          >
            <option value='all'>Status: All</option>
            <option value='open'>Open</option>
            <option value='closed'>Closed</option>
          </select>
          <ChevronDown
            className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none'
            size={20}
          />
        </div>

        {/* Date Range */}
        <div className='relative'>
          <select
            value={params.get('date') || 'custom'}
            onChange={(e) => handleQuery(e.target.value, 'date')}
            className='appearance-none pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white cursor-pointer'
          >
            <option value='custom'>Date Range</option>
            <option value='7'>Last 7 days</option>
            <option value='30'>Last 30 days</option>
            <option value='90'>Last 90 days</option>
          </select>
          <ChevronDown
            className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none'
            size={20}
          />
        </div>

        {/* Reset Filters */}
        <button
          onClick={() => handleQuery('_', 'reset')}
          className='text-blue-600 hover:text-blue-700 font-medium text-sm whitespace-nowrap'
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}
