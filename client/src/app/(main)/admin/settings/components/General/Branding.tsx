import { ImageIcon } from 'lucide-react';
import React from 'react';

export default function Branding() {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="font-semibold text-gray-900 text-lg mb-1">Branding</h3>
          <p className="text-sm text-gray-600">Manage logos and assets.</p>
        </div>
        <ImageIcon className="w-5 h-5 text-gray-400" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-3">Primary Logo</label>
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
          <div className="w-16 h-16 bg-gray-600 rounded-lg mx-auto mb-3 flex items-center justify-center">
            <span className="text-2xl">🌿</span>
          </div>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium mb-1">Click to replace</button>
          <p className="text-xs text-gray-500">SVG, PNG, JPG (max. 2MB)</p>
        </div>
      </div>
    </div>
  );
}
