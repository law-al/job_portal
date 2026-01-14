'use client';

import React from 'react';
import EducationDialog from './EducationDialog';

interface Education {
  degree: string;
  institution: string;
  fieldOfStudy?: string;
  startDate: string | Date;
  endDate?: string | Date | null;
  isCurrent?: boolean;
}

interface UserEducationProps {
  education?: Education[];
}

export default function UserEducation({ education = [] }: UserEducationProps) {
  const formatDate = (date: string | Date | null | undefined): string => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  const formatDateRange = (startDate: string | Date, endDate?: string | Date | null, isCurrent?: boolean): string => {
    const start = formatDate(startDate);
    if (isCurrent || !endDate) {
      return `${start} - Present`;
    }
    const end = formatDate(endDate);
    return `${start} - ${end}`;
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Education</h3>
        <EducationDialog
          initialData={
            education.length > 0
              ? education.map((edu) => ({
                  ...edu,
                  startDate: typeof edu.startDate === 'string' ? edu.startDate : edu.startDate.toISOString(),
                  endDate: edu.endDate ? (typeof edu.endDate === 'string' ? edu.endDate : edu.endDate.toISOString()) : null,
                }))
              : undefined
          }
        />
      </div>

      {education.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No education added yet. Click &quot;Add Education&quot; to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {education.map((edu, index) => (
            <div key={index} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-xl">🎓</span>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 mb-1">
                  {edu.degree}
                  {edu.fieldOfStudy && <span className="text-gray-600 font-normal"> in {edu.fieldOfStudy}</span>}
                </h4>
                <p className="text-sm text-gray-600">
                  {edu.institution} • {formatDateRange(edu.startDate, edu.endDate, edu.isCurrent)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
