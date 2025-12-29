import { ImageIcon } from 'lucide-react';
import React from 'react'

export default function PlatformIdentity() {
  return (
    <div className="col-span-2 bg-white rounded-lg p-6 border border-gray-200">
    <div className="flex items-start justify-between mb-6">
      <div>
        <h3 className="font-semibold text-gray-900 text-lg mb-1">Platform Identity</h3>
        <p className="text-sm text-gray-600">Core details of the job portal shown to users and search engines.</p>
      </div>
      <ImageIcon className="w-5 h-5 text-gray-400" />
    </div>

    <div className="grid grid-cols-2 gap-6 mb-6">
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">Platform Name</label>
        <input
          type="text"
          defaultValue="JobPortal Enterprise"
          className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">Used in page titles and automated emails.</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">Support Email</label>
        <input
          type="email"
          defaultValue="support@jobportal.com"
          className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">Public facing email for user inquiries.</p>
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-900 mb-2">Meta Description (SEO)</label>
      <textarea
        defaultValue="Leading job portal connecting top talent with innovative companies worldwide."
        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        rows={3}
      />
      </div>
    </div>
  );
}
