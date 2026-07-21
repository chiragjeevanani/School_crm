import React, { useState } from 'react';
import { Card, Button, Badge } from '../../components/ui/Button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/Table';
import { mockAuditLogs } from '../../data/mockData';
import { useSuperAdminNotifications } from '../../context/SuperAdminNotificationContext';
import { History, Download } from 'lucide-react';

export default function AuditLogsIndex() {
  const { addNotification } = useSuperAdminNotifications();
  const [logs, setLogs] = useState(mockAuditLogs);

  const handleExportLogs = () => {
    addNotification('success', 'Database audit trace exported (CSV format, 412 entries)');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Security Audit Logs</h1>
          <p className="text-xs text-slate-400">Review platform state adjustments, billing adjustments, and admin login logs.</p>
        </div>
        <Button variant="secondary" size="sm" onClick={handleExportLogs}>
          <Download size={14} className="mr-1.5" />
          Export Audit Trace
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Audit ID</TableHead>
            <TableHead>Event Action</TableHead>
            <TableHead>Target Entity</TableHead>
            <TableHead>Operator Identity</TableHead>
            <TableHead>IP & Location</TableHead>
            <TableHead>Date & Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="font-mono text-xs text-indigo-400">{log.id}</TableCell>
              <TableCell className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                <History size={14} className="text-slate-500" />
                {log.event}
              </TableCell>
              <TableCell>
                <Badge variant="default">{log.entity}</Badge>
              </TableCell>
              <TableCell className="text-xs text-slate-700 dark:text-slate-200">
                {log.user}
              </TableCell>
              <TableCell className="text-xs text-slate-400">
                {log.ip} ({log.location})
              </TableCell>
              <TableCell className="text-xs text-slate-400 font-medium">{log.time}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
