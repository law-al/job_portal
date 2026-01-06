/**
 * Common types used across the application
 */

// Pagination types
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginationProps {
  pagination: Pagination;
  basePath: string;
  itemName?: string;
  emptyMessage?: string;
}

// Breadcrumb types
export interface BreadcrumbItemType {
  label: string;
  href?: string;
}

// Search params (common query parameters)
export interface SearchParams {
  search?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  [key: string]: string | undefined;
}

// Form error types
export interface FormErrorProps {
  errors?: string | Record<string, string[]>;
  className?: string;
}

// Stat/Card types
export interface Stat {
  label: string;
  value: string;
  change: string;
  positive: boolean;
  neutral?: boolean;
}

// Error types
export interface ErrorType {
  error: {
    message: string;
    statusCode?: number;
  };
  reset: () => void;
}
