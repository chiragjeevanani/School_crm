import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { NAVIGATION_ITEMS } from '../../utils/constants';
import { useTransportAuth } from '../../context/TransportAuthContext';
import { cn } from '../../utils/cn';
import { LogOut, Bus, ChevronLeft } from 'lucide-react';

export const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { logout, user } = useTransportAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/transport/login');
  };

  const categories = ['Main', 'Fleet', 'Operations', 'Service', 'Finance', 'Communication', 'System'];

  return (
    <aside className={cn(
      "fixed top-0 bottom-0 left-0 z-40 bg-slate-950 text-white w-64 border-r border-slate-900 transition-transform duration-300 md:translate-x-0 flex flex-col justify-between",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <div>
        {/* Brand Header */}
        <div className="h-16 px-6 border-b border-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-cyan-600 rounded-xl text-white">
              <Bus className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-wide block">FLEET PORTAL</span>
              <span className="text-3xs text-cyan-500 font-bold uppercase tracking-wider block">Transport Manager</span>
            </div>
          </div>
          <button 
            onClick={toggleSidebar}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-900 hover:text-white md:hidden"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-140px)] no-scrollbar">
          {categories.map((category) => {
            const items = NAVIGATION_ITEMS.filter(item => item.category === category);
            if (!items.length) return null;

            return (
              <div key={category} className="space-y-1">
                <span className="px-3 text-3xs font-extrabold tracking-widest text-slate-500 uppercase">
                  {category}
                </span>
                <div className="space-y-0.5 mt-1.5">
                  {items.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path || 
                                     (item.path !== '/transport/dashboard' && location.pathname.startsWith(item.path));

                    return (
                      <NavLink
                        key={item.name}
                        to={item.path}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-xl transition-all duration-150 relative overflow-hidden group",
                          isActive
                            ? "bg-cyan-650 text-white shadow-md shadow-cyan-900/10"
                            : "text-slate-400 hover:bg-slate-900/50 hover:text-slate-100"
                        )}
                      >
                        <Icon className={cn(
                          "h-4.5 w-4.5 shrink-0 transition-transform duration-200 group-hover:scale-105",
                          isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"
                        )} />
                        <span>{item.name}</span>
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile & Logout */}
      <div className="p-4 border-t border-slate-900 bg-slate-950/80">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={user?.photoUrl}
              alt={user?.name}
              className="h-9 w-9 rounded-full border border-slate-800 shrink-0"
            />
            <div className="min-w-0">
              <span className="block text-xs font-bold text-slate-250 truncate">{user?.name}</span>
              <span className="block text-4xs text-slate-500 font-bold uppercase truncate tracking-wider">{user?.role}</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Log Out"
            className="p-2 rounded-xl text-slate-400 hover:bg-slate-900 hover:text-rose-500 transition-colors shrink-0"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
