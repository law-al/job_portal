import { LayoutGrid, FileText, Briefcase, Users, Building2, Settings, LogOut, Search, Calendar, Download, ChevronDown, MoreVertical, Plus, Bell, ChevronRight } from 'lucide-react';
import Card from './components/Card';
import ApplicationTable from './components/ApplicationTable';

export default function AdminApplicationsManagement() {
  const stats = [
    { label: 'Total Applications', value: '1,240', change: '+12%', positive: true, neutral: false },
    { label: 'Pending Review', value: '45', change: '+5%', positive: true, neutral: false },
    { label: 'Interview Stage', value: '12', change: '0%', positive: false, neutral: true },
    { label: 'Hired', value: '8', change: '+2%', positive: true, neutral: false },
  ];

  const applications = [
    {
      id: '1',
      name: 'Sarah Smith',
      email: 'sarah.smith@example.com',
      avatar: '👩',
      jobTitle: 'Senior UX Designer',
      company: 'TechFlow Inc.',
      appliedDate: 'Oct 24, 2023',
      stage: 'Interview',
      stageColor: 'blue',
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'm.chen@example.com',
      avatar: '👨',
      jobTitle: 'Product Manager',
      company: 'Innovate Co.',
      appliedDate: 'Oct 23, 2023',
      stage: 'Hired',
      stageColor: 'green',
    },
    {
      id: '3',
      name: 'James Davis',
      email: 'james.d@example.com',
      avatar: 'JD',
      jobTitle: 'Frontend Developer',
      company: 'TechFlow Inc.',
      appliedDate: 'Oct 22, 2023',
      stage: 'Screening',
      stageColor: 'gray',
    },
    {
      id: '4',
      name: 'Emily Wilson',
      email: 'emily.w@example.com',
      avatar: '👩',
      jobTitle: 'Marketing Lead',
      company: 'Growth Corp',
      appliedDate: 'Oct 20, 2023',
      stage: 'Assessment',
      stageColor: 'purple',
    },
    {
      id: '5',
      name: 'David Kim',
      email: 'd.kim@example.com',
      avatar: '👨',
      jobTitle: 'Data Analyst',
      company: 'DataSys',
      appliedDate: 'Oct 19, 2023',
      stage: 'Rejected',
      stageColor: 'red',
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Dashboard</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 font-medium">Applications Management</span>
            </div>
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
          <ApplicationTable applications={applications} />
        </div>
      </main>
    </div>
  );
}
