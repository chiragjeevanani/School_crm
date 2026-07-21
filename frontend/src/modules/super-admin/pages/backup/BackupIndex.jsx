import React, { useState } from 'react';
import { Card, Button, Badge } from '../../components/ui/Button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/Table';
import { mockBackups } from '../../data/mockData';
import { useSuperAdminNotifications } from '../../context/SuperAdminNotificationContext';
import { ShieldCheck, HardDrive, RefreshCw, AlertCircle } from 'lucide-react';

export default function BackupIndex() {
  const { addNotification } = useSuperAdminNotifications();
  const [backups, setBackups] = useState(mockBackups);
  const [triggering, setTriggering] = useState(false);

  const handleManualBackup = () => {
    setTriggering(true);
    addNotification('info', 'Compiling isolated database backup archives...');
    setTimeout(() => {
      const newBackup = {
        id: `BAK-${Math.floor(1000 + Math.random() * 9000)}`,
        name: `db_snapshot_manual_${Date.now()}.tar.gz`,
        size: '2.41 GB',
        type: 'Manual',
        status: 'Success',
        date: new Date().toISOString().replace('T', ' ').substring(0, 19)
      };
      setBackups((prev) => [newBackup, ...prev]);
      setTriggering(false);
      addNotification('success', 'Manual snapshot successfully saved on AWS S3 cluster.');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Database Backup & Disaster Recovery</h1>
          <p className="text-xs text-slate-400">Schedule automatic hourly MongoDB snap dumps and verify archive checksums.</p>
        </div>
        <Button onClick={handleManualBackup} disabled={triggering}>
          <HardDrive size={14} className="mr-1.5" />
          {triggering ? 'Compiling snap...' : 'Trigger Manual Backup Snapshot'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Settings Info Card */}
        <Card className="space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="text-emerald-400" size={16} />
            Automatic Backup Schedule
          </h3>
          <div className="space-y-2 text-xs leading-relaxed text-slate-300">
            <p><strong>Frequency:</strong> Daily at 02:00 AM UTC (System Quiet Window)</p>
            <p><strong>Retention window:</strong> 30 Days (Roll Back capabilities enabled)</p>
            <p><strong>Target Endpoint:</strong> AWS S3 Glacier Deep Archive (Multi-Region Replica)</p>
          </div>
        </Card>

        {/* Warning card */}
        <Card className="flex items-center gap-4 bg-slate-900/40 border-slate-900">
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <AlertCircle size={20} />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wide">Disaster Recovery Actions</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Restoring database dumps will completely overwrite current collection mappings. All active user JWT sessions are automatically invalidated upon restore completion.
            </p>
          </div>
        </Card>
      </div>

      {/* Backup Ledger */}
      <Card className="space-y-4">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Storage Snap Vault Logs</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Snapshot ID</TableHead>
              <TableHead>Archive Filename</TableHead>
              <TableHead>Archive Size</TableHead>
              <TableHead>Schedule Type</TableHead>
              <TableHead>Validation Status</TableHead>
              <TableHead>Time Compiled</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {backups.map((bak) => (
              <TableRow key={bak.id}>
                <TableCell className="font-mono text-xs text-indigo-400">{bak.id}</TableCell>
                <TableCell className="font-mono text-xs text-slate-300">{bak.name}</TableCell>
                <TableCell>{bak.size}</TableCell>
                <TableCell>{bak.type}</TableCell>
                <TableCell>
                  <Badge variant={bak.status === 'Success' ? 'Active' : 'danger'}>{bak.status}</Badge>
                </TableCell>
                <TableCell className="text-xs text-slate-400 font-medium">{bak.date}</TableCell>
                <TableCell className="text-right">
                  <Button variant="secondary" size="sm" disabled={bak.status !== 'Success'}>
                    Restore
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
