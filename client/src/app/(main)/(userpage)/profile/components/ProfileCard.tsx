'use client';

import { Globe, Phone, Mail, Linkedin, Github, Pencil, Loader2 } from 'lucide-react';
import Image from 'next/image';
import React, { useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import ContactInfoDialog from './ContactInfoDialog';
import { updateProfileImageAction } from '@/app/actions/profile.actions';
import { toast } from 'sonner';

interface ProfileCardProps {
  contactInfo?: {
    linkedin?: string | null;
    github?: string | null;
    location?: string | null;
  };
  userInfo?: {
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    phone?: string | null;
    profileImage?: string | null;
  };
}

export default function ProfileCard({ contactInfo, userInfo }: ProfileCardProps) {
  const fullName = userInfo?.firstName && userInfo?.lastName ? `${userInfo.firstName} ${userInfo.lastName}` : 'User';
  const location = contactInfo?.location || 'Not specified';
  const email = userInfo?.email || '';
  const phone = userInfo?.phone || '';
  const linkedin = contactInfo?.linkedin || '';
  const github = contactInfo?.github || '';
  const profileImage = userInfo?.profileImage || null;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const router = useRouter();

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Only JPEG, PNG, and WebP images are allowed');
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('File size too large. Maximum size is 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload image
    const formData = new FormData();
    formData.append('image', file);

    startTransition(async () => {
      const result = await updateProfileImageAction(formData);

      if (result.success) {
        toast.success(result.message || 'Profile image updated successfully');
        // Clear preview after successful upload
        setPreviewImage(null);
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        // Refresh the page data to show the new image
        router.refresh();
      } else {
        toast.error(typeof result.errors === 'string' ? result.errors : 'Failed to update profile image');
        setPreviewImage(null);
      }
    });
  };

  const displayImage =
    previewImage ||
    profileImage ||
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm text-center">
      <div className="relative w-32 h-32 mx-auto mb-4">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 border-4 border-green-500 cursor-pointer hover:border-green-600 transition-colors relative group">
          <Image src={displayImage} alt={fullName} className="w-full h-full object-cover" width={128} height={128} />
          <div
            onClick={handleImageClick}
            className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center rounded-full"
          >
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {isPending ? (
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              ) : (
                <div className="bg-green-500 rounded-full p-2">
                  <Pencil className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          </div>
        </div>
        <input ref={fileInputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={handleFileChange} className="hidden" />
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-1">{fullName}</h2>

      <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-4">
        <Globe className="w-4 h-4" />
        <span>{location}</span>
      </div>

      <div className="space-y-3 text-left mb-6">
        {email && (
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <Mail className="w-4 h-4 text-gray-400" />
            <span>{email}</span>
          </div>
        )}
        {phone && (
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <Phone className="w-4 h-4 text-gray-400" />
            <span>{phone}</span>
          </div>
        )}
        {linkedin && (
          <div className="flex items-center gap-3 text-sm">
            <Linkedin className="w-4 h-4 text-gray-400" />
            <a href={linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              LinkedIn Profile
            </a>
          </div>
        )}
        {github && (
          <div className="flex items-center gap-3 text-sm">
            <Github className="w-4 h-4 text-gray-400" />
            <a href={github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              GitHub Profile
            </a>
          </div>
        )}
      </div>

      <ContactInfoDialog
        initialData={{
          linkedin: contactInfo?.linkedin || null,
          github: contactInfo?.github || null,
          location: contactInfo?.location || null,
        }}
      />
    </div>
  );
}
