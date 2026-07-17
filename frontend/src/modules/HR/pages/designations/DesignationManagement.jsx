import React, { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { DataTable } from '../../components/ui/DataTable';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useToast } from '../../components/ui/Toast';
import { MOCK_DESIGNATIONS } from '../../utils/constants';
import { Contact, Plus, Trash2 } from 'lucide-react';

export const DesignationManagement = () => {
  const { showToast, ToastComponent } = useToast();
  const [desigs, setDesigs] = useState(MOCK_DESIGNATIONS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteDesigId, setDeleteDesigId] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('Academics');
  const [gradeLevel, setGradeLevel] = useState('Junior');

  const handleAddDesig = (e) => {
    e.preventDefault();
    if (!name) return;

    const newDesig = {
      id: `DES-00${desigs.length + 1}`,
      name,
      department,
      gradeLevel,
      employeeCount: 0
    };

    setDesigs([...desigs, newDesig]);
    showToast(`Designation ${name} created successfully!`, 'success');
    setShowAddModal(false);

    // Reset Form
    setName('');
  };

  const handleDeleteConfirm = () => {
    if (!deleteDesigId) return;
    setDesigs(prev => prev.filter(d => d.id !== deleteDesigId));
    showToast('Designation entry deleted.', 'success');
    setDeleteDesigId(null);
  };

  const columns = [
    { key: 'name', title: 'Designation Title', sortable: true },
    { key: 'department', title: 'Department Category', sortable: true },
    { key: 'gradeLevel', title: 'Grade Classification' },
    { key: 'employeeCount', title: 'Assigned Employees Count', render: (val) => <span>{val} Staff</span> },
    { 
      key: 'actions', 
      title: 'Actions',
      render: (_, row) => (
        <button
          onClick={(e) => { e.stopPropagation(); setDeleteDesigId(row.id); }}
          className="p-1.5 hover:bg-rose-50 rounded-lg text-rose-600 transition-colors"
          title="Delete Designation"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Designation Management" 
        subtitle="Configure school-wide designations hierarchy, assign staff grades, and adjust employee roles." 
        actions={
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Designation</span>
          </button>
        }
      />

      <DataTable 
        columns={columns} 
        data={desigs} 
        searchPlaceholder="Search designations..."
        searchKey="name"
      />

      {/* Add Designation Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Create School Designation">
        <form onSubmit={handleAddDesig} className="space-y-4 text-left text-xs font-semibold">
          <div className="space-y-1">
            <label>Designation Title</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. Lab Assistant"
              className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border focus:outline-none focus:ring-1 focus:ring-rose-605"
            />
          </div>

          <div className="space-y-1">
            <label>Department Category</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border cursor-pointer focus:outline-none focus:ring-1 focus:ring-rose-605"
            >
              <option value="Academics">Academics</option>
              <option value="Finance">Finance</option>
              <option value="PE & Sports">PE & Sports</option>
              <option value="Administration">Administration</option>
            </select>
          </div>

          <div className="space-y-1">
            <label>Grade Level</label>
            <select
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border cursor-pointer focus:outline-none focus:ring-1 focus:ring-rose-605"
            >
              <option value="Junior">Junior Officer</option>
              <option value="Senior">Senior Officer</option>
              <option value="Lead">Lead Manager</option>
              <option value="Executive">Executive HOD</option>
            </select>
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
              Create Designation
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteDesigId !== null}
        onClose={() => setDeleteDesigId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Designation Node"
        message="Are you sure you want to delete this designation? Deleting this configuration will remove the node from system registers."
        confirmText="Confirm Delete"
      />

      <ToastComponent />
    </div>
  );
};
export default DesignationManagement;
