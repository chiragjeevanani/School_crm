import React, { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { DataTable } from '../../components/ui/DataTable';
import { ReceiptCard } from '../../components/ui/ReceiptCard';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../components/ui/Toast';
import { MOCK_COLLECTIONS } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';
import { Printer, Download, Eye, Layers } from 'lucide-react';

export const ReceiptManagement = () => {
  const { showToast, ToastComponent } = useToast();
  const [collections, setCollections] = useState(MOCK_COLLECTIONS);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const handleReprintReceipt = (e, row) => {
    e.stopPropagation();
    setSelectedReceipt(row);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  const handleDuplicateReceipt = (e, row) => {
    e.stopPropagation();
    const newDuplicate = {
      ...row,
      id: `${row.id}-DUP`,
      transactionRef: `${row.transactionRef}-DUP`,
      status: 'Paid',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setCollections([newDuplicate, ...collections]);
    showToast(`Duplicate receipt copy generated: ${newDuplicate.id}`, 'success');
  };

  const handleBulkReceiptDownload = () => {
    showToast('Mock PDF generation complete! Downloading bulk class-wise receipts package...', 'success');
  };

  const columns = [
    { key: 'id', title: 'Receipt ID', sortable: true },
    { key: 'studentName', title: 'Student Name', sortable: true },
    { key: 'class', title: 'Class' },
    { key: 'paymentDate', title: 'Payment Date', sortable: true },
    { 
      key: 'paidAmount', 
      title: 'Paid Amount', 
      sortable: true,
      render: (val) => <span className="font-bold text-emerald-600">{formatCurrency(val)}</span>
    },
    { key: 'paymentMethod', title: 'Channel' },
    { 
      key: 'status', 
      title: 'Status',
      render: (val) => (
        <Badge variant={val === 'Paid' ? 'success' : 'warning'}>
          {val}
        </Badge>
      )
    },
    { 
      key: 'actions', 
      title: 'Desk Actions',
      render: (_, row) => (
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setSelectedReceipt(row)}
            className="p-1.5 bg-slate-50 dark:bg-slate-950 border hover:bg-slate-100 rounded-lg text-slate-500"
            title="View Receipt"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => handleReprintReceipt(e, row)}
            className="p-1.5 bg-slate-50 dark:bg-slate-955 border hover:bg-slate-105 rounded-lg text-slate-500"
            title="Reprint Receipt"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => handleDuplicateReceipt(e, row)}
            className="px-2 py-1 bg-violet-600 hover:bg-violet-750 text-white font-bold rounded-lg text-[9px]"
            title="Duplicate Copy"
          >
            Duplicate
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Receipt Management" 
        subtitle="Access paid transactions records history, verify unique receipt numbers, and print duplicate receipts." 
        actions={
          <button
            onClick={handleBulkReceiptDownload}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Generate Bulk Receipts</span>
          </button>
        }
      />

      <DataTable 
        columns={columns} 
        data={collections} 
        searchPlaceholder="Search receipts by student name..."
        searchKey="studentName"
        onRowClick={(row) => setSelectedReceipt(row)}
        filterOptions={[
          {
            key: 'paymentMethod',
            label: 'Method',
            options: [
              { value: 'UPI', label: 'UPI' },
              { value: 'Cash', label: 'Cash' },
              { value: 'Net Banking', label: 'Net Banking' },
              { value: 'Credit Card', label: 'Credit Card' }
            ]
          }
        ]}
      />

      {/* View Receipt Card Modal */}
      {selectedReceipt && (
        <Modal 
          isOpen={true} 
          onClose={() => setSelectedReceipt(null)} 
          title="Electronic Transaction Invoice Copy"
          size="lg"
        >
          <ReceiptCard 
            receipt={selectedReceipt} 
            onSendEmail={() => showToast('Receipt copy emailed to guardian inbox.', 'success')}
            onSendSms={() => showToast('SMS confirmation receipt dispatched.', 'success')}
          />
        </Modal>
      )}

      <ToastComponent />
    </div>
  );
};
export default ReceiptManagement;
