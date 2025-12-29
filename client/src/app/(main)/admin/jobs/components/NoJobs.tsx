import { Plus } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { Button } from '@/components/ui/button';

export default function NoJobs() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <Plus size={24} className="text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs found</h3>
      <p className="text-sm text-gray-500 text-center max-w-md mb-6">
        {`You haven't posted any jobs yet. Create your first job posting to
      start attracting talented candidates.`}
      </p>
      <Button asChild className="flex items-center gap-2 px-6 py-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
        <Link href="/admin/jobs/add">
          <Plus size={20} />
          Add New Job
        </Link>
      </Button>
    </div>
  );
}
