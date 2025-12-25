import { Mail } from 'lucide-react';
import { Phone } from 'lucide-react';
import { Linkedin } from 'lucide-react';
import { Globe } from 'lucide-react';
import React from 'react';

export default function ContactsInfo({ email, phone, linkedin, portfolio }: { email: string; phone: string; linkedin: string; portfolio: string }) {
  return (
    <div className="bg-white rounded-lg p-6">
      <h2 className="font-semibold text-gray-900 mb-4">Contact Information</h2>
      <div className="grid grid-cols-2 gap-6">
        <div className="flex items-start gap-3">
          <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <div className="text-xs text-gray-500 mb-1">EMAIL ADDRESS</div>
            <a href="#" className="text-blue-600 hover:underline">
              {email}
            </a>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <div className="text-xs text-gray-500 mb-1">PHONE NUMBER</div>
            <div className="text-gray-900">{phone}</div>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Linkedin className="w-5 h-5 text-gray-400 mt-0.5" />
          {linkedin && (
            <>
              <div>
                <div className="text-xs text-gray-500 mb-1">LINKEDIN</div>
                <a href={linkedin} className="text-blue-600 hover:underline">
                  {linkedin}
                </a>
              </div>
            </>
          )}
        </div>
        <div className="flex items-start gap-3">
          <Globe className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <div className="text-xs text-gray-500 mb-1">PORTFOLIO</div>
            <a href={portfolio} className="text-blue-600 hover:underline">
              {portfolio}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
