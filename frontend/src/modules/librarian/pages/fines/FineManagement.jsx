import React, { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatCard } from '../../components/ui/StatCard';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useToast } from '../../components/ui/Toast';
import { MOCK_FINES } from '../../utils/constants';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Receipt, Coins, ShieldCheck, HelpCircle } from 'lucide-react';

export const FineManagement = () => {
  const toast = useToast();
  const [fines, setFines] = useState(MOCK_FINES);
  const [selectedFine, setSelectedFine] = useState(null);
  const [waiveDialog, setWaiveDialog] = useState(false);

  // Stats
  const collectedTotal = fines.filter(x => x.status === 'Paid').reduce((acc, curr) => acc + curr.paidAmount, 0);
  const pendingTotal = fines.filter(x => x.status === 'Unpaid').reduce((acc, curr) => acc + curr.totalFine, 0);
  const waivedTotal = fines.filter(x => x.status === 'Waived').reduce((acc, curr) => acc + curr.totalFine, 0);

  const handleCollect = (fine) => {
    setFines(prev => prev.map(f => f.id === fine.id ? { 
      ...f, 
      status: 'Paid', 
      paidAmount: f.totalFine,
      paymentDate: new Date().toISOString().split('T')[0]
    } : f));
    toast.success(`Collected fine payment of ${formatCurrency(fine.totalFine)} from ${fine.memberName}.`);
  };

  const handleWaiveClick = (fine) => {
    setSelectedFine(fine);
    setWaiveDialog(true);
  };

  const handleWaiveConfirm = (reason) => {
    setFines(prev => prev.map(f => f.id === selectedFine.id ? {
      ...f,
      status: 'Waived',
      waiveReason: reason
    } : f));
    toast.success(`Waived outstanding fine for ${selectedFine.memberName}.`);
    setWaiveDialog(false);
    setSelectedFine(null);
  };

  const columns = [
    { title: 'Fine ID', key: 'id', sortable: true },
    { title: 'Borrower', key: 'memberName', sortable: true },
    { title: 'Book Title', key: 'bookTitle' },
    { title: 'Type', key: 'fineType' },
    { title: 'Overdue (Days)', key: 'daysOverdue' },
    { title: 'Fine Amount', key: 'totalFine', render: (val) => formatCurrency(val) },
    { title: 'Status', key: 'status', render: (val) => (
        <Badge variant={val === 'Paid' ? 'success' : val === 'Unpaid' ? 'danger' : 'warning'}>
          {val}
        </Badge>
      )
    },
    { title: 'Actions', key: 'actions', render: (_, row) => (
        <div className="flex gap-2">
          {row.status === 'Unpaid' && (
            <>
              <button
                onClick={() => handleCollect(row)}
                className="h-8 px-3 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-1 transition-all duration-150"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Collect</span>
              </button>
              <button
                onClick={() => handleWaiveClick(row)}
                className="h-8 px-3 text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/20 dark:hover:bg-rose-900/30 dark:text-rose-450 border border-rose-200 dark:border-rose-900/30 rounded-lg transition-all duration-150"
              >
                <span>Waive</span>
              </button>
            </>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fine Ledger Desk"
        subtitle="Settle or waive overdue library fee accounts and print deposit slips."
      />

      {/* Fine stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Fines Collected" value={formatCurrency(collectedTotal)} icon={ShieldCheck} />
        <StatCard title="Total Outstanding Pending" value={formatCurrency(pendingTotal)} icon={Coins} />
        <StatCard title="Total Fines Waived" value={formatCurrency(waivedTotal)} icon={Receipt} />
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6">
        <DataTable
          columns={columns}
          data={fines}
          searchPlaceholder="Search fine logs by member or book..."
          searchKeys={['memberName', 'bookTitle', 'id']}
          csvFilename="library_fine_ledgers.csv"
        />
      </div>

      {/* Waive Confirm Reason dialog */}
      {selectedFine && (
        <ConfirmDialog
          isOpen={waiveDialog}
          onClose={() => {
            setWaiveDialog(false);
            setSelectedFine(null);
          }}
          onConfirm={handleWaiveConfirm}
          title="Waive Fine Authorization"
          message={`Confirm waiving fine of ${formatCurrency(selectedFine.totalFine)} for ${selectedFine.memberName}? A mandatory audit waiver reason must be entered below.`}
          confirmText="Waive Fine"
          variant="danger"
          requireInput={true}
          inputPlaceholder="e.g. Student justified absence with medical documentation..."
          inputLabel="Waiver Audit Reason"
        />
      )}
    </div>
  );
};
