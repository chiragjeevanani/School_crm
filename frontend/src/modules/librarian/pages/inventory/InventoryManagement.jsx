import React, { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { MOCK_BOOKS } from '../../utils/constants';
import { Warehouse, Plus, Settings2, ShieldCheck } from 'lucide-react';

export const InventoryManagement = () => {
  const toast = useToast();
  const [books, setBooks] = useState(MOCK_BOOKS);
  const [selectedBook, setSelectedBook] = useState(null);
  const [adjustmentModal, setAdjustmentModal] = useState(false);
  const [adjustQty, setAdjustQty] = useState(0);
  const [reason, setReason] = useState('Stock verification');

  const handleAdjustClick = (book) => {
    setSelectedBook(book);
    setAdjustQty(book.totalCopies);
    setAdjustmentModal(true);
  };

  const handleSaveAdjustment = () => {
    if (adjustQty <= 0) {
      toast.error('Stock copies must be greater than 0.');
      return;
    }

    setBooks(prev => prev.map(b => {
      if (b.id === selectedBook.id) {
        // Recalc available copies by maintaining the gap/issued count
        const issuedCount = b.totalCopies - b.availableCopies;
        const newAvailable = Math.max(adjustQty - issuedCount, 0);
        return {
          ...b,
          totalCopies: adjustQty,
          availableCopies: newAvailable
        };
      }
      return b;
    }));

    toast.success(`Inventory stock adjusted for "${selectedBook.title}"`);
    setAdjustmentModal(false);
    setSelectedBook(null);
  };

  const columns = [
    { title: 'Book Code', key: 'bookCode', sortable: true },
    { title: 'Title', key: 'title', sortable: true },
    { title: 'Supplier', key: 'supplier' },
    { title: 'Total Copies', key: 'totalCopies', sortable: true },
    { title: 'Available', key: 'availableCopies', sortable: true },
    { title: 'Status', key: 'status', render: (_, row) => (
        <Badge variant={row.availableCopies > 0 ? 'success' : 'danger'}>
          {row.availableCopies > 0 ? 'In Stock' : 'Out of Stock'}
        </Badge>
      )
    },
    { title: 'Actions', key: 'actions', render: (_, row) => (
        <button
          onClick={() => handleAdjustClick(row)}
          className="h-8 px-3 text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-700 dark:bg-amber-950/20 dark:hover:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-900/30 rounded-lg flex items-center gap-1.5 transition-colors"
        >
          <Settings2 className="h-3.5 w-3.5" />
          <span>Adjust Stock</span>
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory Tracking"
        subtitle="Perform physical audits, supplier logging, and stock adjustments."
      />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6">
        <DataTable
          columns={columns}
          data={books}
          searchPlaceholder="Search by book code, title, or supplier..."
          searchKeys={['bookCode', 'title', 'supplier']}
          csvFilename="library_inventory_audit.csv"
        />
      </div>

      {/* Adjust Stock Modal */}
      <Modal
        isOpen={adjustmentModal}
        onClose={() => setAdjustmentModal(false)}
        title="Adjust Inventory Stock"
        size="md"
      >
        {selectedBook && (
          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">Book Selected</p>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">{selectedBook.title}</h4>
              <p className="text-3xs text-slate-400 font-mono mt-0.5">{selectedBook.bookCode} | Current Total: {selectedBook.totalCopies}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-2xs font-bold text-slate-550 dark:text-slate-450">Set New Total Copies <span className="text-rose-500">*</span></label>
                <input
                  type="number"
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(Number(e.target.value))}
                  className="w-full h-10 px-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  min="1"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-2xs font-bold text-slate-550 dark:text-slate-450">Reason for Adjustment</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full h-10 px-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="Stock verification">Stock verification</option>
                  <option value="Damage / Loss write-off">Damage / Loss write-off</option>
                  <option value="New Copies Acquired">New Copies Acquired</option>
                  <option value="Data entry fix">Data entry fix</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-850">
              <button
                onClick={() => setAdjustmentModal(false)}
                className="h-10 px-4 text-sm font-semibold border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAdjustment}
                className="h-10 px-4 text-sm font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-xs flex items-center gap-1.5"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>Confirm Adjustment</span>
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
