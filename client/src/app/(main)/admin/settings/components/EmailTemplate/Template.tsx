import React from 'react';
import { PlusIcon, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AddTemplate from './AddTemplate';

interface Template {
  id: string;
  name: string;
  description: string;
  icon: string;
  active: boolean;
}

interface TemplateProps {
  templates: Template[];
  selectedTemplate: string;
  onSelectTemplate: (templateId: string) => void;
}

export default function Template({ templates, selectedTemplate, onSelectTemplate }: TemplateProps) {
  return (
    <div className="col-span-4 bg-white rounded-lg border border-gray-200 p-4">
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Find template..."
          className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      <div className="space-y-2">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelectTemplate(template.id)}
            className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
              selectedTemplate === template.id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50 border border-transparent'
            }`}
          >
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl shrink-0">{template.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-gray-900 text-sm">{template.name}</h4>
                {template.active && <span className="w-2 h-2 bg-green-500 rounded-full"></span>}
              </div>
              <p className="text-xs text-gray-500 truncate">{template.description}</p>
            </div>
          </button>
        ))}

        <div className="flex justify-center mt-4">
          <AddTemplate />
        </div>
      </div>
    </div>
  );
}
