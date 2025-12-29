import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, Search } from 'lucide-react';
import React from 'react';
/* eslint-disable @typescript-eslint/no-explicit-any */

export default function Header({ session }: { session: any }) {
  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4 ">
      <div className="flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search companies, users, jobs..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4 ml-6">
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>ATN</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold text-gray-900">{session?.user.name}</p>
              <p className="text-xs text-gray-500">{session?.user.role}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
