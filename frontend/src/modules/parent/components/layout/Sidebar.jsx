import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { NAVIGATION_ITEMS } from '../../utils/constants';
import { useParentAuth } from '../../context/ParentAuthContext';
import { cn } from '../../utils/cn';
import { LogOut, GraduationCap, ArrowUpDown } from 'lucide-react';

export const Sidebar = () => {
  const { logout, user, selectedChildId, changeSelectedChild, activeChildInfo } = useParentAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/parent/login');
  };

  // Group navigation items by category
  const categories = NAVIGATION_ITEMS.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <aside className="hidden md:flex flex-col w-64 lg:w-72 h-screen sticky top-0 bg-white dark:bg-slate-950 border-r border-border px-4 py-6 overflow-y-auto no-scrollbar z-40 transition-all duration-300">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-xl text-primary">
          <GraduationCap className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-base font-bold m-0 p-0 text-foreground tracking-tight leading-none">KrishiKart</h1>
          <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase mt-1 block">Parent Portal</span>
        </div>
      </div>

      {/* Sibling Quick Switcher Widget */}
      {user && (
        <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border border-border rounded-2xl mb-6">
          <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Active Child
          </label>
          <div className="relative">
            <select
              value={selectedChildId}
              onChange={(e) => changeSelectedChild(e.target.value)}
              className="w-full text-xs font-bold bg-white dark:bg-slate-950 border border-border px-3 py-2 pr-8 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20"
              id="sidebar-child-select"
            >
              {user.linkedChildren.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.class})</option>
              ))}
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          {activeChildInfo && (
            <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-border/80">
              <img src={activeChildInfo.photo} alt={activeChildInfo.name} className="w-8 h-8 rounded-lg object-cover" />
              <div className="min-w-0">
                <p className="text-[10px] font-extrabold text-foreground truncate">{activeChildInfo.name}</p>
                <p className="text-[9px] text-slate-400 font-medium">{activeChildInfo.class} - {activeChildInfo.section} • Roll #{activeChildInfo.rollNo}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Navigation List */}
      <nav className="flex-1 space-y-6">
        {Object.entries(categories).map(([category, items]) => (
          <div key={category} className="space-y-1">
            <span className="px-3 text-[9px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase block mb-1">
              {category}
            </span>
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all select-none duration-150",
                    isActive
                      ? "bg-primary text-white shadow-premium scale-[1.01]"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-foreground"
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.name}</span>
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Logout Action */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-3 py-2.5 text-xs font-semibold text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors w-full mt-6 select-none text-left"
      >
        <LogOut className="w-4 h-4 shrink-0" />
        <span>Logout</span>
      </button>
    </aside>
  );
};
