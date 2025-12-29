'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

interface PaginationProps {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  basePath: string; // e.g., '/my-applications', '/jobs', '/admin/users'
  itemName?: string; // e.g., 'applications', 'jobs', 'users' (default: 'items')
  emptyMessage?: string; // Custom message when no items found
}

export default function Pagination({ pagination, basePath, itemName = 'items', emptyMessage }: PaginationProps) {
  const sp = useSearchParams();
  const router = useRouter();
  const currentPage = parseInt(sp.get('page') || String(pagination.page));
  const currentLimit = parseInt(sp.get('limit') || String(pagination.limit));

  const updateURL = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(sp);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    router.replace(`${basePath}?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      updateURL({ page: newPage === 1 ? null : String(newPage) });
    }
  };

  const goToPrevious = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const goToNext = () => {
    if (currentPage < pagination.totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const { totalPages } = pagination;

    if (totalPages <= 5) {
      // Show all pages if 5 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      // Show pages around current page
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      // Always show last page
      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  // Calculate the range of items being shown
  const startItem = (currentPage - 1) * currentLimit + 1;
  const endItem = Math.min(currentPage * currentLimit, pagination.total);

  // Don't render if there's only one page or no items
  if (pagination.totalPages <= 1 || pagination.total === 0) {
    return (
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          {pagination.total === 0 ? (
            emptyMessage || `No ${itemName} found`
          ) : (
            <>
              Showing <span className="font-medium">{startItem}</span> to <span className="font-medium">{endItem}</span> of <span className="font-medium">{pagination.total}</span>{' '}
              {itemName}
            </>
          )}
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between">
      <p className="text-gray-600">
        Showing <span className="font-medium">{startItem}</span> to <span className="font-medium">{endItem}</span> of <span className="font-medium">{pagination.total}</span>{' '}
        {itemName}
      </p>

      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <button
          onClick={goToPrevious}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>

        {/* Page Numbers */}
        {getPageNumbers().map((pageNum, index) =>
          pageNum === '...' ? (
            <span key={`ellipsis-${index}`} className="px-2 text-gray-600">
              ...
            </span>
          ) : (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum as number)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentPage === pageNum ? 'bg-blue-600 text-white' : 'hover:bg-gray-50 text-gray-700 border border-gray-200'
              }`}
              aria-label={`Go to page ${pageNum}`}
              aria-current={currentPage === pageNum ? 'page' : undefined}
            >
              {pageNum}
            </button>
          ),
        )}

        {/* Next Button */}
        <button
          onClick={goToNext}
          disabled={currentPage >= pagination.totalPages}
          className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Next page"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
}
