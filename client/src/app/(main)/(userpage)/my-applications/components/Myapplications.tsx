'use client';

import React, { useState } from 'react';
import { Search, ChevronDown, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import Tabs from './Tabs';

const JobApplicationsPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('Last Updated');

  const applications = [
    {
      id: 1,
      role: 'Product Designer',
      company: 'Stripe',
      logo: '💳',
      appliedDate: 'Oct 12',
      status: 'Interviewing',
      statusColor: 'purple',
    },
    {
      id: 2,
      role: 'Frontend Developer',
      company: 'Airbnb',
      logo: '🏠',
      appliedDate: 'Oct 10',
      status: 'Application Sent',
      statusColor: 'blue',
    },
    {
      id: 3,
      role: 'UX Researcher',
      company: 'Spotify',
      logo: 'S',
      logoColor: 'bg-green-500',
      appliedDate: 'Sep 28',
      status: 'Offer Received',
      statusColor: 'green',
    },
    {
      id: 4,
      role: 'Marketing Lead',
      company: 'Meta',
      logo: 'M',
      logoColor: 'bg-gray-200',
      appliedDate: 'Sep 15',
      status: 'Not Selected',
      statusColor: 'gray',
    },
    {
      id: 5,
      role: 'Senior Engineer',
      company: 'Netflix',
      logo: 'N',
      logoColor: 'bg-red-100',
      appliedDate: 'Sep 10',
      status: 'In Review',
      statusColor: 'orange',
    },
  ];

  const getStatusStyles = (color: 'purple' | 'blue' | 'green' | 'gray' | 'orange') => {
    const styles = {
      purple: 'bg-purple-50 text-purple-700',
      blue: 'bg-blue-50 text-blue-600',
      green: 'bg-green-50 text-green-700',
      gray: 'bg-gray-100 text-gray-600',
      orange: 'bg-orange-50 text-orange-700',
    };
    return styles[color] || styles.gray;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Applications</h1>
          <p className="text-gray-600">Track and manage your job search progress.</p>
        </div>

        {/* Tabs */}
        <Tabs />

        {/* Search and Sort */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by company or role..."
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors">
            <span className="text-sm text-gray-600">Sort by:</span>
            <span className="font-medium text-gray-900">{sortBy}</span>
            <ChevronDown className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Applications List */}
        <div className="space-y-4 mb-6">
          {applications.map((app) => (
            <div key={app.id} className="bg-white rounded-lg p-6 flex items-center justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 flex-1">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl ${app.logoColor || 'bg-gray-100'}`}>{app.logo}</div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">{app.role}</h3>
                  <p className="text-gray-600">{app.company}</p>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Applied {app.appliedDate}</span>
                </div>

                <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusStyles(app.statusColor as 'purple' | 'blue' | 'green' | 'gray' | 'orange')}`}>
                  {app.status}
                </span>

                <button className="px-6 py-2 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors">View Details</button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of <span className="font-medium">24</span> applications
          </p>

          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium">1</button>
            <button className="px-4 py-2 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-colors">2</button>
            <button className="px-4 py-2 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-colors">3</button>
            <span className="px-2 text-gray-600">...</span>
            <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobApplicationsPage;
