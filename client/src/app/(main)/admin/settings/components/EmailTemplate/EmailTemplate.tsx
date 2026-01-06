'use client';

import { useCallback, useEffect, useState } from 'react';
import Template from './Template';
import EditorWrapper from './EditorWrapper';
import { fetchEmailTemplatesAction } from '@/app/actions/emailTemplate.actions';
import { Loader2 } from 'lucide-react';

// Map template types to icons
const TEMPLATE_ICONS: Record<string, string> = {
  welcome: '✉️',
  password: '🔒',
  application: '✅',
  interview: '📅',
  jobalert: '🔔',
  verification: '🛡️',
  offer: '💼',
  rejection: '❌',
  stage_update: '📊',
  custom: '📝',
};

interface EmailTemplate {
  _id: string;
  templateType: string;
  name: string;
  description?: string;
  subject: string;
  content: string;
  isActive: boolean;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

const EmailTemplatesPage = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTemplates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchEmailTemplatesAction({
        isActive: true, // Only fetch active templates by default
      });

      if (result.success && result.data) {
        setTemplates(result.data);
        // Set first template as selected if available and no template is currently selected
        if (result.data.length > 0 && !selectedTemplate) {
          setSelectedTemplate(result.data[0]._id);
        }
      } else {
        setError(result.error || 'Failed to load email templates');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error loading templates:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedTemplate]);

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  const getSelectedTemplate = useCallback(() => {
    if (templates.length === 0) return;

    const template = templates.find((temp) => temp?._id === selectedTemplate);
    if (!template) return;

    return {
      id: template._id,
      name: template.name,
      subject: template.subject,
      description: template.description || `Template for ${template.templateType}`,
      icon: TEMPLATE_ICONS[template.templateType] || '📝',
      active: template.isActive,
      content: template.content,
    };
  }, [templates, selectedTemplate]);

  // Transform backend templates to match Template component format
  const transformedTemplates = templates.map((template) => ({
    id: template._id,
    name: template.name,
    description: template.description || `Template for ${template.templateType}`,
    icon: TEMPLATE_ICONS[template.templateType] || '📝',
    active: template.isActive,
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-6">
      <Template templates={transformedTemplates} selectedTemplate={selectedTemplate} onSelectTemplate={setSelectedTemplate} />
      <EditorWrapper selectedTemplate={getSelectedTemplate()} onTemplateUpdate={loadTemplates} />
    </div>
  );
};

export default EmailTemplatesPage;
