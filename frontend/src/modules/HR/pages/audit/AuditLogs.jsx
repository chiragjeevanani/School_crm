import React from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { DataTable } from '../../components/ui/DataTable';
import { MOCK_AUDIT_LOGS } from '../../utils/constants';
import { Download } from 'lucide-react';
import { exportToCSV } from '../../utils/exportHelpers';
import { useToast } from '../../components/ui/Toast';

export const AuditLogs = () => {
  const { showToast, ToastComponent } = useToast();

  const handleExportAudits = () => {
    exportToCSV(MOCK_AUDIT_LOGS, `hrms_audit_trail_${Date.now()}.csv`);
    showToast('HR audit trail exported successfully!', 'success');
  };

  const columns = [
    { key: 'id', title: 'Log ID', sortable: true },
    { key: 'user', title: 'HR Officer / Employee Account', sortable: true },
    { key: 'action', title: 'Action Performed', sortable: true },
    { key: 'date', title: 'Date Logged', sortable: true },
    { key: 'time', title: 'Time Slot' },
    { key: 'ip', title: 'IP Address' }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="System Audit Logs" 
        subtitle="Review read-only histories of employee creations, leaves approvals, and payroll dispatches." 
        actions={
          <button
            onClick={handleExportAudits}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-rose-600 hover:bg-rose-750 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Audits</span>
          </button>
        }
      />

      <DataTable 
        columns={columns} 
        data={MOCK_AUDIT_LOGS} 
        searchPlaceholder="Search audit trails..."
        searchKey="action"
      />

      <ToastComponent />
    </div>
  );
};
export default AuditLogs;
