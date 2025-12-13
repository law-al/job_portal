import EmailVerifiedCheck from '@/components/EmailVerificationCheck';
import React from 'react';

export default async function VerificationPage({
  searchParams,
}: {
  searchParams: Promise<{ token: string }>;
}) {
  const { token } = await searchParams;

  return <EmailVerifiedCheck token={token} />;
}
