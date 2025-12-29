import { Bookmark } from 'lucide-react';
import Link from 'next/link';
import AppBreadCrumb from '@/components/AppBreadCrumb';
import { Button } from '@/components/ui/button';
import JobHeader from './components/JobHeader';
import { fetchWithRetry } from '@/lib/fetchWithRetry';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';

interface JobResponse {
  success: boolean;
  message: string;
  data: {
    job: {
      id: string;
      slug: string;
      title: string;
      description: string;
      companyId: string;
      company?: { id: string; name: string; logo?: string | null; description?: string | null } | null;
      location: string;
      salary_range?: string | null;
      jobType?: string | null;
      experienceLevel?: string | null;
      isRemote?: boolean | null;
      deadline?: string | null;
      createdAt?: string;
    };
    similarJobs: {
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
      deadline?: string | null;
      createdAt?: string;
    }[];
  };
}

export default async function JobDetailPage({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId: slug } = await params;
  const session = await getServerSession(authOptions);

  let job: JobResponse['data']['job'] | null = null;
  let similarJobs: JobResponse['data']['similarJobs'] = [];

  try {
    const response = await fetchWithRetry({
      url: `jobs/${slug}`,
      options: {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.user.accessToken}`,
        },
      },
      refreshTokenHash: session?.user.refreshTokenHash,
    });

    if (!response.ok) {
      return notFound();
    }
    const data = (await response.json()) as JobResponse;
    job = data.data?.job || null;
    similarJobs = data.data?.similarJobs || [];
  } catch (error) {
    console.error('Error fetching job:', error);
    return notFound();
  }

  if (!job) {
    return notFound();
  }

  if (!similarJobs) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <AppBreadCrumb items={[{ label: 'Jobs', href: '/jobs' }, { label: job.title }]} homeHref="/" />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Left Column - Job Details */}
          <div className="flex-1">
            {/* Job Header */}
            <JobHeader job={job} />

            {/* Job Description */}
            <div className="bg-white rounded-lg p-8 shadow-sm mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Job Description</h2>
              <p className="text-gray-700 leading-relaxed">{job.description}</p>
            </div>

            {/* Key Responsibilities */}
            <div className="bg-white rounded-lg p-8 shadow-sm mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Key Responsibilities</h2>
              <ul className="space-y-3">
                <li className="flex gap-3 text-gray-700">
                  <span className="text-gray-400 mt-1">•</span>
                  <span>Lead design projects across the entire product lifecycle and multiple product launches.</span>
                </li>
                <li className="flex gap-3 text-gray-700">
                  <span className="text-gray-400 mt-1">•</span>
                  <span>Set the vision for the user experience and create a space for others to collaborate.</span>
                </li>
                <li className="flex gap-3 text-gray-700">
                  <span className="text-gray-400 mt-1">•</span>
                  <span>Partner closely with engineers, product managers, and researchers to define problems and goals.</span>
                </li>
                <li className="flex gap-3 text-gray-700">
                  <span className="text-gray-400 mt-1">•</span>
                  <span>Create user flows, wireframes, prototypes, and high-fidelity mockups.</span>
                </li>
                <li className="flex gap-3 text-gray-700">
                  <span className="text-gray-400 mt-1">•</span>
                  <span>Conduct user research and usability testing to inform design decisions.</span>
                </li>
              </ul>
            </div>

            {/* Required Qualifications */}
            <div className="bg-white rounded-lg p-8 shadow-sm mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Required Qualifications & Skills</h2>
              <ul className="space-y-3">
                <li className="flex gap-3 text-gray-700">
                  <span className="text-gray-400 mt-1">•</span>
                  <span>5+ years of experience in product design.</span>
                </li>
                <li className="flex gap-3 text-gray-700">
                  <span className="text-gray-400 mt-1">•</span>
                  <span>A strong portfolio showcasing your work and design process.</span>
                </li>
                <li className="flex gap-3 text-gray-700">
                  <span className="text-gray-400 mt-1">•</span>
                  <span>Proficiency in Figma, Sketch, or other design tools.</span>
                </li>
                <li className="flex gap-3 text-gray-700">
                  <span className="text-gray-400 mt-1">•</span>
                  <span>Experience with user research and usability testing methodologies.</span>
                </li>
                <li className="flex gap-3 text-gray-700">
                  <span className="text-gray-400 mt-1">•</span>
                  <span>Excellent communication and collaboration skills.</span>
                </li>
                <li className="flex gap-3 text-gray-700">
                  <span className="text-gray-400 mt-1">•</span>
                  <span>Experience designing for both web and mobile platforms.</span>
                </li>
              </ul>
            </div>

            {/* Salary & Benefits */}
            <div className="bg-white rounded-lg p-8 shadow-sm mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Salary & Benefits</h2>

              <div className="bg-gray-50 rounded-lg p-6 mb-4">
                {job.salary_range ? (
                  <>
                    <div className="text-2xl font-bold text-gray-900 mb-1">{job.salary_range} per year</div>
                    <p className="text-sm text-gray-600">Salary may vary depending on experience and location.</p>
                  </>
                ) : (
                  <p className="text-sm text-gray-600">Salary not specified.</p>
                )}
              </div>

              {/* <ul className='space-y-3'>
                <li className='flex gap-3 text-gray-700'>
                  <span className='text-gray-400 mt-1'>•</span>
                  <span>
                    Comprehensive health, dental, and vision insurance.
                  </span>
                </li>
                <li className='flex gap-3 text-gray-700'>
                  <span className='text-gray-400 mt-1'>•</span>
                  <span>401(k) with company match.</span>
                </li>
                <li className='flex gap-3 text-gray-700'>
                  <span className='text-gray-400 mt-1'>•</span>
                  <span>Unlimited paid time off.</span>
                </li>
                <li className='flex gap-3 text-gray-700'>
                  <span className='text-gray-400 mt-1'>•</span>
                  <span>Professional development stipend.</span>
                </li>
                <li className='flex gap-3 text-gray-700'>
                  <span className='text-gray-400 mt-1'>•</span>
                  <span>Remote work flexibility.</span>
                </li>
              </ul> */}
            </div>

            {/* About Company */}
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About {job.company?.name}</h2>
              <p className="text-gray-700 leading-relaxed">{job.company?.description}</p>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <aside className="w-80 shrink-0">
            {/* Similar Jobs */}
            {similarJobs.length > 0 && (
              <div className="bg-white rounded-lg p-6 shadow-sm mb-6 sticky top-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Similar Jobs</h3>
                <div className="space-y-4">
                  {similarJobs.map((job, idx) => (
                    <a key={idx} href="#" className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all">
                      <h4 className="font-semibold text-gray-900 mb-1">{job.title}</h4>
                      <p className="text-sm text-gray-600">
                        {job.company?.name} • {job.location}
                      </p>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Recruiter Information */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recruiter Information</h3>

              <div className="flex flex-col items-center text-center mb-4">
                <div className="w-20 h-20 bg-gray-800 rounded-full mb-3 flex items-center justify-center">
                  <span className="text-2xl">👤</span>
                </div>
                <h4 className="font-semibold text-gray-900">Jane Doe</h4>
                <p className="text-sm text-gray-600">Senior Technical Recruiter</p>
              </div>

              <button className="w-full py-3 bg-blue-100 text-blue-600 rounded-lg font-medium hover:bg-blue-200 transition-colors">Contact Recruiter</button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
