import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { CommandPalette } from './CommandPalette';

export const SuperAdminLayout = () => {
  const [paletteOpen, setPaletteOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 flex">
      {/* Navigation Drawer */}
      <Sidebar />

      {/* Main Core Container */}
      <div className="flex-1 flex flex-col pl-16 md:pl-64 transition-all duration-300">
        {/* Navigation Header */}
        <Topbar onOpenCommandPalette={() => setPaletteOpen(true)} />

        {/* Dynamic Nested Routes */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Launcher Menu */}
      <CommandPalette open={paletteOpen} setOpen={setPaletteOpen} />
    </div>
  );
};
