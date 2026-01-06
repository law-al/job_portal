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

export default function MainContent() {
  const { tab: activeTab } = useSystemSettings();
  return (
    <main className="flex-1 overflow-y-auto">
      <div className="p-6">
        <AppBreadCrumb items={[{ label: 'Dashboard', href: '/admin' }, { label: 'System Settings' }]} homeHref="/admin" className="mb-6" />
        <SubHeader />
        <Tabs />
        {activeTab === 'general' && <General />}
        {activeTab === 'authentication' && <Authentication />}
        {activeTab === 'email' && <EmailTemplate />}
      </div>
    </main>
  );
}
