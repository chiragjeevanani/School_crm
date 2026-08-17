import React, { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { ReturnReceipt } from '../../components/ui/ReturnReceipt';
import { useToast } from '../../components/ui/Toast';
import { useAppStore } from '../../../../shared/store/useAppStore';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { Undo, ShieldCheck, AlertCircle, RefreshCw } from 'lucide-react';

export const BookReturn = () => {
  const toast = useToast();
  const { store, returnBook } = useAppStore();
  const loans = (store.bookLoans || []).filter(l => l.status === 'Issued');

  const [selectedLoan, setSelectedLoan] = useState(null);
  const [condition, setCondition] = useState('Good');
  const [fine, setFine] = useState(0);
  const [createdReceipt, setCreatedReceipt] = useState(null);
  const [receiptOpen, setReceiptOpen] = useState(false);

  const handleProcessReturn = (loan) => {
    setSelectedLoan(loan);
    setFine(loan.fineAmount || 0);
  };

  const handleConfirmReturn = () => {
    if (!selectedLoan) return;

    returnBook(selectedLoan.id, fine, condition, 'Mrs. Nalini Sengupta (Librarian)');

    const receipt = {
      ...selectedLoan,
      returnDate: new Date().toISOString().split('T')[0],
      fineAmount: fine,
      condition
    };

    setCreatedReceipt(receipt);
    setSelectedLoan(null);
    toast.success(`Book "${selectedLoan.bookTitle}" returned to circulation shelf! Catalog inventory incremented.`);
    setReceiptOpen(true);
  };

  const columns = [
    { title: 'Loan ID', key: 'id', sortable: true },
    { title: 'Book Title', key: 'bookTitle', sortable: true },
    { title: 'Borrower', key: 'studentName', sortable: true },
    { title: 'Issue Date', key: 'issueDate', render: (val) => formatDate(val) },
    { title: 'Due Date', key: 'dueDate', render: (val) => formatDate(val) },
    { title: 'Fine Accrued', key: 'fineAmount', render: (val) => (
        <span className={val > 0 ? 'text-rose-600 font-bold' : 'text-slate-400'}>
          {formatCurrency(val || 0)}
        </span>
      )
    },
    { title: 'Status', key: 'status', render: (val) => (
        <Badge variant={val === 'Issued' ? 'warning' : 'success'}>
          {val}
        </Badge>
      )
    },
    { title: 'Actions', key: 'actions', render: (_, row) => (
        <button
          onClick={() => handleProcessReturn(row)}
          className="h-8 px-3 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-1 transition-all"
        >
          <Undo className="h-3.5 w-3.5" />
          <span>Check In</span>
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Return Book Desk"
        subtitle="Process returned book check-ins, restore shelf inventory, and record late return fines."
      />

      <div className="bg-white dark:bg-slate-900 border border-border rounded-3xl p-6 shadow-sm">
        <DataTable
          columns={columns}
          data={loans}
          searchPlaceholder="Search active circulation loans..."
        />
      </div>

      {/* CHECK-IN MODAL */}
      <Modal isOpen={!!selectedLoan} onClose={() => setSelectedLoan(null)} title="Process Book Check-In">
        {selectedLoan && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-border text-xs space-y-1">
              <span className="font-bold block text-sm">{selectedLoan.bookTitle}</span>
              <p className="text-slate-400">Borrower: {selectedLoan.studentName} ({selectedLoan.studentId})</p>
              <p className="text-slate-400">Due Date: {selectedLoan.dueDate}</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Book Condition</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full px-3 py-2 text-xs border rounded-xl bg-slate-50 dark:bg-slate-900 border-border text-foreground"
              >
                <option value="Good">Good / Undamaged</option>
                <option value="Minor Wear">Minor Wear & Tear</option>
                <option value="Damaged">Damaged (Requires Repair Fee)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Late / Damage Fine (INR)</label>
              <input
                type="number"
                min="0"
                value={fine}
                onChange={(e) => setFine(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-bold border rounded-xl bg-slate-50 dark:bg-slate-900 border-border text-foreground"
              />
            </div>

            <button
              onClick={handleConfirmReturn}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-95"
            >
              Complete Check-In & Restock Item
            </button>
          </div>
        )}
      </Modal>

      {/* RECEIPT MODAL */}
      <Modal isOpen={receiptOpen} onClose={() => setReceiptOpen(false)} title="Circulation Return Slip">
        {createdReceipt && (
          <div className="space-y-4">
            <ReturnReceipt receiptData={createdReceipt} />
            <button
              onClick={() => setReceiptOpen(false)}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-xs font-bold rounded-xl"
            >
              Done
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};
export default BookReturn;
