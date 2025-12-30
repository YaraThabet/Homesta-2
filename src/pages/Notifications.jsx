import React from 'react';
import { Bell, Heart } from 'lucide-react';

const Notifications = () => {
  return (
    <div className="min-h-screen bg-white pt-[150px]">
      {/* Header */}
      <div className="bg-gray-100 py-8 text-center">
        <h1 className="text-2xl font-semibold text-teal-700 mb-2">Notification</h1>
        <p className="text-sm text-gray-500">Home / Notification</p>
      </div>

      {/* Empty State */}
      <div className="flex flex-col items-center justify-center py-32 px-4">
        {/* Bell Icon with Heart */}
        <div className="relative mb-8">
          <div className="w-40 h-40 flex items-center justify-center">
            <svg viewBox="0 0 120 120" className="w-full h-full">
              {/* Bell body */}
              <path
                d="M60 15 C40 15 25 35 25 55 L25 75 L20 85 L100 85 L95 75 L95 55 C95 35 80 15 60 15"
                fill="#E8EDF2"
                stroke="none"
              />
              {/* Bell bottom curve */}
              <ellipse cx="60" cy="85" rx="40" ry="8" fill="#E8EDF2" />
              {/* Bell clapper area */}
              <path
                d="M50 93 Q60 100 70 93"
                fill="none"
                stroke="#D1D9E0"
                strokeWidth="3"
                strokeLinecap="round"
              />
              {/* Heart in center */}
              <path
                d="M60 45 C55 38 45 38 45 48 C45 58 60 68 60 68 C60 68 75 58 75 48 C75 38 65 38 60 45"
                fill="#D1D9E0"
              />
            </svg>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-gray-900 mb-4">No notifications yet</h2>
        <p className="text-gray-500 text-center max-w-sm">
          get your home ready step by step, and we'll keep you updated with all offers and news
        </p>
      </div>
    </div>
  );
};

export default Notifications;
