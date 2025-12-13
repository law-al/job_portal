'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { updateJobAction } from '@/app/actions/job.actions';
import { toast } from 'sonner';

interface Job {
  id: string;
  title: string;
  slug: string;
  description: string;
  location: string;
  jobType: string;
  experienceLevel: string;
  salary_range: string | null;
  isRemote: boolean;
  slot: number | null;
  deadline: string | null;
}

interface EditJobFormProps {
  job: Job;
  companyId: string;
}

export default function EditJobForm({ job, companyId }: EditJobFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState({
    title: job.title,
    description: job.description,
    location: job.location,
    jobType: job.jobType,
    experienceLevel: job.experienceLevel,
    salary_range: job.salary_range || '',
    isRemote: job.isRemote,
    slot: job.slot?.toString() || '',
    deadline: job.deadline
      ? new Date(job.deadline).toISOString().split('T')[0]
      : '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      const result = await updateJobAction(job.slug, formData);

      if (result.errors) {
        toast.error(
          typeof result.errors === 'string'
            ? result.errors
            : 'Failed to update job'
        );
      } else {
        toast.success('Job updated successfully');
        router.push(`/admin/jobs/${job.slug}`);
        router.refresh();
      }
    });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : type === 'number'
          ? value
          : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      {/* Job Title */}
      <div>
        <label
          htmlFor='title'
          className='block text-sm font-medium text-gray-900 mb-2'
        >
          Job Title <span className='text-red-500'>*</span>
        </label>
        <input
          type='text'
          id='title'
          name='title'
          value={formData.title}
          onChange={handleChange}
          required
          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none'
        />
      </div>

      {/* Location & Job Type */}
      <div className='grid grid-cols-2 gap-6'>
        <div>
          <label
            htmlFor='location'
            className='block text-sm font-medium text-gray-900 mb-2'
          >
            Location <span className='text-red-500'>*</span>
          </label>
          <input
            type='text'
            id='location'
            name='location'
            value={formData.location}
            onChange={handleChange}
            required
            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none'
          />
        </div>
        <div>
          <label
            htmlFor='jobType'
            className='block text-sm font-medium text-gray-900 mb-2'
          >
            Job Type <span className='text-red-500'>*</span>
          </label>
          <select
            id='jobType'
            name='jobType'
            value={formData.jobType}
            onChange={handleChange}
            required
            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white'
          >
            <option value='FULL_TIME'>Full-time</option>
            <option value='PART_TIME'>Part-time</option>
            <option value='CONTRACT'>Contract</option>
            <option value='INTERNSHIP'>Internship</option>
            <option value='TEMPORARY'>Temporary</option>
            <option value='REMOTE'>Remote</option>
            <option value='HYBRID'>Hybrid</option>
            <option value='IN_OFFICE'>In Office</option>
            <option value='FREELANCE'>Freelance</option>
            <option value='VOLUNTEER'>Volunteer</option>
            <option value='CONSULTANT'>Consultant</option>
          </select>
        </div>
      </div>

      {/* Experience Level & Salary */}
      <div className='grid grid-cols-2 gap-6'>
        <div>
          <label
            htmlFor='experienceLevel'
            className='block text-sm font-medium text-gray-900 mb-2'
          >
            Experience Level <span className='text-red-500'>*</span>
          </label>
          <select
            id='experienceLevel'
            name='experienceLevel'
            value={formData.experienceLevel}
            onChange={handleChange}
            required
            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white'
          >
            <option value='INTERN'>Intern</option>
            <option value='ENTRY'>Entry Level</option>
            <option value='JUNIOR'>Junior</option>
            <option value='MID'>Mid Level</option>
            <option value='SENIOR'>Senior Level</option>
            <option value='LEAD'>Lead/Principal</option>
          </select>
        </div>
        <div>
          <label
            htmlFor='salary_range'
            className='block text-sm font-medium text-gray-900 mb-2'
          >
            Salary Range
          </label>
          <input
            type='text'
            id='salary_range'
            name='salary_range'
            value={formData.salary_range}
            onChange={handleChange}
            placeholder='e.g. $100,000 - $150,000'
            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none'
          />
        </div>
      </div>

      {/* Slot & Deadline */}
      <div className='grid grid-cols-2 gap-6'>
        <div>
          <label
            htmlFor='slot'
            className='block text-sm font-medium text-gray-900 mb-2'
          >
            Number of Positions
          </label>
          <input
            type='number'
            id='slot'
            name='slot'
            value={formData.slot}
            onChange={handleChange}
            min='1'
            placeholder='e.g. 5'
            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none'
          />
        </div>
        <div>
          <label
            htmlFor='deadline'
            className='block text-sm font-medium text-gray-900 mb-2'
          >
            Application Deadline
          </label>
          <input
            type='date'
            id='deadline'
            name='deadline'
            value={formData.deadline}
            onChange={handleChange}
            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none'
          />
        </div>
      </div>

      {/* Remote Work */}
      <div>
        <label className='flex items-center gap-2 cursor-pointer'>
          <input
            type='checkbox'
            name='isRemote'
            checked={formData.isRemote}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                isRemote: e.target.checked,
              }))
            }
            className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
          />
          <span className='text-sm font-medium text-gray-900'>Remote Work</span>
        </label>
      </div>

      {/* Job Description */}
      <div>
        <label
          htmlFor='description'
          className='block text-sm font-medium text-gray-900 mb-2'
        >
          Job Description <span className='text-red-500'>*</span>
        </label>
        <textarea
          id='description'
          name='description'
          value={formData.description}
          onChange={handleChange}
          rows={8}
          required
          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none'
        />
      </div>

      {/* Action Buttons */}
      <div className='flex gap-4 pt-4 border-t border-gray-200'>
        <button
          type='button'
          onClick={() => router.back()}
          className='flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors'
        >
          Cancel
        </button>
        <button
          type='submit'
          disabled={isPending}
          className='flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {isPending ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
