import { Trash2, Upload } from 'lucide-react';
import React from 'react';

export default function ResumeUpload() {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Resume</h3>

      <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center mb-4 bg-blue-50">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <Upload className="w-6 h-6 text-blue-600" />
        </div>
        <button className="text-blue-600 font-medium hover:underline mb-1">Click to upload</button>
        <p className="text-xs text-gray-500">PDF, DOCX up to 10MB</p>
      </div>

      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
        <div className="w-10 h-10 bg-red-100 rounded flex items-center justify-center shrink-0">
          <span className="text-red-600 font-bold text-xs">PDF</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">Alex_CV_2023.pdf</p>
          <p className="text-xs text-gray-500">Added 2 days ago</p>
        </div>
        <button className="text-gray-400 hover:text-red-600">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
