'use client';

import {
  ArrowLeft,
  ArrowRight,
  HelpCircle,
  Link2,
  Mail,
  MapPin,
  Phone,
  User,
} from 'lucide-react';
import React, { useState } from 'react';
import { useApplicationContext } from '../provider';

export default function DetailsPage() {
  const { step, setStep, formData, setFormData, formRef } =
    useApplicationContext();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const canProceed =
    formData.firstName &&
    formData.lastName &&
    formData.email &&
    formData.phone &&
    formData.location;

  const handleNextStep = () => {
    setStep(3);
    formRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handlePreviousStep = () => {
    setStep(1);
    formRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div
      className={`min-h-screen absolute top-0 left-0 w-full bg-gray-50 transition-all ease-in-out duration-300 ${
        step === 2
          ? 'opacity-100 translate-y-0 z-20 block'
          : 'opacity-0 translate-y-full -z-10 hidden'
      }`}
    >
      <div className='max-w-4xl mx-auto px-6 py-12 h-full'>
        {/* Progress Section */}
        <div className='mb-8'>
          <p className='text-sm font-semibold text-blue-600 mb-2'>
            STEP 2 OF 5
          </p>
          <h1 className='text-2xl font-bold text-gray-900 mb-4'>
            Personal Information
          </h1>

          <div className='flex items-center gap-3'>
            <div className='flex-1 h-2 bg-blue-600 rounded-full'></div>
            <div className='flex-1 h-2 bg-blue-600 rounded-full'></div>
            <div className='flex-1 h-2 bg-gray-200 rounded-full'></div>
            <div className='flex-1 h-2 bg-gray-200 rounded-full'></div>
            <span className='text-sm font-semibold text-gray-900 ml-2'>
              50%
            </span>
          </div>
        </div>

        {/* Form Card */}
        <div className='bg-white rounded-lg shadow-sm p-8 mb-6'>
          <h2 className='text-2xl font-bold text-gray-900 mb-2'>About You</h2>
          <p className='text-gray-600 mb-8'>
            Please provide your details so we can contact you regarding your
            application.
          </p>

          <div className='space-y-6'>
            {/* First Name & Last Name */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label className='block text-sm font-semibold text-gray-900 mb-2'>
                  First Name
                </label>
                <input
                  type='text'
                  name='firstName'
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder='Jane'
                  className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900'
                />
              </div>
              <div>
                <label className='block text-sm font-semibold text-gray-900 mb-2'>
                  Last Name
                </label>
                <input
                  type='text'
                  name='lastName'
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder='Doe'
                  className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900'
                />
              </div>
            </div>

            {/* Email & Phone */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label className='block text-sm font-semibold text-gray-900 mb-2'>
                  Email Address
                </label>
                <div className='relative'>
                  <Mail className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
                  <input
                    type='email'
                    name='email'
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder='jane.doe@example.com'
                    className='w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900'
                  />
                </div>
              </div>
              <div>
                <label className='text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2'>
                  Phone Number
                  <HelpCircle className='w-4 h-4 text-gray-400' />
                </label>
                <div className='relative'>
                  <Phone className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
                  <input
                    type='tel'
                    name='phone'
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder='+1 (555) 000-0000'
                    className='w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900'
                  />
                </div>
              </div>
            </div>

            {/* Location & LinkedIn */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label className='block text-sm font-semibold text-gray-900 mb-2'>
                  Current Location
                </label>
                <div className='relative'>
                  <MapPin className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
                  <input
                    type='text'
                    name='location'
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder='City, Country'
                    className='w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900'
                  />
                </div>
              </div>
              <div>
                <label className='block text-sm font-semibold text-gray-900 mb-2'>
                  LinkedIn Profile{' '}
                  <span className='text-gray-400 font-normal'>(Optional)</span>
                </label>
                <div className='relative'>
                  <Link2 className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
                  <input
                    type='text'
                    name='linkedin'
                    value={formData.linkedin}
                    onChange={handleInputChange}
                    placeholder='linkedin.com/in/jane-doe'
                    className='w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-400'
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className='flex items-center justify-between mt-8 pt-6 border-t border-gray-200'>
            <button
              type='button'
              onClick={handlePreviousStep}
              className='flex items-center gap-2 px-5 py-2.5 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors'
            >
              <ArrowLeft className='w-5 h-5' />
              Back
            </button>
            <button
              type='button'
              disabled={!canProceed}
              onClick={handleNextStep}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-colors ${
                canProceed
                  ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Continue
              <ArrowRight className='w-5 h-5' />
            </button>
          </div>
        </div>

        {/* Footer Links */}
        <div className='flex justify-center gap-6 text-sm text-gray-500'>
          <a href='#' className='hover:text-gray-700'>
            Privacy Policy
          </a>
          <a href='#' className='hover:text-gray-700'>
            Terms of Service
          </a>
        </div>
      </div>
    </div>
  );
}
