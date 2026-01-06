/**
 * User-related types
 */

// User data types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role?: 'HR' | 'RECRUITER' | 'EMPLOYER' | 'JOB_SEEKER';
  status?: 'ACTIVE' | 'SUSPENDED' | 'REMOVED' | 'BLOCKED';
  createdAt?: Date | string;
  isVerified?: boolean;
  companyId?: string;
  companyRole?: string;
}

// User response types
export interface UserResponse {
  success: boolean;
  message: string;
  data: Array<{
    id: string;
    role: 'HR' | 'RECRUITER' | 'EMPLOYER';
    status: 'ACTIVE' | 'SUSPENDED' | 'REMOVED' | 'BLOCKED';
    createdAt: Date;
    user: {
      email: string;
      id: string;
      firstName: string;
      lastName: string;
    };
  }>;
}

// Company member
export interface CompanyMember {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status?: string;
}
