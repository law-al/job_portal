import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';

export default function PasswordResetSuccess() {
  const handleGoToSignIn = () => {
    console.log('Navigating to sign in...');
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
                Password Reset Successfully!
              </h2>

              {/* Description */}
              <p className='text-gray-600 mb-8 leading-relaxed'>
                Your password has been reset successfully. You can now sign in
                with your new password.
              </p>

              {/* Sign In Button */}
              <Button
                asChild
                onClick={handleGoToSignIn}
                className='w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-lg transition-colors mb-4'
              >
                <Link href='/login'>Go to Sign In</Link>
              </Button>

              {/* Additional Info */}
              <p className='text-sm text-gray-500'>
                You will be redirected to sign in automatically in a few seconds
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
