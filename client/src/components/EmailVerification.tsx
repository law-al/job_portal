import React, { useState } from 'react';
import { ArrowLeft, MailCheck } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function EmailVerification({
  userEmail,
}: {
  userEmail: string;
}) {
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [failureMessage, setFailureMessage] = useState<string>('');

  const { data: session, status } = useSession();

  console.log(session);

  const resendVerificationMutation = useMutation({
    mutationFn: async () => {
      const response = await api.get('/auth/re-verify', {
        withCredentials: true,
      });
      return response.data;
    },
    onSuccess: (data) => {
      console.log(data);
      toast('A new verification email has been sent, please check your mail');
    },
    onError: (error) => {
      console.log('Error:', error);
      if (error instanceof AxiosError) {
        /* eslint-disable @typescript-eslint/no-explicit-any */
        const errorResponse = (error.response as any).data;
        toast(errorResponse.message);
      }
    },
  });

  const handleOpenMail = () => {
    console.log('Opening mail app...');
  };

  const handleResendEmail = () => {
    resendVerificationMutation.mutate();
  };

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col'>
      <header className='px-6 py-4 flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <div className='w-8 h-8 bg-blue-500 rounded'></div>
          <span className='text-xl font-bold text-gray-900'>JobPortal</span>
        </div>
        <Link
          href='/login'
          className='flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors'
        >
          <ArrowLeft size={20} />
          <span>Back to Login</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className='flex-1 flex items-center justify-center px-6 py-12'>
        <div className='w-full max-w-md'>
          {/* Card */}
          <div className='bg-white rounded-2xl shadow-sm p-12 text-center'>
            {/* Icon */}
            <div className='w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-8'>
              <MailCheck className='w-10 h-10 text-blue-600' />
            </div>

            {/* Title */}
            <h1 className='text-3xl font-bold text-gray-900 mb-4'>
              Please verify your email
            </h1>

            {/* Description */}
            <p className='text-gray-600 mb-2'>
              {`We've sent a verification link to`}
            </p>
            <p className='text-gray-900 font-semibold mb-2'>{userEmail}</p>
            <p className='text-gray-600 mb-8'>
              Please click the link in the email to complete your registration
              and activate your account.
            </p>

            {/* Open Mail Button */}
            <button
              onClick={handleOpenMail}
              className='w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors mb-6'
            >
              Open Mail App
            </button>

            {/* Resend Email Link */}
            <p className='text-gray-600 text-sm'>
              {`Didn't receive the email? `}
              <button
                disabled={resendVerificationMutation.status === 'pending'}
                onClick={handleResendEmail}
                className={`text-blue-600 hover:text-blue-700 font-medium hover:underline cursor-pointer transition-all 300ms ${
                  resendVerificationMutation.status === 'pending' &&
                  'cursor-not-allowed text-blue-600/50'
                }`}
              >
                {' '}
                Resend email
              </button>
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
