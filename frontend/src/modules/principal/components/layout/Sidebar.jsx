import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { NAVIGATION_ITEMS } from '../../utils/constants';
import { usePrincipalAuth } from '../../context/PrincipalAuthContext';
import { cn } from '../../utils/cn';
import { LogOut, GraduationCap, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const { logout, user } = usePrincipalAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/principal/login');
  };

  // Group items by category
  const categories = NAVIGATION_ITEMS.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <aside 
      className={cn(
        "hidden md:flex flex-col h-screen sticky top-0 bg-slate-950 text-slate-350 border-r border-slate-900 px-4 py-6 overflow-y-auto no-scrollbar z-40 transition-all duration-300 shrink-0",
        isCollapsed ? "w-20" : "w-68 lg:w-72"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-405">
            <GraduationCap className="w-8 h-8 shrink-0" />
          </div>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              <h1 className="text-sm font-black text-white tracking-tight leading-none">Greenfield</h1>
              <span className="text-[10px] text-slate-500 font-bold tracking-wider uppercase mt-1 block">Principal Portal</span>
            </motion.div>
          )}
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 hover:bg-slate-900 rounded-lg text-slate-400 hover:text-white transition-colors"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* User Card */}
      {user && !isCollapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-3 p-3 bg-slate-900/60 border border-slate-800/80 rounded-2xl mb-6 shrink-0"
        >
          <img src={user.photo} alt={user.name} className="w-10 h-10 rounded-xl object-cover border border-slate-800" />
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-white truncate leading-none mb-1">{user.name}</h4>
            <span className="text-[10px] text-slate-500 font-medium truncate block">{user.role}</span>
          </div>
        </motion.div>
      )}

      {/* Nav Link Tree */}
      <nav className="flex-1 space-y-5">
        {Object.entries(categories).map(([category, items]) => (
          <div key={category} className="space-y-1">
            {!isCollapsed && (
              <span className="px-3.5 text-[9px] font-black tracking-widest text-slate-500 uppercase block mb-2 select-none">
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
                    "flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all duration-150 select-none",
                    isActive 
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/15 scale-[1.01]" 
                      : "text-slate-450 hover:bg-slate-900 hover:text-white"
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

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-3.5 py-3 text-xs font-semibold text-rose-450 hover:bg-rose-500/10 rounded-xl transition-colors w-full mt-6 select-none text-left"
      >
        <LogOut className="w-4 h-4 shrink-0" />
        {!isCollapsed && <span>Logout</span>}
      </button>
    </aside>
  );
};
export default Sidebar;
