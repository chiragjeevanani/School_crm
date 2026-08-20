import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useToast } from '../../components/ui/Toast';
import { hrApi } from '../../../../shared/api/client';
import { Building, Plus, Trash2, Edit2, Users, RefreshCw, AlertCircle } from 'lucide-react';

export const DepartmentManagement = () => {
  const { showToast, ToastComponent } = useToast();

  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [deleteDeptId, setDeleteDeptId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [headEmployeeId, setHeadEmployeeId] = useState('');
  const [headEmployeeName, setHeadEmployeeName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('ACTIVE');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [deptRes, empRes] = await Promise.all([
        hrApi.departments(),
        hrApi.employees({ limit: 200 }),
      ]);
      if (deptRes?.success) setDepartments(deptRes.data || []);
      if (empRes?.success) setEmployees(empRes.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (dept = null) => {
    setEditingDept(dept);
    if (dept) {
      setName(dept.name || '');
      setCode(dept.code || '');
      setHeadEmployeeId(dept.headEmployeeId || '');
      setHeadEmployeeName(dept.headEmployeeName || '');
      setDescription(dept.description || '');
      setStatus(dept.status || 'ACTIVE');
    } else {
      setName('');
      setCode('');
      setHeadEmployeeId('');
      setHeadEmployeeName('');
      setDescription('');
      setStatus('ACTIVE');
    }
    setShowModal(true);
  };

  const handleHeadChange = (e) => {
    const selectedId = e.target.value;
    setHeadEmployeeId(selectedId);
    const emp = employees.find((emp) => emp.id === selectedId);
    setHeadEmployeeName(emp ? emp.name : '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        code: code.trim() || name.slice(0, 3).toUpperCase(),
        headEmployeeId: headEmployeeId || null,
        headEmployeeName: headEmployeeName || '',
        description: description.trim(),
        status,
      };

      if (editingDept) {
        const res = await hrApi.updateDepartment(editingDept.id, payload);
        setDepartments((prev) =>
          prev.map((d) => (d.id === editingDept.id ? { ...d, ...res.data } : d))
        );
        showToast(`Department ${name} updated successfully!`, 'success');
      } else {
        const res = await hrApi.createDepartment(payload);
        setDepartments((prev) => [...prev, res.data]);
        showToast(`Department ${name} created successfully!`, 'success');
      }
      setShowModal(false);
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Failed to save department', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDeptId) return;
    try {
      await hrApi.deleteDepartment(deleteDeptId);
      setDepartments((prev) => prev.filter((d) => d.id !== deleteDeptId));
      showToast('Department removed successfully.', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Failed to delete department', 'error');
    } finally {
      setDeleteDeptId(null);
    }
  };

  return (
    <div className="space-y-6 text-xs font-semibold">
      <PageHeader
        title="Department Management"
        subtitle="Organize school administrative branches, assign HOD heads, and monitor dynamic employee headcounts."
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={fetchData}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Department</span>
            </button>
          </div>
        }
      />

      {error && (
        <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 p-4 rounded-2xl text-rose-700 dark:text-rose-400 text-xs font-semibold flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchData} className="underline font-bold cursor-pointer">Retry</button>
        </div>
      )}

      {/* Departments Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-48 bg-slate-100 dark:bg-slate-800/60 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : departments.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-12 text-center text-slate-400 space-y-3">
          <Building className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700" />
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">No departments configured</h4>
          <p className="text-xs max-w-sm mx-auto">
            Get started by creating departments like Academic, Administration, Transport, Library, or Accounts.
          </p>
          <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold inline-block mt-2 cursor-pointer"
          >
            + Create First Department
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {departments.map((dept) => (
            <div
              key={dept.id}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-all space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-2xl shrink-0">
                    <Building className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block truncate">
                      {dept.code || 'DEPT'}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {dept.name}
                    </h4>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    dept.status === 'ACTIVE'
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {dept.status}
                </span>
              </div>

              {dept.description && (
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {dept.description}
                </p>
              )}

              <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                  <span>Head of Department:</span>
                  <span className="font-bold text-slate-900 dark:text-white truncate max-w-[140px]">
                    {dept.headEmployeeName || 'Not Assigned'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                  <span>Active Members:</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {dept.employeeCount || 0} Staff
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                <button
                  type="button"
                  onClick={() => handleOpenModal(dept)}
                  className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Edit Department"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteDeptId(dept.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                  title="Delete Department"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-100">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              {editingDept ? 'Edit Department' : 'Create New Department'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-slate-700 dark:text-slate-300 font-bold">Department Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Science & Technology"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 dark:text-slate-300 font-bold">Department Code</label>
                <input
                  type="text"
                  placeholder="e.g. SCI"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-xs uppercase"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 dark:text-slate-300 font-bold">Head of Department (HOD)</label>
                <select
                  value={headEmployeeId}
                  onChange={handleHeadChange}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-xs font-semibold cursor-pointer"
                >
                  <option value="">Select an employee...</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.employeeId})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 dark:text-slate-300 font-bold">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-xs font-semibold cursor-pointer"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 dark:text-slate-300 font-bold">Description</label>
                <textarea
                  placeholder="Brief description of department scope..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="3"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-xs cursor-pointer disabled:opacity-60"
                >
                  {submitting ? 'Saving...' : editingDept ? 'Update Department' : 'Create Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteDeptId && (
        <ConfirmDialog
          isOpen={Boolean(deleteDeptId)}
          title="Delete Department"
          message="Are you sure you want to delete this department? Existing employees assigned to this department will not be deleted but may need reassignment."
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteDeptId(null)}
          confirmVariant="danger"
          confirmText="Delete Department"
        />
      )}

      <ToastComponent />
    </div>
  );
};
export default DepartmentManagement;
