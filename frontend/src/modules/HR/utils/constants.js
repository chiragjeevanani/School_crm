import {
  LayoutDashboard,
  Users,
  Building,
  Contact,
  CalendarDays,
  CalendarRange,
  BadgeCent,
  FolderOpen,
  Award,
  Megaphone,
  BarChart3,
  ClipboardList,
  Bell,
  Settings
} from 'lucide-react';

export const NAVIGATION_ITEMS = [
  // MAIN
  { name: 'Dashboard', path: '/hr/dashboard', icon: LayoutDashboard, category: 'Main' },
  
  // PEOPLE
  { name: 'Employee Directory', path: '/hr/employees', icon: Users, category: 'People' },
  { name: 'Departments', path: '/hr/departments', icon: Building, category: 'People' },
  { name: 'Designations', path: '/hr/designations', icon: Contact, category: 'People' },
  
  // OPERATIONS
  { name: 'Attendance Record', path: '/hr/attendance', icon: CalendarDays, category: 'Operations' },
  { name: 'Leave Management', path: '/hr/leave', icon: CalendarRange, category: 'Operations' },
  { name: 'Payroll & Slips', path: '/hr/payroll', icon: BadgeCent, category: 'Operations' },
  { name: 'Documents Locker', path: '/hr/documents', icon: FolderOpen, category: 'Operations' },
  
  // ANALYTICS
  { name: 'Performance reviews', path: '/hr/performance', icon: Award, category: 'Analytics' },
  { name: 'Reports Hub', path: '/hr/reports', icon: BarChart3, category: 'Analytics' },
  
  // SYSTEM
  { name: 'Announcements Board', path: '/hr/announcements', icon: Megaphone, category: 'System' },
  { name: 'System Audit Logs', path: '/hr/audit', icon: ClipboardList, category: 'System' },
  { name: 'Notifications Feed', path: '/hr/notifications', icon: Bell, category: 'System' },
  { name: 'System Settings', path: '/hr/settings', icon: Settings, category: 'System' }
];

export const MOCK_EMPLOYEES = [];
export const MOCK_DEPARTMENTS = [];
export const MOCK_DESIGNATIONS = [];
export const MOCK_ATTENDANCE = [];
export const MOCK_LEAVE_REQUESTS = [];
export const MOCK_LEAVE_BALANCES = {};
export const MOCK_PAYROLL = [];
export const MOCK_REVIEWS = [];
export const MOCK_AUDIT_LOGS = [];

// ANALYTICS DATASETS
export const DEPARTMENT_WISE_EMPLOYEES = [];
export const ATTENDANCE_TREND = [];
export const LEAVE_STATISTICS = [];
export const PAYROLL_DISTRIBUTION = [];
export const EMPLOYEE_GROWTH = [];
