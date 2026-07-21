import React, { useState } from 'react';
import {
  School,
  Users,
  Database,
  TrendingUp,
  Plus,
  TrendingDown,
  UserCheck,
  Building,
  Key,
  Download,
  AlertCircle
} from 'lucide-react';
import { Card, Button, Badge } from '../../components/ui/Button';
import { StatCard } from '../../components/dashboard/StatCard';
import { PlatformHealthBar } from '../../components/dashboard/PlatformHealthBar';
import { AnalyticsCharts } from '../../components/charts/AnalyticsCharts';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/Table';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/Dialog';
import { Input } from '../../components/ui/Input';
import { useSuperAdminNotifications } from '../../context/SuperAdminNotificationContext';
import {
  mockStats,
  mockRecentRegistrations,
  mockRecentActivities,
  mockTimelineRevenue,
  mockTimelineGrowth
} from '../../data/mockData';

export default function Dashboard() {
  const { addNotification } = useSuperAdminNotifications();
  const [backupLoading, setBackupLoading] = useState(false);
  const [announcementMsg, setAnnouncementMsg] = useState('');
  const [broadcastOpen, setBroadcastOpen] = useState(false);

  const handleBackup = () => {
    setBackupLoading(true);
    addNotification('info', 'Platform system backup initiated');
    setTimeout(() => {
      setBackupLoading(false);
      addNotification('success', 'Backup database archive compiled successfully (2.4 GB)');
    }, 2000);
  };

  const handleBroadcast = (e) => {
    e.preventDefault();
    if (!announcementMsg) return;
    addNotification('info', `Broadcast notification dispatched: "${announcementMsg}"`);
    setAnnouncementMsg('');
    setBroadcastOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Super Admin Dashboard</h1>
          <p className="text-xs text-slate-400">Manage all tenant structures, billing, analytics configurations.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleBackup} disabled={backupLoading} variant="secondary" size="sm">
            <Download size={14} className="mr-1.5" />
            {backupLoading ? 'Backing up...' : 'Trigger Backup'}
          </Button>

          <Dialog open={broadcastOpen} onOpenChange={setBroadcastOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Megaphone size={14} className="mr-1.5" />
                Global Broadcast
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Send Global SaaS Broadcast</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleBroadcast} className="space-y-4 mt-2">
                <Input
                  label="Broadcast Message"
                  placeholder="Enter system banner / notification content..."
                  value={announcementMsg}
                  onChange={(e) => setAnnouncementMsg(e.target.value)}
                  required
                />
                <Button type="submit" className="w-full">Dispatch Announcement</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Core Platform Counters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Schools" value={mockStats.totalSchools} change="8" trend="up" icon={Building} />
        <StatCard title="Platform Users" value={mockStats.totalUsers} change="1,240" trend="up" icon={Users} />
        <StatCard title="Active Sessions" value={mockStats.activeSessions} change="42" trend="up" icon={UserCheck} />
        <StatCard title="Storage Used" value={mockStats.storageUsed} change="0.4 TB" trend="up" icon={Database} />
      </div>

      {/* Auxiliary platform counters strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 bg-slate-100 dark:bg-slate-900/40 p-4 border border-slate-200 dark:border-slate-800/80 rounded-xl">
        {[
          { label: 'Active', val: mockStats.activeSchools },
          { label: 'Trial', val: mockStats.trialSchools },
          { label: 'Expired', val: mockStats.expiredSchools },
          { label: 'Failed Logins', val: mockStats.failedLogins },
          { label: 'API Hits/Day', val: mockStats.totalApiRequests },
          { label: 'Pending Renewals', val: mockStats.pendingRenewals }
        ].map((item, idx) => (
          <div key={idx} className="text-center md:text-left space-y-1">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">{item.label}</span>
            <span className="text-lg font-bold text-slate-800 dark:text-slate-200">{item.val}</span>
          </div>
        ))}
      </div>

      {/* Platform health summary widget */}
      <PlatformHealthBar server={99.9} database={99.8} storage={100} queue={98.7} />

      {/* Dynamic visual charts */}
      <AnalyticsCharts revenueData={mockTimelineRevenue} growthData={mockTimelineGrowth} />

      {/* Dual bottom sections: Registrations and Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Registrations Table */}
        <Card className="space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">New Tenant Registrations</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>School Name</TableHead>
                <TableHead>Requested Plan</TableHead>
                <TableHead>Registration Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockRecentRegistrations.map((school) => (
                <TableRow key={school.id}>
                  <TableCell className="font-semibold text-slate-800 dark:text-slate-100">{school.name}</TableCell>
                  <TableCell>{school.plan}</TableCell>
                  <TableCell className="text-slate-500 dark:text-slate-400 text-xs">{school.date}</TableCell>
                  <TableCell>
                    <Badge variant={school.status}>{school.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* Audit Log Overview / Activities */}
        <Card className="space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Recent System Audit logs</h3>
          <div className="space-y-3.5 max-h-[320px] overflow-y-auto pr-2">
            {mockRecentActivities.map((act) => (
              <div key={act.id} className="flex justify-between items-start gap-4 p-3 bg-slate-100 dark:bg-slate-950/40 rounded-lg border border-slate-200 dark:border-slate-900 hover:border-slate-300 dark:hover:border-slate-800 transition-colors">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-indigo-650 dark:text-indigo-400 uppercase tracking-wide block">{act.type.replace('_', ' ')}</span>
                  <p className="text-xs text-slate-750 dark:text-slate-300">{act.details || `School database profile modified`}</p>
                  <span className="text-[10px] text-slate-500 block">Operator: {act.user}</span>
                </div>
                <div className="text-right flex flex-col items-end">
                  <span className="text-[10px] text-slate-500">{act.time}</span>
                  <Badge variant="default" className="text-[8px] px-1 py-0.5 mt-1 border-slate-900 bg-slate-900">{act.ip}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// Icon helper workaround
function Megaphone(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m18 8 2 2" />
      <path d="m14 2 8 8" />
      <path d="M2 10h10a4 4 0 0 1 4 4v2a4 4 0 0 1-4 4H2" />
      <path d="m22 22-1.5-1.5" />
      <path d="M2 10a8 8 0 0 1 8-8" />
      <path d="M2 14v4a2 2 0 0 0 2 2" />
    </svg>
  );
}
