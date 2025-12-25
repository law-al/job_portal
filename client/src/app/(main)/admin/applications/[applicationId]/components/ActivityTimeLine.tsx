import React from 'react';
import { formatDistanceToNowStrict } from 'date-fns';

interface Activity {
  id: string;
  type: string;
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata: Record<string, any> | null;
  createdAt: string;
  actor: {
    id: string;
    email: string;
  } | null;
}

export default function ActivityTimeLine({ activities }: { activities: Activity[] }) {
  const getActorName = (email: string | null) => {
    if (!email) return 'System';
    const name = email.split('@')[0];
    return name
      .split('.')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  };

  const isRecentActivity = (createdAt: string) => {
    const activityDate = new Date(createdAt);
    const now = new Date();
    const diffInHours = (now.getTime() - activityDate.getTime()) / (1000 * 60 * 60);
    return diffInHours < 24; // Active if within last 24 hours
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <h3 className="text-xs font-semibold text-gray-500 mb-4 uppercase tracking-wide">Activity Timeline</h3>

      {activities.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400 text-sm">No activities yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const isActive = index === 0 ? true : false;
            const actorName = getActorName(activity.actor?.email || null);

            return (
              <div key={activity.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                  {index < activities.length - 1 && <div className="w-0.5 h-full bg-gray-200 mt-1"></div>}
                </div>
                <div className="flex-1 pb-4">
                  <p className="font-medium text-gray-900 text-sm">{activity.message}</p>
                  {activity.actor && <p className="text-xs text-gray-600 mt-0.5">by {actorName}</p>}
                  <p className="text-xs text-gray-500 mt-1">{formatDistanceToNowStrict(new Date(activity.createdAt), { addSuffix: true })}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activities.length > 0 && <button className="text-blue-600 text-sm font-medium mt-2 hover:underline">View Full Log</button>}
    </div>
  );
}
