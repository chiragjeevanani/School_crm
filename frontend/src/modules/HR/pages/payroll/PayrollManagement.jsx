import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { SalarySlip } from '../../components/ui/SalarySlip';
import { useToast } from '../../components/ui/Toast';
import { hrApi } from '../../../../shared/api/client';
import {
  BadgeCent,
  Plus,
  CheckCircle2,
  Eye,
  RefreshCw,
  Printer,
  DollarSign,
  Calendar,
  X,
  CreditCard,
  Send
} from 'lucide-react';

export const PayrollManagement = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [eligibleEmployees, setEligibleEmployees] = useState([]);
  const [stats, setStats] = useState({ totalAmount: 0, paidAmount: 0, pendingAmount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedSlip, setSelectedSlip] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // New Payroll Form State
  const [selectedEmpId, setSelectedEmpId] = useState('');
  const [payrollMonth, setPayrollMonth] = useState(
    new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })
  );
  const [basicSalary, setBasicSalary] = useState(0);
  const [allowances, setAllowances] = useState(0);
  const [incentive, setIncentive] = useState(0);
  const [leaveDeduction, setLeaveDeduction] = useState(0);
  const [otherDeduction, setOtherDeduction] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState('PROCESSED');
  const [paymentMethod, setPaymentMethod] = useState('BANK_TRANSFER');

  const { showToast, ToastComponent } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [payRes, empRes] = await Promise.all([
        hrApi.payrolls(),
        hrApi.payrollEmployees(),
      ]);
      if (payRes?.success) {
        setPayrolls(payRes.data || []);
        if (payRes.stats) setStats(payRes.stats);
      }
      if (empRes?.success) {
        setEligibleEmployees(empRes.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load payroll records');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectEmployee = (empId) => {
    setSelectedEmpId(empId);
    const emp = eligibleEmployees.find((e) => e.id === empId);
    if (emp) {
      setBasicSalary(emp.basicSalary || emp.payroll?.basicSalary || 30000);
      setAllowances(0);
      setIncentive(0);
      setLeaveDeduction(0);
      setOtherDeduction(0);
    }
  };

  const netSalary =
    Number(basicSalary || 0) +
    Number(allowances || 0) +
    Number(incentive || 0) -
    Number(leaveDeduction || 0) -
    Number(otherDeduction || 0);

  const handleCreatePayroll = async (e) => {
    e.preventDefault();
    if (!selectedEmpId) return;

    setSubmitting(true);
    try {
      const emp = eligibleEmployees.find((e) => e.id === selectedEmpId);
      const payload = {
        employeeRefId: selectedEmpId,
        employeeType: emp?.employeeType || (emp?.role === 'TEACHER' ? 'TEACHER' : 'STAFF'),
        employeeId: emp?.employeeId || 'EMP',
        employeeName: emp?.name || 'Staff',
        employeeEmail: emp?.email || '',
        employeeRole: emp?.designation || emp?.role || 'Staff',
        department: emp?.department || '',
        designation: emp?.designation || '',
        payrollMonth,
        basicSalary: Number(basicSalary),
        allowances: Number(allowances),
        incentive: Number(incentive),
        leaveDeduction: Number(leaveDeduction),
        otherDeduction: Number(otherDeduction),
        grossEarnings: Number(basicSalary) + Number(allowances) + Number(incentive),
        totalDeductions: Number(leaveDeduction) + Number(otherDeduction),
        netSalary,
        paymentStatus,
        paymentMethod,
        bankDetails: emp?.bankDetails || {},
      };

      const res = await hrApi.createPayroll(payload);
      setPayrolls((prev) => [res.data, ...prev]);
      showToast(`Payroll voucher created for ${emp?.name}!`, 'success');
      setShowCreateModal(false);
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Failed to create payroll', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkAsPaid = async (payrollId) => {
    try {
      const res = await hrApi.updatePayrollStatus(payrollId, 'PAID', {
        paymentDate: new Date(),
      });
      setPayrolls((prev) =>
        prev.map((p) => (p.id === payrollId ? { ...p, paymentStatus: 'PAID' } : p))
      );
      showToast('Payroll voucher marked as PAID!', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Failed to update status', 'error');
    }
  };

  const handleReleaseAll = async () => {
    try {
      const res = await hrApi.releaseAllPayrolls(payrollMonth);
      showToast(res.message || 'All pending payrolls marked as paid!', 'success');
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Failed to release payrolls', 'error');
    }
  };

  return (
    <div className="space-y-6 text-xs font-semibold">
      <PageHeader
        title="Payroll & Salary Disbursal Desk"
        subtitle="Manage salary generation, generate pay slips, deduct leave offsets, and track bank disbursements."
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={fetchData}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleReleaseAll}
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs transition-all cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              <span>Disburse All</span>
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Generate Payroll Voucher</span>
            </button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400">Total Net Processed</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            ₹{Number(stats.totalAmount || 0).toLocaleString('en-IN')}
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">Total Disbursed (Paid)</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            ₹{Number(stats.paidAmount || 0).toLocaleString('en-IN')}
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">Pending Authorization</span>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
            ₹{Number(stats.pendingAmount || 0).toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 p-4 rounded-2xl text-rose-700 dark:text-rose-400 text-xs font-semibold flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchData} className="underline font-bold cursor-pointer">Retry</button>
        </div>
      )}

      {/* Payroll Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="h-12 bg-slate-100 dark:bg-slate-800/60 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : payrolls.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <BadgeCent className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700" />
            <p>No payroll vouchers created yet. Click "Generate Payroll Voucher" to process staff salaries.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 text-[11px]">
                  <th className="py-3">Emp ID</th>
                  <th>Employee Name</th>
                  <th>Department</th>
                  <th>Month</th>
                  <th>Basic Pay</th>
                  <th>Allowances</th>
                  <th>Deductions</th>
                  <th>Net Disbursed</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-850">
                {payrolls.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/50 transition-colors">
                    <td className="py-3 font-mono text-slate-400 font-bold">{p.employeeId}</td>
                    <td className="font-bold text-slate-900 dark:text-white">{p.employeeName}</td>
                    <td className="text-slate-600 dark:text-slate-400">{p.department || 'N/A'}</td>
                    <td className="text-slate-600 dark:text-slate-400">{p.payrollMonth}</td>
                    <td>₹{Number(p.basicSalary || 0).toLocaleString('en-IN')}</td>
                    <td className="text-emerald-600 font-bold">+₹{Number(p.allowances || 0).toLocaleString('en-IN')}</td>
                    <td className="text-rose-500 font-bold">-₹{Number(p.totalDeductions || 0).toLocaleString('en-IN')}</td>
                    <td className="font-black text-slate-900 dark:text-white">
                      ₹{Number(p.netSalary || 0).toLocaleString('en-IN')}
                    </td>
                    <td>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          p.paymentStatus === 'PAID'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                            : 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400'
                        }`}
                      >
                        {p.paymentStatus}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedSlip(p)}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
                          title="View Payslip"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Slip</span>
                        </button>
                        {p.paymentStatus !== 'PAID' && (
                          <button
                            type="button"
                            onClick={() => handleMarkAsPaid(p.id)}
                            className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors"
                          >
                            Mark Paid
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payslip Modal */}
      {selectedSlip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-100">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Salary Statement: {selectedSlip.employeeName}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedSlip(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <SalarySlip payroll={selectedSlip} />
          </div>
        </div>
      )}

      {/* Create Payroll Voucher Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-100">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              Generate Staff Salary Voucher
            </h3>

            <form onSubmit={handleCreatePayroll} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-slate-700 dark:text-slate-300 font-bold">Select Staff Member *</label>
                <select
                  required
                  value={selectedEmpId}
                  onChange={(e) => handleSelectEmployee(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-xs font-semibold cursor-pointer"
                >
                  <option value="">Choose an employee...</option>
                  {eligibleEmployees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.employeeId || 'ID'}) • ₹{emp.basicSalary || emp.payroll?.basicSalary || 30000}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700 dark:text-slate-300 font-bold">Payroll Month *</label>
                  <input
                    type="text"
                    required
                    value={payrollMonth}
                    onChange={(e) => setPayrollMonth(e.target.value)}
                    placeholder="e.g. August 2026"
                    className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 dark:text-slate-300 font-bold">Basic Salary (₹) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={basicSalary}
                    onChange={(e) => setBasicSalary(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700 dark:text-slate-300 font-bold">Allowances (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={allowances}
                    onChange={(e) => setAllowances(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 dark:text-slate-300 font-bold">Incentives / Bonus (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={incentive}
                    onChange={(e) => setIncentive(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700 dark:text-slate-300 font-bold">Leave Deductions (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={leaveDeduction}
                    onChange={(e) => setLeaveDeduction(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 dark:text-slate-300 font-bold">Other Deductions (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={otherDeduction}
                    onChange={(e) => setOtherDeduction(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-xs"
                  />
                </div>
              </div>

              {/* Net Result Highlight */}
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl border border-indigo-200 dark:border-indigo-900/30 flex justify-between items-center">
                <span className="font-bold text-indigo-700 dark:text-indigo-300">Computed Net Salary:</span>
                <span className="text-base font-black text-indigo-700 dark:text-indigo-300">
                  ₹{Number(netSalary || 0).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700 dark:text-slate-300 font-bold">Disbursement Status</label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-xs font-semibold cursor-pointer"
                  >
                    <option value="PROCESSED">Processed / Pending</option>
                    <option value="PAID">Paid / Disbursed</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 dark:text-slate-300 font-bold">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-xs font-semibold cursor-pointer"
                  >
                    <option value="BANK_TRANSFER">Bank Transfer (NEFT/RTGS)</option>
                    <option value="CHEQUE">Cheque</option>
                    <option value="CASH">Cash</option>
                    <option value="UPI">UPI Payment</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-xs cursor-pointer disabled:opacity-60"
                >
                  {submitting ? 'Generating...' : 'Save & Issue Voucher'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastComponent />
    </div>
  );
};
export default PayrollManagement;
