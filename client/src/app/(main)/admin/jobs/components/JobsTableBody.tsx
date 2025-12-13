'use client';

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  BarChart,
  Copy,
  Edit,
  Eye,
  MoreVertical,
  PauseCircle,
  PlayCircle,
  Trash2,
  Users,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { closeJobAction, openJobAction } from '@/app/actions/job.actions';
import { toast } from 'sonner';

interface Job {
  id: string;
  slug?: string;
  title: string;
  postedBy: string;
  status: string;
  applicants: number;
  postedOn: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Open':
      return 'bg-green-100 text-green-700';
    case 'Closed':
      return 'bg-gray-100 text-gray-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const JobActionsMenu = ({ job }: { job: Job }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleCloseJob = () => {
    if (!job.slug) {
      toast.error('Job slug is required');
      return;
    }

    startTransition(async () => {
      const result = await closeJobAction(job.slug!);
      if (result.errors) {
        toast.error(
          typeof result.errors === 'string'
            ? result.errors
            : 'Failed to close job'
        );
      } else {
        toast.success(result.message || 'Job closed successfully');
      }
    });
  };

  const handleOpenJob = () => {
    if (!job.slug) {
      toast.error('Job slug is required');
      return;
    }

    startTransition(async () => {
      const result = await openJobAction(job.slug!);
      if (result.errors) {
        toast.error(
          typeof result.errors === 'string'
            ? result.errors
            : 'Failed to open job'
        );
      } else {
        toast.success(result.message || 'Job opened successfully');
      }
    });
  };

  return (
    <DropdownMenuContent align='end' className='w-48'>
      <DropdownMenuLabel>Job Actions</DropdownMenuLabel>
      <DropdownMenuSeparator />

      <DropdownMenuItem
        onClick={() => router.push(`/admin/jobs/${job.slug || job.id}`)}
      >
        <Eye className='mr-2 h-4 w-4' />
        View Details
      </DropdownMenuItem>

      <DropdownMenuItem
        onClick={() => router.push(`/admin/jobs/${job.slug || job.id}/edit`)}
      >
        <Edit className='mr-2 h-4 w-4' />
        Edit Job
      </DropdownMenuItem>

      <DropdownMenuItem
        onClick={() =>
          navigator.clipboard.writeText(
            `${window.location.origin}/jobs/${job.slug || job.id}`
          )
        }
      >
        <Copy className='mr-2 h-4 w-4' />
        Copy Job Link
      </DropdownMenuItem>

      <DropdownMenuSeparator />

      <DropdownMenuItem
        onClick={() =>
          router.push(`/admin/jobs/${job.slug || job.id}/applicants`)
        }
      >
        <Users className='mr-2 h-4 w-4' />
        View Applicants
      </DropdownMenuItem>

      <DropdownMenuItem
        onClick={() =>
          router.push(`/admin/jobs/${job.slug || job.id}/analytics`)
        }
      >
        <BarChart className='mr-2 h-4 w-4' />
        View Analytics
      </DropdownMenuItem>

      <DropdownMenuSeparator />

      {/* Show close/reopen based on status */}
      {job.status === 'Open' ? (
        <DropdownMenuItem
          className='text-orange-600'
          onClick={handleCloseJob}
          disabled={isPending}
        >
          <PauseCircle className='mr-2 h-4 w-4' />
          {isPending ? 'Closing...' : 'Close Job'}
        </DropdownMenuItem>
      ) : (
        <DropdownMenuItem
          className='text-green-600'
          onClick={handleOpenJob}
          disabled={isPending}
        >
          <PlayCircle className='mr-2 h-4 w-4' />
          {isPending ? 'Opening...' : 'Reopen Job'}
        </DropdownMenuItem>
      )}

      <DropdownMenuItem className='text-red-600'>
        <Trash2 className='mr-2 h-4 w-4' />
        Delete Job
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
};

export default function JobsTableBody({ jobs }: { jobs: Job[] }) {
  return (
    <tbody className='bg-white divide-y divide-gray-200'>
      {jobs.map((job, index) => (
        <tr key={index} className='hover:bg-gray-50 transition-colors'>
          <td className='px-6 py-4 whitespace-nowrap'>
            <span className='text-sm font-medium text-gray-900'>
              {job.title}
            </span>
          </td>
          <td className='px-6 py-4 whitespace-nowrap'>
            <span className='text-sm text-gray-700'>{job.postedBy}</span>
          </td>
          <td className='px-6 py-4 whitespace-nowrap'>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                job.status
              )}`}
            >
              {job.status}
            </span>
          </td>
          <td className='px-6 py-4 whitespace-nowrap'>
            <span className='text-sm text-gray-700'>{job.applicants}</span>
          </td>
          <td className='px-6 py-4 whitespace-nowrap'>
            <span className='text-sm text-gray-700'>{job.postedOn}</span>
          </td>
          <td className='px-6 py-4 whitespace-nowrap'>
            <DropdownMenu>
              <DropdownMenuTrigger className='text-gray-400 hover:text-gray-600 cursor-pointer ml-5'>
                <MoreVertical size={20} />
              </DropdownMenuTrigger>
              <JobActionsMenu job={job} />
            </DropdownMenu>
          </td>
        </tr>
      ))}
    </tbody>
  );
}
