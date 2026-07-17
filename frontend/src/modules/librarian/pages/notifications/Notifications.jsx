import React from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Badge } from '../../components/ui/Badge';
import { useLibrarianNotifications } from '../../context/LibrarianNotificationContext';
import { Bell, CheckCheck, Trash2, ShieldAlert, Receipt, Info, Bookmark } from 'lucide-react';
import { cn } from '../../utils/cn';

export const Notifications = () => {
  const { notifications, unreadCount, markAllAsRead, markAsRead } = useLibrarianNotifications();

  const getIcon = (type) => {
    switch (type) {
      case 'overdue':
        return <ShieldAlert className="h-5 w-5 text-rose-600 dark:text-rose-450" />;
      case 'fine':
        return <Receipt className="h-5 w-5 text-emerald-600 dark:text-emerald-450" />;
      case 'reservation':
        return <Bookmark className="h-5 w-5 text-amber-600 dark:text-amber-400" />;
      default:
        return <Info className="h-5 w-5 text-blue-600 dark:text-blue-450" />;
    }
  };

  const getBg = (type) => {
    switch (type) {
      case 'overdue':
        return 'bg-rose-50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-950/30';
      case 'fine':
        return 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-950/30';
      case 'reservation':
        return 'bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-950/30';
      default:
        return 'bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-950/30';
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Alert Notifications"
        subtitle="Manage overdue notices, hold queues warnings, and fine collected alerts."
        actions={
          unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="h-10 px-4 border border-slate-205 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-150 bg-white dark:bg-slate-900"
            >
              <CheckCheck className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400" />
              <span>Mark All as Read</span>
            </button>
          )
        }
      />

      <div className="space-y-3 max-w-3xl mx-auto">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => markAsRead(notif.id)}
              className={cn(
                "p-5 border rounded-2xl flex gap-4 transition-all duration-150 cursor-pointer",
                getBg(notif.type),
                !notif.read ? "shadow-xs border-amber-300 dark:border-amber-900/50" : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-70 hover:opacity-100"
              )}
            >
              <div className="p-2.5 bg-white dark:bg-slate-950 rounded-xl shrink-0 h-10 w-10 flex items-center justify-center border border-slate-100 dark:border-slate-850 shadow-xs">
                {getIcon(notif.type)}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-start">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {notif.title}
                  </h4>
                  <span className="text-4xs text-slate-450 font-bold uppercase tracking-wider">{notif.time}</span>
                </div>
                <p className="text-2xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {notif.message}
                </p>
                {!notif.read && (
                  <Badge variant="amber" className="mt-1.5">
                    Unread Alert
                  </Badge>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="py-16 text-center space-y-3">
            <div className="inline-flex p-4 bg-slate-100 dark:bg-slate-900 text-slate-400 rounded-full">
              <Bell className="h-8 w-8" />
            </div>
            <p className="text-slate-500 font-semibold text-sm">No new alert notifications.</p>
          </div>
        )}
      </div>
    </div>
  );
};
