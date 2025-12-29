'use client';

import React, { useState } from 'react';
import {
  Search,
  Bell,
  HelpCircle,
  Settings,
  BarChart3,
  Briefcase,
  Users,
  Building2,
  LayoutDashboard,
  Sliders,
  Lock,
  Mail,
  Shield,
  ToggleLeft,
  Wrench,
  Image,
  Globe,
  Share2,
  ChevronDown,
  AlertTriangle,
} from 'lucide-react';
import Header from './components/Header';
import MainWrapper from './components/MainContent';
import AppBreadCrumb from '@/components/AppBreadCrumb';
import SubHeader from './components/General/SubHeader';
import Tabs from './components/Tabs';
import { Grid3Columns } from '@/components/Grid';
import PlatformIdentity from './components/General/PlatformIdentity';
import Branding from './components/General/Branding';
import Localization from './components/General/Localization';
import SocialPresence from './components/General/SocialPresence';
import AdvanceOperations from './components/General/AdvanceOperations';
import { SystemSettingsProvider } from './provider';
import MainContent from './components/MainContent';

const SystemSettingsPage = () => {
  return (
    <SystemSettingsProvider>
      <div className="flex h-screen bg-gray-50">
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <MainContent />
        </div>
      </div>
    </SystemSettingsProvider>
  );
};

export default SystemSettingsPage;
