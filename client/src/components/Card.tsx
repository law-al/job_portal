import React from 'react';
import type { Stat } from '@/types';

export default function Card({ stat }: { stat: Stat }) {
  return (
    <div>
      <div key={stat.label} className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
        <div className="flex items-end justify-between">
          <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
          <span className={`text-sm font-semibold ${stat.positive ? 'text-green-600' : stat.neutral ? 'text-gray-500' : 'text-red-600'}`}>{stat.change}</span>
        </div>
      </div>
    </div>
  );
}
