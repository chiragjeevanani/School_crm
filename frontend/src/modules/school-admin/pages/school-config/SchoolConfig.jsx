import React, { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Tabs } from '../../components/ui/Tabs';
import { DataTable } from '../../components/ui/DataTable';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { 
  Save, 
  Plus, 
  Calendar, 
  Clock, 
  Check, 
  Lock,
  Edit2,
  Trash2,
  AlertCircle
} from 'lucide-react';

export const SchoolConfig = () => {
  const [activeTab, setActiveTab] = useState('info');
  const { showToast, ToastComponent } = useToast();

  // ----------------------------------------------------
  // Tab 1: School Information
  // ----------------------------------------------------
  const [schoolInfo, setSchoolInfo] = useState({
    name: 'Greenfield Public School',
    logo: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=150&q=80',
    address: 'Sector 4, Dwarka, New Delhi - 110075',
    email: 'info@greenfield.edu.in',
    phone: '+91 11 2803 4567',
    website: 'www.greenfield.edu.in',
    principalName: 'Dr. Shubhashis Chatterjee',
    principalEmail: 'principal@greenfield.edu.in',
    principalPhone: '+91 99999 88888'
  });

  const handleInfoSave = (e) => {
    e.preventDefault();
    showToast('School configuration updated successfully!', 'success');
  };

  // ----------------------------------------------------
  // Tab 2: Academic Session Management
  // ----------------------------------------------------
  const [sessions, setSessions] = useState([
    { id: '1', name: '2024-2025', status: 'Archived', startDate: '2024-04-01', endDate: '2025-03-31' },
    { id: '2', name: '2025-2026', status: 'Archived', startDate: '2025-04-01', endDate: '2026-03-31' },
    { id: '3', name: '2026-2027', status: 'Active', startDate: '2026-04-01', endDate: '2027-03-31' },
    { id: '4', name: '2027-2028', status: 'Upcoming', startDate: '2027-04-01', endDate: '2028-03-31' }
  ]);

  const [sessionModalOpen, setSessionModalOpen] = useState(false);
  const [newSession, setNewSession] = useState({ name: '', startDate: '', endDate: '', status: 'Upcoming' });

  const sessionColumns = [
    { header: 'Session Name', key: 'name' },
    { header: 'Start Date', key: 'startDate' },
    { header: 'End Date', key: 'endDate' },
    {
      header: 'Status',
      key: 'status',
      render: (val) => (
        <Badge variant={val === 'Active' ? 'success' : val === 'Archived' ? 'default' : 'info'}>
          {val}
        </Badge>
      )
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (_, row) => (
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          {row.status !== 'Active' && (
            <button
              onClick={() => handleActivateSession(row.id)}
              className="text-xs font-bold text-indigo-650 hover:underline flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Activate</span>
            </button>
          )}
          <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500">
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )
    }
  ];

  const handleActivateSession = (id) => {
    setSessions(prev => prev.map(s => ({
      ...s,
      status: s.id === id ? 'Active' : s.status === 'Active' ? 'Archived' : s.status
    })));
    showToast('Academic Session changed successfully!', 'success');
  };

  const handleAddSession = () => {
    setSessions(prev => [...prev, { id: Date.now().toString(), ...newSession }]);
    setSessionModalOpen(false);
    showToast('New academic session created!', 'success');
  };

  // ----------------------------------------------------
  // Tab 3: School Timings & Attendance Rules
  // ----------------------------------------------------
  const [timings, setTimings] = useState({
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    startTime: '08:00',
    endTime: '14:00',
    periods: 8,
    periodDuration: 45,
    recessTime: '11:00',
    recessDuration: 30,
    lateThreshold: 15,
    minAttendancePct: 75
  });

  const handleTimingsSave = (e) => {
    e.preventDefault();
    showToast('School timings and rules saved!', 'success');
  };

  // ----------------------------------------------------
  // Tab 4: Grading System Ranges
  // ----------------------------------------------------
  const [grades, setGrades] = useState([
    { id: '1', grade: 'A+', min: 90, max: 100, point: 10, remark: 'Outstanding' },
    { id: '2', grade: 'A', min: 80, max: 89, point: 9, remark: 'Excellent' },
    { id: '3', grade: 'B+', min: 70, max: 79, point: 8, remark: 'Very Good' },
    { id: '4', grade: 'B', min: 60, max: 69, point: 7, remark: 'Good' },
    { id: '5', grade: 'C', min: 50, max: 59, point: 6, remark: 'Satisfactory' },
    { id: '6', grade: 'D', min: 40, max: 49, point: 5, remark: 'Pass' },
    { id: '7', grade: 'F', min: 0, max: 39, point: 0, remark: 'Fail' }
  ]);

  const handleGradeChange = (id, field, value) => {
    setGrades(prev => prev.map(g => g.id === id ? { ...g, [field]: value } : g));
  };

  // ----------------------------------------------------
  // Tab 5: School Calendar (Events & Holidays List)
  // ----------------------------------------------------
  const [calendarEvents, setCalendarEvents] = useState([
    { id: '1', title: 'Independence Day Holiday', date: '2026-08-15', type: 'Holiday', description: 'National Holiday' },
    { id: '2', title: 'Parent Teacher Meeting (PTM)', date: '2026-07-28', type: 'PTM', description: 'Term 1 review' },
    { id: '3', title: 'Annual Sports Meet', date: '2026-11-20', type: 'Event', description: 'Inter-house competitions' },
    { id: '4', title: 'Gandhi Jayanti Holiday', date: '2026-10-02', type: 'Holiday', description: 'National Holiday' }
  ]);

  const [calendarModalOpen, setCalendarModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', type: 'Holiday', description: '' });

  const calendarColumns = [
    { header: 'Event Title', key: 'title' },
    { header: 'Date', key: 'date' },
    {
      header: 'Type',
      key: 'type',
      render: (val) => (
        <Badge variant={val === 'Holiday' ? 'danger' : val === 'PTM' ? 'warning' : 'success'}>
          {val}
        </Badge>
      )
    },
    { header: 'Description', key: 'description' }
  ];

  const handleAddCalendarEvent = () => {
    setCalendarEvents(prev => [...prev, { id: Date.now().toString(), ...newEvent }]);
    setCalendarModalOpen(false);
    showToast('Calendar event created successfully!', 'success');
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="School Configuration" 
        subtitle="Manage general information, academic sessions, timings, calendar, and grades."
      />

      <Tabs 
        tabs={[
          { id: 'info', label: 'School Info' },
          { id: 'sessions', label: 'Academic Sessions' },
          { id: 'timings', label: 'Timings & Rules' },
          { id: 'grades', label: 'Grading System' },
          { id: 'calendar', label: 'School Calendar' }
        ]} 
        activeTab={activeTab} 
        onChange={setActiveTab} 
      />

      {/* TAB 1: INFO FORM */}
      {activeTab === 'info' && (
        <form onSubmit={handleInfoSave} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row items-center gap-6 pb-6 border-b border-slate-100 dark:border-slate-850">
            <img src={schoolInfo.logo} alt="Logo" className="w-24 h-24 rounded-2xl object-cover border border-slate-200" />
            <div className="space-y-2 text-center md:text-left">
              <h4 className="text-sm font-bold text-slate-800 dark:text-white">School Seal & Logo</h4>
              <p className="text-xs text-slate-450">Recommended: Square format image, min size 512x512px. Max size 2MB.</p>
              <button type="button" className="px-3.5 py-1.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold rounded-xl">
                Upload Logo
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h5 className="text-xs font-extrabold uppercase tracking-wider text-indigo-650 dark:text-indigo-400">School Details</h5>
              
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-655 dark:text-slate-400">School Registered Name</label>
                <input 
                  type="text" 
                  value={schoolInfo.name} 
                  onChange={(e) => setSchoolInfo({...schoolInfo, name: e.target.value})} 
                  className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-655 dark:text-slate-400">Address</label>
                <input 
                  type="text" 
                  value={schoolInfo.address} 
                  onChange={(e) => setSchoolInfo({...schoolInfo, address: e.target.value})} 
                  className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-655 dark:text-slate-400">Email Address</label>
                  <input 
                    type="email" 
                    value={schoolInfo.email} 
                    onChange={(e) => setSchoolInfo({...schoolInfo, email: e.target.value})} 
                    className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-655 dark:text-slate-400">Phone Line</label>
                  <input 
                    type="text" 
                    value={schoolInfo.phone} 
                    onChange={(e) => setSchoolInfo({...schoolInfo, phone: e.target.value})} 
                    className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-655 dark:text-slate-400">Website Address</label>
                <input 
                  type="text" 
                  value={schoolInfo.website} 
                  onChange={(e) => setSchoolInfo({...schoolInfo, website: e.target.value})} 
                  className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h5 className="text-xs font-extrabold uppercase tracking-wider text-indigo-650 dark:text-indigo-400">Principal Details</h5>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-655 dark:text-slate-400">Principal Full Name</label>
                <input 
                  type="text" 
                  value={schoolInfo.principalName} 
                  onChange={(e) => setSchoolInfo({...schoolInfo, principalName: e.target.value})} 
                  className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-655 dark:text-slate-400">Office Email</label>
                <input 
                  type="email" 
                  value={schoolInfo.principalEmail} 
                  onChange={(e) => setSchoolInfo({...schoolInfo, principalEmail: e.target.value})} 
                  className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-655 dark:text-slate-400">Direct Phone Number</label>
                <input 
                  type="text" 
                  value={schoolInfo.principalPhone} 
                  onChange={(e) => setSchoolInfo({...schoolInfo, principalPhone: e.target.value})} 
                  className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-850">
            <button type="submit" className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-indigo-650/10">
              <Save className="w-3.5 h-3.5" />
              <span>Save Configuration</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: SESSIONS */}
      {activeTab === 'sessions' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-indigo-650">Academic Sessions List</h4>
            <button
              onClick={() => setSessionModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl text-xs font-bold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Session</span>
            </button>
          </div>
          <DataTable columns={sessionColumns} data={sessions} />
        </div>
      )}

      {/* TAB 3: TIMINGS */}
      {activeTab === 'timings' && (
        <form onSubmit={handleTimingsSave} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h5 className="text-xs font-extrabold uppercase tracking-wider text-indigo-650 dark:text-indigo-400 flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>Daily Timetable Schedule</span>
              </h5>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-655 dark:text-slate-400">School Start Time</label>
                  <input 
                    type="time" 
                    value={timings.startTime} 
                    onChange={(e) => setTimings({...timings, startTime: e.target.value})} 
                    className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-655 dark:text-slate-400">School Dismissal Time</label>
                  <input 
                    type="time" 
                    value={timings.endTime} 
                    onChange={(e) => setTimings({...timings, endTime: e.target.value})} 
                    className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-655 dark:text-slate-400">Number of Periods</label>
                  <input 
                    type="number" 
                    value={timings.periods} 
                    onChange={(e) => setTimings({...timings, periods: Number(e.target.value)})} 
                    className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-655 dark:text-slate-400">Period Duration (mins)</label>
                  <input 
                    type="number" 
                    value={timings.periodDuration} 
                    onChange={(e) => setTimings({...timings, periodDuration: Number(e.target.value)})} 
                    className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-655 dark:text-slate-400">Recess Starts</label>
                  <input 
                    type="time" 
                    value={timings.recessTime} 
                    onChange={(e) => setTimings({...timings, recessTime: e.target.value})} 
                    className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-655 dark:text-slate-400">Recess Duration (mins)</label>
                  <input 
                    type="number" 
                    value={timings.recessDuration} 
                    onChange={(e) => setTimings({...timings, recessDuration: Number(e.target.value)})} 
                    className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h5 className="text-xs font-extrabold uppercase tracking-wider text-indigo-650 dark:text-indigo-400 flex items-center gap-1.5">
                <Lock className="w-4 h-4" />
                <span>Attendance & Policy Rules</span>
              </h5>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-655 dark:text-slate-400">Working Days</label>
                <div className="grid grid-cols-3 gap-2.5">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
                    const checked = timings.workingDays.includes(day);
                    return (
                      <label key={day} className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-xl cursor-pointer text-xs font-semibold">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            const newDays = checked 
                              ? timings.workingDays.filter(d => d !== day) 
                              : [...timings.workingDays, day];
                            setTimings({ ...timings, workingDays: newDays });
                          }}
                          className="rounded border-slate-300 text-indigo-650 focus:ring-indigo-500 w-3.5 h-3.5"
                        />
                        <span>{day.slice(0, 3)}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-655 dark:text-slate-400">Late Attendance Threshold (mins)</label>
                  <input 
                    type="number" 
                    value={timings.lateThreshold} 
                    onChange={(e) => setTimings({...timings, lateThreshold: Number(e.target.value)})} 
                    className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-655 dark:text-slate-400">Minimum Exam Eligibility Attendance %</label>
                  <input 
                    type="number" 
                    value={timings.minAttendancePct} 
                    onChange={(e) => setTimings({...timings, minAttendancePct: Number(e.target.value)})} 
                    className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-850">
            <button type="submit" className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm">
              <Save className="w-3.5 h-3.5" />
              <span>Save Rules & Timings</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 4: GRADES */}
      {activeTab === 'grades' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-indigo-650">Grading Boundaries Config</h4>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">GPA Standard:</span>
              <Badge variant="success">10 Point CGPA</Badge>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50">
                  <th className="p-3 text-xs font-bold text-slate-500">Grade Letter</th>
                  <th className="p-3 text-xs font-bold text-slate-500">Min Percentage %</th>
                  <th className="p-3 text-xs font-bold text-slate-500">Max Percentage %</th>
                  <th className="p-3 text-xs font-bold text-slate-500">Grade Points</th>
                  <th className="p-3 text-xs font-bold text-slate-500">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {grades.map((g) => (
                  <tr key={g.id} className="border-b border-slate-100 dark:border-slate-850 text-xs font-semibold text-slate-700 dark:text-slate-350">
                    <td className="p-3">
                      <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-950 font-bold rounded-lg">{g.grade}</span>
                    </td>
                    <td className="p-3">
                      <input 
                        type="number" 
                        value={g.min} 
                        onChange={(e) => handleGradeChange(g.id, 'min', Number(e.target.value))}
                        className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2 py-1 w-20 font-bold text-center" 
                      />
                    </td>
                    <td className="p-3">
                      <input 
                        type="number" 
                        value={g.max} 
                        onChange={(e) => handleGradeChange(g.id, 'max', Number(e.target.value))}
                        className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2 py-1 w-20 font-bold text-center" 
                      />
                    </td>
                    <td className="p-3">
                      <input 
                        type="number" 
                        value={g.point} 
                        onChange={(e) => handleGradeChange(g.id, 'point', Number(e.target.value))}
                        className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2 py-1 w-20 font-bold text-center" 
                      />
                    </td>
                    <td className="p-3">
                      <input 
                        type="text" 
                        value={g.remark} 
                        onChange={(e) => handleGradeChange(g.id, 'remark', e.target.value)}
                        className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-3 py-1 w-44 font-semibold" 
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button 
              onClick={() => showToast('Grading bounds updated!', 'success')}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Grading Setup</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 5: CALENDAR */}
      {activeTab === 'calendar' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-indigo-650">Holiday & Event Calendar</h4>
            <button
              onClick={() => setCalendarModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl text-xs font-bold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Mark Date / Event</span>
            </button>
          </div>
          <DataTable columns={calendarColumns} data={calendarEvents} />
        </div>
      )}

      {/* MODALS */}
      <Modal isOpen={sessionModalOpen} onClose={() => setSessionModalOpen(false)} title="Create Academic Session">
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400">Session Name</label>
            <input 
              type="text" 
              placeholder="e.g. 2027-2028" 
              value={newSession.name} 
              onChange={(e) => setNewSession({...newSession, name: e.target.value})} 
              className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400">Start Date</label>
              <input 
                type="date" 
                value={newSession.startDate} 
                onChange={(e) => setNewSession({...newSession, startDate: e.target.value})} 
                className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400">End Date</label>
              <input 
                type="date" 
                value={newSession.endDate} 
                onChange={(e) => setNewSession({...newSession, endDate: e.target.value})} 
                className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border focus:outline-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button onClick={() => setSessionModalOpen(false)} className="px-4 py-2 text-xs font-semibold rounded-xl hover:bg-slate-100">Cancel</button>
            <button onClick={handleAddSession} className="px-4 py-2 bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl">Create Session</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={calendarModalOpen} onClose={() => setCalendarModalOpen(false)} title="Mark Date on Calendar">
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400">Event / Holiday Title</label>
            <input 
              type="text" 
              placeholder="e.g. Diwali Holiday" 
              value={newEvent.title} 
              onChange={(e) => setNewEvent({...newEvent, title: e.target.value})} 
              className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400">Date</label>
              <input 
                type="date" 
                value={newEvent.date} 
                onChange={(e) => setNewEvent({...newEvent, date: e.target.value})} 
                className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400">Type</label>
              <select
                value={newEvent.type}
                onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border focus:outline-none"
              >
                <option value="Holiday">Holiday</option>
                <option value="PTM">PTM</option>
                <option value="Event">Event</option>
              </select>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400">Description</label>
            <input 
              type="text" 
              placeholder="Short description..." 
              value={newEvent.description} 
              onChange={(e) => setNewEvent({...newEvent, description: e.target.value})} 
              className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border focus:outline-none"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button onClick={() => setCalendarModalOpen(false)} className="px-4 py-2 text-xs font-semibold rounded-xl hover:bg-slate-100">Cancel</button>
            <button onClick={handleAddCalendarEvent} className="px-4 py-2 bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl">Save Event</button>
          </div>
        </div>
      </Modal>

      <ToastComponent />
    </div>
  );
};
export default SchoolConfig;
