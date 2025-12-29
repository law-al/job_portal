import React from 'react';
import Link from 'next/link';
import AppBreadCrumb from '@/components/AppBreadCrumb';
import { Edit } from 'lucide-react';
import ShareButton from './components/ShareButton';
import { fetchWithRetry } from '@/lib/fetchWithRetry';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { notFound } from 'next/navigation';

interface JobDetailPageProps {
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
      applications: Array<{
        id: string;
        status: string;
        createdAt: string;
      }>;
      pipelineStages: Array<{
        name: string;
        order: number;
      }>;
    };
  };
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { jobId } = await params;
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

  // Calculate stats from applications
  const totalApplicants = job.applications?.length || 0;

  // Group applications by status
  const applicationsByStatus =
    job.applications?.reduce((acc, app) => {
      // { -> acc obj
      //   applied: 1
      // }
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

  const newCount = applicationsByStatus['APPLIED'] || 0;
  const screeningCount = applicationsByStatus['SCREENING'] || 0;
  const interviewingCount = applicationsByStatus['INTERVIEW'] || 0;

  // Format date
  const postedDate = new Date(job.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Format job type and location
  const jobTypeFormatted = job.jobType
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());
  const locationText = job.isRemote ? 'Remote' : job.location;

  const stats = [
    {
      label: 'Total Applicants',
      value: totalApplicants.toString(),
      change: '+0% this week',
      positive: true,
    },
    {
      label: 'New',
      value: newCount.toString(),
      change: '+0% this week',
      positive: true,
    },
    {
      label: 'Screening',
      value: screeningCount.toString(),
      change: '+0% this week',
      positive: true,
    },
    {
      label: 'Interviewing',
      value: interviewingCount.toString(),
      change: 'No change',
      neutral: true,
    },
  ];
  // Get status color helper
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPLIED':
        return 'bg-yellow-100 text-yellow-700';
      case 'SCREENING':
        return 'bg-blue-100 text-blue-700';
      case 'SHORTLISTED':
        return 'bg-purple-100 text-purple-700';
      case 'INTERVIEW':
        return 'bg-indigo-100 text-indigo-700';
      case 'OFFER':
        return 'bg-green-100 text-green-700';
      case 'HIRED':
        return 'bg-emerald-100 text-emerald-700';
      case 'REJECTED':
        return 'bg-red-100 text-red-700';
      case 'WITHDRAWN':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Format status for display
  const formatStatus = (status: string) => {
    return status
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Get recent applicants (first 3)
  const recentApplicants = job.applications?.slice(0, 3) || [];

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 px-8 py-4">
        <AppBreadCrumb items={[{ label: 'Jobs Management', href: '/admin/jobs' }, { label: job.title }]} homeHref="/admin" className="mb-4" />

        {/* Job Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${job.isClosed || job.status === 'CLOSE' ? 'bg-gray-100 text-gray-700' : 'bg-green-100 text-green-700'}`}>
              {job.isClosed || job.status === 'CLOSE' ? 'Closed' : 'Open'}
            </span>
          </div>
          <div className="flex gap-3">
            <ShareButton jobSlug={job.slug} />
            <Link
              href={`/admin/jobs/${job.slug}/edit`}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              <Edit size={18} />
              Edit Job
            </Link>
          </div>
        </div>
        <p className="text-gray-600 mt-2">
          {locationText} / {jobTypeFormatted} / Posted on {postedDate}
          {job.salary_range && ` / ${job.salary_range}`}
        </p>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl p-6 border border-gray-200">
              <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
              <p className={`text-sm ${stat.positive ? 'text-green-600' : stat.neutral ? 'text-gray-500' : 'text-red-600'}`}>{stat.change}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="col-span-2 space-y-6">
            {/* Job Description */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Job Description</h2>
              <div className="text-gray-600 space-y-4 whitespace-pre-wrap">{job.description}</div>
            </div>

            {/* Job Details */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Job Details</h2>
              <div className="grid grid-cols-2 gap-4 text-gray-600">
                <div>
                  <span className="font-medium text-gray-900">Experience Level:</span>{' '}
                  {job.experienceLevel
                    .replace(/_/g, ' ')
                    .toLowerCase()
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </div>
                <div>
                  <span className="font-medium text-gray-900">Job Type:</span> {jobTypeFormatted}
                </div>
                <div>
                  <span className="font-medium text-gray-900">Location:</span> {locationText}
                </div>
                {job.salary_range && (
                  <div>
                    <span className="font-medium text-gray-900">Salary Range:</span> {job.salary_range}
                  </div>
                )}
                {job.slot && (
                  <div>
                    <span className="font-medium text-gray-900">Number of Positions:</span> {job.slot}
                  </div>
                )}
                {job.deadline && (
                  <div>
                    <span className="font-medium text-gray-900">Application Deadline:</span>{' '}
                    {new Date(job.deadline).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                )}
                {job.pipelineName && (
                  <div className="col-span-2">
                    <span className="font-medium text-gray-900">Pipeline:</span> {job.pipelineName}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Hiring Pipeline */}
            {/* {job.pipelineStages && job.pipelineStages.length > 0 && (
              <div className='bg-white rounded-xl p-6 border border-gray-200'>
                <h2 className='text-lg font-bold text-gray-900 mb-4'>
                  Hiring Pipeline
                </h2>
                <div className='space-y-4'>
                  {job.pipelineStages.map((stage) => {
                    const stageApplications =
                      job.applications?.filter(
                        (app) => app.status === stage.name.toUpperCase()
                      ) || [];
                    const count = stageApplications.length;

                    return (
                      <div key={stage.order}>
                        <div className='flex items-center justify-between mb-3'>
                          <span className='text-sm font-medium text-gray-900'>
                            {stage.name} ({count})
                          </span>
                        </div>
                        {stageApplications.length > 0 && (
                          <div className='space-y-2'>
                            {stageApplications.slice(0, 2).map((app) => {
                              const appliedDate = new Date(app.createdAt);
                              const daysAgo = Math.floor(
                                (Date.now() - appliedDate.getTime()) /
                                  (1000 * 60 * 60 * 24)
                              );
                              const timeText =
                                daysAgo === 0
                                  ? 'Applied today'
                                  : daysAgo === 1
                                  ? 'Applied 1 day ago'
                                  : `Applied ${daysAgo} days ago`;

                              return (
                                <div
                                  key={app.id}
                                  className='flex items-center justify-between py-2'
                                >
                                  <div>
                                    <p className='text-sm font-medium text-gray-900'>
                                      Application #{app.id.slice(0, 8)}
                                    </p>
                                    <p className='text-xs text-gray-500'>
                                      {timeText}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )} */}

            {/* Applicants */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Recent Applicants</h2>
                {totalApplicants > 3 && (
                  <Link href={`/admin/jobs/${job.slug}/applicants`} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    View All ({totalApplicants})
                  </Link>
                )}
              </div>
              {recentApplicants.length > 0 ? (
                <div className="space-y-4">
                  {recentApplicants.map((app) => {
                    const appliedDate = new Date(app.createdAt);
                    const daysAgo = Math.floor((Date.now() - appliedDate.getTime()) / (1000 * 60 * 60 * 24));
                    const timeText = daysAgo === 0 ? 'Applied today' : daysAgo === 1 ? 'Applied 1 day ago' : `Applied ${daysAgo} days ago`;

                    return (
                      <div key={app.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {app.id.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Application #{app.id.slice(0, 8)}</p>
                            <p className="text-xs text-gray-500">{timeText}</p>
                          </div>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>{formatStatus(app.status)}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No applicants yet</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
