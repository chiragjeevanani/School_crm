import {
  LayoutDashboard,
  Settings2,
  GraduationCap,
  CalendarDays,
  ClipboardCheck,
  FileSpreadsheet,
  BookOpen,
  Users,
  UserCheck,
  FileInput,
  UserCog,
  CreditCard,
  Wallet,
  Bus,
  Home,
  Library,
  Package,
  Calendar,
  Shield,
  Megaphone,
  BarChart3,
  History,
  Settings,
  LifeBuoy
} from 'lucide-react';

import { MOCK_STUDENTS as SHARED_STUDENTS } from '../../../shared/data/students';
import { MOCK_STAFF as SHARED_STAFF } from '../../../shared/data/staff';

const gradeOf = (className) => className.replace(/^Class\s*/, '');
const findSharedStudent = (id) => SHARED_STUDENTS.find((s) => s.id === id);
const findSharedStaff = (name) => SHARED_STAFF.find((s) => s.name === name);

export const NAVIGATION_ITEMS = [
  // MAIN
  { name: 'Dashboard', path: '/school-admin/dashboard', icon: LayoutDashboard, category: 'Main' },
  { name: 'Plans', path: '/school-admin/plans', icon: CreditCard, category: 'Main' },
  
  // ACADEMIC
  { name: 'School Config', path: '/school-admin/school-config', icon: Settings2, category: 'Academic' },
  { name: 'Academics', path: '/school-admin/academics', icon: GraduationCap, category: 'Academic' },
  { name: 'Attendance', path: '/school-admin/attendance', icon: ClipboardCheck, category: 'Academic' },
  { name: 'Exams & Results', path: '/school-admin/exams', icon: FileSpreadsheet, category: 'Academic' },
  { name: 'Homework Monitor', path: '/school-admin/homework', icon: BookOpen, category: 'Academic' },
  
  // PEOPLE
  { name: 'Student Management', path: '/school-admin/students', icon: Users, category: 'People' },
  { name: 'Teacher Management', path: '/school-admin/teachers', icon: UserCheck, category: 'People' },
  { name: 'Admissions', path: '/school-admin/admissions', icon: FileInput, category: 'People' },
  { name: 'User Management', path: '/school-admin/users', icon: UserCog, category: 'People' },
  
  // FINANCE
  { name: 'Fees & Finance', path: '/school-admin/fees', icon: CreditCard, category: 'Finance' },
  { name: 'HR & Payroll', path: '/school-admin/hr', icon: Wallet, category: 'Finance' },
  
  // ADMINISTRATION
  { name: 'Transport', path: '/school-admin/transport', icon: Bus, category: 'Administration' },
  { name: 'Hostel', path: '/school-admin/hostel', icon: Home, category: 'Administration' },
  { name: 'Library', path: '/school-admin/library', icon: Library, category: 'Administration' },
  { name: 'Inventory', path: '/school-admin/inventory', icon: Package, category: 'Administration' },
  { name: 'Events', path: '/school-admin/events', icon: Calendar, category: 'Administration' },
  
  // SYSTEM
  { name: 'Roles & Permissions', path: '/school-admin/roles', icon: Shield, category: 'System' },
  { name: 'Communication', path: '/school-admin/communication', icon: Megaphone, category: 'System' },
  { name: 'Reports Hub', path: '/school-admin/reports', icon: BarChart3, category: 'System' },
  { name: 'Audit Logs', path: '/school-admin/audit', icon: History, category: 'System' },
  { name: 'Help & Support', path: '/school-admin/support', icon: LifeBuoy, category: 'System' },
  { name: 'Settings', path: '/school-admin/settings', icon: Settings, category: 'System' }
];

// Local id -> shared roster id, plus module-only status flag.
const STUDENT_LINKS = [
  { id: '1', sharedId: 'STU108902', status: 'Active' },
  { id: '2', sharedId: 'STU-002', status: 'Active' },
  { id: '3', sharedId: 's013', status: 'Active' },
  { id: '4', sharedId: 'STU-004', status: 'Active' },
  { id: '5', sharedId: 'STU-005', status: 'Active' },
  { id: '6', sharedId: 'STU-006', status: 'Active' },
  { id: '7', sharedId: 'STU-007', status: 'Inactive' },
  { id: '8', sharedId: 'STU-008', status: 'Active' },
];

export const MOCK_STUDENTS = STUDENT_LINKS.map(({ id, sharedId, status }) => {
  const s = findSharedStudent(sharedId);
  return { id, admissionNo: s.admissionNo, name: s.name, class: gradeOf(s.class), section: s.section, gender: s.gender, dob: s.dob, parentName: s.parentName, phone: s.parentPhone, email: s.email, status };
});

// Local id -> shared staff name, plus module-only status flag.
const TEACHER_LINKS = [
  { id: '1', name: 'Dr. Ramesh Kumar', classes: '10-A, 11-A, 12-C', status: 'Active' },
  { id: '2', name: 'Mrs. Sunita Rao', classes: '9-A, 10-A, 10-B', status: 'Active' },
  { id: '3', name: "Mr. David D'souza", classes: '8-A, 9-A, 11-A', status: 'Active' },
  { id: '4', name: 'Mrs. Priya Nair', classes: '9-B, 10-B', status: 'Active' },
  { id: '5', name: 'Mr. Anil Joshi', classes: '11-A, 12-C', status: 'Inactive' },
];

export const MOCK_TEACHERS = TEACHER_LINKS.map(({ id, name, classes, status }) => {
  const t = findSharedStaff(name);
  return { id, name: t.name, department: t.department, email: t.email, phone: t.phone, qualification: t.qualification, classes, status };
});

// Names reconciled with each module's own leadership persona (see
// shared/data/staff.js) instead of inventing a second "the accountant" /
// "the librarian" / "the transport manager" / "the HR manager".
export const MOCK_EMPLOYEES = [
  { id: '1', name: findSharedStaff('Mr. Suresh Mehta').name, role: 'Accountant', email: findSharedStaff('Mr. Suresh Mehta').email, phone: '+91 92222 00001', department: 'Finance', status: 'Active' },
  { id: '2', name: findSharedStaff('Sanjay Kumar').name, role: 'Librarian', email: findSharedStaff('Sanjay Kumar').email, phone: '+91 92222 00002', department: 'Library', status: 'Active' },
  { id: '3', name: findSharedStaff('Manish Dave').name, role: 'Transport Manager', email: findSharedStaff('Manish Dave').email, phone: '+91 92222 00003', department: 'Transport', status: 'Active' },
  { id: '4', name: findSharedStaff('Mr. Suresh Kumar').name, role: 'HR Manager', email: findSharedStaff('Mr. Suresh Kumar').email, phone: '+91 92222 00004', department: 'HR', status: 'Active' },
  { id: '5', name: 'Mr. Somnath Lal', role: 'Lab Assistant', email: 'somnath.l@school.edu', phone: '+91 92222 00005', department: 'Science Labs', status: 'Active' }
];

export const MOCK_ADMISSIONS = [
  { id: '1', name: 'Pranav Mishra', gender: 'Male', dob: '2012-05-14', class: '9', parentName: 'Deepak Mishra', phone: '+91 98888 00001', email: 'pranav.m@gmail.com', documentsStatus: 'Verified', status: 'Pending Review' },
  { id: '2', name: 'Sneha Kulkarni', gender: 'Female', dob: '2013-09-02', class: '8', parentName: 'Nitin Kulkarni', phone: '+91 98888 00002', email: 'sneha.k@gmail.com', documentsStatus: 'Pending', status: 'Waiting List' },
  { id: '3', name: 'Aditya Das', gender: 'Male', dob: '2010-02-28', class: '11', parentName: 'Prosenjit Das', phone: '+91 98888 00003', email: 'aditya.d@gmail.com', documentsStatus: 'Verified', status: 'Approved' },
  { id: '4', name: 'Meera Deshmukh', gender: 'Female', dob: '2011-12-10', class: '10', parentName: 'Sunil Deshmukh', phone: '+91 98888 00004', email: 'meera.d@gmail.com', documentsStatus: 'Rejected', status: 'Rejected' }
];

export const MOCK_CLASSES = [
  { id: '1', name: 'Class 8', capacity: 40, classTeacher: 'Mr. David D\'souza', sections: 'A, B', strength: 75 },
  { id: '2', name: 'Class 9', capacity: 40, classTeacher: 'Mrs. Sunita Rao', sections: 'A, B', strength: 78 },
  { id: '3', name: 'Class 10', capacity: 35, classTeacher: 'Dr. Ramesh Kumar', sections: 'A, B, C', strength: 95 },
  { id: '4', name: 'Class 11', capacity: 30, classTeacher: 'Mr. Anil Joshi', sections: 'A, B', strength: 55 },
  { id: '5', name: 'Class 12', capacity: 30, classTeacher: 'Mrs. Priya Nair', sections: 'A, B, C', strength: 82 }
];

export const MOCK_SECTIONS = [
  { id: '1', class: 'Class 10', name: 'Section A', strength: 32, room: 'Room 301' },
  { id: '2', class: 'Class 10', name: 'Section B', strength: 33, room: 'Room 302' },
  { id: '3', class: 'Class 10', name: 'Section C', strength: 30, room: 'Room 303' },
  { id: '4', class: 'Class 9', name: 'Section A', strength: 40, room: 'Room 201' },
  { id: '5', class: 'Class 9', name: 'Section B', strength: 38, room: 'Room 202' }
];

export const MOCK_SUBJECTS = [
  { id: '1', class: 'Class 10', name: 'Physics', code: 'PHY101', subjectTeacher: 'Dr. Ramesh Kumar', type: 'Theory' },
  { id: '2', class: 'Class 10', name: 'Mathematics', code: 'MAT101', subjectTeacher: 'Mrs. Sunita Rao', type: 'Theory' },
  { id: '3', class: 'Class 10', name: 'English Literature', code: 'ENG101', subjectTeacher: 'Mr. David D\'souza', type: 'Theory' },
  { id: '4', class: 'Class 10', name: 'Social Science', code: 'SOC101', subjectTeacher: 'Mrs. Priya Nair', type: 'Theory' },
  { id: '5', class: 'Class 10', name: 'Physics Practical', code: 'PHY101P', subjectTeacher: 'Dr. Ramesh Kumar', type: 'Practical' }
];

export const MOCK_TIMETABLE = [
  { id: '1', class: 'Class 10', section: 'A', day: 'Monday', period: '1st', time: '08:30 AM - 09:15 AM', subject: 'Mathematics', teacher: 'Mrs. Sunita Rao' },
  { id: '2', class: 'Class 10', section: 'A', day: 'Monday', period: '2nd', time: '09:15 AM - 10:00 AM', subject: 'Physics', teacher: 'Dr. Ramesh Kumar' },
  { id: '3', class: 'Class 10', section: 'A', day: 'Monday', period: '3rd', time: '10:00 AM - 10:45 AM', subject: 'English', teacher: 'Mr. David D\'souza' },
  { id: '4', class: 'Class 10', section: 'A', day: 'Monday', period: '4th', time: '11:00 AM - 11:45 AM', subject: 'Chemistry', teacher: 'Mrs. Sunita Rao' }
];

export const MOCK_EXAMS = [
  { id: '1', name: 'First Term Exams', type: 'Written', status: 'Completed', startDate: '2026-05-10', endDate: '2026-05-20' },
  { id: '2', name: 'Half Yearly Exams', type: 'Written', status: 'Scheduled', startDate: '2026-09-15', endDate: '2026-09-28' },
  { id: '3', name: 'Final Term Exams', type: 'Written', status: 'Scheduled', startDate: '2027-03-01', endDate: '2027-03-15' },
  { id: '4', name: 'Class Test 1', type: 'Unit Test', status: 'Published', startDate: '2026-07-25', endDate: '2026-07-28' }
];

export const MOCK_FEE_COLLECTION = [
  { id: '1', receiptNo: 'REC-2026-081', studentName: 'Aarav Sharma', class: '10', date: '2026-07-17', amount: 15000, category: 'Tuition Fee', status: 'Paid', method: 'UPI' },
  { id: '2', receiptNo: 'REC-2026-082', studentName: 'Diya Patel', class: '10', date: '2026-07-17', amount: 3500, category: 'Transport Fee', status: 'Paid', method: 'Cash' },
  { id: '3', receiptNo: 'REC-2026-083', studentName: 'Ananya Iyer', class: '11', date: '2026-07-16', amount: 18000, category: 'Tuition Fee', status: 'Paid', method: 'Card' },
  { id: '4', receiptNo: 'REC-2026-084', studentName: 'Vihaan Gupta', class: '12', date: '2026-07-15', amount: 20000, category: 'Hostel Fee', status: 'Paid', method: 'Net Banking' },
  { id: '5', receiptNo: 'REC-2026-085', studentName: 'Ishita Reddy', class: '8', date: '2026-07-14', amount: 12000, category: 'Tuition Fee', status: 'Refunded', method: 'UPI' }
];

export const MOCK_AUDIT_LOGS = [
  { id: '1', user: 'admin', action: 'Update School Info', module: 'Configuration', oldValue: 'Principal: Dr. A. K. Sen', newValue: 'Principal: Dr. S. Chatterjee', date: '2026-07-17', time: '11:30 AM', ip: '192.168.1.102', device: 'Chrome / Windows 11' },
  { id: '2', user: 'admin', action: 'Approve Admission', module: 'Admissions', oldValue: 'Status: Pending', newValue: 'Status: Approved', date: '2026-07-17', time: '10:15 AM', ip: '192.168.1.102', device: 'Chrome / Windows 11' },
  { id: '3', user: 'admin', action: 'Update Fee Category', module: 'Fee Management', oldValue: 'Tuition: 12000', newValue: 'Tuition: 15000', date: '2026-07-16', time: '04:45 PM', ip: '192.168.1.15', device: 'Safari / macOS' },
  { id: '4', user: 'admin', action: 'Add Teacher', module: 'User Management', oldValue: 'N/A', newValue: 'Priya Nair (Social Studies)', date: '2026-07-15', time: '09:00 AM', ip: '192.168.1.102', device: 'Chrome / Windows 11' },
  { id: '5', user: 'admin', action: 'Generate Salary Slips', module: 'HR & Payroll', oldValue: 'Pending', newValue: 'Generated (June 2026)', date: '2026-07-05', time: '06:12 PM', ip: '192.168.1.22', device: 'Firefox / Linux' }
];
