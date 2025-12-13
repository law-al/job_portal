'use client';

import {
  changeRole,
  suspendUser,
  unSuspendUser,
} from '@/app/actions/company.actions';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Key,
  CheckCircle,
  Edit,
  Mail,
  MoreVertical,
  Shield,
  Pause,
  Trash2,
  User,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';

interface User {
  id: string;
  role: 'HR' | 'RECRUITER' | 'EMPLOYER';
  status: 'ACTIVE' | 'SUSPENDED' | 'REMOVED' | 'BLOCKED';
  createdAt: Date;
  user: {
    email: string;
    id: string;
  };
}

const getStatusColor = (
  status: 'ACTIVE' | 'SUSPENDED' | 'REMOVED' | 'BLOCKED'
) => {
  switch (status) {
    case 'ACTIVE':
      return 'bg-green-100 text-green-700';
    case 'SUSPENDED':
      return 'bg-orange-100 text-orange-700';
    case 'BLOCKED':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const UserActionsMenu = ({ user }: { user: User }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleChangeRole = (memberId: string, role: string) => {
    startTransition(async () => {
      const result = await changeRole(memberId, role);

      if (result?.errors) {
        console.log('error encountered');
        toast.error(result.errors.message ?? 'Could not suspend member');
        return;
      }

      toast('Member has been suspended');
    });
  };

  const handleSuspendMember = (memberId: string) => {
    startTransition(async () => {
      const result = await suspendUser(memberId);

      if (result?.errors) {
        console.log('error encountered');
        toast.error(result.errors.message ?? 'Could not suspend member');
        return;
      }

      toast('Member has been suspended');
    });
  };

  const handleUnsuspendMember = (memberId: string) => {
    startTransition(async () => {
      const result = await unSuspendUser(memberId);

      if (result?.errors) {
        console.log('error encountered');
        toast.error(result.errors.message ?? 'Could not unsuspend member');
        return;
      }

      toast('Member has been unsuspended');
    });
  };

  return (
    <DropdownMenuContent align='end' className='w-48'>
      <DropdownMenuLabel>User Actions</DropdownMenuLabel>
      <DropdownMenuSeparator />

      {user.id && (
        <DropdownMenuItem
          onClick={() => router.push(`/admin/users/${user.user.id}`)}
        >
          <User className='mr-2 h-4 w-4' />
          View Profile
        </DropdownMenuItem>
      )}

      <DropdownMenuItem>
        <Mail className='mr-2 h-4 w-4' />
        Send Email
      </DropdownMenuItem>

      <DropdownMenuItem>
        <Edit className='mr-2 h-4 w-4' />
        Edit User
      </DropdownMenuItem>

      <DropdownMenuSeparator />

      {user.status !== 'SUSPENDED' && (
        <>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Shield className='mr-2 h-4 w-4' />
              Change Role
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem
                  onClick={() => handleChangeRole(user.user.id, 'HR')}
                >
                  HR
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleChangeRole(user.user.id, 'RECRUITER')}
                >
                  Recruiter
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleChangeRole(user.user.id, 'EMPLOYER')}
                >
                  Employer
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuSeparator />
        </>
      )}

      {/* Show suspend/reactivate based on status */}
      {user.status !== 'SUSPENDED' ? (
        <DropdownMenuItem
          onClick={() => handleSuspendMember(user.user.id)}
          className='text-orange-600'
        >
          <Pause className='mr-2 h-4 w-4' />
          Suspend User
        </DropdownMenuItem>
      ) : (
        <DropdownMenuItem
          onClick={() => handleUnsuspendMember(user.user.id)}
          className='text-green-600'
        >
          <CheckCircle className='mr-2 h-4 w-4' />
          Reactivate User
        </DropdownMenuItem>
      )}

      <DropdownMenuItem className='text-red-600'>
        <Trash2 className='mr-2 h-4 w-4' />
        Delete User
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
};

export default function UserTableBody({ users }: { users: User[] }) {
  console.log({ users });

  return (
    <tbody className='bg-white divide-y divide-gray-200'>
      {users.length > 0 &&
        users.map((data, index) => (
          <tr key={index} className='hover:bg-gray-50 transition-colors'>
            <td className='px-6 py-4 whitespace-nowrap'>
              <div>
                <p className='text-sm text-gray-500'>{data.user.email}</p>
              </div>
            </td>
            <td className='px-6 py-4 whitespace-nowrap'>
              <span className='text-sm text-gray-700'>{data.role}</span>
            </td>
            <td className='px-6 py-4 whitespace-nowrap'>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  data.status
                )}`}
              >
                {data.status}
              </span>
            </td>
            <td className='px-6 py-4 whitespace-nowrap'>
              <span className='text-sm text-gray-700'>
                {new Date(data.createdAt).toLocaleDateString()}
              </span>
            </td>
            <td className='px-6 py-4 whitespace-nowrap'>
              <DropdownMenu>
                <DropdownMenuTrigger className='text-gray-400 hover:text-gray-600 cursor-pointer ml-5'>
                  <MoreVertical size={20} />
                </DropdownMenuTrigger>
                <UserActionsMenu user={data} />
              </DropdownMenu>
            </td>
          </tr>
        ))}
    </tbody>
  );
}
