import React, { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Tabs } from '../../components/ui/Tabs';
import { DataTable } from '../../components/ui/DataTable';
import { SalarySlip } from '../../components/ui/SalarySlip';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { MOCK_PAYROLL, MOCK_EMPLOYEES } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';
import { ShieldCheck, Eye } from 'lucide-react';

export const PayrollManagement = () => {
  const [activeTab, setActiveTab] = useState('generate');
  const { showToast, ToastComponent } = useToast();

  const [payroll, setPayroll] = useState(MOCK_PAYROLL);
  const [selectedSlip, setSelectedSlip] = useState(null);

  const handleProcessPayroll = () => {
    setPayroll(prev => prev.map(p => ({ ...p, status: 'Paid', datePaid: new Date().toISOString().split('T')[0] })));
    showToast('July 2026 payroll cycles processed and disbursed to staff bank files!', 'success');
  };

  const generateColumns = [
    { key: 'employeeId', title: 'Emp ID', sortable: true },
    { key: 'employeeName', title: 'Employee Name', sortable: true },
    { key: 'basic', title: 'Basic Pay band', render: (val) => <span>{formatCurrency(val)}</span> },
    { key: 'allowances', title: 'Allowances', render: (val) => <span>{formatCurrency(val)}</span> },
    { key: 'deductions', title: 'Deductions Offset', render: (val) => <span className="text-rose-500">-{formatCurrency(val)}</span> },
    { key: 'netSalary', title: 'Net Disbursement', render: (val) => <span className="font-extrabold text-emerald-600">{formatCurrency(val)}</span> },
    { 
      key: 'status', 
      title: 'Status',
      render: (val) => (
        <Badge variant={val === 'Paid' ? 'success' : 'warning'}>
          {val}
        </Badge>
      )
    }
  ];

  const slipColumns = [
    { key: 'employeeId', title: 'Emp ID', sortable: true },
    { key: 'employeeName', title: 'Employee Name', sortable: true },
    { key: 'month', title: 'Month' },
    { key: 'year', title: 'Year' },
    { key: 'netSalary', title: 'Net Paid Amount', render: (val) => <span className="font-bold">{formatCurrency(val)}</span> },
    { 
      key: 'actions', 
      title: 'Actions',
      render: (_, row) => (
        <button
          onClick={() => {
            const emp = MOCK_EMPLOYEES.find(e => e.id === row.employeeId);
            setSelectedSlip({ payroll: row, employee: emp });
          }}
          className="p-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 border rounded-lg text-slate-500 flex items-center gap-1 font-bold text-[10px]"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>View Slip</span>
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Payroll & Salary Slips" 
        subtitle="Manage basic salaries structures, verify allowances calculations, and dispatch salary payslips." 
        actions={
          activeTab === 'generate' && (
            <button
              onClick={handleProcessPayroll}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-rose-600 hover:bg-rose-750 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Process Salary payroll</span>
            </button>
          )
        }
      />

      <Tabs 
        tabs={[
          { id: 'generate', label: 'Generate & Payout Register' },
          { id: 'history', label: 'Salary Payslips Archive' }
        ]} 
        activeTab={activeTab} 
        onChange={setActiveTab} 
      />

      {activeTab === 'generate' && (
        <DataTable 
          columns={generateColumns} 
          data={payroll} 
          searchPlaceholder="Search generate payroll roster..."
          searchKey="employeeName"
        />
      )}

      {activeTab === 'history' && (
        <DataTable 
          columns={slipColumns} 
          data={payroll} 
          searchPlaceholder="Search generated slips history..."
          searchKey="employeeName"
        />
      )}

      {/* Salary Slip view modal */}
      {selectedSlip && (
        <Modal 
          isOpen={true} 
          onClose={() => setSelectedSlip(null)} 
          title="Official Staff Payslip Receipt"
          size="lg"
        >
          <SalarySlip 
            payroll={selectedSlip.payroll} 
            employee={selectedSlip.employee} 
            onSendEmail={() => showToast('Salary slip copy dispatched to employee mailbox.', 'success')}
          />
        </Modal>
      )}

      <ToastComponent />
    </div>
  );
};
export default PayrollManagement;
