'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogTitle, DialogHeader, DialogContent, DialogTrigger, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import React, { useState, useTransition } from 'react';
import { updateExperiencesAction } from '@/app/actions/profile.actions';
import { toast } from 'sonner';

interface Experience {
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string | null;
  description?: string;
  isCurrent?: boolean;
}

interface ExperienceDialogProps {
  initialData?: Experience[];
  onSuccess?: () => void;
}

export default function ExperienceDialog({ initialData, onSuccess }: ExperienceDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [experiences, setExperiences] = useState<Experience[]>(
    initialData && initialData.length > 0
      ? initialData.map((exp) => ({
          ...exp,
          startDate: typeof exp.startDate === 'string' ? exp.startDate : new Date(exp.startDate).toISOString().split('T')[0],
          endDate: exp.endDate ? (typeof exp.endDate === 'string' ? exp.endDate : new Date(exp.endDate).toISOString().split('T')[0]) : null,
        }))
      : [
          {
            title: '',
            company: '',
            location: '',
            startDate: '',
            endDate: null,
            description: '',
            isCurrent: false,
          },
        ],
  );

  const addExperience = () => {
    setExperiences([
      ...experiences,
      {
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: null,
        description: '',
        isCurrent: false,
      },
    ]);
  };

  const removeExperience = (index: number) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  const updateExperience = (index: number, field: keyof Experience, value: string | boolean | null) => {
    const updated = [...experiences];
    updated[index] = { ...updated[index], [field]: value };
    // If isCurrent is true, clear endDate
    if (field === 'isCurrent' && value === true) {
      updated[index].endDate = null;
    }
    setExperiences(updated);
    // Clear errors for this field
    if (errors[`experiences.${index}.${field}`]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[`experiences.${index}.${field}`];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    // Filter out empty experiences
    const validExperiences = experiences.filter((exp) => exp.title && exp.company && exp.startDate);

    if (validExperiences.length === 0) {
      toast.error('Please add at least one experience');
      return;
    }

    startTransition(async () => {
      const result = await updateExperiencesAction({ experiences: validExperiences });

      if (result.success) {
        toast.success(result.message || 'Experiences updated successfully');
        setOpen(false);
        onSuccess?.();
      } else {
        if (typeof result.errors === 'string') {
          toast.error(result.errors);
        } else if (result.errors) {
          setErrors(result.errors);
          toast.error('Please fix the errors in the form');
        } else {
          toast.error('Failed to update experiences');
        }
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700">
          <Plus className="w-4 h-4" />
          Add Role
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Manage Experience</DialogTitle>
            <DialogDescription>Add, edit, or remove your work experience entries.</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {experiences.map((experience, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">Experience #{index + 1}</h4>
                  {experiences.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeExperience(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                {/* Title and Company */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={experience.title}
                      onChange={(e) => updateExperience(index, 'title', e.target.value)}
                      placeholder="e.g., Senior Software Engineer"
                      required
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors[`experiences.${index}.title`] ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {errors[`experiences.${index}.title`] && (
                      <p className="mt-1 text-sm text-red-500">{errors[`experiences.${index}.title`][0]}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={experience.company}
                      onChange={(e) => updateExperience(index, 'company', e.target.value)}
                      placeholder="e.g., Tech Corp"
                      required
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors[`experiences.${index}.company`] ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {errors[`experiences.${index}.company`] && (
                      <p className="mt-1 text-sm text-red-500">{errors[`experiences.${index}.company`][0]}</p>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={experience.location || ''}
                    onChange={(e) => updateExperience(index, 'location', e.target.value)}
                    placeholder="e.g., San Francisco, CA"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors[`experiences.${index}.location`] ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={experience.startDate}
                      onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                      required
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors[`experiences.${index}.startDate`] ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {errors[`experiences.${index}.startDate`] && (
                      <p className="mt-1 text-sm text-red-500">{errors[`experiences.${index}.startDate`][0]}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <div className="space-y-2">
                      <input
                        type="date"
                        value={experience.endDate || ''}
                        onChange={(e) => updateExperience(index, 'endDate', e.target.value || null)}
                        disabled={experience.isCurrent}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          experience.isCurrent ? 'bg-gray-100 cursor-not-allowed' : ''
                        } ${errors[`experiences.${index}.endDate`] ? 'border-red-500' : 'border-gray-200'}`}
                      />
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input
                          type="checkbox"
                          checked={experience.isCurrent || false}
                          onChange={(e) => updateExperience(index, 'isCurrent', e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span>I currently work here</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={experience.description || ''}
                    onChange={(e) => updateExperience(index, 'description', e.target.value)}
                    rows={3}
                    placeholder="Describe your responsibilities and achievements..."
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                      errors[`experiences.${index}.description`] ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                </div>
              </div>
            ))}

            <Button type="button" variant="outline" onClick={addExperience} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Another Experience
            </Button>
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
