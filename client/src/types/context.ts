/**
 * Context-related types
 */

// System settings context
export interface SystemSettingsContextType {
  tab: 'general' | 'authentication' | 'email' | 'roles' | 'features' | 'maintenance';
  setTab: (tab: 'general' | 'authentication' | 'email' | 'roles' | 'features' | 'maintenance') => void;
  editEmailTemplate: boolean;
  setEditEmailTemplate: (editEmailTemplate: boolean) => void;
}

// My applications context
export interface MyApplicationsContextType {
  tab: 'all' | 'interviewing' | 'pending' | 'archived';
  setTab: (tab: 'all' | 'interviewing' | 'pending' | 'archived') => void;
  sortBy: 'Last Updated' | 'Newest' | 'Oldest';
  setSortBy: (sortBy: 'Last Updated' | 'Newest' | 'Oldest') => void;
}

// Application form context
export interface ApplicationContextType {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    resume: File | null;
    coverLetter: string;
    supportingDocuments: File[];
  };
  setFormData: React.Dispatch<React.SetStateAction<ApplicationContextType['formData']>>;
  uploadedResume: {
    key: string;
    url: string;
    originalName: string;
  } | null;
  setUploadedResume: React.Dispatch<React.SetStateAction<ApplicationContextType['uploadedResume']>>;
  uploadedSupportingDocuments: Array<{
    key: string;
    url: string;
    originalName: string;
  }>;
  setUploadedSupportingDocuments: React.Dispatch<React.SetStateAction<ApplicationContextType['uploadedSupportingDocuments']>>;
}
