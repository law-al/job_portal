'use client';

import { CheckCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

export default function EmailVerificationSuccess() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (session?.user.isVerified) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [router, session]);

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col'>
      {/* Header */}
      <header className='px-6 py-4'>
        <div className='flex items-center gap-2'>
          <div className='w-8 h-8 bg-blue-500 rounded'></div>
          <span className='text-xl font-bold text-gray-900'>JobPortal</span>
        </div>
      </header>

      {/* Main Content */}
      <main className='flex-1 flex items-center justify-center px-6 py-12'>
        <div className='w-full max-w-md'>
          {/* Card */}
          <div className='bg-white rounded-2xl shadow-sm p-12 text-center'>
            {/* Success Icon with Animation */}
            <div className='w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 relative'>
              <CheckCircle
                className='w-14 h-14 text-green-600'
                strokeWidth={2}
              />
              <div className='absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20'></div>
            </div>

            {/* Title */}
            <h1 className='text-3xl font-bold text-gray-900 mb-4'>
              Email Verified Successfully!
            </h1>

            {/* Description */}
            <p className='text-gray-600 mb-8 text-lg'>
              Your email has been verified. You can now access all features of
              your JobPortal account and start your journey.
            </p>

            {/* Continue Button */}
            <button className='w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors mb-4'>
              Continue to Dashboard
            </button>

            {/* Additional Info */}
            <p className='text-sm text-gray-500'>
              You will be redirected automatically in a few seconds
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className='py-6 text-center'>
        <a href='#' className='text-gray-600 hover:text-gray-900 text-sm'>
          Help & Support
        </a>
      </footer>
    </div>
  );
}
