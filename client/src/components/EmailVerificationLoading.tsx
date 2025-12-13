import React from 'react';

export default function EmailVerificationLoading() {
  return (
    <div className='min-h-screen bg-gray-50 flex flex-col'>
      {/* Header */}
      <header className='px-6 py-4 bg-white border-b border-gray-200'>
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
            {/* Loading Spinner */}
            <div className='w-20 h-20 mx-auto mb-8 relative'>
              {/* Outer spinning circle */}
              <div className='absolute inset-0 border-4 border-blue-200 rounded-full'></div>
              <div className='absolute inset-0 border-4 border-transparent border-t-blue-600 rounded-full animate-spin'></div>

              {/* Inner icon */}
              <div className='absolute inset-0 flex items-center justify-center'>
                <svg
                  className='w-10 h-10 text-blue-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h1 className='text-3xl font-bold text-gray-900 mb-4'>
              Verifying Your Email
            </h1>

            {/* Description */}
            <p className='text-gray-600 mb-4 leading-relaxed'>
              Please wait while we verify your email address. This will only
              take a moment.
            </p>

            {/* Loading dots animation */}
            <div className='flex items-center justify-center gap-2'>
              <div
                className='w-2 h-2 bg-blue-600 rounded-full animate-bounce'
                style={{ animationDelay: '0ms' }}
              ></div>
              <div
                className='w-2 h-2 bg-blue-600 rounded-full animate-bounce'
                style={{ animationDelay: '150ms' }}
              ></div>
              <div
                className='w-2 h-2 bg-blue-600 rounded-full animate-bounce'
                style={{ animationDelay: '300ms' }}
              ></div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className='py-6 text-center'>
        <p className='text-gray-600 text-sm'>
          Need help? Visit our{' '}
          <a href='#' className='text-blue-600 hover:text-blue-700 font-medium'>
            Support Center
          </a>
        </p>
      </footer>
    </div>
  );
}
