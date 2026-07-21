import {
  LayoutDashboard,
  Search,
  CreditCard,
  Receipt,
  Layers,
  Percent,
  AlertOctagon,
  CornerUpLeft,
  FileBarChart,
  History,
  Bell,
  Settings
} from 'lucide-react';

import { MOCK_STUDENTS as SHARED_STUDENTS } from '../../../shared/data/students';

const gradeOf = (className) => className.replace(/^Class\s*/, '');
const findSharedStudent = (id) => SHARED_STUDENTS.find((s) => s.id === id);

export const NAVIGATION_ITEMS = [
  // MAIN
  { name: 'Dashboard', path: '/accountant/dashboard', icon: LayoutDashboard, category: 'Main' },
  
  // FEES
  { name: 'Fee Collection', path: '/accountant/fee-collection', icon: CreditCard, category: 'Fees' },
  { name: 'Receipt Management', path: '/accountant/receipts', icon: Receipt, category: 'Fees' },
  { name: 'Installments', path: '/accountant/installments', icon: Layers, category: 'Fees' },
  { name: 'Discounts & Scholarships', path: '/accountant/discounts', icon: Percent, category: 'Fees' },
  { name: 'Late Fee Management', path: '/accountant/late-fees', icon: AlertOctagon, category: 'Fees' },
  { name: 'Refund Management', path: '/accountant/refunds', icon: CornerUpLeft, category: 'Fees' },
  
  // ANALYSIS
  { name: 'Financial Reports', path: '/accountant/reports', icon: FileBarChart, category: 'Analysis' },
  { name: 'Student Financial History', path: '/accountant/student-history', icon: History, category: 'Analysis' },
  
  // SYSTEM
  { name: 'Audit Logs', path: '/accountant/audit', icon: History, category: 'System' },
  { name: 'Notifications', path: '/accountant/notifications', icon: Bell, category: 'System' },
  { name: 'Settings', path: '/accountant/settings', icon: Settings, category: 'System' }
];

// Local fee-ledger id -> shared roster id. 'STU-001' (Aarav Sharma) is
// kept as this module's internal key (it's referenced by id across
// MOCK_COLLECTIONS/INSTALLMENTS/DISCOUNTS/REFUNDS below) but its identity
// fields now resolve to the shared STU108902 record instead of a second,
// slightly-different "Aarav Sharma".
const STUDENT_LINKS = [
  { id: 'STU-001', sharedId: 'STU108902', pendingFees: 0, status: 'Active' },
  { id: 'STU-002', sharedId: 'STU-002', pendingFees: 12000, status: 'Active' },
  { id: 'STU-003', sharedId: 's013', pendingFees: 0, status: 'Active' },
  { id: 'STU-004', sharedId: 'STU-004', pendingFees: 0, status: 'Active' },
  { id: 'STU-005', sharedId: 'STU-005', pendingFees: 24000, status: 'Active' },
  { id: 'STU-006', sharedId: 'STU-006', pendingFees: 4000, status: 'Active' },
  { id: 'STU-007', sharedId: 'STU-007', pendingFees: 0, status: 'Inactive' },
  { id: 'STU-008', sharedId: 'STU-008', pendingFees: 8000, status: 'Active' },
];

export const MOCK_STUDENTS = STUDENT_LINKS.map(({ id, sharedId, pendingFees, status }) => {
  const s = findSharedStudent(sharedId);
  return { id, admissionNo: s.admissionNo, name: s.name, class: gradeOf(s.class), section: s.section, guardianName: s.parentName, phone: s.parentPhone, pendingFees, status };
});

export const MOCK_COLLECTIONS = [
  {
    id: 'RCT-2026-0001',
    studentId: 'STU-001',
    studentName: 'Aarav Sharma',
    class: '10',
    section: 'A',
    admissionNo: 'ADM-2024-8902',
    schoolId: 'SCH-2026-09',
    academicSession: '2026-2027',
    paymentDate: '2026-07-17',
    totalAmount: 10500,
    paidAmount: 10500,
    discountAmount: 1000,
    scholarshipAmount: 1500,
    lateFine: 0,
    remainingBalance: 0,
    paymentMethod: 'UPI',
    transactionRef: 'UPI20260717001',
    status: 'Paid',
    feeHeads: [
      { name: 'Tuition Fee', amount: 8000, paid: 8000 },
      { name: 'Transport Fee', amount: 2000, paid: 2000 },
      { name: 'Library Fee', amount: 500, paid: 500 }
    ],
    createdBy: 'ACC-001',
    time: '10:15 AM'
  },
  {
    id: 'RCT-2026-0002',
    studentId: 'STU-002',
    studentName: 'Diya Patel',
    class: '10',
    section: 'B',
    admissionNo: 'ADM2026102',
    schoolId: 'SCH-2026-09',
    academicSession: '2026-2027',
    paymentDate: '2026-07-17',
    totalAmount: 12000,
    paidAmount: 6000,
    discountAmount: 0,
    scholarshipAmount: 0,
    lateFine: 200,
    remainingBalance: 6200,
    paymentMethod: 'Cash',
    transactionRef: 'CSH20260717002',
    status: 'Partial',
    feeHeads: [
      { name: 'Tuition Fee', amount: 10000, paid: 5000 },
      { name: 'Exam Fee', amount: 2000, paid: 1000 }
    ],
    createdBy: 'ACC-001',
    time: '11:30 AM'
  },
  {
    id: 'RCT-2026-0003',
    studentId: 'STU-003',
    studentName: 'Kabir Verma',
    class: '9',
    section: 'A',
    admissionNo: 'ADM2026103',
    schoolId: 'SCH-2026-09',
    academicSession: '2026-2027',
    paymentDate: '2026-07-16',
    totalAmount: 9000,
    paidAmount: 9000,
    discountAmount: 0,
    scholarshipAmount: 0,
    lateFine: 0,
    remainingBalance: 0,
    paymentMethod: 'Net Banking',
    transactionRef: 'NET20260716003',
    status: 'Paid',
    feeHeads: [
      { name: 'Tuition Fee', amount: 7500, paid: 7500 },
      { name: 'Library Fee', amount: 1500, paid: 1500 }
    ],
    createdBy: 'ACC-001',
    time: '02:45 PM'
  },
  {
    id: 'RCT-2026-0004',
    studentId: 'STU-004',
    studentName: 'Ananya Iyer',
    class: '11',
    section: 'A',
    admissionNo: 'ADM2026104',
    schoolId: 'SCH-2026-09',
    academicSession: '2026-2027',
    paymentDate: '2026-07-15',
    totalAmount: 15000,
    paidAmount: 15000,
    discountAmount: 0,
    scholarshipAmount: 3000,
    lateFine: 0,
    remainingBalance: 0,
    paymentMethod: 'Credit Card',
    transactionRef: 'CRD20260715004',
    status: 'Paid',
    feeHeads: [
      { name: 'Tuition Fee', amount: 12000, paid: 12000 },
      { name: 'Admission Fee', amount: 3000, paid: 3000 }
    ],
    createdBy: 'ACC-001',
    time: '09:30 AM'
  }
];

export const MOCK_INSTALLMENTS = [
  {
    id: 'INS-001',
    studentId: 'STU-002',
    studentName: 'Diya Patel',
    totalAmount: 12000,
    installments: [
      { seq: 1, dueDate: '2026-04-10', amount: 4000, paidDate: '2026-04-08', status: 'Paid' },
      { seq: 2, dueDate: '2026-07-10', amount: 4000, paidDate: '2026-07-17', status: 'Paid' },
      { seq: 3, dueDate: '2026-10-10', amount: 4000, paidDate: null, status: 'Pending' }
    ]
  },
  {
    id: 'INS-002',
    studentId: 'STU-005',
    studentName: 'Vihaan Gupta',
    totalAmount: 24000,
    installments: [
      { seq: 1, dueDate: '2026-04-10', amount: 8000, paidDate: '2026-04-09', status: 'Paid' },
      { seq: 2, dueDate: '2026-07-10', amount: 8000, paidDate: null, status: 'Overdue' },
      { seq: 3, dueDate: '2026-10-10', amount: 8000, paidDate: null, status: 'Upcoming' }
    ]
  }
];

export const MOCK_DISCOUNTS = [
  { id: 'DSC-001', studentId: 'STU-001', studentName: 'Aarav Sharma', type: 'Scholarship', percentage: 25, amount: 2500, reason: 'Merit scholarship - Top 5 rank', approvalRef: 'APRV-2026-001', status: 'Approved' },
  { id: 'DSC-002', studentId: 'STU-004', studentName: 'Ananya Iyer', type: 'Concession', percentage: 20, amount: 3000, reason: 'Sibling concession scheme', approvalRef: 'APRV-2026-002', status: 'Approved' },
  { id: 'DSC-003', studentId: 'STU-006', studentName: 'Ishita Reddy', type: 'Waiver', percentage: 50, amount: 2000, reason: 'Economic weaker section waiver', approvalRef: 'APRV-2026-003', status: 'Pending' }
];

export const MOCK_REFUNDS = [
  { id: 'REF-001', receiptId: 'RCT-2026-0001', studentId: 'STU-001', studentName: 'Aarav Sharma', amount: 2000, reason: 'Library fee overpayment correction', status: 'Approved', refundMethod: 'Bank Transfer', createdAt: '2026-07-16T10:00:00Z' },
  { id: 'REF-002', receiptId: 'RCT-2026-0002', studentId: 'STU-002', studentName: 'Diya Patel', amount: 1500, reason: 'Admission withdrawal processing', status: 'Pending', refundMethod: 'UPI', createdAt: '2026-07-17T09:30:00Z' }
];

export const MOCK_LATE_FEES = [
  { id: 'RULE-001', name: 'Standard Tuition Late Fine', gracePeriodDays: 5, dailyFine: 50, maximumCap: 1000, active: true },
  { id: 'RULE-002', name: 'Transport Fine Rule', gracePeriodDays: 3, dailyFine: 20, maximumCap: 500, active: true }
];

export const MOCK_AUDIT_LOGS = [
  { id: 'AUD-001', user: 'Mr. Suresh Mehta (ACC-001)', action: 'Collected tuition fee for STU-001', date: '2026-07-17', time: '10:15 AM', ip: '192.168.1.104' },
  { id: 'AUD-002', user: 'Mr. Suresh Mehta (ACC-001)', action: 'Issued duplicate receipt RCT-2026-0001', date: '2026-07-17', time: '10:30 AM', ip: '192.168.1.104' },
  { id: 'AUD-003', user: 'Mr. Suresh Mehta (ACC-001)', action: 'Approved refund request REF-001', date: '2026-07-16', time: '04:00 PM', ip: '192.168.1.105' }
];

// ANALYTICS DATASETS
export const DAILY_FEE_COLLECTION = [
  { day: '07-10', collection: 45000 },
  { day: '07-11', collection: 62000 },
  { day: '07-12', collection: 30000 },
  { day: '07-13', collection: 85000 },
  { day: '07-14', collection: 92000 },
  { day: '07-15', collection: 110000 },
  { day: '07-16', collection: 95000 },
  { day: '07-17', collection: 16500 }
];

export const MONTHLY_COLLECTION_TREND = [
  { month: 'Jan', collected: 250000 },
  { month: 'Feb', collected: 320000 },
  { month: 'Mar', collected: 450000 },
  { month: 'Apr', collected: 1200000 },
  { month: 'May', collected: 850000 },
  { month: 'Jun', collected: 950000 },
  { month: 'Jul', collected: 1150000 }
];

export const FEE_CATEGORY_DISTRIBUTION = [
  { name: 'Tuition Fee', value: 850000 },
  { name: 'Transport Fee', value: 210000 },
  { name: 'Hostel Fee', value: 340000 },
  { name: 'Library Fee', value: 65000 },
  { name: 'Exam Fee', value: 120000 }
];

export const PENDING_FEES_ANALYSIS = [
  { class: 'Class 8', pending: 45000 },
  { class: 'Class 9', pending: 82000 },
  { class: 'Class 10', pending: 120000 },
  { class: 'Class 11', pending: 95000 },
  { class: 'Class 12', pending: 155000 }
];

export const PAYMENT_METHOD_DISTRIBUTION = [
  { name: 'UPI', value: 450 },
  { name: 'Cash', value: 180 },
  { name: 'Net Banking', value: 210 },
  { name: 'Card', value: 160 }
];
