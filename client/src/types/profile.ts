/**
 * Profile-related types
 */

// Experience entry type
export interface Experience {
  title: string;
  company: string;
  location?: string;
  startDate: string | Date;
  endDate?: string | Date | null;
  description?: string;
  isCurrent?: boolean;
}

// Education entry type
export interface Education {
  degree: string;
  institution: string;
  fieldOfStudy?: string;
  startDate: string | Date;
  endDate?: string | Date | null;
  isCurrent?: boolean;
}

// Certification entry type
export interface Certification {
  name: string;
  issuer: string;
  issueDate: string | Date;
  expiryDate?: string | Date | null;
  credentialUrl?: string;
}

// User data included in profile response
export interface ProfileUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  profileImage: string | null;
  isProfileCompleted: boolean;
  hasCompletedProfile: boolean;
}

// Profile data type (from database)
export interface Profile {
  id: string;
  userId: string;
  professionalHeadline: string | null;
  aboutMe: string | null;
  phone: string | null;
  location: string | null;
  linkedin: string | null;
  github: string | null;
  portfolioUrl: string | null;
  resumeId: string[];
  skills: string[];
  preferredLocations: string[];
  expectedSalary: number | null;
  expectedSalaryMax: number | null;
  experiences: Experience[] | null;
  education: Education[] | null;
  certifications: Certification[] | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  user: ProfileUser;
}

// Profile response from API
export interface ProfileResponse {
  success: boolean;
  message: string;
  data: {
    profile: Profile | null;
  };
}
