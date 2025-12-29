import JobCard from '@/components/JobCard';

interface JobCardProps {
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
}

export default function Jobs({ jobs, hasJobs }: { jobs: JobCardProps[]; hasJobs: boolean }) {
  if (!hasJobs) {
    return <div className="text-center text-gray-600 py-10 border border-dashed border-gray-200 rounded-lg bg-white">No jobs found. Try adjusting your filters.</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          id={job.id}
          slug={job.slug}
          title={job.title}
          company={job.company?.name || ''}
          location={job.location}
          salary_range={job.salary_range || ''}
          jobType={job.jobType || ''}
          experienceLevel={job.experienceLevel || ''}
          isRemote={Boolean(job.isRemote)}
          status={job.status || ''}
          isClosed={job.isClosed || false}
          deadline={job.deadline || ''}
          createdAt={job.createdAt}
          buttonText="Apply Now"
        />
      ))}
    </div>
  );
}
