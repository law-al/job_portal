'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogTitle, DialogHeader, DialogContent, DialogTrigger, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { PlusIcon } from 'lucide-react';
import React, { useState } from 'react';
import TemplateForm from './create-template/TemplateForm';
import RightForm from './create-template/RightForm';
import LeftForm from './create-template/LeftForm';

export interface FormData {
  templateType: string;
  name: string;
  companyId: string;
  description: string;
  subject: string;
  preheader: string;
  content: string;
  editorState: string;
  isActive: boolean;
  isDefault: boolean;
  tags: string[];
  variables: string[];
  metadata: {
    fromName: string;
    fromEmail: string;
    replyTo: string;
    backgroundColor: string;
    toEmail: string;
  };
}

export default function AddTemplate() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    templateType: 'welcome',
    name: '',
    companyId: '',
    description: '',
    subject: '',
    preheader: '',
    content: '',
    editorState: '',
    isActive: true,
    isDefault: false,
    tags: [],
    variables: [],
    metadata: {
      fromName: '',
      fromEmail: '',
      replyTo: '',
      backgroundColor: '#ffffff',
      toEmail: '',
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, type: 'default' | 'metadata' = 'default') => {
    if (type === 'default') {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    } else if (type === 'metadata') {
      setFormData({ ...formData, metadata: { ...formData.metadata, [e.target.name]: e.target.value } });
    }
  };

  const handleSubmit = () => {
    console.log(formData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 px-6 py-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors cursor-pointer">
          <PlusIcon className="w-4 h-4" />
          Add Template
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-7xl h-fit flex flex-col p-0">
        <form action="">
          {/* Header - Fixed */}
          <DialogHeader className="px-6 pt-6 pb-4 border-b">
            <DialogTitle className="text-3xl font-bold text-gray-900">Create Email Template</DialogTitle>
            <DialogDescription className="text-sm text-gray-500">Add a new email template to your company</DialogDescription>
          </DialogHeader>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-hidden bg-gray-50 px-6">
            <div className="h-full py-6">
              {/* Main Content Grid */}
              <TemplateForm>
                <LeftForm formData={formData} handleChange={(e) => handleChange(e, 'default')} />
                <RightForm />
              </TemplateForm>
            </div>
          </div>

          {/* Footer - Fixed */}
          <DialogFooter className="px-6 py-4 border-t bg-white">
            <Button onClick={(e) => handleSubmit()} type="button" variant="default">
              Add Template
            </Button>
            <Button type="button" onClick={() => setOpen(false)} variant="outline">
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
