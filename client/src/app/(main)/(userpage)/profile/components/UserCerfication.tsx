'use client';

import React from 'react';
import CertificationDialog from './CertificationDialog';

interface Certification {
  name: string;
  issuer: string;
  issueDate: string | Date;
  expiryDate?: string | Date | null;
  credentialUrl?: string;
}

interface UserCerficationProps {
  certifications?: Certification[];
}

export default function UserCerfication({ certifications = [] }: UserCerficationProps) {
  const formatDate = (date: string | Date | null | undefined): string => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  const getIcon = (index: number) => {
    const icons = ['📜', '✓', '🏆', '⭐'];
    return icons[index % icons.length];
  };

  const getBgColor = (index: number) => {
    const colors = ['bg-blue-100', 'bg-green-100', 'bg-purple-100', 'bg-yellow-100'];
    return colors[index % colors.length];
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Certifications</h3>
        <CertificationDialog
          initialData={
            certifications.length > 0
              ? certifications.map((cert) => ({
                  ...cert,
                  issueDate: typeof cert.issueDate === 'string' ? cert.issueDate : cert.issueDate.toISOString(),
                  expiryDate: cert.expiryDate ? (typeof cert.expiryDate === 'string' ? cert.expiryDate : cert.expiryDate.toISOString()) : null,
                }))
              : undefined
          }
        />
      </div>

      {certifications.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No certifications added yet. Click &quot;Add Certification&quot; to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {certifications.map((cert, index) => (
            <div key={index} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
              <div className={`w-12 h-12 ${getBgColor(index)} rounded-lg flex items-center justify-center shrink-0`}>
                <span className="text-xl">{getIcon(index)}</span>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 mb-1">{cert.name}</h4>
                <p className="text-sm text-gray-600">
                  {cert.issuer} • Issued {formatDate(cert.issueDate)}
                  {cert.expiryDate && ` • Expires ${formatDate(cert.expiryDate)}`}
                </p>
                {cert.credentialUrl && (
                  <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline mt-1 inline-block">
                    View Credential
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
