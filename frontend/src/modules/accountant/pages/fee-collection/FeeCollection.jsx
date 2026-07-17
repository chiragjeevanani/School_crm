import React, { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { DataTable } from '../../components/ui/DataTable';
import { AmountCalculator } from '../../components/ui/AmountCalculator';
import { ReceiptCard } from '../../components/ui/ReceiptCard';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { Badge } from '../../components/ui/Badge';
import { MOCK_STUDENTS } from '../../utils/constants';
import { Coins, Search, ArrowLeft, CheckCircle } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const FeeCollection = () => {
  const [step, setStep] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const { showToast, ToastComponent } = useToast();

  // Calculator Outputs
  const [calculatorData, setCalculatorData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [transactionRef, setTransactionRef] = useState('');

  // Generated Receipt Modal
  const [generatedReceipt, setGeneratedReceipt] = useState(null);

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    setStep(2);
  };

  const handleConfirmCollection = (e) => {
    e.preventDefault();
    if (!calculatorData) return;

    // Mock receipt model matching backend plan
    const mockReceipt = {
      id: `RCT-2026-00${Math.floor(Math.random() * 900) + 100}`,
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      class: selectedStudent.class,
      section: selectedStudent.section,
      admissionNo: selectedStudent.admissionNo,
      schoolId: 'SCH-2026-09',
      academicSession: '2026-2027',
      paymentDate: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      totalAmount: calculatorData.netPayable,
      paidAmount: calculatorData.amountPaid,
      discountAmount: calculatorData.discountAmount,
      scholarshipAmount: calculatorData.scholarshipAmount,
      lateFine: calculatorData.lateFine,
      remainingBalance: calculatorData.remainingBalance,
      paymentMethod: paymentMethod,
      transactionRef: transactionRef || `REF${Date.now().toString().slice(-8)}`,
      status: calculatorData.remainingBalance === 0 ? 'Paid' : 'Partial',
      feeHeads: calculatorData.feeHeads,
      createdBy: 'ACC-001'
    };

    setGeneratedReceipt(mockReceipt);
    showToast(`Fee transaction processed! Receipt #${mockReceipt.id} generated.`, 'success');
    
    // Reset collection state
    setStep(1);
    setSelectedStudent(null);
    setTransactionRef('');
  };

  const columns = [
    { key: 'admissionNo', title: 'Admn No', sortable: true },
    { key: 'name', title: 'Student Name', sortable: true },
    { key: 'class', title: 'Class' },
    { key: 'section', title: 'Sec' },
    { key: 'guardianName', title: 'Guardian' },
    { 
      key: 'pendingFees', 
      title: 'Outstanding Dues',
      render: (val) => (
        <span className={`font-bold ${val > 0 ? 'text-rose-600' : 'text-slate-500'}`}>
          {formatCurrency(val)}
        </span>
      )
    },
    { 
      key: 'status', 
      title: 'Status',
      render: (val) => (
        <Badge variant={val === 'Active' ? 'success' : 'danger'}>
          {val}
        </Badge>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Fee Collection Desk" 
        subtitle="Search student files, configure payment items, deduct concessions, and generate verified receipts." 
      />

      {step === 1 && (
        <div className="space-y-4">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Step 1: Search student ledger</span>
          <DataTable 
            columns={columns} 
            data={MOCK_STUDENTS} 
            searchPlaceholder="Search student by name or admission number..."
            searchKey="name"
            onRowClick={handleStudentSelect}
            filterOptions={[
              {
                key: 'class',
                label: 'Class',
                options: [
                  { value: '8', label: 'Class 8' },
                  { value: '9', label: 'Class 9' },
                  { value: '10', label: 'Class 10' },
                  { value: '11', label: 'Class 11' },
                  { value: '12', label: 'Class 12' }
                ]
              }
            ]}
          />
        </div>
      )}

      {step === 2 && selectedStudent && (
        <form onSubmit={handleConfirmCollection} className="space-y-6 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <button 
              type="button" 
              onClick={() => { setStep(1); setSelectedStudent(null); }}
              className="flex items-center gap-1 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-violet-600"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to search</span>
            </button>
            <span className="text-slate-400">|</span>
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Step 2: Live invoice configurations</span>
          </div>

          {/* Student Header Summary Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Currently Billing Student</span>
              <h3 className="text-sm font-black text-slate-900 dark:text-white mt-1">{selectedStudent.name}</h3>
              <p className="text-[10px] text-slate-400 mt-1">Admission No: {selectedStudent.admissionNo} • Class: {selectedStudent.class}-{selectedStudent.section} • Guardian: {selectedStudent.guardianName}</p>
            </div>
            <div className="text-left sm:text-right border-l pl-4 sm:border-l-0 sm:pl-0">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Pre-recorded Outstanding Balance</span>
              <h4 className="text-sm font-black text-rose-600 mt-1">{formatCurrency(selectedStudent.pendingFees)}</h4>
            </div>
          </div>

          {/* Inline Calculator */}
          <AmountCalculator onChange={setCalculatorData} />

          {/* Payment Method inputs */}
          <div className="bg-white dark:bg-slate-900 border rounded-2xl p-5 shadow-sm space-y-4">
            <span className="text-[10px] font-black uppercase text-slate-455 tracking-wider block border-b pb-2">Step 3: Collect payment details</span>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400">Payment Channel Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border focus:outline-none focus:ring-1 focus:ring-violet-600 cursor-pointer"
                >
                  <option value="UPI">UPI Payment</option>
                  <option value="Cash">Cash at Desk</option>
                  <option value="Cheque">Bank Cheque</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="Net Banking">Net Banking</option>
                  <option value="Bank Transfer">Direct Bank Transfer</option>
                </select>
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-[10px] text-slate-400">Transaction Reference Number / Check No</label>
                <input
                  type="text"
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                  placeholder="e.g. UPI20260717123456 or Bank receipt reference..."
                  required
                  className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border focus:outline-none focus:ring-1 focus:ring-violet-600"
                />
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-3 bg-violet-600 hover:bg-violet-750 text-white rounded-xl font-bold shadow-sm"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Confirm Dues & Collect Fees</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Generated Receipt Card Modal */}
      {generatedReceipt && (
        <Modal 
          isOpen={true} 
          onClose={() => setGeneratedReceipt(null)} 
          title="Electronic Transaction Invoice Copy"
          size="lg"
        >
          <ReceiptCard 
            receipt={generatedReceipt} 
            onSendEmail={() => showToast('Receipt copy emailed to guardian inbox.', 'success')}
            onSendSms={() => showToast('SMS confirmation receipt dispatched.', 'success')}
          />
        </Modal>
      )}

      <ToastComponent />
    </div>
  );
};
export default FeeCollection;
