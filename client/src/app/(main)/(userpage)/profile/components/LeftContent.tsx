import React from 'react';
import { ReactNode } from 'react';

export default function LeftContent({ children }: { children: ReactNode }) {
  return <div className="space-y-6">{children}</div>;
}
