import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import JobsFilter from './components/JobsFilter';
import TableHeader from '@/components/TableHeader';
import JobsTableBody from './components/JobsTableBody';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { fetchWithRetry } from '@/lib/fetchWithRetry';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';

const tableHeaders = [
  'job title',
  'posted by',
  'status',
  'applicants',
  'posted on',
  'action',
];

interface JobResponse {
  success: boolean;
  message: string;
  data: {
    jobs: Array<{
      id: string;
      title: string;
      slug: string;
      status: string;
      isClosed: boolean;
      createdAt: string;
      applications: Array<{ id: string }>;
      createdBy: string;
    }>;
  };
}

interface TransformedJob {
  id: string;
  slug: string;
  title: string;
  postedBy: string;
  status: string;
  applicants: number;
  postedOn: string;
}

export default async function JobsManagement() {
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

  let jobs: TransformedJob[] = [];

  try {
    const response = await fetchWithRetry({
      url: `jobs/${session.user.companyId}/fetch`,
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
      const jobsData = data.data?.jobs || [];

      // Transform the jobs data to match the expected format
      jobs = jobsData.map((job) => ({
        id: job.id,
        slug: job.slug,
        title: job.title,
        postedBy: 'Admin', // You might want to fetch the creator's name from the backend
        status: job.isClosed || job.status === 'CLOSE' ? 'Closed' : 'Open',
        applicants: job.applications?.length || 0,
        postedOn: new Date(job.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
      }));
    }
  } catch (error) {
    console.error('Error fetching jobs:', error);
  }

  return (
    <>
      {/* Header */}
      <header className='bg-white border-b border-gray-200 px-8 py-6'>
        <div className='flex items-center justify-between'>
          <h2 className='text-3xl font-bold text-gray-900'>Jobs Management</h2>
          {jobs && jobs.length > 0 ? (
            <Button
              asChild
              className='flex items-center gap-2 px-6 py-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors'
            >
              <Link href='/admin/jobs/add'>
                <Plus size={20} />
                Add New Job
              </Link>
            </Button>
          ) : null}
        </div>
      </header>

      {/* Main Content Area */}
      <main className='flex-1 overflow-y-auto p-8'>
        {/* Filters */}
        <div className='bg-white rounded-xl border border-gray-200 mb-6'>
          {/* Table or Empty State */}
          {!jobs || jobs.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-16 px-6'>
              <div className='w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4'>
                <Plus size={24} className='text-gray-400' />
              </div>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                No jobs found
              </h3>
              <p className='text-sm text-gray-500 text-center max-w-md mb-6'>
                {`You haven't posted any jobs yet. Create your first job posting to
                start attracting talented candidates.`}
              </p>
              <Button
                asChild
                className='flex items-center gap-2 px-6 py-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors'
              >
                <Link href='/admin/jobs/add'>
                  <Plus size={20} />
                  Add New Job
                </Link>
              </Button>
            </div>
          ) : (
            <>
              {/* Table */}
              <JobsFilter />
              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <TableHeader headers={tableHeaders} />
                  <JobsTableBody jobs={jobs} />
                </table>
              </div>

              {/* Pagination */}
              <div className='px-6 py-4 border-t border-gray-200 flex items-center justify-between'>
                <p className='text-sm text-gray-500'>
                  Showing <span className='font-medium'>1</span> to{' '}
                  <span className='font-medium'>{jobs.length}</span> of{' '}
                  <span className='font-medium'>{jobs.length}</span> results
                </p>
                <div className='flex gap-2'>
                  <button className='p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'>
                    <ChevronLeft size={20} className='text-gray-600' />
                  </button>
                  <button className='px-3 py-2 bg-blue-600 text-white rounded-lg font-medium'>
                    1
                  </button>
                  <button className='px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'>
                    2
                  </button>
                  <button className='px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'>
                    3
                  </button>
                  <span className='px-3 py-2'>...</span>
                  <button className='px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'>
                    12
                  </button>
                  <button className='p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'>
                    <ChevronRight size={20} className='text-gray-600' />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
