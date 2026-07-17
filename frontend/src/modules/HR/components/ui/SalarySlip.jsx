import React from 'react';
import { Printer, Download, Mail, MessageSquare } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const SalarySlip = ({ payroll, employee, onPrint, onSendEmail }) => {
  if (!payroll || !employee) return null;

  const handlePrint = () => {
    if (onPrint) onPrint();
    window.print();
  };

  return (
    <div className="bg-white dark:bg-slate-900 border rounded-3xl p-6 shadow-sm space-y-6 text-xs max-w-2xl mx-auto" id="printable-payslip">
      {/* Header */}
      <div className="flex justify-between items-start pb-4 border-b border-dashed">
        <div className="space-y-1">
          <h2 className="text-sm font-black text-slate-905 dark:text-white uppercase tracking-wider">Greenfield Public School</h2>
          <p className="text-[10px] text-slate-400">Sector 9, Gachibowli, Hyderabad, TS</p>
          <p className="text-[9px] text-slate-400">Staff Salary Statement Receipt</p>
        </div>
        <div className="text-right space-y-1 shrink-0">
          <span className="inline-block bg-rose-50 text-rose-700 dark:bg-rose-955/40 dark:text-rose-400 px-2.5 py-1 rounded-lg font-black text-[10px] uppercase">
            Salary Payslip
          </span>
          <p className="text-[10px] font-bold text-slate-900 dark:text-white pt-1">Period: {payroll.month} {payroll.year}</p>
          <p className="text-[9px] text-slate-400">Generated: {formatDate(new Date())}</p>
        </div>
      </div>

      {/* Employee Details block */}
      <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-955/40 p-4 rounded-2xl border">
        <div className="space-y-1.5 font-semibold">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-wide">Staff Details</p>
          <p className="text-slate-800 dark:text-slate-200">Name: <span className="font-bold">{employee.name}</span></p>
          <p className="text-slate-500">Employee ID: <span className="font-bold text-slate-705 dark:text-slate-300">{employee.employeeId}</span></p>
          <p className="text-slate-500">Department: <span className="font-bold text-slate-705 dark:text-slate-300">{employee.department}</span></p>
          <p className="text-slate-500">Designation: <span className="font-bold text-slate-705 dark:text-slate-300">{employee.designation}</span></p>
        </div>
        <div className="space-y-1.5 font-semibold text-right">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-wide">Account Details</p>
          <p className="text-slate-550">Bank: <span className="font-bold text-slate-700 dark:text-slate-350">{employee.bankDetails.bankName}</span></p>
          <p className="text-slate-555">A/C No: <span className="font-bold text-slate-700 dark:text-slate-350">{employee.bankDetails.accountNo}</span></p>
          <p className="text-slate-550">IFSC: <span className="font-bold text-slate-700 dark:text-slate-350 font-mono">{employee.bankDetails.ifsc}</span></p>
          <p className="text-slate-555">PF No: <span className="font-bold text-slate-700 dark:text-slate-350">{employee.pfNo || '--'}</span></p>
        </div>
      </div>

      {/* Earnings & Deductions Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Earnings */}
        <div className="border rounded-2xl overflow-hidden">
          <div className="bg-slate-50 dark:bg-slate-955/60 px-3 py-2 border-b">
            <span className="font-bold text-[10px] text-slate-800 dark:text-white uppercase tracking-wider">Earnings</span>
          </div>
          <div className="p-3 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Basic Salary</span>
              <span className="font-bold">{formatCurrency(payroll.basic || employee.salary.basic)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">HRA Concession</span>
              <span className="font-bold">{formatCurrency(employee.salary.hra)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">DA Allowance</span>
              <span className="font-bold">{formatCurrency(employee.salary.da)}</span>
            </div>
            <div className="flex justify-between border-t border-dashed pt-2 font-bold text-slate-800 dark:text-white">
              <span>Gross Earnings</span>
              <span>{formatCurrency(payroll.basic ? payroll.basic + employee.salary.hra + employee.salary.da : employee.salary.basic + employee.salary.hra + employee.salary.da)}</span>
            </div>
          </div>
        </div>

        {/* Deductions */}
        <div className="border rounded-2xl overflow-hidden">
          <div className="bg-slate-50 dark:bg-slate-955/60 px-3 py-2 border-b">
            <span className="font-bold text-[10px] text-slate-800 dark:text-white uppercase tracking-wider">Deductions</span>
          </div>
          <div className="p-3 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">PF Deduction</span>
              <span className="font-bold text-rose-600">-{formatCurrency(payroll.deductions || 5400)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Professional Tax</span>
              <span className="font-bold text-rose-600">-{formatCurrency(200)}</span>
            </div>
            <div className="flex justify-between border-t border-dashed pt-2 font-bold text-slate-800 dark:text-white">
              <span>Total Deductions</span>
              <span>-{formatCurrency((payroll.deductions || 5400) + 200)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Net Salary Summary */}
      <div className="border-t border-dashed pt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <span className="text-[10px] text-slate-400 font-bold block">Status: {payroll.status}</span>
          <p className="text-slate-500 mt-1">Disbursement Date: {payroll.datePaid}</p>
        </div>
        <div className="bg-rose-50 dark:bg-rose-955/20 border border-rose-100 dark:border-rose-900/30 px-5 py-3 rounded-2xl text-right">
          <span className="text-[9px] font-black text-rose-700 dark:text-rose-400 uppercase tracking-widest block">Net Disbursed Salary</span>
          <h3 className="text-lg font-black text-rose-600 mt-0.5">{formatCurrency(payroll.netSalary)}</h3>
        </div>
      </div>

      {/* Actions */}
      <div className="pt-4 border-t flex justify-end gap-2.5 shrink-0 no-print">
        {onSendEmail && (
          <button onClick={onSendEmail} title="Email Payslip" className="p-2 border rounded-xl hover:bg-slate-50 dark:hover:bg-slate-950 text-slate-500">
            <Mail className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-750 text-white font-bold rounded-xl shadow-sm"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Statement</span>
        </button>
      </div>
    </div>
  );
};
export default SalarySlip;
