import React, { useState, useEffect } from 'react';
import { Search, Sparkles, AlertCircle, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { useSuperAdminTheme } from '../../context/SuperAdminThemeContext';
import { cn } from '../ui/Button';

export const CommandPalette = ({ open, setOpen }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { toggleTheme } = useSuperAdminTheme();

  // Keyboard listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setOpen]);

  const items = [
    { name: 'Go to Dashboard', category: 'Navigation', action: () => navigate('/super-admin/dashboard') },
    { name: 'View Schools', category: 'Navigation', action: () => navigate('/super-admin/schools') },
    { name: 'Create New School', category: 'Actions', action: () => navigate('/super-admin/schools/create') },
    { name: 'Subscription Plans', category: 'Navigation', action: () => navigate('/super-admin/subscriptions') },
    { name: 'License Manager', category: 'Navigation', action: () => navigate('/super-admin/licenses') },
    { name: 'Database Tenants', category: 'Navigation', action: () => navigate('/super-admin/tenants') },
    { name: 'Storage Settings', category: 'Navigation', action: () => navigate('/super-admin/storage') },
    { name: 'Audit Logs', category: 'Logs', action: () => navigate('/super-admin/audit-logs') },
    { name: 'Platform Monitoring', category: 'Logs', action: () => navigate('/super-admin/monitoring') },
    { name: 'Support Tickets', category: 'Support', action: () => navigate('/super-admin/support') },
    { name: 'Compose Broadcast', category: 'Actions', action: () => navigate('/super-admin/broadcast') },
    { name: 'Toggle Theme (Dark/Light)', category: 'Settings', action: () => toggleTheme() },
    { name: 'Platform Settings', category: 'Settings', action: () => navigate('/super-admin/platform-settings') },
  ];

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
        <DialogPrimitive.Content className="fixed top-[20%] left-[50%] z-50 w-full max-w-lg translate-x-[-50%] overflow-hidden rounded-xl border border-slate-800 bg-slate-950 text-slate-100 shadow-2xl transition-all duration-200">
          <div className="flex items-center border-b border-slate-900 px-4 py-3">
            <Search className="h-5 w-5 text-slate-400 mr-2" />
            <input
              type="text"
              placeholder="Type a command or search..."
              className="w-full bg-transparent border-0 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-0 text-sm h-7"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="bg-slate-900 border border-slate-800 text-[10px] text-slate-400 font-bold px-2 py-0.5 rounded uppercase">
              ESC
            </div>
          </div>
          <div className="max-h-[300px] overflow-y-auto p-2 space-y-2">
            {filteredItems.length === 0 ? (
              <div className="py-6 text-center text-sm text-slate-500">No results found.</div>
            ) : (
              <div>
                {filteredItems.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      item.action();
                      setOpen(false);
                      setQuery('');
                    }}
                    className="w-full text-left flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-slate-900/60 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Sparkles className="h-4 w-4 text-indigo-400" />
                      <span className="text-sm font-medium text-slate-200">{item.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 border border-slate-900 px-2 py-0.5 rounded font-bold uppercase">
                      {item.category}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};
