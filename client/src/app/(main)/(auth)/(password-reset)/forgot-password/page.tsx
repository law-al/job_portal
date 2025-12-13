/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import FormError from '@/components/FormError';
import api from '@/lib/api';
import PasswordResetSent from '@/components/PasswordResetSent';
import { AxiosError } from 'axios';

const EmailSchema = z.object({
  email: z
    .email({ message: 'Enter a valid email address.' })
    .min(5, { message: 'Email must be at least 5 characters.' })
    .max(255, { message: 'Email cannot exceed 255 characters.' })
    .toLowerCase()
    .trim(),
});

type EmailSchemaType = z.infer<typeof EmailSchema>;

export default function ForgotPassword() {
  const [formError, setFormError] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [resetLinkSent, setResetLinkSent] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailSchemaType>({
    resolver: zodResolver(EmailSchema),
  });

  const mutation = useMutation({
    mutationFn: async (data: EmailSchemaType) => {
      const response = await api.post('/auth/forgot-password', data);
      return response.data.data;
    },
    onSuccess: (data, value) => {
      setResetLinkSent(true);
      setUserEmail(value.email);
    },
    onError: (error) => {
      console.log(error);
      if (error instanceof AxiosError) {
        const status = error.status;
        const errorResponseData: any = error.response?.data;

        if (status === 404) {
          setFormError('User with email not found');
        }
      }
    },
  });

  const onSubmit = (data: EmailSchemaType) => {
    console.log(data);
    mutation.mutate(data);
  };

  return (
    <>
      {resetLinkSent ? (
        <PasswordResetSent userEmail={userEmail} />
      ) : (
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

            {/* Right Side - Form */}
            <div className='w-full md:w-1/2 p-12 flex flex-col justify-center'>
              <div className='max-w-md mx-auto w-full'>
                {/* Logo */}
                <div className='mb-12'>
                  <h3 className='text-xl font-bold text-gray-900'>Your Logo</h3>
                </div>

                {/* Title and Description */}
                <div className='mb-8'>
                  <h1 className='text-4xl font-bold text-gray-900 mb-4'>
                    Forgot Password?
                  </h1>
                  <p className='text-gray-600'>
                    {` No problem. Enter your email below and we'll send you a link to reset it.`}
                  </p>
                </div>

                {formError && (
                  <p className='my-5 text-center text-red-500 italic'>
                    {formError}
                  </p>
                )}

                {/* Email Input */}
                <form action='' onSubmit={handleSubmit(onSubmit)}>
                  <div className='mb-6'>
                    <label
                      htmlFor='email'
                      className='block text-sm font-medium text-gray-900 mb-2'
                    >
                      Email Address
                    </label>
                    <div className='relative'>
                      <input
                        type='email'
                        id='email'
                        placeholder='Enter your email address'
                        {...register('email')}
                        className='w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none'
                      />
                      <div className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400'>
                        <Mail size={20} />
                      </div>
                    </div>
                  </div>
                  {errors.email && <FormError message={errors.email.message} />}

                  {/* Send Recovery Button */}
                  <button
                    type='submit'
                    disabled={mutation.isPending}
                    className='w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-lg transition-colors mb-6 disabled:cursor-not-allowed disabled:bg-blue-300/70'
                  >
                    Send Recovery Link
                  </button>
                </form>

                {/* Back to Login Link */}
                <p className='text-center text-gray-600'>
                  Remember your password?{' '}
                  <Link
                    href='/login'
                    className='text-blue-500 hover:text-blue-600 font-medium'
                  >
                    Log In
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
