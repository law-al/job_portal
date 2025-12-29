import React from 'react';

export default function SearchHeader({ total, search }: { total: number; search: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900">
        Showing <span className="text-blue-600">{total} results</span>
      </h1>
      {search && (
        <p className="text-sm text-gray-500 mt-1">
          Search: <span className="font-medium">{search}</span>
        </p>
      )}
    </div>
  );
}
