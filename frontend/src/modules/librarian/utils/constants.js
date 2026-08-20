import {
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  FolderTree,
  UserCheck,
  Building,
  Copy,
  ArrowLeftRight,
  FileCheck,
  FileX,
  RefreshCw,
  Clock,
  AlertTriangle,
  Users,
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
      { title: 'All Books', path: '/librarian/books', icon: BookOpen },
      { title: 'Add Book', path: '/librarian/books/add', icon: PlusCircle },
      { title: 'Categories', path: '/librarian/books/categories', icon: FolderTree },
      { title: 'Authors', path: '/librarian/books/authors', icon: UserCheck },
      { title: 'Publishers', path: '/librarian/books/publishers', icon: Building },
      { title: 'Book Copies', path: '/librarian/books/copies', icon: Copy },
    ],
  },

  // Issue & Return
  {
    title: 'Issue & Return',
    icon: ArrowLeftRight,
    children: [
      { title: 'Issue Book', path: '/librarian/issue', icon: FileCheck },
      { title: 'Return Book', path: '/librarian/return', icon: FileX },
      { title: 'Renew Book', path: '/librarian/renew', icon: RefreshCw },
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
      { title: 'Fine Rules', path: '/librarian/fines/rules', icon: Sliders },
    ],
  },

  // Transactions
  {
    title: 'Transactions',
    icon: History,
    children: [
      { title: 'Issue History', path: '/librarian/transactions/issues', icon: FileCheck },
      { title: 'Return History', path: '/librarian/transactions/returns', icon: RotateCcw },
      { title: 'Renewal History', path: '/librarian/transactions/renewals', icon: RefreshCw },
      { title: 'Lost / Damaged Books', path: '/librarian/transactions/lost-damaged', icon: AlertTriangle },
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
      { title: 'Library Settings', path: '/librarian/settings', icon: SettingsIcon },
      { title: 'Issue / Return Rules', path: '/librarian/settings/rules', icon: Sliders },
      { title: 'Fine Settings', path: '/librarian/settings/fines', icon: Receipt },
    ],
  },
];
