import React from 'react';
import { MailCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function PasswordResetSent({
  userEmail,
}: {
  userEmail: string;
}) {
  const handleOpenMail = () => {
    console.log('Opening mail app...');
  };

  const handleResend = () => {
    console.log('Resending password reset link...');
  };

  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center p-4'>
      <div className='max-w-5xl w-full bg-white rounded-3xl shadow-lg overflow-hidden flex'>
        {/* Left Side - Image */}
        <div className='hidden md:flex md:w-1/2 bg-linear-to-br from-teal-400 to-cyan-300 items-end justify-center p-12'>
          <div className='w-full max-w-sm'>
            <Image
              src='https://images.unsplash.com/photo-1604076850742-4c7221f3101b?w=600&h=800&fit=crop'
              alt='Plant decoration'
              className='w-full h-auto object-contain'
              width={500}
              height={500}
            />
          </div>
        </div>

        {/* Right Side - Content */}
        <div className='w-full md:w-1/2 p-12 flex flex-col justify-center'>
          <div className='max-w-md mx-auto w-full text-center'>
            {/* Success Icon */}
            <div className='w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8'>
              <MailCheck className='w-10 h-10 text-green-600' />
            </div>

            {/* Title */}
            <h1 className='text-4xl font-bold text-gray-900 mb-4'>
              Check Your Email
            </h1>

            {/* Description */}
            <p className='text-gray-600 mb-2'>
              {`We've sent a password reset link to `}
            </p>
            <p className='text-gray-900 font-semibold mb-2'>{userEmail}</p>
            <p className='text-gray-600 mb-8'>
              Click the link in the email to reset your password.
            </p>

            {/* Open Mail Button */}
            <button
              onClick={handleOpenMail}
              className='w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-lg transition-colors mb-6'
            >
              Open Email App
            </button>

            {/* Resend Link */}
            <p className='text-gray-600 text-sm mb-6'>
              {`Didn't receive the email? `}
              <button
                onClick={handleResend}
                className='text-blue-500 hover:text-blue-600 font-medium'
              >
                Click to resend
              </button>
            </p>

            {/* Back to Login */}
            <Link
              href='/login'
              className='text-blue-500 hover:text-blue-600 font-medium text-sm'
            >
              ← Back to Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
