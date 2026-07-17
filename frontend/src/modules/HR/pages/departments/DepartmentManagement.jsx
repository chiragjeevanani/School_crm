import React, { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useToast } from '../../components/ui/Toast';
import { MOCK_DEPARTMENTS, MOCK_EMPLOYEES } from '../../utils/constants';
import { Building, Plus, Trash2, Edit2 } from 'lucide-react';

export const DepartmentManagement = () => {
  const { showToast, ToastComponent } = useToast();
  const [depts, setDepts] = useState(MOCK_DEPARTMENTS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteDeptId, setDeleteDeptId] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [headName, setHeadName] = useState('');
  const [description, setDescription] = useState('');

  const handleAddDept = (e) => {
    e.preventDefault();
    if (!name || !headName) return;

    const newDept = {
      id: `DEPT-00${depts.length + 1}`,
      name,
      headName,
      employeeCount: 0,
      description
    };

    setDepts([...depts, newDept]);
    showToast(`Department ${name} created successfully!`, 'success');
    setShowAddModal(false);

    // Reset Form
    setName('');
    setHeadName('');
    setDescription('');
  };

  const handleDeleteConfirm = () => {
    if (!deleteDeptId) return;
    setDepts(prev => prev.filter(d => d.id !== deleteDeptId));
    showToast('Department removed from organization chart.', 'success');
    setDeleteDeptId(null);
  };

  return (
    <div className="space-y-6 text-xs font-semibold">
      <PageHeader 
        title="Department Management" 
        subtitle="Manage school branches departments, assign HOD heads, and monitor employee counts." 
        actions={
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Department</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {depts.map((dept) => (
          <div key={dept.id} className="bg-white dark:bg-slate-900 border rounded-3xl p-5 shadow-sm space-y-4 hover:shadow-md transition-all flex flex-col justify-between">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-rose-50 dark:bg-rose-955/20 text-rose-600 rounded-2xl">
                  <Building className="w-5 h-5 shrink-0" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-none">{dept.name}</h4>
                  <span className="text-[10px] text-slate-400 mt-1 block">Head: {dept.headName}</span>
                </div>
              </div>

              <span className="bg-rose-50 text-rose-700 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase">
                {dept.employeeCount} Staff
              </span>
            </div>

            <p className="text-slate-500 font-medium leading-relaxed">
              {dept.description || 'No description provided.'}
            </p>

            <div className="flex items-center justify-end gap-2 border-t border-slate-50 dark:border-slate-850/60 pt-3 shrink-0">
              <button
                type="button"
                onClick={() => setDeleteDeptId(dept.id)}
                className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-955/20 rounded-lg text-rose-600 transition-colors"
                title="Delete Department"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Department Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Create School Department">
        <form onSubmit={handleAddDept} className="space-y-4 text-left">
          <div className="space-y-1">
            <label>Department Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. English Department"
              className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border focus:outline-none focus:ring-1 focus:ring-rose-605"
            />
          </div>

          <div className="space-y-1">
            <label>Department Head (HOD)</label>
            <select
              value={headName}
              onChange={(e) => setHeadName(e.target.value)}
              required
              className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border cursor-pointer focus:outline-none focus:ring-1 focus:ring-rose-605"
            >
              <option value="">-- Choose Head --</option>
              {MOCK_EMPLOYEES.map(e => (
                <option key={e.id} value={e.name}>{e.name} ({e.designation})</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label>Description Details</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief details about department operations..."
              className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border focus:outline-none focus:ring-1 focus:ring-rose-605"
            />
          </div>

          <div className="flex justify-end pt-3 gap-2">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 border rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-rose-600 hover:bg-rose-750 text-white rounded-xl font-bold shadow-sm"
            >
              Create Department
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteDeptId !== null}
        onClose={() => setDeleteDeptId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete School Department"
        message="Are you sure you want to delete this department? Deleting this will remove the organization node (employee files will remain unassigned)."
        confirmText="Confirm Delete"
      />

      <ToastComponent />
    </div>
  );
};
export default DepartmentManagement;
