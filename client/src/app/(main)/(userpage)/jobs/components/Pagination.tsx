import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

export default function Pagination({ totalPages, currentPage, buildPageLink }: { totalPages: number; currentPage: number; buildPageLink: (page: number) => string }) {
  return (
    <>
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <a href={buildPageLink(Math.max(1, currentPage - 1))} className="p-2 hover:bg-white rounded-lg transition-colors disabled:opacity-50" aria-disabled={currentPage === 1}>
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </a>

          <span className="px-3 py-2 rounded-lg bg-white border text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>

          <a
            href={buildPageLink(Math.min(totalPages, currentPage + 1))}
            className="p-2 hover:bg-white rounded-lg transition-colors disabled:opacity-50"
            aria-disabled={currentPage === totalPages}
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </a>
        </div>
      )}
    </>
  );
}
