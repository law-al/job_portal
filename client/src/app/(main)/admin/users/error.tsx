'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCw, Home, LogOut, LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

interface ErrorType {
  title: string;
  description: string;
  icon: string;
  action?: () => void;
  actionLabel?: string;
  actionIcon?: LucideIcon;
}

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Users Management Error:', error.message);
  }, [error]);

  const getErrorType = (): ErrorType => {
    const message = error.message.toLowerCase();

    if (message.includes('fetch') || message.includes('network')) {
      return {
        title: 'Connection Error',
        description:
          'Unable to connect to the server. Please check your internet connection.',
        icon: '🌐',
      };
    }

    if (message.includes('unauthorized') || message.includes('401')) {
      return {
        title: 'Authentication Error',
        description: 'Your session may have expired. Please log in again.',
        icon: '🔒',
        action: () => {
          signOut({
            callbackUrl: '/login?redirect=users',
          });
        },
        actionLabel: 'Sign In Again',
        actionIcon: LogOut,
      };
    }

    if (message.includes('forbidden') || message.includes('403')) {
      return {
        title: 'Access Denied',
        description: "You don't have permission to access this resource.",
        icon: '⛔',
      };
    }

    return {
      title: 'Something went wrong',
      description:
        'We encountered an unexpected error while loading the users.',
      icon: '⚠️',
    };
  };

  const errorObj = getErrorType();
  const ActionIcon = errorObj.actionIcon;

  return (
    <div className='flex-1 flex items-center justify-center p-8 bg-gray-50'>
      <div className='max-w-md w-full'>
        <div className='bg-white rounded-xl border border-gray-200 p-8 text-center'>
          {/* Error Icon with emoji */}
          <div className='text-6xl mb-4'>{errorObj.icon}</div>

          {/* Error Title */}
          <h2 className='text-2xl font-bold text-gray-900 mb-3'>
            {errorObj.title}
          </h2>

          {/* Error Message */}
          <p className='text-gray-600 mb-2'>{errorObj.description}</p>

          {/* Error Details (only in development) */}
          {process.env.NODE_ENV === 'development' && (
            <div className='mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-left'>
              <p className='text-xs font-semibold text-red-900 mb-1'>
                Development Error:
              </p>
              <p className='text-xs font-mono text-red-800 break-all'>
                {error.message}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className='flex flex-col gap-3 mt-6'>
            {errorObj.action ? (
              <button
                onClick={errorObj.action}
                className='flex items-center justify-center gap-2 w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors'
              >
                {ActionIcon && <ActionIcon size={20} />}
                {errorObj.actionLabel}
              </button>
            ) : (
              <button
                onClick={reset}
                className='flex items-center justify-center gap-2 w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors'
              >
                <RefreshCw size={20} />
                Try Again
              </button>
            )}

            <Link
              href='/admin/dashboard'
              className='flex items-center justify-center gap-2 w-full px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors'
            >
              <Home size={20} />
              Back to Dashboard
            </Link>
          </div>

          {/* Help Text */}
          <p className='text-sm text-gray-500 mt-6'>
            If this problem persists, please contact support.
          </p>
        </div>
      </div>
    </div>
  );
}
