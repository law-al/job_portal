'use client';

import { Button } from '@/components/ui/button';
import { LayoutDashboard, Building2, Users, Briefcase, FileText, CreditCard, Package, TrendingUp, Settings, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const menuItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      href: '/admin',
      active: true,
    },
    { icon: Users, label: 'Users', href: '/admin/users', active: false },
    { icon: Briefcase, label: 'Jobs', href: '/admin/jobs', active: false },
    {
      icon: FileText,
      label: 'Applications',
      href: '/admin/applications',
      active: false,
    },
    {
      icon: CreditCard,
      label: 'Payments',
      href: '/admin/payments',
      active: false,
    },
    {
      icon: Package,
      label: 'Subscriptions',
      href: '/admin/subscriptions',
      active: false,
    },
    {
      icon: TrendingUp,
      label: 'Reports',
      href: '/admin/reports',
      active: false,
    },
    {
      icon: Settings,
      label: 'System Settings',
      href: '/admin/settings',
      active: false,
    },
  ];

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  const pathname = usePathname();
  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900">Job Portal</h1>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 flex flex-col">
          <nav className="flex-1 p-4 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => router.push(item.href)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.href) ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon size={20} />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-4">
            <Button onClick={handleSignOut} variant="outline" className="flex items-center justify-start gap-2 w-full py-6 cursor-pointer">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">{children}</div>
    </div>
  );
}
