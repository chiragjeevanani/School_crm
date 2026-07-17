import React, { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Tabs } from '../../components/ui/Tabs';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../components/ui/Toast';
import { useSchoolAdminTheme } from '../../context/SchoolAdminThemeContext';
import { 
  Save, 
  Database, 
  ShieldAlert, 
  Mail, 
  MessageSquare,
  Lock,
  Sun,
  Moon
} from 'lucide-react';

export const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const { showToast, ToastComponent } = useToast();
  const { darkMode, toggleTheme } = useSchoolAdminTheme();

  // Settings state
  const [passwordPolicy, setPasswordPolicy] = useState({
    minLength: 8,
    requireNumbers: true,
    requireSymbols: true,
    requireUppercase: true
  });

  const [notificationSettings, setNotificationSettings] = useState({
    notifyNewLeave: true,
    notifyNewAdmissions: true,
    notifyFeeCollections: true,
    notifySystemAlerts: false
  });

  const [emailTemplate, setEmailTemplate] = useState(
    "Dear {ParentName},\n\nWe have received a tuition fee payment of {Amount} on {Date}. Your receipt number is {ReceiptNo}.\n\nWarm regards,\nGreenfield School Administration"
  );

  const handleSaveSettings = (e) => {
    e.preventDefault();
    showToast('System settings updated successfully!', 'success');
  };

  const handleTriggerBackup = () => {
    // Generate mock settings JSON backup
    const backupData = {
      schoolName: 'Greenfield Public School',
      academicSession: '2026-2027',
      timestamp: new Date().toISOString(),
      backupType: 'Full System Configuration'
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_greenfield_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    showToast('Database JSON configuration backup generated!', 'success');
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Portal & System Settings" 
        subtitle="Manage email broadcast templates, security policies, data backups, and theme choices."
      />

      <Tabs 
        tabs={[
          { id: 'general', label: 'General & Themes' },
          { id: 'templates', label: 'Email & SMS Templates' },
          { id: 'security', label: 'Security & Passwords' },
          { id: 'backup', label: 'System Backup' }
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === 'general' && (
        <form onSubmit={handleSaveSettings} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-indigo-650">Theme Controls</h4>
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 rounded-2xl">
                <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  {darkMode ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
                  <span>Dark Mode Theme</span>
                </span>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-all ${
                    darkMode ? 'bg-indigo-600 justify-end' : 'bg-slate-300 justify-start'
                  }`}
                >
                  <div className="bg-white w-4 h-4 rounded-full shadow-md"></div>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-indigo-650">App Notifications Dispatch</h4>
              <div className="space-y-3">
                {[
                  { key: 'notifyNewLeave', label: 'Leave Request Submissions Alerts' },
                  { key: 'notifyNewAdmissions', label: 'Online Admissions Registrations Alert' },
                  { key: 'notifyFeeCollections', label: 'Tuition Fee Transactions Receipt Alerts' }
                ].map((notif) => (
                  <label key={notif.key} className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 rounded-2xl cursor-pointer">
                    <span className="text-xs font-bold text-slate-850 dark:text-slate-200">{notif.label}</span>
                    <input
                      type="checkbox"
                      checked={notificationSettings[notif.key]}
                      onChange={() => setNotificationSettings({
                        ...notificationSettings,
                        [notif.key]: !notificationSettings[notif.key]
                      })}
                      className="rounded border-slate-300 text-indigo-650 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button type="submit" className="flex items-center gap-1.5 px-4 py-2 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold">
              <Save className="w-3.5 h-3.5" />
              <span>Save System Settings</span>
            </button>
          </div>
        </form>
      )}

      {activeTab === 'templates' && (
        <form onSubmit={handleSaveSettings} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-indigo-650 flex items-center gap-1.5">
              <Mail className="w-4 h-4" />
              <span>Fee Receipt Email Notification Template</span>
            </h4>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400">Rich Text Broadcast Copy</label>
              <textarea
                rows={6}
                value={emailTemplate}
                onChange={(e) => setEmailTemplate(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 p-4 text-xs font-semibold rounded-xl border focus:outline-none font-mono"
              />
              <span className="text-[10px] text-slate-400 block mt-1">Available Merge Tags: {"{ParentName}"}, {"{Amount}"}, {"{Date}"}, {"{ReceiptNo}"}</span>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button type="submit" className="flex items-center gap-1.5 px-4 py-2 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold">
              <Save className="w-3.5 h-3.5" />
              <span>Save Templates</span>
            </button>
          </div>
        </form>
      )}

      {activeTab === 'security' && (
        <form onSubmit={handleSaveSettings} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-indigo-650 flex items-center gap-1.5">
              <Lock className="w-4 h-4" />
              <span>Student / Teacher Portal Password strength policy</span>
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400">Min Password Character Length</label>
                <input
                  type="number"
                  value={passwordPolicy.minLength}
                  onChange={(e) => setPasswordPolicy({ ...passwordPolicy, minLength: Number(e.target.value) })}
                  className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border focus:outline-none"
                />
              </div>
              <div className="space-y-3 mt-4">
                {[
                  { key: 'requireNumbers', label: 'Require Numbers (0-9)' },
                  { key: 'requireSymbols', label: 'Require Symbols (@, #, $)' },
                  { key: 'requireUppercase', label: 'Require Uppercase Letters' }
                ].map((pol) => (
                  <label key={pol.key} className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold">
                    <input
                      type="checkbox"
                      checked={passwordPolicy[pol.key]}
                      onChange={() => setPasswordPolicy({ ...passwordPolicy, [pol.key]: !passwordPolicy[pol.key] })}
                      className="rounded border-slate-300 text-indigo-650 w-3.5 h-3.5"
                    />
                    <span>{pol.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button type="submit" className="flex items-center gap-1.5 px-4 py-2 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold">
              <Save className="w-3.5 h-3.5" />
              <span>Apply Security Rules</span>
            </button>
          </div>
        </form>
      )}

      {activeTab === 'backup' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-4 pb-4 border-b">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950 text-indigo-650 rounded-xl">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-905 dark:text-white">Database Backup & Recover Tools</h4>
              <p className="text-xs text-slate-450 mt-1">Export full single-school configuration details to JSON local backup maps.</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 rounded-2xl text-xs font-semibold text-slate-500">
            <span>Last full system configuration backup: Today, 09:30 AM</span>
            <button
              onClick={handleTriggerBackup}
              className="px-4 py-2.5 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-sm"
            >
              Export JSON Backup
            </button>
          </div>
        </div>
      )}

      <ToastComponent />
    </div>
  );
};
export default Settings;
