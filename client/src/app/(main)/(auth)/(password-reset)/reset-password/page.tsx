import SetNewPassword from '@/components/SetNewPassword';
import React from 'react';

export default async function ResetPassword({
  searchParams,
}: {
  searchParams: Promise<{ reset: string }>;
}) {
  const { reset } = await searchParams;
  return <SetNewPassword reset={reset} />;
}
