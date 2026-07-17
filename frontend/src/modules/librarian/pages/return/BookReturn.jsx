import React, { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { ReturnReceipt } from '../../components/ui/ReturnReceipt';
import { useToast } from '../../components/ui/Toast';
import { MOCK_ISSUES } from '../../utils/constants';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { Undo, ShieldCheck, AlertCircle, RefreshCw } from 'lucide-react';

export const BookReturn = () => {
  const toast = useToast();
  const [issues, setIssues] = useState(MOCK_ISSUES.filter(x => !x.returnDate));
  const [selectedIssue, setSelectedIssue] = useState(null);
  
  const [condition, setCondition] = useState('Good');
  const [waiveConfirmOpen, setWaiveConfirmOpen] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [createdReceipt, setCreatedReceipt] = useState(null);

  // Return Processing
  const handleProcessReturn = (issue) => {
    setSelectedIssue(issue);
  };

  // Waiver confirm
  const handleWaiveConfirm = (reason) => {
    const finalReceipt = {
      ...selectedIssue,
      returnDate: new Date().toISOString().split('T')[0],
      fineAmount: selectedIssue.fineAmount,
      waiveReason: reason
    };

    // Remove from active issues list
    setIssues(prev => prev.filter(x => x.id !== selectedIssue.id));
    setCreatedReceipt(finalReceipt);
    setSelectedIssue(null);
    toast.success('Book returned (Fine Waived).');
    setReceiptOpen(true);
  };

  // Standard collection
  const handleCollectAndReturn = () => {
    const finalReceipt = {
      ...selectedIssue,
      returnDate: new Date().toISOString().split('T')[0],
      fineAmount: selectedIssue.fineAmount,
      waiveReason: ''
    };

    setIssues(prev => prev.filter(x => x.id !== selectedIssue.id));
    setCreatedReceipt(finalReceipt);
    setSelectedIssue(null);
    toast.success('Book returned (Fine Collected).');
    setReceiptOpen(true);
  };

  const columns = [
    { title: 'Slip ID', key: 'id', sortable: true },
    { title: 'Book Code', key: 'bookCode', sortable: true },
    { title: 'Book Title', key: 'bookTitle', sortable: true },
    { title: 'Borrower', key: 'memberName', sortable: true },
    { title: 'Issue Date', key: 'issueDate', render: (val) => formatDate(val) },
    { title: 'Due Date', key: 'dueDate', render: (val) => formatDate(val) },
    { title: 'Fine Accrued', key: 'fineAmount', render: (val, row) => (
        <span className={row.status === 'Overdue' ? 'text-rose-600 dark:text-rose-450 font-bold' : ''}>
          {formatCurrency(val)}
        </span>
      )
    },
    { title: 'Status', key: 'status', render: (val) => (
        <Badge variant={val === 'Overdue' ? 'danger' : 'warning'}>
          {val}
        </Badge>
      )
    },
    { title: 'Actions', key: 'actions', render: (_, row) => (
        <button
          onClick={() => handleProcessReturn(row)}
          className="h-8 px-3 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-lg flex items-center gap-1 transition-all duration-150"
        >
          <Undo className="h-3.5 w-3.5" />
          <span>Return</span>
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Return Book Desk"
        subtitle="Manage returned check-ins, assess damage conditions, and process late return fines."
      />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6">
        <DataTable
          columns={columns}
          data={issues}
          searchPlaceholder="Search active issues by title, borrower name or code..."
          searchKeys={['bookTitle', 'memberName', 'bookCode', 'memberId']}
          csvFilename="library_active_loans.csv"
        />
      </div>

      {/* Return process assessment modal */}
      <Modal
        isOpen={!!selectedIssue}
        onClose={() => setSelectedIssue(null)}
        title="Check-In Book Details"
        size="md"
      >
        {selectedIssue && (
          <div className="space-y-5">
            {/* Summary details */}
            <div className="bg-slate-50 dark:bg-slate-950 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1">
              <span className="text-4xs font-bold text-slate-400 uppercase tracking-widest block">Book Title</span>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{selectedIssue.bookTitle}</h4>
              <p className="text-3xs text-slate-450 font-mono mt-0.5">{selectedIssue.bookCode} | Borrower: {selectedIssue.memberName}</p>
            </div>

            {/* Assessment Condition */}
            <div className="space-y-1.5">
              <label className="text-2xs font-bold text-slate-550 dark:text-slate-450">Assess Book Condition</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full h-10 px-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="Good">Good / Perfect</option>
                <option value="Minor Damage">Minor Damage (Torn pages/pencil marks)</option>
                <option value="Major Damage">Major Damage (Requires binder replacement)</option>
                <option value="Lost">Lost Catalog</option>
              </select>
            </div>

            {/* Fine Display overlay */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-4xs font-bold text-slate-400 uppercase tracking-widest block">Accrued Late Fine</span>
                  <span className="text-lg font-black text-slate-800 dark:text-slate-200 mt-1 block">
                    {formatCurrency(selectedIssue.fineAmount || 0)}
                  </span>
                </div>
                {selectedIssue.fineAmount > 0 && (
                  <Badge variant="danger" className="animate-pulse">
                    Overdue
                  </Badge>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-850">
              <button
                onClick={() => setSelectedIssue(null)}
                className="h-10 px-4 text-sm font-semibold border border-slate-205 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-xl"
              >
                Cancel
              </button>
              
              <div className="flex gap-2">
                {selectedIssue.fineAmount > 0 && (
                  <button
                    onClick={() => setWaiveConfirmOpen(true)}
                    className="h-10 px-4 text-sm font-semibold border border-rose-200 hover:bg-rose-50 text-rose-700 dark:border-rose-900/30 dark:hover:bg-rose-950/20 rounded-xl"
                  >
                    Waive Fine
                  </button>
                )}
                <button
                  onClick={handleCollectAndReturn}
                  className="h-10 px-4 text-sm font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <ShieldCheck className="h-4.5 w-4.5" />
                  <span>{selectedIssue.fineAmount > 0 ? 'Collect & Return' : 'Complete Return'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Waive Fine mandatory reason input dialog */}
      <ConfirmDialog
        isOpen={waiveConfirmOpen}
        onClose={() => setWaiveConfirmOpen(false)}
        onConfirm={handleWaiveConfirm}
        title="Waive Fine Authorization"
        message="Are you sure you want to waive this overdue late fee? A mandatory audit reason must be supplied below."
        confirmText="Waive & Return"
        variant="danger"
        requireInput={true}
        inputPlaceholder="e.g. Approved by Principal due to medical leave justification..."
        inputLabel="Waiver Audit Reason"
      />

      {/* Printable Receipt Modal */}
      {createdReceipt && (
        <Modal
          isOpen={receiptOpen}
          onClose={() => {
            setReceiptOpen(false);
            setCreatedReceipt(null);
          }}
          title="Return Check-in Complete"
          size="md"
        >
          <ReturnReceipt
            returnRecord={createdReceipt}
            onClose={() => {
              setReceiptOpen(false);
              setCreatedReceipt(null);
            }}
          />
        </Modal>
      )}
    </div>
  );
};
