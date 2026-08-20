import React, { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { useHRNotifications } from '../../context/HRNotificationContext';
import { Bell, Check, Eye, Trash2 } from 'lucide-react';

export const Notifications = () => {
  const { notifications, unreadCount, markAllAsRead, markAsRead, clearAll } = useHRNotifications();
  const [filterType, setFilterType] = useState('ALL');

  const filtered = filterType === 'ALL'
    ? notifications
    : notifications.filter((n) => n.type === filterType);

  return (
    <div className="space-y-6 text-xs font-semibold">
      <PageHeader
        title="HR Notifications & System Feed"
        subtitle="Access system updates, new leave application alerts, and staff event notices."
        actions={
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Mark All Read</span>
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={clearAll}
                className="flex items-center gap-1.5 px-3.5 py-2 border border-rose-200 dark:border-rose-900/40 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 font-bold cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Feed</span>
              </button>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Filter bar */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-4 shadow-xs space-y-1.5 shrink-0 text-left">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block px-2 pb-1 border-b border-slate-100 dark:border-slate-800">
            Filter Alerts
          </span>
          {[
            { id: 'ALL', label: `All Alerts (${notifications.length})` },
            { id: 'info', label: 'Info & Notice' },
            { id: 'leave', label: 'Leave Requests' },
            { id: 'payroll', label: 'Payroll Alerts' },
            { id: 'attendance', label: 'Attendance' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterType(cat.id)}
              className={`w-full px-3 py-2 rounded-xl text-left transition-all cursor-pointer ${
                filterType === cat.id
                  ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* List Feed */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-3.5">
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-2">
              <Bell className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700" />
              <p>No notifications in your feed.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800 space-y-3 text-left">
              {filtered.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markAsRead(n.id)}
                  className={`pt-3.5 first:pt-0 flex items-start gap-3.5 p-3 rounded-2xl transition-colors cursor-pointer ${
                    !n.read
                      ? 'bg-indigo-50/40 dark:bg-indigo-950/20'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 mt-1 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {n.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {n.timestamp ? new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{n.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Notifications;
