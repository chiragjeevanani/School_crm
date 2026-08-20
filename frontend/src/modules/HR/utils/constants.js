import {
  LayoutDashboard,
  Users,
  UserPlus,
  Building,
  Contact,
  CalendarDays,
  CalendarRange,
  BadgeCent,
  FolderOpen,
  Award,
  BarChart3,
  Megaphone,
  ClipboardList,
  Bell,
  Settings as SettingsIcon,
  ShieldCheck,
  CheckCircle,
  Clock,
  FileText
} from 'lucide-react';

export const NAVIGATION_ITEMS = [
  // Dashboard
  {
    title: 'Dashboard',
    path: '/hr/dashboard',
    icon: LayoutDashboard,
  },

  // People & Organization
  {
    title: 'People & Staff',
    icon: Users,
    children: [
      { title: 'Employee Directory', path: '/hr/employees', icon: Users },
      { title: 'Add New Employee', path: '/hr/employees/new', icon: UserPlus },
      { title: 'Departments', path: '/hr/departments', icon: Building },
      { title: 'Designations', path: '/hr/designations', icon: Contact },
    ],
  },

  // Operations
  {
    title: 'HR Operations',
    icon: CalendarDays,
    children: [
      { title: 'Attendance Record', path: '/hr/attendance', icon: CalendarDays },
      { title: 'Leave Management', path: '/hr/leave', icon: CalendarRange },
      { title: 'Payroll & Slips', path: '/hr/payroll', icon: BadgeCent },
      { title: 'Documents Locker', path: '/hr/documents', icon: FolderOpen },
    ],
  },

  // Analytics & Quality
  {
    title: 'Reviews & Reports',
    icon: BarChart3,
    children: [
      { title: 'Performance Reviews', path: '/hr/performance', icon: Award },
      { title: 'Reports Hub', path: '/hr/reports', icon: BarChart3 },
    ],
  },

  // System & Communications
  {
    title: 'System & Notice',
    icon: SettingsIcon,
    children: [
      { title: 'Announcements', path: '/hr/announcements', icon: Megaphone },
      { title: 'System Audit Logs', path: '/hr/audit', icon: ClipboardList },
      { title: 'Notifications Feed', path: '/hr/notifications', icon: Bell },
      { title: 'HR Settings', path: '/hr/settings', icon: SettingsIcon },
    ],
  },
];
