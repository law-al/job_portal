'use client';

import { createContext, useContext, useState } from 'react';

interface MyApplicationsContextType {
  tab: 'all' | 'interviewing' | 'pending' | 'archived';
  setTab: (tab: 'all' | 'interviewing' | 'pending' | 'archived') => void;
  sortBy: 'Last Updated' | 'Newest' | 'Oldest';
  setSortBy: (sortBy: 'Last Updated' | 'Newest' | 'Oldest') => void;
}

const MyApplicationsContext = createContext<MyApplicationsContextType | undefined>(undefined);

export const MyApplicationsProvider = ({ children }: { children: React.ReactNode }) => {
  const [tab, setTab] = useState<'all' | 'interviewing' | 'pending' | 'archived'>('all');
  const [sortBy, setSortBy] = useState<'Last Updated' | 'Newest' | 'Oldest'>('Last Updated');
  return <MyApplicationsContext.Provider value={{ tab, setTab, sortBy, setSortBy }}>{children}</MyApplicationsContext.Provider>;
};

export const useMyApplications = () => {
  const context = useContext(MyApplicationsContext);
  if (!context) {
    throw new Error('useMyApplications must be used within a MyApplicationsProvider');
  }
  return context;
};
