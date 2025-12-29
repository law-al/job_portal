import React, { ReactNode } from 'react';

export default function MainWrapper({ children }: { children: ReactNode }) {
  return <div className="flex-1 p-8 overflow-y-auto">{children}</div>;
}
