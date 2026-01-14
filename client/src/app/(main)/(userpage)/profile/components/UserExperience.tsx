'use client';

import React from 'react';
import ExperienceDialog from './ExperienceDialog';

interface Experience {
  title: string;
  company: string;
  location?: string;
  startDate: string | Date;
  endDate?: string | Date | null;
  description?: string;
  isCurrent?: boolean;
}

interface UserExperienceProps {
  experiences?: Experience[];
}

export default function UserExperience({ experiences = [] }: UserExperienceProps) {
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
        <h3 className="text-xl font-bold text-gray-900">Experience</h3>
        <ExperienceDialog
          initialData={
            experiences.length > 0
              ? experiences.map((exp) => ({
                  ...exp,
                  startDate: typeof exp.startDate === 'string' ? exp.startDate : exp.startDate.toISOString(),
                  endDate: exp.endDate ? (typeof exp.endDate === 'string' ? exp.endDate : exp.endDate.toISOString()) : null,
                }))
              : undefined
          }
        />
      </div>

      {experiences.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No experience added yet. Click &quot;Add Role&quot; to get started.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {experiences.map((experience, index) => (
            <div key={index} className="relative pl-8 pb-6 border-l-2 border-gray-200 last:border-l-0 last:pb-0">
              <div className="absolute -left-2 top-0 w-4 h-4 bg-gray-300 rounded-full"></div>

              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-gray-900">{experience.title}</h4>
                  <p className="text-gray-600">
                    {experience.company}
                    {experience.location && <span className="text-gray-400"> • {experience.location}</span>}
                  </p>
                </div>
                <span className="text-sm text-gray-500">{formatDateRange(experience.startDate, experience.endDate, experience.isCurrent)}</span>
              </div>

              {experience.description && <p className="text-gray-700 text-sm mt-2">{experience.description}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
