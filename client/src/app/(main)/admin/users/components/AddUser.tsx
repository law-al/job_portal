'use client';

import { addUser } from '@/app/actions/company.actions';
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from '@/components/ui/dialog';
import { CheckCircle, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useActionState } from 'react';

const initialState = {
  errors: undefined,
  success: undefined,
  message: undefined,
};

const AddUserContent = () => {
  const [state, formAction, isPending] = useActionState(addUser, initialState);

  return (
    <DialogContent className='sm:max-w-md'>
      <DialogHeader>
        <DialogTitle>Add New User</DialogTitle>

        <DialogDescription>
          {`Enter the user's email address and role to send them an invitation to join the platform.`}
        </DialogDescription>
      </DialogHeader>

      {state.errors && !state?.errors?.email && !state.errors?.role && (
        <p className='italic text-center text-sm text-red-600'>
          {state.errors}
        </p>
      )}

      <form action={formAction}>
        <div className='space-y-4 py-4'>
          {/* Email Field */}
          <div className='space-y-2'>
            <label
              htmlFor='email'
              className='text-sm font-medium text-gray-900'
            >
              Email Address
            </label>
            <input
              name='email'
              type='email'
              id='email'
              placeholder='user@example.com'
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                state?.errors?.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {state?.errors?.email && (
              <p className='text-sm text-red-600'>{state?.errors?.email}</p>
            )}
          </div>

          {/* Role Field */}
          <div className='space-y-2'>
            <label htmlFor='role' className='text-sm font-medium text-gray-900'>
              Role
            </label>
            <select
              name='role'
              id='role'
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white ${
                state?.errors?.role ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value=''>Select a role</option>
              <option value='hr'>HR</option>
              <option value='recruiter'>Recruiter</option>
            </select>
            {state?.errors?.role && (
              <p className='text-sm text-red-600'>{state?.errors?.role}</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <button
              type='button'
              className='px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
            >
              Cancel
            </button>
          </DialogClose>
          <button
            type='submit'
            disabled={isPending}
            className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {isPending ? 'Sending...' : 'Send Invitation'}
          </button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default function AddUser() {
  return (
    <Dialog>
      <DialogTrigger className='cursor-pointer flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors'>
        <Plus size={20} />
        Add User
      </DialogTrigger>
      <AddUserContent />
    </Dialog>
  );
}
