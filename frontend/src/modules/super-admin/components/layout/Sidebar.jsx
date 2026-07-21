import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  School,
  CreditCard,
  KeyRound,
  Grid3X3,
  Server,
  HardDrive,
  DollarSign,
  Receipt,
  Ticket,
  Megaphone,
  Activity,
  History,
  ShieldCheck,
  Cable,
  Settings2,
  FileText,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { useSuperAdminAuth } from '../../context/SuperAdminAuthContext';
import { cn } from '../ui/Button';

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sa_sidebar_collapsed');
    return saved ? JSON.parse(saved) : false;
  });

  const { admin, logout } = useSuperAdminAuth();
  const navigate = useNavigate();

  const handleToggle = () => {
    setIsCollapsed((prev) => {
      const newState = !prev;
      localStorage.setItem('sa_sidebar_collapsed', JSON.stringify(newState));
      return newState;
    });
  };

  const menuGroups = [
    {
      title: 'Platform',
      items: [
        { name: 'Dashboard', path: '/super-admin/dashboard', icon: LayoutDashboard },
        { name: 'Schools', path: '/super-admin/schools', icon: School },
        { name: 'Subscriptions', path: '/super-admin/subscriptions', icon: CreditCard },
        { name: 'Licenses', path: '/super-admin/licenses', icon: KeyRound },
        { name: 'Modules', path: '/super-admin/modules', icon: Grid3X3 },
      ]
    },
    {
      title: 'Tenant & Storage',
      items: [
        { name: 'Tenants', path: '/super-admin/tenants', icon: Server },
        { name: 'Storage', path: '/super-admin/storage', icon: HardDrive },
      ]
    },
    {
      title: 'Finance & Logs',
      items: [
        { name: 'Revenue', path: '/super-admin/revenue', icon: DollarSign },
        { name: 'Billing', path: '/super-admin/billing', icon: Receipt },
        { name: 'Audit Logs', path: '/super-admin/audit-logs', icon: History },
      ]
    },
    {
      title: 'Operations',
      items: [
        { name: 'Support Center', path: '/super-admin/support', icon: Ticket },
        { name: 'Broadcast', path: '/super-admin/broadcast', icon: Megaphone },
        { name: 'Monitoring', path: '/super-admin/monitoring', icon: Activity },
      ]
    },
    {
      title: 'Configuration',
      items: [
        { name: 'Security', path: '/super-admin/security', icon: ShieldCheck },
        { name: 'Integrations', path: '/super-admin/integrations', icon: Cable },
        { name: 'Platform Settings', path: '/super-admin/platform-settings', icon: Settings2 },
        { name: 'Reports', path: '/super-admin/reports', icon: FileText },
        { name: 'Notifications', path: '/super-admin/notifications', icon: Bell },
      ]
    }
  ];

  return (
    <motion.aside
      className={cn(
        'fixed top-0 left-0 z-40 h-screen bg-slate-900 dark:bg-slate-950/95 border-r border-slate-200 dark:border-slate-900 flex flex-col justify-between py-4 select-none',
        isCollapsed ? 'w-16' : 'w-64'
      )}
      animate={{ width: isCollapsed ? 64 : 256 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
    >
      <div className="flex flex-col flex-1 overflow-y-auto px-3">
        {/* Brand Header */}
        <div className={cn('flex items-center mb-6 px-2', isCollapsed ? 'justify-center' : 'justify-between')}>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2"
            >
              <div className="bg-indigo-600 p-1.5 rounded-lg flex items-center justify-center">
                <span className="font-bold text-white tracking-wider text-sm">AG</span>
              </div>
              <span className="font-bold text-slate-100 dark:text-white text-md tracking-wider">Antigravity Portal</span>
            </motion.div>
          )}
          {isCollapsed && (
            <div className="bg-indigo-600 w-8 h-8 rounded-lg flex items-center justify-center">
              <span className="font-bold text-white text-xs">AG</span>
            </div>
          )}
          <button
            onClick={handleToggle}
            className="hidden md:flex p-1.5 rounded-lg hover:bg-slate-900 border border-slate-900 hover:border-slate-800 text-slate-400 hover:text-slate-100 transition-colors"
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* Navigation Items */}
        <div className="space-y-4">
          {menuGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1">
              {!isCollapsed && (
                <motion.h4
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-2 mb-2"
                >
                  {group.title}
                </motion.h4>
              )}
              {group.items.map((item, idx) => (
                <NavLink
                  key={idx}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 group relative',
                      isActive
                        ? 'bg-indigo-600 text-white font-medium shadow-md shadow-indigo-600/10'
                        : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
                    )
                  }
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      {item.name}
                    </motion.span>
                  )}
                  {isCollapsed && (
                    <div className="absolute left-14 bg-slate-950 border border-slate-800 text-slate-100 text-xs px-2.5 py-1.5 rounded shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap">
                      {item.name}
                    </div>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* User Section at Bottom */}
      <div className="px-3 border-t border-slate-900/60 pt-4 mt-auto">
        <div className={cn('flex items-center gap-3 p-2 rounded-lg bg-slate-900/40 border border-slate-900/60', isCollapsed && 'justify-center')}>
          <img
            src={admin?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=60'}
            alt="Avatar"
            className="w-8 h-8 rounded-full border border-slate-800"
          />
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-200 truncate">{admin?.name || 'Chirag J.'}</p>
              <p className="text-[10px] text-slate-500 truncate">{admin?.role || 'Super Admin'}</p>
            </div>
          )}
          {!isCollapsed && (
            <button
              onClick={() => { logout(); navigate('/super-admin/login'); }}
              className="text-slate-400 hover:text-rose-400 transition-colors p-1"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </motion.aside>
  );
};
