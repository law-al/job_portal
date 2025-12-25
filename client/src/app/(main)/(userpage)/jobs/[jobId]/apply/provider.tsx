'use client';
import { sendApplicationAction } from '@/app/actions/applications.actions';
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, createContext, useState, useRef, useTransition } from 'react';
import { toast } from 'sonner';

interface SupportingDocument {
  id: number;
  name: string;
  size: string;
  status: string;
  progress: number;
  file: File | null;
}

interface UploadedResume {
  id: string;
  key: string;
  originalName: string;
  size: number;
  url: string;
}

interface UploadedSupportingDocument {
  id: string;
  key: string;
  originalName: string;
  size: number;
  url: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  resume: UploadedResume | null;
  existingResumeId: string | null;
  coverLetter: string | null;
  supportingDocuments: UploadedSupportingDocument[] | null;
  checkedTerms: boolean;
}

interface ApplicationContextType {
  step: number;
  formData: FormData;
  canProceed: boolean;
  setFormData: (formData: FormData) => void;
  setStep: (step: number) => void;
  isPending: boolean;
  sendApplication: (formData: FormData, jobId: string) => void;
  formRef: React.RefObject<HTMLFormElement | null>;
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

export const ApplicationProvider = ({ children }: { children: React.ReactNode }) => {
  const [step, setStep] = useState(1);
  const formRef = useRef<HTMLFormElement | null>(null);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    resume: null,
    existingResumeId: null,
    coverLetter: '',
    supportingDocuments: [],
    checkedTerms: false,
  });
  const [isPending, startTransition] = useTransition();

  const canProceed = (formData.firstName && formData.lastName && formData.email && formData.phone && formData.location && formData.resume && formData.checkedTerms) as boolean;

  // Send application
  const sendApplication = (formData: FormData, jobId: string) => {
    console.log({
      ...formData,
      resumeId: formData.resume?.id ?? '',
      supportingDocumentIds: formData.supportingDocuments?.map((doc) => doc.id) ?? [],
    });
    startTransition(async () => {
      const response = await sendApplicationAction(
        {
          ...formData,
          resumeId: formData.resume?.id ?? '',
          supportingDocumentIds: formData.supportingDocuments?.map((doc) => doc.id) ?? [],
        },
        jobId,
      );


      // if (response.success) {
      //   toast.success(
      //     response.message || 'Application submitted successfully'
      //   );
      //   setFormData({
      //     ...formData,
      //     firstName: '',
      //     lastName: '',
      //     email: '',
      //     phone: '',
      //     location: '',
      //     linkedin: '',
      //     resume: null,
      //     existingResumeId: null,
      //     coverLetter: null,
      //     supportingDocuments: [],
      //     checkedTerms: false,
      //   });
      //   setStep(1);
      //   formRef.current?.reset();
      // } else {
      //   toast.error(response.errors || 'Failed to submit application');
      // }
    });
  };

  return (
    <ApplicationContext.Provider
      value={{
        step,
        formData,
        setFormData,
        setStep,
        formRef,
        canProceed,
        isPending,
        sendApplication,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};

export const useApplicationContext = () => {
  const context = useContext(ApplicationContext);
  if (!context) {
    throw new Error('useApplicationContext must be used within an ApplicationProvider');
  }
  return context;
};
