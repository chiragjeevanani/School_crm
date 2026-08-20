import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { EmployeeCard } from '../../components/ui/EmployeeCard';
import { useToast } from '../../components/ui/Toast';
import { hrApi } from '../../../../shared/api/client';
import { UserPlus, Search, Building, RefreshCw, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterType, setFilterType] = useState('ALL');

  const navigate = useNavigate();
  const { showToast, ToastComponent } = useToast();

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [empRes, deptRes] = await Promise.all([
        hrApi.employees(),
        hrApi.departments(),
      ]);
      if (empRes?.success) {
        setEmployees(empRes.data || []);
      }
      if (deptRes?.success) {
        setDepartments(deptRes.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load employee directory');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (emp) => {
    const nextStatus = emp.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await hrApi.updateEmployeeStatus(emp.id, nextStatus);
      setEmployees((prev) =>
        prev.map((e) => (e.id === emp.id ? { ...e, status: nextStatus } : e))
      );
      showToast(`Employee ${emp.name} is now ${nextStatus}!`, 'success');
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Failed to update status', 'error');
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      !searchTerm ||
      (emp.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (emp.employeeId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (emp.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (emp.designation || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept =
      filterDept === 'ALL' ||
      (emp.department || '').toLowerCase() === filterDept.toLowerCase();

    const matchesStatus =
      filterStatus === 'ALL' ||
      (emp.status || '').toUpperCase() === filterStatus.toUpperCase();

    const matchesType =
      filterType === 'ALL' ||
      (emp.employeeType || '').toUpperCase() === filterType.toUpperCase();

    return matchesSearch && matchesDept && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6 text-xs font-semibold">
      <PageHeader
        title="Employee Directory"
        subtitle="Manage school-wide teaching and non-teaching staff profiles, status, designations, and contact cards."
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={fetchInitialData}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors cursor-pointer"
              title="Refresh Directory"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/hr/employees/new')}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-xs transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Employee</span>
            </button>
          </div>
        }
      />

      {/* Advanced Filters Desk */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search staff by name, Employee ID, email, or designation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 text-xs"
            />
          </div>

          <div className="grid grid-cols-3 gap-2.5 w-full md:w-auto shrink-0">
            {/* Department Filter */}
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer focus:outline-none text-xs font-semibold"
            >
              <option value="ALL">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>

            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer focus:outline-none text-xs font-semibold"
            >
              <option value="ALL">All Staff Types</option>
              <option value="TEACHER">Teaching Staff</option>
              <option value="STAFF">Non-Teaching Staff</option>
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer focus:outline-none text-xs font-semibold"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 p-4 rounded-2xl text-rose-700 dark:text-rose-400 text-xs font-semibold flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchInitialData} className="underline hover:no-underline font-bold cursor-pointer">Retry</button>
        </div>
      )}

      {/* Directory Grid with Skeleton Loader */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-56 bg-slate-100 dark:bg-slate-800/60 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : filteredEmployees.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-12 text-center text-slate-400 space-y-3">
          <Users className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700" />
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">No employees found</h4>
          <p className="text-xs max-w-sm mx-auto">
            {searchTerm || filterDept !== 'ALL' || filterStatus !== 'ALL' || filterType !== 'ALL'
              ? 'No staff members match the selected search or filter criteria.'
              : 'Your employee directory is empty. Click "Add Employee" above to register staff.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEmployees.map((emp) => (
            <EmployeeCard
              key={emp.id}
              employee={emp}
              onViewProfile={() => navigate(`/hr/employees/${emp.id}`)}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </div>
      )}

      <ToastComponent />
    </div>
  );
};
export default EmployeeList;
