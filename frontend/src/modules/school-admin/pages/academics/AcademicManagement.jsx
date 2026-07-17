import React, { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Tabs } from '../../components/ui/Tabs';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { 
  MOCK_CLASSES, 
  MOCK_SECTIONS, 
  MOCK_SUBJECTS, 
  MOCK_TIMETABLE 
} from '../../utils/constants';
import { 
  Plus, 
  Book, 
  Calendar, 
  Bookmark, 
  ArrowRight,
  ClipboardList
} from 'lucide-react';

export const AcademicManagement = () => {
  const [activeTab, setActiveTab] = useState('classes');
  const { showToast, ToastComponent } = useToast();

  const [classes, setClasses] = useState(MOCK_CLASSES);
  const [sections, setSections] = useState(MOCK_SECTIONS);
  const [subjects, setSubjects] = useState(MOCK_SUBJECTS);
  const [timetable, setTimetable] = useState(MOCK_TIMETABLE);

  // Modal control
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [allocationModalOpen, setAllocationModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [newItem, setNewItem] = useState({
    name: '',
    capacity: 40,
    classTeacher: 'Dr. Ramesh Kumar',
    className: 'Class 10',
    type: 'Theory',
    code: ''
  });

  const handleCreateAcademicEntity = (e) => {
    e.preventDefault();
    const mockId = Date.now().toString();

    if (activeTab === 'classes') {
      setClasses(prev => [...prev, { id: mockId, name: newItem.name, capacity: newItem.capacity, classTeacher: newItem.classTeacher, sections: 'A, B', strength: 0 }]);
      showToast('Class created successfully!', 'success');
    } else if (activeTab === 'sections') {
      setSections(prev => [...prev, { id: mockId, class: newItem.className, name: newItem.name, strength: 0, room: 'Room 305' }]);
      showToast('Section created successfully!', 'success');
    } else if (activeTab === 'subjects') {
      setSubjects(prev => [...prev, { id: mockId, class: newItem.className, name: newItem.name, code: newItem.code, subjectTeacher: newItem.classTeacher, type: newItem.type }]);
      showToast('Subject created successfully!', 'success');
    }
    setCreateModalOpen(false);
  };

  // Columns Definitions
  const classColumns = [
    { header: 'Class Name', key: 'name' },
    { header: 'Maximum Capacity', key: 'capacity' },
    { header: 'Total Sections', key: 'sections' },
    { header: 'Student Count', key: 'strength' },
    { header: 'Class Teacher Assigned', key: 'classTeacher', render: (val) => <span className="font-bold text-indigo-650 dark:text-indigo-400">{val}</span> },
    {
      header: 'Actions',
      key: 'actions',
      render: (_, row) => (
        <button
          onClick={() => {
            setSelectedItem(row);
            setAllocationModalOpen(true);
          }}
          className="text-xs font-bold text-indigo-650 hover:underline"
        >
          Assign Teacher
        </button>
      )
    }
  ];

  const sectionColumns = [
    { header: 'Class Parent', key: 'class' },
    { header: 'Section Code', key: 'name', render: (val) => <Badge variant="info">{val}</Badge> },
    { header: 'Total Students', key: 'strength' },
    { header: 'Assigned Classroom', key: 'room' }
  ];

  const subjectColumns = [
    { header: 'Allocated Class', key: 'class' },
    { header: 'Subject Code', key: 'code', render: (val) => <Badge variant="default">{val}</Badge> },
    { header: 'Subject Name', key: 'name' },
    { header: 'Subject Teacher', key: 'subjectTeacher', render: (val) => <span className="font-semibold text-slate-800 dark:text-slate-200">{val}</span> },
    { header: 'Category', key: 'type', render: (val) => <Badge variant={val === 'Practical' ? 'warning' : 'success'}>{val}</Badge> }
  ];

  const timetableColumns = [
    { header: 'Target Class', key: 'class', render: (val, row) => `${val}-${row.section}` },
    { header: 'Day', key: 'day', render: (val) => <Badge variant="primary">{val}</Badge> },
    { header: 'Period Slot', key: 'period' },
    { header: 'Timing Duration', key: 'time' },
    { header: 'Subject Name', key: 'subject' },
    { header: 'Assigned Instructor', key: 'teacher' }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Academic & Timetable Management" 
        subtitle="Configure classes, assign sections, map subjects to teachers, and design the weekly schedule grid."
        actions={
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-650 hover:bg-indigo-750 text-white text-xs font-bold rounded-xl shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Academic Entity</span>
          </button>
        }
      />

      <Tabs 
        tabs={[
          { id: 'classes', label: 'Classes', count: classes.length },
          { id: 'sections', label: 'Sections', count: sections.length },
          { id: 'subjects', label: 'Subjects', count: subjects.length },
          { id: 'timetable', label: 'Weekly Timetable', count: timetable.length }
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        {activeTab === 'classes' && <DataTable columns={classColumns} data={classes} />}
        {activeTab === 'sections' && <DataTable columns={sectionColumns} data={sections} />}
        {activeTab === 'subjects' && <DataTable columns={subjectColumns} data={subjects} />}
        {activeTab === 'timetable' && (
          <div className="space-y-6">
            <DataTable columns={timetableColumns} data={timetable} />
            <div className="p-4 bg-slate-50 dark:bg-slate-950 border rounded-2xl flex items-center justify-between text-xs font-semibold text-slate-500">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                <span>Need to adjust timetable slots? Direct editing can be performed inside the class calendar view.</span>
              </div>
              <button onClick={() => showToast('Redirecting to Timetable Drag & Drop Editor Map...', 'info')} className="text-indigo-650 hover:underline">Launch Editor →</button>
            </div>
          </div>
        )}
      </div>

      {/* CREATE ACADEMIC ENTITY MODAL */}
      <Modal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} title={`Create ${activeTab.slice(0, -1).toUpperCase()}`}>
        <form onSubmit={handleCreateAcademicEntity} className="space-y-4">
          {activeTab === 'classes' && (
            <>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400">Class Label Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Class 10" 
                  value={newItem.name} 
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})} 
                  className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400">Class Max Capacity</label>
                  <input 
                    type="number" 
                    value={newItem.capacity} 
                    onChange={(e) => setNewItem({...newItem, capacity: Number(e.target.value)})} 
                    className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400">Class Teacher Assigned</label>
                  <select
                    value={newItem.classTeacher}
                    onChange={(e) => setNewItem({...newItem, classTeacher: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border focus:outline-none"
                  >
                    <option value="Dr. Ramesh Kumar">Dr. Ramesh Kumar</option>
                    <option value="Mrs. Sunita Rao">Mrs. Sunita Rao</option>
                    <option value="Mr. David D'souza">Mr. David D'souza</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {activeTab === 'sections' && (
            <>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400">Class Parent</label>
                <select
                  value={newItem.className}
                  onChange={(e) => setNewItem({...newItem, className: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border focus:outline-none"
                >
                  {classes.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400">Section Label Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Section C" 
                  value={newItem.name} 
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})} 
                  className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border focus:outline-none"
                />
              </div>
            </>
          )}

          {activeTab === 'subjects' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400">Target Class</label>
                  <select
                    value={newItem.className}
                    onChange={(e) => setNewItem({...newItem, className: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border focus:outline-none"
                  >
                    {classes.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400">Subject Type</label>
                  <select
                    value={newItem.type}
                    onChange={(e) => setNewItem({...newItem, type: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border focus:outline-none"
                  >
                    <option value="Theory">Theory</option>
                    <option value="Practical">Practical</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400">Subject Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Biology" 
                    value={newItem.name} 
                    onChange={(e) => setNewItem({...newItem, name: e.target.value})} 
                    className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400">Subject Code</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. BIO101" 
                    value={newItem.code} 
                    onChange={(e) => setNewItem({...newItem, code: e.target.value})} 
                    className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border focus:outline-none"
                  />
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={() => setCreateModalOpen(false)} className="px-4 py-2 text-xs font-semibold rounded-xl hover:bg-slate-100">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl">Create</button>
          </div>
        </form>
      </Modal>

      {/* ALLOCATION MODAL */}
      <Modal isOpen={allocationModalOpen} onClose={() => setAllocationModalOpen(false)} title={`Assign Class Teacher for: ${selectedItem?.name}`}>
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400">Select Instructor</label>
            <select className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border focus:outline-none">
              <option value="Dr. Ramesh Kumar">Dr. Ramesh Kumar (Science)</option>
              <option value="Mrs. Sunita Rao">Mrs. Sunita Rao (Maths)</option>
              <option value="Mr. David D'souza">Mr. David D'souza (English)</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button onClick={() => setAllocationModalOpen(false)} className="px-4 py-2 text-xs font-semibold rounded-xl hover:bg-slate-100">Cancel</button>
            <button onClick={() => {
              showToast('Class teacher allocated successfully!', 'success');
              setAllocationModalOpen(false);
            }} className="px-4 py-2 bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl">Save Changes</button>
          </div>
        </div>
      </Modal>

      <ToastComponent />
    </div>
  );
};
export default AcademicManagement;
