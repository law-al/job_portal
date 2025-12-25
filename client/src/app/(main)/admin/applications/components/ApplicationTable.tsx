'use client';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Eye, Edit, UserPlus, Mail, Download, Trash2, FileText, CheckCircle, XCircle, Clock, UserCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
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
  status: string;
  assignedTo?: string | null;
  assignedName?: string | null;
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

  const getStatusStyle = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'APPLIED':
        return 'bg-blue-100 text-blue-700';
      case 'SCREENING':
        return 'bg-yellow-100 text-yellow-700';
      case 'SHORTLISTED':
        return 'bg-purple-100 text-purple-700';
      case 'INTERVIEW':
        return 'bg-indigo-100 text-indigo-700';
      case 'OFFER':
        return 'bg-green-100 text-green-700';
      case 'HIRED':
        return 'bg-green-200 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-700';
      case 'WITHDRAWN':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatStatus = (status: string) => {
    return status
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const ApplicationActionsMenu = ({ application }: { application: Application }) => {
    const router = useRouter();

    const handleViewDetails = () => {
      router.push(`/admin/applications/${application.id}`);
    };

    const handleEdit = () => {
      router.push(`/admin/applications/${application.id}/edit`);
    };

    const handleAssign = () => {
      // TODO: Implement assign functionality
      console.log('Assign application:', application.id);
    };

    const handleDownloadResume = () => {
      // TODO: Implement download resume functionality
      console.log('Download resume for:', application.id);
    };

    const handleSendEmail = () => {
      // TODO: Implement send email functionality
      console.log('Send email to:', application.email);
    };

    const handleDelete = () => {
      // TODO: Implement delete functionality
      console.log('Delete application:', application.id);
    };

    const handleChangeStatus = (status: string) => {
      // TODO: Implement change status functionality
      console.log('Change status to:', status, 'for application:', application.id);
    };

    return (
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Application Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleViewDetails}>
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Application
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleAssign}>
          <UserPlus className="mr-2 h-4 w-4" />
          {application.assignedName ? 'Reassign' : 'Assign'}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <CheckCircle className="mr-2 h-4 w-4" />
            Change Status
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => handleChangeStatus('APPLIED')}>
                <Clock className="mr-2 h-4 w-4" />
                Applied
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleChangeStatus('SCREENING')}>
                <FileText className="mr-2 h-4 w-4" />
                Screening
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleChangeStatus('SHORTLISTED')}>
                <UserCheck className="mr-2 h-4 w-4" />
                Shortlisted
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleChangeStatus('INTERVIEW')}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Interview
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleChangeStatus('OFFER')}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Offer
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleChangeStatus('HIRED')}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Hired
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleChangeStatus('REJECTED')} className="text-red-600">
                <XCircle className="mr-2 h-4 w-4" />
                Rejected
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleChangeStatus('WITHDRAWN')} className="text-gray-600">
                <XCircle className="mr-2 h-4 w-4" />
                Withdrawn
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleDownloadResume}>
          <Download className="mr-2 h-4 w-4" />
          Download Resume
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleSendEmail}>
          <Mail className="mr-2 h-4 w-4" />
          Send Email
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleDelete} className="text-red-600">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Application
        </DropdownMenuItem>
      </DropdownMenuContent>
    );
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
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Assigned To</th>
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
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(app.status)}`}>{formatStatus(app.status)}</span>
                  </td>
                  <td className="px-6 py-4">
                    {app.assignedName ? <p className="text-gray-900 font-medium">{app.assignedName}</p> : <span className="text-gray-400 italic">Unassigned</span>}
                  </td>
                  <td className="px-6 py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="p-1 hover:bg-gray-200 rounded transition-colors">
                        <MoreVertical className="w-5 h-5 text-gray-400" />
                      </DropdownMenuTrigger>
                      <ApplicationActionsMenu application={app} />
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
