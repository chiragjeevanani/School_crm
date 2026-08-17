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
  BookOpen, 
  CheckSquare, 
  Globe, 
  Send,
  Eye,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';

export const ExamManagement = () => {
  const [activeTab, setActiveTab] = useState('exams');
  const { showToast, ToastComponent } = useToast();
  const { store, publishExamResults, updateStore } = useAppStore();

  const exams = store.exams || [];
  const results = store.results || {};

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [viewMarksModalOpen, setViewMarksModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);

  const [newExam, setNewExam] = useState({
    name: '',
    type: 'Written Exam',
    gradingType: 'Percentage / Marks',
    startDate: '',
    endDate: '',
    classes: ['10', '9']
  });

  const handleCreateExam = (e) => {
    e.preventDefault();
    const newExamObj = {
      id: `EXAM-${Date.now().toString().slice(-4)}`,
      name: newExam.name,
      session: '2026-2027',
      startDate: newExam.startDate,
      endDate: newExam.endDate,
      status: 'Upcoming',
      gradingType: newExam.gradingType,
      classes: newExam.classes,
      schedule: [
        { date: newExam.startDate, time: '09:00 - 10:30 AM', subject: 'Mathematics', maxMarks: 50 },
        { date: newExam.endDate, time: '09:00 - 10:30 AM', subject: 'Science', maxMarks: 50 }
      ]
    };

    updateStore(prev => ({
      ...prev,
      exams: [newExamObj, ...prev.exams]
    }), 'EXAM_CREATED', { name: newExam.name });

    setCreateModalOpen(false);
    showToast(`Exam term "${newExam.name}" scheduled successfully!`, 'success');
  };

  const handlePublish = (examId, examName) => {
    publishExamResults(examId, 'Vikramaditya (Admin)');
    showToast(`Verified and published results for ${examName}! Report cards unlocked and notification sent to students and parents.`, 'success');
  };

  // Columns Definitions
  const examColumns = [
    { header: 'Exam Term Name', key: 'name' },
    { header: 'Session', key: 'session', render: (val) => val || '2026-2027' },
    { header: 'Start Date', key: 'startDate' },
    { header: 'End Date', key: 'endDate' },
    { header: 'Status', key: 'status', render: (val) => (
      <Badge variant={val === 'Published' ? 'success' : val === 'Completed' ? 'default' : 'warning'}>{val}</Badge>
    )},
    {
      header: 'Actions',
      key: 'actions',
      render: (_, row) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => {
              setSelectedExam(row);
              setViewMarksModalOpen(true);
            }}
            className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-indigo-600"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Review Marks</span>
          </button>

          {row.status !== 'Published' ? (
            <button
              onClick={() => handlePublish(row.id, row.name)}
              className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publish Results</span>
            </button>
          ) : (
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Live in Portals</span>
            </span>
          )}
        </div>
      )
    }
  ];

  // Marks registry rows from store
  const marksRows = Object.values(results['EXAM-2026-UT1'] || {}).map((r, i) => ({
    id: String(i + 1),
    studentId: r.studentId,
    studentName: r.studentName,
    class: `${r.class}-${r.section}`,
    percentage: `${r.percentage}%`,
    gpa: r.gpa,
    rank: `#${r.rank}`,
    status: r.status
  }));

  const marksColumns = [
    { header: 'Student ID', key: 'studentId' },
    { header: 'Student Name', key: 'studentName' },
    { header: 'Class & Section', key: 'class' },
    { header: 'Score %', key: 'percentage' },
    { header: 'GPA', key: 'gpa' },
    { header: 'Class Rank', key: 'rank' },
    { header: 'Grade Status', key: 'status', render: (val) => (
      <Badge variant={val.includes('Passed') ? 'success' : 'warning'}>{val}</Badge>
    )}
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Examination & Marks Registry" 
        subtitle="Schedule term examinations, verify subject marks submitted by teachers, and publish official report cards."
        actions={
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Exam Term</span>
          </button>
        }
      />

      <Tabs
        tabs={[
          { id: 'exams', label: 'Examinations Terms', count: exams.length },
          { id: 'marks', label: 'Marks Verification Registry', count: marksRows.length }
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <DataTable
          columns={activeTab === 'exams' ? examColumns : marksColumns}
          data={activeTab === 'exams' ? exams : marksRows}
          searchPlaceholder="Search examinations or marks records..."
        />
      </div>

      {/* CREATE EXAM MODAL */}
      <Modal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Create New Examination Term">
        <form onSubmit={handleCreateExam} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Exam Term Name *</label>
            <input
              type="text"
              required
              value={newExam.name}
              onChange={(e) => setNewExam({ ...newExam, name: e.target.value })}
              placeholder="e.g. Unit Test 2 or Half-Yearly Exams"
              className="w-full px-3 py-2 text-xs border rounded-xl bg-slate-50 dark:bg-slate-900 border-border"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Start Date *</label>
              <input
                type="date"
                required
                value={newExam.startDate}
                onChange={(e) => setNewExam({ ...newExam, startDate: e.target.value })}
                className="w-full px-3 py-2 text-xs border rounded-xl bg-slate-50 dark:bg-slate-900 border-border"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">End Date *</label>
              <input
                type="date"
                required
                value={newExam.endDate}
                onChange={(e) => setNewExam({ ...newExam, endDate: e.target.value })}
                className="w-full px-3 py-2 text-xs border rounded-xl bg-slate-50 dark:bg-slate-900 border-border"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Grading System</label>
            <select
              value={newExam.gradingType}
              onChange={(e) => setNewExam({ ...newExam, gradingType: e.target.value })}
              className="w-full px-3 py-2 text-xs border rounded-xl bg-slate-50 dark:bg-slate-900 border-border"
            >
              <option value="Percentage / Marks">Percentage & Numerical Marks (CBSE Standard)</option>
              <option value="GPA (10-Point Scale)">10-Point GPA Scale</option>
              <option value="Letter Grades (A-F)">Letter Grades Only (A+, A, B, C, D, F)</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md"
          >
            Create Term & Initialize Timetable
          </button>
        </form>
      </Modal>

      {/* REVIEW MARKS MODAL */}
      <Modal isOpen={viewMarksModalOpen} onClose={() => setViewMarksModalOpen(false)} title={`Subject Marks Review — ${selectedExam?.name || 'Exam'}`}>
        {selectedExam && (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl">
              <div>
                <span className="text-xs font-bold">Class 10-A Subjects Performance</span>
                <p className="text-[11px] text-slate-500">Graded by Subject Faculty: Mathematics, Science, English, Social Studies, CS</p>
              </div>
              <button
                onClick={() => {
                  handlePublish(selectedExam.id, selectedExam.name);
                  setViewMarksModalOpen(false);
                }}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm"
              >
                Approve & Publish Report Cards
              </button>
            </div>

            <div className="overflow-x-auto border border-border rounded-xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/80 border-b">
                  <tr>
                    <th className="p-2.5">Student</th>
                    <th className="p-2.5">Math</th>
                    <th className="p-2.5">Science</th>
                    <th className="p-2.5">English</th>
                    <th className="p-2.5">SST</th>
                    <th className="p-2.5">CS</th>
                    <th className="p-2.5 font-bold">Overall %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {Object.values(results[selectedExam.id] || results['EXAM-2026-UT1'] || {}).map((st, i) => (
                    <tr key={i} className="hover:bg-slate-50/50">
                      <td className="p-2.5 font-bold">{st.studentName} ({st.class}-{st.section})</td>
                      {st.subjects?.map((sub, sIdx) => (
                        <td key={sIdx} className="p-2.5">{sub.marksObtained}/{sub.maxMarks}</td>
                      ))}
                      <td className="p-2.5 font-black text-indigo-600">{st.percentage}% (GPA {st.gpa})</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Modal>

      <ToastComponent />
    </div>
  );
};
export default ExamManagement;
