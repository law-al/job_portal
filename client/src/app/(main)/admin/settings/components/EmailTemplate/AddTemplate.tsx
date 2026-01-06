'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogTitle, DialogHeader, DialogContent, DialogTrigger, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { PlusIcon, Loader2 } from 'lucide-react';
import React, { useState, useTransition } from 'react';
import TemplateForm from './create-template/TemplateForm';
import RightForm from './create-template/RightForm';
import LeftForm from './create-template/LeftForm';
import { createEmailTemplateAction } from '@/app/actions/emailTemplate.actions';
import { toast } from 'sonner';

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
  fromName: string;
  fromEmail: string;
  replyTo: string;
  backgroundColor: string;
  toEmail: string;
}

export default function AddTemplate() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string[]>>({});
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
    fromName: '',
    fromEmail: '',
    replyTo: '',
    backgroundColor: '#ffffff',
    toEmail: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error for this field when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: [] });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: [] });
    }
  };

  const handleEditorState = (editorState: string) => {
    setFormData({ ...formData, editorState, content: editorState });
    if (errors.editorState) {
      setErrors({ ...errors, editorState: [] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Basic validation
    if (!formData.name.trim()) {
      setErrors({ name: ['Template name is required'] });
      return;
    }
    if (!formData.subject.trim()) {
      setErrors({ subject: ['Subject is required'] });
      return;
    }
    if (!formData.editorState) {
      setErrors({ editorState: ['Email content is required'] });
      return;
    }

    startTransition(async () => {
      try {
        // Prepare metadata
        const metadata: {
          fromName?: string;
          fromEmail?: string;
          replyTo?: string;
          backgroundColor?: string;
        } = {};

        if (formData.fromName) metadata.fromName = formData.fromName;
        if (formData.fromEmail) metadata.fromEmail = formData.fromEmail;
        if (formData.replyTo) metadata.replyTo = formData.replyTo;
        if (formData.backgroundColor) metadata.backgroundColor = formData.backgroundColor;

        const result = await createEmailTemplateAction({
          templateType: formData.templateType,
          name: formData.name,
          description: formData.description || undefined,
          subject: formData.subject,
          preheader: formData.preheader || undefined,
          content: formData.content,
          editorState: formData.editorState,
          variables: formData.variables.length > 0 ? formData.variables : undefined,
          metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
          isActive: formData.isActive,
          isDefault: formData.isDefault,
          tags: formData.tags.length > 0 ? formData.tags : undefined,
        });

        if (result.success) {
          toast.success(result.message || 'Email template created successfully');
          setOpen(false);
          // Reset form
          setFormData({
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
            fromName: '',
            fromEmail: '',
            replyTo: '',
            backgroundColor: '#ffffff',
            toEmail: '',
          });
          setErrors({});
        } else {
          if (typeof result.errors === 'string') {
            toast.error(result.errors);
          } else if (result.errors) {
            console.log('result.errors', result.errors);
            setErrors(result.errors);
            toast.error('Please fix the errors in the form');
          } else {
            toast.error('Failed to create email template');
          }
        }
      } catch (error) {
        console.error('Error creating email template:', error);
        toast.error('An unexpected error occurred. Please try again.');
      }
    });
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
        <form onSubmit={handleSubmit}>
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
                <LeftForm formData={formData} handleChange={handleChange} handleSelectChange={handleSelectChange} errors={errors} />
                <RightForm handleEditorState={handleEditorState} errors={errors} />
              </TemplateForm>
            </div>
          </div>

          {/* Footer - Fixed */}
          <DialogFooter className="px-6 py-4 border-t bg-white">
            <Button type="submit" variant="default" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Add Template'
              )}
            </Button>
            <Button type="button" onClick={() => setOpen(false)} variant="outline" disabled={isPending}>
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
