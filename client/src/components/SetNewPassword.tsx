'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FormError from './FormError';
import { toast } from 'sonner';
import PasswordResetSuccess from './PasswordResetSuccess';
import PasswordResetExpired from './PasswordResetExpired';
import PasswordResetLoading from './PasswordResetLoading';
import Link from 'next/link';

const PasswordSchema = z
  .object({
    password: z
      .string({
        error: 'Password is required.',
      })
      .min(8, { message: 'Password must be at least 8 characters.' })
      .max(100, { message: 'Password cannot exceed 100 characters.' })
      .regex(/[A-Z]/, {
        message: 'Password must contain at least one uppercase letter.',
      })
      .regex(/[a-z]/, {
        message: 'Password must contain at least one lowercase letter.',
      })
      .regex(/[0-9]/, {
        message: 'Password must contain at least one number.',
      }),

    confirmPassword: z.string({
      error: 'Confirm Password is required.',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  });

type PasswordSchemaType = z.infer<typeof PasswordSchema>;

export default function SetNewPassword({ reset }: { reset: string }) {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordResetSuccess, setPasswordResetSuccess] =
    useState<boolean>(false);

  const passwordMutation = useMutation({
    mutationFn: async (data: PasswordSchemaType) => {
      const response = await api.post(
        `/auth/reset-password?reset=${reset}`,
        data
      );
      return response.data.data;
    },
    onSuccess: (data) => {
      console.log(data);
      setPasswordResetSuccess(true);
    },
    onError: (error) => {
      console.log(error);
      toast('Reset token expired');
    },
    retry: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordSchemaType>({
    resolver: zodResolver(PasswordSchema),
  });

  const onSubmit = (data: PasswordSchemaType) => {
    console.log(data);
    passwordMutation.mutate(data);
  };

  if (passwordMutation.isPending) return <PasswordResetLoading />;

  if (passwordMutation.isError) return <PasswordResetExpired reset={reset} />;

  if (passwordMutation.isSuccess) return <PasswordResetSuccess />;

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

          {/* Right Side - Form */}
          <div className='p-12 flex flex-col justify-center'>
            <div className='max-w-md mx-auto w-full'>
              {/* Title and Description */}
              <div className='mb-8'>
                <h2 className='text-3xl font-bold text-gray-900 mb-4'>
                  Set a New Password
                </h2>
                <p className='text-gray-600'>
                  Your new password must be at least 8 characters long and
                  include a mix of letters, numbers, and symbols.
                </p>
              </div>

              {/* Form Fields */}
              <form action='' onSubmit={handleSubmit(onSubmit)}>
                <div className='space-y-5'>
                  {/* New Password Field */}
                  <div>
                    <label
                      htmlFor='newPassword'
                      className='block text-sm font-medium text-gray-900 mb-2'
                    >
                      New Password
                    </label>
                    <div className='relative'>
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        id='newPassword'
                        placeholder='Enter new password'
                        {...register('password')}
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none pr-12'
                      />
                      <button
                        type='button'
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
                      >
                        {showNewPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <FormError message={errors.password.message} />
                    )}
                  </div>

                  {/* Confirm New Password Field */}
                  <div>
                    <label
                      htmlFor='confirmPassword'
                      className='block text-sm font-medium text-gray-900 mb-2'
                    >
                      Confirm New Password
                    </label>
                    <div className='relative'>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id='confirmPassword'
                        placeholder='Confirm new password'
                        {...register('confirmPassword')}
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none pr-12'
                      />
                      <button
                        type='button'
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <FormError message={errors.confirmPassword.message} />
                    )}
                  </div>

                  {/* Reset Password Button */}
                  <button
                    type='submit'
                    disabled={passwordMutation.isPending}
                    className='w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-lg transition-colors mt-6 disabled:cursor-not-allowed disabled:bg-blue-300/80'
                  >
                    Reset Password
                  </button>

                  {/* Back to Sign In Link */}
                  <div className='text-center mt-4'>
                    <Link
                      href='/login'
                      className='text-gray-600 hover:text-gray-900 text-sm underline'
                    >
                      Back to Sign In
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
