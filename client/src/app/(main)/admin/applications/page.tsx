import { Building2, Search, Calendar, Download, ChevronDown, Bell } from 'lucide-react';
import Card from '../../../../components/Card';
import ApplicationTable from './components/ApplicationTable';
import { fetchWithRetry } from '@/lib/fetchWithRetry';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { getInitials } from '@/lib/utils';
import Pagination from '@/components/Pagination';
import AppBreadCrumb from '@/components/AppBreadCrumb';

interface ApplicationResponse {
  success: boolean;
  data: {
    applications: Array<{
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      status: string;
      createdAt: string;
      job: {
        id: string;
        title: string;
        slug: string;
      };
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
    }>;
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

interface TransformedApplication {
  id: string;
  avatar: string;
  name: string;
  email: string;
  jobTitle: string;
  company: string;
  appliedDate: string;
  stage: string;
  stageColor: string;
  status: string;
  assignedTo?: string | null;
  assignedName?: string | null;
}

export default async function AdminApplicationsManagement() {
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

  let applications: TransformedApplication[] = [];
  let stats = [
    { label: 'Total Applications', value: '0', change: '0%', positive: false, neutral: true },
    { label: 'Pending Review', value: '0', change: '0%', positive: false, neutral: true },
    { label: 'Interview Stage', value: '0', change: '0%', positive: false, neutral: true },
    { label: 'Hired', value: '0', change: '0%', positive: false, neutral: true },
  ];
  let pagination = {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  };

  try {
    const response = await fetchWithRetry({
      url: `application/${session.user.companyId}/fetch`,
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
      const applicationsData = data.data?.applications || [];
      pagination = data.data?.pagination || pagination;

      // Transform the applications data to match the expected format
      applications = applicationsData.map((app) => {
        const firstName = app.firstName || '';
        const lastName = app.lastName || '';
        const fullName = `${firstName} ${lastName}`.trim() || 'Unknown';
        const initials = getInitials({
          firstName: app.firstName,
          lastName: app.lastName,
          email: app.email,
          default: '??',
        });

        // Get stage name or default
        const stageName = app.pipelineStage?.name || 'Applied';
        const stageColor = getStageColor(stageName);

        // Get assigned user email or null
        const assignedEmail = app.assigned?.user?.email || null;

        return {
          id: app.id,
          avatar: initials,
          name: fullName,
          email: app.email,
          jobTitle: app.job?.title || 'Unknown Job',
          company: 'Your Company', // Company name could be included in the API response
          appliedDate: new Date(app.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
          stage: stageName,
          stageColor,
          status: app.status,
          assignedTo: app.assigned?.id || null,
          assignedName: assignedEmail,
        };
      });

      // Calculate stats
      const total = pagination.total;
      const pending = applications.filter((app) => app.status === 'APPLIED').length;
      const interviewing = applications.filter((app) => app.status === 'INTERVIEW').length;
      const hired = applications.filter((app) => app.status === 'HIRED').length;

      stats = [
        { label: 'Total Applications', value: total.toString(), change: '0%', positive: false, neutral: true },
        { label: 'Pending Review', value: pending.toString(), change: '0%', positive: false, neutral: true },
        { label: 'Interview Stage', value: interviewing.toString(), change: '0%', positive: false, neutral: true },
        { label: 'Hired', value: hired.toString(), change: '0%', positive: false, neutral: true },
      ];
    }
  } catch (error) {
    console.error('Error fetching applications:', error);
  }

  function getStageColor(stage: string): string {
    switch (stage.toLowerCase()) {
      case 'interview':
        return 'blue';
      case 'hired':
        return 'green';
      case 'rejected':
        return 'red';
      case 'screening':
        return 'gray';
      case 'shortlisted':
        return 'purple';
      default:
        return 'gray';
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <AppBreadCrumb items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Applications Management' }]} homeHref="/admin" />
            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="text-gray-700 hover:text-gray-900 font-medium">Help</button>
            </div>
          </div>
        </header>

        <div className="p-8">
          {/* Page Title */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Applications Management</h1>
              <p className="text-gray-600">Manage and track all candidate applications efficiently.</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, idx) => (
              <Card key={idx} stat={stat} />
            ))}
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, role or email..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Calendar className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700">Oct 1 - Oct 31, 2023</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Building2 className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700">All Companies</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <span className="text-gray-700">All Stages</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>

            <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>

          {/* Applications Table */}
          {applications.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No applications found</h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                You haven&apos;t received any applications yet. Applications will appear here once candidates start applying to your job postings.
              </p>
            </div>
          ) : (
            <>
              <ApplicationTable applications={applications} />
              {/* Pagination */}
              <div className="px-6 py-4 border-t border-gray-200 mt-4">
                <Pagination pagination={pagination} basePath="/admin/applications" itemName="applications" />
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
