import { authOptions } from '@/auth';
import { fetchWithRetry } from '@/lib/fetchWithRetry';
import { ChevronRight, User } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { UserActions } from '../components/UserActions';

interface UserResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    role: 'HR' | 'RECRUITER' | 'EMPLOYER';
    status: 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'REJECTED' | 'CANCELLED';
    createdAt: string;
    user: {
      id: string;
      email: string;
      isActive: boolean;
    };
  };
}

export default async function UserProfileDetail({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  const session = await getServerSession(authOptions);

  if (!session?.user?.companyId || !session?.user?.accessToken) {
    return {
      errors: 'Unauthorized. Please log in again.',
    };
  }

  const companyId = session.user.companyId;
  const accessToken = session.user.accessToken;
  const refreshTokenHash = session.user.refreshTokenHash;

  const response = await fetchWithRetry({
    url: `company/${companyId}/members/${userId}`,
    options: {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    },
    refreshTokenHash,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || response.statusText || 'Failed to fetch user'
    );
  }

  const { data: member } = (await response.json()) as UserResponse;

  const tabs = [
    { label: 'Profile', active: true },
    { label: 'Resume', active: false },
    { label: 'Associated Companies', active: false },
    { label: 'Job Applications', active: false },
    { label: 'Login History', active: false },
  ];

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-500';
      case 'PENDING':
        return 'bg-yellow-500';
      case 'SUSPENDED':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Get status text
  const getStatusText = (status: string) => {
    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  return (
    <>
      {/* Breadcrumb */}
      <div className='bg-white border-b border-gray-200 px-8 py-4'>
        <div className='flex items-center gap-2 text-sm text-gray-500'>
          <span className='hover:text-gray-700 cursor-pointer'>Dashboard</span>
          <ChevronRight size={16} />
          <span className='hover:text-gray-700 cursor-pointer'>
            Users Management
          </span>
          <ChevronRight size={16} />
          <span className='text-gray-900 font-medium'>{member.user.email}</span>
        </div>
      </div>

      {/* Main Content Area */}
      <main className='flex-1 overflow-y-auto p-8'>
        {/* Profile Header */}
        <div className='bg-white rounded-xl border border-gray-200 p-8 mb-6'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-6'>
              {/* Avatar Placeholder */}
              <div className='w-24 h-24 bg-linear-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center'>
                <User className='w-12 h-12 text-white' />
              </div>

              {/* User Info */}
              <div>
                <h1 className='text-3xl font-bold text-gray-900 mb-1'>
                  {member.user.email.split('@')[0] || '__'}
                </h1>
                <p className='text-gray-600 mb-2 capitalize'>
                  {member.role.toLowerCase()}
                </p>
                <div className='flex items-center gap-2'>
                  <div
                    className={`w-2 h-2 ${getStatusColor(
                      member.status
                    )} rounded-full`}
                  ></div>
                  <span className='text-sm text-gray-700'>
                    Status: {getStatusText(member.status)}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <UserActions userId={member.user.id} status={member.status} />
          </div>
        </div>

        {/* Tabs */}
        <div className='bg-white rounded-xl border border-gray-200 mb-6'>
          <div className='border-b border-gray-200'>
            <div className='flex gap-8 px-8'>
              {tabs.map((tab) => (
                <button
                  key={tab.label}
                  className={`py-4 text-sm font-medium transition-colors relative ${
                    tab.active
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                  {tab.active && (
                    <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600'></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Profile Content */}
          <div className='p-8'>
            <div className='grid grid-cols-3 gap-8'>
              {/* Row 1 */}
              <div>
                <p className='text-sm text-gray-500 mb-1'>Full Name</p>
                <p className='text-gray-900 font-medium'>__</p>
              </div>
              <div>
                <p className='text-sm text-gray-500 mb-1'>Email</p>
                <p className='text-gray-900 font-medium'>{member.user.email}</p>
              </div>
              <div>
                <p className='text-sm text-gray-500 mb-1'>Phone</p>
                <p className='text-gray-900 font-medium'>__</p>
              </div>

              {/* Row 2 */}
              <div>
                <p className='text-sm text-gray-500 mb-1'>Location</p>
                <p className='text-gray-900 font-medium'>__</p>
              </div>
              <div>
                <p className='text-sm text-gray-500 mb-1'>Member Since</p>
                <p className='text-gray-900 font-medium'>
                  {formatDate(member.createdAt)}
                </p>
              </div>
              <div>
                <p className='text-sm text-gray-500 mb-1'>Last Login</p>
                <p className='text-gray-900 font-medium'>__</p>
              </div>

              {/* Row 3 */}
              <div>
                <p className='text-sm text-gray-500 mb-1'>User ID</p>
                <p className='text-gray-900 font-medium text-xs break-all'>
                  {member.user.id}
                </p>
              </div>
              <div>
                <p className='text-sm text-gray-500 mb-1'>Member ID</p>
                <p className='text-gray-900 font-medium text-xs break-all'>
                  {member.id}
                </p>
              </div>
              <div>
                <p className='text-sm text-gray-500 mb-1'>Account Status</p>
                <p className='text-gray-900 font-medium'>
                  {member.user.isActive ? 'Active' : 'Inactive'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
