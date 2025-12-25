'use client';

import { FileText, Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import React from 'react';

const LoadingResumePreview = () => {
  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-gray-600" />
          <h2 className="font-semibold text-gray-900">Resume Preview</h2>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <Loader2 className="w-5 h-5 text-gray-600 animate-spin" />
        <p className="text-gray-600">Loading resume preview...</p>
      </div>
    </div>
  );
};

const ResumePreview = dynamic(() => import('./ResumePreview'), { ssr: false, loading: () => <LoadingResumePreview /> });

export default function ResumePreviewClient({ resume }: { resume: { url: string; originalName: string; size: string } | null }) {
  return <ResumePreview resume={resume} />;
}
