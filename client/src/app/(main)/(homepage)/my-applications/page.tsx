import React from 'react';
import { MyApplicationsProvider } from './provider';
import MyApplications from './components/Myapplications';

export default function MyApplicationsPage() {
  return (
    <MyApplicationsProvider>
      <MyApplications />
    </MyApplicationsProvider>
  );
}
