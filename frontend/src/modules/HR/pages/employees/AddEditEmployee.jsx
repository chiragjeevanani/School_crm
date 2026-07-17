import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { useToast } from '../../components/ui/Toast';
import { MOCK_EMPLOYEES } from '../../utils/constants';
import { ArrowLeft, Check, ChevronRight } from 'lucide-react';

export const AddEditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast, ToastComponent } = useToast();

  const isEdit = Boolean(id);
  const employee = MOCK_EMPLOYEES.find(e => e.id === id);

  const [step, setStep] = useState(1);

  // Unified Form state matching MongoDB schemas
  const [formData, setFormData] = useState({
    name: employee?.name || '',
    gender: employee?.gender || 'Female',
    dob: employee?.dob || '',
    email: employee?.email || '',
    phone: employee?.phone || '',
    address: employee?.address || '',
    department: employee?.department || 'Mathematics',
    designation: employee?.designation || 'Senior Teacher',
    employmentType: employee?.employmentType || 'Full-Time',
    joiningDate: employee?.joiningDate || '',
    basicSalary: employee?.salary.basic || 40000,
    hra: employee?.salary.hra || 8000,
    da: employee?.salary.da || 4000,
    bankName: employee?.bankDetails.bankName || 'State Bank of India',
    accountNo: employee?.bankDetails.accountNo || '',
    ifsc: employee?.bankDetails.ifsc || '',
    aadhaarNo: employee?.aadhaarNo || '',
    panNo: employee?.panNo || '',
    pfNo: employee?.pfNo || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNextStep = () => {
    setStep(prev => Math.min(prev + 1, 5));
  };

  const handlePrevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    showToast(
      isEdit 
        ? `Employee ${formData.name} record changes saved.` 
        : `Employee GFS-EMP-${Math.floor(Math.random()*900)+100} (${formData.name}) registered in staff directory!`, 
      'success'
    );
    setTimeout(() => {
      navigate('/hr/employees');
    }, 1500);
  };

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
        title={isEdit ? `Edit Employee File: ${formData.name}` : "Register New Employee File"} 
        subtitle="Complete the 5-step registration wizard details to append file records to Greenfield Staff Directory database." 
      />

      {/* Progress Wizard tracker */}
      <div className="bg-white dark:bg-slate-900 border rounded-3xl p-4 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
        {[
          { id: 1, label: 'Personal Info' },
          { id: 2, label: 'Employment' },
          { id: 3, label: 'Salary structure' },
          { id: 4, label: 'Bank & ID' },
          { id: 5, label: 'Verify docs' }
        ].map((s) => {
          const isActive = s.id === step;
          const isDone = s.id < step;
          return (
            <div key={s.id} className="flex items-center gap-2 shrink-0">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold border transition-all ${
                isDone 
                  ? 'bg-rose-600 border-rose-600 text-white' 
                  : isActive 
                  ? 'bg-rose-50 border-rose-200 text-rose-650 dark:bg-rose-955/20' 
                  : 'bg-slate-50 border text-slate-400'
              }`}>
                {isDone ? <Check className="w-3 h-3" /> : s.id}
              </div>
              <span className={`text-[10px] uppercase font-bold tracking-wider ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                {s.label}
              </span>
              {s.id < 5 && <ChevronRight className="w-3.5 h-3.5 text-slate-300" />}
            </div>
          );
        })}
      </div>

      {/* Wizard Form pages */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
        
        {/* Step 1: Personal Info */}
        {step === 1 && (
          <div className="space-y-4">
            <span className="text-[10px] font-black uppercase text-slate-400 block border-b pb-2">Step 1: Personal Information</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label>Authorized Staff Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  required
                  placeholder="e.g. Priya Nair"
                  className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border focus:outline-none focus:ring-1 focus:ring-rose-605" 
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label>Gender</label>
                  <select 
                    name="gender" 
                    value={formData.gender} 
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border cursor-pointer focus:outline-none focus:ring-1 focus:ring-rose-605"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label>Date of Birth</label>
                  <input 
                    type="date" 
                    name="dob" 
                    value={formData.dob} 
                    onChange={handleInputChange} 
                    required
                    className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border focus:outline-none focus:ring-1 focus:ring-rose-605" 
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label>Email ID</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleInputChange} 
                  required
                  placeholder="e.g. priya@school.edu"
                  className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border focus:outline-none focus:ring-1 focus:ring-rose-605" 
                />
              </div>
              <div className="space-y-1">
                <label>Phone Number</label>
                <input 
                  type="text" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleInputChange} 
                  required
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border focus:outline-none focus:ring-1 focus:ring-rose-605" 
                />
              </div>
            </div>

            <div className="space-y-1">
              <label>Residential Address</label>
              <textarea 
                rows={2} 
                name="address" 
                value={formData.address} 
                onChange={handleInputChange}
                required
                className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border focus:outline-none focus:ring-1 focus:ring-rose-605"
              />
            </div>
          </div>
        )}

        {/* Step 2: Employment */}
        {step === 2 && (
          <div className="space-y-4">
            <span className="text-[10px] font-black uppercase text-slate-400 block border-b pb-2">Step 2: School Employment details</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label>Department</label>
                <select 
                  name="department" 
                  value={formData.department} 
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border cursor-pointer focus:outline-none focus:ring-1 focus:ring-rose-650"
                >
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="PE & Sports">PE & Sports</option>
                  <option value="Finance">Finance</option>
                  <option value="Administration">Administration</option>
                </select>
              </div>

              <div className="space-y-1">
                <label>Designation</label>
                <select 
                  name="designation" 
                  value={formData.designation} 
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border cursor-pointer focus:outline-none focus:ring-1 focus:ring-rose-650"
                >
                  <option value="Senior Teacher">Senior Teacher</option>
                  <option value="Junior Teacher">Junior Teacher</option>
                  <option value="HOD">HOD</option>
                  <option value="Accountant">Accountant</option>
                  <option value="Sports Instructor">Sports Instructor</option>
                </select>
              </div>

              <div className="space-y-1">
                <label>Employment Type Status</label>
                <select 
                  name="employmentType" 
                  value={formData.employmentType} 
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 dark:bg-slate-955 p-2.5 rounded-xl border cursor-pointer focus:outline-none focus:ring-1 focus:ring-rose-650"
                >
                  <option value="Full-Time">Full-Time Staff</option>
                  <option value="Part-Time">Part-Time Staff</option>
                  <option value="Contract">Contractual Basis</option>
                </select>
              </div>

              <div className="space-y-1">
                <label>Joining Date</label>
                <input 
                  type="date" 
                  name="joiningDate" 
                  value={formData.joiningDate} 
                  onChange={handleInputChange} 
                  required
                  className="w-full bg-slate-50 dark:bg-slate-955 p-2.5 rounded-xl border focus:outline-none focus:ring-1 focus:ring-rose-650" 
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Salary structure */}
        {step === 3 && (
          <div className="space-y-4">
            <span className="text-[10px] font-black uppercase text-slate-400 block border-b pb-2">Step 3: Monthly Salary allowances structure</span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label>Basic Pay Scale band (INR)</label>
                <input 
                  type="number" 
                  name="basicSalary" 
                  value={formData.basicSalary} 
                  onChange={handleInputChange} 
                  required
                  className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border focus:outline-none focus:ring-1 focus:ring-rose-650" 
                />
              </div>

              <div className="space-y-1">
                <label>HRA Allowance (INR)</label>
                <input 
                  type="number" 
                  name="hra" 
                  value={formData.hra} 
                  onChange={handleInputChange} 
                  required
                  className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border focus:outline-none focus:ring-1 focus:ring-rose-650" 
                />
              </div>

              <div className="space-y-1">
                <label>DA Allowance (INR)</label>
                <input 
                  type="number" 
                  name="da" 
                  value={formData.da} 
                  onChange={handleInputChange} 
                  required
                  className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border focus:outline-none focus:ring-1 focus:ring-rose-650" 
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Bank & ID */}
        {step === 4 && (
          <div className="space-y-4">
            <span className="text-[10px] font-black uppercase text-slate-400 block border-b pb-2">Step 4: Bank accounts & Identity registration</span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label>Aadhaar Card Number</label>
                <input 
                  type="text" 
                  name="aadhaarNo" 
                  value={formData.aadhaarNo} 
                  onChange={handleInputChange} 
                  required
                  placeholder="XXXX XXXX XXXX"
                  className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border focus:outline-none focus:ring-1 focus:ring-rose-650" 
                />
              </div>

              <div className="space-y-1">
                <label>PAN Card Number</label>
                <input 
                  type="text" 
                  name="panNo" 
                  value={formData.panNo} 
                  onChange={handleInputChange} 
                  required
                  placeholder="ABCDE1234F"
                  className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border focus:outline-none focus:ring-1 focus:ring-rose-650" 
                />
              </div>

              <div className="space-y-1">
                <label>PF Account Number</label>
                <input 
                  type="text" 
                  name="pfNo" 
                  value={formData.pfNo} 
                  onChange={handleInputChange} 
                  placeholder="MH12345678901"
                  className="w-full bg-slate-50 dark:bg-slate-955 p-2.5 rounded-xl border focus:outline-none focus:ring-1 focus:ring-rose-650" 
                />
              </div>

              <div className="space-y-1">
                <label>Bank Name</label>
                <input 
                  type="text" 
                  name="bankName" 
                  value={formData.bankName} 
                  onChange={handleInputChange} 
                  required
                  className="w-full bg-slate-50 dark:bg-slate-955 p-2.5 rounded-xl border focus:outline-none focus:ring-1 focus:ring-rose-650" 
                />
              </div>

              <div className="space-y-1 text-left">
                <label>Bank A/C Account Number</label>
                <input 
                  type="text" 
                  name="accountNo" 
                  value={formData.accountNo} 
                  onChange={handleInputChange} 
                  required
                  className="w-full bg-slate-50 dark:bg-slate-955 p-2.5 rounded-xl border focus:outline-none focus:ring-1 focus:ring-rose-650" 
                />
              </div>

              <div className="space-y-1">
                <label>Bank Branch IFSC Code</label>
                <input 
                  type="text" 
                  name="ifsc" 
                  value={formData.ifsc} 
                  onChange={handleInputChange} 
                  required
                  className="w-full bg-slate-50 dark:bg-slate-955 p-2.5 rounded-xl border focus:outline-none focus:ring-1 focus:ring-rose-650" 
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Verification docs checklist */}
        {step === 5 && (
          <div className="space-y-4">
            <span className="text-[10px] font-black uppercase text-slate-400 block border-b pb-2">Step 5: Document locker verification checklists</span>
            <div className="space-y-3.5">
              {[
                'Aadhaar Document copy (.pdf)',
                'PAN Card copy (.pdf)',
                'Resume & Experience letter (.pdf)',
                'Education Qualifications Certificates (.pdf)',
                'Offer & Employment Contract Letter copy (.pdf)'
              ].map((docName, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-955 border rounded-2xl">
                  <input 
                    type="checkbox" 
                    defaultChecked={isEdit}
                    required
                    className="rounded text-rose-600 focus:ring-rose-600 w-4 h-4 cursor-pointer" 
                  />
                  <span>Upload & Verify: <strong className="text-slate-905 dark:text-white">{docName}</strong></span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-850/60 pt-4">
          <button
            type="button"
            onClick={handlePrevStep}
            disabled={step === 1}
            className="px-4 py-2 bg-slate-50 border rounded-xl disabled:opacity-40"
          >
            Previous
          </button>

          {step < 5 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-750 text-white rounded-xl font-bold shadow-sm"
            >
              Next Step
            </button>
          ) : (
            <button
              type="submit"
              className="px-4 py-2 bg-rose-605 hover:bg-rose-700 text-white rounded-xl font-bold shadow-sm"
            >
              {isEdit ? 'Save Profile changes' : 'Register Employee'}
            </button>
          )}
        </div>
      </form>

      <ToastComponent />
    </div>
  );
};
export default AddEditEmployee;
