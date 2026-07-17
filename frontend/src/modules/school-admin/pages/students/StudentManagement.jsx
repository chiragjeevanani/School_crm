import React, { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Tabs } from '../../components/ui/Tabs';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { MOCK_STUDENTS } from '../../utils/constants';
import { 
  Plus, 
  ArrowUpCircle, 
  Trash2, 
  UserMinus, 
  GraduationCap, 
  Check, 
  ArrowRight
} from 'lucide-react';

export const StudentManagement = () => {
  const [activeTab, setActiveTab] = useState('directory');
  const { showToast, ToastComponent } = useToast();

  const [students, setStudents] = useState(MOCK_STUDENTS);
  
  // Promotion form
  const [promoClassFrom, setPromoClassFrom] = useState('10');
  const [promoClassTo, setPromoClassTo] = useState('11');

  // Details Modal
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const handlePromoteBulk = () => {
    // Promote all active class students in mock state
    setStudents(prev => prev.map(s => {
      if (s.class === promoClassFrom && s.status === 'Active') {
        return { ...s, class: promoClassTo };
      }
      return s;
    }));
    showToast(`Successfully promoted students from Class ${promoClassFrom} to Class ${promoClassTo}!`, 'success');
  };

  const handleGraduateBulk = () => {
    setStudents(prev => prev.map(s => {
      if (s.class === '12' && s.status === 'Active') {
        return { ...s, status: 'Graduated' };
      }
      return s;
    }));
    showToast('Class 12 students promoted to Graduated status!', 'success');
  };

  const directoryColumns = [
    { header: 'Admission No', key: 'admissionNo', render: (val) => <span className="font-bold text-slate-900 dark:text-white">{val}</span> },
    { header: 'Student Name', key: 'name' },
    { header: 'Class Allocation', key: 'class', render: (val, row) => `${val}-${row.section}` },
    { header: 'Guardian Name', key: 'parentName' },
    { header: 'Status', key: 'status', render: (val) => (
      <Badge variant={val === 'Active' ? 'success' : val === 'Graduated' ? 'primary' : 'danger'}>{val}</Badge>
    )},
    {
      header: 'Actions',
      key: 'actions',
      render: (_, row) => (
        <button
          onClick={() => {
            setSelectedStudent(row);
            setDetailsModalOpen(true);
          }}
          className="text-xs font-bold text-indigo-650 hover:underline"
        >
          View Profile
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Student Profiles & Promotions" 
        subtitle="Manage student directory, view records, process class promotions, and archive graduated students."
      />

      <Tabs 
        tabs={[
          { id: 'directory', label: 'Student Directory', count: students.length },
          { id: 'promotions', label: 'Bulk Promotions Planner' }
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === 'directory' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <DataTable columns={directoryColumns} data={students} searchPlaceholder="Search student records..." />
        </div>
      )}

      {activeTab === 'promotions' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-indigo-650 flex items-center gap-1.5">
              <ArrowUpCircle className="w-5 h-5" />
              <span>Promote Class Session</span>
            </h4>
            <p className="text-xs text-slate-500">
              Bulk promotion moves all active students from the source class to the destination class. Make sure exams are completed and results published first.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400">Source Class</label>
                <select
                  value={promoClassFrom}
                  onChange={(e) => setPromoClassFrom(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border focus:outline-none"
                >
                  <option value="8">Class 8</option>
                  <option value="9">Class 9</option>
                  <option value="10">Class 10</option>
                  <option value="11">Class 11</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400">Destination Class</label>
                <select
                  value={promoClassTo}
                  onChange={(e) => setPromoClassTo(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border focus:outline-none"
                >
                  <option value="9">Class 9</option>
                  <option value="10">Class 10</option>
                  <option value="11">Class 11</option>
                  <option value="12">Class 12</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-indigo-50 border rounded-2xl text-xs font-semibold text-slate-500">
              <span>Selected action affects: {students.filter(s => s.class === promoClassFrom && s.status === 'Active').length} active students</span>
              <button 
                onClick={handlePromoteBulk}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-650 hover:bg-indigo-750 text-white rounded-xl text-xs font-bold"
              >
                <span>Execute Promotion</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-indigo-650 flex items-center gap-1.5">
              <GraduationCap className="w-5 h-5" />
              <span>Graduate Final Year class</span>
            </h4>
            <p className="text-xs text-slate-500">
              This action marks all active Class 12 students as "Graduated" and archives their login profiles to read-only mode, freeing up class allocations.
            </p>
            <div className="flex items-center justify-between p-3.5 bg-slate-55 border rounded-2xl text-xs font-semibold text-slate-500">
              <span>Selected action affects: {students.filter(s => s.class === '12' && s.status === 'Active').length} active students</span>
              <button 
                onClick={handleGraduateBulk}
                className="px-4 py-2 bg-indigo-650 hover:bg-indigo-750 text-white rounded-xl text-xs font-bold"
              >
                Graduate Class 12
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      <Modal isOpen={detailsModalOpen} onClose={() => setDetailsModalOpen(false)} title="Student Profile Details">
        {selectedStudent && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b">
              <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80" alt={selectedStudent.name} className="w-16 h-16 rounded-2xl object-cover" />
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{selectedStudent.name}</h3>
                <span className="text-[10px] text-indigo-600 font-extrabold uppercase mt-0.5 block">Adm No: {selectedStudent.admissionNo}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
              <div>
                <span className="text-[10px] text-slate-400 block">Class / Room</span>
                <span className="text-slate-800 dark:text-white block mt-0.5">Class {selectedStudent.class}-{selectedStudent.section}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Guardian Details</span>
                <span className="text-slate-800 dark:text-white block mt-0.5">{selectedStudent.parentName} ({selectedStudent.phone})</span>
              </div>
              <div className="mt-2">
                <span className="text-[10px] text-slate-400 block">Birth Date</span>
                <span className="text-slate-800 dark:text-white block mt-0.5">{selectedStudent.dob}</span>
              </div>
              <div className="mt-2">
                <span className="text-[10px] text-slate-400 block">Email Address</span>
                <span className="text-slate-800 dark:text-white block mt-0.5">{selectedStudent.email}</span>
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t">
              <button onClick={() => setDetailsModalOpen(false)} className="px-4 py-2 bg-indigo-650 text-white font-bold text-xs rounded-xl">Close Profile</button>
            </div>
          </div>
        )}
      </Modal>

      <ToastComponent />
    </div>
  );
};
export default StudentManagement;
