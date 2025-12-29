import React from 'react';
import { ReactNode } from 'react';

export default function RightContent({ children }: { children: ReactNode }) {
  return <div className="lg:col-span-2 space-y-6">{children}</div>;
}
