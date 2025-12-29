'use client';
import React from 'react';

export default function TemplateForm({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-12 gap-6 h-full">{children}</div>;
}
