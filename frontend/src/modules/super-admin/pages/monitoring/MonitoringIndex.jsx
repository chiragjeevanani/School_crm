import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../../components/ui/Button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/Table';
import { mockSystemLogs } from '../../data/mockData';
import { useSuperAdminNotifications } from '../../context/SuperAdminNotificationContext';
import { Server, Cpu, Database, RefreshCcw } from 'lucide-react';

export default function MonitoringIndex() {
  const { addNotification } = useSuperAdminNotifications();
  const [logs, setLogs] = useState(mockSystemLogs);
  const [refreshLoading, setRefreshLoading] = useState(false);

  const handleManualRefresh = () => {
    setRefreshLoading(true);
    addNotification('info', 'Platform systems health parameters refreshed');
    setTimeout(() => {
      setRefreshLoading(false);
    }, 800);
  };

  const getLevelBadge = (level) => {
    if (level === 'error') return <Badge variant="danger">Error</Badge>;
    if (level === 'warn') return <Badge variant="warning">Warning</Badge>;
    return <Badge variant="success">Info</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Real-Time Platform Monitoring</h1>
          <p className="text-xs text-slate-400">View CPU stats, active MongoDB connections, redis queue states, and logs.</p>
        </div>
        <Button variant="secondary" size="sm" onClick={handleManualRefresh} disabled={refreshLoading}>
          <RefreshCcw size={14} className={`mr-1.5 ${refreshLoading ? 'animate-spin' : ''}`} />
          {refreshLoading ? 'Refreshing...' : 'Refresh Health Metrics'}
        </Button>
      </div>

      {/* Real-Time usage cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="space-y-4">
          <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
            <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Cpu size={16} className="text-indigo-500 dark:text-indigo-400" />
              NodeJS VM CPU Load
            </span>
            <span className="text-xs font-bold">14.2%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-650 dark:bg-indigo-500 rounded-full" style={{ width: '14.2%' }} />
          </div>
        </Card>

        <Card className="space-y-4">
          <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
            <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Server size={16} className="text-indigo-500 dark:text-indigo-400" />
              Docker Container RAM
            </span>
            <span className="text-xs font-bold">1.82 GB / 4.0 GB</span>
          </div>
          <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-650 dark:bg-indigo-500 rounded-full" style={{ width: '45.5%' }} />
          </div>
        </Card>

        <Card className="space-y-4">
          <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
            <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Database size={16} className="text-indigo-500 dark:text-indigo-400" />
              MongoDB Pool Usage
            </span>
            <span className="text-xs font-bold">84 / 200 conns</span>
          </div>
          <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-650 dark:bg-indigo-500 rounded-full" style={{ width: '42%' }} />
          </div>
        </Card>
      </div>

      {/* System Event Logs table */}
      <Card className="space-y-4">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Live System Logs Visualizer</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Severity Level</TableHead>
              <TableHead>Platform Node Service</TableHead>
              <TableHead>Event Output Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log, idx) => (
              <TableRow key={idx}>
                <TableCell className="font-mono text-xs text-slate-500 dark:text-slate-400">{log.timestamp}</TableCell>
                <TableCell>{getLevelBadge(log.level)}</TableCell>
                <TableCell className="font-semibold text-slate-700 dark:text-slate-350">{log.service}</TableCell>
                <TableCell className="font-mono text-xs text-slate-600 dark:text-slate-200">{log.message}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
