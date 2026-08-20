import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { useToast } from '../../components/ui/Toast';
import { hrApi } from '../../../../shared/api/client';
import {
  CalendarDays,
  CheckCircle2,
  XCircle,
  Clock,
  Save,
  Check,
  RefreshCw,
  BarChart3,
  Calendar,
  AlertCircle
} from 'lucide-react';

export const AttendanceManagement = () => {
  const [activeTab, setActiveTab] = useState('daily');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState({ TOTAL: 0, PRESENT: 0, ABSENT: 0, LEAVE: 0, HALF_DAY: 0 });
  const [monthlyData, setMonthlyData] = useState(null);
  const [reportData, setReportData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const { showToast, ToastComponent } = useToast();

  useEffect(() => {
    if (activeTab === 'daily') {
      fetchDailyAttendance();
    } else if (activeTab === 'monthly') {
      fetchMonthlyAttendance();
    } else if (activeTab === 'reports') {
      fetchAttendanceReport();
    }
  }, [activeTab, selectedDate, selectedMonth, selectedYear]);

  const fetchDailyAttendance = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await hrApi.attendance({ date: selectedDate });
      if (res?.success) {
        setRecords(res.data || []);
        if (res.stats) setStats(res.stats);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load attendance');
    } finally {
      setLoading(false);
    }
  };

  const fetchMonthlyAttendance = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await hrApi.monthlyAttendance({ year: selectedYear, month: selectedMonth });
      if (res?.success) {
        setMonthlyData(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load monthly summary');
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendanceReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await hrApi.attendanceReport();
      if (res?.success) {
        setReportData(res.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load report');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (employeeRefId, newStatus) => {
    setRecords((prev) =>
      prev.map((r) => (r.employeeRefId === employeeRefId ? { ...r, status: newStatus } : r))
    );
  };

  const handleRemarksChange = (employeeRefId, remarks) => {
    setRecords((prev) =>
      prev.map((r) => (r.employeeRefId === employeeRefId ? { ...r, remarks } : r))
    );
  };

  const handleMarkAll = async (status) => {
    try {
      const res = await hrApi.markAllAttendance({ date: selectedDate, status });
      if (res?.success) {
        setRecords(res.data || []);
        if (res.stats) setStats(res.stats);
        showToast(`All staff marked ${status} for ${selectedDate}`, 'success');
      }
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Failed to update all', 'error');
    }
  };

  const handleSaveDaily = async () => {
    setSaving(true);
    try {
      const res = await hrApi.saveAttendance({
        date: selectedDate,
        records: records.map((r) => ({
          employeeRefId: r.employeeRefId,
          employeeType: r.employeeType || 'STAFF',
          employeeId: r.employeeId,
          employeeName: r.employeeName,
          employeeRole: r.employeeRole,
          department: r.department,
          status: r.status,
          clockIn: r.clockIn || '08:00 AM',
          clockOut: r.clockOut || '03:00 PM',
          remarks: r.remarks || '',
        })),
      });
      if (res?.success) {
        showToast('Daily staff attendance sheet successfully saved!', 'success');
        if (res.stats) setStats(res.stats);
      }
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Failed to save attendance', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 text-xs font-semibold">
      <PageHeader
        title="Staff Attendance Management"
        subtitle="Record daily clock-in logs, view month-wide attendance registries, and analyze staff presence rates."
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={activeTab === 'daily' ? fetchDailyAttendance : activeTab === 'monthly' ? fetchMonthlyAttendance : fetchAttendanceReport}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            {activeTab === 'daily' && (
              <button
                onClick={handleSaveDaily}
                disabled={saving || loading || records.length === 0}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-xs transition-all cursor-pointer disabled:opacity-60"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Attendance'}</span>
              </button>
            )}
          </div>
        }
      />

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6">
        <button
          onClick={() => setActiveTab('daily')}
          className={`pb-3 text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'daily'
              ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          Daily Attendance Sheet
        </button>
        <button
          onClick={() => setActiveTab('monthly')}
          className={`pb-3 text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'monthly'
              ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          Monthly Summary
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`pb-3 text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'reports'
              ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          Attendance Logs
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 p-4 rounded-2xl text-rose-700 dark:text-rose-400 text-xs font-semibold flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchDailyAttendance} className="underline font-bold cursor-pointer">Retry</button>
        </div>
      )}

      {/* Tab 1: Daily Attendance */}
      {activeTab === 'daily' && (
        <div className="space-y-6">
          {/* Top Controls & Metrics */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 shrink-0">Select Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold focus:outline-none focus:border-indigo-500 cursor-pointer"
              />
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => handleMarkAll('PRESENT')}
                className="px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 transition-colors font-bold text-xs cursor-pointer"
              >
                Mark All Present
              </button>
              <button
                type="button"
                onClick={() => handleMarkAll('ABSENT')}
                className="px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 transition-colors font-bold text-xs cursor-pointer"
              >
                Mark All Absent
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4">
              <span className="text-[11px] font-bold text-slate-400">Total Rostered</span>
              <div className="text-xl font-black text-slate-900 dark:text-white mt-0.5">{records.length}</div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4">
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">Present</span>
              <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                {records.filter((r) => r.status === 'PRESENT' || r.status === 'HALF_DAY').length}
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4">
              <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400">Absent</span>
              <div className="text-xl font-black text-rose-600 dark:text-rose-400 mt-0.5">
                {records.filter((r) => r.status === 'ABSENT').length}
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4">
              <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">On Leave</span>
              <div className="text-xl font-black text-amber-600 dark:text-amber-400 mt-0.5">
                {records.filter((r) => r.status === 'LEAVE').length}
              </div>
            </div>
          </div>

          {/* Records Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((n) => (
                  <div key={n} className="h-12 bg-slate-100 dark:bg-slate-800/60 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : records.length === 0 ? (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <CalendarDays className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700" />
                <p>No employee records found in roster for attendance logging.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 text-[11px]">
                      <th className="py-3">Emp ID</th>
                      <th>Staff Member</th>
                      <th>Department</th>
                      <th>Role</th>
                      <th>Attendance Status</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-850">
                    {records.map((row) => (
                      <tr key={row.employeeRefId} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/50 transition-colors">
                        <td className="py-3 font-mono font-bold text-slate-400">{row.employeeId}</td>
                        <td className="font-bold text-slate-900 dark:text-white">{row.employeeName}</td>
                        <td className="text-slate-600 dark:text-slate-400">{row.department || 'N/A'}</td>
                        <td className="text-slate-500">{row.employeeRole || row.employeeType}</td>
                        <td>
                          <select
                            value={row.status}
                            onChange={(e) => handleStatusChange(row.employeeRefId, e.target.value)}
                            className={`px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer focus:outline-none ${
                              row.status === 'PRESENT'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                                : row.status === 'ABSENT'
                                ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'
                                : row.status === 'LEAVE'
                                ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
                                : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800'
                            }`}
                          >
                            <option value="PRESENT">Present</option>
                            <option value="ABSENT">Absent</option>
                            <option value="LEAVE">Leave</option>
                            <option value="HALF_DAY">Half Day</option>
                            <option value="HOLIDAY">Holiday</option>
                          </select>
                        </td>
                        <td>
                          <input
                            type="text"
                            placeholder="Optional note..."
                            value={row.remarks || ''}
                            onChange={(e) => handleRemarksChange(row.employeeRefId, e.target.value)}
                            className="bg-slate-50 dark:bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 text-xs w-full max-w-xs focus:outline-none"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Monthly Summary */}
      {activeTab === 'monthly' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Month & Year:</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="bg-slate-50 dark:bg-slate-950 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold cursor-pointer"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
                <option key={m} value={m}>
                  {new Date(2000, m - 1, 1).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-slate-50 dark:bg-slate-950 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold w-24"
            />
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-12 bg-slate-100 dark:bg-slate-800/60 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : !monthlyData?.records || monthlyData.records.length === 0 ? (
            <p className="py-8 text-center text-slate-400">No monthly logs found for this period.</p>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">
                Found {monthlyData.records.length} logged attendance events for {monthlyData.monthStr}.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Reports */}
      {activeTab === 'reports' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Historical Attendance Audit Logs</h3>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-12 bg-slate-100 dark:bg-slate-800/60 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : reportData.length === 0 ? (
            <p className="py-8 text-center text-slate-400">No historical attendance records available.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 text-[11px]">
                    <th className="py-3">Date</th>
                    <th>Staff Name</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-850">
                  {reportData.map((row) => (
                    <tr key={row.id} className="py-2.5">
                      <td className="py-2.5 font-mono">{row.date}</td>
                      <td className="font-bold text-slate-900 dark:text-white">{row.employeeName}</td>
                      <td className="text-slate-600 dark:text-slate-400">{row.department || 'N/A'}</td>
                      <td>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800">
                          {row.status}
                        </span>
                      </td>
                      <td className="text-slate-400">{row.remarks || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <ToastComponent />
    </div>
  );
};
export default AttendanceManagement;
