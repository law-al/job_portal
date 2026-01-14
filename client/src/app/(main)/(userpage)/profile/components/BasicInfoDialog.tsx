'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogTitle, DialogHeader, DialogContent, DialogTrigger, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import React, { useState, useTransition } from 'react';
import { updateBasicInfoAction } from '@/app/actions/profile.actions';
import { toast } from 'sonner';

interface BasicInfoDialogProps {
  initialData?: {
    firstName?: string | null;
    lastName?: string | null;
    professionalHeadline?: string | null;
    aboutMe?: string | null;
  };
  onSuccess?: () => void;
}

export default function BasicInfoDialog({ initialData, onSuccess }: BasicInfoDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    professionalHeadline: initialData?.professionalHeadline || '',
    aboutMe: initialData?.aboutMe || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    startTransition(async () => {
      const result = await updateBasicInfoAction(formData);

      if (result.success) {
        toast.success(result.message || 'Basic information updated successfully');
        setOpen(false);
        onSuccess?.();
      } else {
        if (typeof result.errors === 'string') {
          toast.error(result.errors);
        } else if (result.errors) {
          setErrors(result.errors);
          toast.error('Please fix the errors in the form');
        } else {
          toast.error('Failed to update basic information');
        }
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="">
          Edit Basic Information
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Basic Information</DialogTitle>
            <DialogDescription>Update your name, professional headline, and about me section.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* First Name and Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  required
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.firstName ? 'border-red-500' : 'border-gray-200'}`}
                />
                {errors.firstName && <p className="mt-1 text-sm text-red-500">{errors.firstName[0]}</p>}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  required
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.lastName ? 'border-red-500' : 'border-gray-200'}`}
                />
                {errors.lastName && <p className="mt-1 text-sm text-red-500">{errors.lastName[0]}</p>}
              </div>
            </div>

            {/* Professional Headline */}
            <div>
              <label htmlFor="professionalHeadline" className="block text-sm font-medium text-gray-700 mb-2">
                Professional Headline
              </label>
              <input
                type="text"
                id="professionalHeadline"
                name="professionalHeadline"
                value={formData.professionalHeadline}
                onChange={handleChange}
                placeholder="e.g., Senior Software Engineer | Full Stack Developer"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.professionalHeadline ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {errors.professionalHeadline && <p className="mt-1 text-sm text-red-500">{errors.professionalHeadline[0]}</p>}
            </div>

            {/* About Me */}
            <div>
              <label htmlFor="aboutMe" className="block text-sm font-medium text-gray-700 mb-2">
                About Me
              </label>
              <textarea
                id="aboutMe"
                name="aboutMe"
                value={formData.aboutMe}
                onChange={handleChange}
                rows={5}
                placeholder="Tell us about yourself, your experience, and what you're passionate about..."
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                  errors.aboutMe ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {errors.aboutMe && <p className="mt-1 text-sm text-red-500">{errors.aboutMe[0]}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                onSuccess?.();
              }}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
