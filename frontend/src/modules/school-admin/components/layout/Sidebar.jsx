import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { NAVIGATION_ITEMS } from '../../utils/constants';
import { useSchoolAdminAuth } from '../../context/SchoolAdminAuthContext';
import { cn } from '../../utils/cn';
import { LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import BrandLogo from '../../../../shared/ui/BrandLogo';

export const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const { logout, user, hasPlan } = useSchoolAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/school-admin/login');
  };

  const navItems = hasPlan
    ? NAVIGATION_ITEMS
    : NAVIGATION_ITEMS.filter((item) => item.path === '/school-admin/plans');

  const categories = navItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <aside 
      className={cn(
        "hidden md:flex flex-col h-screen sticky top-0 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-300 border-r border-border dark:border-slate-900 px-4 py-6 overflow-y-auto no-scrollbar z-40 transition-all duration-300",
        isCollapsed ? "w-20" : "w-68 lg:w-72"
      )}
    >
      {/* Brand Header */}
      <div className={cn(
        "flex mb-8 px-2 transition-all duration-300",
        isCollapsed ? "flex-col items-center gap-4" : "items-center justify-between"
      )}>
        <div className={cn("flex items-center", isCollapsed ? "justify-center" : "gap-3")}>
          <BrandLogo className="h-10 w-10" />
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              <h1 className="text-sm font-black text-foreground dark:text-white tracking-tight leading-none truncate max-w-[140px]">
                {user?.schoolName || 'School'}
              </h1>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold tracking-wider uppercase mt-1 block">Admin Portal</span>
            </motion.div>
          )}
        </div>

        {/* Collapse Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg text-slate-400 hover:text-foreground dark:hover:text-white transition-colors"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* User Info Quick View */}
      {user && !isCollapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/60 border border-border dark:border-slate-800/80 rounded-2xl mb-6"
        >
          {user.photo ? (
            <img src={user.photo} alt={user.name} className="w-10 h-10 rounded-xl object-cover border border-border dark:border-slate-800" />
          ) : (
            <div className="flex w-10 h-10 items-center justify-center rounded-xl bg-indigo-50 text-sm font-black text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
              {(user.name || 'S').charAt(0)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-foreground dark:text-white truncate leading-none mb-1">{user.name}</h4>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium truncate block">{user.role}</span>
          </div>
        </motion.div>
      )}

      {/* Navigation List */}
      <nav className="flex-1 space-y-6">
        {Object.entries(categories).map(([category, items]) => (
          <div key={category} className="space-y-1">
            {!isCollapsed && (
              <span className="px-3 text-[9px] font-extrabold tracking-widest text-slate-400 dark:text-slate-500 uppercase block mb-2 select-none">
                {category}
              </span>
            )}
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  title={isCollapsed ? item.name : undefined}
                  className={cn(
                    "flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all select-none duration-150",
                    isActive
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/15 scale-[1.01]"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-foreground dark:hover:text-white"
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {!isCollapsed && <span className="truncate">{item.name}</span>}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Logout Action */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-3.5 py-3 text-xs font-semibold text-rose-500 dark:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors w-full mt-6 select-none text-left"
      >
        <LogOut className="w-4 h-4 shrink-0" />
        {!isCollapsed && <span>Logout</span>}
      </button>
    </aside>
  );
};
