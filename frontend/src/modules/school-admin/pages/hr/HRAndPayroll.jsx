import React, { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Tabs } from '../../components/ui/Tabs';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { MOCK_EMPLOYEES } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';
import { Plus, Wallet, FileText, Printer } from 'lucide-react';

export const HRAndPayroll = () => {
  const [activeTab, setActiveTab] = useState('employees');
  const { showToast, ToastComponent } = useToast();

  const [employees, setEmployees] = useState(MOCK_EMPLOYEES);
  
  const [payrollLogs, setPayrollLogs] = useState([
    { id: '1', name: 'Dr. Ramesh Kumar', role: 'Teacher', salary: 75000, status: 'Released', month: 'June 2026' },
    { id: '2', name: 'Mrs. Sunita Rao', role: 'Teacher', salary: 65000, status: 'Released', month: 'June 2026' },
    { id: '3', name: 'Somnath Lal', role: 'Lab Assistant', salary: 32000, status: 'On Hold', month: 'June 2026' }
  ]);

  // Modal control
  const [payslipModalOpen, setPayslipModalOpen] = useState(false);
  const [selectedPay, setSelectedPay] = useState(null);

  const handleReleasePayroll = () => {
    setPayrollLogs(prev => prev.map(p => ({ ...p, status: 'Released' })));
    showToast('All employee salary payrolls released successfully!', 'success');
  };

  const employeeColumns = [
    { header: 'Employee Name', key: 'name', render: (val) => <span className="font-bold text-slate-900 dark:text-white">{val}</span> },
    { header: 'Email Office', key: 'email' },
    { header: 'Assigned Role', key: 'role', render: (val) => <Badge variant="info">{val}</Badge> },
    { header: 'Department', key: 'department' },
    { header: 'Status', key: 'status', render: (val) => <Badge variant={val === 'Active' ? 'success' : 'danger'}>{val}</Badge> }
  ];

  const payrollColumns = [
    { header: 'Employee', key: 'name', render: (val, row) => (
      <div>
        <span className="font-bold block">{val}</span>
        <span className="text-[9px] text-slate-450 uppercase">{row.role}</span>
      </div>
    )},
    { header: 'Target Month', key: 'month' },
    { header: 'Base CTC Salary', key: 'salary', render: (val) => <span className="font-bold">{formatCurrency(val)}</span> },
    { header: 'Pay Status', key: 'status', render: (val) => (
      <Badge variant={val === 'Released' ? 'success' : 'warning'}>{val}</Badge>
    )},
    {
      header: 'Actions',
      key: 'actions',
      render: (_, row) => (
        <button
          onClick={() => {
            setSelectedPay(row);
            setPayslipModalOpen(true);
          }}
          className="text-xs font-bold text-indigo-650 hover:underline flex items-center gap-1"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Payslip</span>
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="HR & Payroll Registry" 
        subtitle="Manage employee directories, design payroll CTCs, release monthly salary logs, and download payslips."
        actions={
          activeTab === 'payroll' && (
            <button
              onClick={handleReleasePayroll}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>Release Monthly Salaries</span>
            </button>
          )
        }
      />

      <Tabs 
        tabs={[
          { id: 'employees', label: 'Employee Registry Directory', count: employees.length },
          { id: 'payroll', label: 'Payroll & Payslips Logs', count: payrollLogs.length }
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        {activeTab === 'employees' && <DataTable columns={employeeColumns} data={employees} />}
        {activeTab === 'payroll' && <DataTable columns={payrollColumns} data={payrollLogs} />}
      </div>

      {/* PAYSLIP PREVIEW MODAL */}
      <Modal isOpen={payslipModalOpen} onClose={() => setPayslipModalOpen(false)} title="Employee Salary Payslip Preview">
        {selectedPay && (
          <div className="flex flex-col items-center space-y-6">
            <div className="w-full bg-slate-50 dark:bg-slate-950 border p-6 rounded-2xl text-xs font-semibold space-y-4">
              {/* Branding header */}
              <div className="text-center pb-4 border-b border-dashed">
                <h3 className="text-sm font-black uppercase text-slate-800 dark:text-white">Greenfield School</h3>
                <span className="text-[9px] text-slate-450 uppercase mt-0.5 block">SALARY PAYSLIP STATEMENT</span>
              </div>

              {/* Information body grid */}
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-dashed">
                <div>
                  <span className="text-[10px] text-slate-450 block uppercase">Employee Name</span>
                  <span className="text-slate-800 dark:text-white font-bold block mt-0.5">{selectedPay.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-450 block uppercase">Job Profile</span>
                  <span className="text-slate-800 dark:text-white font-bold block mt-0.5">{selectedPay.role}</span>
                </div>
                <div className="mt-2">
                  <span className="text-[10px] text-slate-450 block uppercase">Salary Term Month</span>
                  <span className="text-slate-800 dark:text-white font-bold block mt-0.5">{selectedPay.month}</span>
                </div>
                <div className="mt-2">
                  <span className="text-[10px] text-slate-450 block uppercase">Pay Status</span>
                  <Badge variant={selectedPay.status === 'Released' ? 'success' : 'warning'}>{selectedPay.status}</Badge>
                </div>
              </div>

              {/* Salary breakdown table */}
              <div className="space-y-2">
                <div className="flex justify-between font-bold text-slate-800 dark:text-white">
                  <span>Allowance Component</span>
                  <span>Amount Sum</span>
                </div>
                <div className="flex justify-between text-slate-550 dark:text-slate-400">
                  <span>Basic CTC Component</span>
                  <span>{formatCurrency(selectedPay.salary * 0.6)}</span>
                </div>
                <div className="flex justify-between text-slate-550 dark:text-slate-400">
                  <span>HRA Allowance</span>
                  <span>{formatCurrency(selectedPay.salary * 0.3)}</span>
                </div>
                <div className="flex justify-between text-slate-550 dark:text-slate-400 pb-2 border-b">
                  <span>Special Allowance</span>
                  <span>{formatCurrency(selectedPay.salary * 0.1)}</span>
                </div>
                <div className="flex justify-between font-bold text-indigo-650 pt-2">
                  <span>Net Take-home Salary</span>
                  <span>{formatCurrency(selectedPay.salary)}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => showToast('Connecting to System Printer Hub...', 'info')}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Payslip Statement</span>
            </button>
          </div>
        )}
      </Modal>

      <ToastComponent />
    </div>
  );
};
export default HRAndPayroll;
