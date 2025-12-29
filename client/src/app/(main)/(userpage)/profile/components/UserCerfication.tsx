import { Edit2, Plus } from 'lucide-react'
import React from 'react';

export default function UserCerfication() {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Certifications</h3>
        <button className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700">
          <Plus className="w-4 h-4" />
          Add Certification
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
            <span className="text-xl">📜</span>
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-gray-900 mb-1">Google UX Design Professional Certificate</h4>
            <p className="text-sm text-gray-600">Google • Issued 2023</p>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <Edit2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
            <span className="text-xl">✓</span>
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-gray-900 mb-1">Certified Usability Analyst (CUA)</h4>
            <p className="text-sm text-gray-600">Human Factors International • Issued 2021</p>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <Edit2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
