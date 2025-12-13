'use client';
import api from '@/lib/api';
import { useMutation } from '@tanstack/react-query';
import React from 'react';

export default function PasswordResetExpired({ reset }: { reset: string }) {
  const resetMutation = useMutation({
    mutationFn: async () => {
      await api.get(`/auth/resend-reset-password?reset=${reset}`);
    },
    onSuccess: (data) => {
      console.log('success');
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleRequestNewLink = () => {
    console.log('Requesting new password reset link...');
  };

  const handleBackToSignIn = () => {
    console.log('Navigating back to sign in...');
  };

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center p-4'>
      <div className='max-w-6xl w-full bg-white rounded-3xl shadow-lg overflow-hidden'>
        <div className='grid md:grid-cols-2'>
          {/* Left Side - Message */}
          <div className='bg-gray-50 p-12 flex flex-col justify-between'>
            <div className='flex-1 flex items-center'>
              <h1 className='text-4xl md:text-5xl font-bold text-gray-900 leading-tight'>
                Your next career move is one step closer.
              </h1>
            </div>
            <div>
              <h2 className='text-2xl font-bold text-gray-900'>JobPortal</h2>
            </div>
          </div>

          {/* Right Side - Error */}
          <div className='p-12 flex items-center justify-center'>
            <div className='max-w-md w-full text-center'>
              {/* Error Icon */}
              <div className='w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8'>
                <svg
                  className='w-10 h-10 text-red-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
              </div>

              {/* Title */}
              <h2 className='text-3xl font-bold text-gray-900 mb-4'>
                Password Link Expired
              </h2>

              {/* Description */}
              <p className='text-gray-600 mb-8 leading-relaxed'>
                This password reset link has expired for security reasons.
                Please request a new link to reset your password.
              </p>

              {/* Request New Link Button */}
              <button
                onClick={() => resetMutation.mutate()}
                disabled={resetMutation.isPending}
                className='w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-lg transition-colors mb-4 disabled:cursor-not-allowed disabled:bg-blue-300/80'
              >
                Request New Link
              </button>

              {/* Back to Sign In Link */}
              <button
                onClick={handleBackToSignIn}
                className='w-full text-gray-600 hover:text-gray-900 text-sm underline'
              >
                Back to Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
