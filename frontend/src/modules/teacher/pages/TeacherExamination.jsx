import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { FilterBar } from '../components/ui/FilterBar';
import { EmptyState } from '../components/ui/EmptyState';
import { useToast } from '../components/ui/Toast';
import { mockExams, mockMarks, mockStudents } from '../data/mockData';
import { BarChartWidget } from '../components/ui/Chart';
import { FileText, Clock, MapPin, Upload, Save, Send, AlertCircle, CheckCircle } from 'lucide-react';

const examTypeVariant = { 'Unit Test': 'primary', 'Mid Term': 'warning', 'Final': 'danger' };

export const TeacherExamination = () => {
  const toast = useToast();
  const [tab, setTab] = useState('schedule');
  const [selectedExam, setSelectedExam] = useState(null);
  const [marksData, setMarksData] = useState({});
  const [isDraft, setIsDraft] = useState(true);

  const students9A = mockStudents['cls-9a'] || [];

  const handleMarkChange = (studentId, value) => {
    setMarksData(prev => ({ ...prev, [studentId]: value }));
  };

  const handleSaveDraft = async () => {
    await new Promise(r => setTimeout(r, 400));
    toast.success('Marks saved as draft!');
    setIsDraft(false);
  };

  const handleSubmitFinal = async () => {
    await new Promise(r => setTimeout(r, 600));

    // Save marks entered for student STU108902 to localStorage school_results
    const aaravMarks = marksData['STU108902'];
    if (aaravMarks !== undefined && aaravMarks !== '') {
      const stored = localStorage.getItem('school_results');
      if (stored) {
        try {
          const resultsData = JSON.parse(stored);
          const maxMarks = selectedExam?.maxMarks || 25;
          const scorePercent = Math.round((parseFloat(aaravMarks) / maxMarks) * 100);

          resultsData.subjects = resultsData.subjects.map(sub => {
            if (sub.subject === 'Mathematics') {
              return {
                ...sub,
                score: scorePercent,
                remarks: `Scored ${aaravMarks}/${maxMarks} in Unit Test 1. Graded by Mr. Rajesh Kumar.`
              };
            }
            return sub;
          });

          // Recalculate average and GPA
          const totalScores = resultsData.subjects.reduce((sum, s) => sum + s.score, 0);
          const averagePercent = (totalScores / resultsData.subjects.length).toFixed(1);
          resultsData.overallPercentage = `${averagePercent}%`;
          resultsData.gpa = (parseFloat(averagePercent) / 10).toFixed(1);

          localStorage.setItem('school_results', JSON.stringify(resultsData));
          window.dispatchEvent(new Event('storage'));
        } catch (e) {
          console.error('Error syncing exam results to student portal', e);
        }
      }
    }

    toast.success('Marks submitted successfully!');
  };

  const summaryData = [
    { range: '0-10', students: 2 },
    { range: '11-15', students: 4 },
    { range: '16-20', students: 7 },
    { range: '21-25', students: 10 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-black text-foreground">Examination Management</h2>
        <p className="text-xs text-slate-500 mt-0.5">View exam schedules and enter student marks</p>
      </div>

      <FilterBar
        filters={[
          { value: 'schedule', label: 'Exam Schedule' },
          { value: 'marks', label: 'Enter Marks' },
          { value: 'results', label: 'Results Summary' },
        ]}
        active={tab}
        onChange={setTab}
      />

      {/* Schedule Tab */}
      {tab === 'schedule' && (
        <div className="space-y-4">
          {mockExams.map(exam => (
            <Card key={exam.id} onClick={() => { setSelectedExam(exam); setTab('marks'); }}>
              <div className="flex items-start gap-4">
                <div className="shrink-0 text-center">
                  <div className="w-14 h-16 bg-primary/10 rounded-2xl flex flex-col items-center justify-center">
                    <span className="text-[10px] font-bold text-primary uppercase">{new Date(exam.date).toLocaleString('default', { month: 'short' })}</span>
                    <span className="text-xl font-black text-primary leading-none">{new Date(exam.date).getDate()}</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <Badge variant={examTypeVariant[exam.type] || 'default'}>{exam.type}</Badge>
                    <Badge variant="info">{exam.class}</Badge>
                  </div>
                  <h4 className="text-sm font-bold text-foreground">{exam.subject}</h4>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <span className="flex items-center gap-1 text-[10px] text-slate-400">
                      <Clock className="w-3 h-3" /> {exam.time} ({exam.duration})
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-slate-400">
                      <MapPin className="w-3 h-3" /> {exam.venue}
                    </span>
                    <span className="text-[10px] text-slate-400">Max: {exam.maxMarks}</span>
                  </div>
                </div>
                <div className="shrink-0">
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedExam(exam); setTab('marks'); }}
                    className="px-3.5 py-2 bg-primary/10 text-primary rounded-xl text-[10px] font-bold hover:bg-primary/20 transition-colors whitespace-nowrap"
                  >
                    Enter Marks
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Enter Marks Tab */}
      {tab === 'marks' && (
        <div className="space-y-4">
          <Card>
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="flex-1">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Select Exam</label>
                <select
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  id="exam-select"
                  onChange={(e) => setSelectedExam(mockExams.find(ex => ex.id === e.target.value))}
                >
                  {mockExams.map(ex => (
                    <option key={ex.id} value={ex.id}>{ex.name} — {ex.subject} ({ex.class})</option>
                  ))}
                </select>
              </div>
              {selectedExam && (
                <div className="flex items-end gap-2">
                  <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400">Max Marks</p>
                    <p className="text-sm font-black text-foreground">{selectedExam?.maxMarks || 25}</p>
                  </div>
                </div>
              )}
            </div>

            {!isDraft ? (
              <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-emerald-600 dark:text-emerald-400 mb-4">
                <CheckCircle className="w-4 h-4" />
                <span className="text-xs font-bold">Draft saved. Review and submit when ready.</span>
              </div>
            ) : null}

            {/* Marks Table */}
            <div className="overflow-x-auto -mx-1">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-2.5 px-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Roll</th>
                    <th className="py-2.5 px-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Student Name</th>
                    <th className="py-2.5 px-3 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">Marks Obtained</th>
                    <th className="py-2.5 px-3 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">Grade</th>
                    <th className="py-2.5 px-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {students9A.slice(0, 8).map(student => {
                    const existing = mockMarks.find(m => m.studentId === student.id);
                    const val = marksData[student.id] ?? (existing?.marks ?? '');
                    const maxM = selectedExam?.maxMarks || 25;
                    const grade = val === '' ? '—' : val >= maxM * 0.9 ? 'A+' : val >= maxM * 0.75 ? 'A' : val >= maxM * 0.6 ? 'B' : val >= maxM * 0.45 ? 'C' : 'D';
                    return (
                      <tr key={student.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                        <td className="py-2.5 px-3 text-xs font-bold text-slate-400">{student.rollNo}</td>
                        <td className="py-2.5 px-3 text-xs font-semibold text-foreground">{student.name}</td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center justify-center gap-1">
                            <input
                              type="number"
                              min={0}
                              max={maxM}
                              value={val}
                              onChange={(e) => handleMarkChange(student.id, e.target.value)}
                              className="w-16 px-2 py-1.5 rounded-xl border border-border bg-white dark:bg-slate-900 text-xs text-center focus:outline-none focus:ring-2 focus:ring-primary/20"
                              placeholder="—"
                              id={`mark-${student.id}`}
                            />
                            <span className="text-[10px] text-slate-400">/{maxM}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <Badge variant={grade === 'A+' ? 'success' : grade === 'A' ? 'primary' : grade === 'B' ? 'info' : grade === 'C' ? 'warning' : 'danger'}>
                            {grade}
                          </Badge>
                        </td>
                        <td className="py-2.5 px-3">
                          <input
                            type="text"
                            placeholder="Optional..."
                            className="w-full px-3 py-1.5 rounded-xl border border-border bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                            id={`remark-${student.id}`}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex gap-3 mt-5">
              <button onClick={handleSaveDraft} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors" id="marks-save-draft">
                <Save className="w-3.5 h-3.5" /> Save Draft
              </button>
              <button onClick={handleSubmitFinal} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-premium hover:bg-primary-hover active:scale-95 transition-all select-none" id="marks-submit-final">
                <Send className="w-3.5 h-3.5" /> Submit Final Marks
              </button>
            </div>
          </Card>
        </div>
      )}

      {/* Results Summary Tab */}
      {tab === 'results' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="text-center">
              <p className="text-2xl font-black text-primary">22.5</p>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Class Average</p>
            </Card>
            <Card className="text-center">
              <p className="text-2xl font-black text-emerald-500">25</p>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Highest Score</p>
            </Card>
            <Card className="text-center">
              <p className="text-2xl font-black text-rose-500">15</p>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Lowest Score</p>
            </Card>
            <Card className="text-center">
              <p className="text-2xl font-black text-amber-500">95%</p>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Pass Rate</p>
            </Card>
          </div>

          <Card>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Score Distribution</h3>
            <BarChartWidget data={summaryData} xKey="range" bars={[{ key: 'students', label: 'Students', color: '#4F46E5' }]} height={200} />
          </Card>

          <Card>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Student-wise Results</h3>
            <div className="space-y-2">
              {mockMarks.map(m => (
                <div key={m.studentId} className="flex items-center justify-between p-3 rounded-xl border border-border hover:border-primary/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-slate-400 w-6 text-center">#{m.rollNo}</span>
                    <span className="text-xs font-semibold text-foreground">{m.studentName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-foreground">{m.marks}/{m.maxMarks}</span>
                    <Badge variant={m.grade === 'A+' ? 'success' : m.grade === 'A' ? 'primary' : 'info'}>{m.grade}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
