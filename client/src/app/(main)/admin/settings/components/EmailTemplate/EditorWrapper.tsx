'use client';

import React from 'react';
import { SendIcon, PencilIcon, CheckIcon } from 'lucide-react';
import Editor from './editor/Editor';
import { Button } from '@/components/ui/button';
import { useSystemSettings } from '../../provider';

export default function EditorWrapper() {
  const { editEmailTemplate, setEditEmailTemplate } = useSystemSettings();
  const editEmailClassName = !editEmailTemplate ? 'opacity-50 pointer-events-none' : 'opacity-100 pointer-events-auto';
  return (
    <div className="col-span-8 bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-semibold text-gray-900">Welcome Email</h2>
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">ACTIVE</span>
          </div>
          <p className="text-sm text-gray-500">Last edited by Jane Doe on Oct 24, 2023</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="lg" className="ml-auto cursor-pointer bg-blue-500 text-white hover:bg-blue-600">
            <SendIcon className="w-4 h-4" />
            Send Test Email
          </Button>

          {editEmailTemplate ? (
            <Button onClick={() => setEditEmailTemplate(false)} variant="outline" size="lg" className="ml-auto cursor-pointer bg-green-500 text-white hover:bg-green-600">
              <CheckIcon className="w-4 h-4" />
              Save Content
            </Button>
          ) : (
            <Button onClick={() => setEditEmailTemplate(true)} variant="outline" size="lg" className="ml-auto cursor-pointer">
              <PencilIcon className="w-4 h-4" />
              Edit Content
            </Button>
          )}
        </div>
      </div>

      {/* Subject Line */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-900 mb-2">Subject Line</label>
        <input
          type="text"
          disabled={!editEmailTemplate}
          defaultValue="Welcome to {{platform_name}}, {{user_first_name}}! 🚀"
          className={`w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${editEmailClassName}`}
        />
        <p className="text-xs text-gray-500 mt-1">Keep it under 60 characters for best open rates.</p>
      </div>

      {/* Preheader Text */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <label className="block text-sm font-medium text-gray-900">Preheader Text</label>
          <span className="text-xs text-gray-500">Optional</span>
        </div>
        <input
          type="text"
          disabled={!editEmailTemplate}
          defaultValue="We're thrilled to have you join our community of professionals."
          className={`w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${editEmailClassName}`}
        />
      </div>

      {/* Email Content */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <label className="block text-sm font-medium text-gray-900 mb-2">Email Content</label>
        </div>

        {/* Toolbar */}
        {/* <div className="flex items-center gap-1 p-2 bg-gray-50 border border-gray-200 rounded-t-lg">
          <button className="p-2 hover:bg-gray-200 rounded">
            <BoldIcon className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-200 rounded">
            <Italic className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-200 rounded">
            <Underline className="w-4 h-4 text-gray-600" />
          </button>
          <div className="w-px h-6 bg-gray-300 mx-1"></div>
          <button className="p-2 hover:bg-gray-200 rounded">
            <List className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-200 rounded">
            <ListOrderedIcon className="w-4 h-4 text-gray-600" />
          </button>
          <div className="w-px h-6 bg-gray-300 mx-1"></div>
          <button className="p-2 hover:bg-gray-200 rounded">
            <Link2Icon className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-200 rounded">
            <RotateCcwIcon className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-200 rounded">
            <ImageIcon className="w-4 h-4 text-gray-600" />
          </button>
        </div> */}

        {/* Content Area */}
        {/* <div className="border border-t-0 border-gray-200 rounded-b-lg p-4 bg-white min-h-[400px]">
          <p className="text-gray-700 mb-4">
            Hi <span className="bg-blue-50 text-blue-700 px-1 rounded">{'{{user_first_name}}'}</span>,
          </p>
          <p className="text-gray-700 mb-4">
            Welcome to <span className="bg-blue-50 text-blue-700 px-1 rounded">{'{{platform_name}}'}</span>! We are thrilled to have you on board. Your account has been
            successfully created, and you are now ready to explore thousands of job opportunities tailored just for you.
          </p>
          <p className="text-gray-700 mb-6">To get started, we recommend completing your profile to increase your visibility to top employers.</p>
          <div className="flex justify-center mb-6">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">Complete Your Profile</button>
          </div>
          <p className="text-gray-700 text-sm">
            If you have any questions, feel free to reply to this email or visit our{' '}
            <a href="#" className="text-blue-600 hover:underline">
              Help Center
            </a>
            .
          </p>
        </div> */}

        <Editor editEmailTemplate={editEmailTemplate} />
      </div>
    </div>
  );
}
