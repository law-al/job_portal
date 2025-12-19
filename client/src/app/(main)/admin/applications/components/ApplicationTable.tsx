'use client';
import { MoreVertical } from 'lucide-react';
import React, { useState } from 'react';

interface Application {
  id: string;
  avatar: string;
  name: string;
  email: string;
  jobTitle: string;
  company: string;
  appliedDate: string;
  stage: string;
  stageColor: string;
}

export default function ApplicationTable({ applications }: { applications: Application[] }) {
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);

  const toggleSelection = (id: string) => {
    setSelectedApplications((prev) => (prev.includes(id) ? prev.filter((appId) => appId !== id) : [...prev, id]));
  };

  const toggleSelectAll = () => {
    if (selectedApplications.length === applications.length) {
      setSelectedApplications([]);
    } else {
      setSelectedApplications(applications.map((app) => app.id));
    }
  };

  const getStageStyle = (stage: string) => {
    switch (stage) {
      case 'Interview':
        return 'bg-blue-100 text-blue-700';
      case 'Hired':
        return 'bg-green-100 text-green-700';
      case 'Rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div>
      {' '}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="w-12 px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedApplications.length === applications.length}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Candidate</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Job Title</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Company</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Applied Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Stage</th>
                <th className="w-12 px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedApplications.includes(app.id)}
                      onChange={() => toggleSelection(app.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-lg shrink-0">{app.avatar}</div>
                      <div>
                        <p className="font-semibold text-gray-900">{app.name}</p>
                        <p className="text-sm text-gray-500">{app.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-900">{app.jobTitle}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-700">{app.company}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-700">{app.appliedDate}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStageStyle(app.stageColor)}`}>{app.stage}</span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                      <MoreVertical className="w-5 h-5 text-gray-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold">1</span> to <span className="font-semibold">5</span> of <span className="font-semibold">1,240</span> entries
          </p>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">Previous</button>
            <button className="w-10 h-10 bg-blue-600 text-white rounded-lg font-medium">1</button>
            <button className="w-10 h-10 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">2</button>
            <button className="w-10 h-10 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">3</button>
            <span className="px-2 text-gray-500">...</span>
            <button className="w-10 h-10 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">12</button>
            <button className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
