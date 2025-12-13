'use client';

import { CheckCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import EmailVerifiedExpired from './EmailVerificationExpired';
import EmailVerificationLoading from './EmailVerificationLoading';
import EmailVerificationSuccess from './EmailVerificationSuccess';
import { useSession } from 'next-auth/react';

export default function EmailVerificationCheck({ token }: { token: string }) {
  const { data: session, status, update } = useSession();

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ['verify-email', token],
    queryFn: async () => {
      const response = await api.get(`/auth/verify?token=${token}`);
      const isVerified = response.data.data.isVerified;
      if (session && session.user.isVerified === false) {
        await update({
          user: {
            ...session,
            isVerified,
          },
        });
      }
      return response.data;
    },

    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  if (isLoading) {
    return <EmailVerificationLoading />;
  }

  if (isError) {
    return <EmailVerifiedExpired />;
  }

  if (isSuccess) return <EmailVerificationSuccess />;
}
