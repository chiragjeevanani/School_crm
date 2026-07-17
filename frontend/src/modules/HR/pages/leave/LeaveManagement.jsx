import React, { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Tabs } from '../../components/ui/Tabs';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useToast } from '../../components/ui/Toast';
import { MOCK_LEAVE_REQUESTS } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';

export const LeaveManagement = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const { showToast, ToastComponent } = useToast();
  const [leaves, setLeaves] = useState(MOCK_LEAVE_REQUESTS);

  // Approve dialog states
  const [approveLeaveId, setApproveLeaveId] = useState(null);

  const handleApproveConfirm = () => {
    if (!approveLeaveId) return;

    setLeaves(prev => prev.map(l => l.id === approveLeaveId ? { ...l, status: 'Approved' } : l));
    showToast(`Leave request LVE #${approveLeaveId} approved! Staff leave balance updated automatically.`, 'success');
    setApproveLeaveId(null);
  };

  const pendingLeaves = leaves.filter(l => l.status === 'Pending');
  const allLeaves = leaves.filter(l => l.status !== 'Pending');

  const pendingColumns = [
    { key: 'id', title: 'Leave ID', sortable: true },
    { key: 'employeeName', title: 'Employee Name', sortable: true },
    { key: 'leaveType', title: 'Leave Category' },
    { key: 'fromDate', title: 'From Date', render: (val) => formatDate(val) },
    { key: 'toDate', title: 'To Date', render: (val) => formatDate(val) },
    { key: 'days', title: 'Days Requested' },
    { key: 'reason', title: 'Staff Remarks reason' },
    { 
      key: 'actions', 
      title: 'Decisions',
      render: (_, row) => (
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setApproveLeaveId(row.id)}
            className="px-2.5 py-1 text-[10px] font-bold text-white bg-rose-600 hover:bg-rose-750 rounded-lg shadow-sm"
          >
            Approve
          </button>
        </div>
      )
    }
  ];

  const archiveColumns = [
    { key: 'id', title: 'Leave ID', sortable: true },
    { key: 'employeeName', title: 'Employee Name', sortable: true },
    { key: 'leaveType', title: 'Leave Category' },
    { key: 'fromDate', title: 'From Date', render: (val) => formatDate(val) },
    { key: 'toDate', title: 'To Date', render: (val) => formatDate(val) },
    { key: 'days', title: 'Days' },
    { 
      key: 'status', 
      title: 'Status',
      render: (val) => <Badge variant={val === 'Approved' ? 'success' : 'danger'}>{val}</Badge>
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Leave Management desk" 
        subtitle="Review staff time off applications, approve casual/earned leave requests, and deduct leave balances." 
      />

      <Tabs 
        tabs={[
          { id: 'pending', label: `Pending leave approvals (${pendingLeaves.length})` },
          { id: 'all', label: 'Approved Leave Archive' }
        ]} 
        activeTab={activeTab} 
        onChange={setActiveTab} 
      />

      {activeTab === 'pending' && (
        <DataTable 
          columns={pendingColumns} 
          data={pendingLeaves} 
          searchPlaceholder="Search pending leaves..."
          searchKey="employeeName"
          emptyMessage="No pending leave applications at desk."
        />
      )}

      {activeTab === 'all' && (
        <DataTable 
          columns={archiveColumns} 
          data={allLeaves} 
          searchPlaceholder="Search leave archive..."
          searchKey="employeeName"
        />
      )}

      {/* Confirm Approve Dialog */}
      <ConfirmDialog
        isOpen={approveLeaveId !== null}
        onClose={() => setApproveLeaveId(null)}
        onConfirm={handleApproveConfirm}
        title="Approve Leave Application"
        message="Are you sure you want to approve this leave request? This will deduct the days from the employee's remaining balance."
        confirmText="Approve Request"
        variant="success"
      />

      <ToastComponent />
    </div>
  );
};
export default LeaveManagement;
