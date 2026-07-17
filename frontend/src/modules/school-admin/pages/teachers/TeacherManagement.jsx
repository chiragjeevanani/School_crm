import React, { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Tabs } from '../../components/ui/Tabs';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { MOCK_TEACHERS } from '../../utils/constants';
import { 
  Plus, 
  BookOpen, 
  Map, 
  Check, 
  ShieldCheck,
  ClipboardList
} from 'lucide-react';

export const TeacherManagement = () => {
  const [activeTab, setActiveTab] = useState('teachers');
  const { showToast, ToastComponent } = useToast();

  const [teachers, setTeachers] = useState(MOCK_TEACHERS);
  
  // Modals
  const [allocationModalOpen, setAllocationModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const [allocation, setAllocation] = useState({
    class: '10',
    section: 'A',
    subject: 'Physics'
  });

  const handleSaveAllocation = () => {
    const classStr = `${allocation.class}-${allocation.section} (${allocation.subject})`;
    setTeachers(prev => prev.map(t => {
      if (t.id === selectedTeacher.id) {
        const classesArr = t.classes ? t.classes.split(', ') : [];
        if (!classesArr.includes(classStr)) {
          classesArr.push(classStr);
        }
        return { ...t, classes: classesArr.join(', ') };
      }
      return t;
    }));
    setAllocationModalOpen(false);
    showToast(`Successfully allocated class slot to ${selectedTeacher.name}!`, 'success');
  };

  const columns = [
    { header: 'Teacher Name', key: 'name', render: (val) => <span className="font-bold text-slate-900 dark:text-white">{val}</span> },
    { header: 'Email Office', key: 'email' },
    { header: 'Qualification Credentials', key: 'qualification' },
    { header: 'Primary Dept', key: 'department', render: (val) => <Badge variant="info">{val}</Badge> },
    { header: 'Class Allocations', key: 'classes' },
    {
      header: 'Actions',
      key: 'actions',
      render: (_, row) => (
        <button
          onClick={() => {
            setSelectedTeacher(row);
            setAllocationModalOpen(true);
          }}
          className="text-xs font-bold text-indigo-650 hover:underline flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Allocate Class</span>
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Teacher Profiles & Allocations" 
        subtitle="Manage educator portfolios, departmental allocations, qualifications, and classroom loads."
      />

      <Tabs 
        tabs={[
          { id: 'teachers', label: 'Teacher Directory & Portfolios', count: teachers.length }
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <DataTable columns={columns} data={teachers} searchPlaceholder="Search teachers..." />
      </div>

      {/* ALLOCATION MODAL */}
      <Modal isOpen={allocationModalOpen} onClose={() => setAllocationModalOpen(false)} title={`Allocate Class & Subject for: ${selectedTeacher?.name}`}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400">Class Target</label>
              <select
                value={allocation.class}
                onChange={(e) => setAllocation({...allocation, class: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border focus:outline-none"
              >
                <option value="12">Class 12</option>
                <option value="11">Class 11</option>
                <option value="10">Class 10</option>
                <option value="9">Class 9</option>
                <option value="8">Class 8</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400">Section Slot</label>
              <select
                value={allocation.section}
                onChange={(e) => setAllocation({...allocation, section: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border focus:outline-none"
              >
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
              </select>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400">Subject Name</label>
            <select
              value={allocation.subject}
              onChange={(e) => setAllocation({...allocation, subject: e.target.value})}
              className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border focus:outline-none"
            >
              <option value="Physics">Physics</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Biology">Biology</option>
              <option value="English">English</option>
              <option value="History">History</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button onClick={() => setAllocationModalOpen(false)} className="px-4 py-2 text-xs font-semibold rounded-xl hover:bg-slate-100">Cancel</button>
            <button onClick={handleSaveAllocation} className="px-4 py-2 bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl">Allocate Slot</button>
          </div>
        </div>
      </Modal>

      <ToastComponent />
    </div>
  );
};
export default TeacherManagement;
