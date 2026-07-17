import React, { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { EmployeeCard } from '../../components/ui/EmployeeCard';
import { useToast } from '../../components/ui/Toast';
import { MOCK_EMPLOYEES } from '../../utils/constants';
import { UserPlus, Search, SlidersHorizontal, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const EmployeeList = () => {
  const [employees, setEmployees] = useState(MOCK_EMPLOYEES);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterType, setFilterType] = useState('ALL');
  const navigate = useNavigate();
  const { showToast, ToastComponent } = useToast();

  const handleDeactivate = (emp) => {
    setEmployees(prev => prev.map(e => e.id === emp.id ? { ...e, status: e.status === 'Active' ? 'Inactive' : 'Active' } : e));
    showToast(`Employee ${emp.name} status updated!`, 'success');
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = filterDept === 'ALL' || emp.department === filterDept;
    const matchesStatus = filterStatus === 'ALL' || emp.status === filterStatus;
    const matchesType = filterType === 'ALL' || emp.employmentType === filterType;

    return matchesSearch && matchesDept && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6 text-xs font-semibold">
      <PageHeader 
        title="Employee Directory" 
        subtitle="Access school-wide staff profiles, manage roles designations, transfer departments, or update profile info." 
        actions={
          <button
            onClick={() => navigate('/hr/employees/new')}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-rose-650 hover:bg-rose-700 text-white rounded-xl font-bold shadow-sm transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Employee</span>
          </button>
        }
      />

      {/* Advanced Filters */}
      <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search staff by name or Employee ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 text-slate-905 dark:text-white pl-9 pr-4 py-2.5 rounded-xl border focus:border-rose-600 focus:ring-1 focus:ring-rose-600 focus:outline-none"
            />
          </div>
          
          <div className="grid grid-cols-3 gap-2.5 w-full md:w-auto shrink-0">
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 px-3 py-2.5 rounded-xl border cursor-pointer focus:outline-none focus:ring-1 focus:ring-rose-600"
            >
              <option value="ALL">All Departments</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Science">Science</option>
              <option value="Finance">Finance</option>
              <option value="PE & Sports">PE & Sports</option>
              <option value="Administration">Administration</option>
            </select>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 px-3 py-2.5 rounded-xl border cursor-pointer focus:outline-none focus:ring-1 focus:ring-rose-600"
            >
              <option value="ALL">All Types</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Contract">Contract</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-50 dark:bg-slate-955 px-3 py-2.5 rounded-xl border cursor-pointer focus:outline-none focus:ring-1 focus:ring-rose-600"
            >
              <option value="ALL">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredEmployees.map((emp) => (
          <EmployeeCard 
            key={emp.id} 
            employee={emp} 
            onViewProfile={() => navigate(`/hr/employees/${emp.id}`)}
            onEdit={() => navigate(`/hr/employees/${emp.id}/edit`)}
            onDeactivate={handleDeactivate}
          />
        ))}
      </div>

      {filteredEmployees.length === 0 && (
        <div className="bg-white dark:bg-slate-900 border rounded-3xl p-12 text-center text-slate-400">
          No staff files match the selected search/filters filters.
        </div>
      )}

      <ToastComponent />
    </div>
  );
};
export default EmployeeList;
