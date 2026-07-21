import React, { useState } from 'react';
import { Card, Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { useSuperAdminAuth } from '../../context/SuperAdminAuthContext';
import { useSuperAdminNotifications } from '../../context/SuperAdminNotificationContext';
import { User, ShieldCheck } from 'lucide-react';

export default function SettingsIndex() {
  const { admin } = useSuperAdminAuth();
  const { addNotification } = useSuperAdminNotifications();
  const [name, setName] = useState(admin?.name || 'Chirag Jeevanani');
  const [email, setEmail] = useState(admin?.email || 'superadmin@appzeto.com');

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    addNotification('success', 'Administrator security credentials updated');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Profile Settings</h1>
        <p className="text-xs text-slate-400">Manage your root login keys, contact names, and multi-factor authenticators.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Security Profile</h3>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <Input
                label="Full Admin Signature Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                label="Registered Login Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" className="w-full">Save Profile Information</Button>
            </form>
          </Card>
        </div>

        {/* Security Summary details */}
        <div className="space-y-4">
          <Card className="space-y-4 bg-slate-900/40 border-slate-900 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-indigo-400" />
                <h3 className="text-sm font-bold text-slate-200">Role Credentials</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                You are currently logged in as a <strong>Root Super Administrator</strong>. This grants permission matrix capabilities across backups, tenants collection pruning, and external API integrations configurations.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
