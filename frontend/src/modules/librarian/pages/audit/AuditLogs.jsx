import React from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { DataTable } from '../../components/ui/DataTable';
import { MOCK_LOGS } from '../../utils/constants';
import { formatDateTime } from '../../utils/formatters';
import { History } from 'lucide-react';

export const AuditLogs = () => {
  const columns = [
    { title: 'Log ID', key: 'id', sortable: true },
    { title: 'Date / Time', key: 'timestamp', render: (val) => formatDateTime(val), sortable: true },
    { title: 'Operator', key: 'operatorName', sortable: true },
    { title: 'Circulation Action', key: 'action', filterable: true },
    { title: 'Details Audit', key: 'details' }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Logs Ledger"
        subtitle="Read-only ledger tracking all circulation transactions, stock additions, and waivers."
      />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6">
        <DataTable
          columns={columns}
          data={MOCK_LOGS}
          searchPlaceholder="Search audit details by description or user..."
          searchKeys={['details', 'operatorName', 'id']}
          csvFilename="library_audit_trails.csv"
        />
      </div>
    </div>
  );
};
