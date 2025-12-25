'use client';

import React, { useState } from 'react';
import {
  Bell,
  Mail,
  Phone,
  Globe,
  Upload,
  X,
  Plus,
  Edit2,
  Trash2,
} from 'lucide-react';

export default function MyProfile() {
  const [skills, setSkills] = useState([
    'Figma',
    'User Research',
    'Prototyping',
    'HTML/CSS',
    'Design Systems',
  ]);
  const [newSkill, setNewSkill] = useState('');
  const [profileStrength, setProfileStrength] = useState(85);

  const addSkill = () => {
    if (newSkill.trim()) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-6 py-8'>
        <div className='mb-8'>
          <h1 className='text-4xl font-bold text-gray-900 mb-2'>My Profile</h1>
          <p className='text-gray-600'>
            Manage your professional identity and preferences.
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Left Sidebar */}
          <div className='space-y-6'>
            {/* Profile Card */}
            <div className='bg-white rounded-lg p-6 shadow-sm text-center'>
              <div className='w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200'>
                <img
                  src='/api/placeholder/128/128'
                  alt='Alex Johnson'
                  className='w-full h-full object-cover'
                />
              </div>
              <h2 className='text-xl font-bold text-gray-900 mb-1'>
                Alex Johnson
              </h2>
              <p className='text-gray-600 mb-4'>Senior Product Designer</p>

              <div className='flex items-center justify-center gap-2 text-sm text-gray-600 mb-4'>
                <Globe className='w-4 h-4' />
                <span>San Francisco, CA</span>
              </div>

              <div className='space-y-3 text-left mb-6'>
                <div className='flex items-center gap-3 text-sm text-gray-700'>
                  <Mail className='w-4 h-4 text-gray-400' />
                  <span>alex.johnson@example.com</span>
                </div>
                <div className='flex items-center gap-3 text-sm text-gray-700'>
                  <Phone className='w-4 h-4 text-gray-400' />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className='flex items-center gap-3 text-sm'>
                  <Globe className='w-4 h-4 text-gray-400' />
                  <a href='#' className='text-blue-600 hover:underline'>
                    alexdesign.com
                  </a>
                </div>
              </div>

              <button className='w-full py-2 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors'>
                Edit Contact Info
              </button>
            </div>

            {/* Resume Upload */}
            <div className='bg-white rounded-lg p-6 shadow-sm'>
              <h3 className='text-lg font-bold text-gray-900 mb-4'>Resume</h3>

              <div className='border-2 border-dashed border-blue-300 rounded-lg p-6 text-center mb-4 bg-blue-50'>
                <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3'>
                  <Upload className='w-6 h-6 text-blue-600' />
                </div>
                <button className='text-blue-600 font-medium hover:underline mb-1'>
                  Click to upload
                </button>
                <p className='text-xs text-gray-500'>PDF, DOCX up to 10MB</p>
              </div>

              <div className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg'>
                <div className='w-10 h-10 bg-red-100 rounded flex items-center justify-center flex-shrink-0'>
                  <span className='text-red-600 font-bold text-xs'>PDF</span>
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-medium text-gray-900 truncate'>
                    Alex_CV_2023.pdf
                  </p>
                  <p className='text-xs text-gray-500'>Added 2 days ago</p>
                </div>
                <button className='text-gray-400 hover:text-red-600'>
                  <Trash2 className='w-4 h-4' />
                </button>
              </div>
            </div>

            {/* Profile Strength */}
            <div className='bg-blue-600 rounded-lg p-6 shadow-sm text-white'>
              <h3 className='text-lg font-bold mb-2'>Profile Strength</h3>
              <p className='text-sm text-blue-100 mb-4'>
                Complete your profile to appear in more searches.
              </p>

              <div className='mb-2'>
                <div className='h-2 bg-blue-400 rounded-full overflow-hidden'>
                  <div
                    className='h-full bg-white transition-all duration-300'
                    style={{ width: `${profileStrength}%` }}
                  ></div>
                </div>
              </div>

              <div className='text-right text-sm font-semibold'>
                {profileStrength}% Complete
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className='lg:col-span-2 space-y-6'>
            {/* Basic Information */}
            <div className='bg-white rounded-lg p-6 shadow-sm'>
              <h3 className='text-xl font-bold text-gray-900 mb-6'>
                Basic Information
              </h3>

              <div className='grid grid-cols-2 gap-4 mb-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    First Name
                  </label>
                  <input
                    type='text'
                    defaultValue='Alex'
                    className='w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Last Name
                  </label>
                  <input
                    type='text'
                    defaultValue='Johnson'
                    className='w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>
              </div>

              <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Professional Headline
                </label>
                <input
                  type='text'
                  defaultValue='Senior Product Designer | UX Specialist'
                  className='w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  About Me
                </label>
                <textarea
                  rows='5'
                  defaultValue='Passionate Product Designer with over 7 years of experience in building digital products for web and mobile. I specialize in UI/UX, Design Systems, and Prototyping. My goal is to create meaningful experiences that solve real user problems.'
                  className='w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none'
                />
              </div>
            </div>

            {/* Skills */}
            <div className='bg-white rounded-lg p-6 shadow-sm'>
              <h3 className='text-xl font-bold text-gray-900 mb-4'>Skills</h3>

              <div className='flex flex-wrap gap-2 mb-4'>
                {skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className='inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm'
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(skill)}
                      className='hover:text-blue-800'
                    >
                      <X className='w-3 h-3' />
                    </button>
                  </span>
                ))}
              </div>

              <div className='flex gap-2'>
                <input
                  type='text'
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                  placeholder='Add a skill (e.g. React, Photoshop)'
                  className='flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
                <button
                  onClick={addSkill}
                  className='p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                >
                  <Plus className='w-5 h-5' />
                </button>
              </div>
            </div>

            {/* Experience */}
            <div className='bg-white rounded-lg p-6 shadow-sm'>
              <div className='flex items-center justify-between mb-6'>
                <h3 className='text-xl font-bold text-gray-900'>Experience</h3>
                <button className='flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700'>
                  <Plus className='w-4 h-4' />
                  Add Role
                </button>
              </div>

              <div className='space-y-6'>
                {/* Experience Item 1 */}
                <div className='relative pl-8 pb-6 border-l-2 border-blue-600'>
                  <div className='absolute -left-2 top-0 w-4 h-4 bg-blue-600 rounded-full'></div>

                  <div className='flex items-start justify-between mb-2'>
                    <div>
                      <h4 className='text-lg font-bold text-gray-900'>
                        Senior Product Designer
                      </h4>
                      <p className='text-gray-600'>
                        TechFlow Inc.{' '}
                        <span className='text-gray-400'>
                          • San Francisco, CA
                        </span>
                      </p>
                    </div>
                    <span className='text-sm text-gray-500'>
                      2021 - Present
                    </span>
                  </div>

                  <p className='text-gray-700 text-sm'>
                    Leading the design of the core SaaS platform. Managed a team
                    of 3 junior designers and established the company's first
                    design system.
                  </p>
                </div>

                {/* Experience Item 2 */}
                <div className='relative pl-8 border-l-2 border-gray-200'>
                  <div className='absolute -left-2 top-0 w-4 h-4 bg-gray-300 rounded-full'></div>

                  <div className='flex items-start justify-between mb-2'>
                    <div>
                      <h4 className='text-lg font-bold text-gray-900'>
                        Product Designer
                      </h4>
                      <p className='text-gray-600'>
                        Creative Solutions Agency{' '}
                        <span className='text-gray-400'>• New York, NY</span>
                      </p>
                    </div>
                    <span className='text-sm text-gray-500'>2018 - 2021</span>
                  </div>

                  <p className='text-gray-700 text-sm'>
                    Worked with various clients to deliver mobile and web
                    applications. Responsible for end-to-end design process from
                    wireframing to high-fidelity prototypes.
                  </p>
                </div>
              </div>
            </div>

            {/* Education */}
            <div className='bg-white rounded-lg p-6 shadow-sm'>
              <div className='flex items-center justify-between mb-6'>
                <h3 className='text-xl font-bold text-gray-900'>Education</h3>
                <button className='flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700'>
                  <Plus className='w-4 h-4' />
                  Add Education
                </button>
              </div>

              <div className='flex items-start gap-4 p-4 border border-gray-200 rounded-lg'>
                <div className='w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0'>
                  <span className='text-xl'>🎓</span>
                </div>
                <div className='flex-1'>
                  <h4 className='font-bold text-gray-900 mb-1'>
                    Bachelor of Fine Arts in Interaction Design
                  </h4>
                  <p className='text-sm text-gray-600'>
                    California College of the Arts • 2014 - 2018
                  </p>
                </div>
                <button className='text-gray-400 hover:text-gray-600'>
                  <Edit2 className='w-4 h-4' />
                </button>
              </div>
            </div>

            {/* Certifications */}
            <div className='bg-white rounded-lg p-6 shadow-sm'>
              <div className='flex items-center justify-between mb-6'>
                <h3 className='text-xl font-bold text-gray-900'>
                  Certifications
                </h3>
                <button className='flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700'>
                  <Plus className='w-4 h-4' />
                  Add Certification
                </button>
              </div>

              <div className='space-y-3'>
                <div className='flex items-start gap-4 p-4 border border-gray-200 rounded-lg'>
                  <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0'>
                    <span className='text-xl'>📜</span>
                  </div>
                  <div className='flex-1'>
                    <h4 className='font-bold text-gray-900 mb-1'>
                      Google UX Design Professional Certificate
                    </h4>
                    <p className='text-sm text-gray-600'>
                      Google • Issued 2023
                    </p>
                  </div>
                  <button className='text-gray-400 hover:text-gray-600'>
                    <Edit2 className='w-4 h-4' />
                  </button>
                </div>

                <div className='flex items-start gap-4 p-4 border border-gray-200 rounded-lg'>
                  <div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0'>
                    <span className='text-xl'>✓</span>
                  </div>
                  <div className='flex-1'>
                    <h4 className='font-bold text-gray-900 mb-1'>
                      Certified Usability Analyst (CUA)
                    </h4>
                    <p className='text-sm text-gray-600'>
                      Human Factors International • Issued 2021
                    </p>
                  </div>
                  <button className='text-gray-400 hover:text-gray-600'>
                    <Edit2 className='w-4 h-4' />
                  </button>
                </div>
              </div>
            </div>

            {/* Save Footer */}
            <div className='bg-white rounded-lg p-4 shadow-sm flex items-center justify-between'>
              <p className='text-sm text-gray-500'>
                Last saved: Today at 10:42 AM
              </p>
              <div className='flex gap-3'>
                <button className='px-6 py-2 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors'>
                  Cancel
                </button>
                <button className='px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors'>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
