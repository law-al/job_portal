import React from 'react';
import { ReactNode } from 'react';

export default function JobListingsWrapper({ children }: { children: ReactNode }) {
  return <div className="flex gap-8">{children}</div>;
}
