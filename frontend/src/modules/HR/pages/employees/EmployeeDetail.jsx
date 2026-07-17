import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { Tabs } from '../../components/ui/Tabs';
import { Badge } from '../../components/ui/Badge';
import { SalarySlip } from '../../components/ui/SalarySlip';
import { AttendanceCalendar } from '../../components/ui/AttendanceCalendar';
import { LeaveTimeline } from '../../components/ui/LeaveTimeline';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { MOCK_EMPLOYEES, MOCK_PAYROLL, MOCK_ATTENDANCE, MOCK_LEAVE_REQUESTS, MOCK_REVIEWS } from '../../utils/constants';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ArrowLeft, User, FileText, CheckCircle2, ShieldAlert, Award } from 'lucide-react';

export const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast, ToastComponent } = useToast();
  const [activeTab, setActiveTab] = useState('overview');

  const employee = MOCK_EMPLOYEES.find(e => e.id === id);
  const [showSlipModal, setShowSlipModal] = useState(false);

  if (!employee) {
    return (
      <div className="space-y-4 text-center py-12">
        <p className="text-slate-400">Employee profile not found.</p>
        <button onClick={() => navigate('/hr/employees')} className="text-rose-600 font-bold hover:underline">
          Back to directory
        </button>
      </div>
    );
  }

  // Related data filters
  const employeePayroll = MOCK_PAYROLL.find(p => p.employeeId === employee.id);
  const employeeAttendance = MOCK_ATTENDANCE.filter(a => a.employeeId === employee.id);
  const employeeLeaves = MOCK_LEAVE_REQUESTS.filter(l => l.employeeId === employee.id);
  const employeeReviews = MOCK_REVIEWS.filter(r => r.employeeName === employee.name);

  return (
    <div className="space-y-6 text-xs font-semibold">
      <div className="flex items-center gap-2">
        <button 
          onClick={() => navigate('/hr/employees')}
          className="flex items-center gap-1 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-rose-600"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to directory</span>
        </button>
      </div>

      <PageHeader 
        title={`Employee Profile: ${employee.name}`} 
        subtitle={`Review personal metrics, bank data, qualifications, leaves, payroll history, and documents locker.`}
      />

      <Tabs 
        tabs={[
          { id: 'overview', label: 'Overview profile' },
          { id: 'personal', label: 'Personal Information' },
          { id: 'employment', label: 'Employment Details' },
          { id: 'salary', label: 'Salary Structure' },
          { id: 'documents', label: 'Uploaded Documents' },
          { id: 'attendance', label: 'Attendance logs' },
          { id: 'leave', label: 'Leaves Tracker' },
          { id: 'performance', label: 'Performance Reviews' }
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="bg-white dark:bg-slate-900 border rounded-3xl p-5 shadow-sm space-y-4 text-center lg:col-span-1">
            <img src={employee.photo} alt={employee.name} className="w-24 h-24 rounded-3xl object-cover border mx-auto" />
            <div>
              <h3 className="text-sm font-black mt-1 text-slate-900 dark:text-white">{employee.name}</h3>
              <p className="text-[10px] text-slate-400 mt-1">{employee.designation} • {employee.department}</p>
            </div>
            <div className="flex justify-center gap-2">
              <Badge variant={employee.status === 'Active' ? 'success' : 'danger'}>{employee.status}</Badge>
              <Badge>{employee.employmentType}</Badge>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border rounded-3xl p-5 shadow-sm space-y-4 lg:col-span-2">
            <h4 className="text-[10px] font-black uppercase text-slate-455 tracking-wider border-b pb-2">Quick contact info</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] text-slate-400">Official Email ID</span>
                <p className="font-bold text-slate-805 dark:text-white mt-0.5">{employee.email}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400">Mobile Phone</span>
                <p className="font-bold text-slate-805 dark:text-white mt-0.5">{employee.phone}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Personal */}
      {activeTab === 'personal' && (
        <div className="bg-white dark:bg-slate-900 border rounded-3xl p-6 shadow-sm space-y-4">
          <h4 className="text-[10px] font-black uppercase text-slate-455 tracking-wider border-b pb-2">Personal identification details</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <span className="text-[10px] text-slate-400">Date of Birth</span>
              <p className="font-bold text-slate-805 dark:text-white mt-0.5">{formatDate(employee.dob)}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400">Gender</span>
              <p className="font-bold text-slate-805 dark:text-white mt-0.5">{employee.gender}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400">Residential Address</span>
              <p className="font-bold text-slate-805 dark:text-white mt-0.5">{employee.address}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400">Aadhaar Card No</span>
              <p className="font-bold text-slate-805 dark:text-white mt-0.5">{employee.aadhaarNo}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400">PAN Card No</span>
              <p className="font-bold text-slate-805 dark:text-white mt-0.5">{employee.panNo}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Employment */}
      {activeTab === 'employment' && (
        <div className="bg-white dark:bg-slate-900 border rounded-3xl p-6 shadow-sm space-y-4">
          <h4 className="text-[10px] font-black uppercase text-slate-455 tracking-wider border-b pb-2">School employment records</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <span className="text-[10px] text-slate-400">Employee ID</span>
              <p className="font-bold text-slate-805 dark:text-white mt-0.5">{employee.employeeId}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400">Joining Date</span>
              <p className="font-bold text-slate-805 dark:text-white mt-0.5">{formatDate(employee.joiningDate)}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400">Department</span>
              <p className="font-bold text-slate-805 dark:text-white mt-0.5">{employee.department}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400">Designation</span>
              <p className="font-bold text-slate-805 dark:text-white mt-0.5">{employee.designation}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400">PF Number</span>
              <p className="font-bold text-slate-805 dark:text-white mt-0.5">{employee.pfNo || '--'}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400">ESI Number</span>
              <p className="font-bold text-slate-805 dark:text-white mt-0.5">{employee.esiNo || '--'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Salary */}
      {activeTab === 'salary' && (
        <div className="bg-white dark:bg-slate-900 border rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b">
            <h4 className="text-[10px] font-black uppercase text-slate-455 tracking-wider">Earnings & Allowance Allocation</h4>
            {employeePayroll && (
              <button
                onClick={() => setShowSlipModal(true)}
                className="px-3.5 py-2 bg-rose-600 hover:bg-rose-750 text-white rounded-xl font-bold shadow-sm"
              >
                Generate Payslip View
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4 max-w-md">
            <div className="flex justify-between">
              <span className="text-slate-500">Basic Pay Band</span>
              <span className="font-bold">{formatCurrency(employee.salary.basic)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">HRA Concession</span>
              <span className="font-bold">{formatCurrency(employee.salary.hra)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">DA Allowance</span>
              <span className="font-bold">{formatCurrency(employee.salary.da)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Documents */}
      {activeTab === 'documents' && (
        <div className="bg-white dark:bg-slate-900 border rounded-3xl p-6 shadow-sm space-y-4">
          <span className="text-[10px] font-black uppercase text-slate-455 tracking-wider block border-b pb-2">Uploaded Identity Documents Locker</span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {employee.documents.map((doc, idx) => (
              <div key={idx} className="p-4 border rounded-2xl flex items-center justify-between gap-3 bg-slate-50 dark:bg-slate-955">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-rose-500" />
                  <div>
                    <span className="font-bold block">{doc.type}</span>
                    <Badge variant={doc.verified ? 'success' : 'warning'} className="mt-1">
                      {doc.verified ? 'Verified' : 'Pending Verification'}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Attendance */}
      {activeTab === 'attendance' && (
        <div className="bg-white dark:bg-slate-900 border rounded-3xl p-6 shadow-sm space-y-4 max-w-md mx-auto">
          <span className="text-[10px] font-black uppercase text-slate-455 tracking-wider block border-b pb-2">Staff Attendance Calendar</span>
          <AttendanceCalendar attendanceRecords={employeeAttendance} />
        </div>
      )}

      {/* Tab: Leave */}
      {activeTab === 'leave' && (
        <div className="bg-white dark:bg-slate-900 border rounded-3xl p-6 shadow-sm space-y-4">
          <span className="text-[10px] font-black uppercase text-slate-455 tracking-wider block border-b pb-2">Leaves timeline tracker</span>
          <LeaveTimeline leaves={employeeLeaves} />
        </div>
      )}

      {/* Tab: Performance */}
      {activeTab === 'performance' && (
        <div className="bg-white dark:bg-slate-900 border rounded-3xl p-6 shadow-sm space-y-4">
          <span className="text-[10px] font-black uppercase text-slate-455 tracking-wider block border-b pb-2">Performance review remarks</span>
          <div className="space-y-4">
            {employeeReviews.map((rev) => (
              <div key={rev.id} className="p-4 border rounded-2xl bg-slate-50 dark:bg-slate-955 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold flex items-center gap-1">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>Rating: {rev.rating} / 5</span>
                  </span>
                </div>
                <p className="italic text-slate-655 dark:text-slate-400">"{rev.remarks}"</p>
              </div>
            ))}

            {employeeReviews.length === 0 && (
              <p className="text-center text-slate-400 py-6">No performance reviews logged.</p>
            )}
          </div>
        </div>
      )}

      {/* Payslip preview modal */}
      {showSlipModal && employeePayroll && (
        <Modal 
          isOpen={true} 
          onClose={() => setShowSlipModal(false)} 
          title="Staff Payslip Copy"
          size="lg"
        >
          <SalarySlip 
            payroll={employeePayroll} 
            employee={employee} 
            onSendEmail={() => showToast('Payslip statement copy emailed to staff.', 'success')}
          />
        </Modal>
      )}

      <ToastComponent />
    </div>
  );
};
export default EmployeeDetail;
