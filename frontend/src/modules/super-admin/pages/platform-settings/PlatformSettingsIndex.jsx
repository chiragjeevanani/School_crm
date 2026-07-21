import React, { useState } from 'react';
import { Card, Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Switch } from '../../components/ui/Switch';
import { useSuperAdminNotifications } from '../../context/SuperAdminNotificationContext';
import { Settings, Shield, Globe } from 'lucide-react';

export default function PlatformSettingsIndex() {
  const { addNotification } = useSuperAdminNotifications();
  const [platformName, setPlatformName] = useState('Antigravity ERP SaaS');
  const [maintMode, setMaintMode] = useState(false);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    addNotification('success', 'Global system variables updated');
  };

  const handleToggleMaintenance = () => {
    setMaintMode((prev) => {
      const nextMode = !prev;
      addNotification('warning', nextMode ? 'Platform set to MAINTENANCE MODE' : 'Platform set to ACTIVE OPERATION MODE');
      return nextMode;
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Platform Configuration Settings</h1>
        <p className="text-xs text-slate-400">Manage portal metadata parameters, terms policy text, and maintenance controls.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">General Metadata variables</h3>
            <form onSubmit={handleSaveSettings} className="space-y-4">
              <Input
                label="Branded Platform Name"
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
                required
              />
              <Input
                label="System Administrator Email"
                type="email"
                defaultValue="sysadmin@appzeto.com"
                required
              />
              <Button type="submit" className="w-full">Save Changes</Button>
            </form>
          </Card>
        </div>

        {/* Maintenance / Ops Block */}
        <div className="space-y-4">
          <Card className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Operations State</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-950/40 rounded-lg border border-slate-900">
                <div>
                  <span className="text-xs font-semibold text-slate-200 block">Maintenance mode</span>
                  <span className="text-[10px] text-slate-500">Redirects users to error page</span>
                </div>
                <button
                  onClick={handleToggleMaintenance}
                  className={`w-10 h-6 rounded-full transition-colors flex items-center p-1 ${
                    maintMode ? 'bg-rose-600 justify-end' : 'bg-slate-800 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 bg-white rounded-full shadow-lg" />
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
