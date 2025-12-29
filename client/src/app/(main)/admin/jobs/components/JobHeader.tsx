import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export default function JobHeader({ hasJobs }: { hasJobs: boolean }) {
  return (
    <header className="bg-white border-b border-gray-200 px-8 py-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Jobs Management</h2>
        {hasJobs && (
          <Button asChild className="flex items-center gap-2 px-6 py-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
            <Link href="/admin/jobs/add">
              <Plus size={20} />
              Add New Job
            </Link>
          </Button>
        )}
      </div>
    </header>
  );
}
