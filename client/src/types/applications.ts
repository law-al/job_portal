/**
 * Application-related types
 */

import { Pagination } from './common';
import type { CompanyMember } from './users';

// Application data types
export interface Application {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
  job: {
    id: string;
    title: string;
    slug: string;
    status?: string;
    company: {
      id: string;
      name: string;
    };
  };
  pipelineStage?: {
    id: string;
    name: string;
    order: number;
  } | null;
  resume?: string;
  coverLetter?: string;
  supportingDocuments?: string[];
}

// Application list item (transformed for display)
export interface ApplicationListItem {
  id: string;
  role: string;
  company: string;
  logo: string;
  appliedDate: string;
  status: string;
  statusColor: string;
  jobSlug: string;
}

// Application search params
export interface ApplicationSearchParams {
  tab?: 'all' | 'interviewing' | 'pending' | 'archived';
  sortBy?: 'updated' | 'newest' | 'oldest' | 'Last Updated' | 'Newest' | 'Oldest';
  search?: string;
  page?: string;
  limit?: string;
  status?: string;
  jobId?: string;
}

// Application response types
export interface ApplicationResponse {
  success: boolean;
  data: {
    applications: Application[];
    pagination: Pagination;
  };
}

export interface ApplicationDetailResponse {
  success: boolean;
  data: Application;
}

// Transformed application (for admin table)
export interface TransformedApplication {
  id: string;
  candidate: string;
  job: string;
  status: string;
  appliedDate: string;
  lastActivity: string;
}

// Application list props
export interface ApplicationListProps {
  applications: ApplicationListItem[];
}

// Application pagination props
export interface ApplicationPaginationProps {
  pagination: Pagination;
}

// Application action props
export interface ApplicationActionProps {
  applicationId: string;
  currentStatus: string;
  pipelineStages?: Array<{
    id: string;
    name: string;
    order: number;
  }>;
}

// Application detail page props
export interface ApplicationDetailPageProps {
  params: Promise<{
    applicationId: string;
  }>;
}

// Application data (for dashboard)
export interface ApplicationData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  job: {
    title: string;
    slug: string;
  };
}

// Activity types
export interface Activity {
  id: string;
  type: string;
  message: string;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  actor: {
    id: string;
    email: string;
  } | null;
}

export interface ActivityResponse {
  success: boolean;
  data: Activity[];
}

// Note types
export interface Note {
  id: string;
  content: string;
  author: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
  createdAt: string;
  updatedAt?: string;
}

export interface NotesResponse {
  success: boolean;
  data: Note[];
}

export interface TeamNotesProps {
  applicationId: string;
}

// AI Review types
export interface ResumeAnalysisResult {
  overall_score: number;
  strengths: string[];
  weaknesses: string[];
  skills_match: number;
  experience_match: number;
  education_match: number;
  recommendation: string;
  improvement_suggestions: string[];
}

export interface AIApplicationReviewProps {
  applicationId: string;
  resumeUrl?: string;
}

// Company member is imported from './users'

export interface AssignUserDialogProps {
  applicationId: string;
  currentAssignee?: CompanyMember | null;
  onAssign: (userId: string) => void;
}

// Application form data
export interface ApplicationFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  resume: File | null;
  coverLetter?: string;
  supportingDocuments?: File[];
}

// Supporting documents
export interface SupportingDocument {
  file: File;
  name: string;
  size: number;
  type: string;
}

export interface UploadedResume {
  key: string;
  url: string;
  originalName: string;
}

export interface UploadedSupportingDocument {
  key: string;
  url: string;
  originalName: string;
}
