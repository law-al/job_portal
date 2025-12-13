'use client';

import { ChevronDown, Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';

export default function UserFilter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const router = useRouter();

  const handleQuery = (value: string, type: 'role' | 'status' | 'search') => {
    switch (type) {
      case 'search':
        if (value && value.length > 2) {
          params.delete('role');
          params.delete('status');
          params.set('search', value);
        } else if (value.length < 3) {
          params.delete('search');
        }
        break;

      case 'role':
        params.set('role', value);
        break;

      case 'status':
        params.set('status', value);
        break;
    }

    router.replace(`/admin/users?${params.toString()}`);
  };

  return (
    <div className='p-6'>
      <div className='flex gap-4'>
        {/* Search */}
        <div className='flex-1'>
          <div className='relative'>
            <Search
              className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
              size={20}
            />
            <input
              type='text'
              placeholder='Search by name, email, company...'
              defaultValue={params.get('search')?.toString() || ''}
              onChange={(e) => handleQuery(e.target.value, 'search')}
              className='w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none'
            />
          </div>
        </div>

        {/* Role Filter */}
        <div className='relative'>
          <select
            value={params.get('role')?.toString() || 'all'}
            onChange={(e) => handleQuery(e.target.value, 'role')}
            className='appearance-none pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white cursor-pointer'
          >
            <option value='all'>Role: All</option>
            <option value='employer'>Employer</option>
            <option value='recruiter'>Recruiter</option>
          </select>
          <ChevronDown
            className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none'
            size={20}
          />
        </div>

        {/* Status Filter */}
        <div className='relative'>
          <select
            value={params.get('status')?.toString() || 'all'}
            onChange={(e) => handleQuery(e.target.value, 'status')}
            className='appearance-none pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white cursor-pointer'
          >
            <option value='all'>Status: All</option>
            <option value='verified'>Verified</option>
            <option value='pending'>Pending</option>
            <option value='suspended'>Suspended</option>
          </select>
          <ChevronDown
            className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none'
            size={20}
          />
        </div>
      </div>
    </div>
  );
}
