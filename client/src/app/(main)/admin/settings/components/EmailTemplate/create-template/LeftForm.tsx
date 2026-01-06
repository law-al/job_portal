import React from 'react';
import { Settings, SearchIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSession } from 'next-auth/react';

export interface FormData {
  templateType: string;
  name: string;
  companyId: string;
  description: string;
  subject: string;
  preheader: string;
  content: string;
  isActive: boolean;
  isDefault: boolean;
  tags: string[];
  variables: string[];
  fromName: string;
  fromEmail: string;
  replyTo: string;
  backgroundColor: string;
  toEmail: string;
}

export const EMAIL_TEMPLATE_TYPES = [
  { value: 'welcome', name: 'Welcome' },
  { value: 'password', name: 'Password Reset' },
  { value: 'application', name: 'Application' },
  { value: 'interview', name: 'Interview' },
  { value: 'jobalert', name: 'Job Alert' },
  { value: 'verification', name: 'Verification' },
  { value: 'offer', name: 'Offer' },
  { value: 'rejection', name: 'Rejection' },
  { value: 'stage_update', name: 'Stage Update' },
  { value: 'custom', name: 'Custom' },
] as const;

export default function LeftForm({
  formData,
  handleChange,
  handleSelectChange,
  errors,
}: {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  errors?: Record<string, string[]>;
}) {
  const { data: session } = useSession();
  const companyId = session?.user?.companyId;
  return (
    <div className="col-span-3 h-[450px] overflow-y-auto">
      <div className="space-y-6 pr-2">
        {/* Template Details Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-900">Template Details</h3>
            <Settings className="w-4 h-4 text-gray-400" />
          </div>

          <div className="space-y-4">
            {/* Template Name */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Template Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Candidate Welcome V2"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${errors?.name ? 'border-red-500' : 'border-gray-200'}`}
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              {errors?.name && <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>}
            </div>

            {/* Company ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company ID <span className="text-gray-400 text-xs">(Optional)</span>
              </label>
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search Company ID..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                  value={companyId || ''}
                  onChange={handleChange}
                  name="companyId"
                  disabled
                />
              </div>
            </div>

            {/* Template Type */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Template Type</label>
              <Select value={formData.templateType} onValueChange={(value) => handleSelectChange('templateType', value)}>
                <SelectTrigger className={`w-full ${errors?.templateType ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder="Select template type" />
                </SelectTrigger>
                <SelectContent>
                  {EMAIL_TEMPLATE_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors?.templateType && <p className="text-red-500 text-xs mt-1">{errors.templateType[0]}</p>}
            </div>

            {/* Subject Line */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Subject Line <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Welcome to the team!"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                  errors?.subject ? 'border-red-500' : 'border-gray-200'
                }`}
                name="subject"
                value={formData.subject}
                onChange={handleChange}
              />
              {errors?.subject && <p className="text-red-500 text-xs mt-1">{errors.subject[0]}</p>}
            </div>

            {/* Preheader Text */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Preheader Text</label>
              <input
                type="text"
                placeholder="Preview text shown in inbox"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                name="preheader"
                value={formData.preheader}
                onChange={handleChange}
              />
            </div>

            {/* Internal Description */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Internal Description</label>
              <textarea
                placeholder="Notes for other admins..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Advanced Metadata Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Advanced Metadata</h3>
          <div className="space-y-4">
            {/* From Name */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">From Name</label>
              <input
                type="text"
                placeholder="e.g. Company HR Team"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                name="fromName"
                value={formData.fromName}
                onChange={handleChange}
              />
            </div>

            {/* From Email */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">From Email</label>
              <input
                type="email"
                placeholder="e.g. hr@company.com"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                name="fromEmail"
                value={formData.fromEmail}
                onChange={handleChange}
              />
            </div>

            {/* To Email */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">To Email</label>
              <input
                type="email"
                placeholder="e.g. candidate@company.com"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                name="toEmail"
                value={formData.toEmail || ''}
                onChange={handleChange}
              />
            </div>

            {/* Background Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Background Color <span className="text-gray-400 text-xs">(Optional)</span>
              </label>
              <div className="flex gap-2">
                <input type="color" className="h-10 w-16 border border-gray-200 rounded-lg cursor-pointer" defaultValue="#ffffff" />
                <input
                  type="text"
                  placeholder="#ffffff"
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono"
                  name="backgroundColor"
                  value={formData.backgroundColor}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
