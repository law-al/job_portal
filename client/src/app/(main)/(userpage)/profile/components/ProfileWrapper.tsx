import React, { ReactNode } from 'react';

export default function ProfileWrapper({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">{children}</div>;
}
