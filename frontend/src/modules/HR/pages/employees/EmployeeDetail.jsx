import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../components/ui/Toast';
import { hrApi } from '../../../../shared/api/client';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  Building,
  Contact,
  BadgeCent,
  ShieldCheck,
  Award,
  FileText,
  Clock,
  Download,
  AlertCircle,
  ExternalLink
} from 'lucide-react';

export const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast, ToastComponent } = useToast();

  const [employee, setEmployee] = useState(null);
  const [leaveBalance, setLeaveBalance] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [payrolls, setPayrolls] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchEmployeeDetails();
  }, [id]);

  const fetchEmployeeDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const [empRes, balRes, leavesRes, payRes, revRes] = await Promise.all([
        hrApi.getEmployee(id),
        hrApi.leaveBalance(id).catch(() => null),
        hrApi.leaves({ employeeRefId: id }).catch(() => null),
        hrApi.payrolls({ employeeRefId: id }).catch(() => null),
        hrApi.reviews({ employeeRefId: id }).catch(() => null),
      ]);

      if (empRes?.success) {
        setEmployee(empRes.data);
      }
      if (balRes?.success) {
        setLeaveBalance(balRes.data);
      }
      if (leavesRes?.success) {
        setLeaves(leavesRes.data || []);
      }
      if (payRes?.success) {
        setPayrolls(payRes.data || []);
      }
      if (revRes?.success) {
        setReviews(revRes.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load employee details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
        <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" />
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center text-slate-400 space-y-4">
        <AlertCircle className="w-10 h-10 mx-auto text-rose-500" />
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
          {error || 'Employee Profile Not Found'}
        </h3>
        <button
          onClick={() => navigate('/hr/employees')}
          className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
        >
          ← Back to Employee Directory
        </button>
      </div>
    );
  }

  const isActive = employee.status === 'ACTIVE' || employee.status === 'Active';

  return (
    <div className="space-y-6 text-xs font-semibold">
      {/* Back Button */}
      <button
        onClick={() => navigate('/hr/employees')}
        className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Employee Directory</span>
      </button>

      {/* Profile Header Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4 min-w-0">
          {employee.photo ? (
            <img
              src={employee.photo}
              alt={employee.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500 shrink-0"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xl flex items-center justify-center border-2 border-indigo-500 shrink-0">
              {employee.name ? employee.name.charAt(0).toUpperCase() : 'E'}
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md">
                {employee.employeeId}
              </span>
              <Badge variant={isActive ? 'success' : 'default'}>
                {isActive ? 'ACTIVE' : 'INACTIVE'}
              </Badge>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
              {employee.name}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {employee.designation || 'Staff'} • {employee.department || 'Department'} • {employee.employeeType || 'STAFF'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/hr/employees/${employee.id}/edit`)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs cursor-pointer"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 overflow-x-auto no-scrollbar">
        {[
          { id: 'overview', label: 'Profile Overview' },
          { id: 'banking', label: 'Bank & Salary' },
          { id: 'leaves', label: `Leaves (${leaves.length})` },
          { id: 'payroll', label: `Payrolls (${payrolls.length})` },
          { id: 'reviews', label: `Performance (${reviews.length})` },
          { id: 'documents', label: `Documents (${employee.documents?.length || 0})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 text-xs font-bold transition-colors cursor-pointer shrink-0 ${
              activeTab === tab.id
                ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              Personal & Contact Information
            </h3>
            <div className="space-y-2.5 text-slate-600 dark:text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-850">
                <span className="text-slate-400">Email Address</span>
                <span className="font-bold text-slate-900 dark:text-white">{employee.email || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-850">
                <span className="text-slate-400">Phone Number</span>
                <span className="font-bold text-slate-900 dark:text-white">{employee.phone || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-850">
                <span className="text-slate-400">Gender</span>
                <span className="font-bold text-slate-900 dark:text-white">{employee.gender || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-850">
                <span className="text-slate-400">Joining Date</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {employee.joiningDate ? new Date(employee.joiningDate).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Record Origin</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">{employee.sourceCollection || 'Database'}</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              Emergency Contact & Organization
            </h3>
            <div className="space-y-2.5 text-slate-600 dark:text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-850">
                <span className="text-slate-400">Department</span>
                <span className="font-bold text-slate-900 dark:text-white">{employee.department || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-850">
                <span className="text-slate-400">Designation</span>
                <span className="font-bold text-slate-900 dark:text-white">{employee.designation || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-850">
                <span className="text-slate-400">Emergency Name</span>
                <span className="font-bold text-slate-900 dark:text-white">{employee.emergencyContact?.name || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-850">
                <span className="text-slate-400">Emergency Phone</span>
                <span className="font-bold text-slate-900 dark:text-white">{employee.emergencyContact?.phone || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Relationship</span>
                <span className="font-bold text-slate-900 dark:text-white">{employee.emergencyContact?.relationship || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Banking */}
      {activeTab === 'banking' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs max-w-2xl space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Banking & Salary Configuration
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between py-1.5 border-b border-slate-50 dark:border-slate-850">
              <span className="text-slate-400">Basic Monthly Salary</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                ₹{Number(employee.basicSalary || 0).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-50 dark:border-slate-850">
              <span className="text-slate-400">Account Holder Name</span>
              <span className="font-bold text-slate-900 dark:text-white">{employee.bankDetails?.accountName || 'N/A'}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-50 dark:border-slate-850">
              <span className="text-slate-400">Account Number</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">{employee.bankDetails?.accountNumber || 'N/A'}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-50 dark:border-slate-850">
              <span className="text-slate-400">IFSC Code</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">{employee.bankDetails?.ifscCode || 'N/A'}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-50 dark:border-slate-850">
              <span className="text-slate-400">Bank & Branch</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {employee.bankDetails?.bankName} {employee.bankDetails?.branchName ? `(${employee.bankDetails.branchName})` : ''}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Leaves */}
      {activeTab === 'leaves' && (
        <div className="space-y-6">
          {leaveBalance && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4">
                <span className="text-xs text-slate-400 font-bold">Casual Leaves Available</span>
                <div className="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                  {leaveBalance.casual?.available} / {leaveBalance.casual?.quota}
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4">
                <span className="text-xs text-slate-400 font-bold">Medical Leaves Available</span>
                <div className="text-xl font-black text-amber-600 dark:text-amber-400 mt-1">
                  {leaveBalance.medical?.available} / {leaveBalance.medical?.quota}
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4">
                <span className="text-xs text-slate-400 font-bold">Paid Leaves Available</span>
                <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                  {leaveBalance.paid?.available} / {leaveBalance.paid?.quota}
                </div>
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Leave Application History</h3>
            {leaves.length === 0 ? (
              <p className="text-slate-400 py-6 text-center">No leave applications recorded.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 text-[11px]">
                      <th className="py-2.5">Leave Type</th>
                      <th>Duration</th>
                      <th>Days</th>
                      <th>Reason</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-850">
                    {leaves.map((l) => (
                      <tr key={l.id} className="py-2.5">
                        <td className="py-2.5 font-bold text-slate-900 dark:text-white">{l.leaveType}</td>
                        <td className="text-slate-600 dark:text-slate-400">{l.startDate} to {l.endDate}</td>
                        <td>{l.totalDays} Days</td>
                        <td className="text-slate-500 max-w-xs truncate">{l.reason}</td>
                        <td>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              l.status === 'APPROVED'
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                                : l.status === 'REJECTED'
                                ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400'
                                : 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400'
                            }`}
                          >
                            {l.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Payroll */}
      {activeTab === 'payroll' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Disbursed Salary History
          </h3>
          {payrolls.length === 0 ? (
            <p className="text-slate-400 py-6 text-center">No payroll vouchers issued yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 text-[11px]">
                    <th className="py-2.5">Payroll Month</th>
                    <th>Gross Earnings</th>
                    <th>Deductions</th>
                    <th>Net Disbursed</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-850">
                  {payrolls.map((p) => (
                    <tr key={p.id} className="py-2.5">
                      <td className="py-2.5 font-bold text-slate-900 dark:text-white">{p.payrollMonth}</td>
                      <td>₹{Number(p.grossEarnings || p.basicSalary || 0).toLocaleString('en-IN')}</td>
                      <td className="text-rose-500">₹{Number(p.totalDeductions || 0).toLocaleString('en-IN')}</td>
                      <td className="font-black text-emerald-600 dark:text-emerald-400">
                        ₹{Number(p.netSalary || 0).toLocaleString('en-IN')}
                      </td>
                      <td>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                          {p.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Reviews */}
      {activeTab === 'reviews' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Performance Appraisals
          </h3>
          {reviews.length === 0 ? (
            <p className="text-slate-400 py-6 text-center">No performance reviews recorded yet.</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r.id} className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-100 dark:border-slate-850 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900 dark:text-white">{r.reviewPeriod}</span>
                    <span className="px-2 py-0.5 bg-amber-50 dark:bg-amber-950 text-amber-600 font-black rounded-lg">
                      ★ {r.rating} / 5
                    </span>
                  </div>
                  {r.strengths && <p><strong className="text-slate-700 dark:text-slate-300">Strengths:</strong> {r.strengths}</p>}
                  {r.goals && <p><strong className="text-slate-700 dark:text-slate-300">Goals:</strong> {r.goals}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 6: Documents */}
      {activeTab === 'documents' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Document Locker
          </h3>
          {(!employee.documents || employee.documents.length === 0) ? (
            <p className="text-slate-400 py-6 text-center">No uploaded documents on record.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {employee.documents.map((doc, idx) => (
                <div key={doc.id || idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-850 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-indigo-500" />
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">{doc.name || `Document ${idx + 1}`}</h4>
                      <p className="text-[10px] text-slate-400">{doc.type || 'Identity File'}</p>
                    </div>
                  </div>
                  {doc.url && (
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-indigo-600 hover:bg-indigo-50 transition-colors"
                      title="Open Document"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <ToastComponent />
    </div>
  );
};
export default EmployeeDetail;
