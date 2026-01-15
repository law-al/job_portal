'use client';

import React from 'react';
import { ReactNode } from 'react';
import General from './General/General';
import AppBreadCrumb from '@/components/AppBreadCrumb';
import { useSystemSettings } from '../provider';
import Authentication from './Authentication/Authentication';
import EmailTemplate from './EmailTemplate/EmailTemplate';
import SubHeader from './General/SubHeader';
import Tabs from './Tabs';
import { CopyIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

export default function MainContent() {
  const { tab: activeTab } = useSystemSettings();
  const { data: session } = useSession();
  return (
    <main className="flex-1 overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <AppBreadCrumb items={[{ label: 'Dashboard', href: '/admin' }, { label: 'System Settings' }]} homeHref="/admin" className="mb-6" />

          <div className="flex items-center gap-2">
            <span className="text-sm">{session?.user?.companyId}</span>
            <Button
              variant="outline"
              size="icon"
              className="flex items-center gap-2 p-4 cursor-pointer"
              onClick={() => {
                navigator.clipboard.writeText(session?.user?.companyId || '');
                toast.success('Company ID copied to clipboard');
              }}
            >
              <CopyIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <SubHeader />
        <Tabs />
        {activeTab === 'general' && <General />}
        {activeTab === 'authentication' && <Authentication />}
        {activeTab === 'email' && <EmailTemplate />}
      </div>
    </main>
  );
}
