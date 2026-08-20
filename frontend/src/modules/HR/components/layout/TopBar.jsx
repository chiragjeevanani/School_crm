import React, { useState } from 'react';
import { useHRAuth } from '../../context/HRAuthContext';
import { useHRTheme } from '../../context/HRThemeContext';
import { useHRNotifications } from '../../context/HRNotificationContext';
import {
  Bell,
  Search,
  Sun,
  Moon,
  Menu,
  CalendarDays,
  Settings,
  LogOut,
  X,
  Check,
  Users,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const TopBar = ({ toggleSidebar, onSearchTrigger }) => {
  const { user, logout } = useHRAuth();
  const { darkMode, toggleDarkMode } = useHRTheme();
  const { notifications, unreadCount, markAllAsRead, markAsRead } = useHRNotifications();
  const navigate = useNavigate();

  // Dropdown States
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/hr/login');
  };

  return (
    <header className="sticky top-0 z-35 flex h-16 items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 md:px-8 shadow-sm">
      {/* Mobile Drawer Trigger & Search Indicator */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500 dark:text-slate-400 md:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <button
          onClick={onSearchTrigger}
          className="hidden md:flex items-center gap-2 px-3.5 py-1.5 bg-slate-50 dark:bg-slate-950 text-slate-400 border border-slate-200 dark:border-slate-800 rounded-xl text-xs hover:border-slate-300 transition-colors w-64 cursor-pointer"
        >
          <Search className="w-3.5 h-3.5 shrink-0" />
          <span className="flex-1 text-left">Search / Quick actions...</span>
          <span className="text-[9px] font-bold bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-800">
            Ctrl K
          </span>
        </button>
      </div>

      {/* Right Actions Grid */}
      <div className="flex items-center gap-4">
        {/* Academic Session */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-xl text-xs font-bold">
          <CalendarDays className="w-3.5 h-3.5" />
          <span>Session: {user?.academicSession || '2024-2025'}</span>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          title="Toggle Theme"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500 dark:text-slate-400 relative transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">HR Notifications</h3>
                  <p className="text-[11px] text-slate-400">{unreadCount} unread announcements</p>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" /> Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    No new HR notifications or alerts
                  </div>
                ) : (
                  notifications.slice(0, 5).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markAsRead(n.id)}
                      className={`p-3.5 transition-colors cursor-pointer flex items-start gap-3 ${
                        !n.read ? 'bg-indigo-50/40 dark:bg-indigo-950/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{n.title}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{n.message}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          {n.timestamp ? new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-2 border-t border-slate-100 dark:border-slate-800 text-center bg-slate-50 dark:bg-slate-950/50">
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    navigate('/hr/notifications');
                  }}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  View All Notifications Feed →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar / Quick Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center border border-indigo-200 dark:border-indigo-800">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'H'}
            </div>
            <div className="hidden md:block text-left">
              <span className="block text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                {user?.name || 'Rohan Verma'}
              </span>
              <span className="block text-[10px] font-semibold text-slate-400 leading-tight">
                {user?.role || 'HR Lead'}
              </span>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 p-2 space-y-1">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user?.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
              </div>
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate('/hr/settings');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>HR Settings</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
export default TopBar;
