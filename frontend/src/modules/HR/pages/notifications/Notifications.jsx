import React, { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { useHRNotifications } from '../../context/HRNotificationContext';
import { Badge } from '../../components/ui/Badge';
import { Eye } from 'lucide-react';

export const Notifications = () => {
  const { notifications, unreadCount, markAllAsRead, markAsRead } = useHRNotifications();
  const [filterType, setFilterType] = useState('ALL');

  const filtered = filterType === 'ALL'
    ? notifications
    : notifications.filter(n => n.type === filterType);

  return (
    <div className="space-y-6 text-xs font-semibold">
      <PageHeader 
        title="Notifications Feed" 
        subtitle="Access system updates, new leave application alerts, and document expiration triggers." 
        actions={
          unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-1.5 px-3.5 py-2 border rounded-xl hover:bg-slate-50 dark:hover:bg-slate-950 text-slate-500 font-bold"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
          )
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Filter bar */}
        <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-3xl p-4 shadow-sm space-y-1.5 shrink-0 text-left">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block px-2 pb-1 border-b">Filter Alerts</span>
          {[
            { id: 'ALL', label: 'All Alerts' },
            { id: 'Leave Update', label: 'Leave Requests' },
            { id: 'Document Expiry', label: 'Document Expiries' },
            { id: 'Payroll Notification', label: 'Payroll Updates' },
            { id: 'Joining Alert', label: 'Staff Joinings' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterType(cat.id)}
              className={`w-full px-3 py-2 rounded-xl text-left transition-all ${
                filterType === cat.id 
                  ? 'bg-rose-50 dark:bg-rose-955/20 text-rose-600 dark:text-rose-450 font-bold' 
                  : 'hover:bg-slate-50 dark:hover:bg-slate-950 text-slate-655'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* List Feed */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3.5">
          <div className="divide-y divide-slate-100 dark:divide-slate-850/50 space-y-3.5 text-left">
            {filtered.map((n) => (
              <div 
                key={n.id} 
                onClick={() => markAsRead(n.id)}
                className={`pt-3.5 flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-50/20 rounded-lg p-2 ${!n.read ? 'bg-rose-500/5' : ''}`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-905 dark:text-white text-xs">{n.title}</span>
                    <Badge variant={n.type === 'Leave Update' ? 'warning' : 'danger'}>
                      {n.type}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">{n.message}</p>
                  <span className="text-[9px] text-slate-400 block pt-1">{n.time}</span>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <p className="text-center py-12 text-slate-400">No matching notifications in this category.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Notifications;
