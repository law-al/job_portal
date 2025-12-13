'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Error:', error);
  }, [error]);

  const getErrorMessage = () => {
    if (error.message.includes('token')) {
      return 'Invalid or expired invitation token. Please request a new invitation link.';
    }
    if (error.message.includes('network') || error.message.includes('fetch')) {
      return 'Network error. Please check your connection and try again.';
    }
    if (error.message.includes('registration')) {
      return 'Registration failed. Please try again or contact support.';
    }
    return 'Something went wrong while processing your invitation. Please try again.';
  };

  const getErrorTitle = () => {
    if (error.message.includes('token')) {
      return 'Invalid Invitation';
    }
    if (error.message.includes('network') || error.message.includes('fetch')) {
      return 'Connection Error';
    }
    return 'Something Went Wrong';
  };

  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center p-4'>
      <div className='max-w-md w-full'>
        <div className='bg-white rounded-2xl shadow-xl p-8 text-center'>
          <div className='mb-6 flex justify-center'>
            <div className='bg-red-100 rounded-full p-4'>
              <AlertCircle className='w-16 h-16 text-red-600' />
            </div>
          </div>

          {/* <h1 className='text-3xl font-bold text-gray-900 mb-2'>
            {getErrorTitle()}
          </h1> */}

          <p className='text-gray-600 mb-6'>{error.message}</p>

          {process.env.NODE_ENV === 'development' && (
            <div className='mb-6 p-4 bg-gray-50 rounded-lg text-left'>
              <p className='text-xs font-mono text-gray-700 break-all'>
                {error.message}
              </p>
              {error.digest && (
                <p className='text-xs text-gray-500 mt-2'>
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}

          <div className='space-y-3'>
            <button
              onClick={reset}
              className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2'
            >
              <RefreshCw size={20} />
              Try Again
            </button>

            <button
              onClick={() => (window.location.href = '/')}
              className='w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2'
            >
              <Home size={20} />
              Go to Homepage
            </button>
          </div>

          <div className='mt-8 pt-6 border-t border-gray-200'>
            <p className='text-sm text-gray-500'>
              Need help?{' '}
              <a href='/contact' className='text-blue-600 hover:underline'>
                Contact support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
