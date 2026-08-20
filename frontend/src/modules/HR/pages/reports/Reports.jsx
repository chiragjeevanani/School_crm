import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { useToast } from '../../components/ui/Toast';
import { hrApi } from '../../../../shared/api/client';
import { BarChart3, Download, RefreshCw, Users, CalendarDays, CalendarRange, BadgeCent, Building } from 'lucide-react';

export const Reports = () => {
  const [activeTab, setActiveTab] = useState('employee-summary');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showToast, ToastComponent } = useToast();

  useEffect(() => {
    fetchReport();
  }, [activeTab]);

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await hrApi.report(activeTab);
      if (res?.success) {
        setData(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!data) return;
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hr_${activeTab}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    showToast('Report downloaded successfully!', 'success');
  };

  return (
    <div className="space-y-6 text-xs font-semibold">
      <PageHeader
        title="HR Analytics & Audit Reports Hub"
        subtitle="Institutional data aggregation engine for staff growth, attendance rosters, leave utilization, and payroll analytics."
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={fetchReport}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors cursor-pointer"
              title="Refresh Report"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleExportCSV}
              disabled={loading || !data}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-xs transition-all cursor-pointer disabled:opacity-60"
            >
              <Download className="w-4 h-4" />
              <span>Export Report</span>
            </button>
          </div>
        }
      />

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 overflow-x-auto no-scrollbar">
        {[
          { id: 'employee-summary', label: 'Staff Headcount' },
          { id: 'attendance-summary', label: 'Attendance Aggregation' },
          { id: 'leave-summary', label: 'Leave Utilization' },
          { id: 'payroll-summary', label: 'Payroll Distribution' },
          { id: 'department-wise', label: 'Department Roster' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`pb-3 text-xs font-bold transition-colors cursor-pointer shrink-0 ${
              activeTab === t.id
                ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 p-4 rounded-2xl text-rose-700 dark:text-rose-400 text-xs font-semibold flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchReport} className="underline font-bold cursor-pointer">Retry</button>
        </div>
      )}

      {/* Report Content Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
        {loading ? (
          <div className="space-y-4">
            <div className="h-6 w-48 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
            <div className="h-48 bg-slate-100 dark:bg-slate-800/60 rounded-2xl animate-pulse" />
          </div>
        ) : !data ? (
          <p className="py-12 text-center text-slate-400">No report data generated.</p>
        ) : (
          <div>
            {/* Tab: Employee Summary */}
            {activeTab === 'employee-summary' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-100 dark:border-slate-850">
                    <span className="text-[11px] font-bold text-slate-400">Active Staff</span>
                    <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                      {data.activeCount || 0}
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-100 dark:border-slate-850">
                    <span className="text-[11px] font-bold text-slate-400">Teaching Faculty</span>
                    <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                      {data.totalTeachers || 0}
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-100 dark:border-slate-850">
                    <span className="text-[11px] font-bold text-slate-400">Administrative Staff</span>
                    <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                      {data.totalStaff || 0}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 dark:text-white">Department Breakdown</h4>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden">
                    {(data.departmentBreakdown || []).map((d) => (
                      <div key={d.name} className="p-3 flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-800 dark:text-slate-200">{d.name}</span>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">{d.count} Members</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Attendance Summary */}
            {activeTab === 'attendance-summary' && (
              <div className="space-y-6">
                <div className="p-4 bg-indigo-50 dark:bg-indigo-950/30 rounded-2xl border border-indigo-100 dark:border-indigo-900/30">
                  <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">
                    Reporting Month: {data.month}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-100 dark:border-slate-850">
                    <span className="text-[11px] font-bold text-emerald-600">Present</span>
                    <div className="text-2xl font-black text-emerald-600 mt-1">{data.summary?.PRESENT || 0}</div>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-100 dark:border-slate-850">
                    <span className="text-[11px] font-bold text-rose-600">Absent</span>
                    <div className="text-2xl font-black text-rose-600 mt-1">{data.summary?.ABSENT || 0}</div>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-100 dark:border-slate-850">
                    <span className="text-[11px] font-bold text-amber-600">Approved Leave</span>
                    <div className="text-2xl font-black text-amber-600 mt-1">{data.summary?.LEAVE || 0}</div>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-100 dark:border-slate-850">
                    <span className="text-[11px] font-bold text-blue-600">Half Day</span>
                    <div className="text-2xl font-black text-blue-600 mt-1">{data.summary?.HALF_DAY || 0}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Leave Summary */}
            {activeTab === 'leave-summary' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-100 dark:border-slate-850">
                    <span className="text-[11px] font-bold text-slate-400">Total Applications</span>
                    <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{data.stats?.TOTAL || 0}</div>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-100 dark:border-slate-850">
                    <span className="text-[11px] font-bold text-emerald-600">Approved</span>
                    <div className="text-2xl font-black text-emerald-600 mt-1">{data.stats?.APPROVED || 0}</div>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-100 dark:border-slate-850">
                    <span className="text-[11px] font-bold text-amber-600">Pending Review</span>
                    <div className="text-2xl font-black text-amber-600 mt-1">{data.stats?.PENDING || 0}</div>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-100 dark:border-slate-850">
                    <span className="text-[11px] font-bold text-rose-600">Rejected</span>
                    <div className="text-2xl font-black text-rose-600 mt-1">{data.stats?.REJECTED || 0}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Payroll Summary */}
            {activeTab === 'payroll-summary' && (
              <div className="space-y-4">
                <h4 className="font-bold text-slate-900 dark:text-white">Recent Payroll Cycles</h4>
                {(!data.monthlySummary || data.monthlySummary.length === 0) ? (
                  <p className="py-8 text-center text-slate-400">No payroll summaries recorded.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 text-[11px]">
                          <th className="py-2.5">Month</th>
                          <th>Vouchers</th>
                          <th>Gross Disbursed</th>
                          <th>Deductions</th>
                          <th>Net Disbursed</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 dark:divide-slate-850">
                        {data.monthlySummary.map((m) => (
                          <tr key={m._id} className="py-2.5">
                            <td className="py-2.5 font-bold text-slate-900 dark:text-white">{m._id}</td>
                            <td>{m.count} Staff</td>
                            <td>₹{Number(m.totalGross || 0).toLocaleString('en-IN')}</td>
                            <td className="text-rose-500">₹{Number(m.totalDeductions || 0).toLocaleString('en-IN')}</td>
                            <td className="font-black text-emerald-600 dark:text-emerald-400">
                              ₹{Number(m.totalNet || 0).toLocaleString('en-IN')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Department Wise */}
            {activeTab === 'department-wise' && (
              <div className="space-y-4">
                <h4 className="font-bold text-slate-900 dark:text-white">Active Departments & Headcount</h4>
                {(!data.departments || data.departments.length === 0) ? (
                  <p className="py-8 text-center text-slate-400">No departments configured.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {data.departments.map((dept) => (
                      <div key={dept.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-850 flex justify-between items-center">
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block">{dept.name}</span>
                          <span className="text-[11px] text-slate-400 block">HOD: {dept.headEmployeeName || 'Not Assigned'}</span>
                        </div>
                        <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-xl font-black">
                          {dept.employeeCount || 0} Staff
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <ToastComponent />
    </div>
  );
};
export default Reports;
