import React, { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Tabs } from '../../components/ui/Tabs';
import { AreaChart } from '../../components/ui/Charts/AreaChart';
import { BarChart } from '../../components/ui/Charts/BarChart';
import { PieChart } from '../../components/ui/Charts/PieChart';
import { LineChart } from '../../components/ui/Charts/LineChart';
import { useToast } from '../../components/ui/Toast';
import { exportToCSV } from '../../utils/exportHelpers';
import { 
  DEPARTMENT_WISE_EMPLOYEES,
  ATTENDANCE_TREND,
  LEAVE_STATISTICS,
  PAYROLL_DISTRIBUTION,
  EMPLOYEE_GROWTH
} from '../../utils/constants';
import { Download } from 'lucide-react';

export const Reports = () => {
  const [activeTab, setActiveTab] = useState('employees');
  const { showToast, ToastComponent } = useToast();

  const handleExport = (dataset, filename) => {
    exportToCSV(dataset, `${filename}_report.csv`);
    showToast(`${filename.replace('_', ' ')} report exported successfully!`, 'success');
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="HR Reports & HRMS Audits" 
        subtitle="Observe department growths, staff time off summary stats, and download payroll spreadsheets." 
      />

      <Tabs 
        tabs={[
          { id: 'employees', label: 'Employee Growths' },
          { id: 'attendance', label: 'Attendance Rates' },
          { id: 'leaves', label: 'Leave Distributions' },
          { id: 'payroll', label: 'Payroll Budgets' }
        ]} 
        activeTab={activeTab} 
        onChange={setActiveTab} 
      />

      {activeTab === 'employees' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b">
            <span className="text-[10px] font-black uppercase text-slate-455 tracking-wider block">Employee Growth chart</span>
            <button
              onClick={() => handleExport(EMPLOYEE_GROWTH, 'employee_growths')}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-rose-600 hover:bg-rose-750 text-white rounded-lg font-bold text-[10px] shadow-sm"
            >
              <Download className="w-3 h-3" />
              <span>Export CSV</span>
            </button>
          </div>
          <LineChart data={EMPLOYEE_GROWTH} dataKey="count" xKey="year" height={260} color="#e11d48" />
        </div>
      )}

      {activeTab === 'attendance' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b">
            <span className="text-[10px] font-black uppercase text-slate-455 tracking-wider block">Daily Attendance Trends</span>
            <button
              onClick={() => handleExport(ATTENDANCE_TREND, 'attendance_trends')}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-rose-600 hover:bg-rose-750 text-white rounded-lg font-bold text-[10px] shadow-sm"
            >
              <Download className="w-3 h-3" />
              <span>Export CSV</span>
            </button>
          </div>
          <AreaChart data={ATTENDANCE_TREND} dataKey="rate" xKey="date" height={260} color="#f43f5e" />
        </div>
      )}

      {activeTab === 'leaves' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b">
            <span className="text-[10px] font-black uppercase text-slate-455 tracking-wider block">Leave Categories share distribution</span>
            <button
              onClick={() => handleExport(LEAVE_STATISTICS, 'leave_categories')}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-rose-600 hover:bg-rose-750 text-white rounded-lg font-bold text-[10px] shadow-sm"
            >
              <Download className="w-3 h-3" />
              <span>Export CSV</span>
            </button>
          </div>
          <div className="flex justify-center">
            <PieChart data={LEAVE_STATISTICS} height={240} colors={["#e11d48", "#f43f5e", "#fda4af", "#fb7185", "#fecdd3"]} />
          </div>
        </div>
      )}

      {activeTab === 'payroll' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b">
            <span className="text-[10px] font-black uppercase text-slate-455 tracking-wider block">Payroll Budgets allocation by department</span>
            <button
              onClick={() => handleExport(PAYROLL_DISTRIBUTION, 'payroll_allocations')}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-rose-600 hover:bg-rose-750 text-white rounded-lg font-bold text-[10px] shadow-sm"
            >
              <Download className="w-3 h-3" />
              <span>Export CSV</span>
            </button>
          </div>
          <BarChart data={PAYROLL_DISTRIBUTION} dataKey="budget" xKey="dept" height={260} color="#f43f5e" />
        </div>
      )}

      <ToastComponent />
    </div>
  );
};
export default Reports;
