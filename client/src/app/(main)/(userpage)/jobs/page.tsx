import Filters from './components/Filters';
import Pagination from '@/components/Pagination';
import SearchHeader from './components/SearchHeader';
import JobListingsWrapper from './components/JobListingsWrapper';
import Jobs from './components/Jobs';
import type { JobSearchParams, GetAllJobsResponse } from '@/types';

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

const buildQueryString = (params: JobSearchParams) => {
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

export default async function JobListings({ searchParams }: { searchParams: Promise<JobSearchParams> }) {
  const params = (await searchParams) as JobSearchParams;
  const query = buildQueryString(params);

  let jobs: GetAllJobsResponse['data']['jobs'] = [];
  let pagination: GetAllJobsResponse['data']['pagination'] = {
    page: Number(params.page) || 1,
    limit: Number(params.limit) || 20,
    total: 0,
    totalPages: 0,
  };

  try {
    const res = await fetch(`http://localhost:3000/api/v1/jobs/all${query ? `?${query}` : ''}`, {
      cache: 'no-store',
    });

    if (res.ok) {
      const data = (await res.json()) as GetAllJobsResponse;
      jobs = data.data.jobs;
      pagination = data.data.pagination;
    }
  } catch (error) {
    console.error('Failed to fetch jobs:', error);
  }

  const hasJobs = jobs && jobs.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        <JobListingsWrapper>
          <Filters />
          <main className="flex-1">
            <SearchHeader total={pagination.total || jobs.length} search={params.search || ''} />
            <Jobs jobs={jobs} hasJobs={hasJobs} />
            <Pagination pagination={pagination} basePath="/jobs" itemName="jobs" />
          </main>
        </JobListingsWrapper>
      </div>
    </div>
  );
}
