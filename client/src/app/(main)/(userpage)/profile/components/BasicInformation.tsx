'use client';

import React from 'react';
import BasicInfoDialog from './BasicInfoDialog';

interface BasicInformationProps {
  basicInfo?: {
    firstName?: string | null;
    lastName?: string | null;
    professionalHeadline?: string | null;
    aboutMe?: string | null;
  };
}

export default function BasicInformation({ basicInfo }: BasicInformationProps) {
  const firstName = basicInfo?.firstName || 'Not set';
  const lastName = basicInfo?.lastName || 'Not set';
  const professionalHeadline = basicInfo?.professionalHeadline || 'Not set';
  const aboutMe = basicInfo?.aboutMe || 'Not set';

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Basic Information</h3>
        <BasicInfoDialog
          initialData={{
            firstName: basicInfo?.firstName || null,
            lastName: basicInfo?.lastName || null,
            professionalHeadline: basicInfo?.professionalHeadline || null,
            aboutMe: basicInfo?.aboutMe || null,
          }}
          onSuccess={() => console.log('Basic information updated')}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
          <div className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700">{firstName}</div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
          <div className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700">{lastName}</div>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Professional Headline</label>
        <div className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700">{professionalHeadline}</div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">About Me</label>
        <div className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 min-h-[120px] whitespace-pre-wrap">{aboutMe}</div>
      </div>
    </div>
  );
}
