import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { NAVIGATION_ITEMS } from '../../utils/constants';
import { useHRAuth } from '../../context/HRAuthContext';
import { cn } from '../../utils/cn';
import { LogOut, ChevronLeft, ChevronRight, ChevronDown, Users } from 'lucide-react';

export const Sidebar = ({ isCollapsed, setIsCollapsed, isOpen, toggleSidebar }) => {
  const { logout, user } = useHRAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Track expanded accordion groups
  const [openGroups, setOpenGroups] = useState({});

  // Auto-expand group if current path matches any child
  useEffect(() => {
    NAVIGATION_ITEMS.forEach((item) => {
      if (item.children) {
        const hasActiveChild = item.children.some(
          (child) =>
            location.pathname === child.path || location.pathname.startsWith(`${child.path}/`)
        );
        if (hasActiveChild) {
          setOpenGroups((prev) => ({ ...prev, [item.title]: true }));
        }
      }
    });
  }, [location.pathname]);

  const toggleGroup = (title) => {
    setOpenGroups((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const handleLogout = () => {
    logout();
    navigate('/hr/login');
  };

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-40 flex flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 transition-[width,transform] duration-200 select-none shadow-xs',
        isCollapsed ? 'md:w-[68px] w-64' : 'w-64',
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      )}
    >
      {/* Brand Header */}
      <div
        className={cn(
          'flex shrink-0 items-center border-b border-slate-200 px-3 py-4 dark:border-slate-800',
          isCollapsed ? 'justify-center' : 'justify-between gap-2'
        )}
      >
        <div className={cn('flex min-w-0 items-center', isCollapsed ? 'justify-center' : 'gap-2.5')}>
          <div className="h-8 w-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm shadow-indigo-600/25">
            <Users className="h-4 w-4" />
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900 dark:text-white leading-tight">
                {user?.schoolName || 'Greenfield School'}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">HRMS Portal</p>
            </div>
          )}
        </div>
        {!isCollapsed && (
          <button
            type="button"
            onClick={() => setIsCollapsed(true)}
            className="hidden md:flex rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-900 dark:hover:text-slate-200"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
        <button
          type="button"
          onClick={toggleSidebar}
          className="md:hidden rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-900 dark:hover:text-slate-200"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>

      {isCollapsed && (
        <div className="hidden md:flex shrink-0 justify-center border-b border-slate-200 py-2 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setIsCollapsed(false)}
            className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-900 dark:hover:text-slate-200"
            aria-label="Expand sidebar"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800" style={{ minHeight: 0 }}>
        {NAVIGATION_ITEMS.map((item) => {
          const Icon = item.icon;

          // Single Direct Item (e.g. Dashboard)
          if (!item.children) {
            const isActive =
              location.pathname === item.path ||
              (item.path !== '/hr/dashboard' && location.pathname.startsWith(item.path));

            return (
              <NavLink
                key={item.title}
                to={item.path}
                title={isCollapsed ? item.title : undefined}
                className={cn(
                  'flex items-center rounded-xl text-sm font-medium transition-all duration-150 select-none group',
                  isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5',
                  isActive
                    ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 font-semibold shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-100'
                )}
              >
                <Icon
                  className={cn(
                    'h-[18px] w-[18px] shrink-0 transition-colors',
                    isActive
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                  )}
                />
                {!isCollapsed && <span className="truncate">{item.title}</span>}
              </NavLink>
            );
          }

          // Collapsible Group
          const isGroupOpen = openGroups[item.title];
          const hasActiveChild = item.children.some(
            (child) =>
              location.pathname === child.path || location.pathname.startsWith(`${child.path}/`)
          );

          return (
            <div key={item.title} className="space-y-1">
              <button
                type="button"
                onClick={() => toggleGroup(item.title)}
                title={isCollapsed ? item.title : undefined}
                className={cn(
                  'w-full flex items-center rounded-xl text-sm font-medium transition-all duration-150 select-none group cursor-pointer',
                  isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2.5',
                  hasActiveChild
                    ? 'bg-indigo-50/60 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 font-semibold'
                    : isGroupOpen
                    ? 'bg-slate-50 dark:bg-slate-900/60 text-slate-900 dark:text-slate-100'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-100'
                )}
              >
                <div className={cn('flex items-center min-w-0', isCollapsed ? 'justify-center' : 'gap-3')}>
                  <Icon
                    className={cn(
                      'h-[18px] w-[18px] shrink-0 transition-colors',
                      hasActiveChild
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                    )}
                  />
                  {!isCollapsed && <span className="truncate">{item.title}</span>}
                </div>
                {!isCollapsed && (
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 transition-transform duration-200 text-slate-400 shrink-0',
                      isGroupOpen ? 'rotate-180 text-slate-600 dark:text-slate-200' : ''
                    )}
                  />
                )}
              </button>

              {/* Submenu Item Cards */}
              {!isCollapsed && isGroupOpen && (
                <div className="space-y-0.5 pl-3 pr-1 py-1 rounded-xl bg-slate-50/60 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-850/50 ml-2">
                  {item.children.map((child) => {
                    const ChildIcon = child.icon;
                    const isChildActive =
                      location.pathname === child.path ||
                      location.pathname.startsWith(`${child.path}/`);

                    return (
                      <NavLink
                        key={child.title}
                        to={child.path}
                        className={cn(
                          'flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 select-none group',
                          isChildActive
                            ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 font-bold shadow-2xs'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-850 hover:text-slate-900 dark:hover:text-slate-100'
                        )}
                      >
                        {ChildIcon ? (
                          <ChildIcon
                            className={cn(
                              'h-3.5 w-3.5 shrink-0 transition-colors',
                              isChildActive
                                ? 'text-indigo-600 dark:text-indigo-400'
                                : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                            )}
                          />
                        ) : (
                          <span
                            className={cn(
                              'h-1.5 w-1.5 rounded-full shrink-0 transition-colors',
                              isChildActive
                                ? 'bg-indigo-600 dark:bg-indigo-400'
                                : 'bg-slate-300 dark:bg-slate-600'
                            )}
                          />
                        )}
                        <span className="truncate">{child.title}</span>
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* User Profile / Logout Footer */}
      {user && (
        <div className="shrink-0 border-t border-slate-200 bg-white px-2.5 py-3 dark:border-slate-800 dark:bg-slate-950">
          <div
            className={cn(
              'flex items-center rounded-xl border border-slate-200 bg-slate-50/80 p-2 dark:border-slate-800 dark:bg-slate-900/50',
              isCollapsed ? 'justify-center' : 'gap-2.5'
            )}
          >
            <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0">
              {user.name ? user.name.charAt(0).toUpperCase() : 'H'}
            </div>
            {!isCollapsed && (
              <>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-slate-900 dark:text-slate-200">
                    {user.name || 'HR Manager'}
                  </p>
                  <p className="truncate text-[10px] text-slate-500 dark:text-slate-400">{user.role || 'HR & Operations Lead'}</p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-500/10 dark:hover:text-rose-400 cursor-pointer"
                  aria-label="Logout"
                  title="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            )}
          </div>

          {isCollapsed && (
            <button
              type="button"
              onClick={handleLogout}
              className="mt-2 flex w-full items-center justify-center rounded-xl p-2 text-rose-500 transition-colors hover:bg-rose-50 dark:hover:bg-rose-500/10 cursor-pointer"
              aria-label="Logout"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
    </aside>
  );
};
export default Sidebar;
