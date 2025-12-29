import { AlertTriangle } from 'lucide-react';
import React from 'react';

export default function AdvanceOperations() {
  return (
    <div className="col-span-3 bg-red-50 border border-red-200 rounded-lg p-6">
    <div className="flex items-start gap-3 mb-6">
      <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
      <div>
        <h3 className="font-semibold text-red-900 mb-1">Advanced Operations</h3>
        <p className="text-sm text-red-700">Critical system operations. Use with caution.</p>
      </div>
    </div>

    <div className="grid grid-cols-3 gap-4">
      <button className="px-4 py-3 bg-white border border-red-300 text-red-700 rounded-lg hover:bg-red-50 font-medium text-sm transition-colors">Clear Cache</button>
      <button className="px-4 py-3 bg-white border border-red-300 text-red-700 rounded-lg hover:bg-red-50 font-medium text-sm transition-colors">
        Rebuild Search Index
      </button>
      <button className="px-4 py-3 bg-white border border-red-300 text-red-700 rounded-lg hover:bg-red-50 font-medium text-sm transition-colors">
        Reset Email Queue
      </button>
      <button className="px-4 py-3 bg-white border border-red-300 text-red-700 rounded-lg hover:bg-red-50 font-medium text-sm transition-colors">
        Sync User Permissions
      </button>
      <button className="px-4 py-3 bg-white border border-red-300 text-red-700 rounded-lg hover:bg-red-50 font-medium text-sm transition-colors">
        Export System Logs
      </button>
      <button className="px-4 py-3 bg-red-600 border border-red-700 text-white rounded-lg hover:bg-red-700 font-medium text-sm transition-colors">
        Maintenance Mode
      </button>
    </div>
  </div>
  )
}
