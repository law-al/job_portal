import React from 'react';

export default function SubHeader() {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">System Settings</h1>
        <p className="text-gray-600">Manage global platform configurations and preferences.</p>
      </div>
      <div className="flex items-center gap-3">
        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">Discard</button>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2">
          <span>💾</span>
          Save Changes
        </button>
      </div>
    </div>
  );
}
