import { Globe, Phone, Mail } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

export default function ProfileCard() {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm text-center">
      <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200">
        <Image src="/api/placeholder/128/128" alt="Alex Johnson" className="w-full h-full object-cover" width={128} height={128} />
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-1">Alex Johnson</h2>
      <p className="text-gray-600 mb-4">Senior Product Designer</p>

      <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-4">
        <Globe className="w-4 h-4" />
        <span>San Francisco, CA</span>
      </div>

      <div className="space-y-3 text-left mb-6">
        <div className="flex items-center gap-3 text-sm text-gray-700">
          <Mail className="w-4 h-4 text-gray-400" />
          <span>alex.johnson@example.com</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-700">
          <Phone className="w-4 h-4 text-gray-400" />
          <span>+1 (555) 123-4567</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Globe className="w-4 h-4 text-gray-400" />
          <a href="#" className="text-blue-600 hover:underline">
            alexdesign.com
          </a>
        </div>
      </div>

      <button className="w-full py-2 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">Edit Contact Info</button>
    </div>
  );
}
