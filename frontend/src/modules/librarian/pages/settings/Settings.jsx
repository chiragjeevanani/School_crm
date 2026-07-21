import React, { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Tabs } from '../../components/ui/Tabs';
import { useLibrarianAuth } from '../../context/LibrarianAuthContext';
import { useLibrarianTheme } from '../../context/LibrarianThemeContext';
import { useToast } from '../../components/ui/Toast';
import { Save, User, FileText, DollarSign, Printer, Moon, Sun } from 'lucide-react';
import { cn } from '../../utils/cn';

export const Settings = () => {
  const { user } = useLibrarianAuth();
  const { darkMode, toggleDarkMode } = useLibrarianTheme();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('profile');

  // Library rules state
  const [studentLimit, setStudentLimit] = useState(3);
  const [teacherLimit, setTeacherLimit] = useState(7);
  const [loanPeriod, setLoanPeriod] = useState(14);
  const [finePerDay, setFinePerDay] = useState(2);
  const [gracePeriod, setGracePeriod] = useState(0);

  const handleSaveSettings = () => {
    toast.success('Library circulation settings saved successfully.');
  };

  const settingsTabs = [
    { id: 'profile', label: 'Librarian Profile' },
    { id: 'rules', label: 'Circulation & Fines' },
    { id: 'preferences', label: 'System Preferences' }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Portal Settings"
        subtitle="Manage personal profiles, print templates, and library rule constraints."
        actions={
          <button
            onClick={handleSaveSettings}
            className="h-10 px-4 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all duration-150 shadow-xs"
          >
            <Save className="h-4 w-4" />
            <span>Save All Config</span>
          </button>
        }
      />

      {/* Tabs */}
      <Tabs tabs={settingsTabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Settings body */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 max-w-3xl mx-auto">
        {activeTab === 'profile' && user && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-slate-100 dark:border-slate-850">
              <img
                src={user.photoUrl}
                alt={user.name}
                className="h-20 w-20 rounded-full border-2 border-amber-500 shadow-sm shrink-0"
              />
              <div className="text-center sm:text-left space-y-1">
                <h4 className="text-base font-bold text-slate-850 dark:text-slate-200">{user.name}</h4>
                <p className="text-xs text-slate-450">{user.role} | Greenfield Public School</p>
                <span className="inline-flex px-2 py-0.5 bg-amber-50 dark:bg-amber-955/20 text-amber-600 dark:text-amber-400 rounded-lg text-3xs font-bold border border-amber-100 dark:border-amber-900/30">
                  ID: {user.id}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="font-semibold text-slate-450 block">Username:</span>
                <input
                  type="text"
                  disabled
                  value={user.username}
                  className="w-full h-10 px-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-500 cursor-not-allowed"
                />
              </div>
              <div className="space-y-1">
                <span className="font-semibold text-slate-450 block">Email Address:</span>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full h-10 px-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-550 cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'rules' && (
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest border-b pb-2 flex items-center gap-1.5">
              <FileText className="h-4.5 w-4.5 text-amber-600 dark:text-amber-400" />
              <span>Circulation Limits</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-550 dark:text-slate-450">Student Max Hold</label>
                <input
                  type="number"
                  value={studentLimit}
                  onChange={(e) => setStudentLimit(Number(e.target.value))}
                  className="w-full h-10 px-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-550 dark:text-slate-450">Teacher Max Hold</label>
                <input
                  type="number"
                  value={teacherLimit}
                  onChange={(e) => setTeacherLimit(Number(e.target.value))}
                  className="w-full h-10 px-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-550 dark:text-slate-450">Circulation Limit (Days)</label>
                <input
                  type="number"
                  value={loanPeriod}
                  onChange={(e) => setLoanPeriod(Number(e.target.value))}
                  className="w-full h-10 px-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest border-b pb-2 flex items-center gap-1.5 pt-4">
              <DollarSign className="h-4.5 w-4.5 text-amber-600 dark:text-amber-400" />
              <span>Overdue Fines Rules</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-550 dark:text-slate-450">Fine Per Overdue Day (INR)</label>
                <input
                  type="number"
                  value={finePerDay}
                  onChange={(e) => setFinePerDay(Number(e.target.value))}
                  className="w-full h-10 px-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-550 dark:text-slate-450">Grace Period Days</label>
                <input
                  type="number"
                  value={gracePeriod}
                  onChange={(e) => setGracePeriod(Number(e.target.value))}
                  className="w-full h-10 px-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'preferences' && (
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest border-b pb-2 flex items-center gap-1.5">
              <Printer className="h-4.5 w-4.5 text-amber-600 dark:text-amber-400" />
              <span>Label Printing Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-550 dark:text-slate-450">Barcode Width (inches)</label>
                <select className="w-full h-10 px-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950">
                  <option value="2.0">2.0" label (Standard shelf)</option>
                  <option value="1.5">1.5" label (Slim spine)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-550 dark:text-slate-450">Receipt Print Format</label>
                <select className="w-full h-10 px-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950">
                  <option value="Thermal">80mm Thermal Paper</option>
                  <option value="Letter">A4 Letter Paper</option>
                </select>
              </div>
            </div>

            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest border-b pb-2 flex items-center gap-1.5 pt-4">
              <Sun className="h-4.5 w-4.5 text-amber-600 dark:text-amber-400" />
              <span>Theme Appearance</span>
            </h3>

            <div className="flex justify-between items-center text-xs pt-2">
              <div>
                <span className="font-bold text-slate-850 dark:text-slate-200 block">Dark Mode</span>
                <span className="text-slate-450 text-3xs">Use dark color schemes for low light conditions.</span>
              </div>
              <button
                onClick={toggleDarkMode}
                className={cn(
                  "h-10 px-4 rounded-xl text-xs font-bold transition-all duration-150 flex items-center gap-2",
                  darkMode 
                    ? "bg-amber-600 text-white hover:bg-amber-700" 
                    : "border border-slate-200 hover:bg-slate-50 text-slate-800"
                )}
              >
                {darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                <span>{darkMode ? 'Disable Dark Mode' : 'Enable Dark Mode'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
