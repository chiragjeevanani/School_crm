import React, { useState, useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { Breadcrumb } from './Breadcrumb';
import { CommandPalette } from './CommandPalette';
import { useLibrarianAuth } from '../../context/LibrarianAuthContext';
import { cn } from '../../utils/cn';

export const LibrarianLayout = () => {
  const { user, loading } = useLibrarianAuth();
  const location = useLocation();
  
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Auto-close sidebar on navigate (tablet/mobile view)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Handle Ctrl+K / Cmd+K keydown listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center font-bold text-slate-400">
        Loading Library System...
      </div>
    );
  }

  // If not authenticated, redirect to Login
  if (!user && location.pathname !== '/librarian/login') {
    return <Navigate to="/librarian/login" replace />;
  }

  // If authenticated and visiting root/login directly, redirect to Dashboard
  if (user && (location.pathname === '/librarian' || location.pathname === '/librarian/login')) {
    return <Navigate to="/librarian/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-200">
      {/* Sidebar Panel */}
      <Sidebar 
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isOpen={sidebarOpen} 
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
      />

      {/* Main Content Layout area */}
      <div className={cn(
        "min-h-screen flex flex-col transition-all duration-300", 
        isCollapsed ? "md:pl-20" : "md:pl-68 lg:pl-72"
      )}>
        {/* Top Header */}
        <TopBar 
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
          onSearchTrigger={() => setCommandPaletteOpen(true)}
        />

        {/* Content Body */}
        <main className="p-6 md:p-8 flex-1 max-w-[1400px] w-full mx-auto">
          {/* Breadcrumb Navigator */}
          <Breadcrumb />
          
          {/* Route Content */}
          <Outlet />
        </main>
      </div>

      {/* Command Shortcut Modal */}
      <CommandPalette 
        isOpen={commandPaletteOpen} 
        onClose={() => setCommandPaletteOpen(false)} 
      />
    </div>
  );
};
