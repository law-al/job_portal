'use client';
import { registerInvitedUser } from '@/app/actions/auth.actions';
import { Eye, EyeOff, CheckCircle } from 'lucide-react';
import React, { useActionState, useState } from 'react';

export default function NewUserSignupForm({
  email,
  token,
}: {
  email: string;
  token: string;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const initialState = {
    errors: undefined,
    success: undefined,
    message: undefined,
  };
  const [state, formAction, isPending] = useActionState(
    registerInvitedUser.bind(null, token),
    initialState
  );

  // Show success message if registration succeeded
  if (state?.success) {
    return (
      <div className='text-center py-8'>
        <div className='mb-6 flex justify-center'>
          <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center'>
            <CheckCircle className='w-10 h-10 text-green-600' />
          </div>
        </div>
        <h2 className='text-2xl font-bold text-gray-900 mb-3'>
          Account Created Successfully!
        </h2>
        <p className='text-gray-600 mb-6'>
          {state?.message ||
            'Your account has been created. Redirecting you to login...'}
        </p>
        <div className='inline-block'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction}>
      {state?.errors &&
        !state?.errors?.password &&
        !state?.errors?.email &&
        !state?.errors?.token && (
          <p className='text-sm text-red-500 text-center italic my-2'>
            {state.errors}
          </p>
        )}
      <div className='mb-6'>
        <label className='block text-sm font-semibold text-gray-900 mb-2'>
          Email Address
        </label>
        <input
          name='email'
          type='email'
          id='email'
          defaultValue={email}
          readOnly
          className='w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-600 cursor-not-allowed'
        />
        {state?.errors?.email && (
          <p className='text-red-500 mt-1 text-sm'>{state.errors.email}</p>
        )}
      </div>
      <div className='mb-2'>
        <label className='block text-sm font-semibold text-gray-900 mb-2'>
          Create a Password
        </label>
        <div className='relative'>
          <input
            type={showPassword ? 'text' : 'password'}
            name='password'
            id='password'
            placeholder='At least 8 characters'
            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          />
          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {state?.errors?.password && (
          <p className='text-red-500 mt-1 text-sm'>{state.errors.password}</p>
        )}
      </div>
      <p className='text-sm text-gray-600 mb-6'>
        Must contain at least 8 characters, 1 uppercase, and 1 number.
      </p>
      <button
        type='submit'
        disabled={isPending}
        className='w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200'
      >
        {isPending ? 'Creating Account...' : 'Create My Account'}
      </button>
      <p className='text-center text-sm text-gray-600 mt-4'>
        By creating an account, you agree to our{' '}
        <a href='#' className='text-blue-600 hover:underline'>
          Terms of Service
        </a>
        .
      </p>
    </form>
  );
}
