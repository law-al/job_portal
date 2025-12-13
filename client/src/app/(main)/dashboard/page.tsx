'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { signOut, useSession } from 'next-auth/react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { redirect } from 'next/navigation';

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (session?.user.role === 'COMPANY') {
    return redirect('/admin');
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <div className='min-h-screen p-8'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold'>Dashboard</h1>
        <Button
          onClick={handleSignOut}
          variant='outline'
          className='flex items-center gap-2'
        >
          <LogOut className='w-4 h-4' />
          Sign Out
        </Button>
      </div>
      {status === 'loading' && <div>Loading...</div>}
      {status === 'authenticated' && (
        <div>Welcome {(session.user as any).id}</div>
      )}
    </div>
  );
}
