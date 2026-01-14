'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogTitle, DialogHeader, DialogContent, DialogTrigger, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import React, { useState, useTransition } from 'react';
import { updateCertificationsAction } from '@/app/actions/profile.actions';
import { toast } from 'sonner';

interface Certification {
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string | null;
  credentialUrl?: string;
}

interface CertificationDialogProps {
  initialData?: Certification[];
  onSuccess?: () => void;
}

export default function CertificationDialog({ initialData, onSuccess }: CertificationDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [certifications, setCertifications] = useState<Certification[]>(
    initialData && initialData.length > 0
      ? initialData.map((cert) => ({
          ...cert,
          issueDate: typeof cert.issueDate === 'string' ? cert.issueDate : new Date(cert.issueDate).toISOString().split('T')[0],
          expiryDate: cert.expiryDate ? (typeof cert.expiryDate === 'string' ? cert.expiryDate : new Date(cert.expiryDate).toISOString().split('T')[0]) : null,
        }))
      : [
          {
            name: '',
            issuer: '',
            issueDate: '',
            expiryDate: null,
            credentialUrl: '',
          },
        ],
  );

  const addCertification = () => {
    setCertifications([
      ...certifications,
      {
        name: '',
        issuer: '',
        issueDate: '',
        expiryDate: null,
        credentialUrl: '',
      },
    ]);
  };

  const removeCertification = (index: number) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  const updateCertification = (index: number, field: keyof Certification, value: string | null) => {
    const updated = [...certifications];
    updated[index] = { ...updated[index], [field]: value };
    setCertifications(updated);
    // Clear errors for this field
    if (errors[`certifications.${index}.${field}`]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[`certifications.${index}.${field}`];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    // Filter out empty certification entries
    const validCertifications = certifications.filter((cert) => cert.name && cert.issuer && cert.issueDate);

    if (validCertifications.length === 0) {
      toast.error('Please add at least one certification');
      return;
    }

    startTransition(async () => {
      const result = await updateCertificationsAction({ certifications: validCertifications });

      if (result.success) {
        toast.success(result.message || 'Certifications updated successfully');
        setOpen(false);
        onSuccess?.();
      } else {
        if (typeof result.errors === 'string') {
          toast.error(result.errors);
        } else if (result.errors) {
          setErrors(result.errors);
          toast.error('Please fix the errors in the form');
        } else {
          toast.error('Failed to update certifications');
        }
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700">
          <Plus className="w-4 h-4" />
          Add Certification
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Manage Certifications</DialogTitle>
            <DialogDescription>Add, edit, or remove your certification entries.</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {certifications.map((cert, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">Certification #{index + 1}</h4>
                  {certifications.length > 1 && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeCertification(index)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                {/* Name and Issuer */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Certification Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={cert.name}
                      onChange={(e) => updateCertification(index, 'name', e.target.value)}
                      placeholder="e.g., Google UX Design Professional Certificate"
                      required
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors[`certifications.${index}.name`] ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {errors[`certifications.${index}.name`] && <p className="mt-1 text-sm text-red-500">{errors[`certifications.${index}.name`][0]}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Issuer <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={cert.issuer}
                      onChange={(e) => updateCertification(index, 'issuer', e.target.value)}
                      placeholder="e.g., Google"
                      required
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors[`certifications.${index}.issuer`] ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {errors[`certifications.${index}.issuer`] && <p className="mt-1 text-sm text-red-500">{errors[`certifications.${index}.issuer`][0]}</p>}
                  </div>
                </div>

                {/* Issue Date and Expiry Date */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Issue Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={cert.issueDate}
                      onChange={(e) => updateCertification(index, 'issueDate', e.target.value)}
                      required
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors[`certifications.${index}.issueDate`] ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {errors[`certifications.${index}.issueDate`] && <p className="mt-1 text-sm text-red-500">{errors[`certifications.${index}.issueDate`][0]}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                    <input
                      type="date"
                      value={cert.expiryDate || ''}
                      onChange={(e) => updateCertification(index, 'expiryDate', e.target.value || null)}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors[`certifications.${index}.expiryDate`] ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                  </div>
                </div>

                {/* Credential URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Credential URL</label>
                  <input
                    type="url"
                    value={cert.credentialUrl || ''}
                    onChange={(e) => updateCertification(index, 'credentialUrl', e.target.value || null)}
                    placeholder="https://example.com/credential"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors[`certifications.${index}.credentialUrl`] ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                  {errors[`certifications.${index}.credentialUrl`] && <p className="mt-1 text-sm text-red-500">{errors[`certifications.${index}.credentialUrl`][0]}</p>}
                </div>
              </div>
            ))}

            <Button type="button" variant="outline" onClick={addCertification} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Another Certification
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
