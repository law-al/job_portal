import React from 'react';

export default function ProfileFooter() {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm flex items-center justify-between">
      <p className="text-sm text-gray-500">Last saved: Today at 10:42 AM</p>
      <div className="flex gap-3">
        <button className="px-6 py-2 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">Cancel</button>
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">Save Changes</button>
      </div>
    </div>
  );
}
