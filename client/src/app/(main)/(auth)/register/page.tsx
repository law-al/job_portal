'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React, { useState } from 'react';
import { BiBuilding } from 'react-icons/bi';
import { CgUser } from 'react-icons/cg';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
  const [selectedRole, setSelectedRole] = useState<
    'jobseeker' | 'company' | null
  >(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  if (!!session?.user) {
    router.replace('/dashboard');
  }

  if (!session?.user)
    return (
      <div className='min-h-screen bg-gray-50 flex flex-col'>
        {/* Header */}
        <header className='px-6 py-4 flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <div className='w-8 h-8 bg-blue-500 rounded'></div>
            <span className='text-xl font-bold text-gray-900'>JobPortal</span>
          </div>
          <div className='text-sm text-gray-600'>
            Already have an account?{' '}
            <Link
              href='/login'
              className='text-blue-500 hover:text-blue-600 font-medium'
            >
              Log In
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className='flex-1 flex flex-col items-center justify-center px-6 py-12'>
          <div className='max-w-4xl w-full'>
            {/* Title Section */}
            <div className='text-center mb-12'>
              <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
                Join as a Job Seeker or a Company
              </h1>
              <p className='text-gray-600 text-lg'>
                Choose your role to get a tailored experience on our platform.
              </p>
            </div>

            {/* Role Cards */}
            <div className='grid md:grid-cols-2 gap-6 mb-8'>
              {/* Job Seeker Card */}
              <button
                onClick={() => setSelectedRole('jobseeker')}
                className={`bg-white rounded-xl p-8 border-2 transition-all hover:shadow-lg ${
                  selectedRole === 'jobseeker'
                    ? 'border-blue-500 shadow-lg'
                    : 'border-gray-200'
                }`}
              >
                <div className='flex flex-col items-center text-center'>
                  <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6'>
                    <CgUser className='w-8 h-8 text-blue-500' />
                  </div>
                  <h2 className='text-2xl font-bold text-gray-900 mb-3'>
                    I am a Job Seeker
                  </h2>
                  <p className='text-gray-600'>
                    Find your next career opportunity, apply to jobs, and
                    connect with top companies.
                  </p>
                </div>
              </button>

              {/* Company Card */}
              <button
                onClick={() => setSelectedRole('company')}
                className={`bg-white rounded-xl p-8 border-2 transition-all hover:shadow-lg ${
                  selectedRole === 'company'
                    ? 'border-blue-500 shadow-lg'
                    : 'border-gray-200'
                }`}
              >
                <div className='flex flex-col items-center text-center'>
                  <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6'>
                    <BiBuilding className='w-8 h-8 text-blue-500' />
                  </div>
                  <h2 className='text-2xl font-bold text-gray-900 mb-3'>
                    I am a Company
                  </h2>
                  <p className='text-gray-600'>
                    Post job openings, manage applicants, and find the perfect
                    candidate for your team.
                  </p>
                </div>
              </button>
            </div>

            {/* Continue Button */}
            <div className='flex justify-center'>
              <Button
                asChild
                disabled={!selectedRole}
                className={`px-32 py-6 rounded-lg text-white font-medium text-lg transition-all ${
                  selectedRole
                    ? 'bg-blue-400 hover:bg-blue-500'
                    : 'bg-blue-300 cursor-not-allowed'
                }`}
              >
                <Link
                  href={`/register/${
                    selectedRole && selectedRole === 'company'
                      ? 'company'
                      : 'job_seeker'
                  }`}
                >
                  Continue
                </Link>
              </Button>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className='py-8 text-center text-gray-600 text-sm'>
          <div className='flex justify-center gap-6 mb-4'>
            <a href='#' className='hover:text-gray-900'>
              Terms of Service
            </a>
            <a href='#' className='hover:text-gray-900'>
              Privacy Policy
            </a>
          </div>
          <p>© 2023 JobPortal. All rights reserved.</p>
        </footer>
      </div>
    );
}
