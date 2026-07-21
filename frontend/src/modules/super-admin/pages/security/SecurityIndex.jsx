import React, { useState } from 'react';
import { Card, Button, Badge } from '../../components/ui/Button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/Table';
import { mockActiveSessions, mockApiKeys } from '../../data/mockData';
import { useSuperAdminNotifications } from '../../context/SuperAdminNotificationContext';
import { ShieldAlert, Key, Globe, Terminal, Settings } from 'lucide-react';

export default function SecurityIndex() {
  const { addNotification } = useSuperAdminNotifications();
  const [keys, setKeys] = useState(mockApiKeys);
  const [sessions, setSessions] = useState(mockActiveSessions);

  const handleRevokeKey = (id, name) => {
    setKeys((prev) =>
      prev.map((k) => (k.id === id ? { ...k, status: 'Revoked' } : k))
    );
    addNotification('error', `Platform API Token Revoked: ${name}`);
  };

  const handleKillSession = (id) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    addNotification('warning', `Terminated Super Admin active login session token.`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">System Security & Gatekeeping</h1>
        <p className="text-xs text-slate-400">Revoke global API keys, configure password policies, and kill active admin sessions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* API Tokens */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Key size={16} className="text-indigo-400" />
              Super Admin API Tokens
            </h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Target Service</TableHead>
                <TableHead>Key Signature</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {keys.map((k) => (
                <TableRow key={k.id}>
                  <TableCell className="font-semibold text-slate-800 dark:text-slate-200">{k.name}</TableCell>
                  <TableCell className="font-mono text-xs text-slate-500">{k.key}</TableCell>
                  <TableCell>
                    <Badge variant={k.status}>{k.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {k.status === 'Active' && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRevokeKey(k.id, k.name)}
                      >
                        Revoke
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* Admin Login Session Logs */}
        <Card className="space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Terminal size={16} className="text-indigo-400" />
            Active Session Terminals
          </h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Operator User</TableHead>
                <TableHead>Device Node / IP</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((ses) => (
                <TableRow key={ses.id}>
                  <TableCell className="font-semibold text-slate-800 dark:text-slate-200">{ses.user}</TableCell>
                  <TableCell className="text-xs text-slate-500 dark:text-slate-400">{ses.device} ({ses.ip})</TableCell>
                  <TableCell className="text-slate-700 dark:text-slate-350 text-sm font-medium">{ses.location}</TableCell>
                  <TableCell className="text-right">
                    {!ses.current && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleKillSession(ses.id)}
                      >
                        Terminate
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
