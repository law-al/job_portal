import React from 'react';
import { ChevronRight } from 'lucide-react';
import { fetchWithRetry } from '@/lib/fetchWithRetry';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import EditJobForm from './components/EditJobForm';

interface EditJobPageProps {
  params: Promise<{ jobId: string }>;
}

interface JobResponse {
  success: boolean;
  message: string;
  data: {
    job: {
      id: string;
      title: string;
      slug: string;
      description: string;
      location: string;
      jobType: string;
      experienceLevel: string;
      salary_range: string | null;
      status: string;
      isClosed: boolean;
      isRemote: boolean;
      slot: number | null;
      deadline: string | null;
      createdAt: string;
      updatedAt: string;
      pipelineName: string | null;
      pipelineStages: Array<{
        name: string;
        order: number;
      }>;
    };
  };
}

export default async function EditJobPage({ params }: EditJobPageProps) {
  const { jobId } = await params;
  const session = await getServerSession(authOptions);

  if (session?.user.error) {
    throw new Error('unauthorized');
  }

  if (!session?.user?.companyId) {
    return (
      <div className='p-8'>
        <p className='text-red-600'>
          Company ID not found. Please ensure you are associated with a company.
        </p>
      </div>
    );
  }

  let job: JobResponse['data']['job'] | null = null;

  try {
    const response = await fetchWithRetry({
      url: `jobs/${session.user.companyId}/fetch/${jobId}`,
      options: {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.user.accessToken}`,
        },
      },
      refreshTokenHash: session.user.refreshTokenHash,
    });

    if (response.ok) {
      const data = (await response.json()) as JobResponse;
      job = data.data?.job || null;
    }
  } catch (error) {
    console.error('Error fetching job:', error);
  }

  if (!job) {
    notFound();
  }

  return (
    <>
      {/* Breadcrumb */}
      <div className='bg-white border-b border-gray-200 px-8 py-4'>
        <div className='flex items-center gap-2 text-sm text-gray-500 mb-4'>
          <Link
            href='/admin/jobs'
            className='hover:text-gray-700 cursor-pointer'
          >
            Jobs Management
          </Link>
          <ChevronRight size={16} />
          <Link
            href={`/admin/jobs/${job.slug}`}
            className='hover:text-gray-700 cursor-pointer'
          >
            {job.title}
          </Link>
          <ChevronRight size={16} />
          <span className='text-gray-900 font-medium'>Edit</span>
        </div>
        <h1 className='text-3xl font-bold text-gray-900'>Edit Job</h1>
      </div>

      {/* Main Content */}
      <main className='flex-1 overflow-y-auto p-8'>
        <div className='max-w-4xl mx-auto'>
          <div className='bg-white rounded-xl border border-gray-200 p-8'>
            <EditJobForm job={job} companyId={session.user.companyId} />
          </div>
        </div>
      </main>
    </>
  );
}
