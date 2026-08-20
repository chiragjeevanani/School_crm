import React from 'react';
import { Printer, Download, Mail, Building } from 'lucide-react';

export const SalarySlip = ({ payroll, onPrint }) => {
  if (!payroll) return null;

  const handlePrint = () => {
    if (onPrint) onPrint();
    window.print();
  };

  const bank = payroll.bankDetails || {};

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6 text-xs max-w-2xl mx-auto" id="printable-payslip">
      {/* Header */}
      <div className="flex justify-between items-start pb-4 border-b border-dashed border-slate-200 dark:border-slate-800">
        <div className="space-y-1">
          <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
            Greenfield Public School
          </h2>
          <p className="text-[10px] text-slate-400">Institutional Payroll Statement & Salary Voucher</p>
        </div>
        <div className="text-right space-y-1 shrink-0">
          <span className="inline-block bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400 px-2.5 py-1 rounded-lg font-black text-[10px] uppercase">
            Salary Payslip
          </span>
          <p className="text-[10px] font-bold text-slate-900 dark:text-white pt-1">
            Period: {payroll.payrollMonth}
          </p>
          <p className="text-[9px] text-slate-400">
            Payment Status: <strong className="text-emerald-600 dark:text-emerald-400">{payroll.paymentStatus}</strong>
          </p>
        </div>
      </div>

      {/* Employee Details block */}
      <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-950/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-850">
        <div className="space-y-1.5 font-semibold">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Staff Particulars</p>
          <p className="text-slate-800 dark:text-slate-200">
            Name: <span className="font-bold">{payroll.employeeName}</span>
          </p>
          <p className="text-slate-500">
            Employee ID: <span className="font-bold text-slate-700 dark:text-slate-300">{payroll.employeeId}</span>
          </p>
          <p className="text-slate-500">
            Department: <span className="font-bold text-slate-700 dark:text-slate-300">{payroll.department || 'N/A'}</span>
          </p>
          <p className="text-slate-500">
            Designation: <span className="font-bold text-slate-700 dark:text-slate-300">{payroll.designation || 'Staff'}</span>
          </p>
        </div>
        <div className="space-y-1.5 font-semibold text-right">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Account Details</p>
          <p className="text-slate-500">
            Bank: <span className="font-bold text-slate-700 dark:text-slate-300">{bank.bankName || 'Direct'}</span>
          </p>
          <p className="text-slate-500">
            A/C No: <span className="font-bold text-slate-700 dark:text-slate-300 font-mono">{bank.accountNumber || '—'}</span>
          </p>
          <p className="text-slate-500">
            IFSC: <span className="font-bold text-slate-700 dark:text-slate-300 font-mono">{bank.ifscCode || '—'}</span>
          </p>
          <p className="text-slate-500">
            Method: <span className="font-bold text-slate-700 dark:text-slate-300">{payroll.paymentMethod || 'BANK_TRANSFER'}</span>
          </p>
        </div>
      </div>

      {/* Earnings & Deductions Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Earnings */}
        <div className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden">
          <div className="bg-slate-50 dark:bg-slate-950 px-3 py-2 border-b border-slate-100 dark:border-slate-800">
            <span className="font-bold text-[10px] text-slate-800 dark:text-white uppercase tracking-wider">
              Earnings Breakdown
            </span>
          </div>
          <div className="p-3 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Basic Salary</span>
              <span className="font-bold">₹{Number(payroll.basicSalary || 0).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Allowances</span>
              <span className="font-bold">₹{Number(payroll.allowances || 0).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Incentive / Bonus</span>
              <span className="font-bold">₹{Number((payroll.incentive || 0) + (payroll.bonus || 0)).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between border-t border-slate-100 dark:border-slate-800 pt-2 font-black text-slate-900 dark:text-white">
              <span>Gross Earnings</span>
              <span>₹{Number(payroll.grossEarnings || payroll.basicSalary || 0).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Deductions */}
        <div className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden">
          <div className="bg-slate-50 dark:bg-slate-950 px-3 py-2 border-b border-slate-100 dark:border-slate-800">
            <span className="font-bold text-[10px] text-slate-800 dark:text-white uppercase tracking-wider">
              Deductions & Offsets
            </span>
          </div>
          <div className="p-3 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Leave Deductions</span>
              <span className="font-bold text-rose-500">₹{Number(payroll.leaveDeduction || 0).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Advance / Loan Recovery</span>
              <span className="font-bold text-rose-500">₹{Number(payroll.advanceLoanDeduction || 0).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Other Deductions</span>
              <span className="font-bold text-rose-500">₹{Number(payroll.otherDeduction || 0).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between border-t border-slate-100 dark:border-slate-800 pt-2 font-black text-rose-600">
              <span>Total Deductions</span>
              <span>₹{Number(payroll.totalDeductions || 0).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Net Pay Highlight Banner */}
      <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-900/40 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 block">
            Net Salary Payable
          </span>
          <span className="text-xl font-black text-emerald-700 dark:text-emerald-300">
            ₹{Number(payroll.netSalary || 0).toLocaleString('en-IN')}
          </span>
        </div>
        <button
          type="button"
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Print Voucher</span>
        </button>
      </div>
    </div>
  );
};
export default SalarySlip;
