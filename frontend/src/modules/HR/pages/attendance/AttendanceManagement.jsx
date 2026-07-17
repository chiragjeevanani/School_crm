import React, { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Tabs } from '../../components/ui/Tabs';
import { DataTable } from '../../components/ui/DataTable';
import { useToast } from '../../components/ui/Toast';
import { MOCK_EMPLOYEES } from '../../utils/constants';
import { Check, ClipboardCheck } from 'lucide-react';

export const AttendanceManagement = () => {
  const [activeTab, setActiveTab] = useState('daily');
  const { showToast, ToastComponent } = useToast();

  // Local Attendance state structure
  const [attendance, setAttendance] = useState(
    MOCK_EMPLOYEES.map(emp => ({
      id: emp.id,
      employeeId: emp.employeeId,
      name: emp.name,
      department: emp.department,
      designation: emp.designation,
      status: 'Present',
      remarks: ''
    }))
  );

  const handleStatusChange = (id, newStatus) => {
    setAttendance(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
  };

  const handleMarkAllPresent = () => {
    setAttendance(prev => prev.map(a => ({ ...a, status: 'Present' })));
    showToast('All staff marked present in today\'s ledger!', 'success');
  };

  const handleSubmitAttendance = () => {
    showToast('Daily staff attendance sheet submitted and logged in audit trails!', 'success');
  };

  const dailyColumns = [
    { key: 'employeeId', title: 'Emp ID', sortable: true },
    { key: 'name', title: 'Employee Name', sortable: true },
    { key: 'department', title: 'Department' },
    { key: 'designation', title: 'Designation' },
    { 
      key: 'status', 
      title: 'Ledger Status',
      render: (val, row) => (
        <select
          value={val}
          onChange={(e) => handleStatusChange(row.id, e.target.value)}
          className="bg-slate-50 dark:bg-slate-950 p-1.5 rounded-lg border text-xs font-bold focus:ring-1 focus:ring-rose-605 cursor-pointer"
        >
          <option value="Present">Present</option>
          <option value="Late">Late Arrival</option>
          <option value="Absent">Absent</option>
          <option value="Leave">On Approved Leave</option>
          <option value="Half Day">Half Day Work</option>
        </select>
      )
    }
  ];

  const summaryColumns = [
    { key: 'employeeId', title: 'Emp ID', sortable: true },
    { key: 'name', title: 'Employee Name', sortable: true },
    { key: 'department', title: 'Department' },
    { key: 'presentCount', title: 'Days Present', render: () => <span>22 days</span> },
    { key: 'lateCount', title: 'Late Arrivals', render: () => <span className="text-amber-500 font-bold">1 day</span> },
    { key: 'absentCount', title: 'Days Absent', render: () => <span className="text-rose-500 font-bold">0 days</span> },
    { key: 'leaveCount', title: 'Approved Leaves', render: () => <span>2 days</span> }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Attendance Ledger Desk" 
        subtitle="Mark daily staff registers, run monthly summary sheets, and log late arrival warnings." 
        actions={
          activeTab === 'daily' && (
            <div className="flex gap-2">
              <button
                onClick={handleMarkAllPresent}
                className="px-3.5 py-2.5 bg-slate-50 border hover:bg-slate-100 dark:bg-slate-950 text-slate-550 rounded-xl text-xs font-bold"
              >
                Mark All Present
              </button>
              <button
                onClick={handleSubmitAttendance}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-rose-600 hover:bg-rose-750 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Submit Register</span>
              </button>
            </div>
          )
        }
      />

      <Tabs 
        tabs={[
          { id: 'daily', label: 'Daily Staff Register' },
          { id: 'summary', label: 'Monthly Attendance Summary' }
        ]} 
        activeTab={activeTab} 
        onChange={setActiveTab} 
      />

      {activeTab === 'daily' && (
        <DataTable 
          columns={dailyColumns} 
          data={attendance} 
          searchPlaceholder="Search staff registers by name..."
          searchKey="name"
        />
      )}

      {activeTab === 'summary' && (
        <DataTable 
          columns={summaryColumns} 
          data={MOCK_EMPLOYEES} 
          searchPlaceholder="Search summary reports..."
          searchKey="name"
        />
      )}

      <ToastComponent />
    </div>
  );
};
export default AttendanceManagement;
