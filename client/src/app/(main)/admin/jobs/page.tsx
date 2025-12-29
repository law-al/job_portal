import JobsFilter from './components/JobsFilter';
import TableHeader from '@/components/TableHeader';
import JobsTableBody from './components/JobsTableBody';
import { fetchWithRetry } from '@/lib/fetchWithRetry';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import JobHeader from './components/JobHeader';
import NoJobs from './components/NoJobs';
import Pagination from '@/components/Pagination';

const tableHeaders = ['job title', 'posted by', 'status', 'applicants', 'posted on', 'action'];

interface SearchParams {
  page?: string;
  limit?: string;
  status?: string;
  search?: string;
}

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
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
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

export default async function JobsManagement({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const session = await getServerSession(authOptions);

  if (session?.user.error) {
    throw new Error('unauthorized');
  }

  if (!session?.user?.companyId) {
    return (
      <div className="p-8">
        <p className="text-red-600">Company ID not found. Please ensure you are associated with a company.</p>
      </div>
    );
  }

  let jobs: TransformedJob[] = [];
  let pagination = {
    page: Number(params.page) || 1,
    limit: Number(params.limit) || 20,
    total: 0,
    totalPages: 0,
  };

  // Build query string
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.set('page', params.page);
  if (params.limit) queryParams.set('limit', params.limit);
  if (params.status) queryParams.set('status', params.status);
  if (params.search) queryParams.set('search', params.search);

  const queryString = queryParams.toString();

  try {
    const response = await fetchWithRetry({
      url: `jobs/${session.user.companyId}/fetch${queryString ? `?${queryString}` : ''}`,
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
      pagination = data.data?.pagination || pagination;

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
      <JobHeader hasJobs={jobs && jobs.length > 0} />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="bg-white rounded-xl border border-gray-200 mb-6">
          {!jobs || jobs.length === 0 ? (
            <NoJobs />
          ) : (
            <>
              <JobsFilter />
              <div className="overflow-x-auto">
                <table className="w-full">
                  <TableHeader headers={tableHeaders} />
                  <JobsTableBody jobs={jobs} />
                </table>
              </div>

              <div className="px-6 py-4 border-t border-gray-200">
                <Pagination pagination={pagination} basePath="/admin/jobs" itemName="jobs" />
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
