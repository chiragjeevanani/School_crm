import React, { useState, useEffect } from 'react';
import { useParentAuth } from '../context/ParentAuthContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';
import { MOCK_CHILDREN_FEES } from '../data/mockData';
import { CreditCard, Download, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';

export const ParentFees = () => {
  const toast = useToast();
  const { selectedChildId } = useParentAuth();
  const [fees, setFees] = useState(null);
  const [payingInstallment, setPayingInstallment] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [paymentStatus, setPaymentStatus] = useState('idle'); // idle | loading | success | failure
  const [transactionId, setTransactionId] = useState('');

  useEffect(() => {
    setFees(MOCK_CHILDREN_FEES[selectedChildId] || null);
  }, [selectedChildId]);

  const handlePayClick = (inst) => {
    setPayingInstallment(inst);
    setPaymentStatus('idle');
  };

  const handleProcessPayment = async (forceSuccess = true) => {
    setPaymentStatus('loading');
    await new Promise(r => setTimeout(r, 2000));

    if (forceSuccess) {
      const txId = 'TXN-' + Math.floor(100000 + Math.random() * 900000);
      setTransactionId(txId);
      
      // Update local storage or local state
      const updatedFees = {
        ...fees,
        pendingFees: Math.max(0, fees.pendingFees - payingInstallment.amount),
        paidFees: fees.paidFees + payingInstallment.amount,
        installments: fees.installments.map(inst => {
          if (inst.name === payingInstallment.name) {
            return { ...inst, status: 'Paid', receiptNo: 'REC-' + Math.floor(1000 + Math.random() * 9000) };
          }
          return inst;
        }),
        history: [
          {
            paymentId: txId,
            date: new Date().toISOString().split('T')[0],
            amount: payingInstallment.amount,
            mode: paymentMethod,
            receiptNo: 'REC-' + Math.floor(1000 + Math.random() * 9000)
          },
          ...fees.history
        ]
      };
      
      setFees(updatedFees);
      setPaymentStatus('success');
      toast.success('Tuition fee payment processed successfully!');
    } else {
      setPaymentStatus('failure');
      toast.error('Payment gateway timed out. Please try again.');
    }
  };

  const handleDownloadReceipt = (receiptNo) => {
    toast.success(`Downloading fee receipt: ${receiptNo}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-black text-foreground">Fees Ledger</h2>
        <p className="text-xs text-slate-500 mt-0.5">Pay outstanding tuition fees online and review payment records</p>
      </div>

      {/* Summary Cards */}
      {fees && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="text-center">
            <p className="text-xl font-black text-foreground">₹{fees.totalFees}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Total Assigned Fees</p>
          </Card>
          <Card className="text-center">
            <p className="text-xl font-black text-emerald-500">₹{fees.paidFees}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Fees Paid</p>
          </Card>
          <Card className="text-center">
            <p className="text-xl font-black text-rose-500">₹{fees.pendingFees}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Outstanding Balance</p>
          </Card>
        </div>
      )}

      {/* Installments List */}
      <div>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Installment Schedules</h3>
        <div className="space-y-3">
          {fees?.installments.map((inst, index) => (
            <Card key={index} className="flex items-center justify-between p-4 border border-border">
              <div>
                <h4 className="text-xs font-bold text-foreground">{inst.name}</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Due date: {inst.dueDate} • Amount: ₹{inst.amount}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={inst.status === 'Paid' ? 'success' : 'danger'}>
                  {inst.status}
                </Badge>
                {inst.status === 'Paid' ? (
                  <button
                    onClick={() => handleDownloadReceipt(inst.receiptNo)}
                    className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 text-slate-600 dark:text-slate-350"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => handlePayClick(inst)}
                    className="px-4 py-2 bg-primary text-white text-[10px] font-bold rounded-xl hover:bg-primary-hover transition-colors shadow-premium"
                  >
                    Pay Online
                  </button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Payment History */}
      <div>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Transaction logs</h3>
        <div className="space-y-2">
          {fees?.history.map((tx, idx) => (
            <Card key={idx} className="flex items-center justify-between p-3.5 border border-border">
              <div>
                <h4 className="text-xs font-bold text-foreground">Transaction ID: {tx.paymentId}</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Paid: {tx.date} · Mode: {tx.mode}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-black text-foreground">₹{tx.amount}</span>
                <button
                  onClick={() => handleDownloadReceipt(tx.receiptNo)}
                  className="p-1.5 text-primary bg-primary/10 rounded-lg hover:bg-primary/20"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Pay Online Modal */}
      <Modal
        isOpen={!!payingInstallment}
        onClose={() => setPayingInstallment(null)}
        title={paymentStatus === 'idle' || paymentStatus === 'loading' ? 'Complete Fee Payment' : 'Transaction Status'}
        size="md"
      >
        {paymentStatus === 'idle' && payingInstallment && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-border">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Installment</span>
              <h4 className="text-xs font-extrabold text-foreground">{payingInstallment.name}</h4>
              <p className="text-sm font-black text-primary mt-2">₹{payingInstallment.amount}</p>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                {['UPI', 'Card', 'Net Banking'].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`py-2 px-3 border rounded-xl text-xs font-bold text-center ${
                      paymentMethod === method ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-card'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            {paymentMethod === 'Card' && (
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Card Number"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Expiry MM/YY"
                    className="px-3.5 py-2.5 rounded-xl border border-border bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none"
                  />
                  <input
                    type="password"
                    maxLength={3}
                    placeholder="CVV"
                    className="px-3.5 py-2.5 rounded-xl border border-border bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none"
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'UPI' && (
              <input
                type="text"
                placeholder="Enter UPI VPA (e.g. name@upi)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none"
              />
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => handleProcessPayment(false)}
                className="flex-1 py-2.5 rounded-xl border border-rose-250 text-rose-500 text-xs font-bold hover:bg-rose-50"
              >
                Mock Failure
              </button>
              <button
                onClick={() => handleProcessPayment(true)}
                className="flex-1 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-premium hover:bg-primary-hover"
              >
                Pay Now
              </button>
            </div>
          </div>
        )}

        {paymentStatus === 'loading' && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <h4 className="text-xs font-bold text-foreground mt-4">Connecting Gateway</h4>
            <p className="text-[10px] text-slate-400 mt-1">Please do not refresh or close the page...</p>
          </div>
        )}

        {paymentStatus === 'success' && (
          <div className="flex flex-col items-center justify-center text-center py-6">
            <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-full mb-4">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-sm font-black text-foreground">Payment Successful!</h3>
            <p className="text-[10px] text-slate-400 mt-1">Transaction ID: {transactionId}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mt-3 leading-relaxed">
              Your payment has been recorded successfully. You can download the invoice receipt below.
            </p>
            <div className="flex gap-2 w-full mt-6">
              <button
                onClick={() => handleDownloadReceipt('REC-MOCK')}
                className="flex-grow py-2.5 border border-border text-xs font-bold rounded-xl"
              >
                Print Receipt
              </button>
              <button
                onClick={() => setPayingInstallment(null)}
                className="flex-grow py-2.5 bg-primary text-white text-xs font-bold rounded-xl shadow-premium hover:bg-primary-hover"
              >
                Back to Ledger
              </button>
            </div>
          </div>
        )}

        {paymentStatus === 'failure' && (
          <div className="flex flex-col items-center justify-center text-center py-6">
            <div className="p-3 bg-rose-500/10 text-rose-500 rounded-full mb-4">
              <XCircle className="w-10 h-10" />
            </div>
            <h3 className="text-sm font-black text-foreground animate-pulse">Payment Transaction Failed</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mt-3 leading-relaxed">
              We could not authenticate your account or process the billing request from your bank account. No money was deducted.
            </p>
            <div className="flex gap-3 w-full mt-6">
              <button
                onClick={() => setPaymentStatus('idle')}
                className="flex-grow py-2.5 bg-primary text-white text-xs font-bold rounded-xl"
              >
                Try Again
              </button>
              <button
                onClick={() => setPayingInstallment(null)}
                className="flex-grow py-2.5 bg-slate-100 dark:bg-slate-800 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
