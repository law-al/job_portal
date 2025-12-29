'use client';

import { createContext, useContext, useState } from 'react';

interface SystemSettingsContextType {
  tab: 'general' | 'authentication' | 'email' | 'roles' | 'features' | 'maintenance';
  setTab: (tab: 'general' | 'authentication' | 'email' | 'roles' | 'features' | 'maintenance') => void;
  editEmailTemplate: boolean;
  setEditEmailTemplate: (editEmailTemplate: boolean) => void;
}

const SystemSettingsContext = createContext<SystemSettingsContextType | undefined>(undefined);

export const SystemSettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [tab, setTab] = useState<'general' | 'authentication' | 'email' | 'roles' | 'features' | 'maintenance'>('general');
  const [editEmailTemplate, setEditEmailTemplate] = useState(false);

  const value = {
    tab,
    setTab,
    editEmailTemplate,
    setEditEmailTemplate,
  };

  return <SystemSettingsContext.Provider value={value}>{children}</SystemSettingsContext.Provider>;
};

export const useSystemSettings = () => {
  const context = useContext(SystemSettingsContext);
  if (!context) {
    throw new Error('useSystemSettings must be used within a SystemSettingsProvider');
  }
  return context;
};
