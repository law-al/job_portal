import { Share2 } from 'lucide-react';
import React from 'react';

export default function SocialPresence() {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="font-semibold text-gray-900 text-lg mb-1">Social Presence</h3>
          <p className="text-sm text-gray-600">Links displayed in the footer.</p>
        </div>
        <Share2 className="w-5 h-5 text-gray-400" />
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm">f</span>
          </div>
          <input
            type="text"
            placeholder="Facebook Page URL"
            className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm">in</span>
          </div>
          <input
            type="text"
            placeholder="LinkedIn Company URL"
            className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-400 rounded-lg flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm">t</span>
          </div>
          <input
            type="text"
            placeholder="Twitter Profile URL"
            className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
}
