import React from 'react';
import Header from './components/Header';
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
