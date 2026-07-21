import React, { useState } from 'react';
import { Search, Bell, Sun, Moon, Sparkles } from 'lucide-react';
import { useSuperAdminTheme } from '../../context/SuperAdminThemeContext';
import { useSuperAdminNotifications } from '../../context/SuperAdminNotificationContext';
import { Button } from '../ui/Button';

export const Topbar = ({ onOpenCommandPalette }) => {
  const { isDark, toggleTheme } = useSuperAdminTheme();
  const { unreadCount, notifications, markAllRead } = useSuperAdminNotifications();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-900 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-30 select-none">
      {/* Search Trigger */}
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-3 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700/80 transition-all rounded-lg px-3 py-1.5 w-64 text-left text-slate-500 hover:text-slate-400 group"
        >
          <Search size={16} className="group-hover:scale-110 transition-transform" />
          <span className="text-sm">Search panel...</span>
          <div className="ml-auto bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-450 dark:text-slate-400 px-1.5 py-0.5 rounded">
            Ctrl+K
          </div>
        </button>
      </div>

      {/* Action Triggers */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-slate-150 dark:bg-slate-900 border border-slate-200 dark:border-slate-900 hover:border-slate-300 dark:hover:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg bg-slate-150 dark:bg-slate-900 border border-slate-200 dark:border-slate-900 hover:border-slate-300 dark:hover:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors relative"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl overflow-hidden z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-900">
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Alert Center</span>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
                    Mark read
                  </button>
                )}
              </div>
              <div className="max-h-[300px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-900">
                {notifications.map((notif) => (
                  <div key={notif.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors flex gap-3">
                    <Sparkles className="w-4 h-4 text-indigo-550 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{notif.message}</p>
                      <span className="text-[10px] text-slate-500 mt-1 block">{notif.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
