import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import UserFilter from './components/UserFilter';
import TableHeader from '@/components/TableHeader';
import UserTableBody from './components/UserTableBody';
import AddUser from './components/AddUser';
import { fetchWithRetry } from '@/lib/fetchWithRetry';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';

export interface UserResponse {
  success: boolean;
  message: string;
  data: Array<{
    id: string;
    role: 'HR' | 'RECRUITER' | 'EMPLOYER';
    status: 'ACTIVE' | 'SUSPENDED' | 'REMOVED' | 'BLOCKED';
    createdAt: Date;
    user: {
      email: string;
      id: string;
      firstName: string;
      lastName: string;
    };
  }>;
}

export default async function UsersManagement() {
  const session = await getServerSession(authOptions);

  console.log(session);

  if (session?.user.error) {
    throw new Error('unauthorized');
  }

  const response = await fetchWithRetry({
    url: `company/${session?.user.companyId}/members`,
    options: {
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${session?.user.accessToken}`,
      },
    },
    refreshTokenHash: session?.user.refreshTokenHash,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.message || 'Error getting verification status');
  }

  const { data: users } = (await response.json()) as UserResponse;

  const tableHeaders = ['name', 'role', 'status', 'created at', 'actions'];

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-1">Users Management</h2>
            <p className="text-gray-500">Manage, verify, and suspend users across the platform.</p>
          </div>
          {users && users.length > 0 ? <AddUser /> : null}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8">
        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 mb-6">
          {/* Table or Empty State */}
          {!users || users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Plus size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
              <p className="text-sm text-gray-500 text-center max-w-md mb-6">There are no users in your company yet. Start by inviting team members to join your organization.</p>
              <AddUser />
            </div>
          ) : (
            <>
              {/* Table */}
              <UserFilter />
              <div className="overflow-x-auto">
                <table className="w-full">
                  <TableHeader headers={tableHeaders} />
                  <UserTableBody users={users} />
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of <span className="font-medium">150</span> users
                </p>
                <div className="flex gap-2">
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <ChevronLeft size={20} className="text-gray-600" />
                  </button>
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <ChevronRight size={20} className="text-gray-600" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
