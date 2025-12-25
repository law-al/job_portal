'use client';

import React, { useRef, useState } from 'react';
import { Upload, ImageIcon, FileText, Image, ArrowLeft, ArrowRight, Trash2, Loader2 } from 'lucide-react';
import { useApplicationContext } from '../provider';
import { useDocumentDelete, useDocumentUpload } from '@/hooks/useDocuments';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

export default function SupportingDocuments() {
  const { data: session } = useSession();
  const { step, setStep, formData, setFormData, formRef } = useApplicationContext();
  const [isDragging, setIsDragging] = useState(false);
  const supportingDocsUploadInputRef = useRef<HTMLInputElement>(null);
  const { uploadDocument, loading: isUploading, progress: uploadProgress } = useDocumentUpload({ session });
  const { deleteDocument, loading: isDeleting, deleted: deletedDocumentStatus } = useDocumentDelete({ session });

  const maxChars = 3000;

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
    const files = Array.from(e.dataTransfer.files || []) as File[];
    handleFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    handleFiles(files);
  };

  const handleFiles = async (files: File[]) => {
    for (const file of files) {
      const returnedData = await uploadDocument(file, 'supporting_document');
      if (returnedData) {
        setFormData({
          ...formData,
          supportingDocuments: [...(formData.supportingDocuments || []), returnedData],
        });
      } else {
        toast.error('Failed to upload file');
      }
    }
  };

  const removeFile = async (fileId: string) => {
    await deleteDocument(fileId.toString());
    if (deletedDocumentStatus) {
      setFormData({
        ...formData,
        supportingDocuments: formData.supportingDocuments?.filter((f) => f.id !== fileId) || [],
      });
    } else {
      toast.error('Failed to delete file');
    }
  };

  const getFileIcon = (filename: string | undefined) => {
    if (!filename) return <FileText className="w-5 h-5 text-red-600" />;
    const extension = filename.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(extension ?? '')) {
      return <ImageIcon className="w-5 h-5 text-blue-600" />;
    }
    return <FileText className="w-5 h-5 text-red-600" />;
  };

  const handleNextStep = () => {
    setStep(4);
    formRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handlePreviousStep = () => {
    setStep(2);
    formRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div
      className={`min-h-screen absolute top-0 left-0 w-full bg-gray-50 transition-all ease-in-out duration-300 ${
        step === 3 ? 'opacity-100 translate-y-0 z-30 block' : 'opacity-0 translate-y-full -z-10 hidden'
      }`}
    >
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Progress Section */}
        <div className="mb-8">
          <p className="text-sm font-semibold text-blue-600 mb-2">STEP 3 OF 5</p>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Supporting Documents</h1>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-blue-600 rounded-full"></div>
            <div className="flex-1 h-2 bg-blue-600 rounded-full"></div>
            <div className="flex-1 h-2 bg-blue-600 rounded-full"></div>
            <div className="flex-1 h-2 bg-gray-200 rounded-full"></div>
            <span className="text-sm font-semibold text-gray-900 ml-2">75%</span>
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Enhance your application</h1>
          <p className="text-gray-600">A cover letter is optional but highly recommended to stand out. Feel free to attach other supporting documents as well.</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          {/* Tabs */}
          <div className="flex gap-6 border-b border-gray-200 mb-6">
            <button type="button" className={`pb-3 font-semibold transition-colors relative text-blue-600 group`}>
              Cover Letter
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
            </button>
          </div>

          {/* Write Cover Letter Tab */}
          <div>
            <textarea
              value={formData.coverLetter || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  coverLetter: e.target.value.slice(0, maxChars),
                })
              }
              placeholder="Tell us why you are the perfect fit for this role. Mention specific skills and experiences that align with the job description..."
              className="w-full h-64 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-gray-700"
              maxLength={maxChars}
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-gray-500">
                {formData.coverLetter?.length}/{maxChars} characters
              </span>
            </div>
          </div>

          {/* Supporting Documents Section */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Supporting Documents (Optional)</h3>
            <p className="text-gray-600 mb-6">Upload portfolios, references, or transcripts. Max file size 10MB.</p>

            {/* Upload Area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center mb-6 transition-colors ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}
            >
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-6 h-6 text-gray-500" />
              </div>
              <p className="text-gray-700 mb-2">
                <button
                  type="button"
                  onClick={() => supportingDocsUploadInputRef.current && supportingDocsUploadInputRef.current.click()}
                  className="text-blue-600 font-medium hover:underline"
                >
                  Upload a file
                </button>{' '}
                or drag and drop
              </p>
              <p className="text-sm text-gray-500">PDF, DOCX, PNG, JPG up to 10MB</p>
              <input
                id="supporting-docs-upload"
                ref={supportingDocsUploadInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* Uploaded Files List */}
            <div className="space-y-3">
              {isUploading && (
                <div className="flex items-center justify-center ">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              )}
              {formData.supportingDocuments?.length === 0 && (
                <div className="flex items-center justify-center">
                  <p className="text-sm text-gray-500">No files uploaded</p>
                </div>
              )}
              {formData.supportingDocuments?.map((file) => (
                <div key={file.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-white">
                  <div className="w-10 h-10 bg-red-50 rounded flex items-center justify-center shrink-0">{getFileIcon(file.originalName)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{file.originalName}</p>
                    <p className="text-xs text-gray-500">{file.size ? (file.size / 1024).toFixed(2) : 0} KB</p>
                  </div>
                  <button type="button" onClick={() => removeFile(file.id)} className="p-1 hover:bg-gray-100 rounded transition-colors">
                    <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-600" />
                  </button>
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                disabled={isUploading}
                onClick={handlePreviousStep}
                className={`flex items-center gap-2 px-5 py-3 text-gray-700 font-medium hover:bg-white rounded-lg transition-colors ${
                  isUploading ? 'opacity-50 cursor-not-allowed' : 'opacity-100 cursor-pointer'
                }`}
              >
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowLeft className="w-5 h-5" />}
                Back
              </button>
              <button
                type="button"
                disabled={isUploading}
                onClick={handleNextStep}
                className={`flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors ${
                  isUploading ? 'opacity-50 cursor-not-allowed' : 'opacity-100 cursor-pointer'
                }`}
              >
                Review Application
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
