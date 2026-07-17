import React, { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Tabs } from '../../components/ui/Tabs';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useToast } from '../../components/ui/Toast';
import { ShieldCheck, History, Award } from 'lucide-react';
import { MOCK_LEAVE_REQUESTS, MOCK_AUDIT_LOGS } from '../../utils/constants';

export const LeaveApproval = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const { showToast, ToastComponent } = useToast();

  // Local Leave state
  const [leaves, setLeaves] = useState(MOCK_LEAVE_REQUESTS);
  const [auditLogs, setAuditLogs] = useState(MOCK_AUDIT_LOGS);

  // Dialog triggers
  const [confirmApproveId, setConfirmApproveId] = useState(null);
  const [confirmRejectId, setConfirmRejectId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const handleApprove = (id) => {
    const record = leaves.find(l => l.id === id);
    if (!record) return;

    setLeaves(prev => prev.map(l => l.id === id ? { ...l, status: 'Approved' } : l));
    
    // Add to Audit Log
    const newAudit = {
      id: `AUD-00${auditLogs.length + 1}`,
      user: 'Principal S. Chatterjee',
      action: `Approved Leave Request ${id} for ${record.staffName}`,
      date: new Date().toISOString(),
      schoolId: 'SCH-2026-09'
    };
    setAuditLogs([newAudit, ...auditLogs]);

    showToast(`Leave request for ${record.staffName} approved. Audit log generated!`, 'success');
    setConfirmApproveId(null);
  };

  const handleReject = (e) => {
    e.preventDefault();
    if (!confirmRejectId || !rejectReason) return;

    const record = leaves.find(l => l.id === confirmRejectId);
    if (!record) return;

    setLeaves(prev => prev.map(l => l.id === confirmRejectId ? { ...l, status: 'Rejected', managerNotes: rejectReason } : l));

    // Add to Audit Log
    const newAudit = {
      id: `AUD-00${auditLogs.length + 1}`,
      user: 'Principal S. Chatterjee',
      action: `Rejected Leave Request ${confirmRejectId} for ${record.staffName}. Reason: ${rejectReason}`,
      date: new Date().toISOString(),
      schoolId: 'SCH-2026-09'
    };
    setAuditLogs([newAudit, ...auditLogs]);

    showToast(`Leave request for ${record.staffName} rejected. Reason logged.`, 'info');
    setConfirmRejectId(null);
    setRejectReason('');
  };

  // Columns for Pending Leave Table
  const pendingColumns = [
    { key: 'staffName', title: 'Applicant Name', sortable: true },
    { key: 'role', title: 'Staff Role' },
    { key: 'dates', title: 'Leave Dates' },
    { key: 'days', title: 'Days count' },
    { key: 'reason', title: 'Detailed Reason Statement' },
    { 
      key: 'actions', 
      title: 'Approval Signature Actions',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setConfirmRejectId(row.id)}
            className="px-2.5 py-1 text-[10px] font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 rounded-lg transition-all"
          >
            Reject
          </button>
          <button
            onClick={() => setConfirmApproveId(row.id)}
            className="px-2.5 py-1 text-[10px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-all shadow-sm"
          >
            Approve
          </button>
        </div>
      )
    }
  ];

  // Columns for Leave Archive History
  const historyColumns = [
    { key: 'staffName', title: 'Applicant Name', sortable: true },
    { key: 'role', title: 'Staff Role' },
    { key: 'dates', title: 'Leave Dates' },
    { key: 'days', title: 'Days' },
    { 
      key: 'status', 
      title: 'Status',
      render: (val) => (
        <Badge variant={val === 'Approved' ? 'success' : val === 'Pending' ? 'warning' : 'danger'}>
          {val}
        </Badge>
      )
    },
    { key: 'managerNotes', title: 'Principal Remarks' }
  ];

  const pendingLeaves = leaves.filter(l => l.status === 'Pending');
  const historyLeaves = leaves.filter(l => l.status !== 'Pending');

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Leave Approvals Panel" 
        subtitle="Review leave applications submitted by academic faculty or administrative staff. Sign off or decline." 
      />

      <Tabs 
        tabs={[
          { id: 'pending', label: `Pending Signatures (${pendingLeaves.length})` },
          { id: 'history', label: 'Leave Archive History' },
          { id: 'audit', label: 'Principal Approval Audit Logs' }
        ]} 
        activeTab={activeTab} 
        onChange={setActiveTab} 
      />

      {activeTab === 'pending' && (
        <DataTable 
          columns={pendingColumns} 
          data={pendingLeaves} 
          searchPlaceholder="Search leave requests by name..."
          searchKey="staffName"
          emptyMessage="All pending leave requests approved."
        />
      )}

      {activeTab === 'history' && (
        <DataTable 
          columns={historyColumns} 
          data={historyLeaves} 
          searchPlaceholder="Search history logs..."
          searchKey="staffName"
        />
      )}

      {activeTab === 'audit' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b">
            <History className="w-5 h-5 text-emerald-650" />
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-850 dark:text-white">Authorized Signature Audits</h4>
          </div>
          <div className="space-y-3.5 text-xs font-semibold">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 rounded-2xl flex items-start justify-between">
                <div>
                  <span className="font-bold text-slate-905 dark:text-white block">{log.action}</span>
                  <span className="text-[10px] text-slate-400 mt-1 block">Signed by: {log.user} • School Reference ID: {log.schoolId}</span>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0 font-medium">{new Date(log.date).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Approve Dialog */}
      <ConfirmDialog
        isOpen={confirmApproveId !== null}
        onClose={() => setConfirmApproveId(null)}
        onConfirm={() => handleApprove(confirmApproveId)}
        title="Approve Leave Application"
        message="Are you sure you want to sign off and approve this leave request? This action will generate a permanent audit log entry."
        confirmText="Approve & Sign"
        variant="success"
      />

      {/* Reject Modal */}
      <Modal isOpen={confirmRejectId !== null} onClose={() => setConfirmRejectId(null)} title="Decline Leave Application">
        <form onSubmit={handleReject} className="space-y-4 text-xs font-semibold">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-450 block">Decline Reason Remarks</label>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Provide a brief explanation for declining this leave..."
              required
              className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border focus:outline-none focus:ring-1 focus:ring-emerald-650 font-sans"
            />
          </div>
          <div className="flex justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setConfirmRejectId(null)}
              className="px-3.5 py-2 text-slate-500 hover:bg-slate-100 border rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-sm"
            >
              Decline Application
            </button>
          </div>
        </form>
      </Modal>

      <ToastComponent />
    </div>
  );
};
export default LeaveApproval;
