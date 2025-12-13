import api from '@/lib/api';
import { useMutation } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function EmailVerifiedExpired() {
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
      console.error('Error:', error);
      toast('Difficulty sendig verificaion token');
    },
  });

  const handleResendLink = () => {
    console.log('Resending verification link...');
    resendVerificationMutation.mutate();
  };

  const handleBackToLogin = () => {
    console.log('Navigating back to login...');
  };

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
                  d='M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1'
                />
                <line
                  x1='4'
                  y1='4'
                  x2='20'
                  y2='20'
                  strokeWidth={2}
                  strokeLinecap='round'
                />
              </svg>
            </div>

            {/* Title */}
            <h1 className='text-3xl font-bold text-gray-900 mb-4'>
              Link Expired or Invalid
            </h1>

            {/* Description */}
            <p className='text-gray-600 mb-8 leading-relaxed'>
              For your security, this verification link is no longer valid
              because it has expired or has already been used. Please request a
              new link to continue.
            </p>

            {/* Resend Link Button */}
            <button
              disabled={resendVerificationMutation.isPending}
              onClick={handleResendLink}
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors cursor-pointer mb-6 disabled:bg-blue-300 disabled:cursor-not-allowed`}
            >
              Resend Link
            </button>

            {/* Back to Login Link */}
            <Link
              href='/login'
              className='flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 font-medium mx-auto'
            >
              <ArrowLeft size={20} />
              <span>Back to Login</span>
            </Link>
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
