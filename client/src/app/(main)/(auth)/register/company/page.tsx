'use client';

import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Eye, EyeOff, Upload, Users, Zap, Building2, X } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FormError from '@/components/FormError';
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { AxiosError } from 'axios';
import EmailVerification from '@/components/EmailVerification';
import { signIn } from 'next-auth/react';

const MAX_FILE_SIZE = 500000;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

export const companySignUpSchema = z.object({
  name: z
    .string()
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name must be less than 100 characters')
    .trim(),

  email: z
    .string()
    .email('Please enter a valid email address')
    .toLowerCase()
    .trim(),

  address: z
    .string()
    .min(5, 'Please enter a valid address')
    .max(200, 'Address must be less than 200 characters')
    .trim(),

  website: z
    .string()
    .url('Must be a valid URL')
    .max(255, 'Website URL must be less than 255 characters'),

  description: z
    .string()
    .min(20, 'Description must be at least 20 characters')
    .max(500, 'Description must be less than 500 characters')
    .trim(),

  logo: z
    .instanceof(File, { message: 'A company logo is required.' })
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      `Max file size is ${MAX_FILE_SIZE / 1000}KB.`
    )
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      'Only .jpg, .jpeg, .png, and .webp formats are supported.'
    ),

  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),

  agreedToTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
});

export type CompanySignUpFormData = z.infer<typeof companySignUpSchema>;

export default function CompanyProfileSignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [logoFile, setLogoFile] = useState<File | undefined>();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [registrationSuccess, setRegistrationSuccess] =
    useState<boolean>(false);
  const [registrationSuccessMessage, setRegistrationSuccessMessage] =
    useState<string>('');
  const [registrationFailed, setRegistrationFailed] = useState<boolean>(false);
  const [registrationFailureMessage, setRegistrationFailureMessage] =
    useState<string>('');
  const [formPass, setFormPass] = useState<string>('');
  const imageRef = useRef<HTMLInputElement>(null);

  const registerMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await api.post('/auth/register-company', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.data;
    },
    onSuccess: async (data) => {
      setRegistrationSuccessMessage(data.email);
      setRegistrationSuccess(true);
      setRegistrationFailed(false);
      setRegistrationFailureMessage('');

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
    },
    onError: (error: AxiosError) => {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      const errorResponse = (error.response as any)?.data;
      const errorMessage =
        errorResponse?.message ||
        error.message ||
        'Registration failed. Please try again.';
      setRegistrationFailed(true);
      setRegistrationFailureMessage(errorMessage);
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CompanySignUpFormData>({
    resolver: zodResolver(companySignUpSchema),
  });

  useEffect(() => {
    return () => {
      if (logoPreview) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview]);

  const handleImageClick = () => {
    if (!imageRef || !imageRef.current) return;
    imageRef.current.click();
  };

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const imageFile = event.target.files?.[0];
    if (!imageFile) {
      setValue('logo', undefined as any);
      return;
    }
    setValue('logo', imageFile);
    if (logoPreview) {
      URL.revokeObjectURL(logoPreview);
    }
    if (imageFile) {
      const imageURL = URL.createObjectURL(imageFile);
      setLogoPreview(imageURL);
    } else {
      setLogoPreview(null);
    }
  };

  const agreedToTerms = watch('agreedToTerms');

  const onSubmit = (data: CompanySignUpFormData) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('address', data.address);
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('website', data.website);
    formData.append('logo', data.logo);

    setFormPass(data.password);

    registerMutation.mutate(formData);
  };

  return (
    <>
      {registrationSuccess ? (
        <EmailVerification userEmail={registrationSuccessMessage} />
      ) : (
        <div className='min-h-screen bg-gray-50'>
          {/* Header */}
          <header className='bg-white border-b border-gray-200 px-6 py-4'>
            <div className='max-w-7xl mx-auto flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <div className='w-8 h-8 bg-blue-500 rounded'></div>
                <span className='text-xl font-bold text-gray-900'>
                  JobPortal
                </span>
              </div>
              <div className='flex items-center gap-3'>
                <span className='text-sm text-gray-600'>
                  Already have an account?
                </span>
                <Button
                  asChild
                  className='px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors'
                >
                  <Link href='/login'>Log In</Link>
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className='max-w-7xl mx-auto px-6 py-12'>
            <div className='grid lg:grid-cols-2 gap-12 items-start'>
              {/* Left Column - Form */}
              <div>
                <div className='mb-8'>
                  <h1 className='text-4xl font-bold text-gray-900 mb-3'>
                    Create Your Company Profile
                  </h1>
                  <p className='text-gray-600 text-lg'>
                    Start finding top talent today.
                  </p>

                  {registrationFailed && registrationFailureMessage && (
                    <div className='mt-4 p-3 bg-red-50 border border-red-200 rounded-lg'>
                      <p className='text-sm text-red-800'>
                        {registrationFailureMessage}
                      </p>
                    </div>
                  )}
                </div>

                <form action='' onSubmit={handleSubmit(onSubmit)}>
                  <div className='space-y-6'>
                    {/* Company Name */}
                    <div>
                      <label
                        htmlFor='companyName'
                        className='block text-sm font-medium text-gray-900 mb-2'
                      >
                        Company Name
                      </label>
                      <input
                        type='text'
                        id='companyName'
                        placeholder="Enter your company's name"
                        {...register('name')}
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none'
                      />
                      {errors.name && (
                        <FormError message={errors.name.message} />
                      )}
                    </div>

                    {/* Company Email */}
                    <div>
                      <label
                        htmlFor='companyEmail'
                        className='block text-sm font-medium text-gray-900 mb-2'
                      >
                        Company Email
                      </label>
                      <input
                        type='email'
                        id='companyEmail'
                        placeholder='you@company.com'
                        {...register('email')}
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none'
                      />
                      {errors.email && (
                        <FormError message={errors.email.message} />
                      )}
                    </div>

                    {/* Company Description */}
                    <div>
                      <label
                        htmlFor='companyDescription'
                        className='block text-sm font-medium text-gray-900 mb-2'
                      >
                        Company Description
                      </label>
                      <textarea
                        id='companyDescription'
                        placeholder='Tell us about your company, culture, and what makes you unique...'
                        rows={4}
                        {...register('description')}
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none'
                      />
                      <p className='text-sm text-gray-500 mt-1'>
                        Maximum 500 characters
                      </p>

                      {errors.description && (
                        <FormError message={errors.description.message} />
                      )}
                    </div>

                    {/* Company Address */}
                    <div>
                      <label
                        htmlFor='companyAddress'
                        className='block text-sm font-medium text-gray-900 mb-2'
                      >
                        Company Address
                      </label>
                      <input
                        type='text'
                        id='companyAddress'
                        placeholder="Enter your company's address"
                        {...register('address')}
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none'
                      />
                      {errors.address && (
                        <FormError message={errors.address.message} />
                      )}
                    </div>

                    {/* Company Website */}
                    <div>
                      <label
                        htmlFor='companyWebsite'
                        className='block text-sm font-medium text-gray-900 mb-2'
                      >
                        Company Website
                      </label>
                      <input
                        type='text'
                        id='companyWebsite'
                        placeholder="Enter your company's website"
                        {...register('website')}
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none'
                      />
                      {errors.website && (
                        <FormError message={errors.website.message} />
                      )}
                    </div>

                    {/* Password */}
                    <div>
                      <label
                        htmlFor='password'
                        className='block text-sm font-medium text-gray-900 mb-2'
                      >
                        Password
                      </label>
                      <div className='relative'>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          id='password'
                          placeholder='Create a strong password'
                          {...register('password')}
                          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none pr-12'
                        />
                        <button
                          type='button'
                          onClick={() => setShowPassword(!showPassword)}
                          className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
                        >
                          {showPassword ? (
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

                    {/* Company Logo Upload */}
                    <div>
                      {!logoPreview ? (
                        <div>
                          <label className='block text-sm font-medium text-gray-900 mb-2'>
                            Company Logo
                          </label>
                          <input
                            type='file'
                            accept='image/*'
                            ref={imageRef}
                            onChange={handleImageUpload}
                            className='hidden'
                          />
                          <div
                            onClick={handleImageClick}
                            className='border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-gray-400 transition-colors cursor-pointer'
                          >
                            <Upload className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                            <p className='text-gray-600 mb-1'>
                              <span className='text-gray-900 font-medium'>
                                Click to upload
                              </span>{' '}
                              or drag and drop
                            </p>
                            <p className='text-sm text-gray-500'>
                              SVG, PNG, JPG or GIF (MAX. 800×400px)
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className='border-2 border-gray-300 rounded-lg p-6 relative'>
                          <button
                            type='button'
                            onClick={() => {
                              if (logoPreview) {
                                URL.revokeObjectURL(logoPreview);
                              }
                              setLogoPreview(null);
                              setLogoFile(undefined);
                              setValue('logo', undefined as any);
                              if (imageRef.current) {
                                imageRef.current.value = '';
                              }
                            }}
                            className='absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 transition-colors'
                          >
                            <X size={16} />
                          </button>

                          <div className='flex items-center gap-6'>
                            <div className='shrink-0 w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border border-gray-200'>
                              <Image
                                src={logoPreview}
                                alt='Company logo preview'
                                width={128}
                                height={128}
                                className='w-full h-full object-contain'
                              />
                            </div>

                            <div className='flex-1 min-w-0'>
                              <p className='text-sm font-medium text-gray-900 truncate'>
                                {logoFile?.name}
                              </p>
                              <p className='text-sm text-gray-500 mt-1'>
                                {logoFile && (logoFile.size / 1024).toFixed(2)}{' '}
                                KB
                              </p>
                              <button
                                type='button'
                                onClick={() => {
                                  if (!imageRef || !imageRef.current) return;
                                  imageRef.current.value = '';
                                  imageRef.current.click();
                                }}
                                className='text-sm text-blue-600 hover:text-blue-700 font-medium mt-2'
                              >
                                Change logo
                              </button>
                              <input
                                ref={imageRef}
                                id='logo-upload'
                                type='file'
                                accept='image/*'
                                className='hidden'
                                onChange={handleImageUpload}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                      {errors.logo && (
                        <FormError message={errors.logo.message} />
                      )}
                    </div>

                    {/* Terms Checkbox */}
                    <div>
                      <div className='flex items-start gap-3'>
                        <input
                          type='checkbox'
                          id='terms'
                          {...register('agreedToTerms')}
                          className='mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
                        />
                        <label
                          htmlFor='terms'
                          className='text-sm text-gray-600'
                        >
                          I agree to the{' '}
                          <a
                            href='#'
                            className='text-blue-600 hover:text-blue-700'
                          >
                            Terms of Service
                          </a>{' '}
                          and{' '}
                          <a
                            href='#'
                            className='text-blue-600 hover:text-blue-700'
                          >
                            Privacy Policy
                          </a>
                          .
                        </label>
                      </div>
                      {errors.agreedToTerms && (
                        <FormError message={errors.agreedToTerms.message} />
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      type='submit'
                      disabled={!agreedToTerms || registerMutation.isPending}
                      className={`w-full py-3 rounded-lg font-medium transition-colors bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed`}
                    >
                      Create Account
                    </button>
                  </div>
                </form>
              </div>

              {/* Right Column - Image and Features */}
              <div className='space-y-8'>
                {/* Image */}
                <div className='rounded-2xl overflow-hidden shadow-lg'>
                  <Image
                    src='https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop'
                    alt='Team collaboration'
                    className='w-full h-auto object-cover'
                    width={500}
                    height={500}
                  />
                </div>

                {/* Features */}
                <div className='space-y-6'>
                  {/* Feature 1 */}
                  <div className='flex gap-4'>
                    <div className='shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center'>
                      <Users className='w-6 h-6 text-blue-600' />
                    </div>
                    <div>
                      <h3 className='text-lg font-bold text-gray-900 mb-1'>
                        Access a Curated Talent Pool
                      </h3>
                      <p className='text-gray-600'>
                        Connect with highly skilled professionals actively
                        looking for their next opportunity.
                      </p>
                    </div>
                  </div>

                  {/* Feature 2 */}
                  <div className='flex gap-4'>
                    <div className='shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center'>
                      <Zap className='w-6 h-6 text-blue-600' />
                    </div>
                    <div>
                      <h3 className='text-lg font-bold text-gray-900 mb-1'>
                        Post Jobs in Minutes
                      </h3>
                      <p className='text-gray-600'>
                        Our streamlined process makes it simple and fast to get
                        your job listings live.
                      </p>
                    </div>
                  </div>

                  {/* Feature 3 */}
                  <div className='flex gap-4'>
                    <div className='shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center'>
                      <Building2 className='w-6 h-6 text-blue-600' />
                    </div>
                    <div>
                      <h3 className='text-lg font-bold text-gray-900 mb-1'>
                        Build Your Employer Brand
                      </h3>
                      <p className='text-gray-600'>
                        Showcase your company culture and attract candidates
                        that are the perfect fit.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      )}
    </>
  );
}
