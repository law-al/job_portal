'use client';

import React from 'react';
import Link from 'next/link';
import { Home } from 'lucide-react';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import type { BreadcrumbItemType } from '@/types';

interface AppBreadCrumbProps {
  items: BreadcrumbItemType[];
  showHome?: boolean; // Whether to show "Home" as the first item
  homeHref?: string; // Custom home href (default: '/')
  className?: string;
}

export default function AppBreadCrumb({ items, showHome = true, homeHref = '/', className }: AppBreadCrumbProps) {
  // Build breadcrumb items array
  const breadcrumbItems: BreadcrumbItemType[] = showHome ? [{ label: 'Home', href: homeHref }, ...items] : items;

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;

          return (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                {isLast || !item.href ? (
                  <BreadcrumbPage className="flex items-center gap-1">
                    {index === 0 && showHome && <Home className="w-4 h-4" />}
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={item.href} className="flex items-center gap-1 hover:text-gray-900">
                      {index === 0 && showHome && <Home className="w-4 h-4" />}
                      {item.label}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
