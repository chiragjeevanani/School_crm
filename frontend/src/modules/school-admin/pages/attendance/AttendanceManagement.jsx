import React, { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Tabs } from '../../components/ui/Tabs';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { 
  Check, 
  X, 
  Calendar, 
  FileText, 
  ClipboardCheck,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export const AttendanceManagement = () => {
  const [activeTab, setActiveTab] = useState('student');
  const { showToast, ToastComponent } = useToast();

  const [studentRollCall, setStudentRollCall] = useState([
    { id: '1', rollNo: '1', name: 'Aarav Sharma', status: 'Present' },
    { id: '2', rollNo: '2', name: 'Diya Patel', status: 'Present' },
    { id: '3', rollNo: '3', name: 'Kabir Verma', status: 'Absent' },
    { id: '4', rollNo: '4', name: 'Ananya Iyer', status: 'Present' },
    { id: '5', rollNo: '5', name: 'Vihaan Gupta', status: 'Late' }
  ]);

  const [leaveRequests, setLeaveRequests] = useState([
    { id: '1', requester: 'Mrs. Sunita Rao', role: 'Teacher', type: 'Medical Leave', dates: '2026-07-20 to 2026-07-22', reason: 'Viral infection', status: 'Pending' },
    { id: '2', requester: 'Mr. Anil Joshi', role: 'Teacher', type: 'Casual Leave', dates: '2026-07-25', reason: 'Personal work', status: 'Approved' },
    { id: '3', requester: 'Somnath Lal', role: 'Lab Assistant', type: 'Casual Leave', dates: '2026-07-18', reason: 'Family event', status: 'Pending' }
  ]);

  const [staffLogs, setStaffLogs] = useState([
    { id: '1', name: 'Dr. Ramesh Kumar', role: 'Teacher', clockIn: '07:48 AM', clockOut: '02:05 PM', status: 'Present' },
    { id: '2', name: 'Mrs. Sunita Rao', role: 'Teacher', clockIn: '07:55 AM', clockOut: '02:00 PM', status: 'Present' },
    { id: '3', name: 'Somnath Lal', role: 'Lab Assistant', clockIn: '08:15 AM', clockOut: '--', status: 'Late' }
  ]);

  // Filters for student roll call
  const [selectedClass, setSelectedClass] = useState('10');
  const [selectedSection, setSelectedSection] = useState('A');

  const toggleStudentStatus = (id, current) => {
    const nextMap = { 'Present': 'Absent', 'Absent': 'Late', 'Late': 'Present' };
    setStudentRollCall(prev => prev.map(s => s.id === id ? { ...s, status: nextMap[current] } : s));
  };

  const handleMarkAllPresent = () => {
    setStudentRollCall(prev => prev.map(s => ({ ...s, status: 'Present' })));
    showToast('All students marked present!', 'success');
  };

  const handleReviewLeave = (id, approve) => {
    setLeaveRequests(prev => prev.map(r => r.id === id ? { ...r, status: approve ? 'Approved' : 'Rejected' } : r));
    showToast(`Leave request ${approve ? 'approved' : 'rejected'} successfully`, 'success');
  };

  const studentColumns = [
    { header: 'Roll No', key: 'rollNo', render: (val) => <span className="font-bold">{val}</span> },
    { header: 'Student Name', key: 'name' },
    { header: 'Class Status', key: 'status', render: (val, row) => (
      <button
        onClick={() => toggleStudentStatus(row.id, val)}
        className={`px-3 py-1 text-xs font-bold rounded-lg border shadow-sm transition-all select-none ${
          val === 'Present' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
          val === 'Absent' ? 'bg-rose-50 text-rose-700 border-rose-200' :
          'bg-amber-50 text-amber-700 border-amber-200'
        }`}
      >
        {val}
      </button>
    )},
    { header: 'Toggle Option', key: 'action', render: (_, row) => (
      <span className="text-[10px] text-slate-400 font-semibold select-none">Click status button to change</span>
    )}
  ];

  const leaveColumns = [
    { header: 'Applicant', key: 'requester', render: (val, row) => (
      <div>
        <span className="font-bold block">{val}</span>
        <span className="text-[9px] text-slate-400 font-bold uppercase">{row.role}</span>
      </div>
    )},
    { header: 'Leave Type', key: 'type' },
    { header: 'Target Dates', key: 'dates' },
    { header: 'Reason', key: 'reason' },
    { header: 'Status', key: 'status', render: (val) => (
      <Badge variant={val === 'Approved' ? 'success' : val === 'Rejected' ? 'danger' : 'warning'}>{val}</Badge>
    )},
    { header: 'Actions', key: 'actions', render: (_, row) => {
      if (row.status !== 'Pending') return null;
      return (
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <button 
            onClick={() => handleReviewLeave(row.id, true)}
            className="p-1 hover:bg-slate-100 rounded text-emerald-600"
            title="Approve Leave"
          >
            <Check className="w-4 h-4 stroke-[3px]" />
          </button>
          <button 
            onClick={() => handleReviewLeave(row.id, false)}
            className="p-1 hover:bg-slate-100 rounded text-rose-500"
            title="Reject Leave"
          >
            <X className="w-4 h-4 stroke-[3px]" />
          </button>
        </div>
      );
    }}
  ];

  const staffColumns = [
    { header: 'Employee', key: 'name', render: (val, row) => (
      <div>
        <span className="font-bold block">{val}</span>
        <span className="text-[9px] text-slate-400 font-bold uppercase">{row.role}</span>
      </div>
    )},
    { header: 'Clock In', key: 'clockIn' },
    { header: 'Clock Out', key: 'clockOut' },
    { header: 'Status', key: 'status', render: (val) => (
      <Badge variant={val === 'Present' ? 'success' : 'warning'}>{val}</Badge>
    )}
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Attendance & Leave Control" 
        subtitle="Mark student rolls, audit teacher clock-in logs, and evaluate employee leaves."
        actions={
          activeTab === 'student' && (
            <button
              onClick={handleMarkAllPresent}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Mark All Present</span>
            </button>
          )
        }
      />

      <Tabs 
        tabs={[
          { id: 'student', label: 'Student Roll Call', count: studentRollCall.length },
          { id: 'staff', label: 'Teacher & Staff Logs', count: staffLogs.length },
          { id: 'leave', label: 'Leave Requests', count: leaveRequests.length }
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        {activeTab === 'student' && (
          <div className="space-y-4">
            <div className="flex gap-4 p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 rounded-2xl">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Class:</span>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="text-xs font-bold border rounded-lg p-1.5 dark:bg-slate-900 focus:outline-none"
                >
                  <option value="10">Class 10</option>
                  <option value="9">Class 9</option>
                  <option value="8">Class 8</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Section:</span>
                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="text-xs font-bold border rounded-lg p-1.5 dark:bg-slate-900 focus:outline-none"
                >
                  <option value="A">Section A</option>
                  <option value="B">Section B</option>
                </select>
              </div>
            </div>
            <DataTable columns={studentColumns} data={studentRollCall} />
          </div>
        )}

        {activeTab === 'staff' && <DataTable columns={staffColumns} data={staffLogs} />}
        {activeTab === 'leave' && <DataTable columns={leaveColumns} data={leaveRequests} />}
      </div>

      <ToastComponent />
    </div>
  );
};
export default AttendanceManagement;
