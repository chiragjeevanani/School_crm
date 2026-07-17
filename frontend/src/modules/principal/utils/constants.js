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

export const MOCK_STUDENTS = [
  { 
    id: 'STU-001', 
    admissionNo: 'ADM2026101', 
    name: 'Aarav Sharma', 
    class: '10', 
    section: 'A', 
    gender: 'Male', 
    dob: '2011-04-12', 
    parentName: 'Rajesh Sharma', 
    phone: '+91 98765 00001', 
    email: 'aarav.sharma@school.edu', 
    status: 'Active',
    attendanceRate: 96,
    gpa: 9.2,
    pendingFees: 0,
    behaviorScore: 'Excellent',
    medicalInfo: 'No known allergies or chronic illnesses. Fit for sports.',
    promotionHistory: [
      { fromClass: '8', toClass: '9', date: '2024-04-01', status: 'Promoted' },
      { fromClass: '9', toClass: '10', date: '2025-04-01', status: 'Promoted' }
    ],
    transferHistory: [
      { fromSchool: 'St. Xavier High School', reason: 'Family Relocation', date: '2023-06-15' }
    ],
    graduationStatus: 'Undergraduate'
  },
  { 
    id: 'STU-002', 
    admissionNo: 'ADM2026102', 
    name: 'Diya Patel', 
    class: '10', 
    section: 'B', 
    gender: 'Female', 
    dob: '2011-08-22', 
    parentName: 'Ketan Patel', 
    phone: '+91 98765 00002', 
    email: 'diya.patel@school.edu', 
    status: 'Active',
    attendanceRate: 74,
    gpa: 5.8,
    pendingFees: 12000,
    behaviorScore: 'Needs Improvement',
    medicalInfo: 'Mild asthma. Inhaler stored in first-aid locker.',
    promotionHistory: [
      { fromClass: '8', toClass: '9', date: '2024-04-01', status: 'Promoted' },
      { fromClass: '9', toClass: '10', date: '2025-04-01', status: 'Promoted' }
    ],
    transferHistory: [],
    graduationStatus: 'Undergraduate'
  },
  { 
    id: 'STU-003', 
    admissionNo: 'ADM2026103', 
    name: 'Kabir Verma', 
    class: '9', 
    section: 'A', 
    gender: 'Male', 
    dob: '2012-01-15', 
    parentName: 'Sanjay Verma', 
    phone: '+91 98765 00003', 
    email: 'kabir.verma@school.edu', 
    status: 'Active',
    attendanceRate: 91,
    gpa: 8.5,
    pendingFees: 0,
    behaviorScore: 'Good',
    medicalInfo: 'Allergic to peanuts.',
    promotionHistory: [
      { fromClass: '7', toClass: '8', date: '2024-04-01', status: 'Promoted' },
      { fromClass: '8', toClass: '9', date: '2025-04-01', status: 'Promoted' }
    ],
    transferHistory: [],
    graduationStatus: 'Undergraduate'
  },
  { 
    id: 'STU-004', 
    admissionNo: 'ADM2026104', 
    name: 'Ananya Iyer', 
    class: '11', 
    section: 'A', 
    gender: 'Female', 
    dob: '2010-09-05', 
    parentName: 'Raman Iyer', 
    phone: '+91 98765 00004', 
    email: 'ananya.iyer@school.edu', 
    status: 'Active',
    attendanceRate: 98,
    gpa: 9.8,
    pendingFees: 0,
    behaviorScore: 'Outstanding',
    medicalInfo: 'No known issues.',
    promotionHistory: [
      { fromClass: '9', toClass: '10', date: '2024-04-01', status: 'Promoted' },
      { fromClass: '10', toClass: '11', date: '2025-04-01', status: 'Promoted' }
    ],
    transferHistory: [],
    graduationStatus: 'Undergraduate'
  },
  { 
    id: 'STU-005', 
    admissionNo: 'ADM2026105', 
    name: 'Vihaan Gupta', 
    class: '12', 
    section: 'C', 
    gender: 'Male', 
    dob: '2009-03-30', 
    parentName: 'Alok Gupta', 
    phone: '+91 98765 00005', 
    email: 'vihaan.gupta@school.edu', 
    status: 'Active',
    attendanceRate: 68,
    gpa: 4.9,
    pendingFees: 24000,
    behaviorScore: 'Concern Raised',
    medicalInfo: 'Lactose intolerant.',
    promotionHistory: [
      { fromClass: '10', toClass: '11', date: '2024-04-01', status: 'Promoted' },
      { fromClass: '11', toClass: '12', date: '2025-04-01', status: 'Promoted' }
    ],
    transferHistory: [],
    graduationStatus: 'Undergraduate'
  },
  { 
    id: 'STU-006', 
    admissionNo: 'ADM2026106', 
    name: 'Ishita Reddy', 
    class: '8', 
    section: 'A', 
    gender: 'Female', 
    dob: '2013-11-18', 
    parentName: 'Venkat Reddy', 
    phone: '+91 98765 00006', 
    email: 'ishita.reddy@school.edu', 
    status: 'Active',
    attendanceRate: 94,
    gpa: 8.9,
    pendingFees: 0,
    behaviorScore: 'Excellent',
    medicalInfo: 'No issues.',
    promotionHistory: [],
    transferHistory: [],
    graduationStatus: 'Undergraduate'
  },
  { 
    id: 'STU-007', 
    admissionNo: 'ADM2026107', 
    name: 'Arjun Mehta', 
    class: '10', 
    section: 'A', 
    gender: 'Male', 
    dob: '2011-06-14', 
    parentName: 'Praveen Mehta', 
    phone: '+91 98765 00007', 
    email: 'arjun.mehta@school.edu', 
    status: 'Inactive',
    attendanceRate: 85,
    gpa: 7.2,
    pendingFees: 0,
    behaviorScore: 'Good',
    medicalInfo: 'Wear corrective lenses.',
    promotionHistory: [],
    transferHistory: [],
    graduationStatus: 'Transferred Out'
  },
  { 
    id: 'STU-008', 
    admissionNo: 'ADM2026108', 
    name: 'Riya Sen', 
    class: '12', 
    section: 'A', 
    gender: 'Female', 
    dob: '2009-07-21', 
    parentName: 'Amit Sen', 
    phone: '+91 98765 00008', 
    email: 'riya.sen@school.edu', 
    status: 'Active',
    attendanceRate: 97,
    gpa: 9.5,
    pendingFees: 8000,
    behaviorScore: 'Excellent',
    medicalInfo: 'No issues.',
    promotionHistory: [],
    transferHistory: [],
    graduationStatus: 'Undergraduate'
  }
];

export const MOCK_TEACHERS = [
  { 
    id: 'TCH-001', 
    name: 'Dr. Ramesh Kumar', 
    department: 'Science', 
    email: 'ramesh.kumar@school.edu', 
    phone: '+91 91111 00001', 
    qualification: 'Ph.D in Physics', 
    experience: '12 Years',
    classes: '10-A, 11-A, 12-C', 
    status: 'Active',
    attendanceRate: 98,
    lessonProgress: 88,
    workloadHours: 24,
    subjects: 'Physics, Applied Science',
    leaveHistory: [
      { date: '2026-05-10', days: 2, type: 'Medical Leave', reason: 'Dental recovery' }
    ]
  },
  { 
    id: 'TCH-002', 
    name: 'Mrs. Sunita Rao', 
    department: 'Mathematics', 
    email: 'sunita.rao@school.edu', 
    phone: '+91 91111 00002', 
    qualification: 'M.Sc Mathematics, B.Ed', 
    experience: '9 Years',
    classes: '9-A, 10-A, 10-B', 
    status: 'Active',
    attendanceRate: 95,
    lessonProgress: 75,
    workloadHours: 22,
    subjects: 'Calculus, Algebra',
    leaveHistory: [
      { date: '2026-06-04', days: 1, type: 'Casual Leave', reason: 'Personal matter' }
    ]
  },
  { 
    id: 'TCH-003', 
    name: 'Mr. David D\'souza', 
    department: 'English', 
    email: 'david.d@school.edu', 
    phone: '+91 91111 00003', 
    qualification: 'M.A English Lit', 
    experience: '6 Years',
    classes: '8-A, 9-A, 11-A', 
    status: 'Active',
    attendanceRate: 92,
    lessonProgress: 60,
    workloadHours: 20,
    subjects: 'English Literature, Functional English',
    leaveHistory: []
  },
  { 
    id: 'TCH-004', 
    name: 'Mrs. Priya Nair', 
    department: 'Social Studies', 
    email: 'priya.nair@school.edu', 
    phone: '+91 91111 00004', 
    qualification: 'M.A History, B.Ed', 
    experience: '14 Years',
    classes: '9-B, 10-B', 
    status: 'Active',
    attendanceRate: 97,
    lessonProgress: 90,
    workloadHours: 18,
    subjects: 'History, Civics',
    leaveHistory: [
      { date: '2026-04-12', days: 4, type: 'Maternity Extension', reason: 'Doctor consultation' }
    ]
  },
  { 
    id: 'TCH-005', 
    name: 'Mr. Anil Joshi', 
    department: 'Computer Science', 
    email: 'anil.joshi@school.edu', 
    phone: '+91 91111 00005', 
    qualification: 'MCA, B.Ed', 
    experience: '5 Years',
    classes: '11-A, 12-C', 
    status: 'Inactive',
    attendanceRate: 85,
    lessonProgress: 45,
    workloadHours: 16,
    subjects: 'Database Systems, C++',
    leaveHistory: [
      { date: '2026-07-02', days: 10, type: 'Casual Leave', reason: 'Extended travel' }
    ]
  }
];

export const MOCK_STAFF = [
  { id: 'STF-001', name: 'John Doe', role: 'Accountant', department: 'Finance', status: 'Active', attendanceRate: 98 },
  { id: 'STF-002', name: 'Mary Watson', role: 'Librarian', department: 'Library', status: 'Active', attendanceRate: 95 },
  { id: 'STF-003', name: 'Ravi Kumar', role: 'Security Head', department: 'Security', status: 'Active', attendanceRate: 100 },
  { id: 'STF-004', name: 'Sanjay Dutt', role: 'Driver', department: 'Transport', status: 'Active', attendanceRate: 90 }
];

export const MOCK_LEAVE_REQUESTS = [
  { id: 'LEV-101', staffName: 'Dr. Ramesh Kumar', role: 'Teacher', dates: '2026-07-20 to 2026-07-22', days: 3, reason: 'Viral fever, doctor advised bed rest', status: 'Pending', timestamp: '2026-07-17T09:30:00Z' },
  { id: 'LEV-102', staffName: 'Mrs. Sunita Rao', role: 'Teacher', dates: '2026-07-24', days: 1, reason: 'Family function in native town', status: 'Pending', timestamp: '2026-07-17T11:15:00Z' },
  { id: 'LEV-103', staffName: 'John Doe', role: 'Accountant', dates: '2026-07-18 to 2026-07-19', days: 2, reason: 'Urgent bank audit work', status: 'Approved', timestamp: '2026-07-16T14:00:00Z', managerNotes: 'Approved for urgent task needs.' },
  { id: 'LEV-104', staffName: 'Mary Watson', role: 'Librarian', dates: '2026-07-25', days: 1, reason: 'Personal household chores', status: 'Rejected', timestamp: '2026-07-16T15:30:00Z', managerNotes: 'Library stock audit scheduled that day.' }
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
  { id: 'EVT-003', name: 'Teachers Day Celebrations', category: 'Annual Function', date: '2026-09-05', assignedStaff: 'Mary Watson', status: 'Planning' }
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
