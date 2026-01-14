'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogTitle, DialogHeader, DialogContent, DialogTrigger, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import React, { useState, useTransition } from 'react';
import { updateEducationAction } from '@/app/actions/profile.actions';
import { toast } from 'sonner';

interface Education {
  degree: string;
  institution: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string | null;
  isCurrent?: boolean;
}

interface EducationDialogProps {
  initialData?: Education[];
  onSuccess?: () => void;
}

export default function EducationDialog({ initialData, onSuccess }: EducationDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [education, setEducation] = useState<Education[]>(
    initialData && initialData.length > 0
      ? initialData.map((edu) => ({
          ...edu,
          startDate: typeof edu.startDate === 'string' ? edu.startDate : new Date(edu.startDate).toISOString().split('T')[0],
          endDate: edu.endDate ? (typeof edu.endDate === 'string' ? edu.endDate : new Date(edu.endDate).toISOString().split('T')[0]) : null,
        }))
      : [
          {
            degree: '',
            institution: '',
            fieldOfStudy: '',
            startDate: '',
            endDate: null,
            isCurrent: false,
          },
        ],
  );

  const addEducation = () => {
    setEducation([
      ...education,
      {
        degree: '',
        institution: '',
        fieldOfStudy: '',
        startDate: '',
        endDate: null,
        isCurrent: false,
      },
    ]);
  };

  const removeEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const updateEducation = (index: number, field: keyof Education, value: string | boolean | null) => {
    const updated = [...education];
    updated[index] = { ...updated[index], [field]: value };
    // If isCurrent is true, clear endDate
    if (field === 'isCurrent' && value === true) {
      updated[index].endDate = null;
    }
    setEducation(updated);
    // Clear errors for this field
    if (errors[`education.${index}.${field}`]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[`education.${index}.${field}`];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    // Filter out empty education entries
    const validEducation = education.filter((edu) => edu.degree && edu.institution && edu.startDate);

    if (validEducation.length === 0) {
      toast.error('Please add at least one education entry');
      return;
    }

    startTransition(async () => {
      const result = await updateEducationAction({ education: validEducation });

      if (result.success) {
        toast.success(result.message || 'Education updated successfully');
        setOpen(false);
        onSuccess?.();
      } else {
        if (typeof result.errors === 'string') {
          toast.error(result.errors);
        } else if (result.errors) {
          setErrors(result.errors);
          toast.error('Please fix the errors in the form');
        } else {
          toast.error('Failed to update education');
        }
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700">
          <Plus className="w-4 h-4" />
          Add Education
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Manage Education</DialogTitle>
            <DialogDescription>Add, edit, or remove your education entries.</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {education.map((edu, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">Education #{index + 1}</h4>
                  {education.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEducation(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                {/* Degree and Institution */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Degree <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                      placeholder="e.g., Bachelor of Science"
                      required
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors[`education.${index}.degree`] ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {errors[`education.${index}.degree`] && (
                      <p className="mt-1 text-sm text-red-500">{errors[`education.${index}.degree`][0]}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Institution <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                      placeholder="e.g., University of California"
                      required
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors[`education.${index}.institution`] ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {errors[`education.${index}.institution`] && (
                      <p className="mt-1 text-sm text-red-500">{errors[`education.${index}.institution`][0]}</p>
                    )}
                  </div>
                </div>

                {/* Field of Study */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Field of Study</label>
                  <input
                    type="text"
                    value={edu.fieldOfStudy || ''}
                    onChange={(e) => updateEducation(index, 'fieldOfStudy', e.target.value)}
                    placeholder="e.g., Computer Science"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors[`education.${index}.fieldOfStudy`] ? 'border-red-500' : 'border-gray-200'
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
                      value={edu.startDate}
                      onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
                      required
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors[`education.${index}.startDate`] ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {errors[`education.${index}.startDate`] && (
                      <p className="mt-1 text-sm text-red-500">{errors[`education.${index}.startDate`][0]}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <div className="space-y-2">
                      <input
                        type="date"
                        value={edu.endDate || ''}
                        onChange={(e) => updateEducation(index, 'endDate', e.target.value || null)}
                        disabled={edu.isCurrent}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          edu.isCurrent ? 'bg-gray-100 cursor-not-allowed' : ''
                        } ${errors[`education.${index}.endDate`] ? 'border-red-500' : 'border-gray-200'}`}
                      />
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input
                          type="checkbox"
                          checked={edu.isCurrent || false}
                          onChange={(e) => updateEducation(index, 'isCurrent', e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span>Currently studying</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <Button type="button" variant="outline" onClick={addEducation} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Another Education
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
