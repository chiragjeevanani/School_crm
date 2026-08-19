import React from 'react';
import { useHRAuth } from '../context/HRAuthContext';
import { useHRNotifications } from '../context/HRNotificationContext';
import { 
  Users, 
  TrendingUp, 
  CalendarDays, 
  CalendarRange, 
  Clock, 
  ArrowRight,
  UserPlus,
  Coins,
  BadgeCent,
  ShieldCheck,
  Building,
  Contact,
  Megaphone
} from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { StatCard } from '../components/ui/StatCard';
import { AreaChart } from '../components/ui/Charts/AreaChart';
import { BarChart } from '../components/ui/Charts/BarChart';
import { PieChart } from '../components/ui/Charts/PieChart';
import { LineChart } from '../components/ui/Charts/LineChart';
import { useNavigate } from 'react-router-dom';

import {
  DEPARTMENT_WISE_EMPLOYEES,
  ATTENDANCE_TREND,
  LEAVE_STATISTICS,
  PAYROLL_DISTRIBUTION,
  EMPLOYEE_GROWTH,
  MOCK_EMPLOYEES
} from '../utils/constants';

import { useAppStore } from '../../../shared/store/useAppStore';

export const Dashboard = () => {
  const { user } = useHRAuth();
  const { notifications } = useHRNotifications();
  const navigate = useNavigate();
  const { staff = [], leaves = [] } = useAppStore();

  const totalEmployees = staff.length;
  const teachingStaff = staff.filter(s => s.role?.toLowerCase() === 'teacher').length;
  const nonTeachingStaff = totalEmployees - teachingStaff;
  const pendingLeaves = leaves.filter(l => l.status === 'Pending').length;

  return (
    <div className="space-y-6">
      {/* Welcome Board */}
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 select-none">
        <div className="flex items-center gap-4">
          <img 
            src={user?.photo} 
            alt={user?.name} 
            className="w-16 h-16 rounded-2xl object-cover border-2 border-rose-500 shrink-0" 
          />
          <div className="text-left">
            <span className="text-[10px] font-extrabold tracking-widest text-rose-400 uppercase">
              Staff & Payroll Administration
            </span>
            <h2 className="text-lg md:text-xl font-black mt-0.5">Welcome, {user?.name}</h2>
            <p className="text-xs text-slate-400 mt-1 font-semibold">
              Employee ID: {user?.employeeId} • {user?.department} • Academic Session {user?.academicSession}
            </p>
          </div>
        </div>
        <div className="text-left md:text-right md:border-l md:border-slate-850 md:pl-6">
          <span className="text-[10px] font-black text-slate-505 uppercase tracking-widest block">HRMS Workspace Date</span>
          <span className="text-xs font-bold text-slate-350 mt-1 block">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Quick Operations Actions bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-3xl p-5 shadow-sm">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-3">Quick Actions Desk</span>
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
          <button 
            onClick={() => navigate('/hr/employees')} 
            className="flex items-center gap-2 px-3.5 py-3 bg-rose-50 hover:bg-rose-100 dark:bg-rose-955/20 text-rose-650 dark:text-rose-450 rounded-2xl text-xs font-extrabold transition-all text-left"
          >
            <UserPlus className="w-4 h-4 shrink-0 text-rose-600" />
            <span>Add Employee</span>
          </button>
          <button 
            onClick={() => navigate('/hr/attendance')} 
            className="flex items-center gap-2 px-3.5 py-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 text-slate-655 dark:text-slate-350 border rounded-2xl text-xs font-extrabold transition-all text-left"
          >
            <CalendarDays className="w-4 h-4 shrink-0 text-slate-400" />
            <span>Mark Attendance</span>
          </button>
          <button 
            onClick={() => navigate('/hr/leave')} 
            className="flex items-center gap-2 px-3.5 py-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 text-slate-655 dark:text-slate-350 border rounded-2xl text-xs font-extrabold transition-all text-left"
          >
            <CalendarRange className="w-4 h-4 shrink-0 text-slate-400" />
            <span>Approve Leave</span>
          </button>
          <button 
            onClick={() => navigate('/hr/payroll')} 
            className="flex items-center gap-2 px-3.5 py-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 text-slate-655 dark:text-slate-350 border rounded-2xl text-xs font-extrabold transition-all text-left"
          >
            <Coins className="w-4 h-4 shrink-0 text-slate-400" />
            <span>Process Payroll</span>
          </button>
          <button 
            onClick={() => navigate('/hr/payroll')} 
            className="flex items-center gap-2 px-3.5 py-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 text-slate-655 dark:text-slate-350 border rounded-2xl text-xs font-extrabold transition-all text-left"
          >
            <BadgeCent className="w-4 h-4 shrink-0 text-slate-400" />
            <span>Salary Slips</span>
          </button>
          <button 
            onClick={() => navigate('/hr/reports')} 
            className="flex items-center gap-2 px-3.5 py-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 text-slate-655 dark:text-slate-350 border rounded-2xl text-xs font-extrabold transition-all text-left"
          >
            <TrendingUp className="w-4 h-4 shrink-0 text-slate-400" />
            <span>View Reports</span>
          </button>
        </div>
      </div>

      {/* 12 Quick Statistics cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Employees" value={`${totalEmployees} Staff`} subtitle="active records" icon={Users} />
        <StatCard title="Teaching Staff" value={`${teachingStaff} Teachers`} subtitle="academics division" icon={Users} />
        <StatCard title="Non-Teaching Staff" value={`${nonTeachingStaff} Staff`} subtitle="administrative support" icon={Users} />
        <StatCard title="Today's Attendance" value={totalEmployees > 0 ? "98%" : "0%"} subtitle="present today" icon={ShieldCheck} />

        <StatCard title="Employees on Leave" value="0 Staff" subtitle="approved casual leaves" icon={CalendarRange} />
        <StatCard title="Late Arrivals" value="0 Staff" subtitle="grace period warnings" icon={Clock} />
        <StatCard title="New Joinings" value="0 Joinings" subtitle="registered this cycle" icon={UserPlus} />
        <StatCard title="Pending Leave Requests" value={`${pendingLeaves} Requests`} subtitle="awaiting approval reviews" icon={CalendarRange} />

        <StatCard title="Payroll Status" value="Processed" subtitle="payroll cycle" icon={Coins} />
        <StatCard title="Upcoming Birthdays" value="0 Staff" subtitle="this calendar month" icon={CalendarDays} />
        <StatCard title="Upcoming Work Anniversaries" value="0 Staff" subtitle="this calendar cycle" icon={TrendingUp} />
        <StatCard title="Open Positions" value="0 Vacant" subtitle="unassigned staff slots" icon={Contact} />
      </div>

      {/* 5 HR Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chart 1 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-3xl p-5 shadow-sm">
          <span className="text-[10px] font-black text-slate-450 uppercase tracking-widest block mb-4">Department-wise Employees Allocation</span>
          <BarChart data={DEPARTMENT_WISE_EMPLOYEES} dataKey="value" xKey="name" height={220} color="#e11d48" />
        </div>

        {/* Chart 2 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-3xl p-5 shadow-sm">
          <span className="text-[10px] font-black text-slate-450 uppercase tracking-widest block mb-4">Attendance Trend</span>
          <AreaChart data={ATTENDANCE_TREND} dataKey="rate" xKey="date" height={220} color="#f43f5e" />
        </div>

        {/* Chart 3 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-black text-slate-455 uppercase tracking-widest block mb-4">Leave Statistics by Category</span>
          <div className="flex-1 flex items-center justify-center">
            <PieChart data={LEAVE_STATISTICS} height={200} colors={["#e11d48", "#f43f5e", "#fda4af", "#fb7185", "#fecdd3"]} />
          </div>
        </div>

        {/* Chart 4 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-3xl p-5 shadow-sm">
          <span className="text-[10px] font-black text-slate-450 uppercase tracking-widest block mb-4">Payroll Distribution by Department (INR)</span>
          <BarChart data={PAYROLL_DISTRIBUTION} dataKey="budget" xKey="dept" height={220} color="#f43f5e" />
        </div>

        {/* Chart 5 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-3xl p-5 shadow-sm">
          <span className="text-[10px] font-black text-slate-450 uppercase tracking-widest block mb-4">Employee Growth Chart (Yearly)</span>
          <LineChart data={EMPLOYEE_GROWTH} dataKey="count" xKey="year" height={220} color="#e11d48" />
        </div>
      </div>

      {/* Timeline Feed & Alerts log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity feed list */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm lg:col-span-2 space-y-4 text-xs font-semibold">
          <div className="flex items-center justify-between pb-3 border-b">
            <h4 className="text-xs font-black text-slate-850 dark:text-slate-200 uppercase tracking-wider">Staff Directory Preview</h4>
            <button onClick={() => navigate('/hr/employees')} className="text-[10px] font-bold text-rose-600 hover:underline flex items-center gap-1">
              <span>View Directory</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          {staff.length === 0 ? (
            <div className="py-8 text-center text-xs font-semibold text-slate-400">
              No Result — No employee records registered.
            </div>
          ) : (
            <div className="divide-y divide-slate-105 dark:divide-slate-850/50 space-y-3.5">
              {staff.slice(0, 3).map((item) => (
                <div key={item.id} className="pt-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img src={item.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'} alt={item.name} className="w-9 h-9 rounded-xl object-cover border" />
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">{item.name}</span>
                      <span className="text-[9px] text-slate-450 block mt-0.5">{item.designation || 'Staff'} • {item.department || 'General'}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-black text-rose-700 bg-rose-50 px-2 py-0.5 rounded-lg block uppercase">{item.role || 'Full-Time'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Live Notification feed */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4 text-xs font-semibold">
          <div className="flex items-center justify-between pb-3 border-b">
            <h4 className="text-xs font-black text-slate-850 dark:text-slate-200 uppercase tracking-wider">HR Notifications feed</h4>
          </div>
          <div className="space-y-4 max-h-68 overflow-y-auto no-scrollbar">
            {notifications.map((n) => (
              <div key={n.id} className="flex gap-2.5 text-xs">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0 animate-pulse"></div>
                <div>
                  <span className="font-bold text-slate-905 dark:text-white block">{n.title}</span>
                  <p className="text-[10px] text-slate-450 dark:text-slate-400 mt-0.5 leading-relaxed">{n.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
