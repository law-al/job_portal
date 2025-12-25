import React from 'react';
import TeamNotes from './TeamNotes';
import { fetchWithRetry } from '@/lib/fetchWithRetry';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';

interface NotesResponse {
  success: boolean;
  data: Array<{
    id: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    author: {
      id: string;
      email: string;
    };
  }>;
}

export default async function TeamNotesWrapper({ applicationId }: { applicationId: string }) {
  console.log('applicationId', applicationId);
  const session = await getServerSession(authOptions);
  let notes: NotesResponse['data'] = [];

  if (session?.user?.companyId) {
    try {
      const response = await fetchWithRetry({
        url: `note/${session.user.companyId}/application/${applicationId}`,
        options: {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${(session.user as { accessToken?: string }).accessToken ?? ''}`,
          },
        },
        refreshTokenHash: (session.user as { refreshTokenHash?: string }).refreshTokenHash,
      });

      if (response.ok) {
        const data = (await response.json()) as NotesResponse;
        notes = data.data || [];
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
      // Silently fail - notes will be empty array
    }
  }

  const userEmail = (session?.user as { email?: string })?.email || '';

  return (
    <div className="bg-white rounded-lg p-6">
      <h3 className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">Team Notes</h3>
      <TeamNotes initialNotes={notes} applicationId={applicationId} companyId={session?.user?.companyId as string} userEmail={userEmail} />
    </div>
  );
}
