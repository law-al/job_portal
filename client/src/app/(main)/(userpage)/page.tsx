import { Briefcase, MapPin, Search } from 'lucide-react';
import JobCard, { type JobCardProps } from '@/components/JobCard';

export default function JobFinderHome() {
  const recommendedJobs: JobCardProps[] = [
    {
      id: '1',
      slug: 'senior-product-designer-1',
      title: 'Senior Product Designer',
      company: 'Google',
      salary_range: '$120k - $150k',
      location: 'San Francisco, CA',
      jobType: 'FULL_TIME',
      experienceLevel: 'SENIOR',
      isRemote: true,
    },
    {
      id: '2',
      slug: 'frontend-developer-react-2',
      title: 'Frontend Developer (React)',
      company: 'Meta',
      salary_range: '$90k - $110k',
      location: 'Remote',
      jobType: 'FULL_TIME',
      experienceLevel: 'MID',
      isRemote: true,
    },
    {
      id: '3',
      slug: 'financial-analyst-3',
      title: 'Financial Analyst',
      company: 'Stripe',
      salary_range: '$85k - $105k',
      location: 'New York, NY',
      jobType: 'FULL_TIME',
      experienceLevel: 'MID',
      isRemote: false,
    },
    {
      id: '4',
      slug: 'ux-ui-designer-4',
      title: 'UX/UI Designer',
      company: 'Netflix',
      salary_range: '$100k - $130k',
      location: 'Los Gatos, CA',
      jobType: 'FULL_TIME',
      experienceLevel: 'MID',
      isRemote: false,
    },
  ];

  const profileJobs: JobCardProps[] = [
    {
      id: '5',
      slug: 'data-scientist-5',
      title: 'Data Scientist',
      company: 'Spotify',
      salary_range: '$130k - $160k',
      location: 'New York, NY',
      jobType: 'FULL_TIME',
      experienceLevel: 'SENIOR',
      isRemote: false,
    },
    {
      id: '6',
      slug: 'software-engineer-6',
      title: 'Software Engineer',
      company: 'Amazon',
      salary_range: '$110k - $140k',
      location: 'Seattle, WA',
      jobType: 'FULL_TIME',
      experienceLevel: 'MID',
      isRemote: false,
    },
  ];

  const recentlyViewed: JobCardProps[] = [
    {
      id: '7',
      slug: 'product-manager-7',
      title: 'Product Manager',
      company: 'Microsoft',
      salary_range: '$140k - $170k',
      location: 'Redmond, WA',
      jobType: 'FULL_TIME',
      experienceLevel: 'SENIOR',
      isRemote: false,
    },
  ];

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}

      {/* Hero Section */}
      <section className='bg-white py-16'>
        <div className='max-w-4xl mx-auto px-6 text-center'>
          <h1 className='text-5xl font-bold text-gray-900 mb-4'>
            Find your next opportunity
          </h1>
          <p className='text-gray-600 text-lg mb-8'>
            Discover thousands of job listings tailored to your skills and
            experience. Your dream job is just a search away.
          </p>

          {/* Search Bar */}
          <div className='flex flex-col md:flex-row gap-4 max-w-3xl mx-auto'>
            <div className='flex-1 flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200'>
              <Briefcase className='w-5 h-5 text-gray-400' />
              <input
                type='text'
                placeholder='Job title or keyword'
                className='flex-1 bg-transparent outline-none text-gray-900'
              />
            </div>

            <div className='flex-1 flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200'>
              <MapPin className='w-5 h-5 text-gray-400' />
              <input
                type='text'
                placeholder='Location'
                className='flex-1 bg-transparent outline-none text-gray-900'
              />
            </div>

            <button className='px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2'>
              <Search className='w-5 h-5' />
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Recommended Jobs */}
      <section className='max-w-7xl mx-auto px-6 py-12'>
        <h2 className='text-2xl font-bold text-gray-900 mb-6'>
          Recommended for you
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {recommendedJobs.map((job) => (
            <JobCard key={job.id} {...job} buttonText='Apply Now' />
          ))}
        </div>
      </section>

      {/* Based on Profile */}
      <section className='max-w-7xl mx-auto px-6 py-12'>
        <h2 className='text-2xl font-bold text-gray-900 mb-6'>
          Based on your profile
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {profileJobs.map((job) => (
            <JobCard key={job.id} {...job} buttonText='Apply Now' />
          ))}
        </div>
      </section>

      {/* Recently Viewed */}
      <section className='max-w-7xl mx-auto px-6 py-12 pb-20'>
        <h2 className='text-2xl font-bold text-gray-900 mb-6'>
          Recently viewed
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {recentlyViewed.map((job) => (
            <JobCard key={job.id} {...job} buttonText='View' />
          ))}
        </div>
      </section>
    </div>
  );
}
