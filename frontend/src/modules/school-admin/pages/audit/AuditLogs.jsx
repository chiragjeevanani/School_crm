import React, { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Tabs } from '../../components/ui/Tabs';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { MOCK_AUDIT_LOGS } from '../../utils/constants';

export const AuditLogs = () => {
  const [logs, setLogs] = useState(MOCK_AUDIT_LOGS);

  const columns = [
    { header: 'Action User', key: 'user', render: (val) => <span className="font-bold text-slate-900 dark:text-white">{val}</span> },
    { header: 'Action Label', key: 'action' },
    { header: 'Category Module', key: 'module', render: (val) => <Badge variant="info">{val}</Badge> },
    { header: 'Old Value State', key: 'oldValue' },
    { header: 'New Value State', key: 'newValue', render: (val) => <span className="font-semibold text-indigo-650">{val}</span> },
    { header: 'Date', key: 'date' },
    { header: 'Time', key: 'time' },
    { header: 'IP Location', key: 'ip' },
    { header: 'Device Agent', key: 'device' }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Audit Logs Registry" 
        subtitle="Review security changes, track student database modifications, and check administrator actions."
      />

      <Tabs 
        tabs={[
          { id: 'logs', label: 'All Operations logs', count: logs.length }
        ]}
        activeTab="logs"
        onChange={() => {}}
      />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <DataTable columns={columns} data={logs} searchPlaceholder="Search audit trail..." />
      </div>
    </div>
  );
};
export default AuditLogs;
