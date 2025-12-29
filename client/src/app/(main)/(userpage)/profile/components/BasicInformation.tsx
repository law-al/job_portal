import React from 'react';

export default function BasicInformation() {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Basic Information</h3>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
          <input type="text" defaultValue="Alex" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
          <input type="text" defaultValue="Johnson" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Professional Headline</label>
        <input
          type="text"
          defaultValue="Senior Product Designer | UX Specialist"
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">About Me</label>
        <textarea
          rows={5}
          defaultValue="Passionate Product Designer with over 7 years of experience in building digital products for web and mobile. I specialize in UI/UX, Design Systems, and Prototyping. My goal is to create meaningful experiences that solve real user problems."
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>
    </div>
  );
}
