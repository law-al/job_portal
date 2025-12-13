'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Edit, Plus } from 'lucide-react';
import React, { useState } from 'react';

import {
  Users,
  ChevronDown,
  MapPin,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link,
  Image,
} from 'lucide-react';

const JobEditDialog = () => {
  const [jobTitle, setJobTitle] = useState('Senior Software Engineer');
  const [jobDescription, setJobDescription] = useState(
    "We are looking for a talented Senior Software Engineer to join our dynamic team. The ideal candidate will be responsible for developing high-quality applications, designing and implementing testable and scalable code. You'll work closely with our product and design teams to build new features and improve existing ones."
  );
  const [requirements, setRequirements] = useState(
    '- 5+ years of experience in software development.\n- Proficiency in JavaScript, React, and Node.js.\n- Experience with cloud services (AWS, Google Cloud, Azure).\n- Strong understanding of data structures and algorithms.'
  );
  const [minSalary, setMinSalary] = useState('120000');
  const [maxSalary, setMaxSalary] = useState('160000');
  const [location, setLocation] = useState('San Francisco, CA');
  const [jobType, setJobType] = useState('Full-time');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      alert('Changes saved successfully!');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <DialogContent className='sm:max-w-4xl max-h-[90vh] overflow-y-auto'>
      <DialogHeader>
        <DialogTitle>Edit Job</DialogTitle>
        <DialogDescription>
          Update the job details and requirements below. Any changes made will
          be immediately visible on the job posting.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit}>
        <div className='space-y-6 py-4'>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            {/* Left Column */}
            <div className='lg:col-span-2 space-y-6'>
              {/* Job Title */}
              <div className='space-y-2'>
                <label
                  htmlFor='jobTitle'
                  className='text-sm font-medium text-gray-900'
                >
                  Job Title
                </label>
                <input
                  type='text'
                  id='jobTitle'
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none'
                  required
                />
              </div>

              {/* Job Description */}
              <div className='space-y-2'>
                <label
                  htmlFor='jobDescription'
                  className='text-sm font-medium text-gray-900'
                >
                  Job Description
                </label>

                <textarea
                  id='jobDescription'
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={6}
                  className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none'
                  required
                />
              </div>

              {/* Requirements */}
              <div className='space-y-2'>
                <label
                  htmlFor='requirements'
                  className='text-sm font-medium text-gray-900'
                >
                  Requirements
                </label>
                <textarea
                  id='requirements'
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  rows={6}
                  className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none'
                  required
                />
              </div>
            </div>

            {/* Right Column */}
            <div className='space-y-6'>
              {/* Salary Range */}
              <div className='space-y-2'>
                <label className='text-sm font-medium text-gray-900'>
                  Salary Range
                </label>
                <div className='space-y-3'>
                  <div className='space-y-2'>
                    <label
                      htmlFor='minSalary'
                      className='block text-xs text-gray-500'
                    >
                      Min
                    </label>
                    <div className='flex gap-2'>
                      <input
                        type='text'
                        id='minSalary'
                        value={minSalary}
                        onChange={(e) => setMinSalary(e.target.value)}
                        className='flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none'
                      />
                      <select className='px-3 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none'>
                        <option>USD</option>
                        <option>EUR</option>
                        <option>GBP</option>
                      </select>
                    </div>
                  </div>
                  <div className='space-y-2'>
                    <label
                      htmlFor='maxSalary'
                      className='block text-xs text-gray-500'
                    >
                      Max
                    </label>
                    <div className='flex gap-2'>
                      <input
                        type='text'
                        id='maxSalary'
                        value={maxSalary}
                        onChange={(e) => setMaxSalary(e.target.value)}
                        className='flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none'
                      />
                      <select className='px-3 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none'>
                        <option>USD</option>
                        <option>EUR</option>
                        <option>GBP</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className='space-y-2'>
                <label
                  htmlFor='location'
                  className='text-sm font-medium text-gray-900'
                >
                  Location
                </label>
                <div className='relative'>
                  <MapPin className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
                  <input
                    type='text'
                    id='location'
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className='w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none'
                  />
                </div>
              </div>

              {/* Job Type */}
              <div className='space-y-2'>
                <label
                  htmlFor='jobType'
                  className='text-sm font-medium text-gray-900'
                >
                  Job Type
                </label>
                <div className='relative'>
                  <select
                    id='jobType'
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    className='w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none'
                  >
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>Internship</option>
                  </select>
                  <ChevronDown className='absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none' />
                </div>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <button
              type='button'
              className='px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
            >
              Cancel
            </button>
          </DialogClose>
          <button
            type='submit'
            disabled={isSubmitting}
            className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default function EditJob() {
  return (
    <Dialog>
      <DialogTrigger className='cursor-pointer flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors'>
        <Edit size={18} />
        Edit Job
      </DialogTrigger>
      <JobEditDialog />
    </Dialog>
  );
}
