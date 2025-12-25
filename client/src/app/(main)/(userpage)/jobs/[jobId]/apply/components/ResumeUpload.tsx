'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useState } from 'react';
import { Upload, Folder, ArrowLeft, ArrowRight, File, X, Loader2 } from 'lucide-react';
import { useApplicationContext } from '../provider';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { useAxiosFileUpload, useAxiosFileDelete } from '@/hooks/axiosUpload';
import { useDocumentDelete, useDocumentFetch, useDocumentUpload } from '@/hooks/useDocuments';

interface UploadedResume {
  id: string;
  key: string;
  originalName: string;
  size: number;
  url: string;
}

export default function ResumeUpload() {
  const { step, setStep, formData, setFormData, formRef } = useApplicationContext();

  const { data: session } = useSession();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: uploadedResume, progress, loading: isUploading, uploadDocument } = useDocumentUpload({ session });
  const {
    deleted: deletedResumeStatus,
    loading: isDeleting,
    deleteDocument,
  } = useDocumentDelete({
    session,
  });
  const { documents: existingResumes, loading: isFetchingExistingResumes, refetch } = useDocumentFetch({ session, documentType: 'resumes' });

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    // handleFileUploadToServer(file);
    if (file) {
      setFormData({
        ...formData,
        resume: uploadedResume as unknown as UploadedResume,
        existingResumeId: null,
      });
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('handleFileSelect');
    const file = e.target.files?.[0];
    if (!file) return;
    const fileSize = file.size / 1024;
    if (fileSize > 5000) {
      toast.error('File size must be less than 5MB');
      return;
    }

    const returnedData = await uploadDocument(file, 'resume');

    console.log('uploadedResume', returnedData);
    if (returnedData || uploadedResume) {
      setFormData({
        ...formData,
        resume: returnedData || uploadedResume,
        existingResumeId: null,
      });
      toast.success('File uploaded successfully');
    } else {
      console.log('Got here');
      setFormData({ ...formData, resume: null, existingResumeId: null });
      toast.error('Failed to upload file');
    }
    e.target.value = '';
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeFile = async (id: string | undefined) => {
    if (!id) return;
    const returnedData = await deleteDocument(id);
    console.log('deletedResumeStatus', returnedData);
    if (returnedData || deletedResumeStatus) {
      setFormData({ ...formData, resume: null, existingResumeId: null });
      toast.success('File deleted successfully');
    } else {
      toast.error('Failed to delete file from server');
    }
  };

  const selectExistingResume = (resume: any) => {
    setFormData({ ...formData, resume: null, existingResumeId: resume?.id });
  };

  const handleNextStep = () => {
    setStep(2);
    formRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div
      className={`min-h-screen absolute top-0 left-0 w-full bg-gray-50 transition-all ease-in-out duration-300 ${
        step === 1 ? 'opacity-100 translate-y-0 z-10 block' : 'opacity-0 translate-y-full -z-10 hidden'
      }`}
    >
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Progress Section */}
        <div className="mb-8">
          <p className="text-sm font-semibold text-blue-600 mb-2">STEP 1 OF 5</p>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Resume Upload</h1>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-blue-600 rounded-full"></div>
            <div className="flex-1 h-2 bg-gray-200 rounded-full"></div>
            <div className="flex-1 h-2 bg-gray-200 rounded-full"></div>
            <div className="flex-1 h-2 bg-gray-200 rounded-full"></div>
            <span className="text-sm font-semibold text-gray-900 ml-2">25%</span>
          </div>
        </div>

        {/* Upload Card */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          {/* Upload Section */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Upload your Resume/CV</h1>
            <p className="text-gray-600">Upload your most up-to-date resume to increase your chances of being noticed by recruiters.</p>
          </div>

          {/* Drag and Drop Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}`}
          >
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-gray-500" />
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-2">Drag and drop your file here</h3>
            <p className="text-sm text-gray-500 mb-6">Supported formats: PDF, DOCX, RTF. Max file size: 5MB.</p>

            <input ref={fileInputRef} id="file-upload" type="file" accept=".pdf,.doc,.docx,.rtf,.txt" onChange={handleFileSelect} className="hidden" />

            <button
              type="button"
              onClick={handleBrowseClick}
              className="inline-flex cursor-pointer items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <Folder className="w-5 h-5" />
              Browse Files
            </button>
          </div>

          {isUploading && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded flex items-center justify-center">
                  <Loader2 className="w-5 h-5 text-yellow-600" />
                </div>
              </div>
              <p className="text-sm text-gray-500">{progress}%</p>
            </div>
          )}

          {/* Uploaded File Display */}
          {formData?.resume && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded flex items-center justify-center">
                  <File className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{formData?.resume?.originalName}</p>
                  <p className="text-sm text-gray-500">{formData?.resume?.size ? (formData?.resume?.size / 1024).toFixed(2) : 0} KB</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeFile(formData?.resume?.id)}
                disabled={isDeleting}
                className={`p-1 hover:bg-green-100 rounded transition-colors ${isDeleting ? 'opacity-50 cursor-not-allowed' : 'opacity-100 cursor-pointer'}`}
              >
                {isDeleting ? <Loader2 className="w-5 h-5 text-red-500 animate-spin" /> : <X className="w-5 h-5 text-red-500" />}
              </button>
            </div>
          )}

          <div className="mt-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Or choose from existing resumes</h3>
            <p className="text-gray-600 mb-6">
              {`Select a resume you've previously uploaded to use for this
              application.`}
            </p>

            <div className="space-y-3">
              {isFetchingExistingResumes ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="w-5 h-5 text-gray-500 animate-spin" />
                </div>
              ) : existingResumes && existingResumes.length > 0 ? (
                existingResumes.map((resume: any) => (
                  <div
                    key={resume.id}
                    onClick={() => selectExistingResume(resume)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      formData?.existingResumeId === resume?.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded flex items-center justify-center ${formData?.existingResumeId === resume?.id ? 'bg-blue-100' : 'bg-gray-100'}`}>
                        <File className={`w-5 h-5 ${formData?.existingResumeId === resume?.id ? 'text-blue-600' : 'text-gray-600'}`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{resume.originalName}</p>
                        <p className="text-sm text-gray-500">{resume.createdAt ? new Date(resume.createdAt).toLocaleDateString() : 'N/A'}</p>
                        <p className="text-sm text-gray-500">{resume.size ? (resume.size / 1024).toFixed(2) : 0} KB</p>
                      </div>
                      {formData?.existingResumeId === resume.id && (
                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center">
                  <p className="text-gray-500">No existing resumes found</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8">
            <button type="button" onClick={() => setStep(1)} className="flex items-center gap-2 px-5 py-3 text-gray-700 font-medium hover:bg-white rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <button
              type="button"
              onClick={handleNextStep}
              disabled={!formData?.resume && !formData?.existingResumeId && isFetchingExistingResumes}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                (formData?.resume || formData?.existingResumeId) && !isFetchingExistingResumes
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Next Step
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
