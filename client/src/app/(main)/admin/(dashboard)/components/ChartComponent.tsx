import React from 'react';

export default function ChartComponent() {
  return (
    <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-1">User Signups Over Time</h3>
        <p className="text-sm text-gray-500">Monthly new user registrations</p>
      </div>

      <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-gray-400">Chart Placeholder</p>
      </div>
    </div>
  );
}
