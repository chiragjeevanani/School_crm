import React from 'react';
import { useSchoolAdminAuth } from '../context/SchoolAdminAuthContext';
import { 
  Users, 
  UserCheck, 
  Briefcase, 
  TrendingUp, 
  UserMinus, 
  FileText, 
  IndianRupee, 
  AlertTriangle, 
  GraduationCap, 
  Calendar, 
  UserPlus, 
  School,
  ArrowRight,
  PlusCircle
} from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { StatCard } from '../components/ui/StatCard';
import { AreaChart } from '../components/ui/Charts/AreaChart';
import { BarChart } from '../components/ui/Charts/BarChart';
import { PieChart } from '../components/ui/Charts/PieChart';
import { LineChart } from '../components/ui/Charts/LineChart';
import { useNavigate } from 'react-router-dom';

// Dashboard Mock Data
const ADMISSIONS_TREND = [
  { month: 'Jan', admissions: 12 },
  { month: 'Feb', admissions: 18 },
  { month: 'Mar', admissions: 35 },
  { month: 'Apr', admissions: 82 },
  { month: 'May', admissions: 64 },
  { month: 'Jun', admissions: 95 },
  { month: 'Jul', admissions: 120 }
];

const ATTENDANCE_TREND = [
  { day: 'Mon', attendance: 94 },
  { day: 'Tue', attendance: 96 },
  { day: 'Wed', attendance: 92 },
  { day: 'Thu', attendance: 95 },
  { day: 'Fri', attendance: 91 },
  { day: 'Sat', attendance: 88 }
];

const FEE_TREND = [
  { month: 'Apr', collected: 240000 },
  { month: 'May', collected: 320000 },
  { month: 'Jun', collected: 450000 },
  { month: 'Jul', collected: 620000 }
];

const EXAM_PERFORMANCE = [
  { name: 'UT 1', average: 74 },
  { name: 'UT 2', average: 76 },
  { name: 'Half Yearly', average: 81 },
  { name: 'UT 3', average: 80 }
];

const GENDER_RATIO = [
  { name: 'Male', count: 480 },
  { name: 'Female', count: 420 }
];

const CLASS_STRENGTH = [
  { class: 'Class 8', strength: 75 },
  { class: 'Class 9', strength: 78 },
  { class: 'Class 10', strength: 95 },
  { class: 'Class 11', strength: 55 },
  { class: 'Class 12', strength: 82 }
];

const RECENT_ACTIVITIES = [
  { id: 1, text: 'New student Aarav Sharma admitted to Class 10-A', time: '12 mins ago', category: 'Admission' },
  { id: 2, text: 'Teacher Ramesh Kumar marked Attendance for Class 10-A', time: '1 hour ago', category: 'Attendance' },
  { id: 3, text: 'Fee receipt generated for Diya Patel (Rs. 3,500)', time: '2 hours ago', category: 'Finance' },
  { id: 4, text: 'Half Yearly Exams date sheet published by Principal', time: '1 day ago', category: 'Exam' }
];

export const Dashboard = () => {
  const { user } = useSchoolAdminAuth();
  const navigate = useNavigate();

  const handleQuickAction = (path) => {
    navigate(path);
  };

  const today = new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date());

  return (
    <div className="space-y-8 pb-12">
      {/* Page Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-indigo-500/10 rounded-2xl text-indigo-650 dark:text-indigo-400">
            <School className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {user?.schoolName || 'Greenfield Public School'}
            </h1>
            <p className="text-xs font-semibold text-slate-450 mt-1">{today}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-550 dark:text-slate-400 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl">
            Active Session: {user?.academicSession}
          </span>
        </div>
      </div>

      {/* 12 Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        <StatCard title="Total Students" value="900" icon={Users} trend="4.2%" trendType="up" />
        <StatCard title="Total Teachers" value="48" icon={UserCheck} trend="1" trendType="up" />
        <StatCard title="Total Employees" value="85" icon={Briefcase} trend="3" trendType="up" />
        <StatCard title="Today Attendance" value="93.4%" icon={TrendingUp} trend="1.2%" trendType="up" />
        
        <StatCard title="Absent Students" value="59" icon={UserMinus} trend="8" trendType="down" />
        <StatCard title="Leave Requests" value="6" icon={FileText} trend="New" trendType="up" />
        <StatCard title="Collected Today" value="₹48,500" icon={IndianRupee} trend="18%" trendType="up" />
        <StatCard title="Pending Fees" value="₹3,45,000" icon={AlertTriangle} trend="12%" trendType="down" />

        <StatCard title="Upcoming Exams" value="2" icon={GraduationCap} />
        <StatCard title="Upcoming Events" value="4" icon={Calendar} />
        <StatCard title="New Admissions" value="120" icon={UserPlus} trend="15%" trendType="up" />
        <StatCard title="Classes / Sections" value="12 / 36" icon={School} />
      </div>

      {/* Quick Actions Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Add Student', path: '/school-admin/students', color: 'bg-emerald-500/10 text-emerald-600' },
            { label: 'Add Teacher', path: '/school-admin/teachers', color: 'bg-indigo-500/10 text-indigo-600' },
            { label: 'Collect Fee', path: '/school-admin/fees', color: 'bg-amber-500/10 text-amber-600' },
            { label: 'Mark Staff Attendance', path: '/school-admin/attendance', color: 'bg-sky-500/10 text-sky-600' },
            { label: 'Create Announcement', path: '/school-admin/communication', color: 'bg-rose-500/10 text-rose-600' },
            { label: 'Create Event', path: '/school-admin/events', color: 'bg-violet-500/10 text-violet-650' },
            { label: 'Create Exam', path: '/school-admin/exams', color: 'bg-fuchsia-500/10 text-fuchsia-600' },
            { label: 'View Reports', path: '/school-admin/reports', color: 'bg-teal-500/10 text-teal-600' }
          ].map((act, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickAction(act.path)}
              className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-750 hover:shadow-sm rounded-2xl text-left transition-all"
            >
              <div className={`p-2.5 rounded-xl ${act.color}`}>
                <PlusCircle className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{act.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Admissions Trend */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Admissions Trend (This Year)</h4>
          <AreaChart data={ADMISSIONS_TREND} xKey="month" yKey="admissions" fillColor="#6366f1" strokeColor="#4f46e5" />
        </div>

        {/* Weekly Attendance */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Weekly Attendance Rate %</h4>
          <BarChart data={ATTENDANCE_TREND} xKey="day" yKey="attendance" barColor="#10b981" />
        </div>

        {/* Fee Collection */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Monthly Fee Collection</h4>
          <BarChart data={FEE_TREND} xKey="month" yKey="collected" barColor="#f59e0b" />
        </div>

        {/* Exam Performance */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Exam Performance Trend (Average %)</h4>
          <LineChart data={EXAM_PERFORMANCE} xKey="name" yKey="average" lineColor="#a855f7" />
        </div>

        {/* Gender Ratio */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Student Gender Distribution</h4>
          <PieChart data={GENDER_RATIO} nameKey="name" valueKey="count" />
        </div>

        {/* Class Strength */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Class-wise Student Strength</h4>
          <BarChart data={CLASS_STRENGTH} xKey="class" yKey="strength" barColor="#3b82f6" />
        </div>
      </div>

      {/* Recent Activities Feed */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Recent Activities Logs</h4>
          <button 
            onClick={() => navigate('/school-admin/audit')}
            className="flex items-center gap-1 text-[11px] font-bold text-indigo-650 dark:text-indigo-400 hover:underline"
          >
            <span>View audit logs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-850">
          {RECENT_ACTIVITIES.map((act) => (
            <div key={act.id} className="flex items-center justify-between py-3.5 text-xs">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-950 font-bold text-[10px] text-slate-500 uppercase tracking-wide">
                  {act.category}
                </span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{act.text}</span>
              </div>
              <span className="text-[10px] font-semibold text-slate-400">{act.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
