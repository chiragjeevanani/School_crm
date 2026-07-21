import React from 'react';
import { Card } from '../../components/ui/Button';
import { useSuperAdminNotifications } from '../../context/SuperAdminNotificationContext';
import { Bell, Sparkles } from 'lucide-react';

export default function NotificationsIndex() {
  const { notifications } = useSuperAdminNotifications();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Platform Notifications Log</h1>
        <p className="text-xs text-slate-400">Review critical alerts, backup status reports, and licensing notifications.</p>
      </div>

      <Card className="space-y-4">
        <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Bell size={16} className="text-indigo-500 dark:text-indigo-400" />
          Alert Stream
        </h3>
        <div className="divide-y divide-slate-100 dark:divide-slate-900">
          {notifications.map((notif) => (
            <div key={notif.id} className="py-4 first:pt-0 last:pb-0 flex gap-3">
              <Sparkles className="w-5 h-5 text-indigo-500 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-slate-800 dark:text-slate-200 font-medium">{notif.message}</p>
                <span className="text-xs text-slate-500 mt-1 block">{notif.time}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
