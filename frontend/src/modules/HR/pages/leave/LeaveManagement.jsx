import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useToast } from '../../components/ui/Toast';
import { hrApi } from '../../../../shared/api/client';
import {
  CalendarRange,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  Search,
  AlertCircle,
  FileText
} from 'lucide-react';

export const LeaveManagement = () => {
  const [activeTab, setActiveTab] = useState('ALL');
  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState({ TOTAL: 0, PENDING: 0, APPROVED: 0, REJECTED: 0, CANCELLED: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [approveLeaveId, setApproveLeaveId] = useState(null);
  const [rejectLeaveId, setRejectLeaveId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // New Leave Form
  const [selectedEmpId, setSelectedEmpId] = useState('');
  const [leaveType, setLeaveType] = useState('CASUAL');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [reason, setReason] = useState('');

  const { showToast, ToastComponent } = useToast();

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [leaveRes, empRes] = await Promise.all([
        hrApi.leaves({ status: activeTab }),
        hrApi.employees({ limit: 200 }),
      ]);
      if (leaveRes?.success) {
        setLeaves(leaveRes.data || []);
        if (leaveRes.stats) setStats(leaveRes.stats);
      }
      if (empRes?.success) {
        setEmployees(empRes.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load leaves');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLeave = async (e) => {
    e.preventDefault();
    if (!selectedEmpId || !reason.trim()) return;

    setSubmitting(true);
    try {
      const emp = employees.find((e) => e.id === selectedEmpId);
      const payload = {
        employeeRefId: selectedEmpId,
        employeeType: emp?.employeeType || 'STAFF',
        employeeId: emp?.employeeId || 'EMP',
        employeeName: emp?.name || 'Staff',
        department: emp?.department || '',
        leaveType,
        startDate,
        endDate,
        reason: reason.trim(),
      };

      await hrApi.createLeave(payload);
      showToast('Leave request submitted successfully!', 'success');
      setShowCreateModal(false);
      setSelectedEmpId('');
      setReason('');
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Failed to submit leave', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleApprove = async () => {
    if (!approveLeaveId) return;
    try {
      await hrApi.approveLeave(approveLeaveId);
      setLeaves((prev) =>
        prev.map((l) => (l.id === approveLeaveId ? { ...l, status: 'APPROVED' } : l))
      );
      showToast('Leave request approved successfully!', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Failed to approve leave', 'error');
    } finally {
      setApproveLeaveId(null);
    }
  };

  const handleReject = async () => {
    if (!rejectLeaveId) return;
    try {
      await hrApi.rejectLeave(rejectLeaveId, rejectReason);
      setLeaves((prev) =>
        prev.map((l) => (l.id === rejectLeaveId ? { ...l, status: 'REJECTED' } : l))
      );
      showToast('Leave request rejected.', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Failed to reject leave', 'error');
    } finally {
      setRejectLeaveId(null);
      setRejectReason('');
    }
  };

  return (
    <div className="space-y-6 text-xs font-semibold">
      <PageHeader
        title="Leave Management Desk"
        subtitle="Review staff leave requests, manage entitlement quotas, and approve time-off applications."
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={fetchData}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Apply for Staff Leave</span>
            </button>
          </div>
        }
      />

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4">
          <span className="text-[11px] font-bold text-slate-400">Total Applications</span>
          <div className="text-xl font-black text-slate-900 dark:text-white mt-0.5">{stats.TOTAL || 0}</div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4">
          <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">Pending Review</span>
          <div className="text-xl font-black text-amber-600 dark:text-amber-400 mt-0.5">{stats.PENDING || 0}</div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4">
          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">Approved</span>
          <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">{stats.APPROVED || 0}</div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4">
          <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400">Rejected</span>
          <div className="text-xl font-black text-rose-600 dark:text-rose-400 mt-0.5">{stats.REJECTED || 0}</div>
        </div>
      </div>

      {/* Tab Filter */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6">
        {[
          { id: 'ALL', label: 'All Requests' },
          { id: 'PENDING', label: `Pending Review (${stats.PENDING || 0})` },
          { id: 'APPROVED', label: `Approved (${stats.APPROVED || 0})` },
          { id: 'REJECTED', label: `Rejected (${stats.REJECTED || 0})` },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`pb-3 text-xs font-bold transition-colors cursor-pointer ${
              activeTab === t.id
                ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Leave Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="h-12 bg-slate-100 dark:bg-slate-800/60 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : leaves.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <CalendarRange className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700" />
            <p>No leave applications found under this status filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 text-[11px]">
                  <th className="py-3">Applicant Name</th>
                  <th>Department</th>
                  <th>Leave Type</th>
                  <th>Dates Range</th>
                  <th>Total Days</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-850">
                {leaves.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/50 transition-colors">
                    <td className="py-3 font-bold text-slate-900 dark:text-white">
                      <div>
                        <span>{l.employeeName}</span>
                        <span className="text-[10px] text-slate-400 block font-mono">{l.employeeId}</span>
                      </div>
                    </td>
                    <td className="text-slate-600 dark:text-slate-400">{l.department || 'N/A'}</td>
                    <td>
                      <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold text-[10px]">
                        {l.leaveType}
                      </span>
                    </td>
                    <td className="text-slate-600 dark:text-slate-400 text-xs">
                      {l.startDate} to {l.endDate}
                    </td>
                    <td className="font-bold text-slate-900 dark:text-white">{l.totalDays} Days</td>
                    <td className="text-slate-500 max-w-xs truncate" title={l.reason}>
                      {l.reason}
                    </td>
                    <td>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          l.status === 'APPROVED'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                            : l.status === 'REJECTED'
                            ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400'
                            : 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400'
                        }`}
                      >
                        {l.status}
                      </span>
                    </td>
                    <td className="text-right">
                      {l.status === 'PENDING' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setApproveLeaveId(l.id)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => setRejectLeaveId(l.id)}
                            className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold cursor-pointer transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400">{l.approvedBy ? `By ${l.approvedBy}` : '—'}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Apply Leave Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-100">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              Apply Leave on Behalf of Staff
            </h3>

            <form onSubmit={handleCreateLeave} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-slate-700 dark:text-slate-300 font-bold">Select Staff Member *</label>
                <select
                  required
                  value={selectedEmpId}
                  onChange={(e) => setSelectedEmpId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-xs font-semibold cursor-pointer"
                >
                  <option value="">Choose an employee...</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.employeeId}) • {emp.department}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 dark:text-slate-300 font-bold">Leave Classification *</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-xs font-semibold cursor-pointer"
                >
                  <option value="CASUAL">Casual Leave (CL)</option>
                  <option value="MEDICAL">Medical / Sick Leave (SL)</option>
                  <option value="PAID">Earned / Paid Leave (PL)</option>
                  <option value="UNPAID">Leave Without Pay (LWP)</option>
                  <option value="MATERNITY">Maternity Leave</option>
                  <option value="PATERNITY">Paternity Leave</option>
                  <option value="OTHER">Other Purpose</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700 dark:text-slate-300 font-bold">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-xs cursor-pointer"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-700 dark:text-slate-300 font-bold">End Date *</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-xs cursor-pointer"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 dark:text-slate-300 font-bold">Reason for Application *</label>
                <textarea
                  required
                  placeholder="Explain reason for leave..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows="3"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-xs cursor-pointer disabled:opacity-60"
                >
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Approve Confirm Dialog */}
      {approveLeaveId && (
        <ConfirmDialog
          isOpen={Boolean(approveLeaveId)}
          title="Approve Leave Request"
          message="Are you sure you want to approve this leave request? This will deduct the days from the staff member's available quota."
          onConfirm={handleApprove}
          onCancel={() => setApproveLeaveId(null)}
          confirmVariant="primary"
          confirmText="Approve Leave"
        />
      )}

      {/* Reject Modal with Reason */}
      {rejectLeaveId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-100">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              Reject Leave Request
            </h3>
            <div className="space-y-2">
              <label className="text-slate-700 dark:text-slate-300 font-bold">Reason for Rejection</label>
              <textarea
                placeholder="Provide feedback on why leave is rejected..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows="3"
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-xs"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setRejectLeaveId(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReject}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-xs cursor-pointer"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastComponent />
    </div>
  );
};
export default LeaveManagement;
