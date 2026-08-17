import React, { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { EmployeeCard } from '../../components/ui/EmployeeCard';
import { useToast } from '../../components/ui/Toast';
import { useAppStore } from '../../../../shared/store/useAppStore';
import { UserPlus, Search, SlidersHorizontal, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const EmployeeList = () => {
  const { store, updateStore } = useAppStore();
  const employees = store.staff || [];
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const navigate = useNavigate();
  const { showToast, ToastComponent } = useToast();

  const handleDeactivate = (emp) => {
    const nextStatus = emp.status === 'Active' ? 'Inactive' : 'Active';
    updateStore(prev => ({
      ...prev,
      staff: prev.staff.map(e => e.id === emp.id ? { ...e, status: nextStatus } : e)
    }), 'STAFF_STATUS_UPDATED', { id: emp.id, nextStatus });
    showToast(`Employee ${emp.name} status updated to ${nextStatus}!`, 'success');
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (emp.employeeId || emp.id || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = filterDept === 'ALL' || emp.department === filterDept;
    const matchesStatus = filterStatus === 'ALL' || emp.status === filterStatus;

    return matchesSearch && matchesDept && matchesStatus;
  });

  return (
    <div className="space-y-6 text-xs font-semibold">
      <PageHeader 
        title="Employee Directory" 
        subtitle="Access school-wide staff profiles, manage roles designations, transfer departments, or update profile info." 
        actions={
          <button
            onClick={() => navigate('/hr/employees/new')}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-sm transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Employee</span>
          </button>
        }
      />

      {/* Advanced Filters */}
      <div className="bg-white dark:bg-slate-900 border border-border rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search staff by name or Employee ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 text-foreground pl-9 pr-4 py-2.5 rounded-xl border border-border focus:outline-none"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-2.5 w-full md:w-auto shrink-0">
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 text-foreground px-3 py-2.5 rounded-xl border border-border cursor-pointer focus:outline-none"
            >
              <option value="ALL">All Departments</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Science">Science</option>
              <option value="Finance">Finance</option>
              <option value="Administration">Administration</option>
              <option value="Transport & Logistics">Transport & Logistics</option>
              <option value="Library">Library</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 text-foreground px-3 py-2.5 rounded-xl border border-border cursor-pointer focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEmployees.map((emp) => (
          <EmployeeCard 
            key={emp.id} 
            employee={emp} 
            onDeactivate={() => handleDeactivate(emp)}
          />
        ))}
      </div>

      <ToastComponent />
    </div>
  );
};
export default EmployeeList;
