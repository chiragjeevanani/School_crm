import React, { useState } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/Table';
import { Card, Button, Badge } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/Dialog';
import { useSuperAdminNotifications } from '../../context/SuperAdminNotificationContext';
import { mockLicenses } from '../../data/mockData';
import { KeyRound, ShieldAlert, Check } from 'lucide-react';

export default function LicensesIndex() {
  const { addNotification } = useSuperAdminNotifications();
  const [licenses, setLicenses] = useState(mockLicenses);
  const [generateOpen, setGenerateOpen] = useState(false);

  // License configuration inputs
  const [licenseSchool, setLicenseSchool] = useState('');
  const [licenseDuration, setLicenseDuration] = useState('365');
  const [licenseDevices, setLicenseDevices] = useState('5');

  const handleGenerateLicense = (e) => {
    e.preventDefault();
    if (!licenseSchool) return;

    // Build key random string
    const hex = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const randPart = () => Array.from({ length: 4 }, () => hex[Math.floor(Math.random() * hex.length)]).join('');
    const newKey = `SMS-SAAS-${randPart()}-${randPart()}-${randPart()}`;

    const newLicense = {
      id: `lic_${Date.now()}`,
      key: newKey,
      school: licenseSchool,
      status: 'Active',
      expiry: new Date(Date.now() + parseInt(licenseDuration) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      devices: parseInt(licenseDevices),
      maxSchools: 1,
      maxUsers: 2000
    };

    setLicenses((prev) => [newLicense, ...prev]);
    addNotification('success', `Cryptographic hardware license deployed for: ${licenseSchool}`);
    setGenerateOpen(false);
    setLicenseSchool('');
  };

  const handleToggleLicense = (id, currentStatus) => {
    const nextStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    setLicenses((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: nextStatus } : l))
    );
    addNotification('info', `License token state modified to ${nextStatus}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">API & Device License Keys</h1>
          <p className="text-xs text-slate-400">Generate, activate, and suspend local server/device cryptographic licenses.</p>
        </div>

        <Dialog open={generateOpen} onOpenChange={setGenerateOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <KeyRound size={14} className="mr-1.5" />
              Generate License Signature
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generate Off-Network Cryptographic Token</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleGenerateLicense} className="space-y-4 mt-2">
              <Input
                label="Assignee School Name"
                placeholder="Oakridge International"
                value={licenseSchool}
                onChange={(e) => setLicenseSchool(e.target.value)}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <Select label="License Duration Validity" value={licenseDuration} onChange={(e) => setLicenseDuration(e.target.value)}>
                  <option value="90">90 Days (Quarterly)</option>
                  <option value="180">180 Days (Half Year)</option>
                  <option value="365">365 Days (Annual)</option>
                  <option value="3650">3650 Days (Lifetime)</option>
                </Select>
                <Input
                  label="Allowed Registered Devices"
                  type="number"
                  value={licenseDevices}
                  onChange={(e) => setLicenseDevices(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">Sign License Key File</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl flex gap-3 text-xs leading-relaxed max-w-4xl">
        <ShieldAlert size={18} className="flex-shrink-0" />
        <p>
          <strong>Security Notice:</strong> All generated licenses run hardware bindings verification. If a school exceeds their maximum device limit (e.g. tablet terminals for attendance), the client portal API triggers automated session terminations.
        </p>
      </div>

      {/* Licenses List Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>School Entity</TableHead>
            <TableHead>Cryptographic License Key</TableHead>
            <TableHead>Licensed Expiry</TableHead>
            <TableHead>Device Node Allotment</TableHead>
            <TableHead>License Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {licenses.map((lic) => (
            <TableRow key={lic.id}>
              <TableCell className="font-semibold text-slate-800 dark:text-slate-100">{lic.school}</TableCell>
              <TableCell className="font-mono text-xs text-indigo-550 dark:text-indigo-400 bg-slate-100 dark:bg-slate-950/40 p-2 rounded border border-slate-200 dark:border-slate-800 select-all">
                {lic.key}
              </TableCell>
              <TableCell className="text-xs text-slate-400 font-medium">{lic.expiry}</TableCell>
              <TableCell>{lic.devices} Active Nodes</TableCell>
              <TableCell>
                <Badge variant={lic.status}>{lic.status}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleToggleLicense(lic.id, lic.status)}
                >
                  {lic.status === 'Active' ? 'Suspend Token' : 'Re-Activate'}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
