/**
 * Job-related types
 */

import { Pagination } from './common';

// Job data types
export interface Job {
  id: string;
  slug: string;
  title: string;
  companyId: string;
  company?: {
    id: string;
    name: string;
    logo?: string | null;
  } | null;
  location: string;
  salary_range?: string | null;
  jobType?: string | null;
  experienceLevel?: string | null;
  isRemote?: boolean | null;
  status?: string | null;
  isClosed?: boolean | null;
  deadline?: string | null;
  createdAt?: string;
  description?: string;
  requirements?: string;
  benefits?: string;
}

// Job Card Props
export interface JobCardProps {
  id: string;
  slug: string;
  title: string;
  company?: string;
  location: string;
  salary_range?: string | null;
  jobType?: string;
  experienceLevel?: string;
  isRemote?: boolean;
  status?: string;
  isClosed?: boolean;
  deadline?: string | null;
  createdAt?: string;
  buttonText?: string;
  buttonHref?: string;
  onButtonClick?: () => void;
  className?: string;
}

// Job search params
export interface JobSearchParams {
  search?: string;
  location?: string;
  jobType?: string;
  experienceLevel?: string;
  page?: string;
  limit?: string;
  isRemote?: string;
}

// Job response types
export interface GetAllJobsResponse {
  success: boolean;
  message: string;
  data: {
    jobs: Job[];
    pagination: Pagination;
  };
}

export interface JobResponse {
  success: boolean;
  message: string;
  data: Job;
}

// Transformed job (for admin views)
export interface TransformedJob {
  id: string;
  title: string;
  status: string;
  applications: number;
  createdAt: string;
  slug: string;
  isClosed: boolean;
}

// Pipeline stage
export interface PipelineStage {
  id: string;
  name: string;
  order: number;
  jobId: string;
}

// Job detail page props
export interface JobDetailPageProps {
  params: Promise<{
    jobId: string;
  }>;
}

// Edit job page props
export interface EditJobPageProps {
  params: Promise<{
    jobId: string;
  }>;
}

// Job data for header
export interface JobData {
  title: string;
  company: {
    name: string;
    logo?: string | null;
  };
  location: string;
  jobType: string;
  experienceLevel: string;
  isRemote: boolean;
  salary_range?: string | null;
}
