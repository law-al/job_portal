/**
 * Email template-related types
 */

// Email template data
export interface EmailTemplate {
  _id: string;
  id?: string;
  companyId: string;
  templateType: 'welcome' | 'password' | 'application' | 'interview' | 'jobalert' | 'verification' | 'offer' | 'rejection' | 'stage_update' | 'custom';
  name: string;
  description?: string;
  subject: string;
  preheader?: string;
  content: string;
  editorState: string;
  isActive: boolean;
  isDefault: boolean;
  lastEditedBy: string;
  version?: number;
  createdAt: string;
  updatedAt: string;
  icon?: string;
  active?: boolean;
}

// Template for display
export interface Template {
  id: string;
  name: string;
  description: string;
  icon: string;
  active: boolean;
}

export interface TemplateProps {
  templates: Template[];
  selectedTemplate: string;
  onSelectTemplate: (id: string) => void;
}

// Email template form data
export interface EmailTemplateFormData {
  templateType: string;
  name: string;
  description?: string;
  subject: string;
  preheader?: string;
  content: string;
  editorState: string;
  variables?: string[];
  metadata?: {
    fromName?: string;
    fromEmail?: string;
    replyTo?: string;
    backgroundColor?: string;
    textColor?: string;
    buttonColor?: string;
    buttonTextColor?: string;
  };
  isActive?: boolean;
  isDefault?: boolean;
  tags?: string[];
}

// Email template action state
export type EmailTemplateActionState = {
  success?: boolean;
  errors?: string | Record<string, string[]>;
  message?: string;
  data?: EmailTemplate[];
  error?: string;
};

// Editor types
export type BlockType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'paragraph';
export type Format = 'bold' | 'italic' | 'underline';
