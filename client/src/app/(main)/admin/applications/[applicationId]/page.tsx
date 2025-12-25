import React from 'react';
import { ChevronRight, Mail, Calendar, MoreHorizontal, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import ContactsInfo from './components/ContactsInfo';
import { fetchWithRetry } from '@/lib/fetchWithRetry';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { notFound } from 'next/navigation';
import ApplicationAction from './components/ApplicationAction';
import ResumePreviewClient from './components/ResumePreviewClient';
import AIApplicationReview from './components/AIApplicationReview';
import { formatDistanceToNowStrict } from 'date-fns';
import TeamNotesWrapper from './components/notes/TeamNotesWrapper';
import ActivityTimeLineWrapper from './components/ActivityTimeLineWrapper';

interface ApplicationDetailPageProps {
  params: Promise<{ applicationId: string }>;
}

interface ApplicationResponse {
  success: boolean;
  data: {
    application: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      currentLocation: string;
      linkedin: string | null;
      portfolioUrl: string | null;
      coverLetter: string | null;
      expectedSalary: number | null;
      status: string;
      createdAt: string;
      job: {
        id: string;
        title: string;
        slug: string;
        description: string;
        location: string;
        jobType: string;
        experienceLevel: string;
        salary_range: string | null;
        isRemote: boolean;
        createdAt: string;
        pipelineStages: Array<{
          id: string;
          name: string;
          order: number;
        }>;
      };
      resume: {
        url: string;
        originalName: string;
        size: string;
      } | null;
      pipelineStage: {
        id: string;
        name: string;
        order: number;
      } | null;
      assigned: {
        id: string;
        user: {
          id: string;
          email: string;
        };
      } | null;
      company: {
        id: string;
        name: string;
        logo: string | null;
      };
    };
  };
}

export default async function CandidateApplicationPage({ params }: ApplicationDetailPageProps) {
  const { applicationId } = await params;
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.companyId) {
    return (
      <div className="p-8">
        <p className="text-red-600">Company ID not found. Please ensure you are associated with a company.</p>
      </div>
    );
  }

  let application: ApplicationResponse['data']['application'] | null = null;

  try {
    const response = await fetchWithRetry({
      url: `application/${session.user.companyId}/fetch/${applicationId}`,
      options: {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${(session.user as { accessToken?: string }).accessToken ?? ''}`,
        },
      },
      refreshTokenHash: (session.user as { refreshTokenHash?: string }).refreshTokenHash,
    });

    if (response.ok) {
      const data = (await response.json()) as ApplicationResponse;
      console.log(data.data.application.resume?.originalName);
      application = data.data?.application || null;
    }
  } catch (error) {
    console.error('Error fetching application:', error);
  }

  if (!application) {
    notFound();
  }

  // Format data for display
  const fullName = `${application.firstName} ${application.lastName}`.trim();
  const initials = `${application.firstName.charAt(0)}${application.lastName.charAt(0)}`.toUpperCase();
  const appliedDate = formatDistanceToNowStrict(new Date(application.createdAt), { addSuffix: true });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="px-6 py-4 bg-white border-b border-gray-200">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Link href="/admin/applications">Application Management</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900">Application Details</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6 h-[calc(100vh-100px)] overflow-y-auto">
        {/* Header */}
        <div className="bg-white rounded-lg p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-linear-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white text-xl font-semibold">{initials}</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{fullName}</h1>
                <p className="text-gray-600">
                  Applied for <span className="font-medium">{application.job.title}</span> • {appliedDate}
                </p>
              </div>
            </div>
            <ApplicationAction
              status={application.status}
              applicationId={application.id}
              currentStage={application.pipelineStage}
              pipelineStages={application.job.pipelineStages}
              currentAssignedUser={application.assigned?.user || null}
              userEmail={session.user?.email || null}
            />
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-900">{application.job.experienceLevel}</div>
              <div className="text-sm text-gray-600 mt-1">EXPERIENCE</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-900 truncate">{application.currentLocation}</div>
              <div className="text-sm text-gray-600 mt-1">LOCATION</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">{application.job.isRemote ? 'Yes' : 'No'}</div>
              <div className="text-sm text-gray-600 mt-1">REMOTE</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-900">{application.expectedSalary ? `$${application.expectedSalary.toLocaleString()}` : 'N/A'}</div>
              <div className="text-sm text-gray-600 mt-1">EXP. SALARY</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 h-full ">
          {/* Left Column */}
          <div className="col-span-2 space-y-6 ">
            {/* AI Application Review */}
            <AIApplicationReview applicationId={application.id} resumeUrl={application.resume?.url || null} />

            {/* Contact Information */}
            <ContactsInfo email={application.email} phone={application.phone} linkedin={application.linkedin || ''} portfolio={application.portfolioUrl || ''} />

            {/* Resume Preview */}
            <ResumePreviewClient resume={application.resume} />

            {/* Screening Questions */}
            {/* <div className="bg-white rounded-lg p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Screening Questions</h2>

              <div className="space-y-6">
                <div>
                  <p className="text-gray-700 font-medium mb-2">Why do you want to work at this company?</p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {`"I've been following your product updates for the last two years and I am incredibly impressed by the speed of innovation. Specifically, the new collaboration
                    features align perfectly with my interest in building social productivity tools."`}
                  </p>
                </div>

                <div>
                  <p className="text-gray-700 font-medium mb-2">Describe a challenging design problem you solved recently.</p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {`"At my current role, we had a high drop-off rate during onboarding. I conducted 15 user interviews and identified that the 'Account Setup' step was too
                    aggressive. By splitting the form into 3 smaller steps and adding progress indicators, we reduced drop-off by 12%."`}
                  </p>
                </div>
              </div>
            </div> */}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Current Stage */}
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">Current Stage</h3>
              <button className="w-full flex items-center justify-between px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 font-medium">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  {application.pipelineStage?.name || 'Applied'}
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-3 gap-2 mt-4">
                <button className="flex flex-col items-center gap-2 p-3 hover:bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-600" />
                  <span className="text-xs text-gray-600">Email</span>
                </button>
                <button className="flex flex-col items-center gap-2 p-3 hover:bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <span className="text-xs text-gray-600">Schedule</span>
                </button>
                <button className="flex flex-col items-center gap-2 p-3 hover:bg-gray-50 rounded-lg">
                  <MoreHorizontal className="w-5 h-5 text-gray-600" />
                  <span className="text-xs text-gray-600">More</span>
                </button>
              </div>
            </div>

            {/* Team Notes */}
            <TeamNotesWrapper applicationId={applicationId} />

            {/* Activity Timeline */}
            <ActivityTimeLineWrapper applicationId={applicationId} />
          </div>
        </div>
      </div>
    </div>
  );
}
