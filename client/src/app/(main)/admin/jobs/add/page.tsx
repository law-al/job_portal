/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useActionState, useEffect } from 'react';
import { X, Plus, Trash2, AlertCircle } from 'lucide-react';
import AppBreadCrumb from '@/components/AppBreadCrumb';
import { useSession } from 'next-auth/react';
import { createJobAction } from '@/app/actions/job.actions';
import { fetchWithRetry } from '@/lib/fetchWithRetry';

interface PipelineStage {
  id: string;
  name: string;
  order: number;
}

const initialState = {
  errors: undefined as string | Record<string, string[]> | undefined,
};

export default function AddJobPage() {
  const { data: session } = useSession();
  const [state, formAction, isPending] = useActionState(
    createJobAction,
    initialState
  );

  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [salary, setSalary] = useState('');
  const [applicationDeadline, setApplicationDeadline] = useState('');
  const [description, setDescription] = useState('');
  const [slot, setSlot] = useState('');
  const [pipelineName, setPipelineName] = useState('');
  const [selectedPipeline, setSelectedPipeline] = useState<string>('');
  const [isRemote, setIsRemote] = useState(false);

  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>([]);

  // Pipeline related state
  const [availablePipelines, setAvailablePipelines] = useState<string[]>([]);
  const [isLoadingPipelines, setIsLoadingPipelines] = useState(false);
  const [isLoadingStages, setIsLoadingStages] = useState(false);
  const [pipelineStages, setPipelineStages] = useState<PipelineStage[]>([
    { id: '1', name: 'Applied', order: 1 },
    { id: '2', name: 'Screening', order: 2 },
  ]);
  const [isPipelineDisabled, setIsPipelineDisabled] = useState(false);

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills((prev) => [...prev, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills((prev) => prev.filter((skill) => skill !== skillToRemove));
  };

  // Pipeline stage functions
  const addPipelineStage = () => {
    const newStage: PipelineStage = {
      id: Date.now().toString(),
      name: '',
      order: pipelineStages.length + 1,
    };
    setPipelineStages([...pipelineStages, newStage]);
  };

  const updateStageName = (id: string, name: string) => {
    setPipelineStages(
      pipelineStages.map((stage) =>
        stage.id === id ? { ...stage, name } : stage
      )
    );
  };

  const removeStage = (id: string) => {
    const updatedStages = pipelineStages
      .filter((stage) => stage.id !== id)
      .map((stage, index) => ({ ...stage, order: index + 1 }));
    setPipelineStages(updatedStages);
  };

  const moveStageUp = (index: number) => {
    if (index === 0) return;
    const newStages = [...pipelineStages];
    [newStages[index - 1], newStages[index]] = [
      newStages[index],
      newStages[index - 1],
    ];
    // Update order numbers
    newStages.forEach((stage, idx) => {
      stage.order = idx + 1;
    });
    setPipelineStages(newStages);
  };

  const moveStageDown = (index: number) => {
    if (index === pipelineStages.length - 1) return;
    const newStages = [...pipelineStages];
    [newStages[index], newStages[index + 1]] = [
      newStages[index + 1],
      newStages[index],
    ];
    // Update order numbers
    newStages.forEach((stage, idx) => {
      stage.order = idx + 1;
    });
    setPipelineStages(newStages);
  };

  // Fetch available pipelines on mount
  useEffect(() => {
    const fetchPipelines = async () => {
      if (!session?.user?.companyId || !session?.user?.accessToken) return;

      setIsLoadingPipelines(true);
      try {
        const response = await fetchWithRetry({
          url: `jobs/${(session.user as any).companyId}/pipelines`,
          options: {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${(session.user as any).accessToken}`,
            },
            credentials: 'include',
          },
          refreshTokenHash: (session.user as any).refreshTokenHash,
        });

        if (response.ok) {
          const data = await response.json();
          setAvailablePipelines(data.data?.pipelines || []);
        }
      } catch (error) {
        console.error('Error fetching pipelines:', error);
      } finally {
        setIsLoadingPipelines(false);
      }
    };

    fetchPipelines();
  }, [session]);

  // Fetch pipeline stages when a pipeline is selected
  useEffect(() => {
    const fetchPipelineStages = async () => {
      if (
        !selectedPipeline ||
        !session?.user?.companyId ||
        !session?.user?.accessToken
      ) {
        return;
      }

      setIsLoadingStages(true);
      try {
        const response = await fetchWithRetry({
          url: `jobs/${
            (session.user as any).companyId
          }/pipeline/stages?pipelineName=${encodeURIComponent(
            selectedPipeline
          )}`,
          options: {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${(session.user as any).accessToken}`,
            },
            credentials: 'include',
          },
          refreshTokenHash: (session.user as any).refreshTokenHash,
        });

        if (response.ok) {
          const data = await response.json();
          const stages = data.data?.stages || [];
          if (stages.length > 0) {
            setPipelineStages(
              stages.map(
                (stage: { name: string; order: number }, index: number) => ({
                  id: (index + 1).toString(),
                  name: stage.name,
                  order: stage.order,
                })
              )
            );
            setPipelineName(selectedPipeline);
            setIsPipelineDisabled(true);
          } else {
            // If no stages found, allow editing
            setIsPipelineDisabled(false);
          }
        }
      } catch (error) {
        console.error('Error fetching pipeline stages:', error);
      } finally {
        setIsLoadingStages(false);
      }
    };

    if (selectedPipeline && selectedPipeline !== 'new') {
      fetchPipelineStages();
    } else if (selectedPipeline === 'new') {
      // Reset to default stages for new pipeline
      setPipelineStages([
        { id: '1', name: 'Applied', order: 1 },
        { id: '2', name: 'Screening', order: 2 },
      ]);
      setPipelineName('');
      setIsPipelineDisabled(false);
    }
  }, [selectedPipeline, session]);

  // Helper function to get error message for a field
  const getFieldError = (fieldName: string): string | undefined => {
    if (typeof state.errors === 'object' && state.errors !== null) {
      const fieldErrors = state.errors[fieldName];
      return Array.isArray(fieldErrors) ? fieldErrors[0] : undefined;
    }
    return undefined;
  };

  return (
    <>
      {/* Breadcrumb */}
      <div className='bg-white border-b border-gray-200 px-8 py-4'>
        <AppBreadCrumb
          items={[
            { label: 'Jobs Management', href: '/admin/jobs' },
            { label: 'Add New Job' }
          ]}
          homeHref="/admin"
          className="mb-2"
        />
        <h1 className='text-3xl font-bold text-gray-900'>Post a New Job</h1>
      </div>

      {/* Main Content Area */}
      <main className='flex-1 overflow-y-auto p-8'>
        <div className='max-w-4xl mx-auto'>
          <div className='bg-white rounded-xl border border-gray-200 p-8'>
            {/* Error Message */}
            {state.errors && typeof state.errors === 'string' && (
              <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3'>
                <AlertCircle className='w-5 h-5 text-red-600 flex-shrink-0 mt-0.5' />
                <p className='text-sm text-red-800'>{state.errors}</p>
              </div>
            )}

            <form action={formAction} className='space-y-6'>
              {/* Job Title */}
              <div>
                <label
                  htmlFor='jobTitle'
                  className='block text-sm font-medium text-gray-900 mb-2'
                >
                  Job Title <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  id='jobTitle'
                  name='jobTitle'
                  placeholder='e.g. Senior Product Designer'
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                    getFieldError('title')
                      ? 'border-red-300'
                      : 'border-gray-300'
                  }`}
                />
                {getFieldError('title') && (
                  <p className='mt-1 text-sm text-red-600'>
                    {getFieldError('title')}
                  </p>
                )}
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
                    placeholder='e.g. San Francisco, CA or Remote'
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                      getFieldError('location')
                        ? 'border-red-300'
                        : 'border-gray-300'
                    }`}
                  />
                  {getFieldError('location') && (
                    <p className='mt-1 text-sm text-red-600'>
                      {getFieldError('location')}
                    </p>
                  )}
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
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    required
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white ${
                      getFieldError('jobType')
                        ? 'border-red-300'
                        : 'border-gray-300'
                    }`}
                  >
                    <option value=''>Select job type</option>
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
                  {getFieldError('jobType') && (
                    <p className='mt-1 text-sm text-red-600'>
                      {getFieldError('jobType')}
                    </p>
                  )}
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
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    required
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white ${
                      getFieldError('experienceLevel')
                        ? 'border-red-300'
                        : 'border-gray-300'
                    }`}
                  >
                    <option value=''>Select experience level</option>
                    <option value='INTERN'>Intern</option>
                    <option value='ENTRY'>Entry Level</option>
                    <option value='JUNIOR'>Junior</option>
                    <option value='MID'>Mid Level</option>
                    <option value='SENIOR'>Senior Level</option>
                    <option value='LEAD'>Lead/Principal</option>
                  </select>
                  {getFieldError('experienceLevel') && (
                    <p className='mt-1 text-sm text-red-600'>
                      {getFieldError('experienceLevel')}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor='salary'
                    className='block text-sm font-medium text-gray-900 mb-2'
                  >
                    Salary Range
                  </label>
                  <input
                    type='text'
                    id='salary'
                    name='salary'
                    placeholder='e.g. $100,000 - $150,000'
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none'
                  />
                </div>
              </div>

              {/* Application Deadline & Slot */}
              <div className='grid grid-cols-2 gap-6'>
                <div>
                  <label
                    htmlFor='applicationDeadline'
                    className='block text-sm font-medium text-gray-900 mb-2'
                  >
                    Application Deadline
                  </label>
                  <input
                    type='date'
                    id='applicationDeadline'
                    name='applicationDeadline'
                    value={applicationDeadline}
                    onChange={(e) => setApplicationDeadline(e.target.value)}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none'
                  />
                </div>
                <div>
                  <label
                    htmlFor='slot'
                    className='block text-sm font-medium text-gray-900 mb-2'
                  >
                    Number of Positions (Slot)
                  </label>
                  <input
                    type='number'
                    id='slot'
                    name='slot'
                    min='1'
                    placeholder='e.g. 5'
                    value={slot}
                    onChange={(e) => setSlot(e.target.value)}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none'
                  />
                </div>
              </div>

              {/* Remote Work Type */}
              <div>
                <label className='block text-sm font-medium text-gray-900 mb-2'>
                  Work Type
                </label>
                <div className='flex items-center gap-3 h-[48px]'>
                  <label className='flex items-center gap-2 cursor-pointer'>
                    <input
                      type='checkbox'
                      name='isRemote'
                      checked={isRemote}
                      onChange={(e) => setIsRemote(e.target.checked)}
                      className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
                    />
                    <span className='text-sm text-gray-700'>Remote</span>
                  </label>
                </div>
              </div>

              {/* Pipeline Stages */}
              <div>
                <label className='block text-sm font-medium text-gray-900 mb-2'>
                  Hiring Pipeline Stages <span className='text-red-500'>*</span>
                </label>
                <p className='text-sm text-gray-600 mb-3'>
                  Select an existing pipeline or create a new one
                </p>

                {/* Pipeline Select */}
                <div className='mb-4'>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Select Pipeline
                  </label>
                  <select
                    value={selectedPipeline}
                    onChange={(e) => setSelectedPipeline(e.target.value)}
                    disabled={isLoadingPipelines}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    <option value=''>Select a pipeline or create new</option>
                    <option value='new'>Create New Pipeline</option>
                    {availablePipelines.map((pipeline) => (
                      <option key={pipeline} value={pipeline}>
                        {pipeline}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Pipeline Name Input - Only show when creating new */}
                {selectedPipeline === 'new' && (
                  <div className='mb-4'>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Pipeline Name <span className='text-red-500'>*</span>
                    </label>
                    <input
                      type='text'
                      name='pipelineName'
                      value={pipelineName}
                      onChange={(e) => setPipelineName(e.target.value)}
                      placeholder='e.g., Software Engineer Hiring Pipeline'
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none'
                    />
                  </div>
                )}

                {/* Loading indicator for stages */}
                {isLoadingStages && (
                  <div className='mb-4 text-sm text-gray-600'>
                    Loading pipeline stages...
                  </div>
                )}

                {/* Hidden input for pipelineName when existing pipeline is selected */}
                {selectedPipeline && selectedPipeline !== 'new' && (
                  <input
                    type='hidden'
                    name='pipelineName'
                    value={selectedPipeline}
                  />
                )}

                <div className='space-y-3'>
                  {pipelineStages.map((stage, index) => (
                    <div
                      key={stage.id}
                      className='flex items-center gap-3 p-3 border border-gray-300 rounded-lg bg-gray-50'
                    >
                      {/* Order Number */}
                      <div className='flex items-center gap-2'>
                        <span className='text-sm font-semibold text-gray-600 w-6'>
                          {stage.order}.
                        </span>
                        {/* Drag Handle (Visual only) */}
                        <div className='flex flex-col gap-0.5 cursor-move'>
                          <button
                            type='button'
                            onClick={() => moveStageUp(index)}
                            disabled={index === 0}
                            className='text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed'
                          >
                            <ChevronRight
                              size={16}
                              className='rotate-[-90deg]'
                            />
                          </button>
                          <button
                            type='button'
                            onClick={() => moveStageDown(index)}
                            disabled={index === pipelineStages.length - 1}
                            className='text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed'
                          >
                            <ChevronRight size={16} className='rotate-90' />
                          </button>
                        </div>
                      </div>
                      {/* Stage Name Input */}
                      <input
                        type='text'
                        value={stage.name}
                        onChange={(e) =>
                          updateStageName(stage.id, e.target.value)
                        }
                        placeholder={`Stage ${stage.order} name`}
                        disabled={isPipelineDisabled}
                        className='flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50'
                      />
                      {/* Delete Button */}
                      <button
                        type='button'
                        onClick={() => removeStage(stage.id)}
                        disabled={
                          pipelineStages.length <= 2 || isPipelineDisabled
                        }
                        className='p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed'
                        title='Remove stage'
                      >
                        <Trash2 size={18} />
                      </button>
                      <input type='hidden' name='stages[]' value={stage.name} />
                      <input
                        type='hidden'
                        name='stageOrder[]'
                        value={stage.order}
                      />
                    </div>
                  ))}
                </div>
                {/* Add Stage Button */}
                <button
                  type='button'
                  onClick={addPipelineStage}
                  disabled={isPipelineDisabled}
                  className='mt-3 w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  <Plus size={20} />
                  Add Another Stage
                </button>
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
                  rows={6}
                  placeholder='Describe the role, responsibilities, and what makes this position exciting...'
                  name='description'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none ${
                    getFieldError('description')
                      ? 'border-red-300'
                      : 'border-gray-300'
                  }`}
                />
                {getFieldError('description') && (
                  <p className='mt-1 text-sm text-red-600'>
                    {getFieldError('description')}
                  </p>
                )}
              </div>

              {/* Skills */}
              <div>
                <label
                  htmlFor='skills'
                  className='block text-sm font-medium text-gray-900 mb-2'
                >
                  Required Skills
                </label>
                <div className='flex gap-2 mb-3'>
                  <input
                    type='text'
                    id='skills'
                    placeholder='e.g. Figma, React, TypeScript'
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === 'Enter' && (e.preventDefault(), addSkill())
                    }
                    className='flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none'
                  />
                  <button
                    type='button'
                    onClick={addSkill}
                    className='px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors'
                  >
                    Add
                  </button>
                </div>
                {skills.length > 0 && (
                  <div className='flex flex-wrap gap-2'>
                    {skills.map((skill, index) => (
                      <div key={index}>
                        <span
                          key={index}
                          className='inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium'
                        >
                          {skill}
                          <button
                            type='button'
                            onClick={() => removeSkill(skill)}
                            className='hover:text-blue-900'
                          >
                            <X size={14} />
                          </button>
                        </span>

                        <input type='hidden' name='skills[]' value={skill} />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className='flex gap-4 pt-4 border-t border-gray-200'>
                <button
                  type='button'
                  className='flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors'
                >
                  Save as Draft
                </button>
                <button
                  type='submit'
                  disabled={isPending}
                  className='flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {isPending ? 'Posting...' : 'Post Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
