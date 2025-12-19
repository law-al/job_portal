'use client';

import React, { useState } from 'react';
import { ArrowLeft, Edit2, FileText, Mail, Phone, MapPin, Globe, Briefcase, GraduationCap, Award, CheckCircle2, Loader2, ImageIcon } from 'lucide-react';
import { useApplicationContext } from '../provider';
import Link from 'next/link';

export default function ReviewApplication({ jobId }: { jobId: string }) {
  const { step, setStep, formData, setFormData, formRef, canProceed, sendApplication, isPending } = useApplicationContext();

  const [isSubmitted, setIsSubmitted] = useState(false);

  const getFileIcon = (filename: string | undefined) => {
    if (!filename) return <FileText className="w-5 h-5 text-red-600" />;
    const extension = filename.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(extension ?? '')) {
      return <ImageIcon className="w-5 h-5 text-blue-600" />;
    }
    return <FileText className="w-5 h-5 text-red-600" />;
  };

  const handleSubmit = async () => {
    await sendApplication(formData, jobId);
  };

  return (
    <div
      className={`min-h-screen absolute top-0 left-0 w-full bg-gray-50 transition-all ease-in-out duration-300 ${
        step === 4 ? 'opacity-100 translate-y-0 z-40 block' : 'opacity-0 translate-y-full -z-10 hidden'
      }`}
    >
      <div className="max-w-4xl mx-auto px-6 py-12 h-full">
        {/* Progress Section */}
        <div className="mb-8">
          <p className="text-sm font-semibold text-blue-600 mb-2">STEP 5 OF 5</p>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Review your application</h1>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-blue-600 rounded-full"></div>
            <div className="flex-1 h-2 bg-blue-600 rounded-full"></div>
            <div className="flex-1 h-2 bg-blue-600 rounded-full"></div>
            <div className="flex-1 h-2 bg-blue-600 rounded-full"></div>
            <span className="text-sm font-semibold text-blue-600 ml-2">100%</span>
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Review your application</h1>
          <p className="text-gray-600">Please review all information before submitting. You can edit any section by clicking the edit button.</p>
        </div>

        {/* Job Summary Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border-l-4 border-blue-600">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-teal-100 rounded-lg flex items-center justify-center text-2xl shrink-0">💼</div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-1">Senior Product Designer</h2>
              <p className="text-gray-600 mb-2">TechFlow Inc. • San Francisco, CA (Remote)</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full">Full-time</span>
                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full">Design</span>
                <span className="px-3 py-1 bg-green-50 text-green-600 text-sm rounded-full">$120k - $150k</span>
              </div>
            </div>
          </div>
        </div>

        {/* Resume */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Resume/CV</h3>
            <button type="button" onClick={() => setStep(1)} className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700">
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
          </div>

          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 bg-red-100 rounded flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">{formData.resume?.originalName || 'No resume uploaded'}</p>
              <p className="text-sm text-gray-500">{formData.resume?.size ? (formData.resume?.size / 1024).toFixed(2) : 0} KB</p>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
            <button type="button" onClick={() => setStep(2)} className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700">
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">Full Name</label>
              <p className="text-gray-900 font-medium">
                {formData.firstName} {formData.lastName}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">Email Address</label>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <p className="text-gray-900">{formData.email}</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">Phone Number</label>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <p className="text-gray-900">{formData.phone}</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">Location</label>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <p className="text-gray-900">{formData.location}</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">LinkedIn Profile</label>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-gray-400" />
                <Link href={formData.linkedin} className="text-blue-600 hover:underline">
                  {formData.linkedin || 'No LinkedIn profile provided'}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Cover Letter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Cover Letter</h3>
            <button type="button" onClick={() => setStep(3)} className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700">
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            {formData.coverLetter ? (
              <p className="text-gray-700 text-sm leading-relaxed">{formData.coverLetter}</p>
            ) : (
              <p className="text-gray-700 text-sm leading-relaxed">No cover letter provided</p>
            )}
          </div>
        </div>

        {/* Additional Documents */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Additional Documents</h3>
            <button type="button" onClick={() => setStep(3)} className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700">
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
          </div>

          <div className="space-y-3">
            {formData.supportingDocuments && formData.supportingDocuments.length > 0 ? (
              formData.supportingDocuments?.map((document) => (
                <div key={document.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center shrink-0">{getFileIcon(document.originalName)}</div>
                  <div>
                    <p className="font-semibold text-gray-900">{document.originalName}</p>
                    <p className="text-sm text-gray-500">{document.size ? (document.size / 1024).toFixed(2) : 0} KB</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-700 text-sm leading-relaxed">No additional documents provided</p>
            )}
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.checkedTerms}
              onChange={(e) => setFormData({ ...formData, checkedTerms: e.target.checked })}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
            />
            <span className="text-sm text-gray-700">
              I confirm that all information provided is accurate and complete. I understand that any false information may result in the rejection of my application or termination
              of employment if hired.
            </span>
          </label>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <button type="button" onClick={() => setStep(3)} className="flex items-center gap-2 px-5 py-3 text-gray-700 font-medium hover:bg-white rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <button
            type="button"
            disabled={!formData.checkedTerms || isPending}
            onClick={handleSubmit}
            className={`px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl ${
              !formData.checkedTerms || isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
            {' '}
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Application'}
          </button>
        </div>
      </div>
    </div>
  );
}
