import { Edit2, Plus } from 'lucide-react';
import React from 'react';

export default function UserEducation() {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Education</h3>
        <button className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700">
          <Plus className="w-4 h-4" />
          Add Education
        </button>
      </div>

      <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
          <span className="text-xl">🎓</span>
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-gray-900 mb-1">Bachelor of Fine Arts in Interaction Design</h4>
          <p className="text-sm text-gray-600">California College of the Arts • 2014 - 2018</p>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <Edit2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
