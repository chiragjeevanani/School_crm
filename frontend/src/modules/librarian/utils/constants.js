import {
  LayoutDashboard,
  BookOpen,
  FolderTree,
  ArrowLeftRight,
  FileCheck,
  FileX,
  RefreshCw,
  Clock,
  AlertTriangle,
  Users,
  User,
  GraduationCap,
  Briefcase,
  Bookmark,
  Hourglass,
  Receipt,
  BadgeAlert,
  Sliders,
  History,
  TrendingUp,
  FileText,
  Bell,
  Settings as SettingsIcon,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

export const NAVIGATION_ITEMS = [
  // Dashboard
  {
    title: 'Dashboard',
    path: '/librarian/dashboard',
    icon: LayoutDashboard,
  },

  // Books
  {
    title: 'Books',
    icon: BookOpen,
    children: [
      { title: 'Categories', path: '/librarian/books/categories', icon: FolderTree },
      { title: 'Books', path: '/librarian/books', icon: BookOpen },
    ],
  },

  // Issue & Return
  {
    title: 'Issue & Return',
    icon: ArrowLeftRight,
    children: [
      { title: 'Issue Book', path: '/librarian/issue', icon: FileCheck },
      { title: 'Return Book', path: '/librarian/return', icon: FileX },
      { title: 'Issued Books', path: '/librarian/issued', icon: Clock },
      { title: 'Overdue Books', path: '/librarian/overdue', icon: AlertTriangle },
    ],
  },

  // Library Members
  {
    title: 'Library Members',
    icon: Users,
    children: [
      { title: 'Students', path: '/librarian/members/students', icon: GraduationCap },
      { title: 'Teachers / Staff', path: '/librarian/members/staff', icon: Briefcase },
      { title: 'All Members', path: '/librarian/members', icon: Users },
    ],
  },

  // Reservations
  {
    title: 'Reservations',
    icon: Bookmark,
    children: [
      { title: 'Book Reservations', path: '/librarian/reservations', icon: Bookmark },
      { title: 'Pending Requests', path: '/librarian/reservations/pending', icon: Hourglass },
    ],
  },

  // Fines
  {
    title: 'Fines',
    icon: Receipt,
    children: [
      { title: 'Pending Fines', path: '/librarian/fines/pending', icon: BadgeAlert },
      { title: 'Collected Fines', path: '/librarian/fines/collected', icon: Receipt },
    ],
  },

  // Transactions
  {
    title: 'Transactions',
    icon: History,
    children: [
      { title: 'Issue History', path: '/librarian/transactions/issues', icon: FileCheck },
      { title: 'Return History', path: '/librarian/transactions/returns', icon: RotateCcw },
    ],
  },

  // Reports
  {
    title: 'Reports',
    icon: TrendingUp,
    children: [
      { title: 'Inventory Report', path: '/librarian/reports/inventory', icon: FileText },
      { title: 'Issue Report', path: '/librarian/reports/issues', icon: FileCheck },
      { title: 'Return Report', path: '/librarian/reports/returns', icon: RotateCcw },
      { title: 'Overdue Report', path: '/librarian/reports/overdue', icon: AlertTriangle },
      { title: 'Fine Report', path: '/librarian/reports/fines', icon: Receipt },
      { title: 'Most Issued Books', path: '/librarian/reports/most-issued', icon: TrendingUp },
    ],
  },

  // Notifications
  {
    title: 'Notifications',
    path: '/librarian/notifications',
    icon: Bell,
  },

  // Settings
  {
    title: 'Settings',
    icon: SettingsIcon,
    children: [
      { title: 'Profile', path: '/librarian/settings/profile', icon: User },
      { title: 'Rules & Fines', path: '/librarian/settings/rules', icon: Sliders },
    ],
  },
];
