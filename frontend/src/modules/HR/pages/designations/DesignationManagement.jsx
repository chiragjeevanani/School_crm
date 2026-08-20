import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useToast } from '../../components/ui/Toast';
import { hrApi } from '../../../../shared/api/client';
import { Contact, Plus, Trash2, Edit2, RefreshCw, Building } from 'lucide-react';

export const DesignationManagement = () => {
  const { showToast, ToastComponent } = useToast();

  const [designations, setDesignations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [editingDesig, setEditingDesig] = useState(null);
  const [deleteDesigId, setDeleteDesigId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [level, setLevel] = useState(1);
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('ACTIVE');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [desigRes, deptRes] = await Promise.all([
        hrApi.designations(),
        hrApi.departments(),
      ]);
      if (desigRes?.success) setDesignations(desigRes.data || []);
      if (deptRes?.success) setDepartments(deptRes.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load designations');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (desig = null) => {
    setEditingDesig(desig);
    if (desig) {
      setTitle(desig.title || '');
      setDepartmentId(desig.departmentId || '');
      setLevel(desig.level || 1);
      setDescription(desig.description || '');
      setStatus(desig.status || 'ACTIVE');
    } else {
      setTitle('');
      setDepartmentId(departments[0]?.id || '');
      setLevel(1);
      setDescription('');
      setStatus('ACTIVE');
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    try {
      const selectedDept = departments.find((d) => d.id === departmentId);
      const payload = {
        title: title.trim(),
        departmentId: departmentId || null,
        departmentName: selectedDept ? selectedDept.name : '',
        level: Number(level) || 1,
        description: description.trim(),
        status,
      };

      if (editingDesig) {
        const res = await hrApi.updateDesignation(editingDesig.id, payload);
        setDesignations((prev) =>
          prev.map((d) => (d.id === editingDesig.id ? { ...d, ...res.data } : d))
        );
        showToast(`Designation ${title} updated successfully!`, 'success');
      } else {
        const res = await hrApi.createDesignation(payload);
        setDesignations((prev) => [...prev, res.data]);
        showToast(`Designation ${title} created successfully!`, 'success');
      }
      setShowModal(false);
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Failed to save designation', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDesigId) return;
    try {
      await hrApi.deleteDesignation(deleteDesigId);
      setDesignations((prev) => prev.filter((d) => d.id !== deleteDesigId));
      showToast('Designation deleted successfully.', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Failed to delete designation', 'error');
    } finally {
      setDeleteDesigId(null);
    }
  };

  return (
    <div className="space-y-6 text-xs font-semibold">
      <PageHeader
        title="Designation & Hierarchy Management"
        subtitle="Manage professional titles, seniority levels, and department-linked roles."
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
              <span>Create Designation</span>
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

      {/* Designations Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="h-12 bg-slate-100 dark:bg-slate-800/60 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : designations.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-3">
            <Contact className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700" />
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">No designations configured</h4>
            <p className="text-xs max-w-sm mx-auto">
              Create official designations such as Principal, Head Teacher, HR Officer, or Lab Assistant.
            </p>
            <button
              onClick={() => handleOpenModal()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold inline-block mt-2 cursor-pointer"
            >
              + Create First Designation
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 text-[11px]">
                  <th className="py-3">Designation Title</th>
                  <th>Department</th>
                  <th>Hierarchy Level</th>
                  <th>Assigned Staff</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-850">
                {designations.map((desig) => (
                  <tr key={desig.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/50 transition-colors">
                    <td className="py-3.5 font-bold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-lg">
                          <Contact className="w-4 h-4" />
                        </div>
                        <span>{desig.title}</span>
                      </div>
                    </td>
                    <td className="text-slate-600 dark:text-slate-300">
                      {desig.departmentName || desig.departmentId?.name || 'General / Unassigned'}
                    </td>
                    <td>
                      <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md font-bold text-[10px]">
                        Grade {desig.level}
                      </span>
                    </td>
                    <td className="font-bold text-indigo-600 dark:text-indigo-400">
                      {desig.employeeCount || 0} Staff
                    </td>
                    <td>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          desig.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        {desig.status}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenModal(desig)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteDesigId(desig.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-100">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              {editingDesig ? 'Edit Designation' : 'Create New Designation'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-slate-700 dark:text-slate-300 font-bold">Designation Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Mathematics Teacher"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 dark:text-slate-300 font-bold">Department Link</label>
                <select
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-xs font-semibold cursor-pointer"
                >
                  <option value="">General / All Departments</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 dark:text-slate-300 font-bold">Hierarchy Level / Rank Grade</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-xs"
                />
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
                <label className="text-slate-700 dark:text-slate-300 font-bold">Role Description</label>
                <textarea
                  placeholder="Responsibilities overview..."
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
                  {submitting ? 'Saving...' : editingDesig ? 'Update Designation' : 'Create Designation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteDesigId && (
        <ConfirmDialog
          isOpen={Boolean(deleteDesigId)}
          title="Delete Designation"
          message="Are you sure you want to delete this designation title from the system?"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteDesigId(null)}
          confirmVariant="danger"
          confirmText="Delete"
        />
      )}

      <ToastComponent />
    </div>
  );
};
export default DesignationManagement;
