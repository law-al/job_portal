'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogTitle, DialogHeader, DialogContent, DialogTrigger, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import React, { useState, useTransition } from 'react';
import { updateContactInfoAction } from '@/app/actions/profile.actions';
import { toast } from 'sonner';

interface ContactInfoDialogProps {
  initialData?: {
    linkedin?: string | null;
    github?: string | null;
    location?: string | null;
  };
  onSuccess?: () => void;
}

export default function ContactInfoDialog({ initialData, onSuccess }: ContactInfoDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [formData, setFormData] = useState({
    linkedin: initialData?.linkedin || '',
    github: initialData?.github || '',
    location: initialData?.location || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      const result = await updateContactInfoAction(formData);

      if (result.success) {
        toast.success(result.message || 'Contact information updated successfully');
        setOpen(false);
        onSuccess?.();
      } else {
        if (typeof result.errors === 'string') {
          toast.error(result.errors);
        } else if (result.errors) {
          setErrors(result.errors);
          toast.error('Please fix the errors in the form');
        } else {
          toast.error('Failed to update contact information');
        }
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="w-full py-2 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">Edit Contact Info</button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Contact Information</DialogTitle>
            <DialogDescription>Update your LinkedIn, GitHub, and location information.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., San Francisco, CA"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.location ? 'border-red-500' : 'border-gray-200'}`}
              />
              {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location[0]}</p>}
            </div>

            {/* LinkedIn */}
            <div>
              <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 mb-2">
                LinkedIn URL
              </label>
              <input
                type="url"
                id="linkedin"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/yourprofile"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.linkedin ? 'border-red-500' : 'border-gray-200'}`}
              />
              {errors.linkedin && <p className="mt-1 text-sm text-red-500">{errors.linkedin[0]}</p>}
            </div>

            {/* GitHub */}
            <div>
              <label htmlFor="github" className="block text-sm font-medium text-gray-700 mb-2">
                GitHub URL
              </label>
              <input
                type="url"
                id="github"
                name="github"
                value={formData.github}
                onChange={handleChange}
                placeholder="https://github.com/yourusername"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.github ? 'border-red-500' : 'border-gray-200'}`}
              />
              {errors.github && <p className="mt-1 text-sm text-red-500">{errors.github[0]}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
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
