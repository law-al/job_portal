import React from 'react';
import { ChevronRight } from 'lucide-react';

const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

export default function ApplicationDetailLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb Skeleton */}
      <div className="px-6 py-4 bg-white border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-32" />
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6 h-[calc(100vh-100px)] overflow-y-auto">
        {/* Header Skeleton */}
        <div className="bg-white rounded-lg p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {/* Avatar Skeleton */}
              <Skeleton className="w-16 h-16 rounded-full" />
              <div>
                <Skeleton className="h-7 w-48 mb-2" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
            {/* Action Button Skeleton */}
            <Skeleton className="h-10 w-32" />
          </div>

          {/* Info Cards Skeleton */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-4">
                <Skeleton className="h-8 w-20 mb-2" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 h-full">
          {/* Left Column */}
          <div className="col-span-2 space-y-6">
            {/* AI Application Review Skeleton */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Skeleton className="w-5 h-5 rounded" />
                  <Skeleton className="h-6 w-40" />
                </div>
                <Skeleton className="h-9 w-32" />
              </div>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-6" />
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Skeleton className="w-24 h-24 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-32 mb-2" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <div className="space-y-2 ml-6">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                  <div>
                    <Skeleton className="h-4 w-28 mb-2" />
                    <div className="space-y-2 ml-6">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information Skeleton */}
            <div className="bg-white rounded-lg p-6">
              <Skeleton className="h-6 w-40 mb-4" />
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="w-5 h-5 rounded" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                ))}
              </div>
            </div>

            {/* Resume Preview Skeleton */}
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-8 w-24" />
              </div>
              <div className="border border-gray-200 rounded-lg bg-gray-50 h-96 flex items-center justify-center">
                <Skeleton className="h-12 w-12 rounded-full" />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Current Stage Skeleton */}
            <div className="bg-white rounded-lg p-6">
              <Skeleton className="h-4 w-24 mb-3" />
              <Skeleton className="h-12 w-full mb-4" />
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex flex-col items-center gap-2 p-3">
                    <Skeleton className="w-5 h-5 rounded" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                ))}
              </div>
            </div>

            {/* Team Notes Skeleton */}
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="flex gap-3">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Timeline Skeleton */}
            <div className="bg-white rounded-lg p-6">
              <Skeleton className="h-4 w-32 mb-4" />
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <Skeleton className="w-2 h-2 rounded-full" />
                      {i < 3 && <Skeleton className="w-0.5 h-full mt-1" />}
                    </div>
                    <div className="flex-1 pb-4">
                      <Skeleton className="h-4 w-40 mb-1" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                ))}
              </div>
              <Skeleton className="h-4 w-24 mt-2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
