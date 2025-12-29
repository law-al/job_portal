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
  Send,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link2,
  RotateCcw,
  Image,
} from 'lucide-react';
import { Grid3Columns } from '@/components/Grid';
import Template from './Template';
import EditorWrapper from './EditorWrapper';

const EmailTemplatesPage = () => {
  const templates = [
    {
      id: 'welcome',
      name: 'Welcome Email',
      description: 'Sent to new users upon...',
      icon: '✉️',
      active: true,
    },
    {
      id: 'password',
      name: 'Password Reset',
      description: 'Recovery link instructions.',
      icon: '🔒',
      active: false,
    },
    {
      id: 'application',
      name: 'Application Confirmation',
      description: 'Sent after a candidate applies.',
      icon: '✅',
      active: false,
    },
    {
      id: 'interview',
      name: 'Interview Invitation',
      description: 'Meeting details and scheduling.',
      icon: '📅',
      active: false,
    },
    {
      id: 'jobalert',
      name: 'Job Alert Match',
      description: 'Daily digest of matching jobs.',
      icon: '🔔',
      active: false,
    },
    {
      id: 'verification',
      name: 'Account Verification',
      description: 'Email confirmation code.',
      icon: '🛡️',
      active: false,
    },
  ];

  return (
    <div className="grid grid-cols-12 gap-6">
      <Template templates={templates} selectedTemplate="welcome" onSelectTemplate={() => {}} />
      <EditorWrapper />
    </div>
  );
};

export default EmailTemplatesPage;
