import React from 'react';
import { Card, Badge } from '../../components/ui/Button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/Table';
import { mockSchools } from '../../data/mockData';
import { Server, Database, ShieldCheck, HelpCircle } from 'lucide-react';

export default function TenantsIndex() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Database Tenants & Security Boundaries</h1>
        <p className="text-xs text-slate-400">View unique schoolId indices, database isolation parameters, and cross-tenant boundary logs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Database Isolation Mode</h4>
            <p className="text-lg font-bold text-slate-200">MongoDB Separate Collections</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Server size={20} />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Database Clusters</h4>
            <p className="text-lg font-bold text-slate-200">AWS DocumentDB Replica Set</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400">
            <Database size={20} />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Cross-Tenant Access Alarms</h4>
            <p className="text-lg font-bold text-slate-200">0 Alerts Dispatched</p>
          </div>
        </Card>
      </div>

      {/* Tenants Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tenant Entity</TableHead>
            <TableHead>Tenant ID (schoolId query filter)</TableHead>
            <TableHead>Isolation Boundary Mode</TableHead>
            <TableHead>S3 File isolation prefix</TableHead>
            <TableHead>Health State</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockSchools.map((tenant) => (
            <TableRow key={tenant.id}>
              <TableCell className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Server size={14} className="text-indigo-400" />
                {tenant.name}
              </TableCell>
              <TableCell className="font-mono text-xs text-slate-400">{tenant.schoolId}</TableCell>
              <TableCell>
                <Badge variant="info">Isolated Collection Path</Badge>
              </TableCell>
              <TableCell className="font-mono text-xs text-slate-500">
                s3://school-erp-bucket/tenants/{tenant.schoolId}/
              </TableCell>
              <TableCell>
                <Badge variant="Active">Healthy</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
