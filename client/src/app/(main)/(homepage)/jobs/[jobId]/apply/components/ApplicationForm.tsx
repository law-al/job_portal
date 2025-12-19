'use client';

import React from 'react';
import DetailsPage from './DetailsPage';
import ResumeUpload from './ResumeUpload';
import SupportingDocuments from './SupportingDocuments';
import ReviewApplication from './ReviewApplication';
import { useApplicationContext } from '../provider';

export default function ApplicationForm({ jobId }: { jobId: string }) {
  const { formRef } = useApplicationContext();
  return (
    <div>
      <form className="relative" ref={formRef}>
        <ResumeUpload />
        <DetailsPage />
        <SupportingDocuments />
        <ReviewApplication jobId={jobId} />
      </form>
    </div>
  );
}
