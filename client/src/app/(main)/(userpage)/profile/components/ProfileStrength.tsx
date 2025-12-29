import React from 'react';

export default function ProfileStrength() {
  const profileStrength = 60;
  return (
    <div className="bg-blue-600 rounded-lg p-6 shadow-sm text-white">
      <h3 className="text-lg font-bold mb-2">Profile Strength</h3>
      <p className="text-sm text-blue-100 mb-4">Complete your profile to appear in more searches.</p>

      <div className="mb-2">
        <div className="h-2 bg-blue-400 rounded-full overflow-hidden">
          <div className="h-full bg-white transition-all duration-300" style={{ width: `${profileStrength}%` }}></div>
        </div>
      </div>

      <div className="text-right text-sm font-semibold">{profileStrength}% Complete</div>
    </div>
  );
}
