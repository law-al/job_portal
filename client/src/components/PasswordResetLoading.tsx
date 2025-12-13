import React from 'react';

export default function PasswordResetLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full bg-white rounded-3xl shadow-lg overflow-hidden">
        <div className="grid md:grid-cols-2">
          {/* Left Side - Message */}
          <div className="bg-gray-50 p-12 flex flex-col justify-between">
            <div className="flex-1 flex items-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Your next career move is one step closer.
              </h1>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">JobPortal</h2>
            </div>
          </div>

          {/* Right Side - Loading */}
          <div className="p-12 flex items-center justify-center">
            <div className="max-w-md w-full text-center">
              {/* Loading Spinner */}
              <div className="w-20 h-20 mx-auto mb-8 relative">
                {/* Outer spinning circle */}
                <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>

                {/* Inner icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                    />
                  </svg>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Verifying Reset Link
              </h2>

              {/* Description */}
              <p className="text-gray-600 mb-4 leading-relaxed">
                Please wait while we verify your password reset link. This will only take a moment.
              </p>

              {/* Loading dots animation */}
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
