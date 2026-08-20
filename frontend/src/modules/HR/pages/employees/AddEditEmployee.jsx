import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { useToast } from '../../components/ui/Toast';
import { hrApi } from '../../../../shared/api/client';
import { ArrowLeft, Check, ChevronRight, User, Building, BadgeCent, Lock, AlertCircle } from 'lucide-react';

export const AddEditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast, ToastComponent } = useToast();

  const isEdit = Boolean(id);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState(null);

  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    employeeType: 'STAFF',
    employeeId: '',
    name: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: 'MALE',
    joiningDate: new Date().toISOString().split('T')[0],
    department: '',
    designation: '',
    role: 'HR',
    basicSalary: 35000,
    status: 'ACTIVE',
    photo: '',
    password: '',
    bankDetails: {
      accountName: '',
      accountNumber: '',
      ifscCode: '',
      bankName: '',
      branchName: '',
      accountType: 'SALARY',
    },
  });

  useEffect(() => {
    loadMetadata();
    if (isEdit) {
      loadEmployee();
    }
  }, [id]);

  const loadMetadata = async () => {
    try {
      const [deptRes, desigRes] = await Promise.all([
        hrApi.departments(),
        hrApi.designations(),
      ]);
      if (deptRes?.success) setDepartments(deptRes.data || []);
      if (desigRes?.success) setDesignations(desigRes.data || []);
    } catch {
      // Ignored
    }
  };

  const loadEmployee = async () => {
    setFetching(true);
    try {
      const res = await hrApi.getEmployee(id);
      if (res?.success && res.data) {
        const emp = res.data;
        setFormData({
          employeeType: emp.employeeType || 'STAFF',
          employeeId: emp.employeeId || '',
          name: emp.name || '',
          firstName: emp.firstName || emp.name?.split(' ')[0] || '',
          lastName: emp.lastName || emp.name?.split(' ').slice(1).join(' ') || '',
          email: emp.email || '',
          phone: emp.phone || '',
          gender: emp.gender || 'MALE',
          joiningDate: emp.joiningDate ? emp.joiningDate.split('T')[0] : '',
          department: emp.department || '',
          designation: emp.designation || '',
          role: emp.designation || 'STAFF',
          basicSalary: emp.basicSalary || 0,
          status: emp.status || 'ACTIVE',
          photo: emp.photo || '',
          password: '',
          bankDetails: emp.bankDetails || {
            accountName: emp.name || '',
            accountNumber: '',
            ifscCode: '',
            bankName: '',
            branchName: '',
            accountType: 'SALARY',
          },
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load employee record');
    } finally {
      setFetching(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBankChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      bankDetails: {
        ...prev.bankDetails,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = {
        ...formData,
        basicSalary: Number(formData.basicSalary) || 0,
      };

      if (isEdit) {
        await hrApi.updateEmployee(id, payload);
        showToast(`Employee ${formData.name} updated successfully!`, 'success');
      } else {
        await hrApi.createEmployee(payload);
        showToast(`Employee ${formData.name} registered in staff directory!`, 'success');
      }
      setTimeout(() => navigate('/hr/employees'), 800);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save employee profile');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
        <div className="h-96 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" />
      </div>
    );
  }

  const steps = [
    { num: 1, label: 'Identity & Contact', icon: User },
    { num: 2, label: 'Department & Role', icon: Building },
    { num: 3, label: 'Salary & Banking', icon: BadgeCent },
    { num: 4, label: 'Access & Security', icon: Lock },
  ];

  return (
    <div className="space-y-6 text-xs font-semibold max-w-4xl mx-auto">
      <button
        onClick={() => navigate('/hr/employees')}
        className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Directory</span>
      </button>

      <PageHeader
        title={isEdit ? `Edit Staff Profile: ${formData.name}` : 'Register New Employee'}
        subtitle="Complete the multi-step profile form to onboard or update staff in database."
      />

      {error && (
        <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 p-4 rounded-2xl text-rose-700 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Step Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {steps.map((s) => {
          const Icon = s.icon;
          const isDone = step > s.num;
          const isCurrent = step === s.num;

          return (
            <button
              key={s.num}
              type="button"
              onClick={() => setStep(s.num)}
              className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                isCurrent
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-500 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20'
                  : isDone
                  ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200'
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200/60 dark:border-slate-850 text-slate-400'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                  isCurrent
                    ? 'bg-indigo-600 text-white'
                    : isDone
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                }`}
              >
                {isDone ? <Check className="w-3.5 h-3.5" /> : s.num}
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 font-bold block">STEP 0{s.num}</span>
                <span className="text-xs font-bold block truncate">{s.label}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
        {/* Step 1: Identity & Contact */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              Step 1: Identity & Contact Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-slate-700 dark:text-slate-300 font-bold">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. Ramesh Chandra"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-700 dark:text-slate-300 font-bold">Official Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="ramesh@school.edu"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-700 dark:text-slate-300 font-bold">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+91 98765 43210"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-700 dark:text-slate-300 font-bold">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-xs font-semibold cursor-pointer"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-700 dark:text-slate-300 font-bold">Employee ID Code</label>
                <input
                  type="text"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleInputChange}
                  placeholder="Leave blank to auto-generate"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-700 dark:text-slate-300 font-bold">Joining Date</label>
                <input
                  type="date"
                  name="joiningDate"
                  value={formData.joiningDate}
                  onChange={handleInputChange}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-xs cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Department & Role */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              Step 2: Department, Designation & Staff Category
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-slate-700 dark:text-slate-300 font-bold">Staff Classification *</label>
                <select
                  name="employeeType"
                  value={formData.employeeType}
                  onChange={handleInputChange}
                  disabled={isEdit}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-xs font-semibold cursor-pointer disabled:opacity-60"
                >
                  <option value="STAFF">Non-Teaching Staff (Admin/HR/Finance)</option>
                  <option value="TEACHER">Teaching Staff (Faculty/Instructor)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-700 dark:text-slate-300 font-bold">Employment Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-xs font-semibold cursor-pointer"
                >
                  <option value="ACTIVE">Active (Working)</option>
                  <option value="INACTIVE">Inactive (Resigned/Suspended)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-700 dark:text-slate-300 font-bold">Department</label>
                <input
                  type="text"
                  name="department"
                  list="deptList"
                  value={formData.department}
                  onChange={handleInputChange}
                  placeholder="Select or enter department"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-xs"
                />
                <datalist id="deptList">
                  {departments.map((d) => (
                    <option key={d.id} value={d.name} />
                  ))}
                </datalist>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-700 dark:text-slate-300 font-bold">Designation / Title</label>
                <input
                  type="text"
                  name="designation"
                  list="desigList"
                  value={formData.designation}
                  onChange={handleInputChange}
                  placeholder="e.g. Senior Teacher, HR Executive"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-xs"
                />
                <datalist id="desigList">
                  {designations.map((d) => (
                    <option key={d.id} value={d.title} />
                  ))}
                </datalist>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Salary & Banking */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              Step 3: Basic Salary & Banking Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-slate-700 dark:text-slate-300 font-bold">Basic Monthly Salary (₹) *</label>
                <input
                  type="number"
                  name="basicSalary"
                  value={formData.basicSalary}
                  onChange={handleInputChange}
                  min="0"
                  step="500"
                  required
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-700 dark:text-slate-300 font-bold">Account Holder Name</label>
                <input
                  type="text"
                  name="accountName"
                  value={formData.bankDetails.accountName}
                  onChange={handleBankChange}
                  placeholder={formData.name || 'Account holder name'}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-700 dark:text-slate-300 font-bold">Account Number</label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.bankDetails.accountNumber}
                  onChange={handleBankChange}
                  placeholder="e.g. 501002348911"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-700 dark:text-slate-300 font-bold">IFSC Code</label>
                <input
                  type="text"
                  name="ifscCode"
                  value={formData.bankDetails.ifscCode}
                  onChange={handleBankChange}
                  placeholder="e.g. HDFC0001024"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-xs uppercase"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-700 dark:text-slate-300 font-bold">Bank Name</label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankDetails.bankName}
                  onChange={handleBankChange}
                  placeholder="e.g. HDFC Bank"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-700 dark:text-slate-300 font-bold">Branch Name</label>
                <input
                  type="text"
                  name="branchName"
                  value={formData.bankDetails.branchName}
                  onChange={handleBankChange}
                  placeholder="e.g. Sector 18 Branch"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Security & Password */}
        {step === 4 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              Step 4: Portal Security & Login Password
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-slate-700 dark:text-slate-300 font-bold">
                  {isEdit ? 'Update Password (leave blank to keep current)' : 'Initial Password'}
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-700 dark:text-slate-300 font-bold">System Role Assignment</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-xs font-semibold cursor-pointer"
                >
                  <option value="TEACHER">Teacher</option>
                  <option value="HR">HR Staff</option>
                  <option value="LIBRARIAN">Librarian</option>
                  <option value="ACCOUNTANT">Accountant</option>
                  <option value="TRANSPORT">Transport Staff</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Navigation & Submit Buttons */}
        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-5">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold transition-colors cursor-pointer"
            >
              Previous Step
            </button>
          ) : <div />}

          <div className="flex items-center gap-2">
            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-xs transition-colors cursor-pointer"
              >
                <span>Continue to Step 0{step + 1}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-60"
              >
                <Check className="w-4 h-4" />
                <span>{loading ? 'Saving Profile...' : isEdit ? 'Update Profile' : 'Complete Registration'}</span>
              </button>
            )}
          </div>
        </div>
      </form>

      <ToastComponent />
    </div>
  );
};
export default AddEditEmployee;
