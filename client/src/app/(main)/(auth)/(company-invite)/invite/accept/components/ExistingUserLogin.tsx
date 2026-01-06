'use client';

import React, { useActionState, useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { registerInvitedUser } from '@/app/actions/auth.actions';

const initialState = {
  errors: undefined,
  success: undefined,
  message: undefined,
};

export default function ExistingUserLogin({ email, token }: { email: string; token: string }) {
  const [state, formAction, isPending] = useActionState(registerInvitedUser.bind(null, token), initialState);

  return (
    <div className="p-2 w-full max-w-md">
      <form action={formAction} className="space-y-3">
        {state?.errors && !state?.errors?.password && !state?.errors?.email && !state?.errors?.token && <p>{state.errors}</p>}

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-2">Email Address</label>
          <input
            type="email"
            name="email"
            id="email"
            defaultValue={email}
            readOnly
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-600 cursor-not-allowed"
          />
          {/* {state?.errors?.email && (
            <p className='text-red-500 mt-1 text-sm'>{state.errors.email}</p>
          )} */}
        </div>

        <button
          disabled={isPending}
          type="submit"
          className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <CheckCircle size={20} />
          {isPending ? 'Processing...' : 'Accept Invitation'}
        </button>

        <button
          disabled={isPending}
          className="w-full cursor-pointer bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-700 border border-gray-300 font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <XCircle size={20} />
          {isPending ? 'Processing...' : 'Reject Invitation'}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-500 text-center">
          Questions?{' '}
          <a href="/contact" className="text-blue-600 hover:underline">
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
}
