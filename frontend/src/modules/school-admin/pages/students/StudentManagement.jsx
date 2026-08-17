import React, { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Tabs } from '../../components/ui/Tabs';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { useAppStore } from '../../../../shared/store/useAppStore';
import { 
  Plus, 
  ArrowUpCircle, 
  Trash2, 
  UserMinus, 
  GraduationCap, 
  Check, 
  ArrowRight,
  FileText,
  Bus,
  Coins
} from 'lucide-react';
import { formatCurrency } from '../../../student/utils/formatters';

export const StudentManagement = () => {
  const [activeTab, setActiveTab] = useState('directory');
  const { showToast, ToastComponent } = useToast();
  const { store, promoteStudents, updateStudentStatus } = useAppStore();

  const students = store.students || [];
  
  // Promotion form
  const [promoClassFrom, setPromoClassFrom] = useState('10');
  const [promoClassTo, setPromoClassTo] = useState('11');

  // Details Modal
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const handlePromoteBulk = () => {
    promoteStudents(promoClassFrom, promoClassTo, '2026-2027', 'Vikramaditya (Admin)');
    showToast(`Successfully promoted all students from Class ${promoClassFrom} to Class ${promoClassTo}! All module databases synchronized.`, 'success');
  };

  const handleGraduateBulk = () => {
    promoteStudents('12', 'Graduated Alumni', '2026-2027', 'Vikramaditya (Admin)');
    showToast('Class 12 students promoted to Graduated status!', 'success');
  };

  const directoryColumns = [
    { header: 'Admission No', key: 'admissionNo', render: (val) => <span className="font-bold text-slate-900 dark:text-white">{val}</span> },
    { header: 'Student Name', key: 'name' },
    { header: 'Class Allocation', key: 'class', render: (val, row) => `${val || ''} (${row.section || 'A'})` },
    { header: 'Guardian Name', key: 'parentName' },
    { header: 'Fee Status', key: 'feeStatus', render: (val) => (
      <Badge variant={val === 'Paid' ? 'success' : val === 'Partial' ? 'warning' : 'danger'}>{val || 'Due'}</Badge>
    )},
    { header: 'Status', key: 'status', render: (val) => (
      <Badge variant={val === 'Active' ? 'success' : val === 'Graduated' ? 'primary' : 'danger'}>{val || 'Active'}</Badge>
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
          className="text-xs font-bold text-indigo-600 hover:underline"
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
        subtitle="Manage student directory, view records, process class promotions, and inspect cross-module student profiles."
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
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm space-y-8 max-w-4xl">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Annual Academic Promotion Engine</h3>
            <p className="text-xs text-slate-500 mt-1">Batch upgrade all enrolled students to the next academic level upon academic session closing.</p>
          </div>

          <div className="p-6 bg-slate-50 dark:bg-slate-950 border border-border rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1.5 w-full">
              <label className="text-xs font-bold text-slate-400 uppercase">From Current Class</label>
              <select 
                value={promoClassFrom} 
                onChange={(e) => setPromoClassFrom(e.target.value)} 
                className="w-full bg-white dark:bg-slate-900 px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-border"
              >
                {['6', '7', '8', '9', '10', '11'].map(c => <option key={c} value={c}>Class {c}</option>)}
              </select>
            </div>

            <div className="shrink-0 pt-4">
              <ArrowRight className="w-6 h-6 text-slate-400" />
            </div>

            <div className="space-y-1.5 w-full">
              <label className="text-xs font-bold text-slate-400 uppercase">To Next Class</label>
              <select 
                value={promoClassTo} 
                onChange={(e) => setPromoClassTo(e.target.value)} 
                className="w-full bg-white dark:bg-slate-900 px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-border"
              >
                {['7', '8', '9', '10', '11', '12'].map(c => <option key={c} value={c}>Class {c}</option>)}
              </select>
            </div>

            <div className="w-full md:w-auto self-end">
              <button 
                onClick={handlePromoteBulk} 
                className="w-full md:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
              >
                Promote Batch
              </button>
            </div>
          </div>

          <div className="border-t border-border pt-6 flex justify-between items-center">
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Graduate Class 12 Batch</h4>
              <p className="text-[11px] text-slate-500">Archive completed 12th standard students to alumni registry.</p>
            </div>
            <button 
              onClick={handleGraduateBulk} 
              className="px-4 py-2 border border-border hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200"
            >
              Graduate Class 12
            </button>
          </div>
        </div>
      )}

      {/* STUDENT DETAILS MODAL (FRD §7.2) */}
      <Modal isOpen={detailsModalOpen} onClose={() => setDetailsModalOpen(false)} title="Student Profile & Integrated Records">
        {selectedStudent && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 pb-4 border-b border-border">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 font-bold text-lg overflow-hidden border border-indigo-200 dark:border-indigo-800">
                <img 
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80" 
                  alt="Student" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{selectedStudent.name}</h3>
                <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">{selectedStudent.admissionNo} • {selectedStudent.class} ({selectedStudent.section || 'A'})</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-border">
                <span className="text-[10px] text-slate-400 block font-bold">Guardian</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedStudent.parentName}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-border">
                <span className="text-[10px] text-slate-400 block font-bold">Contact Phone</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedStudent.parentPhone || selectedStudent.phone}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-border">
                <span className="text-[10px] text-slate-400 block font-bold">Pending Dues</span>
                <span className="font-bold text-rose-600">{formatCurrency(selectedStudent.pendingFees || 0)}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-border">
                <span className="text-[10px] text-slate-400 block font-bold">Transport Route</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedStudent.transportRouteId || 'None'}</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Status Management</span>
              <div className="flex gap-2">
                {['Active', 'Inactive', 'Suspended', 'Transferred'].map(st => (
                  <button
                    key={st}
                    onClick={() => {
                      updateStudentStatus(selectedStudent.id, st, 'Vikramaditya (Admin)');
                      setSelectedStudent({ ...selectedStudent, status: st });
                      showToast(`Student status updated to ${st}`, 'success');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      selectedStudent.status === st 
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' 
                        : 'bg-slate-50 dark:bg-slate-900 border-border text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      <ToastComponent />
    </div>
  );
};
export default StudentManagement;
