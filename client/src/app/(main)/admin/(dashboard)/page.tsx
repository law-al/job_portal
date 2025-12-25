import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Bell } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { fetchWithRetry } from '@/lib/fetchWithRetry';

interface ResponseData {
  id: string;
  role: string;
  userId: string;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
  company: CompanyData;
}

export interface CompanyData {
  id: string;
  name: string;
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  const stats = [
    {
      title: 'Total Users',
      value: '1,234',
      change: '+5.2% from last month',
      positive: true,
    },
    {
      title: 'Active Jobs',
      value: '56',
      change: '-1.8% from last month',
      positive: false,
    },
    {
      title: 'New Applications',
      value: '102',
      change: '+12% from last month',
      positive: true,
    },
  ];

  const latestApplications = [
    { name: 'Sarah Lee', position: 'UI/UX Designer', avatar: 'SL' },
    { name: 'Mike Ross', position: 'Backend Developer', avatar: 'MR' },
    { name: 'Jessica Pearson', position: 'Product Manager', avatar: 'JP' },
  ];

  return (
    <>
      {/* Main Content */}

      {/* Header */}
      <header className='bg-white border-b border-gray-200 px-8 py-4 '>
        <div className='flex items-center justify-between'>
          {/* Search */}
          <div className='flex-1 max-w-2xl'>
            <div className='relative'>
              <Search
                className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
                size={20}
              />
              <input
                type='text'
                placeholder='Search companies, users, jobs...'
                className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none'
              />
            </div>
          </div>

          {/* Right Section */}
          <div className='flex items-center gap-4 ml-6'>
            <button className='relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg'>
              <Bell size={20} />
              <span className='absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full'></span>
            </button>

            <div className='flex items-center gap-3 pl-4 border-l border-gray-200'>
              <Avatar>
                <AvatarImage src='https://github.com/shadcn.png' />
                <AvatarFallback>ATN</AvatarFallback>
              </Avatar>
              <div>
                <p className='text-sm font-semibold text-gray-900'>
                  {session?.user.name}
                </p>
                <p className='text-xs text-gray-500'>{session?.user.role}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className='flex-1 p-8 overflow-y-auto'>
        {/* Breadcrumb */}
        <div className='mb-6'>
          <p className='text-sm text-gray-500 mb-2'>Dashboard</p>
          <h2 className='text-3xl font-bold text-gray-900'>
            Dashboard Overview
          </h2>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
          {stats.map((stat) => (
            <div
              key={stat.title}
              className='bg-white rounded-xl p-6 border border-gray-200'
            >
              <p className='text-sm text-gray-600 mb-2'>{stat.title}</p>
              <p className='text-3xl font-bold text-gray-900 mb-2'>
                {stat.value}
              </p>
              <p
                className={`text-sm ${
                  stat.positive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {stat.change}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Chart Section */}
          <div className='lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200'>
            <div className='mb-6'>
              <h3 className='text-lg font-bold text-gray-900 mb-1'>
                User Signups Over Time
              </h3>
              <p className='text-sm text-gray-500'>
                Monthly new user registrations
              </p>
            </div>

            <div className='h-80 flex items-center justify-center bg-gray-50 rounded-lg'>
              <p className='text-gray-400'>Chart Placeholder</p>
            </div>
          </div>

          {/* Latest Applications */}
          <div className='bg-white rounded-xl p-6 border border-gray-200'>
            <h3 className='text-lg font-bold text-gray-900 mb-4'>
              Latest Applications
            </h3>

            <div className='space-y-4'>
              {latestApplications.map((app) => (
                <div key={app.name} className='flex items-center gap-3'>
                  <div className='w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold'>
                    {app.avatar}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-semibold text-gray-900'>
                      {app.name}
                    </p>
                    <p className='text-sm text-gray-500'>
                      Applied for {app.position}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
