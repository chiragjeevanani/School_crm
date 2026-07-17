import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { FilterBar } from '../components/ui/FilterBar';
import { EmptyState } from '../components/ui/EmptyState';
import { useToast } from '../components/ui/Toast';
import { mockClasses, mockStudents } from '../data/mockData';
import { ATTENDANCE_STATUSES } from '../utils/constants';
import { BarChartWidget } from '../components/ui/Chart';
import {
  CalendarCheck, Download, RotateCcw, CheckSquare, XSquare, Send
} from 'lucide-react';

const TABS = [
  { id: 'mark', label: 'Mark Today' },
  { id: 'history', label: 'History' },
  { id: 'analytics', label: 'Analytics' },
];

const initialAttendance = (students) =>
  Object.fromEntries(students.map(s => [s.id, 'Present']));

export const TeacherAttendance = () => {
  const toast = useToast();
  const [tab, setTab] = useState('mark');
  const [selectedClass, setSelectedClass] = useState(mockClasses[0].id);
  const [attendance, setAttendance] = useState(() => initialAttendance(mockStudents[mockClasses[0].id] || []));
  const [submitted, setSubmitted] = useState(false);
  const [attendanceDate, setAttendanceDate] = useState(() => new Date().toISOString().split('T')[0]);

  const classFilters = mockClasses.map(c => ({ value: c.id, label: `${c.name} - Sec ${c.section}` }));
  const students = mockStudents[selectedClass] || [];

  const handleClassChange = (cls) => {
    setSelectedClass(cls);
    setAttendance(initialAttendance(mockStudents[cls] || []));
    setSubmitted(false);
  };

  const setStatus = (studentId, status) => {
    if (submitted) return;
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const markAll = (status) => {
    const updated = {};
    students.forEach(s => { updated[s.id] = status; });
    setAttendance(updated);
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    await new Promise(r => setTimeout(r, 600));

    // Save attendance marked status to localStorage for the student (Aarav Sharma - STU108902)
    const aaravStatus = attendance['STU108902'];
    if (aaravStatus) {
      const stored = localStorage.getItem('school_attendance');
      if (stored) {
        try {
          const attendanceData = JSON.parse(stored);
          // Remove existing record for this date
          attendanceData.history = attendanceData.history.filter(h => h.date !== attendanceDate);
          // Insert new record
          attendanceData.history.unshift({
            date: attendanceDate,
            status: aaravStatus,
            remark: 'Marked by Mathematics Teacher Mr. Rajesh Kumar'
          });

          // Recalculate percentages
          const totalDays = attendanceData.history.length;
          const presentDays = attendanceData.history.filter(h => h.status === 'Present').length;
          const lateDays = attendanceData.history.filter(h => h.status === 'Late').length;
          const absentDays = attendanceData.history.filter(h => h.status === 'Absent').length;
          const leaveDays = attendanceData.history.filter(h => h.status === 'Leave').length;
          const halfDays = attendanceData.history.filter(h => h.status === 'Half Day').length;

          attendanceData.present = presentDays;
          attendanceData.absent = absentDays;
          attendanceData.late = lateDays;
          attendanceData.halfDay = halfDays;
          attendanceData.leave = leaveDays;
          attendanceData.overallPercentage = parseFloat(
            (((presentDays + lateDays * 0.8 + halfDays * 0.5 + leaveDays) / totalDays) * 100).toFixed(1)
          );

          localStorage.setItem('school_attendance', JSON.stringify(attendanceData));
          window.dispatchEvent(new Event('storage'));
        } catch (e) {
          console.error('Error updating school_attendance in teacher panel', e);
        }
      }
    }

    toast.success('Attendance submitted successfully!');
  };

  const counts = {
    Present: students.filter(s => attendance[s.id] === 'Present').length,
    Absent: students.filter(s => attendance[s.id] === 'Absent').length,
    Late: students.filter(s => attendance[s.id] === 'Late').length,
    'Half Day': students.filter(s => attendance[s.id] === 'Half Day').length,
    Leave: students.filter(s => attendance[s.id] === 'Leave').length,
  };

  const analyticsData = [
    { month: 'Feb', attendance: 88 },
    { month: 'Mar', attendance: 91 },
    { month: 'Apr', attendance: 85 },
    { month: 'May', attendance: 78 },
    { month: 'Jun', attendance: 92 },
    { month: 'Jul', attendance: 87 },
  ];

  const historyData = [
    { date: '2025-07-15', present: 38, absent: 4, late: 2, percentage: 90.5 },
    { date: '2025-07-14', present: 40, absent: 2, late: 0, percentage: 95.2 },
    { date: '2025-07-13', present: 36, absent: 5, late: 1, percentage: 85.7 },
    { date: '2025-07-12', present: 39, absent: 3, late: 0, percentage: 92.9 },
    { date: '2025-07-11', present: 37, absent: 4, late: 1, percentage: 88.1 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-foreground">Attendance Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">Mark and track daily attendance</p>
        </div>
        <button className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-border text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
          <Download className="w-3.5 h-3.5" /> Report
        </button>
      </div>

      <FilterBar
        filters={[
          { value: 'mark', label: 'Mark Today' },
          { value: 'history', label: 'History' },
          { value: 'analytics', label: 'Analytics' },
        ]}
        active={tab}
        onChange={setTab}
      />

      {/* Mark Today Tab */}
      {tab === 'mark' && (
        <div className="space-y-4">
          {/* Class Selector */}
          <Card>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-1">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Select Class</label>
                <select
                  value={selectedClass}
                  onChange={(e) => handleClassChange(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  id="attendance-class-select"
                >
                  {mockClasses.map(c => (
                    <option key={c.id} value={c.id}>{c.name} - Section {c.section}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Date</label>
                <input
                  type="date"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  id="attendance-date"
                />
              </div>
            </div>
          </Card>

          {/* Summary Bar */}
          <div className="grid grid-cols-5 gap-2">
            {Object.entries(counts).map(([status, count]) => {
              const colors = {
                Present: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
                Absent: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800',
                Late: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800',
                'Half Day': 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800',
                Leave: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800',
              };
              return (
                <div key={status} className={`p-3 rounded-2xl border text-center ${colors[status]}`}>
                  <p className="text-lg font-black">{count}</p>
                  <p className="text-[9px] font-bold uppercase tracking-wide opacity-80">{status}</p>
                </div>
              );
            })}
          </div>

          {/* Bulk Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => markAll('Present')}
              disabled={submitted}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
              id="attendance-mark-all-present"
            >
              <CheckSquare className="w-3.5 h-3.5" /> All Present
            </button>
            <button
              onClick={() => markAll('Absent')}
              disabled={submitted}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold hover:bg-rose-500/20 transition-colors disabled:opacity-50"
            >
              <XSquare className="w-3.5 h-3.5" /> All Absent
            </button>
            <button
              onClick={() => { setAttendance(initialAttendance(students)); setSubmitted(false); }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-border text-xs font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ml-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>

          {/* Student Attendance List */}
          <Card>
            <div className="space-y-3">
              {students.map(student => (
                <div key={student.id} className="flex items-center gap-4 p-3 rounded-2xl border border-border bg-slate-50/50 dark:bg-slate-900/50">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-slate-400 w-6 text-center shrink-0">#{student.rollNo}</span>
                    <span className="text-xs font-bold text-foreground truncate">{student.name}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 flex-wrap justify-end">
                    {ATTENDANCE_STATUSES.map(status => (
                      <button
                        key={status.key}
                        onClick={() => setStatus(student.id, status.key)}
                        disabled={submitted}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all select-none ${
                          attendance[student.id] === status.key
                            ? status.color + ' scale-105 shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
                        } ${submitted ? 'cursor-default' : 'cursor-pointer'}`}
                      >
                        {status.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {!submitted ? (
              <button
                onClick={handleSubmit}
                className="w-full flex items-center justify-center gap-2 mt-5 bg-primary hover:bg-primary-hover text-white py-3 rounded-2xl text-sm font-bold shadow-premium transition-all active:scale-95 select-none"
                id="attendance-submit"
              >
                <Send className="w-4 h-4" /> Submit Attendance
              </button>
            ) : (
              <div className="mt-5 flex items-center justify-center gap-2 p-3 bg-emerald-500/10 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-emerald-600 dark:text-emerald-400">
                <CalendarCheck className="w-4 h-4" />
                <span className="text-xs font-bold">Attendance Submitted Successfully!</span>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* History Tab */}
      {tab === 'history' && (
        <Card>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Attendance History</h3>
          <div className="space-y-3">
            {historyData.map((day, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-border hover:border-primary/20 transition-colors">
                <div>
                  <h4 className="text-xs font-bold text-foreground">{new Date(day.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    P: {day.present} | A: {day.absent} | L: {day.late}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`text-lg font-black ${day.percentage >= 90 ? 'text-emerald-500' : day.percentage >= 75 ? 'text-amber-500' : 'text-rose-500'}`}>
                    {day.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Analytics Tab */}
      {tab === 'analytics' && (
        <div className="space-y-6">
          <Card>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Monthly Attendance Trend</h3>
            <BarChartWidget
              data={analyticsData}
              xKey="month"
              bars={[{ key: 'attendance', label: 'Attendance %', color: '#4F46E5' }]}
              height={250}
            />
          </Card>

          <div className="grid grid-cols-3 gap-4">
            <Card className="text-center">
              <p className="text-2xl font-black text-emerald-500">92%</p>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Best Month</p>
            </Card>
            <Card className="text-center">
              <p className="text-2xl font-black text-primary">87%</p>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Class Average</p>
            </Card>
            <Card className="text-center">
              <p className="text-2xl font-black text-rose-500">78%</p>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Lowest Month</p>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
