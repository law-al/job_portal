import React from 'react';
import { EyeIcon } from 'lucide-react';
import Editor from '../editor/Editor';

export default function RightForm() {
  return (
    <div className="bg-gray-100 col-span-9 h-full overflow-y-auto">
      <div className="rounded-lg h-full flex flex-col">
        {/* Email Body Header */}
        <div className="border-b bg-white border border-gray-200 p-4 flex items-center justify-between shrink-0">
          <h3 className="font-semibold text-gray-900">Email Body</h3>
          <div className="flex items-center gap-2">
            <button type="button" className="px-3 py-1.5 text-sm font-medium rounded bg-blue-500 text-white hover:bg-blue-600">
              Editor
            </button>
          </div>
        </div>

        <Editor editEmailTemplate={true} />
      </div>
    </div>
  );
}
