import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatCard } from '../../components/ui/StatCard';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Tabs } from '../../components/ui/Tabs';
import { useToast } from '../../components/ui/Toast';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Receipt, Coins, Sliders, RefreshCw, CheckCircle2, ShieldAlert, Save } from 'lucide-react';
import { librarianApi } from '../../../../shared/api/client';

export const FineManagement = () => {
  const toast = useToast();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState(() => {
    if (location.pathname.includes('/pending')) return 'pending';
    if (location.pathname.includes('/collected')) return 'collected';
    if (location.pathname.includes('/rules')) return 'rules';
    return 'pending';
  });

  const [pendingFines, setPendingFines] = useState([]);
  const [collectedFines, setCollectedFines] = useState([]);
  const [settings, setSettings] = useState({
    finePerDay: 5,
    maxFineAmount: 500,
    gracePeriodDays: 0,
    lostBookFineMultiplier: 1.5,
  });
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pendingRes, paidRes, settingsRes] = await Promise.allSettled([
        librarianApi.issues({ fineStatus: 'PENDING' }),
        librarianApi.issues({ fineStatus: 'PAID' }),
        librarianApi.settings(),
      ]);

      if (pendingRes.status === 'fulfilled' && Array.isArray(pendingRes.value?.data)) {
        setPendingFines(pendingRes.value.data);
      }

      if (paidRes.status === 'fulfilled' && Array.isArray(paidRes.value?.data)) {
        setCollectedFines(paidRes.value.data);
      }

      if (settingsRes.status === 'fulfilled' && settingsRes.value?.data) {
        setSettings(settingsRes.value.data);
      }
    } catch {
      toast.error('Failed to load fines data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (location.pathname.includes('/pending')) setActiveTab('pending');
    else if (location.pathname.includes('/collected')) setActiveTab('collected');
    else if (location.pathname.includes('/rules')) setActiveTab('rules');
  }, [location.pathname]);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await librarianApi.updateSettings({
        finePerDay: Number(settings.finePerDay) || 0,
        maxFineAmount: Number(settings.maxFineAmount) || 0,
        gracePeriodDays: Number(settings.gracePeriodDays) || 0,
        lostBookFineMultiplier: Number(settings.lostBookFineMultiplier) || 1.5,
      });
      toast.success('Library fine rules and policies saved to database successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to update rules');
    } finally {
      setSavingSettings(false);
    }
  };

  const totalCollectedAmount = collectedFines.reduce((acc, curr) => acc + (curr.fineAmount || 0), 0);
  const totalPendingAmount = pendingFines.reduce((acc, curr) => acc + (curr.fineAmount || 0), 0);

  const tabs = [
    { id: 'pending', label: 'Pending Fines', count: pendingFines.length },
    { id: 'collected', label: 'Collected Fines', count: collectedFines.length },
    { id: 'rules', label: 'Fine Rules & Rates' },
  ];

  const columns = [
    {
      title: 'Borrower',
      key: 'borrowerName',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="font-bold text-slate-800 dark:text-slate-200 text-xs block">{val}</span>
          <span className="text-3xs text-slate-400">{row.borrowerType} • {row.borrowerCode || 'STU'}</span>
        </div>
      ),
    },
    {
      title: 'Book Title',
      key: 'bookTitle',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="font-bold text-slate-800 dark:text-slate-200 text-xs block">{val}</span>
          <span className="text-3xs text-slate-400">Copy: {row.accessionNumber || 'N/A'}</span>
        </div>
      ),
    },
    { title: 'Due Date', key: 'dueDate', render: (val) => formatDate(val) },
    { title: 'Return Date', key: 'returnDate', render: (val) => (val ? formatDate(val) : '—') },
    {
      title: 'Fine Amount',
      key: 'fineAmount',
      sortable: true,
      render: (val) => <span className="font-bold text-xs text-rose-600 dark:text-rose-400">{formatCurrency(val || 0)}</span>,
    },
    {
      title: 'Status',
      key: 'fineStatus',
      sortable: true,
      render: (val) => (
        <Badge variant={val === 'PAID' ? 'success' : val === 'PENDING' ? 'danger' : 'warning'}>
          {val}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fines & Penalties Management"
        subtitle="Manage overdue fine collections, outstanding student dues, and customize penalty calculation rates."
        actions={
          <button
            onClick={fetchData}
            disabled={loading}
            className="p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Fine Collected"
          value={formatCurrency(totalCollectedAmount)}
          icon={Coins}
        />
        <StatCard
          title="Outstanding Pending Fines"
          value={formatCurrency(totalPendingAmount)}
          icon={Receipt}
        />
        <StatCard
          title="Daily Overdue Rate"
          value={`₹${settings?.finePerDay ?? 5} / day`}
          icon={Sliders}
        />
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {loading ? (
        <div className="py-20 text-center text-xs font-semibold text-slate-400 flex flex-col items-center gap-2">
          <RefreshCw className="h-6 w-6 animate-spin text-indigo-600" />
          <span>Loading fines audit records...</span>
        </div>
      ) : activeTab === 'pending' ? (
        pendingFines.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-3">
            <CheckCircle2 className="h-8 w-8 mx-auto text-emerald-500" />
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">No Pending Fines</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              There are no unpaid overdue fines on record across the school library.
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6">
            <DataTable
              columns={columns}
              data={pendingFines}
              searchPlaceholder="Search pending fines by student or book..."
              searchKeys={['borrowerName', 'bookTitle', 'borrowerCode']}
              csvFilename="pending_fines.csv"
            />
          </div>
        )
      ) : activeTab === 'collected' ? (
        collectedFines.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-3">
            <Receipt className="h-8 w-8 mx-auto text-slate-400" />
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">No Fine Collections Yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Fine collections recorded upon overdue book returns will appear here.
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6">
            <DataTable
              columns={columns}
              data={collectedFines}
              searchPlaceholder="Search collected fines..."
              searchKeys={['borrowerName', 'bookTitle']}
              csvFilename="collected_fines.csv"
            />
          </div>
        )
      ) : (
        /* Fine Rules Tab */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 max-w-2xl">
          <form onSubmit={handleSaveSettings} className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Fine Calculation Policy & Rates
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                These settings directly govern the automatic fine calculation when overdue books are returned.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-3xs font-extrabold uppercase tracking-wider text-slate-500">
                  Daily Overdue Fine Rate (₹ / Day) *
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
                <label className="text-3xs font-extrabold uppercase tracking-wider text-slate-500">
                  Maximum Fine Cap (₹) *
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
                <label className="text-3xs font-extrabold uppercase tracking-wider text-slate-500">
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
                <label className="text-3xs font-extrabold uppercase tracking-wider text-slate-500">
                  Lost Book Cost Multiplier
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

            <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="submit"
                disabled={savingSettings}
                className="h-11 px-6 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-2xl flex items-center gap-2 transition-all shadow-md shadow-indigo-900/10 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                <span>{savingSettings ? 'Saving Policy...' : 'Save Fine Policy Rules'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
export default FineManagement;
