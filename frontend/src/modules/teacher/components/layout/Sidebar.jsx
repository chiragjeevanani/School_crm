import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { NAVIGATION_ITEMS } from '../../utils/constants';
import { useTeacherAuth } from '../../context/TeacherAuthContext';
import { cn } from '../../utils/cn';
import { LogOut, BookOpenCheck } from 'lucide-react';

export const Sidebar = () => {
  const { logout, user } = useTeacherAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/teacher/login');
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
      <div className="flex items-center gap-3 px-3 mb-8">
        <div className="p-2 bg-primary/10 rounded-xl text-primary">
          <BookOpenCheck className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-base font-bold m-0 p-0 text-foreground tracking-tight leading-none">KrishiKart</h1>
          <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase mt-1 block">Teacher Portal</span>
        </div>
      </div>

      {/* User Info Quick View */}
      {user && (
        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-border mb-6">
          <img src={user.photo} alt={user.name} className="w-10 h-10 rounded-xl object-cover border border-border" />
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-foreground truncate leading-none mb-1">{user.name}</h4>
            <span className="text-[10px] text-slate-400 font-medium truncate block">{user.designation} • {user.department}</span>
          </div>
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
