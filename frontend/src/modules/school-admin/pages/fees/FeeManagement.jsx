import React, { useCallback, useEffect, useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Tabs } from '../../components/ui/Tabs';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { feePortalApi, schoolPortalApi } from '../../../../shared/api/client';
import { formatCurrency } from '../../utils/formatters';
import { FeeHeadsIndex } from './FeeHeadsIndex';
import { FeeStructuresIndex } from './FeeStructuresIndex';
import { 
  CreditCard, 
  DollarSign, 
  FileText, 
  Layers, 
  ListChecks, 
  Loader2, 
  Plus,
  Printer, 
  Receipt, 
  Wallet 
} from 'lucide-react';

const inputClass =
  'h-11 w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white';

export const FeeManagement = () => {
  const [activeTab, setActiveTab] = useState('structures');
  const { showToast, ToastComponent } = useToast();

  // Invoices & Payments State
  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loadingInvoices, setLoadingInvoices] = useState(false);
  const [loadingPayments, setLoadingPayments] = useState(false);

  // Pay Modal
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [paying, setPaying] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    paymentMethod: 'UPI',
    paymentReference: '',
    remarks: '',
  });

  // Receipt Modal
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  // Generate Invoice Modal
  const [generateModalOpen, setGenerateModalOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generateForm, setGenerateForm] = useState({
    studentId: '',
    periodLabel: 'Term 1 / Monthly Tuition',
    dueDate: '',
  });

  const loadInvoices = useCallback(async () => {
    setLoadingInvoices(true);
    try {
      const res = await feePortalApi.invoices({ limit: 50 });
      setInvoices(res.data || []);
    } catch (err) {
      showToast(err.message || 'Unable to load fee invoices', 'error');
    } finally {
      setLoadingInvoices(false);
    }
  }, [showToast]);

  const loadPayments = useCallback(async () => {
    setLoadingPayments(true);
    try {
      const res = await feePortalApi.payments({ limit: 50 });
      setPayments(res.data || []);
    } catch (err) {
      showToast(err.message || 'Unable to load payment records', 'error');
    } finally {
      setLoadingPayments(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (activeTab === 'invoices') loadInvoices();
    if (activeTab === 'payments') loadPayments();
  }, [activeTab, loadInvoices, loadPayments]);

  const handleOpenPayModal = (invoice) => {
    setSelectedInvoice(invoice);
    setPaymentForm({
      amount: invoice.balanceAmount,
      paymentMethod: 'UPI',
      paymentReference: '',
      remarks: '',
    });
    setPayModalOpen(true);
  };

  const handleOpenGenerateModal = async () => {
    setGenerateModalOpen(true);
    setLoadingStudents(true);
    try {
      const res = await schoolPortalApi.students({ status: 'ACTIVE', limit: 100 });
      setStudents(res.data || []);
      if (res.data?.length > 0) {
        setGenerateForm((prev) => ({ ...prev, studentId: res.data[0].id }));
      }
    } catch (err) {
      showToast(err.message || 'Unable to load students list', 'error');
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleGenerateInvoice = async (e) => {
    e.preventDefault();
    if (!generateForm.studentId) return;
    setGenerating(true);
    try {
      const studentRes = await schoolPortalApi.getStudent(generateForm.studentId);
      const student = studentRes.data;
      const enrollment = student?.currentEnrollment || student?.enrollment;

      if (!enrollment?.academicYearId || !enrollment?.classId) {
        throw new Error('Student has no active class enrollment');
      }

      // 1. Auto-assign student fees from class structure if not already assigned
      try {
        await feePortalApi.autoAssignStudentFees(student.id, {
          academicYearId: enrollment.academicYearId,
          classId: enrollment.classId,
          enrollmentId: enrollment.id || enrollment._id,
        });
      } catch (e) {
        // Ignore if already assigned
      }

      // 2. Generate invoice
      await feePortalApi.generateInvoice({
        studentId: student.id,
        enrollmentId: enrollment.id || enrollment._id,
        academicYearId: enrollment.academicYearId,
        periodLabel: generateForm.periodLabel,
        dueDate: generateForm.dueDate || undefined,
      });

      showToast('Fee invoice generated successfully!', 'success');
      setGenerateModalOpen(false);
      loadInvoices();
    } catch (err) {
      showToast(err.message || 'Failed to generate fee invoice', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    if (!selectedInvoice) return;
    setPaying(true);
    try {
      const res = await feePortalApi.payInvoice(selectedInvoice.id, {
        amount: Number(paymentForm.amount),
        paymentMethod: paymentForm.paymentMethod,
        paymentReference: paymentForm.paymentReference,
        remarks: paymentForm.remarks,
      });
      showToast('Fee payment recorded successfully!', 'success');
      setPayModalOpen(false);
      loadInvoices();
      setSelectedPayment(res.data);
      setReceiptModalOpen(true);
    } catch (err) {
      showToast(err.message || 'Payment recording failed', 'error');
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fee & Finance Management"
        subtitle="End-to-end fee system: Configure Fee Heads, Class Structures, Invoices, and Payment Collections."
      />

      <Tabs
        tabs={[
          { id: 'structures', label: 'Class Fee Structures', icon: Layers },
          { id: 'heads', label: 'Fee Heads Master', icon: ListChecks },
          { id: 'invoices', label: 'Student Invoices', icon: FileText, count: invoices.length },
          { id: 'payments', label: 'Payment Registry & Receipts', icon: Receipt, count: payments.length },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === 'structures' && <FeeStructuresIndex />}
      {activeTab === 'heads' && <FeeHeadsIndex />}

      {activeTab === 'invoices' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">Generated Student Invoices</h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleOpenGenerateModal}
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-primary/95"
              >
                <Plus className="h-3.5 w-3.5" /> Generate Invoice
              </button>
              <button
                type="button"
                onClick={loadInvoices}
                className="text-xs font-semibold text-primary hover:underline px-2"
              >
                Refresh
              </button>
            </div>
          </div>

          {loadingInvoices ? (
            <div className="flex min-h-[250px] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : invoices.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
              <FileText className="h-10 w-10 text-slate-400 mx-auto" />
              <p className="mt-3 text-sm font-bold text-slate-700 dark:text-slate-200">No fee invoices generated yet</p>
              <p className="mt-1 text-xs text-slate-400">
                Invoices will appear here once generated for enrolled students against their class fee structure.
              </p>
              <button
                type="button"
                onClick={handleOpenGenerateModal}
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm"
              >
                <Plus className="h-4 w-4" /> Generate First Invoice
              </button>
            </div>
          ) : (
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <table className="w-full text-xs">
                <thead className="border-b border-slate-100 bg-slate-50/70 text-slate-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
                  <tr>
                    {['Invoice #', 'Student Name', 'Period', 'Total (₹)', 'Paid (₹)', 'Balance (₹)', 'Due Date', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="px-4 py-3 text-center font-bold text-slate-500 dark:text-slate-400">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="border-b border-slate-50 dark:border-slate-850 hover:bg-slate-50/50 dark:hover:bg-slate-850/50">
                      <td className="px-4 py-3.5 text-center font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {inv.invoiceNumber}
                      </td>
                      <td className="px-4 py-3.5 text-center font-bold text-slate-800 dark:text-white">
                        {inv.studentId ? `${inv.studentId.firstName} ${inv.studentId.lastName || ''}`.trim() : '—'}
                      </td>
                      <td className="px-4 py-3.5 text-center font-semibold text-slate-600 dark:text-slate-400">
                        {inv.periodLabel}
                      </td>
                      <td className="px-4 py-3.5 text-center font-bold">{formatCurrency(inv.totalAmount)}</td>
                      <td className="px-4 py-3.5 text-center font-bold text-emerald-600">{formatCurrency(inv.paidAmount)}</td>
                      <td className="px-4 py-3.5 text-center font-bold text-rose-600">{formatCurrency(inv.balanceAmount)}</td>
                      <td className="px-4 py-3.5 text-center text-slate-500">
                        {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <Badge
                          variant={
                            inv.status === 'PAID'
                              ? 'success'
                              : inv.status === 'PARTIALLY_PAID'
                              ? 'warning'
                              : inv.status === 'OVERDUE'
                              ? 'danger'
                              : 'default'
                          }
                        >
                          {inv.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        {inv.status !== 'PAID' ? (
                          <button
                            type="button"
                            onClick={() => handleOpenPayModal(inv)}
                            className="inline-flex items-center gap-1 rounded-xl bg-primary px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-primary/90"
                          >
                            <CreditCard className="h-3 w-3" /> Collect
                          </button>
                        ) : (
                          <span className="text-xs font-bold text-emerald-600">Paid in Full</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">Fee Collection Receipts Registry</h3>
            <button
              type="button"
              onClick={loadPayments}
              className="text-xs font-semibold text-primary hover:underline"
            >
              Refresh
            </button>
          </div>

          {loadingPayments ? (
            <div className="flex min-h-[250px] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : payments.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
              <Receipt className="h-10 w-10 text-slate-400 mx-auto" />
              <p className="mt-3 text-sm font-bold text-slate-700 dark:text-slate-200">No payment receipts recorded yet</p>
              <p className="mt-1 text-xs text-slate-400">
                Payment transactions and printable receipts will appear here once collected.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <table className="w-full text-xs">
                <thead className="border-b border-slate-100 bg-slate-50/70 text-slate-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
                  <tr>
                    {['Receipt #', 'Student Name', 'Invoice #', 'Amount Paid (₹)', 'Method', 'Date', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="px-4 py-3 text-center font-bold text-slate-500 dark:text-slate-400">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p.id} className="border-b border-slate-50 dark:border-slate-850 hover:bg-slate-50/50 dark:hover:bg-slate-850/50">
                      <td className="px-4 py-3.5 text-center font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {p.receiptNumber}
                      </td>
                      <td className="px-4 py-3.5 text-center font-bold text-slate-800 dark:text-white">
                        {p.studentId ? `${p.studentId.firstName} ${p.studentId.lastName || ''}`.trim() : '—'}
                      </td>
                      <td className="px-4 py-3.5 text-center font-mono text-slate-600 dark:text-slate-400">
                        {p.invoiceId?.invoiceNumber || '—'}
                      </td>
                      <td className="px-4 py-3.5 text-center font-extrabold text-emerald-600">
                        {formatCurrency(p.amount)}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <Badge variant="primary">{p.paymentMethod}</Badge>
                      </td>
                      <td className="px-4 py-3.5 text-center text-slate-500">
                        {p.paymentDate ? new Date(p.paymentDate).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <Badge variant="success">{p.status}</Badge>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPayment(p);
                            setReceiptModalOpen(true);
                          }}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200"
                        >
                          <Printer className="h-3 w-3" /> Print
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Collect Payment Modal */}
      <Modal
        isOpen={payModalOpen}
        onClose={() => setPayModalOpen(false)}
        title="Collect Fee Payment"
      >
        {selectedInvoice && (
          <form onSubmit={handleRecordPayment} className="space-y-4">
            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Invoice #</span>
                  <span className="font-mono font-bold text-indigo-600">{selectedInvoice.invoiceNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Student</span>
                  <span className="font-bold text-slate-800 dark:text-white">
                    {selectedInvoice.studentId ? `${selectedInvoice.studentId.firstName} ${selectedInvoice.studentId.lastName || ''}`.trim() : '—'}
                  </span>
                </div>
                <div className="mt-2">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Amount</span>
                  <span className="font-bold">{formatCurrency(selectedInvoice.totalAmount)}</span>
                </div>
                <div className="mt-2">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Remaining Balance</span>
                  <span className="font-bold text-rose-600">{formatCurrency(selectedInvoice.balanceAmount)}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-500">Payment Amount (₹) *</label>
                <input
                  type="number"
                  min="1"
                  max={selectedInvoice.balanceAmount}
                  step="1"
                  className={inputClass}
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-500">Payment Method *</label>
                <select
                  className={inputClass}
                  value={paymentForm.paymentMethod}
                  onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })}
                >
                  <option value="UPI">UPI / QR Code</option>
                  <option value="CASH">Cash Handover</option>
                  <option value="CARD">Credit/Debit Card</option>
                  <option value="NET_BANKING">Net Banking</option>
                  <option value="CHEQUE">Cheque</option>
                  <option value="DD">Demand Draft</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-slate-500">Reference / Txn ID</label>
              <input
                className={inputClass}
                value={paymentForm.paymentReference}
                onChange={(e) => setPaymentForm({ ...paymentForm, paymentReference: e.target.value })}
                placeholder="e.g. UPI Ref / Cheque No / Bank Txn ID"
              />
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => setPayModalOpen(false)}
                className="rounded-xl px-4 py-2 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={paying}
                className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm disabled:opacity-60"
              >
                {paying ? 'Recording...' : 'Complete Payment'}
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Printable Receipt Modal */}
      <Modal
        isOpen={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
        title="Payment Receipt"
      >
        {selectedPayment && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-xs dark:border-slate-800 dark:bg-slate-950">
              <div className="text-center pb-4 border-b border-dashed border-slate-300 dark:border-slate-700">
                <h4 className="text-sm font-black uppercase text-slate-800 dark:text-white">School Fee Receipt</h4>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">{selectedPayment.receiptNumber}</p>
                <span className="mt-2 inline-block rounded bg-emerald-500/10 px-2 py-0.5 text-[9px] font-extrabold text-emerald-600 uppercase border border-emerald-500/20">
                  Payment Completed
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-b border-dashed border-slate-300 dark:border-slate-700">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Receipt #</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-white">{selectedPayment.receiptNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Date</span>
                  <span className="font-bold text-slate-800 dark:text-white">
                    {new Date(selectedPayment.paymentDate || selectedPayment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Student</span>
                  <span className="font-bold text-slate-800 dark:text-white">
                    {selectedPayment.studentId ? `${selectedPayment.studentId.firstName} ${selectedPayment.studentId.lastName || ''}`.trim() : '—'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Payment Mode</span>
                  <span className="font-bold text-indigo-600">{selectedPayment.paymentMethod}</span>
                </div>
              </div>

              <div className="pt-4 flex justify-between items-center text-sm font-extrabold">
                <span className="text-slate-700 dark:text-slate-300">Amount Received:</span>
                <span className="text-emerald-600 text-base">{formatCurrency(selectedPayment.amount)}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm"
              >
                <Printer className="h-3.5 w-3.5" /> Print Receipt
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Generate Invoice Modal */}
      <Modal
        isOpen={generateModalOpen}
        onClose={() => setGenerateModalOpen(false)}
        title="Generate Student Fee Invoice"
      >
        <form onSubmit={handleGenerateInvoice} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-bold text-slate-500">Select Enrolled Student *</label>
            {loadingStudents ? (
              <div className="flex items-center gap-2 py-2 text-xs text-slate-400">
                <Loader2 className="h-4 w-4 animate-spin text-primary" /> Loading active students...
              </div>
            ) : students.length === 0 ? (
              <p className="text-xs text-rose-500">No active students enrolled found in system.</p>
            ) : (
              <select
                className={inputClass}
                value={generateForm.studentId}
                onChange={(e) => setGenerateForm({ ...generateForm, studentId: e.target.value })}
                required
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.firstName} {s.lastName || ''} ({s.admissionNumber || s.rollNumber || 'No ID'})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-slate-500">Period / Billing Term *</label>
            <input
              type="text"
              className={inputClass}
              value={generateForm.periodLabel}
              onChange={(e) => setGenerateForm({ ...generateForm, periodLabel: e.target.value })}
              placeholder="e.g. Month of July 2026, Term 1"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-slate-500">Payment Due Date (Optional)</label>
            <input
              type="date"
              className={inputClass}
              value={generateForm.dueDate}
              onChange={(e) => setGenerateForm({ ...generateForm, dueDate: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setGenerateModalOpen(false)}
              className="rounded-xl px-4 py-2 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={generating || loadingStudents || students.length === 0}
              className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm disabled:opacity-60"
            >
              {generating ? 'Generating...' : 'Generate Invoice'}
            </button>
          </div>
        </form>
      </Modal>

      <ToastComponent />
    </div>
  );
};

export default FeeManagement;
