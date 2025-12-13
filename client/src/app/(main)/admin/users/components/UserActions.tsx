'use client';

import { suspendUser, unSuspendUser } from '@/app/actions/company.actions';
import React, { useTransition } from 'react';
import { toast } from 'sonner';

export function UserActions({
  userId,
  status,
}: {
  userId: string;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'REJECTED' | 'CANCELLED';
}) {
  const [isPending, startTransition] = useTransition();

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
    <div className='flex gap-3'>
      {status === 'SUSPENDED' ? (
        <button
          onClick={() => {
            handleUnsuspendMember(userId);
          }}
          className={`px-6 py-2.5 font-medium rounded-lg transition-colors
       bg-green-600 hover:bg-green-700 text-white`}
        >
          Activate User
        </button>
      ) : (
        <button
          onClick={() => {
            handleSuspendMember(userId);
          }}
          className={`px-6 py-2.5 font-medium rounded-lg transition-colors bg-red-600 hover:bg-red-700 text-white`}
        >
          Suspend User
        </button>
      )}
      <button className='px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors'>
        Message
      </button>
    </div>
  );
}
