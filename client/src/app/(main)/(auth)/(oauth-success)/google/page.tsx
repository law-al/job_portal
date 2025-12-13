'use client';
import React, { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

export default function GoogleAuthSuccess() {
  useEffect(() => {
    if (window.opener) {
      const parentURL = window.opener.location.href;
      console.log(parentURL);
      window.opener.postMessage(
        { type: 'AUTH_SUCCESS', message: 'User logged in' },
        parentURL
      );
    }

    window.close();
  }, []);

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

          {/* Right Side - Success */}
          <div className='p-12 flex items-center justify-center'>
            <div className='max-w-md w-full text-center'>
              {/* Success Icon with Animation */}
              <div className='w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 relative'>
                <CheckCircle
                  className='w-14 h-14 text-green-600'
                  strokeWidth={2}
                />
                <div className='absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20'></div>
              </div>

              {/* Title */}
              <h2 className='text-3xl font-bold text-gray-900 mb-4'>
                Welcome to JobPortal!
              </h2>

              {/* Description */}
              <div className='mb-8'>
                <p className='text-gray-600 mb-3 leading-relaxed'>
                  {` You've successfully signed in with Google.`}
                </p>

                {/* User Info Card */}
                {/* <div className="bg-gray-50 rounded-lg p-4 mb-3">
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-10 h-10 bg-linear-to-br from-red-500 via-yellow-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      {userName.charAt(0)}
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-900">{userName}</p>
                      <p className="text-sm text-gray-600">{userEmail}</p>
                    </div>
                  </div>
                </div> */}

                <p className='text-gray-600 leading-relaxed'>
                  Setting up your account...
                </p>
              </div>

              {/* Loading dots animation */}
              <div className='flex items-center justify-center gap-2 mb-6'>
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

              {/* Additional Info */}
              <p className='text-sm text-gray-500'>
                You will be redirected to your dashboard shortly
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
