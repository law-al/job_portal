'use client';

import { Share2 } from 'lucide-react';

export default function ShareButton({ jobSlug }: { jobSlug: string }) {
  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(`${window.location.origin}/jobs/${jobSlug}`);
    }
  };

  return (
    <button
      onClick={handleShare}
      className='flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
    >
      <Share2 size={18} />
      Share
    </button>
  );
}
