import {
  LayoutDashboard,
  BookOpen,
  FolderTree,
  Warehouse,
  FileCheck,
  FileX,
  Bookmark,
  Receipt,
  Users,
  BarChart3,
  Bell,
  History,
  Settings
} from 'lucide-react';

export const NAVIGATION_ITEMS = [
  // MAIN
  { name: 'Dashboard', path: '/librarian/dashboard', icon: LayoutDashboard, category: 'Main' },
  
  // CATALOGUE
  { name: 'Book Directory', path: '/librarian/books', icon: BookOpen, category: 'Catalogue' },
  { name: 'Book Categories', path: '/librarian/categories', icon: FolderTree, category: 'Catalogue' },
  { name: 'Inventory Management', path: '/librarian/inventory', icon: Warehouse, category: 'Catalogue' },
  
  // CIRCULATION
  { name: 'Issue Book', path: '/librarian/issue', icon: FileCheck, category: 'Circulation' },
  { name: 'Return Book', path: '/librarian/return', icon: FileX, category: 'Circulation' },
  { name: 'Reservations', path: '/librarian/reservation', icon: Bookmark, category: 'Circulation' },
  { name: 'Fine Management', path: '/librarian/fines', icon: Receipt, category: 'Circulation' },
  
  // MEMBERS
  { name: 'Members Directory', path: '/librarian/members', icon: Users, category: 'Members' },
  
  // SYSTEM
  { name: 'Reports & Analytics', path: '/librarian/reports', icon: BarChart3, category: 'System' },
  { name: 'Audit Logs', path: '/librarian/audit', icon: History, category: 'System' },
  { name: 'Notifications', path: '/librarian/notifications', icon: Bell, category: 'System' },
  { name: 'Library Settings', path: '/librarian/settings', icon: Settings, category: 'System' }
];

export const MOCK_BOOKS = [];
export const MOCK_ISSUES = [];
export const MOCK_FINES = [];
export const MOCK_MEMBERS = [];
export const MOCK_RESERVATIONS = [];
export const MOCK_LOGS = [];
export const MOCK_CATEGORIES = [];
