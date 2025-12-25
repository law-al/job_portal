import { ChevronLeft, ChevronRight } from 'lucide-react';
import JobCard from '@/components/JobCard';
import Filters from './components/Filters';

interface SearchParams {
  search?: string;
  location?: string;
  jobType?: string; // comma-separated from filters
  experienceLevel?: string;
  page?: string;
  limit?: string;
  isRemote?: string;
}

interface GetAllJobsResponse {
  success: boolean;
  message: string;
  data: {
    jobs: Array<{
      id: string;
      slug: string;
      title: string;
      companyId: string;
      company?: { id: string; name: string; logo?: string | null } | null;
      location: string;
      salary_range?: string | null;
      jobType?: string | null;
      experienceLevel?: string | null;
      isRemote?: boolean | null;
      status?: string | null;
      isClosed?: boolean | null;
      deadline?: string | null;
      createdAt?: string;
    }>;
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

const normalizeJobType = (jobType?: string) => {
  if (!jobType) return undefined;
  const first = jobType.split(',')[0];
  const normalized = first
    .trim()
    .replace(/[\s-]+/g, '_')
    .toUpperCase();
  return normalized;
};

const normalizeExperience = (level?: string) => {
  if (!level) return undefined;
  const lower = level.toLowerCase();
  if (lower.includes('entry')) return 'ENTRY';
  if (lower.includes('mid')) return 'MID';
  if (lower.includes('senior')) return 'SENIOR';
  return level.toUpperCase();
};

const buildQueryString = (params: SearchParams) => {
  const qs = new URLSearchParams();
  if (params.search) qs.set('search', params.search);
  if (params.location) qs.set('location', params.location);

  const jobType = normalizeJobType(params.jobType); // normalize the job type to the format of the database
  if (jobType) qs.set('jobType', jobType);

  const exp = normalizeExperience(params.experienceLevel); // normalize the experience level to the format of the database
  if (exp) qs.set('experienceLevel', exp);

  if (params.isRemote !== undefined) qs.set('isRemote', params.isRemote);
  if (params.page) qs.set('page', params.page);
  if (params.limit) qs.set('limit', params.limit);

  return qs.toString();
};

export default async function JobListings({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = (await searchParams) as SearchParams;
  const query = buildQueryString(params);

  let jobs: GetAllJobsResponse['data']['jobs'] = [];
  let pagination: GetAllJobsResponse['data']['pagination'] = {
    page: Number(params.page) || 1,
    limit: Number(params.limit) || 20,
    total: 0,
    totalPages: 0,
  };

  try {
    const res = await fetch(
      `http://localhost:3000/api/v1/jobs/all${query ? `?${query}` : ''}`,
      {
        cache: 'no-store',
      }
    );

    if (res.ok) {
      const data = (await res.json()) as GetAllJobsResponse;
      jobs = data.data.jobs;
      pagination = data.data.pagination;
    }
  } catch (error) {
    console.error('Failed to fetch jobs:', error);
  }

  const hasJobs = jobs && jobs.length > 0;

  const renderJobs = () => {
    if (!hasJobs) {
      return (
        <div className='text-center text-gray-600 py-10 border border-dashed border-gray-200 rounded-lg bg-white'>
          No jobs found. Try adjusting your filters.
        </div>
      );
    }

    return (
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            id={job.id}
            slug={job.slug}
            title={job.title}
            company={job.company?.name}
            location={job.location}
            salary_range={job.salary_range || undefined}
            jobType={job.jobType || undefined}
            experienceLevel={job.experienceLevel || undefined}
            isRemote={Boolean(job.isRemote)}
            status={job.status || undefined}
            isClosed={job.isClosed || false}
            deadline={job.deadline || undefined}
            createdAt={job.createdAt}
            buttonText='Apply Now'
          />
        ))}
      </div>
    );
  };

  const buildPageLink = (page: number) => {
    const qs = new URLSearchParams(query);
    qs.set('page', page.toString());
    return `/jobs?${qs.toString()}`;
  };

  const currentPage = pagination.page || 1;
  const totalPages = pagination.totalPages || 1;

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-7xl mx-auto px-6'>
        <div className='flex gap-8'>
          {/* Filters Sidebar */}
          <Filters />

          {/* Job Listings */}
          <main className='flex-1'>
            <div className='mb-6'>
              <h1 className='text-2xl font-bold text-gray-900'>
                Showing{' '}
                <span className='text-blue-600'>
                  {pagination.total || jobs.length} results
                </span>
              </h1>
              {params.search && (
                <p className='text-sm text-gray-500 mt-1'>
                  Search: <span className='font-medium'>{params.search}</span>
                </p>
              )}
            </div>

            {renderJobs()}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className='flex justify-center items-center gap-2 mt-8'>
                <a
                  href={buildPageLink(Math.max(1, currentPage - 1))}
                  className='p-2 hover:bg-white rounded-lg transition-colors disabled:opacity-50'
                  aria-disabled={currentPage === 1}
                >
                  <ChevronLeft className='w-5 h-5 text-gray-600' />
                </a>

                <span className='px-3 py-2 rounded-lg bg-white border text-sm text-gray-700'>
                  Page {currentPage} of {totalPages}
                </span>

                <a
                  href={buildPageLink(Math.min(totalPages, currentPage + 1))}
                  className='p-2 hover:bg-white rounded-lg transition-colors disabled:opacity-50'
                  aria-disabled={currentPage === totalPages}
                >
                  <ChevronRight className='w-5 h-5 text-gray-600' />
                </a>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
