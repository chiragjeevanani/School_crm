import React, { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Tabs } from '../../components/ui/Tabs';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { BarChart } from '../../components/ui/Charts/BarChart';
import { useToast } from '../../components/ui/Toast';
import { MOCK_FEE_COLLECTION } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';
import { 
  Plus, 
  CreditCard, 
  Printer, 
  Undo,
  Receipt,
  Wallet,
  TrendingUp
} from 'lucide-react';

const COLLECTION_CHARTS = [
  { term: 'Term 1', collection: 420000 },
  { term: 'Term 2', collection: 540000 },
  { term: 'Term 3', collection: 380000 },
  { term: 'Term 4', collection: 620000 }
];

export const FeeManagement = () => {
  const [activeTab, setActiveTab] = useState('collect');
  const { showToast, ToastComponent } = useToast();

  const [feeCollection, setFeeCollection] = useState(MOCK_FEE_COLLECTION);
  const [feeCategories, setFeeCategories] = useState([
    { id: '1', name: 'Tuition Fee (Class 10)', amount: 60000, schedule: 'Quarterly', discountRules: 'Sibling (10%), Merit (25%)' },
    { id: '2', name: 'Transport Fee (Route A)', amount: 15000, schedule: 'Term-wise', discountRules: 'None' },
    { id: '3', name: 'Hostel Fee (Standard Room)', amount: 80000, schedule: 'Annual', discountRules: 'Merit (10%)' },
    { id: '4', name: 'Science Lab Deposit', amount: 5000, schedule: 'One-time', discountRules: 'None' }
  ]);

  const [refunds, setRefunds] = useState([
    { id: '1', studentName: 'Ishita Reddy', category: 'Tuition Fee', amount: 12000, date: '2026-07-14', reason: 'Transfer out', status: 'Approved' }
  ]);

  // Modals
  const [collectModalOpen, setCollectModalOpen] = useState(false);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);

  const [paymentData, setPaymentData] = useState({
    studentName: '',
    class: '10',
    amount: 15000,
    category: 'Tuition Fee',
    method: 'UPI'
  });

  const handleRegisterFee = (e) => {
    e.preventDefault();
    const mockId = Date.now().toString();
    const newPayment = {
      id: mockId,
      receiptNo: `REC-2026-${mockId.slice(-3)}`,
      studentName: paymentData.studentName,
      class: paymentData.class,
      date: new Date().toISOString().split('T')[0],
      amount: Number(paymentData.amount),
      category: paymentData.category,
      status: 'Paid',
      method: paymentData.method
    };

    setFeeCollection(prev => [newPayment, ...prev]);
    setCollectModalOpen(false);
    showToast('Fee payment registered successfully!', 'success');
  };

  const handleRefund = (row) => {
    setFeeCollection(prev => prev.map(f => f.id === row.id ? { ...f, status: 'Refunded' } : f));
    setRefunds(prev => [...prev, {
      id: Date.now().toString(),
      studentName: row.studentName,
      category: row.category,
      amount: row.amount,
      date: new Date().toISOString().split('T')[0],
      reason: 'Refund requested',
      status: 'Approved'
    }]);
    showToast('Refund initiated successfully!', 'success');
  };

  // Columns Definitions
  const collectColumns = [
    { header: 'Receipt No', key: 'receiptNo', render: (val) => <span className="font-bold text-indigo-650 dark:text-indigo-400">{val}</span> },
    { header: 'Student Name', key: 'studentName' },
    { header: 'Class', key: 'class', render: (val) => `Class ${val}` },
    { header: 'Fee Category', key: 'category' },
    { header: 'Payment Date', key: 'date' },
    { header: 'Paid Amount', key: 'amount', render: (val) => <span className="font-bold">{formatCurrency(val)}</span> },
    { header: 'Method', key: 'method' },
    { header: 'Status', key: 'status', render: (val) => (
      <Badge variant={val === 'Paid' ? 'success' : val === 'Refunded' ? 'warning' : 'danger'}>{val}</Badge>
    )},
    {
      header: 'Actions',
      key: 'actions',
      render: (_, row) => (
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => {
              setSelectedFee(row);
              setReceiptModalOpen(true);
            }}
            title="Print Receipt"
            className="p-1 hover:bg-slate-100 rounded text-slate-500"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>
          {row.status === 'Paid' && (
            <button
              onClick={() => handleRefund(row)}
              title="Issue Refund"
              className="p-1 hover:bg-slate-100 rounded text-rose-500"
            >
              <Undo className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )
    }
  ];

  const categoryColumns = [
    { header: 'Category Name', key: 'name' },
    { header: 'Yearly Cost', key: 'amount', render: (val) => <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(val)}</span> },
    { header: 'Collection Cycle', key: 'schedule', render: (val) => <Badge variant="primary">{val}</Badge> },
    { header: 'Rules & Waivers', key: 'discountRules' }
  ];

  const refundColumns = [
    { header: 'Student', key: 'studentName' },
    { header: 'Category', key: 'category' },
    { header: 'Refunded Sum', key: 'amount', render: (val) => <span className="font-bold text-rose-650">{formatCurrency(val)}</span> },
    { header: 'Refund Date', key: 'date' },
    { header: 'Refund Reason', key: 'reason' },
    { header: 'Status', key: 'status', render: (val) => <Badge variant="success">{val}</Badge> }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Fee & Finance Management" 
        subtitle="Manage academic billing configurations, invoice collections, fee waivers, and refunds."
        actions={
          <>
            <button
              onClick={() => setActiveTab('categories')}
              className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold rounded-xl"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>Billing Structure Setup</span>
            </button>
            <button
              onClick={() => setCollectModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Collect Fee Payment</span>
            </button>
          </>
        }
      />

      <Tabs 
        tabs={[
          { id: 'collect', label: 'Payment Registry Logs', count: feeCollection.length },
          { id: 'categories', label: 'Fee Categories & Costs', count: feeCategories.length },
          { id: 'refunds', label: 'Refund Registry Logs', count: refunds.length },
          { id: 'financials', label: 'Collection Charts' }
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        {activeTab === 'collect' && <DataTable columns={collectColumns} data={feeCollection} />}
        {activeTab === 'categories' && <DataTable columns={categoryColumns} data={feeCategories} />}
        {activeTab === 'refunds' && <DataTable columns={refundColumns} data={refunds} />}
        {activeTab === 'financials' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl">
                <span className="text-[10px] uppercase font-bold text-slate-450">Total Projected Fee Billings</span>
                <span className="block text-xl font-extrabold mt-1">{formatCurrency(5400000)}</span>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl">
                <span className="text-[10px] uppercase font-bold text-slate-450">Total Realized Collection</span>
                <span className="block text-xl font-extrabold mt-1 text-emerald-600">{formatCurrency(5055000)}</span>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl">
                <span className="text-[10px] uppercase font-bold text-slate-450">Total Outstanding Fees</span>
                <span className="block text-xl font-extrabold mt-1 text-rose-650">{formatCurrency(345000)}</span>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Quarterly Fee Realization Chart</h4>
              <BarChart data={COLLECTION_CHARTS} xKey="term" yKey="collection" barColor="#f59e0b" />
            </div>
          </div>
        )}
      </div>

      {/* COLLECT FEE MODAL */}
      <Modal isOpen={collectModalOpen} onClose={() => setCollectModalOpen(false)} title="Register Fee Collection Invoice">
        <form onSubmit={handleRegisterFee} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400">Student Name</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Diya Patel" 
              value={paymentData.studentName} 
              onChange={(e) => setPaymentData({...paymentData, studentName: e.target.value})} 
              className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400">Class</label>
              <select
                value={paymentData.class}
                onChange={(e) => setPaymentData({...paymentData, class: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border focus:outline-none"
              >
                <option value="10">Class 10</option>
                <option value="9">Class 9</option>
                <option value="8">Class 8</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400">Fee Category</label>
              <select
                value={paymentData.category}
                onChange={(e) => setPaymentData({...paymentData, category: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border focus:outline-none"
              >
                {feeCategories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400">Payment Sum (₹)</label>
              <input 
                type="number" 
                required
                value={paymentData.amount} 
                onChange={(e) => setPaymentData({...paymentData, amount: Number(e.target.value)})} 
                className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400">Payment Gateway Method</label>
              <select
                value={paymentData.method}
                onChange={(e) => setPaymentData({...paymentData, method: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border focus:outline-none"
              >
                <option value="UPI">UPI / Scan QR</option>
                <option value="Cash">Cash Handover</option>
                <option value="Card">Credit/Debit Card</option>
                <option value="Net Banking">Net Banking</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={() => setCollectModalOpen(false)} className="px-4 py-2 text-xs font-semibold rounded-xl hover:bg-slate-100">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl">Register Payment</button>
          </div>
        </form>
      </Modal>

      {/* PRINT RECEIPT MODAL */}
      <Modal isOpen={receiptModalOpen} onClose={() => setReceiptModalOpen(false)} title="Print Fee Invoice Receipt">
        {selectedFee && (
          <div className="flex flex-col items-center space-y-6">
            <div className="w-full bg-slate-50 dark:bg-slate-950 border p-6 rounded-2xl text-xs font-semibold space-y-4">
              {/* Branding header */}
              <div className="text-center pb-4 border-b border-dashed">
                <h3 className="text-sm font-black uppercase text-slate-800 dark:text-white">Greenfield School</h3>
                <p className="text-[10px] text-slate-450 mt-0.5">Dwarka, Sector 4, New Delhi - 110075</p>
                <span className="text-[9px] bg-slate-100 dark:bg-slate-900 border font-extrabold uppercase px-2 py-0.5 mt-2 inline-block rounded">Fee Receipt</span>
              </div>

              {/* Information body grid */}
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-dashed">
                <div>
                  <span className="text-[10px] text-slate-450 block uppercase">Receipt Number</span>
                  <span className="text-slate-800 dark:text-white font-bold block mt-0.5">{selectedFee.receiptNo}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-450 block uppercase">Billing Date</span>
                  <span className="text-slate-800 dark:text-white font-bold block mt-0.5">{selectedFee.date}</span>
                </div>
                <div className="mt-2">
                  <span className="text-[10px] text-slate-450 block uppercase">Student Name</span>
                  <span className="text-slate-800 dark:text-white font-bold block mt-0.5">{selectedFee.studentName}</span>
                </div>
                <div className="mt-2">
                  <span className="text-[10px] text-slate-450 block uppercase">Class Room</span>
                  <span className="text-slate-800 dark:text-white font-bold block mt-0.5">Class {selectedFee.class}</span>
                </div>
              </div>

              {/* Cost summary table */}
              <div className="space-y-2">
                <div className="flex justify-between font-bold text-slate-800 dark:text-white">
                  <span>Description (Category)</span>
                  <span>Charged Sum</span>
                </div>
                <div className="flex justify-between text-slate-655 dark:text-slate-350 pb-2 border-b">
                  <span>{selectedFee.category}</span>
                  <span>{formatCurrency(selectedFee.amount)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-indigo-650 pt-2">
                  <span>Total Amount Paid ({selectedFee.method})</span>
                  <span>{formatCurrency(selectedFee.amount)}</span>
                </div>
              </div>

              {/* Status footer stamp */}
              <div className="flex items-center justify-center p-2.5 bg-emerald-500/10 text-emerald-600 font-extrabold tracking-widest text-center uppercase border border-dashed border-emerald-500/20 rounded-xl mt-4">
                <span>INVOICE PAID IN FULL</span>
              </div>
            </div>

            <button 
              onClick={() => showToast('Connecting to System Printer Hub...', 'info')}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Receipt Invoice</span>
            </button>
          </div>
        )}
      </Modal>

      <ToastComponent />
    </div>
  );
};
export default FeeManagement;
