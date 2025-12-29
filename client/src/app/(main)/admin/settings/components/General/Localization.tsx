import { ChevronDown, Globe } from 'lucide-react';
import React from 'react';

export default function Localization() {
  return (
    <div className="col-span-2 bg-white rounded-lg p-6 border border-gray-200">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="font-semibold text-gray-900 text-lg mb-1">Localization</h3>
          <p className="text-sm text-gray-600">Time, currency, and language defaults.</p>
        </div>
        <Globe className="w-5 h-5 text-gray-400" />
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Default Timezone</label>
          <div className="relative">
            <select className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
              <option>(GMT-05:00) Eastern Time (US & Canada)</option>
              <option>(GMT-08:00) Pacific Time (US & Canada)</option>
              <option>(GMT+00:00) UTC</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Currency</label>
            <div className="relative">
              <select className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
                <option>USD ($)</option>
                <option>EUR (€)</option>
                <option>GBP (£)</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Date Format</label>
            <div className="relative">
              <select className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
                <option>MM/DD/YYYY</option>
                <option>DD/MM/YYYY</option>
                <option>YYYY-MM-DD</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
