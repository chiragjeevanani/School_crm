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
  Settings,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { findStaffByName } from '../../../shared/data/staff';

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

export const MOCK_EMPLOYEES = [
  {
    id: 'EMP-001',
    employeeId: 'GFS-EMP-001',
    name: findStaffByName('Mrs. Priya Nair').name,
    gender: 'Female',
    dob: '1988-05-14',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    // Reconciled with principal/school-admin's shared staff record for
    // Mrs. Priya Nair (Social Studies) — this record previously listed a
    // conflicting "Mathematics" department for the same name.
    department: findStaffByName('Mrs. Priya Nair').department,
    designation: 'Senior Teacher',
    employmentType: 'Full-Time',
    joiningDate: '2018-07-01',
    status: 'Active',
    email: findStaffByName('Mrs. Priya Nair').email,
    phone: '+91 99999 00001',
    address: 'Flat 302, Green Meadows, Gachibowli, Hyderabad',
    emergencyContact: { name: 'Rohan Nair', relation: 'Spouse', phone: '+91 99999 11111' },
    qualifications: [{ degree: 'M.A History, B.Ed', institution: 'Delhi University', year: 2010 }],
    skills: ['History', 'Civics', 'Political Science'],
    salary: { basic: 45000, hra: 9000, da: 4500, conveyance: 1500, medical: 1250 },
    bankDetails: { accountNo: '10020030040', ifsc: 'SBIN0001234', bankName: 'State Bank of India', branch: 'Gachibowli' },
    documents: [
      { type: 'Aadhaar Card', url: '#', verified: true, expiryDate: null },
      { type: 'PAN Card', url: '#', verified: true, expiryDate: null },
      { type: 'Employment Contract', url: '#', verified: true, expiryDate: '2028-06-30' }
    ],
    aadhaarNo: '1234 5678 9012',
    panNo: 'ABCDE1234F',
    pfNo: 'MH12345678901',
    esiNo: '2214567890'
  },
  {
    id: 'EMP-002',
    employeeId: 'GFS-EMP-002',
    name: 'Mr. Alok Verma',
    gender: 'Male',
    dob: '1985-09-22',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    department: 'Science',
    designation: 'HOD',
    employmentType: 'Full-Time',
    joiningDate: '2015-06-15',
    status: 'Active',
    email: 'alok.verma@greenfield.edu',
    phone: '+91 99999 00002',
    address: 'Plot 45, Jubilee Hills, Hyderabad',
    emergencyContact: { name: 'Sunita Verma', relation: 'Spouse', phone: '+91 99999 22222' },
    qualifications: [{ degree: 'Ph.D Physics', institution: 'IIT Bombay', year: 2012 }],
    skills: ['Quantum Mechanics', 'Optics', 'Lab Safety'],
    salary: { basic: 60000, hra: 12000, da: 6000, conveyance: 2000, medical: 1500 },
    bankDetails: { accountNo: '20030040050', ifsc: 'HDFC0000567', bankName: 'HDFC Bank', branch: 'Jubilee Hills' },
    documents: [
      { type: 'Aadhaar Card', url: '#', verified: true, expiryDate: null },
      { type: 'PAN Card', url: '#', verified: true, expiryDate: null }
    ],
    aadhaarNo: '2345 6789 0123',
    panNo: 'BCDEF2345G',
    pfNo: 'MH23456789012',
    esiNo: '2224567890'
  },
  {
    id: 'EMP-003',
    employeeId: 'GFS-EMP-003',
    name: 'Ms. Shalini Sen',
    gender: 'Female',
    dob: '1992-12-05',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    department: 'Finance',
    designation: 'Accountant',
    employmentType: 'Full-Time',
    joiningDate: '2020-02-10',
    status: 'Active',
    email: 'shalini.sen@greenfield.edu',
    phone: '+91 99999 00003',
    address: 'Villa 12, Cyber Meadows, Kondapur, Hyderabad',
    emergencyContact: { name: 'Kalyan Sen', relation: 'Father', phone: '+91 99999 33333' },
    qualifications: [{ degree: 'M.Com', institution: 'Osmania University', year: 2014 }],
    skills: ['Tally Prime', 'Taxation', 'Financial Audit'],
    salary: { basic: 40000, hra: 8000, da: 4000, conveyance: 1500, medical: 1000 },
    bankDetails: { accountNo: '30040050060', ifsc: 'ICIC0000987', bankName: 'ICICI Bank', branch: 'Kondapur' },
    documents: [
      { type: 'Aadhaar Card', url: '#', verified: true, expiryDate: null },
      { type: 'PAN Card', url: '#', verified: true, expiryDate: null }
    ],
    aadhaarNo: '3456 7890 1234',
    panNo: 'CDEFG3456H',
    pfNo: 'MH34567890123',
    esiNo: '2234567890'
  },
  {
    id: 'EMP-004',
    employeeId: 'GFS-EMP-004',
    // Renamed from "Mr. Rajesh Kumar" — that name collided with the
    // teacher module's Mr. Rajesh Kumar (Senior Maths Teacher, a
    // completely different person/role). See shared/data/staff.js.
    name: findStaffByName('Mr. Vikram Kumar').name,
    gender: 'Male',
    dob: '1980-04-18',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    department: 'PE & Sports',
    designation: 'Sports Instructor',
    employmentType: 'Contract',
    joiningDate: '2021-08-01',
    status: 'Active',
    email: 'vikram.sports@greenfield.edu',
    phone: '+91 99999 00004',
    address: 'H-No 4/3, Madhapur, Hyderabad',
    emergencyContact: { name: 'Rama Devi', relation: 'Mother', phone: '+91 99999 44444' },
    qualifications: [{ degree: 'B.P.Ed', institution: 'LNCPE Gwalior', year: 2003 }],
    skills: ['Athletics coaching', 'Football coaching', 'First Aid'],
    salary: { basic: 30000, hra: 6000, da: 3000, conveyance: 1500, medical: 1000 },
    bankDetails: { accountNo: '40050060070', ifsc: 'AXIS0000123', bankName: 'Axis Bank', branch: 'Madhapur' },
    documents: [
      { type: 'Aadhaar Card', url: '#', verified: true, expiryDate: null },
      { type: 'PAN Card', url: '#', verified: true, expiryDate: null }
    ],
    aadhaarNo: '4567 8901 2345',
    panNo: 'DEFGH4567I',
    pfNo: 'MH45678901234',
    esiNo: '2244567890'
  }
];

export const MOCK_DEPARTMENTS = [
  { id: 'DEPT-001', name: 'Social Studies', headName: 'Mrs. Priya Nair', employeeCount: 8, description: 'Secondary & High School Social Studies Dept' },
  { id: 'DEPT-002', name: 'Science', headName: 'Mr. Alok Verma', employeeCount: 14, description: 'Physics, Chemistry, and Biology Laboratories' },
  { id: 'DEPT-003', name: 'PE & Sports', headName: 'Mr. Vikram Kumar', employeeCount: 4, description: 'Physical Training and Sports Teams Development' },
  { id: 'DEPT-004', name: 'Finance', headName: 'Ms. Shalini Sen', employeeCount: 3, description: 'School Accounts, Fees Ledgers, and Payroll Audit' },
  { id: 'DEPT-005', name: 'Administration', headName: 'Mr. Suresh Kumar', employeeCount: 6, description: 'Front Desk Office, Registry, and HRMS records' }
];

export const MOCK_DESIGNATIONS = [
  { id: 'DES-001', name: 'Senior Teacher', department: 'Academics', gradeLevel: 'Senior', employeeCount: 18 },
  { id: 'DES-002', name: 'HOD', department: 'Academics', gradeLevel: 'Lead', employeeCount: 6 },
  { id: 'DES-003', name: 'Accountant', department: 'Finance', gradeLevel: 'Senior Officer', employeeCount: 2 },
  { id: 'DES-004', name: 'Sports Instructor', department: 'PE & Sports', gradeLevel: 'Trainer', employeeCount: 3 },
  { id: 'DES-005', name: 'HR Executive', department: 'Administration', gradeLevel: 'Officer', employeeCount: 2 }
];

export const MOCK_ATTENDANCE = [
  { id: 'ATT-001', employeeId: 'EMP-001', employeeName: 'Mrs. Priya Nair', date: '2026-07-17', status: 'Present', inTime: '08:50 AM', outTime: '05:10 PM', workingHours: 8.3 },
  { id: 'ATT-002', employeeId: 'EMP-002', employeeName: 'Mr. Alok Verma', date: '2026-07-17', status: 'Late', inTime: '09:15 AM', outTime: '05:15 PM', workingHours: 8.0 },
  { id: 'ATT-003', employeeId: 'EMP-003', employeeName: 'Ms. Shalini Sen', date: '2026-07-17', status: 'Present', inTime: '08:45 AM', outTime: '05:00 PM', workingHours: 8.25 },
  { id: 'ATT-004', employeeId: 'EMP-004', employeeName: 'Mr. Vikram Kumar', date: '2026-07-17', status: 'Leave', inTime: '--', outTime: '--', workingHours: 0 }
];

export const MOCK_LEAVE_REQUESTS = [
  { id: 'LVE-001', employeeId: 'EMP-001', employeeName: 'Mrs. Priya Nair', leaveType: 'Sick Leave', fromDate: '2026-07-20', toDate: '2026-07-21', days: 2, reason: 'Viral fever rest recommended by physician', status: 'Pending', appliedOn: '2026-07-17' },
  { id: 'LVE-002', employeeId: 'EMP-004', employeeName: 'Mr. Vikram Kumar', leaveType: 'Casual Leave', fromDate: '2026-07-17', toDate: '2026-07-17', days: 1, reason: 'Personal family chore event attendance', status: 'Approved', appliedOn: '2026-07-15' },
  { id: 'LVE-003', employeeId: 'EMP-002', employeeName: 'Mr. Alok Verma', leaveType: 'Earned Leave', fromDate: '2026-07-25', toDate: '2026-07-29', days: 5, reason: 'Out of town travel vacation plan', status: 'Approved', appliedOn: '2026-07-12' }
];

export const MOCK_LEAVE_BALANCES = {
  'EMP-001': { casual: 8, sick: 10, earned: 18 },
  'EMP-002': { casual: 10, sick: 12, earned: 24 },
  'EMP-003': { casual: 12, sick: 14, earned: 30 },
  'EMP-004': { casual: 6, sick: 8, earned: 12 }
};

export const MOCK_PAYROLL = [
  { id: 'PAY-001', employeeId: 'EMP-001', employeeName: 'Mrs. Priya Nair', month: 'July', year: '2026', basic: 45000, allowances: 16250, deductions: 5600, netSalary: 55650, status: 'Paid', datePaid: '2026-07-31' },
  { id: 'PAY-002', employeeId: 'EMP-002', employeeName: 'Mr. Alok Verma', month: 'July', year: '2026', basic: 60000, allowances: 21500, deductions: 7200, netSalary: 74300, status: 'Paid', datePaid: '2026-07-31' },
  { id: 'PAY-003', employeeId: 'EMP-003', employeeName: 'Ms. Shalini Sen', month: 'July', year: '2026', basic: 40000, allowances: 14500, deductions: 4800, netSalary: 49700, status: 'Pending', datePaid: '--' }
];

export const MOCK_REVIEWS = [
  { id: 'REV-001', employeeName: 'Mrs. Priya Nair', rating: 4.8, remarks: 'Excellent performance in class curriculum and exam structures.' },
  { id: 'REV-002', employeeName: 'Mr. Alok Verma', rating: 4.5, remarks: 'Great department management leadership in science laboratories setup.' }
];

export const MOCK_AUDIT_LOGS = [
  { id: 'AUD-001', user: 'Mr. Suresh Kumar (HR-001)', action: 'Registered new employee record (EMP-004)', date: '2026-07-15', time: '11:00 AM', ip: '192.168.1.110' },
  { id: 'AUD-002', user: 'Mr. Suresh Kumar (HR-001)', action: 'Approved casual leave request (LVE-002)', date: '2026-07-16', time: '02:30 PM', ip: '192.168.1.110' },
  { id: 'AUD-003', user: 'Mr. Suresh Kumar (HR-001)', action: 'Processed monthly salary disbursements (July 2026)', date: '2026-07-17', time: '10:00 AM', ip: '192.168.1.112' }
];

// ANALYTICS DATASETS
export const DEPARTMENT_WISE_EMPLOYEES = [
  { name: 'Social Studies', value: 8 },
  { name: 'Science', value: 14 },
  { name: 'PE & Sports', value: 4 },
  { name: 'Finance', value: 3 },
  { name: 'Administration', value: 6 }
];

export const ATTENDANCE_TREND = [
  { date: '07-10', rate: 96 },
  { date: '07-11', rate: 95 },
  { date: '07-12', rate: 97 },
  { date: '07-13', rate: 98 },
  { date: '07-14', rate: 94 },
  { date: '07-15', rate: 96 },
  { date: '07-16', rate: 97 },
  { date: '07-17', rate: 98 }
];

export const LEAVE_STATISTICS = [
  { name: 'Casual Leave', value: 45 },
  { name: 'Sick Leave', value: 30 },
  { name: 'Earned Leave', value: 15 },
  { name: 'Unpaid Leave', value: 10 }
];

export const PAYROLL_DISTRIBUTION = [
  { dept: 'Social Studies', budget: 440000 },
  { dept: 'Science', budget: 850000 },
  { dept: 'PE & Sports', budget: 160000 },
  { dept: 'Finance', budget: 150000 },
  { dept: 'Administration', budget: 280000 }
];

export const EMPLOYEE_GROWTH = [
  { year: '2022', count: 20 },
  { year: '2023', count: 25 },
  { year: '2024', count: 29 },
  { year: '2025', count: 32 },
  { year: '2026', count: 35 }
];
