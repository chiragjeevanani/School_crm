import React, { useState } from 'react';
import { Card, Button, Badge } from '../../components/ui/Button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/Table';
import { mockInvoices, mockStats } from '../../data/mockData';
import { useSuperAdminNotifications } from '../../context/SuperAdminNotificationContext';
import { DollarSign, Receipt, CreditCard, Layers } from 'lucide-react';

export default function RevenueIndex() {
  const { addNotification } = useSuperAdminNotifications();
  const [invoices, setInvoices] = useState(mockInvoices);

  const handleSimulateRefund = (id, amount) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status: 'Refunded' } : inv))
    );
    addNotification('warning', `Payment refund generated for: $${amount}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Revenue Operations & Billing Ledger</h1>
        <p className="text-xs text-slate-400">Track MRR expansion, SaaS customer invoices, and processing rates.</p>
      </div>

      {/* Financial metrics boxes */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <DollarSign size={20} />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Monthly Recurring Revenue</h4>
            <p className="text-xl font-bold text-slate-800 dark:text-slate-100">${mockStats.monthlyRevenue}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 dark:text-emerald-400">
            <Layers size={20} />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Annual Run Rate</h4>
            <p className="text-xl font-bold text-slate-800 dark:text-slate-100">${mockStats.annualRevenue}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-550 dark:text-violet-400">
            <Receipt size={20} />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Invoices</h4>
            <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{mockStats.pendingRenewals} Pending</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-550 dark:text-sky-400">
            <CreditCard size={20} />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Stripe Success Rate</h4>
            <p className="text-xl font-bold text-slate-800 dark:text-slate-100">98.4%</p>
          </div>
        </Card>
      </div>

      {/* Invoices List table */}
      <Card className="space-y-4">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Stripe & Razorpay Billing History</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice ID</TableHead>
              <TableHead>Customer School</TableHead>
              <TableHead>Billed tier</TableHead>
              <TableHead>Amount (USD)</TableHead>
              <TableHead>Issued Date</TableHead>
              <TableHead>Invoice Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((inv) => (
              <TableRow key={inv.id}>
                <TableCell className="font-mono text-xs text-indigo-400">{inv.id}</TableCell>
                <TableCell className="font-semibold text-slate-800 dark:text-slate-100">{inv.school}</TableCell>
                <TableCell>{inv.plan}</TableCell>
                <TableCell>${inv.amount.toFixed(2)}</TableCell>
                <TableCell className="text-xs text-slate-400">{inv.date}</TableCell>
                <TableCell>
                  <Badge variant={inv.status}>{inv.status}</Badge>
                </TableCell>
                <TableCell className="text-right flex items-center justify-end gap-2">
                  <Button variant="secondary" size="sm">
                    View PDF
                  </Button>
                  {inv.status === 'Paid' && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleSimulateRefund(inv.id, inv.amount)}
                    >
                      Refund
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
