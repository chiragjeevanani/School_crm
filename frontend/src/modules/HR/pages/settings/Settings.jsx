import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { useHRAuth } from '../../context/HRAuthContext';
import { useHRTheme } from '../../context/HRThemeContext';
import { useToast } from '../../components/ui/Toast';
import { hrApi } from '../../../../shared/api/client';
import {
  Save,
  Sliders,
  Sun,
  Moon,
  Clock,
  Calendar,
  ShieldCheck,
  RefreshCw,
  AlertCircle,
  Building
} from 'lucide-react';

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const Settings = () => {
  const { user } = useHRAuth();
  const { darkMode, toggleDarkMode } = useHRTheme();
  const { showToast, ToastComponent } = useToast();

  const [activeTab, setActiveTab] = useState('policy');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Settings State
  const [settings, setSettings] = useState({
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    shiftStartTime: '08:00 AM',
    shiftEndTime: '03:00 PM',
    casualLeaveQuota: 12,
    medicalLeaveQuota: 6,
    paidLeaveQuota: 10,
    lateFineAmount: 0,
    absentDeductionPerDay: 0,
    probationPeriodMonths: 6,
    autoApproveLeaves: false,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await hrApi.settings();
      if (res?.success && res.data) {
        setSettings((prev) => ({ ...prev, ...res.data }));
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleWorkingDayToggle = (day) => {
    setSettings((prev) => {
      const current = prev.workingDays || [];
      const updated = current.includes(day)
        ? current.filter((d) => d !== day)
        : [...current, day];
      return { ...prev, workingDays: updated };
    });
  };

  const handleSavePolicy = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await hrApi.updateSettings({
        workingDays: settings.workingDays,
        shiftStartTime: settings.shiftStartTime,
        shiftEndTime: settings.shiftEndTime,
        casualLeaveQuota: Number(settings.casualLeaveQuota),
        medicalLeaveQuota: Number(settings.medicalLeaveQuota),
        paidLeaveQuota: Number(settings.paidLeaveQuota),
        lateFineAmount: Number(settings.lateFineAmount),
        absentDeductionPerDay: Number(settings.absentDeductionPerDay),
        probationPeriodMonths: Number(settings.probationPeriodMonths),
        autoApproveLeaves: Boolean(settings.autoApproveLeaves),
      });

      if (res?.success) {
        showToast('Institutional HR policy and leave quotas updated!', 'success');
      }
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 text-xs font-semibold max-w-4xl mx-auto">
      <PageHeader
        title="HR Policy, Leave Quotas & System Settings"
        subtitle="Manage working days, shift operating hours, annual staff leave entitlement balances, and fine deduction rules."
        actions={
          <button
            onClick={fetchSettings}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors cursor-pointer"
            title="Refresh Settings"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        }
      />

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6">
        <button
          onClick={() => setActiveTab('policy')}
          className={`pb-3 text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'policy'
              ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          Staff Policy & Quotas
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'profile'
              ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          HR Account & Security
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 p-4 rounded-2xl text-rose-700 dark:text-rose-400 text-xs font-semibold flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchSettings} className="underline font-bold cursor-pointer">Retry</button>
        </div>
      )}

      {/* Tab 1: Staff Policy & Quotas */}
      {activeTab === 'policy' && (
        <form onSubmit={handleSavePolicy} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
          {loading ? (
            <div className="space-y-4">
              <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
              <div className="h-40 bg-slate-100 dark:bg-slate-800/60 rounded-2xl animate-pulse" />
            </div>
          ) : (
            <>
              {/* Working Days Selection */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                  Institutional Working Days
                </h3>
                <p className="text-xs text-slate-400">Select active days when faculty and staff are expected on campus.</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                  {WEEKDAYS.map((day) => {
                    const isChecked = (settings.workingDays || []).includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleWorkingDayToggle(day)}
                        className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                          isChecked
                            ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-bold'
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-400 font-medium'
                        }`}
                      >
                        <span>{day}</span>
                        <div
                          className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] ${
                            isChecked ? 'bg-indigo-600 text-white' : 'border border-slate-300 dark:border-slate-700'
                          }`}
                        >
                          {isChecked && '✓'}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Shift Hours */}
              <div className="space-y-3 pt-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                  Standard Shift Operating Hours
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-700 dark:text-slate-300 font-bold">Shift Start Time</label>
                    <input
                      type="text"
                      value={settings.shiftStartTime}
                      onChange={(e) => setSettings({ ...settings, shiftStartTime: e.target.value })}
                      placeholder="08:00 AM"
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-xs font-semibold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-700 dark:text-slate-300 font-bold">Shift End Time</label>
                    <input
                      type="text"
                      value={settings.shiftEndTime}
                      onChange={(e) => setSettings({ ...settings, shiftEndTime: e.target.value })}
                      placeholder="03:00 PM"
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-xs font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* Annual Leave Entitlement Quotas */}
              <div className="space-y-3 pt-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                  Annual Staff Leave Entitlement Quotas (Per Calendar Year)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-700 dark:text-slate-300 font-bold">Casual Leaves (CL)</label>
                    <input
                      type="number"
                      min="0"
                      value={settings.casualLeaveQuota}
                      onChange={(e) => setSettings({ ...settings, casualLeaveQuota: Number(e.target.value) })}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-xs font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-700 dark:text-slate-300 font-bold">Medical / Sick Leaves (SL)</label>
                    <input
                      type="number"
                      min="0"
                      value={settings.medicalLeaveQuota}
                      onChange={(e) => setSettings({ ...settings, medicalLeaveQuota: Number(e.target.value) })}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-xs font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-700 dark:text-slate-300 font-bold">Paid / Earned Leaves (PL)</label>
                    <input
                      type="number"
                      min="0"
                      value={settings.paidLeaveQuota}
                      onChange={(e) => setSettings({ ...settings, paidLeaveQuota: Number(e.target.value) })}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-xs font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Automatic Approvals & Probations */}
              <div className="space-y-3 pt-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                  HR Compliance & Automation
                </h3>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-850">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">Auto-Approve Time Off Requests</span>
                    <span className="text-[11px] text-slate-400">
                      When enabled, leave requests submitted by staff will be auto-approved without manual review.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.autoApproveLeaves}
                    onChange={(e) => setSettings({ ...settings, autoApproveLeaves: e.target.checked })}
                    className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-xs cursor-pointer disabled:opacity-60"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save HR Settings'}</span>
                </button>
              </div>
            </>
          )}
        </form>
      )}

      {/* Tab 2: HR Profile & Theme */}
      {activeTab === 'profile' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
            Active HR Administrator Profile
          </h3>

          <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-100 dark:border-slate-850">
            <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-xl">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'H'}
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{user?.name}</h4>
              <p className="text-xs text-slate-400">{user?.email} • {user?.employeeId || 'HR-201'}</p>
              <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold mt-0.5">{user?.schoolName}</p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 dark:text-white">Workspace Interface Theme</h4>
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-850">
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">Dark Mode Workspace</span>
                <span className="text-[11px] text-slate-400">Toggle dark / light mode palette for the HRMS portal</span>
              </div>
              <button
                type="button"
                onClick={toggleDarkMode}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer"
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastComponent />
    </div>
  );
};
export default Settings;
