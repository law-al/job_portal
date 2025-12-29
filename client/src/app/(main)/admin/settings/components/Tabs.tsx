'use client';

import { Lock, Mail, Shield, Sliders, ToggleLeft, Wrench } from 'lucide-react';
import React, { useState } from 'react';
import { useSystemSettings } from '../provider';

interface Tab {
  id: string;
  label: string;
  icon: React.ElementType;
}

const tabs: Tab[] = [
  { id: 'general', label: 'General', icon: Sliders },
  { id: 'authentication', label: 'Authentication', icon: Lock },
  { id: 'email', label: 'Email Templates', icon: Mail },
  { id: 'roles', label: 'Roles & Permissions', icon: Shield },
  { id: 'features', label: 'Feature Flags', icon: ToggleLeft },
  { id: 'maintenance', label: 'Maintenance', icon: Wrench },
];

export default function Tabs() {
  const { tab: activeTab, setTab } = useSystemSettings();
  return (
    <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => setTab(tab.id as 'general' | 'authentication' | 'email' | 'roles' | 'features' | 'maintenance')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Icon className="w-4 h-4" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
