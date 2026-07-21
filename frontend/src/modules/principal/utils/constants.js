import {
  LayoutDashboard,
  Users,
  UserCheck,
  GraduationCap,
  ClipboardCheck,
  FileSpreadsheet,
  BookOpen,
  CheckSquare,
  Video,
  Megaphone,
  Calendar,
  BarChart3,
  Bell,
  Settings
} from 'lucide-react';
import { MOCK_STUDENTS as SHARED_STUDENTS } from '../../../shared/data/students';
import { MOCK_STAFF as SHARED_STAFF } from '../../../shared/data/staff';

const gradeOf = (className) => className.replace(/^Class\s*/, '');
const findShared = (id) => SHARED_STUDENTS.find((s) => s.id === id);

export const NAVIGATION_ITEMS = [
  // MAIN
  { name: 'Dashboard', path: '/principal/dashboard', icon: LayoutDashboard, category: 'Main' },
  
  // MONITORING
  { name: 'Student Monitoring', path: '/principal/students', icon: Users, category: 'Monitoring' },
  { name: 'Teacher Monitoring', path: '/principal/teachers', icon: UserCheck, category: 'Monitoring' },
  { name: 'Academic Monitoring', path: '/principal/academics', icon: GraduationCap, category: 'Monitoring' },
  { name: 'Attendance Monitoring', path: '/principal/attendance', icon: ClipboardCheck, category: 'Monitoring' },
  { name: 'Examination Monitoring', path: '/principal/exams', icon: FileSpreadsheet, category: 'Monitoring' },
  { name: 'Homework Monitoring', path: '/principal/homework', icon: BookOpen, category: 'Monitoring' },
  
  // MANAGEMENT
  { name: 'Leave Approval', path: '/principal/leave', icon: CheckSquare, category: 'Management' },
  { name: 'Meetings', path: '/principal/meetings', icon: Video, category: 'Management' },
  
  // COMMUNICATION
  { name: 'Announcements & Circulars', path: '/principal/communication', icon: Megaphone, category: 'Communication' },
  { name: 'Events', path: '/principal/events', icon: Calendar, category: 'Communication' },
  
  // SYSTEM
  { name: 'Reports Hub', path: '/principal/reports', icon: BarChart3, category: 'System' },
  { name: 'Notifications', path: '/principal/notifications', icon: Bell, category: 'System' },
  { name: 'Settings', path: '/principal/settings', icon: Settings, category: 'System' }
];

// Module-local monitoring records, keyed by the shared student id.
// Identity fields (name/class/section/dob/parent contact) come from
// shared/data/students.js — 'STU-001' below is Aarav Sharma, reconciled
// onto the same shared id (STU108902) used by teacher/student/parent.
const STUDENT_RECORDS = {
  STU108902: { status: 'Active', attendanceRate: 96, gpa: 9.2, pendingFees: 0, behaviorScore: 'Excellent', medicalInfo: 'No known allergies or chronic illnesses. Fit for sports.', promotionHistory: [{ fromClass: '8', toClass: '9', date: '2024-04-01', status: 'Promoted' }, { fromClass: '9', toClass: '10', date: '2025-04-01', status: 'Promoted' }], transferHistory: [{ fromSchool: 'St. Xavier High School', reason: 'Family Relocation', date: '2023-06-15' }], graduationStatus: 'Undergraduate' },
  'STU-002': { status: 'Active', attendanceRate: 74, gpa: 5.8, pendingFees: 12000, behaviorScore: 'Needs Improvement', medicalInfo: 'Mild asthma. Inhaler stored in first-aid locker.', promotionHistory: [{ fromClass: '8', toClass: '9', date: '2024-04-01', status: 'Promoted' }, { fromClass: '9', toClass: '10', date: '2025-04-01', status: 'Promoted' }], transferHistory: [], graduationStatus: 'Undergraduate' },
  's013': { status: 'Active', attendanceRate: 91, gpa: 8.5, pendingFees: 0, behaviorScore: 'Good', medicalInfo: 'Allergic to peanuts.', promotionHistory: [{ fromClass: '7', toClass: '8', date: '2024-04-01', status: 'Promoted' }, { fromClass: '8', toClass: '9', date: '2025-04-01', status: 'Promoted' }], transferHistory: [], graduationStatus: 'Undergraduate' },
  'STU-004': { status: 'Active', attendanceRate: 98, gpa: 9.8, pendingFees: 0, behaviorScore: 'Outstanding', medicalInfo: 'No known issues.', promotionHistory: [{ fromClass: '9', toClass: '10', date: '2024-04-01', status: 'Promoted' }, { fromClass: '10', toClass: '11', date: '2025-04-01', status: 'Promoted' }], transferHistory: [], graduationStatus: 'Undergraduate' },
  'STU-005': { status: 'Active', attendanceRate: 68, gpa: 4.9, pendingFees: 24000, behaviorScore: 'Concern Raised', medicalInfo: 'Lactose intolerant.', promotionHistory: [{ fromClass: '10', toClass: '11', date: '2024-04-01', status: 'Promoted' }, { fromClass: '11', toClass: '12', date: '2025-04-01', status: 'Promoted' }], transferHistory: [], graduationStatus: 'Undergraduate' },
  'STU-006': { status: 'Active', attendanceRate: 94, gpa: 8.9, pendingFees: 0, behaviorScore: 'Excellent', medicalInfo: 'No issues.', promotionHistory: [], transferHistory: [], graduationStatus: 'Undergraduate' },
  'STU-007': { status: 'Inactive', attendanceRate: 85, gpa: 7.2, pendingFees: 0, behaviorScore: 'Good', medicalInfo: 'Wear corrective lenses.', promotionHistory: [], transferHistory: [], graduationStatus: 'Transferred Out' },
  'STU-008': { status: 'Active', attendanceRate: 97, gpa: 9.5, pendingFees: 8000, behaviorScore: 'Excellent', medicalInfo: 'No issues.', promotionHistory: [], transferHistory: [], graduationStatus: 'Undergraduate' },
};

export const MOCK_STUDENTS = Object.entries(STUDENT_RECORDS).map(([id, record]) => {
  const s = findShared(id);
  return {
    id: s.id,
    admissionNo: s.admissionNo,
    name: s.name,
    class: gradeOf(s.class),
    section: s.section,
    gender: s.gender,
    dob: s.dob,
    parentName: s.parentName,
    phone: s.parentPhone,
    email: s.email,
    ...record,
  };
});

// Module-local monitoring records, keyed by the shared staff id (see
// shared/data/staff.js for name/department/qualification/contact).
const TEACHER_RECORDS = {
  'TCH-001': { classes: '10-A, 11-A, 12-C', status: 'Active', attendanceRate: 98, lessonProgress: 88, workloadHours: 24, subjectsLabel: 'Physics, Applied Science', leaveHistory: [{ date: '2026-05-10', days: 2, type: 'Medical Leave', reason: 'Dental recovery' }] },
  'TCH-002': { classes: '9-A, 10-A, 10-B', status: 'Active', attendanceRate: 95, lessonProgress: 75, workloadHours: 22, subjectsLabel: 'Calculus, Algebra', leaveHistory: [{ date: '2026-06-04', days: 1, type: 'Casual Leave', reason: 'Personal matter' }] },
  'TCH-003': { classes: '8-A, 9-A, 11-A', status: 'Active', attendanceRate: 92, lessonProgress: 60, workloadHours: 20, subjectsLabel: 'English Literature, Functional English', leaveHistory: [] },
  'TCH-004': { classes: '9-B, 10-B', status: 'Active', attendanceRate: 97, lessonProgress: 90, workloadHours: 18, subjectsLabel: 'History, Civics', leaveHistory: [{ date: '2026-04-12', days: 4, type: 'Maternity Extension', reason: 'Doctor consultation' }] },
  'TCH-005': { classes: '11-A, 12-C', status: 'Inactive', attendanceRate: 85, lessonProgress: 45, workloadHours: 16, subjectsLabel: 'Database Systems, C++', leaveHistory: [{ date: '2026-07-02', days: 10, type: 'Casual Leave', reason: 'Extended travel' }] },
};

export const MOCK_TEACHERS = Object.entries(TEACHER_RECORDS).map(([id, record]) => {
  const t = SHARED_STAFF.find((s) => s.id === id);
  const { subjectsLabel, ...rest } = record;
  return {
    id: t.id,
    name: t.name,
    department: t.department,
    email: t.email,
    phone: t.phone,
    qualification: t.qualification,
    experience: t.experience,
    subjects: subjectsLabel,
    ...rest,
  };
});

export const MOCK_STAFF = [
  { id: 'STF-001', name: 'Mr. Suresh Mehta', role: 'Accountant', department: 'Finance', status: 'Active', attendanceRate: 98 },
  { id: 'STF-002', name: 'Sanjay Kumar', role: 'Librarian', department: 'Library', status: 'Active', attendanceRate: 95 },
  { id: 'STF-003', name: 'Ravi Kumar', role: 'Security Head', department: 'Security', status: 'Active', attendanceRate: 100 },
  { id: 'STF-004', name: 'Sanjay Dutt', role: 'Driver', department: 'Transport', status: 'Active', attendanceRate: 90 }
];

export const MOCK_LEAVE_REQUESTS = [
  { id: 'LEV-101', staffName: 'Dr. Ramesh Kumar', role: 'Teacher', dates: '2026-07-20 to 2026-07-22', days: 3, reason: 'Viral fever, doctor advised bed rest', status: 'Pending', timestamp: '2026-07-17T09:30:00Z' },
  { id: 'LEV-102', staffName: 'Mrs. Sunita Rao', role: 'Teacher', dates: '2026-07-24', days: 1, reason: 'Family function in native town', status: 'Pending', timestamp: '2026-07-17T11:15:00Z' },
  { id: 'LEV-103', staffName: 'Mr. Suresh Mehta', role: 'Accountant', dates: '2026-07-18 to 2026-07-19', days: 2, reason: 'Urgent bank audit work', status: 'Approved', timestamp: '2026-07-16T14:00:00Z', managerNotes: 'Approved for urgent task needs.' },
  { id: 'LEV-104', staffName: 'Sanjay Kumar', role: 'Librarian', dates: '2026-07-25', days: 1, reason: 'Personal household chores', status: 'Rejected', timestamp: '2026-07-16T15:30:00Z', managerNotes: 'Library stock audit scheduled that day.' }
];

export const MOCK_SYLLABUS = [
  { class: '10-A', subject: 'Physics', progress: 88, status: 'On Track' },
  { class: '10-A', subject: 'Mathematics', progress: 75, status: 'Slightly Behind' },
  { class: '11-A', subject: 'English', progress: 60, status: 'On Track' },
  { class: '12-C', subject: 'Computer Science', progress: 45, status: 'Delayed' },
  { class: '10-B', subject: 'Social Studies', progress: 90, status: 'Completed' }
];

export const MOCK_EXAMS = [
  { id: 'EXM-001', name: 'Mid Term Term-1', startDate: '2026-09-12', endDate: '2026-09-22', classes: 'Class 8 to 12', marksSubmitted: '8/10 Classes', resultPublished: false },
  { id: 'EXM-002', name: 'Unit Test 1', startDate: '2026-05-10', endDate: '2026-05-15', classes: 'Class 1 to 12', marksSubmitted: '10/10 Classes', resultPublished: true },
  { id: 'EXM-003', name: 'Pre-Board Mock Exam', startDate: '2026-11-20', endDate: '2026-12-05', classes: 'Class 10 & 12', marksSubmitted: '0/2 Classes', resultPublished: false }
];

export const MOCK_HOMEWORK = [
  { id: 'HW-001', title: 'Quadratic Equations Assignment', class: '10-A', subject: 'Mathematics', submissionRate: 92, pendingEvaluation: '0/24', teacherName: 'Mrs. Sunita Rao' },
  { id: 'HW-002', title: 'Wave Optics Lab Report', class: '12-C', subject: 'Physics', submissionRate: 78, pendingEvaluation: '4/18', teacherName: 'Dr. Ramesh Kumar' },
  { id: 'HW-003', title: 'Essay: Social Impacts of AI', class: '11-A', subject: 'English', submissionRate: 85, pendingEvaluation: '15/22', teacherName: 'Mr. David D\'souza' }
];

export const MOCK_COMMUNICATIONS = [
  { id: 'COM-001', date: '2026-07-16', type: 'Academic Circular', title: 'Declaration of Term-1 Midterm Syllabus', audience: 'All Parents & Teachers', sentBy: 'Principal' },
  { id: 'COM-002', date: '2026-07-15', type: 'Emergency Notice', title: 'Heavy Rainfall Warning - School Closed on 16th July', audience: 'All Students & Staff', sentBy: 'Principal' },
  { id: 'COM-003', date: '2026-07-04', type: 'Holiday Notice', title: 'Independence Day Celebrations Schedule', audience: 'All Students', sentBy: 'Principal Office' }
];

export const MOCK_MEETINGS = [
  { id: 'MTG-001', title: 'Annual Curriculum & Audit review', type: 'Staff Meeting', date: '2026-07-22', time: '14:30', participants: 'All Academic Staff', status: 'Scheduled' },
  { id: 'MTG-002', title: 'Academic Progress PTM (Q2)', type: 'Parent Meeting', date: '2026-07-28', time: '09:00', participants: 'Class 10 & 12 Parents', status: 'Scheduled' },
  { id: 'MTG-003', title: 'Syllabus Catchup Alignment Session', type: 'Department Meeting', date: '2026-07-15', time: '11:00', participants: 'Science Department', status: 'Completed', notes: 'Agreed to conduct 2 extra classes per week for Physics and Math.' }
];

export const MOCK_AUDIT_LOGS = [
  { id: 'AUD-001', user: 'Principal S. Chatterjee', action: 'Approved Leave Request LEV-101', date: '2026-07-17T11:20:00Z', schoolId: 'SCH-2026-09' },
  { id: 'AUD-002', user: 'Principal S. Chatterjee', action: 'Created Announcement COM-001', date: '2026-07-16T10:15:00Z', schoolId: 'SCH-2026-09' },
  { id: 'AUD-003', user: 'Principal S. Chatterjee', action: 'Scheduled Staff Meeting MTG-001', date: '2026-07-15T15:30:00Z', schoolId: 'SCH-2026-09' }
];

export const MOCK_EVENTS = [
  { id: 'EVT-001', name: 'Annual Science Fair', category: 'Seminars', date: '2026-08-15', assignedStaff: 'Dr. Ramesh Kumar', status: 'Upcoming' },
  { id: 'EVT-002', name: 'Inter-School Football Tournament', category: 'Sports', date: '2026-08-28', assignedStaff: 'Sanjay Dutt', status: 'Upcoming' },
  { id: 'EVT-003', name: 'Teachers Day Celebrations', category: 'Annual Function', date: '2026-09-05', assignedStaff: 'Sanjay Kumar', status: 'Planning' }
];

// DASHBOARD CHART ARRAYS
export const STUDENT_ATTENDANCE_TREND = [
  { month: 'Mon', attendance: 95 },
  { month: 'Tue', attendance: 97 },
  { month: 'Wed', attendance: 94 },
  { month: 'Thu', attendance: 96 },
  { month: 'Fri', attendance: 93 },
  { month: 'Sat', attendance: 90 }
];

export const TEACHER_ATTENDANCE_TREND = [
  { month: 'Mon', attendance: 98 },
  { month: 'Tue', attendance: 100 },
  { month: 'Wed', attendance: 96 },
  { month: 'Thu', attendance: 98 },
  { month: 'Fri', attendance: 95 },
  { month: 'Sat', attendance: 94 }
];

export const ADMISSIONS_TREND = [
  { month: 'Jan', admissions: 15 },
  { month: 'Feb', admissions: 22 },
  { month: 'Mar', admissions: 42 },
  { month: 'Apr', admissions: 89 },
  { month: 'May', admissions: 75 },
  { month: 'Jun', admissions: 110 }
];

export const FEE_COLLECTION_TREND = [
  { month: 'Jan', collected: 150000 },
  { month: 'Feb', collected: 210000 },
  { month: 'Mar', collected: 320000 },
  { month: 'Apr', collected: 450000 },
  { month: 'May', collected: 600000 },
  { month: 'Jun', collected: 780000 }
];

export const EXAM_PERFORMANCE = [
  { name: 'Unit Test 1', average: 75 },
  { name: 'Mid Term 1', average: 81 },
  { name: 'Unit Test 2', average: 78 },
  { name: 'Pre Boards', average: 82 }
];

export const CLASS_PERFORMANCE = [
  { name: 'Class 8', avg: 72 },
  { name: 'Class 9', avg: 76 },
  { name: 'Class 10', avg: 85 },
  { name: 'Class 11', avg: 80 },
  { name: 'Class 12', avg: 88 }
];

export const DEPT_PERFORMANCE = [
  { name: 'Science', score: 86 },
  { name: 'Maths', score: 82 },
  { name: 'English', score: 89 },
  { name: 'Social Studies', score: 80 },
  { name: 'CS', score: 92 }
];

export const GENDER_RATIO = [
  { name: 'Male Students', value: 480 },
  { name: 'Female Students', value: 520 }
];
