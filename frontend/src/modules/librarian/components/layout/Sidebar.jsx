import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { NAVIGATION_ITEMS } from '../../utils/constants';
import { useLibrarianAuth } from '../../context/LibrarianAuthContext';
import { cn } from '../../utils/cn';
import { LogOut, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import BrandLogo from '../../../../shared/ui/BrandLogo';

export const Sidebar = ({ isCollapsed, setIsCollapsed, isOpen, toggleSidebar }) => {
  const { logout, user } = useLibrarianAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/librarian/login');
  };

  // Group navigation items by category
  const categories = ['Main', 'Catalogue', 'Circulation', 'Members', 'System'];

  return (
    <aside className={cn(
      "fixed top-0 bottom-0 left-0 z-40 bg-white dark:bg-slate-950 text-slate-600 dark:text-white border-r border-border dark:border-slate-900 transition-all duration-300 md:translate-x-0 flex flex-col justify-between",
      isCollapsed ? "md:w-20 w-64" : "md:w-68 lg:w-72 w-64",
      isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
    )}>
      {/* Brand Header */}
      <div>
        <div className={cn(
          "h-16 px-6 border-b border-border dark:border-slate-900 flex items-center transition-all duration-300",
          isCollapsed ? "flex-col justify-center gap-3 h-auto py-4" : "justify-between"
        )}>
          <div className={cn("flex items-center", isCollapsed ? "justify-center" : "gap-2.5")}>
            <BrandLogo className="h-9 w-9" />
            {!isCollapsed && (
              <div>
                <span className="font-bold text-sm tracking-wide block text-foreground dark:text-white">LMS PORTAL</span>
                <span className="text-3xs text-amber-600 dark:text-amber-500 font-bold uppercase tracking-wider block">School Library</span>
              </div>
            )}
          </div>
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-foreground dark:hover:text-white transition-colors"
          >
            {isCollapsed ? <ChevronRight className="h-4.5 w-4.5" /> : <ChevronLeft className="h-4.5 w-4.5" />}
          </button>
          <button 
            onClick={toggleSidebar}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-foreground dark:hover:text-white md:hidden"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="p-4 space-y-5 overflow-y-auto max-h-[calc(100vh-140px)] no-scrollbar">
          {categories.map((category) => {
            const items = NAVIGATION_ITEMS.filter(item => item.category === category);
            if (!items.length) return null;

            return (
              <div key={category} className="space-y-1">
                {!isCollapsed && (
                  <span className="px-3 text-3xs font-extrabold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
                    {category}
                  </span>
                )}
                <div className="space-y-0.5 mt-1.5">
                  {items.map((item) => {
                    const Icon = item.icon;
                    // Exact match or sub-route match
                    const isActive = location.pathname === item.path || 
                                     (item.path !== '/librarian/dashboard' && location.pathname.startsWith(item.path));

                    return (
                      <NavLink
                        key={item.name}
                        to={item.path}
                        title={isCollapsed ? item.name : undefined}
                        className={cn(
                          "flex items-center transition-all duration-150 relative overflow-hidden group",
                          isCollapsed ? "justify-center p-2 rounded-xl" : "gap-3 px-3 py-2 text-xs font-semibold rounded-xl",
                          isActive
                            ? "bg-amber-600 text-white shadow-md shadow-amber-900/10"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50 hover:text-foreground dark:hover:text-white"
                        )}
                      >
                        <Icon className={cn(
                          "h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110",
                          isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200"
                        )} />
                        {!isCollapsed && <span>{item.name}</span>}
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
      <div className="p-4 border-t border-border dark:border-slate-900 bg-slate-50 dark:bg-slate-950/80">
        <div className={cn(
          "flex items-center gap-3 transition-all duration-300",
          isCollapsed ? "flex-col justify-center" : "justify-between"
        )}>
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={user?.photoUrl}
              alt={user?.name}
              className="h-9 w-9 rounded-full border border-border dark:border-slate-800 shrink-0"
            />
            {!isCollapsed && (
              <div className="min-w-0">
                <span className="block text-xs font-bold text-foreground dark:text-slate-200 truncate">{user?.name}</span>
                <span className="block text-4xs text-slate-400 dark:text-slate-500 font-bold uppercase truncate tracking-wider">{user?.role}</span>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            title="Log Out"
            className={cn(
              "p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-rose-500 transition-colors shrink-0",
              isCollapsed && "mt-1"
            )}
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
