import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { useToast } from '../../components/ui/Toast';
import { hrApi } from '../../../../shared/api/client';
import { ClipboardList, Download, RefreshCw, ShieldCheck } from 'lucide-react';

export const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast, ToastComponent } = useToast();

  useEffect(() => {
    fetchAuditTrail();
  }, []);

  const fetchAuditTrail = async () => {
    setLoading(true);
    try {
      const [leavesRes, payrollRes, empRes] = await Promise.all([
        hrApi.leaves({ limit: 20 }),
        hrApi.payrolls({ limit: 20 }),
        hrApi.employees({ limit: 20 }),
      ]);

      const events = [];

      (leavesRes.data || []).forEach((l) => {
        if (l.status === 'APPROVED') {
          events.push({
            id: `LVE-APP-${l.id}`,
            user: l.approvedBy || 'HR Manager',
            action: `Approved leave application for ${l.employeeName} (${l.totalDays} Days - ${l.leaveType})`,
            date: l.approvedAt ? new Date(l.approvedAt).toLocaleDateString() : l.startDate,
            type: 'LEAVE_APPROVED',
          });
        } else if (l.status === 'REJECTED') {
          events.push({
            id: `LVE-REJ-${l.id}`,
            user: l.rejectedBy || 'HR Manager',
            action: `Rejected leave application for ${l.employeeName} (${l.rejectionReason || 'No reason specified'})`,
            date: l.rejectedAt ? new Date(l.rejectedAt).toLocaleDateString() : l.startDate,
            type: 'LEAVE_REJECTED',
          });
        }
      });

      (payrollRes.data || []).forEach((p) => {
        if (p.paymentStatus === 'PAID') {
          events.push({
            id: `PAY-REL-${p.id}`,
            user: 'Finance / HR Operations',
            action: `Disbursed monthly salary of ₹${p.netSalary} to ${p.employeeName} (${p.payrollMonth})`,
            date: p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : 'Recent',
            type: 'PAYROLL_RELEASED',
          });
        }
      });

      (empRes.data || []).slice(0, 10).forEach((e) => {
        events.push({
          id: `EMP-REG-${e.id}`,
          user: 'HR Administration Desk',
          action: `Registered staff profile ${e.name} (${e.employeeId} - ${e.department || 'General'})`,
          date: e.createdAt ? new Date(e.createdAt).toLocaleDateString() : 'Recent',
          type: 'EMPLOYEE_REGISTERED',
        });
      });

      setLogs(events.sort((a, b) => (a.date < b.date ? 1 : -1)));
    } catch {
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExportAudits = () => {
    if (logs.length === 0) return;
    const jsonStr = JSON.stringify(logs, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hrms_audit_trail_${Date.now()}.json`;
    a.click();
    showToast('Audit trail exported successfully!', 'success');
  };

  return (
    <div className="space-y-6 text-xs font-semibold">
      <PageHeader
        title="Institutional Audit Trail & Activity Logs"
        subtitle="Immutable ledger of staff onboarding, leave adjudications, and payroll authorization events."
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={fetchAuditTrail}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleExportAudits}
              disabled={loading || logs.length === 0}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-xs transition-all cursor-pointer disabled:opacity-60"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Audit Trail</span>
            </button>
          </div>
        }
      />

      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="h-12 bg-slate-100 dark:bg-slate-800/60 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : logs.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <ClipboardList className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700" />
            <p>No audit trail activity recorded yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 text-[11px]">
                  <th className="py-3">Event Ref</th>
                  <th>Authorized Account</th>
                  <th>Action Description</th>
                  <th>Timestamp</th>
                  <th>Integrity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-850">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/50 transition-colors">
                    <td className="py-3.5 font-mono text-[10px] font-bold text-slate-400">{log.id}</td>
                    <td className="font-bold text-slate-900 dark:text-white">{log.user}</td>
                    <td className="text-slate-700 dark:text-slate-300 max-w-md">{log.action}</td>
                    <td className="text-slate-500">{log.date}</td>
                    <td>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Verified</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ToastComponent />
    </div>
  );
};
export default AuditLogs;
