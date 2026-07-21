import React from 'react';
import { Card, Button } from '../../components/ui/Button';
import { useSuperAdminNotifications } from '../../context/SuperAdminNotificationContext';
import { FileText, Download } from 'lucide-react';

export default function ReportsIndex() {
  const { addNotification } = useSuperAdminNotifications();

  const handleExport = (type) => {
    addNotification('success', `Platform usage metrics compiled into ${type} format`);
  };

  const reports = [
    { name: 'Revenue Reports', desc: 'Detailed financial invoices, subscription payouts, and refunds ledger.' },
    { name: 'Tenant Usage Metrics', desc: 'CPU time, API request logs, S3 bucket storage sizes per schoolId.' },
    { name: 'Security Audit Log Trace', desc: 'Operator system access listings, login successes, and key creations.' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Enterprise PDF & Excel Reports</h1>
        <p className="text-xs text-slate-400">Download formatted financial sheets, platform usage charts, and system audit logs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reports.map((rep, idx) => (
          <Card key={idx} className="relative flex flex-col justify-between border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 space-y-4">
            <div className="space-y-2">
              <FileText className="h-8 w-8 text-indigo-500 dark:text-indigo-400" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">{rep.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed min-h-[36px]">{rep.desc}</p>
            </div>
            <div className="flex gap-2 pt-2">
              <Button className="w-full text-xs" onClick={() => handleExport('PDF')}>
                <Download size={12} className="mr-1" /> PDF
              </Button>
              <Button variant="secondary" className="w-full text-xs" onClick={() => handleExport('CSV')}>
                <Download size={12} className="mr-1" /> CSV
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
