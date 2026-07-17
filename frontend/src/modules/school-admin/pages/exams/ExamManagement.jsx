import React, { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Tabs } from '../../components/ui/Tabs';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { MOCK_EXAMS } from '../../utils/constants';
import { 
  Plus, 
  BookOpen, 
  CheckSquare, 
  Globe, 
  Send,
  Eye
} from 'lucide-react';

export const ExamManagement = () => {
  const [activeTab, setActiveTab] = useState('exams');
  const { showToast, ToastComponent } = useToast();

  const [exams, setExams] = useState(MOCK_EXAMS);
  const [invigilators, setInvigilators] = useState([
    { id: '1', exam: 'First Term Exams', teacher: 'Dr. Ramesh Kumar', room: 'Hall A', date: '2026-05-10' },
    { id: '2', exam: 'First Term Exams', teacher: 'Mrs. Sunita Rao', room: 'Hall B', date: '2026-05-11' },
    { id: '3', exam: 'Half Yearly Exams', teacher: 'Mr. David D\'souza', room: 'Room 301', date: '2026-09-15' }
  ]);

  const [marksRoll, setMarksRoll] = useState([
    { id: '1', studentName: 'Aarav Sharma', subject: 'Mathematics', marks: 88, maxMarks: 100, grade: 'A' },
    { id: '2', studentName: 'Diya Patel', subject: 'Mathematics', marks: 92, maxMarks: 100, grade: 'A+' },
    { id: '3', studentName: 'Kabir Verma', subject: 'Mathematics', marks: 54, maxMarks: 100, grade: 'C' },
    { id: '4', studentName: 'Ananya Iyer', subject: 'Mathematics', marks: 78, maxMarks: 100, grade: 'B+' }
  ]);

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);

  const [newExam, setNewExam] = useState({
    name: '',
    type: 'Written',
    status: 'Scheduled',
    startDate: '',
    endDate: ''
  });

  const handleCreateExam = (e) => {
    e.preventDefault();
    setExams(prev => [...prev, { id: Date.now().toString(), ...newExam }]);
    setCreateModalOpen(false);
    showToast('New exam term created!', 'success');
  };

  const handlePublishResults = (examName) => {
    showToast(`Exam results for ${examName} published instantly to parent/student portals!`, 'success');
  };

  const handleUpdateMarks = (id, newScore) => {
    const score = Number(newScore);
    if (score > 100 || score < 0) return;
    
    let grade = 'F';
    if (score >= 90) grade = 'A+';
    else if (score >= 80) grade = 'A';
    else if (score >= 70) grade = 'B+';
    else if (score >= 60) grade = 'B';
    else if (score >= 50) grade = 'C';
    else if (score >= 40) grade = 'D';

    setMarksRoll(prev => prev.map(m => m.id === id ? { ...m, marks: score, grade } : m));
  };

  // Columns Definitions
  const examColumns = [
    { header: 'Exam Term Name', key: 'name' },
    { header: 'Type', key: 'type', render: (val) => <Badge variant="info">{val}</Badge> },
    { header: 'Start Date', key: 'startDate' },
    { header: 'End Date', key: 'endDate' },
    { header: 'Status', key: 'status', render: (val) => (
      <Badge variant={val === 'Published' ? 'success' : val === 'Completed' ? 'default' : 'warning'}>{val}</Badge>
    )},
    {
      header: 'Actions',
      key: 'actions',
      render: (_, row) => (
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          {row.status === 'Completed' && (
            <button
              onClick={() => handlePublishResults(row.name)}
              className="flex items-center gap-1 text-xs font-bold text-indigo-650 hover:underline"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publish Results</span>
            </button>
          )}
          {row.status === 'Scheduled' && (
            <span className="text-[10px] text-slate-400 font-bold uppercase select-none">Awaiting start</span>
          )}
          {row.status === 'Published' && (
            <Badge variant="success">Results Published</Badge>
          )}
        </div>
      )
    }
  ];

  const invigilatorColumns = [
    { header: 'Exam Term', key: 'exam' },
    { header: 'Invigilator Staff', key: 'teacher', render: (val) => <span className="font-bold">{val}</span> },
    { header: 'Date Slot', key: 'date' },
    { header: 'Room No / Hall', key: 'room', render: (val) => <Badge variant="primary">{val}</Badge> }
  ];

  const marksColumns = [
    { header: 'Student Name', key: 'studentName' },
    { header: 'Subject', key: 'subject' },
    { header: 'Max Score', key: 'maxMarks' },
    {
      header: 'Obtained Score',
      key: 'marks',
      render: (val, row) => (
        <input
          type="number"
          value={val}
          onChange={(e) => handleUpdateMarks(row.id, e.target.value)}
          className="w-20 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1 text-center font-bold"
        />
      )
    },
    { header: 'Calculated Grade', key: 'grade', render: (val) => <Badge variant={val === 'F' ? 'danger' : 'success'}>{val}</Badge> }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Examination & Results Hub" 
        subtitle="Schedule school exams, allocate invigilator hall details, enter marks sheets, and publish final results."
        actions={
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Exam Term</span>
          </button>
        }
      />

      <Tabs 
        tabs={[
          { id: 'exams', label: 'Exam Terms', count: exams.length },
          { id: 'invigilators', label: 'Invigilator Slots', count: invigilators.length },
          { id: 'marks', label: 'Marks Registry Entry', count: marksRoll.length }
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        {activeTab === 'exams' && <DataTable columns={examColumns} data={exams} />}
        {activeTab === 'invigilators' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-indigo-650">Invigilator Allocations Table</h4>
              <button
                onClick={() => setAssignModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl text-xs font-bold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Assign Invigilator</span>
              </button>
            </div>
            <DataTable columns={invigilatorColumns} data={invigilators} />
          </div>
        )}
        {activeTab === 'marks' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 rounded-2xl">
              <span className="text-xs font-semibold text-slate-500">Currently entering grades for Class 10-A (Mathematics)</span>
              <button 
                onClick={() => showToast('Marks verification successful and locked!', 'success')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl"
              >
                <CheckSquare className="w-3.5 h-3.5" />
                <span>Verify & Lock Grades</span>
              </button>
            </div>
            <DataTable columns={marksColumns} data={marksRoll} />
          </div>
        )}
      </div>

      {/* CREATE EXAM MODAL */}
      <Modal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Create Exam Term Schedule">
        <form onSubmit={handleCreateExam} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400">Exam Term Name</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Half Yearly Examinations" 
              value={newExam.name} 
              onChange={(e) => setNewExam({...newExam, name: e.target.value})} 
              className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400">Exam Format</label>
              <select
                value={newExam.type}
                onChange={(e) => setNewExam({...newExam, type: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border focus:outline-none"
              >
                <option value="Written">Written Examination</option>
                <option value="Practical">Practical Board Exam</option>
                <option value="Oral / Viva">Oral / Viva Voce</option>
                <option value="Unit Test">Class Unit Test</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400">Term Status</label>
              <select
                value={newExam.status}
                onChange={(e) => setNewExam({...newExam, status: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border focus:outline-none"
              >
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400">Term Start Date</label>
              <input 
                type="date" 
                required
                value={newExam.startDate} 
                onChange={(e) => setNewExam({...newExam, startDate: e.target.value})} 
                className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400">Term End Date</label>
              <input 
                type="date" 
                required
                value={newExam.endDate} 
                onChange={(e) => setNewExam({...newExam, endDate: e.target.value})} 
                className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border focus:outline-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={() => setCreateModalOpen(false)} className="px-4 py-2 text-xs font-semibold rounded-xl hover:bg-slate-100">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl">Save Schedule</button>
          </div>
        </form>
      </Modal>

      {/* ASSIGN INVIGILATOR MODAL */}
      <Modal isOpen={assignModalOpen} onClose={() => setAssignModalOpen(false)} title="Assign Invigilator Allocation">
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400">Exam Term</label>
            <select className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border focus:outline-none">
              {exams.map(e => <option key={e.id} value={e.name}>{e.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400">Instructor Staff</label>
              <select className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border focus:outline-none">
                <option value="Dr. Ramesh Kumar">Dr. Ramesh Kumar</option>
                <option value="Mrs. Sunita Rao">Mrs. Sunita Rao</option>
                <option value="Mr. David D'souza">Mr. David D'souza</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400">Examination Room / Hall</label>
              <input type="text" placeholder="e.g. Hall B" className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border focus:outline-none" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button onClick={() => setAssignModalOpen(false)} className="px-4 py-2 text-xs font-semibold rounded-xl hover:bg-slate-100">Cancel</button>
            <button onClick={() => {
              showToast('Invigilator allocation completed!', 'success');
              setAssignModalOpen(false);
            }} className="px-4 py-2 bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl">Save Allocation</button>
          </div>
        </div>
      </Modal>

      <ToastComponent />
    </div>
  );
};
export default ExamManagement;
