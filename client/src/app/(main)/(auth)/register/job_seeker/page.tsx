'use client';

import FormError from '@/components/FormError';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { BsGoogle, BsLinkedin } from 'react-icons/bs';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import z from 'zod';

import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import EmailVerification from '@/components/EmailVerification';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

const RegisterSchema = z.object({
  firstName: z
    .string({ message: 'First name is required.' })
    .min(1, { message: 'First name is required.' })
    .max(100, { message: 'First name cannot exceed 100 characters.' })
    .trim(),

  lastName: z.string({ message: 'Last name is required.' }).min(1, { message: 'Last name is required.' }).max(100, { message: 'Last name cannot exceed 100 characters.' }).trim(),

  email: z
    .email({ message: 'Invalid email address.' })
    .min(5, { message: 'Email must be at least 5 characters.' })
    .max(255, { message: 'Email cannot exceed 255 characters.' })
    .toLowerCase()
    .trim(),

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
    .regex(/[0-9]/, { message: 'Password must contain at least one number.' }),
});

type RegisterSchemaType = z.infer<typeof RegisterSchema>;

type RegisterSchemaWithRole = RegisterSchemaType & {
  role: 'USER';
};

export default function JobSeekerSignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationSuccessEmail, setRegistrationSuccessEmail] = useState('');
  const [formPass, setFormPass] = useState<string>('');
  const [registrationError, setRegistrationError] = useState<string>('');

  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (data: RegisterSchemaWithRole) => {
      const response = await api.post('/auth/register', data);
      return response.data.data;
    },
    onSuccess: async (data) => {
      setRegistrationSuccess(true);
      setRegistrationSuccessEmail(data.email);
      setRegistrationError('');

      // Auto-login after successful registration
      if (formPass) {
        try {
          await signIn('credentials', {
            email: data.email,
            password: formPass,
            redirect: false,
          });
        } catch (loginError) {
          // Login failure is not critical - user can login manually
          console.error('Auto-login failed:', loginError);
        }
      }

      setFormPass('');
      toast.success('Registration successful! Please check your email to verify your account.');
    },
    onError: (error: unknown) => {
      setRegistrationSuccess(false);
      const axiosError = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const errorMessage = axiosError?.response?.data?.message || axiosError?.message || 'Registration failed. Please try again.';
      setRegistrationError(errorMessage);
      toast.error(errorMessage);
    },
  });

  const handleGoogleSignUp = async () => {
    const signInResult = await signIn('google', {
      callbackUrl: '/dashboard',
    });

    if (signInResult?.ok) {
      console.log('Okay');
      router.replace('/dashboard');
    }

    if (signInResult?.error) {
      setRegistrationError('Registration failed');
    }
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterSchemaType>({
    resolver: zodResolver(RegisterSchema),
  });

  const passwordValue = watch('password');

  const getPasswordStrength = (pass: string) => {
    if (pass === undefined || pass.length === 0) return { strength: '', width: '0%', color: '' };
    if (pass.length < 6) return { strength: 'Weak', width: '33%', color: 'bg-red-500' };
    if (pass.length < 10) return { strength: 'Medium', width: '66%', color: 'bg-yellow-500' };
    return { strength: 'Strong', width: '100%', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength(passwordValue);

  const onSubmit = (data: RegisterSchemaType) => {
    setFormPass(data.password);
    mutation.mutate({ ...data, role: 'USER' });
  };

  return (
    <>
      {registrationSuccess ? (
        <EmailVerification userEmail={registrationSuccessEmail} />
      ) : (
        <div className="min-h-screen flex">
          <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-blue-100 to-blue-200 items-center justify-center p-12">
            <div className="max-w-md">
              <div className="rounded-2xl mb-8 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&h=400&fit=crop"
                  alt="Career growth illustration"
                  width={500}
                  height={500}
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Text Content */}
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Step into Your Next Career</h1>
              <p className="text-gray-600 text-lg">Join thousands of professionals and connect with top companies to find your dream job today.</p>
            </div>
          </div>

          {/* Right Side - Sign Up Form */}
          <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8">
            <div className="max-w-md w-full">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-500 rounded"></div>
                    <span className="text-xl font-bold text-gray-900">JobPortal</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link href="/login" className="text-blue-500 hover:text-blue-600 font-medium">
                      Log In
                    </Link>
                  </div>
                </div>

                <h2 className="text-3xl font-bold text-gray-900 mb-2">Create a Job Seeker Account</h2>
                <p className="text-gray-600">Get started by creating your account below.</p>

                {registrationError && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">{registrationError}</p>
                  </div>
                )}
              </div>

              {/* Social Sign Up Buttons */}
              <div className="space-y-3 mb-6">
                <button
                  onClick={handleGoogleSignUp}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <BsGoogle size="20" />
                  <span className="font-medium text-gray-900">Sign up with Google</span>
                </button>

                <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <BsLinkedin size="20" />
                  <span className="font-medium text-gray-900">Sign up with LinkedIn</span>
                </button>
              </div>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 bg-white text-sm text-gray-500">or</span>
                </div>
              </div>

              {/* Email and Password Fields */}
              <form action="" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-5">
                  {/* First Name Field */}
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-900 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      placeholder="John"
                      {...register('firstName')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                    {errors.firstName && <FormError message={errors.firstName.message} />}
                  </div>

                  {/* Last Name Field */}
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-900 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      placeholder="Doe"
                      {...register('lastName')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                    {errors.lastName && <FormError message={errors.lastName.message} />}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      placeholder="you@example.com"
                      {...register('email')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />

                    {/* Email form error */}
                    {errors.email && <FormError message={errors.email.message} />}
                  </div>

                  {/* Password Field */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        placeholder="Create a strong password"
                        {...register('password')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none pr-12"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                        {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                      </button>
                    </div>

                    {/* Password Strength Indicator */}
                    {passwordValue && (
                      <div className="mt-2">
                        <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                          <div className={`h-full ${passwordStrength.color} transition-all duration-300`} style={{ width: passwordStrength.width }}></div>
                        </div>
                        <p
                          className={`text-xs mt-1 ${
                            passwordStrength.strength === 'Weak' ? 'text-red-500' : passwordStrength.strength === 'Medium' ? 'text-yellow-600' : 'text-green-600'
                          }`}
                        >
                          {passwordStrength.strength}
                        </p>
                      </div>
                    )}

                    {/* Password form error */}
                    {errors.password && <FormError message={errors.password.message} />}
                  </div>

                  {/* Terms and Conditions */}
                  <p className="text-sm text-gray-600">
                    By creating an account, you agree to our{' '}
                    <a href="#" className="text-blue-500 hover:text-blue-600">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-blue-500 hover:text-blue-600">
                      Privacy Policy
                    </a>
                    .
                  </p>

                  {/* Submit Button */}
                  <button
                    disabled={mutation.isPending}
                    type="submit"
                    className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors ${
                      mutation.isPending && 'cursor-not-allowed bg-blue-300/50'
                    }`}
                  >
                    Create My Account
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
