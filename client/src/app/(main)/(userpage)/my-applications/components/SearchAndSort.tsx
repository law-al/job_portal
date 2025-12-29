'use client';

import { ChevronDown, Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function SearchAndSort() {
  const sp = useSearchParams();
  const router = useRouter();
  const currentSearch = sp.get('search') || '';
  const currentSortByValue = sp.get('sortBy') || 'updated';

  const updateURL = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(sp);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    router.replace(`/my-applications?${params.toString()}`);
  };

  const handleSearchChange = (value: string) => {
    if (value.length >= 3) {
      updateURL({ search: value });
    } else if (value.length === 0) {
      updateURL({ search: null });
    }
  };

  const handleSortByChange = (value: 'updated' | 'newest' | 'oldest') => {
    updateURL({ sortBy: value });
  };

  const sortOptions: Array<{ label: string; value: 'updated' | 'newest' | 'oldest' }> = [
    { label: 'Last Updated', value: 'updated' },
    { label: 'Newest', value: 'newest' },
    { label: 'Oldest', value: 'oldest' },
  ];

  const currentSortByLabel = sortOptions.find((opt) => opt.value === currentSortByValue)?.label || 'Last Updated';

  return (
    <div className="flex gap-4 mb-6">
      <div className="flex-1 relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          defaultValue={currentSearch}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search by company or role..."
          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors">
            <span className="text-sm text-gray-600">Sort by:</span>
            <span className="font-medium text-gray-900">{currentSortByLabel}</span>
            <ChevronDown className="w-4 h-4 text-gray-600" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {sortOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => handleSortByChange(option.value)}
              className={`cursor-pointer ${currentSortByValue === option.value ? 'bg-gray-100 font-medium' : ''}`}
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
