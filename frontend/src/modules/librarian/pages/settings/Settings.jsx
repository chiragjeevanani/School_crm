import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { Tabs } from '../../components/ui/Tabs';
import { useLibrarianAuth } from '../../context/LibrarianAuthContext';
import { useToast } from '../../components/ui/Toast';
import { Save, User, Sliders, Receipt, RefreshCw, CheckCircle2, ShieldCheck, Building } from 'lucide-react';
import { librarianApi } from '../../../../shared/api/client';

export const Settings = () => {
  const { user } = useLibrarianAuth();
  const location = useLocation();
  const toast = useToast();

  const getInitialTab = () => {
    if (location.pathname.includes('/rules')) return 'rules';
    if (location.pathname.includes('/fines')) return 'fines';
    return 'library';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [settings, setSettings] = useState({
    defaultIssueDays: 14,
    allowRenewal: true,
    maxRenewals: 2,
    renewalPeriodDays: 14,
    maxBooksStudent: 3,
    maxBooksTeacher: 5,
    finePerDay: 5,
    maxFineAmount: 500,
    gracePeriodDays: 0,
    lostBookFineMultiplier: 1.5,
  });

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await librarianApi.settings();
      if (res?.success && res.data) {
        setSettings(res.data);
      }
    } catch {
      toast.error('Failed to load library settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    setActiveTab(getInitialTab());
  }, [location.pathname]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await librarianApi.updateSettings({
        defaultIssueDays: Number(settings.defaultIssueDays) || 14,
        allowRenewal: Boolean(settings.allowRenewal),
        maxRenewals: Number(settings.maxRenewals) || 2,
        renewalPeriodDays: Number(settings.renewalPeriodDays) || 14,
        maxBooksStudent: Number(settings.maxBooksStudent) || 3,
        maxBooksTeacher: Number(settings.maxBooksTeacher) || 5,
        finePerDay: Number(settings.finePerDay) || 5,
        maxFineAmount: Number(settings.maxFineAmount) || 500,
        gracePeriodDays: Number(settings.gracePeriodDays) || 0,
        lostBookFineMultiplier: Number(settings.lostBookFineMultiplier) || 1.5,
      });
      toast.success('Library settings & policies successfully saved to database!');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const settingsTabs = [
    { id: 'library', label: 'Library Settings & Profile' },
    { id: 'rules', label: 'Issue / Return Rules' },
    { id: 'fines', label: 'Fine Settings' },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Library Settings & Policy Controls"
        subtitle="Configure school-wide library borrowing rules, circulation loan limits, and penalty rates."
        actions={
          <button
            onClick={fetchSettings}
            disabled={loading}
            className="p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        }
      />

      {/* Tabs */}
      <Tabs tabs={settingsTabs} activeTab={activeTab} onChange={setActiveTab} />

      {loading ? (
        <div className="py-20 text-center text-xs font-semibold text-slate-400 flex flex-col items-center gap-2">
          <RefreshCw className="h-6 w-6 animate-spin text-indigo-600" />
          <span>Loading configuration from database...</span>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          {/* Tab 1: Library Profile */}
          {activeTab === 'library' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                <img
                  src={user?.photoUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'}
                  alt={user?.name || 'Librarian'}
                  className="h-16 w-16 rounded-full border-2 border-indigo-500 shrink-0 object-cover"
                />
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{user?.name || 'Sanjay Kumar'}</h3>
                  <p className="text-xs text-slate-500">{user?.role || 'Head Librarian'} • {user?.email || 'librarian@greenfield.edu'}</p>
                  <span className="inline-block mt-1 px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-3xs font-bold rounded-full">
                    Active Librarian Session
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-3xs font-bold text-slate-500 uppercase">School Institution</label>
                  <input
                    type="text"
                    disabled
                    value={user?.schoolName || 'Greenfield Public School'}
                    className="w-full h-10 px-3.5 bg-slate-100 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 cursor-not-allowed"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-3xs font-bold text-slate-500 uppercase">Academic Session</label>
                  <input
                    type="text"
                    disabled
                    value={user?.academicSession || '2024-2025'}
                    className="w-full h-10 px-3.5 bg-slate-100 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="p-4 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/30 rounded-2xl flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
                <div className="text-xs text-indigo-800 dark:text-indigo-300">
                  <span className="font-bold block">Strict School Data Isolation</span>
                  All catalog records, borrower requests, and transaction logs are isolated strictly to your school workspace.
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Issue / Return Rules */}
          {activeTab === 'rules' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Circulation Loan & Renewal Rules
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure lending limits and durations for student and teacher borrowers.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-3xs font-bold text-slate-500 uppercase">
                    Default Loan Duration (Days) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={settings.defaultIssueDays}
                    onChange={(e) => setSettings({ ...settings, defaultIssueDays: e.target.value })}
                    className="w-full h-11 px-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-3xs font-bold text-slate-500 uppercase">
                    Max Books Allowed (Students) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={settings.maxBooksStudent}
                    onChange={(e) => setSettings({ ...settings, maxBooksStudent: e.target.value })}
                    className="w-full h-11 px-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-3xs font-bold text-slate-500 uppercase">
                    Max Books Allowed (Teachers/Faculty) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={settings.maxBooksTeacher}
                    onChange={(e) => setSettings({ ...settings, maxBooksTeacher: e.target.value })}
                    className="w-full h-11 px-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-3xs font-bold text-slate-500 uppercase">
                    Max Renewals Allowed Per Loan *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={settings.maxRenewals}
                    onChange={(e) => setSettings({ ...settings, maxRenewals: e.target.value })}
                    className="w-full h-11 px-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-3xs font-bold text-slate-500 uppercase">
                  Days Added Per Renewal (Days)
                </label>
                <input
                  type="number"
                  min="1"
                  value={settings.renewalPeriodDays}
                  onChange={(e) => setSettings({ ...settings, renewalPeriodDays: e.target.value })}
                  className="w-full h-11 px-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Tab 3: Fine Settings */}
          {activeTab === 'fines' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Fine Rates & Penalty Rules
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Set daily late fee tariffs, grace periods, and caps for the school library.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-3xs font-bold text-slate-500 uppercase">
                    Overdue Tariff (₹ / Day) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={settings.finePerDay}
                    onChange={(e) => setSettings({ ...settings, finePerDay: e.target.value })}
                    className="w-full h-11 px-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-3xs font-bold text-slate-500 uppercase">
                    Maximum Penalty Cap (₹) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={settings.maxFineAmount}
                    onChange={(e) => setSettings({ ...settings, maxFineAmount: e.target.value })}
                    className="w-full h-11 px-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-3xs font-bold text-slate-500 uppercase">
                    Grace Period (Days Before Fine Starts)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={settings.gracePeriodDays}
                    onChange={(e) => setSettings({ ...settings, gracePeriodDays: e.target.value })}
                    className="w-full h-11 px-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-3xs font-bold text-slate-500 uppercase">
                    Lost Copy Penalty Multiplier
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    value={settings.lostBookFineMultiplier}
                    onChange={(e) => setSettings({ ...settings, lostBookFineMultiplier: e.target.value })}
                    className="w-full h-11 px-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="h-11 px-6 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-2xl flex items-center gap-2 transition-all shadow-md shadow-indigo-900/10 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'Saving Changes...' : 'Save Configuration to Database'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
export default Settings;
