'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BsGoogle, BsLinkedin } from 'react-icons/bs';
import FormError from '@/components/FormError';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

const LoginSchema = z.object({
  email: z
    .email({ message: 'Invalid email address.' })
    .min(5, { message: 'Email must be at least 5 characters.' })
    .max(255, { message: 'Email cannot exceed 255 characters.' })
    .toLowerCase()
    .trim(),

  password: z.string({
    error: 'Password is required.',
  }),
});

type LoginSchemaType = z.infer<typeof LoginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loginErrors, setLoginErrors] = useState<string>('');

  // const { data: session, status } = useSession();

  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginSchemaType) => {
    const result = await signIn('credentials', {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (result?.error) {
      console.log(result.error);
      setLoginErrors('Invalid Credentials');
    }

    if (result?.ok) {
      router.replace('/dashboard');
    }
  };

  const handleGoogleLogin = async () => {
    const signInResult = await signIn('google', {
      callbackUrl: '/dashboard',
    });

    if (signInResult?.error) {
      setLoginErrors('Login failed');
    }
  };

  return (
    <div className='min-h-screen flex'>
      {/* Left Side - Hero Image */}
      <div className='hidden lg:flex lg:w-1/2 bg-linear-to-br from-gray-700 to-gray-900 relative'>
        {/* Background Image Overlay */}
        <div
          className='absolute inset-0 bg-cover bg-center opacity-40'
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=1000&fit=crop')",
          }}
        ></div>

        {/* Content */}
        <div className='relative z-10 flex flex-col justify-between p-12 text-white'>
          {/* Logo */}
          <div className='flex items-center gap-2'>
            <div className='w-10 h-10 bg-blue-500 rounded'></div>
            <span className='text-2xl font-bold'>JobPortal</span>
          </div>

          {/* Hero Text */}
          <div className='mb-32'>
            <h1 className='text-5xl font-bold mb-6 leading-tight'>
              Find Your Next
              <br />
              Opportunity.
            </h1>
            <p className='text-xl text-gray-300'>
              Connecting talented professionals with innovative companies.
            </p>
          </div>

          {/* Footer */}
          <div className='text-gray-400 text-sm'>© 2024 JobPortal</div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className='w-full lg:w-1/2 bg-white flex items-center justify-center p-8'>
        <div className='max-w-md w-full'>
          {/* Mobile Logo */}
          <div className='lg:hidden flex items-center gap-2 mb-8'>
            <div className='w-8 h-8 bg-blue-500 rounded'></div>
            <span className='text-xl font-bold text-gray-900'>JobPortal</span>
          </div>

          {/* Form Header */}
          <div className='mb-8'>
            <h2 className='text-3xl font-bold text-gray-900 mb-2'>
              Log in to your account
            </h2>
            <p className='text-gray-600'>
              Welcome back! Please enter your details.
            </p>

            {loginErrors && (
              <p className='mt-10 text-center text-red-500 italic'>
                {loginErrors}
              </p>
            )}
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='space-y-5'>
              {/* Email Field */}
              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-gray-900 mb-2'
                >
                  Email Address
                </label>
                <input
                  type='email'
                  id='email'
                  placeholder='Enter your email'
                  {...register('email')}
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none'
                />
              </div>
              {errors.email && <FormError message={errors.email.message} />}

              {/* Password Field */}
              <div>
                <div className='flex items-center justify-between mb-2'>
                  <label
                    htmlFor='password'
                    className='block text-sm font-medium text-gray-900'
                  >
                    Password
                  </label>
                  <Link
                    href='/forgot-password'
                    className='text-sm text-blue-600 hover:text-blue-700 font-medium'
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className='relative'>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id='password'
                    placeholder='Enter your password'
                    {...register('password')}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none pr-12'
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <FormError message={errors.password.message} />
                )}
              </div>

              {/* Login Button */}
              <button
                type='submit'
                // disabled={}
                className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors disabled:cursor-not-allowed disabled:bg-blue-300/80`}
              >
                Log In
              </button>

              {/* Divider */}
              <div className='relative my-6'>
                <div className='absolute inset-0 flex items-center'>
                  <div className='w-full border-t border-gray-300'></div>
                </div>
                <div className='relative flex justify-center'>
                  <span className='px-4 bg-white text-sm text-gray-500'>
                    or continue with
                  </span>
                </div>
              </div>

              {/* Social Login Buttons */}
              <div className='grid grid-cols-2 gap-3'>
                <button
                  onClick={handleGoogleLogin}
                  type='button'
                  className='flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'
                >
                  <BsGoogle size='20' />
                  <span className='text-sm font-medium text-gray-700'>
                    Google
                  </span>
                </button>

                {/* <button className='flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'>
                  <div className='w-5 h-5 bg-gray-900 rounded'></div>
                  <span className='text-sm font-medium text-gray-700'>
                    GitHub
                  </span>
                </button> */}

                <button className='flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'>
                  <BsLinkedin size={20} />
                  <span className='text-sm font-medium text-gray-700'>
                    LinkedIn
                  </span>
                </button>
              </div>

              {/* Sign Up Link */}
              <p className='text-center text-sm text-gray-600 mt-6'>
                {`Don't have an account? `}
                <Link
                  href='/register'
                  className='text-blue-600 hover:text-blue-700 font-medium'
                >
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
