'use client';

import React from 'react';
import { useMyApplications } from '../provider';

export default function Tabs() {
  const { tab, setTab } = useMyApplications();
  return (
    <div>
      <div className="flex gap-8 border-b border-gray-200 mb-6">
        <button
          onClick={() => setTab('all')}
          className={`pb-4 px-1 font-medium transition-colors relative ${tab === 'all' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
        >
          All Applications
          <span className="ml-2 text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded">24</span>
          {tab === 'all' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>}
        </button>
        <button
          onClick={() => setTab('interviewing')}
          className={`pb-4 px-1 font-medium transition-colors relative ${tab === 'interviewing' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
        >
          Interviewing
          <span className="ml-2 text-sm text-gray-600">3</span>
          {tab === 'interviewing' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>}
        </button>
        <button
          onClick={() => setTab('pending')}
          className={`pb-4 px-1 font-medium transition-colors relative ${tab === 'pending' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
        >
          Pending
          <span className="ml-2 text-sm text-gray-600">3</span>
          {tab === 'pending' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>}
        </button>
        <button
          onClick={() => setTab('archived')}
          className={`pb-4 px-1 font-medium transition-colors relative ${tab === 'archived' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
        >
          Archived
          <span className="ml-2 text-sm text-gray-600">3</span>
          {tab === 'archived' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>}
        </button>
      </div>
    </div>
  );
}
