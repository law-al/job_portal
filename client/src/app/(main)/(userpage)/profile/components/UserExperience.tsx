import { Plus } from 'lucide-react';
import React from 'react';

export default function UserExperience() {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Experience</h3>
        <button className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700">
          <Plus className="w-4 h-4" />
          Add Role
        </button>
      </div>

      <div className="space-y-6">
        {/* Experience Item 1 */}
        <div className="relative pl-8 pb-6 border-l-2 border-blue-600">
          <div className="absolute -left-2 top-0 w-4 h-4 bg-blue-600 rounded-full"></div>

          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="text-lg font-bold text-gray-900">Senior Product Designer</h4>
              <p className="text-gray-600">
                TechFlow Inc. <span className="text-gray-400">• San Francisco, CA</span>
              </p>
            </div>
            <span className="text-sm text-gray-500">2021 - Present</span>
          </div>

          <p className="text-gray-700 text-sm">
            Leading the design of the core SaaS platform. Managed a team of 3 junior designers and established the company&apos;s first design system.
          </p>
        </div>

        {/* Experience Item 2 */}
        <div className="relative pl-8 border-l-2 border-gray-200">
          <div className="absolute -left-2 top-0 w-4 h-4 bg-gray-300 rounded-full"></div>

          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="text-lg font-bold text-gray-900">Product Designer</h4>
              <p className="text-gray-600">
                Creative Solutions Agency <span className="text-gray-400">• New York, NY</span>
              </p>
            </div>
            <span className="text-sm text-gray-500">2018 - 2021</span>
          </div>

          <p className="text-gray-700 text-sm">
            Worked with various clients to deliver mobile and web applications. Responsible for end-to-end design process from wireframing to high-fidelity prototypes.
          </p>
        </div>
      </div>
    </div>
  );
}
