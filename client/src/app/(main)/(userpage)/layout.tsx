'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Bell, MessageSquare, User, Settings, LogOut, Building2, FileText } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <div>
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white rounded-sm"></div>
              </div>
              <span className="text-xl font-bold text-gray-900">JobFinder</span>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-gray-900 font-medium">
                Home
              </Link>
              <Link href="/jobs" className="text-gray-600 hover:text-gray-900">
                Jobs
              </Link>
              {status === 'authenticated' && session?.user && session.user.role === 'USER' && (
                <>
                  <Link href="/my-applications" className="text-gray-600 hover:text-gray-900">
                    My Applications
                  </Link>

                  <Link href="/profile" className="text-gray-600 hover:text-gray-900">
                    Profile
                  </Link>

                  {session?.user.companyId && (
                    <Link href="/admin" className="text-gray-600 hover:text-gray-900">
                      Manage Company
                    </Link>
                  )}
                </>
              )}
            </nav>

            <div className="flex items-center gap-4">
              {status === 'authenticated' && session && session.user && session.user.role === 'USER' ? (
                <>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Bell className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <MessageSquare className="w-5 h-5 text-gray-600" />
                  </button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="cursor-pointer hover:opacity-80 transition-opacity">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={session?.user.image || 'https://github.com/shadcn.png'} />
                          <AvatarFallback>{session?.user.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                        </Avatar>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{session?.user.name || 'User'}</p>
                          <p className="text-xs leading-none text-muted-foreground">{session?.user.email}</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="cursor-pointer">
                          <User className="mr-2 h-4 w-4" />
                          <span>Profile</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/my-applications" className="cursor-pointer">
                          <FileText className="mr-2 h-4 w-4" />
                          <span>My Applications</span>
                        </Link>
                      </DropdownMenuItem>
                      {session.user.companyId && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link href={`/company/dashboard/${session.user.companyId}`} className="cursor-pointer">
                              <Building2 className="mr-2 h-4 w-4" />
                              <span>Switch to Company</span>
                            </Link>
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/settings" className="cursor-pointer">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Settings</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600 focus:text-red-600">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Button className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white" variant="outline" asChild>
                    <Link href="/login">Login</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
      <div className="">{children}</div>
    </div>
  );
}
