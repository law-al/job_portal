'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

export default function FinalizingSetup() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/dashboard');
    }, 500);

    return () => clearTimeout(timer);
  }, [router]);

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

          {/* Right Side - Finalizing */}
          <div className='p-12 flex items-center justify-center'>
            <div className='max-w-md w-full text-center'>
              {/* Animated Progress Circle */}
              <div className='w-24 h-24 mx-auto mb-8 relative'>
                {/* Background circle */}
                <svg
                  className='w-24 h-24 transform -rotate-90'
                  viewBox='0 0 100 100'
                >
                  <circle
                    cx='50'
                    cy='50'
                    r='40'
                    stroke='#e5e7eb'
                    strokeWidth='8'
                    fill='none'
                  />
                  <circle
                    cx='50'
                    cy='50'
                    r='40'
                    stroke='#3b82f6'
                    strokeWidth='8'
                    fill='none'
                    strokeDasharray='251.2'
                    strokeDashoffset='62.8'
                    strokeLinecap='round'
                    className='animate-spin'
                    style={{ animationDuration: '2s' }}
                  />
                </svg>

                {/* Center Icon */}
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
                      d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
                    />
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                    />
                  </svg>
                </div>
              </div>

              {/* Title */}
              <h2 className='text-3xl font-bold text-gray-900 mb-4'>
                Finalizing Your Account
              </h2>

              {/* Description */}
              <p className='text-gray-600 mb-6 leading-relaxed'>
                {` We're setting up your profile and preparing your personalized
                experience. This will only take a moment.`}
              </p>

              {/* Progress Steps */}
              <div className='space-y-3 mb-6'>
                <div className='flex items-center gap-3 text-left bg-green-50 border border-green-200 rounded-lg p-3'>
                  <div className='shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center'>
                    <svg
                      className='w-4 h-4 text-white'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M5 13l4 4L19 7'
                      />
                    </svg>
                  </div>
                  <span className='text-sm font-medium text-gray-700'>
                    Creating your profile
                  </span>
                </div>

                <div className='flex items-center gap-3 text-left bg-blue-50 border border-blue-200 rounded-lg p-3'>
                  <div className='flex-shrink-0 w-6 h-6 border-2 border-blue-500 rounded-full flex items-center justify-center'>
                    <div className='w-2 h-2 bg-blue-500 rounded-full animate-pulse'></div>
                  </div>
                  <span className='text-sm font-medium text-gray-700'>
                    Setting up preferences
                  </span>
                </div>

                <div className='flex items-center gap-3 text-left bg-gray-50 border border-gray-200 rounded-lg p-3'>
                  <div className='flex-shrink-0 w-6 h-6 border-2 border-gray-300 rounded-full'></div>
                  <span className='text-sm font-medium text-gray-500'>
                    Preparing dashboard
                  </span>
                </div>
              </div>

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
        </div>
      </div>
    </div>
  );
}
