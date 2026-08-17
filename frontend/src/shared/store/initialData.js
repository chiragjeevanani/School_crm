import { SCHOOL } from '../data/school';
import { MOCK_STUDENTS as SHARED_STUDENTS } from '../data/students';
import { MOCK_STAFF as SHARED_STAFF } from '../data/staff';
import { MOCK_PARENTS as SHARED_PARENTS } from '../data/parents';
import { ACADEMIC_STRUCTURE } from '../data/academicStructure';

export const INITIAL_DATA = {
  // 1. TENANT & SCHOOL METADATA
  tenant: {
    activeSchoolId: 'SCH-2026-09',
    schools: [
      {
        id: 'SCH-2026-09',
        schoolId: 'greenfield-delhi',
        name: 'Greenfield Public School',
        shortName: 'GFS',
        address: '221, Sector 15, Dwarka, New Delhi - 110075',
        city: 'New Delhi',
        state: 'Delhi',
        country: 'India',
        phone: '+91 11 4567 8901',
        email: 'info@greenfield.edu',
        website: 'www.greenfieldpublicschool.edu.in',
        principal: 'Dr. S. Chatterjee',
        schoolAdmin: 'admin@greenfield.edu',
        status: 'Active',
        plan: 'Enterprise',
        academicSession: '2026-2027',
        maxStudents: 2500,
        maxStaff: 150,
        maxStorage: 200,
        storageUsed: 84.5,
        modules: {
          student: true,
          teacher: true,
          parent: true,
          academics: true,
          attendance: true,
          examination: true,
          fees: true,
          library: true,
          transport: true,
          hostel: true,
          payroll: true,
          inventory: true,
          events: true,
          communication: true,
          reports: true
        }
      },
      {
        id: 'sch_001',
        schoolId: 'st-xaviers',
        name: "St. Xavier's Academy",
        shortName: 'SXA',
        city: 'Mumbai',
        state: 'Maharashtra',
        status: 'Active',
        plan: 'Enterprise',
        academicSession: '2026-2027',
        maxStudents: 2000,
        maxStaff: 120,
        modules: {
          student: true,
          teacher: true,
          parent: true,
          academics: true,
          attendance: true,
          examination: true,
          fees: true,
          library: true,
          transport: true,
          hostel: false,
          payroll: true,
          inventory: true,
          events: true,
          communication: true,
          reports: true
        }
      }
    ]
  },

  // 2. USER CREDENTIALS & SESSIONS (FRD §6, §27)
  auth: {
    users: [
      { id: 'usr-student-01', username: 'STU108902', email: 'aarav.sharma@greenfield.edu', phone: '+91 98765 43210', role: 'student', name: 'Aarav Sharma', studentId: 'STU108902', password: 'password123', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150', status: 'Active' },
      { id: 'usr-student-02', username: 'STU108903', email: 'aanya.sharma@greenfield.edu', phone: '+91 98765 43210', role: 'student', name: 'Aanya Sharma', studentId: 'STU108903', password: 'password123', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', status: 'Active' },
      { id: 'usr-teacher-01', username: 'EMP101', email: 'rajesh.kumar@greenfield.edu', phone: '+91 98111 22334', role: 'teacher', name: 'Mr. Rajesh Kumar', employeeId: 'EMP101', password: 'password123', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', status: 'Active', department: 'Mathematics' },
      { id: 'usr-parent-01', username: 'rajesh.sharma@gmail.com', email: 'rajesh.sharma@gmail.com', phone: '+91 98765 43210', role: 'parent', name: 'Mr. Rajesh Sharma', password: 'password123', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', children: ['STU108902', 'STU108903'], status: 'Active' },
      { id: 'usr-admin-01', username: 'admin', email: 'admin@greenfield.edu', phone: '+91 98000 11111', role: 'school-admin', name: 'Vikramaditya Rao', password: 'admin123', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', status: 'Active' },
      { id: 'usr-principal-01', username: 'principal', email: 'principal@greenfield.edu', phone: '+91 98000 22222', role: 'principal', name: 'Dr. S. Chatterjee', password: 'principal123', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', status: 'Active' },
      { id: 'usr-accountant-01', username: 'accountant', email: 'accountant@greenfield.edu', phone: '+91 98000 33333', role: 'accountant', name: 'Virender Mehta', employeeId: 'EMP201', password: 'accountant123', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', status: 'Active' },
      { id: 'usr-hr-01', username: 'hr', email: 'hr@greenfield.edu', phone: '+91 98000 44444', role: 'hr', name: 'Meenakshi Iyer', employeeId: 'EMP301', password: 'hr123', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', status: 'Active' },
      { id: 'usr-librarian-01', username: 'librarian', email: 'librarian@greenfield.edu', phone: '+91 98000 55555', role: 'librarian', name: 'Sanjay Kumar', employeeId: 'EMP401', password: 'lib123', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150', status: 'Active' },
      { id: 'usr-transport-01', username: 'transport', email: 'transport@greenfield.edu', phone: '+91 98000 66666', role: 'transport', name: 'Manish Dave', employeeId: 'EMP501', password: 'transport123', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150', status: 'Active' },
      { id: 'usr-superadmin-01', username: 'superadmin@gmail.com', email: 'superadmin@gmail.com', phone: '+91 99999 00000', role: 'super-admin', name: 'Super Admin', password: '123', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', status: 'Active' }
    ],
    loginLogs: [
      { id: 'log-01', username: 'admin', role: 'school-admin', timestamp: new Date(Date.now() - 3600000).toISOString(), ip: '192.168.1.10', device: 'Chrome on Windows', status: 'Success' },
      { id: 'log-02', username: 'STU108902', role: 'student', timestamp: new Date(Date.now() - 7200000).toISOString(), ip: '192.168.1.45', device: 'Safari on iPhone', status: 'Success' }
    ]
  },

  // 3. STUDENT LIFECYCLE & ROSTER (FRD §7)
  students: SHARED_STUDENTS.map(s => ({
    ...s,
    status: s.status || 'Active',
    feeStatus: s.id === 'STU108902' ? 'Partial' : (s.id === 'STU-002' ? 'Due' : 'Paid'),
    pendingFees: s.id === 'STU108902' ? 12000 : (s.id === 'STU-002' ? 15000 : (s.id === 'STU-005' ? 24000 : 0)),
    totalFees: 48000,
    paidFees: s.id === 'STU108902' ? 36000 : (s.id === 'STU-002' ? 33000 : (s.id === 'STU-005' ? 24000 : 48000)),
    transportRouteId: s.id === 'STU108902' ? 'RT-002' : (s.id === 'STU108903' ? 'RT-002' : 'RT-001'),
    pickupPoint: s.id === 'STU108902' ? 'Dwarka Mor Metro Station' : 'Janakpuri West',
    hostelRoomId: s.id === 'STU-005' ? 'HR-204' : null,
    documents: [
      { id: 'doc-1', name: 'Birth Certificate', verified: true, uploadDate: '2024-04-10' },
      { id: 'doc-2', name: 'Aadhaar Card', verified: true, uploadDate: '2024-04-10' },
      { id: 'doc-3', name: 'Transfer Certificate', verified: true, uploadDate: '2024-04-12' }
    ]
  })),

  // Admissions Pipeline (FRD §7.1)
  admissions: [
    {
      id: 'ADM-REQ-2026-081',
      name: 'Rohan Sen',
      gender: 'Male',
      dob: '2012-10-18',
      class: '10',
      section: 'A',
      parentName: 'Vikram Sen',
      phone: '+91 99000 11223',
      email: 'rohan.sen@gmail.com',
      address: 'Pocket 4, Sector 12, Dwarka',
      documentsStatus: 'Verified',
      status: 'Pending Review',
      appliedDate: '2026-07-28',
      previousSchool: 'Modern International School',
      category: 'General'
    },
    {
      id: 'ADM-REQ-2026-082',
      name: 'Ananya Deshmukh',
      gender: 'Female',
      dob: '2013-05-12',
      class: '9',
      section: 'A',
      parentName: 'Sanjay Deshmukh',
      phone: '+91 98111 88990',
      email: 'sanjay.deshmukh@gmail.com',
      address: 'DDA Flats, Janakpuri, New Delhi',
      documentsStatus: 'Pending',
      status: 'Pending Review',
      appliedDate: '2026-08-01',
      previousSchool: 'Delhi Public School',
      category: 'General'
    }
  ],

  // 4. STAFF & EMPLOYEES DIRECTORY (FRD §15, §16)
  staff: SHARED_STAFF.map(s => ({
    ...s,
    status: s.status || 'Active',
    basicSalary: s.basicSalary || (s.role === 'Teacher' ? 45000 : (s.role === 'Principal' ? 85000 : 35000)),
    allowances: 8500,
    deductions: 3200,
    leaveBalance: { casual: 8, sick: 10, earned: 15, unpaid: 0 }
  })),

  // 5. ACADEMICS & TIMETABLE (FRD §8, §15)
  academicSessions: [
    { id: 'ses-2026', name: '2026-2027', startDate: '2026-04-01', endDate: '2027-03-31', status: 'Active' },
    { id: 'ses-2025', name: '2025-2026', startDate: '2025-04-01', endDate: '2026-03-31', status: 'Archived' }
  ],
  classes: ACADEMIC_STRUCTURE.classes,
  subjects: ACADEMIC_STRUCTURE.subjects,
  timetable: {
    '10-A': [
      { day: 'Monday', periods: [
        { period: 1, time: '08:00 - 08:45', subject: 'Mathematics', teacher: 'Mr. Rajesh Kumar', room: 'Room 201' },
        { period: 2, time: '08:45 - 09:30', subject: 'Science (Physics)', teacher: 'Mrs. Sunita Rao', room: 'Physics Lab' },
        { period: 3, time: '09:45 - 10:30', subject: 'English', teacher: "Mr. David D'souza", room: 'Room 201' },
        { period: 4, time: '10:30 - 11:15', subject: 'Social Studies', teacher: 'Mrs. Priya Nair', room: 'Room 201' },
        { period: 5, time: '11:45 - 12:30', subject: 'Computer Science', teacher: 'Mr. Anil Joshi', room: 'CS Lab 1' },
        { period: 6, time: '12:30 - 01:15', subject: 'Hindi / Regional', teacher: 'Mrs. Kavita Singh', room: 'Room 201' },
        { period: 7, time: '01:15 - 02:00', subject: 'Physical Education', teacher: 'Mr. Manish Dave', room: 'Ground' }
      ]},
      { day: 'Tuesday', periods: [
        { period: 1, time: '08:00 - 08:45', subject: 'Science (Chemistry)', teacher: 'Mrs. Sunita Rao', room: 'Chemistry Lab' },
        { period: 2, time: '08:45 - 09:30', subject: 'Mathematics', teacher: 'Mr. Rajesh Kumar', room: 'Room 201' },
        { period: 3, time: '09:45 - 10:30', subject: 'English', teacher: "Mr. David D'souza", room: 'Room 201' },
        { period: 4, time: '10:30 - 11:15', subject: 'Social Studies', teacher: 'Mrs. Priya Nair', room: 'Room 201' },
        { period: 5, time: '11:45 - 12:30', subject: 'Science (Biology)', teacher: 'Mrs. Sunita Rao', room: 'Biology Lab' },
        { period: 6, time: '12:30 - 01:15', subject: 'Library', teacher: 'Mr. Sanjay Kumar', room: 'Central Library' },
        { period: 7, time: '01:15 - 02:00', subject: 'Mathematics', teacher: 'Mr. Rajesh Kumar', room: 'Room 201' }
      ]},
      { day: 'Wednesday', periods: [
        { period: 1, time: '08:00 - 08:45', subject: 'Mathematics', teacher: 'Mr. Rajesh Kumar', room: 'Room 201' },
        { period: 2, time: '08:45 - 09:30', subject: 'English', teacher: "Mr. David D'souza", room: 'Room 201' },
        { period: 3, time: '09:45 - 10:30', subject: 'Science (Physics)', teacher: 'Mrs. Sunita Rao', room: 'Room 201' },
        { period: 4, time: '10:30 - 11:15', subject: 'Hindi / Regional', teacher: 'Mrs. Kavita Singh', room: 'Room 201' },
        { period: 5, time: '11:45 - 12:30', subject: 'Social Studies', teacher: 'Mrs. Priya Nair', room: 'Room 201' },
        { period: 6, time: '12:30 - 01:15', subject: 'Computer Science', teacher: 'Mr. Anil Joshi', room: 'CS Lab 1' },
        { period: 7, time: '01:15 - 02:00', subject: 'Art & Craft', teacher: 'Mrs. Rekha Sen', room: 'Art Studio' }
      ]},
      { day: 'Thursday', periods: [
        { period: 1, time: '08:00 - 08:45', subject: 'Science (Chemistry)', teacher: 'Mrs. Sunita Rao', room: 'Room 201' },
        { period: 2, time: '08:45 - 09:30', subject: 'Mathematics', teacher: 'Mr. Rajesh Kumar', room: 'Room 201' },
        { period: 3, time: '09:45 - 10:30', subject: 'Social Studies', teacher: 'Mrs. Priya Nair', room: 'Room 201' },
        { period: 4, time: '10:30 - 11:15', subject: 'English', teacher: "Mr. David D'souza", room: 'Room 201' },
        { period: 5, time: '11:45 - 12:30', subject: 'Mathematics', teacher: 'Mr. Rajesh Kumar', room: 'Room 201' },
        { period: 6, time: '12:30 - 01:15', subject: 'Science (Biology)', teacher: 'Mrs. Sunita Rao', room: 'Room 201' },
        { period: 7, time: '01:15 - 02:00', subject: 'Physical Education', teacher: 'Mr. Manish Dave', room: 'Ground' }
      ]},
      { day: 'Friday', periods: [
        { period: 1, time: '08:00 - 08:45', subject: 'English', teacher: "Mr. David D'souza", room: 'Room 201' },
        { period: 2, time: '08:45 - 09:30', subject: 'Mathematics', teacher: 'Mr. Rajesh Kumar', room: 'Room 201' },
        { period: 3, time: '09:45 - 10:30', subject: 'Science (Physics)', teacher: 'Mrs. Sunita Rao', room: 'Physics Lab' },
        { period: 4, time: '10:30 - 11:15', subject: 'Hindi / Regional', teacher: 'Mrs. Kavita Singh', room: 'Room 201' },
        { period: 5, time: '11:45 - 12:30', subject: 'Social Studies', teacher: 'Mrs. Priya Nair', room: 'Room 201' },
        { period: 6, time: '12:30 - 01:15', subject: 'Computer Science', teacher: 'Mr. Anil Joshi', room: 'CS Lab 1' },
        { period: 7, time: '01:15 - 02:00', subject: 'Club Activities', teacher: 'All Teachers', room: 'Auditorium' }
      ]}
    ]
  },

  // Curriculum & Syllabus tracking (FRD §8.6)
  curriculum: [
    { id: 'curr-1', class: '10', subject: 'Mathematics', chapter: 'Real Numbers', status: 'Completed', completionPercent: 100 },
    { id: 'curr-2', class: '10', subject: 'Mathematics', chapter: 'Polynomials', status: 'Completed', completionPercent: 100 },
    { id: 'curr-3', class: '10', subject: 'Mathematics', chapter: 'Pair of Linear Equations', status: 'In Progress', completionPercent: 75 },
    { id: 'curr-4', class: '10', subject: 'Mathematics', chapter: 'Quadratic Equations', status: 'In Progress', completionPercent: 30 },
    { id: 'curr-5', class: '10', subject: 'Mathematics', chapter: 'Arithmetic Progressions', status: 'Pending', completionPercent: 0 }
  ],

  // 6. ATTENDANCE & LEAVES (FRD §9, §16.2)
  attendance: {
    students: {
      '2026-08-14': {
        'STU108902': 'Present',
        'STU108903': 'Present',
        'STU-002': 'Present',
        's013': 'Late',
        'STU-004': 'Present',
        'STU-005': 'Absent',
        'STU-006': 'Present',
        'STU-007': 'Present',
        'STU-008': 'Present'
      }
    },
    staff: {
      '2026-08-14': {
        'EMP101': 'Present',
        'EMP102': 'Present',
        'EMP103': 'Present',
        'EMP104': 'Leave',
        'EMP201': 'Present',
        'EMP301': 'Present',
        'EMP401': 'Present',
        'EMP501': 'Present'
      }
    }
  },

  leaves: [
    {
      id: 'LVE-STU-101',
      applicantType: 'Student',
      applicantId: 'STU108902',
      applicantName: 'Aarav Sharma',
      class: '10-A',
      leaveType: 'Medical',
      startDate: '2026-08-18',
      endDate: '2026-08-19',
      days: 2,
      reason: 'Dental appointment and recovery',
      status: 'Approved',
      approverRole: 'Teacher',
      approverName: 'Mr. Rajesh Kumar',
      appliedAt: '2026-08-10',
      comments: 'Approved. Get notes from classmate.'
    },
    {
      id: 'LVE-STF-201',
      applicantType: 'Staff',
      applicantId: 'EMP101',
      applicantName: 'Mr. Rajesh Kumar',
      department: 'Mathematics',
      leaveType: 'Casual Leave',
      startDate: '2026-08-22',
      endDate: '2026-08-23',
      days: 2,
      reason: 'Attending National Mathematics Teachers Conference',
      status: 'Approved',
      approverRole: 'Principal',
      approverName: 'Dr. S. Chatterjee',
      appliedAt: '2026-08-12',
      comments: 'Approved with proxy arrangements.'
    },
    {
      id: 'LVE-STF-202',
      applicantType: 'Staff',
      applicantId: 'EMP103',
      applicantName: "Mr. David D'souza",
      department: 'English',
      leaveType: 'Sick Leave',
      startDate: '2026-08-15',
      endDate: '2026-08-16',
      days: 2,
      reason: 'Viral fever rest advised by doctor',
      status: 'Pending',
      approverRole: 'Principal',
      appliedAt: '2026-08-14'
    }
  ],

  // 7. EXAMINATIONS & RESULTS (FRD §10)
  exams: [
    {
      id: 'EXAM-2026-UT1',
      name: 'Unit Test 1',
      session: '2026-2027',
      startDate: '2026-07-20',
      endDate: '2026-07-28',
      status: 'Published',
      gradingType: 'Percentage / Marks',
      classes: ['9', '10', '11', '12'],
      schedule: [
        { date: '2026-07-20', time: '09:00 - 10:30 AM', subject: 'Mathematics', maxMarks: 50 },
        { date: '2026-07-22', time: '09:00 - 10:30 AM', subject: 'Science', maxMarks: 50 },
        { date: '2026-07-24', time: '09:00 - 10:30 AM', subject: 'English', maxMarks: 50 },
        { date: '2026-07-26', time: '09:00 - 10:30 AM', subject: 'Social Studies', maxMarks: 50 },
        { date: '2026-07-28', time: '09:00 - 10:30 AM', subject: 'Computer Science', maxMarks: 50 }
      ]
    },
    {
      id: 'EXAM-2026-MID',
      name: 'Mid-Term Examinations',
      session: '2026-2027',
      startDate: '2026-09-15',
      endDate: '2026-09-28',
      status: 'Upcoming',
      gradingType: 'Percentage / Marks',
      classes: ['All Classes'],
      schedule: []
    }
  ],

  results: {
    'EXAM-2026-UT1': {
      'STU108902': {
        studentId: 'STU108902',
        studentName: 'Aarav Sharma',
        class: '10',
        section: 'A',
        rollNo: '101',
        rank: 3,
        totalMarks: 250,
        obtainedMarks: 232,
        percentage: 92.8,
        gpa: 9.3,
        status: 'Passed (Distinction)',
        subjects: [
          { subject: 'Mathematics', maxMarks: 50, marksObtained: 48, grade: 'A1', remarks: 'Exceptional problem solving' },
          { subject: 'Science', maxMarks: 50, marksObtained: 46, grade: 'A1', remarks: 'Strong concepts' },
          { subject: 'English', maxMarks: 50, marksObtained: 44, grade: 'A2', remarks: 'Good essays' },
          { subject: 'Social Studies', maxMarks: 50, marksObtained: 45, grade: 'A1', remarks: 'Well articulated answers' },
          { subject: 'Computer Science', maxMarks: 50, marksObtained: 49, grade: 'A1', remarks: 'Excellent coding logic' }
        ]
      },
      'STU108903': {
        studentId: 'STU108903',
        studentName: 'Aanya Sharma',
        class: '8',
        section: 'A',
        rollNo: '801',
        rank: 2,
        totalMarks: 250,
        obtainedMarks: 238,
        percentage: 95.2,
        gpa: 9.5,
        status: 'Passed (Distinction)',
        subjects: [
          { subject: 'Mathematics', maxMarks: 50, marksObtained: 49, grade: 'A1', remarks: 'Outstanding' },
          { subject: 'Science', maxMarks: 50, marksObtained: 48, grade: 'A1', remarks: 'Great practical insights' },
          { subject: 'English', maxMarks: 50, marksObtained: 47, grade: 'A1', remarks: 'Very fluent expression' },
          { subject: 'Social Studies', maxMarks: 50, marksObtained: 46, grade: 'A1', remarks: 'Good grasp of history' },
          { subject: 'Computer Science', maxMarks: 50, marksObtained: 48, grade: 'A1', remarks: 'Creative project work' }
        ]
      }
    }
  },

  // 8. FEES, TRANSACTIONS & RECEIPTS (FRD §11)
  feeStructures: [
    {
      class: '10',
      totalYearly: 48000,
      heads: [
        { name: 'Tuition Fee', amount: 32000 },
        { name: 'Transport Fee', amount: 8000 },
        { name: 'Laboratory Fee', amount: 4000 },
        { name: 'Library & Activities', amount: 4000 }
      ],
      installments: [
        { name: 'Installment 1 (Q1)', amount: 12000, dueDate: '2026-04-15' },
        { name: 'Installment 2 (Q2)', amount: 12000, dueDate: '2026-07-15' },
        { name: 'Installment 3 (Q3)', amount: 12000, dueDate: '2026-10-15' },
        { name: 'Installment 4 (Q4)', amount: 12000, dueDate: '2027-01-15' }
      ]
    }
  ],

  receipts: [
    {
      id: 'RCT-2026-0001',
      receiptNo: 'RCT-2026-0001',
      studentId: 'STU108902',
      studentName: 'Aarav Sharma',
      class: '10',
      section: 'A',
      admissionNo: 'ADM-2024-8902',
      schoolId: 'SCH-2026-09',
      academicSession: '2026-2027',
      paymentDate: '2026-04-10',
      time: '10:15 AM',
      totalAmount: 12000,
      paidAmount: 12000,
      discountAmount: 0,
      scholarshipAmount: 0,
      lateFine: 0,
      remainingBalance: 36000,
      paymentMethod: 'UPI',
      transactionRef: 'UPI20260410001',
      status: 'Paid',
      feeHeads: [{ name: 'Installment 1 (Q1)', amount: 12000, paid: 12000 }],
      createdBy: 'Virender Mehta (Accountant)'
    },
    {
      id: 'RCT-2026-0002',
      receiptNo: 'RCT-2026-0002',
      studentId: 'STU108902',
      studentName: 'Aarav Sharma',
      class: '10',
      section: 'A',
      admissionNo: 'ADM-2024-8902',
      schoolId: 'SCH-2026-09',
      academicSession: '2026-2027',
      paymentDate: '2026-07-12',
      time: '02:30 PM',
      totalAmount: 12000,
      paidAmount: 12000,
      discountAmount: 0,
      scholarshipAmount: 0,
      lateFine: 0,
      remainingBalance: 24000,
      paymentMethod: 'Online Gateway (Razorpay)',
      transactionRef: 'PAY_99182312',
      status: 'Paid',
      feeHeads: [{ name: 'Installment 2 (Q2)', amount: 12000, paid: 12000 }],
      createdBy: 'Parent Online Portal'
    },
    {
      id: 'RCT-2026-0003',
      receiptNo: 'RCT-2026-0003',
      studentId: 'STU108902',
      studentName: 'Aarav Sharma',
      class: '10',
      section: 'A',
      admissionNo: 'ADM-2024-8902',
      schoolId: 'SCH-2026-09',
      academicSession: '2026-2027',
      paymentDate: '2026-08-05',
      time: '11:00 AM',
      totalAmount: 12000,
      paidAmount: 12000,
      discountAmount: 0,
      scholarshipAmount: 0,
      lateFine: 0,
      remainingBalance: 12000,
      paymentMethod: 'UPI',
      transactionRef: 'UPI20260805991',
      status: 'Paid',
      feeHeads: [{ name: 'Installment 3 (Q3)', amount: 12000, paid: 12000 }],
      createdBy: 'Virender Mehta (Accountant)'
    }
  ],

  // 9. LIBRARY & CIRCULATION (FRD §12)
  books: [
    { id: 'BK-101', bookCode: 'BK-PHY-01', title: 'Concepts of Physics (Vol 1)', author: 'H.C. Verma', isbn: '978-8177091878', publisher: 'Bharati Bhawan', category: 'Science', totalCopies: 10, availableCopies: 8, location: 'Shelf B-3' },
    { id: 'BK-102', bookCode: 'BK-MTH-02', title: 'Secondary School Mathematics (Class 10)', author: 'R.S. Aggarwal', isbn: '978-9352530182', publisher: 'Bharati Bhawan', category: 'Mathematics', totalCopies: 15, availableCopies: 12, location: 'Shelf A-1' },
    { id: 'BK-103', bookCode: 'BK-ENG-03', title: 'First Flight - English Literature', author: 'NCERT Board', isbn: '978-8174506481', publisher: 'NCERT', category: 'English', totalCopies: 20, availableCopies: 18, location: 'Shelf C-2' },
    { id: 'BK-104', bookCode: 'BK-SCI-04', title: 'Principles of Computer Science', author: 'Sumita Arora', isbn: '978-9389278453', publisher: 'Dhanpat Rai', category: 'Computer Science', totalCopies: 8, availableCopies: 6, location: 'Shelf D-4' },
    { id: 'BK-105', bookCode: 'BK-HIS-05', title: 'India and the Contemporary World', author: 'NCERT Board', isbn: '978-8174507075', publisher: 'NCERT', category: 'Social Studies', totalCopies: 12, availableCopies: 11, location: 'Shelf E-1' }
  ],

  bookLoans: [
    {
      id: 'ISS-2026-081',
      bookId: 'BK-101',
      bookTitle: 'Concepts of Physics (Vol 1)',
      bookCode: 'BK-PHY-01',
      memberId: 'STU108902',
      memberName: 'Aarav Sharma',
      memberType: 'Student',
      memberClass: '10-A',
      issueDate: '2026-08-01',
      dueDate: '2026-08-20',
      returnDate: null,
      status: 'Issued',
      fineAmount: 0
    },
    {
      id: 'ISS-2026-082',
      bookId: 'BK-102',
      bookTitle: 'Secondary School Mathematics (Class 10)',
      bookCode: 'BK-MTH-02',
      memberId: 'EMP101',
      memberName: 'Mr. Rajesh Kumar',
      memberType: 'Staff',
      memberClass: 'Faculty',
      issueDate: '2026-08-05',
      dueDate: '2026-08-25',
      returnDate: null,
      status: 'Issued',
      fineAmount: 0
    }
  ],

  // 10. TRANSPORT FLEET & ROUTES (FRD §13)
  transport: {
    vehicles: [
      { id: 'VEH-01', vehicleNo: 'DL-01-AB-1234', model: 'Tata Starbus 40-Seater', capacity: 40, fuelType: 'CNG', status: 'Active', driverName: 'Rameshwar Yadav', driverPhone: '+91 98111 00112', insuranceExpiry: '2027-05-30', pucExpiry: '2026-11-20' },
      { id: 'VEH-02', vehicleNo: 'DL-01-CD-5678', model: 'Ashok Leyland 32-Seater', capacity: 32, fuelType: 'Diesel', status: 'Active', driverName: 'Jaspreet Singh', driverPhone: '+91 98222 00334', insuranceExpiry: '2027-03-15', pucExpiry: '2026-12-10' }
    ],
    routes: [
      {
        id: 'RT-001',
        routeName: 'Route 1 - Janakpuri & Vikaspuri',
        vehicleId: 'VEH-01',
        vehicleNo: 'DL-01-AB-1234',
        driverName: 'Rameshwar Yadav',
        driverPhone: '+91 98111 00112',
        morningDeparture: '06:45 AM',
        afternoonDrop: '02:45 PM',
        stops: [
          { name: 'Vikaspuri C Block', morningTime: '06:50 AM', eveningTime: '02:50 PM' },
          { name: 'Janakpuri District Centre', morningTime: '07:05 AM', eveningTime: '03:05 PM' },
          { name: 'Uttam Nagar East Metro', morningTime: '07:20 AM', eveningTime: '03:20 PM' },
          { name: 'Greenfield Public School Campus', morningTime: '07:45 AM', eveningTime: '02:30 PM' }
        ]
      },
      {
        id: 'RT-002',
        routeName: 'Route 2 - Dwarka Sectors 6 to 22',
        vehicleId: 'VEH-02',
        vehicleNo: 'DL-01-CD-5678',
        driverName: 'Jaspreet Singh',
        driverPhone: '+91 98222 00334',
        morningDeparture: '07:00 AM',
        afternoonDrop: '02:45 PM',
        stops: [
          { name: 'Sector 6 Market', morningTime: '07:05 AM', eveningTime: '02:55 PM' },
          { name: 'Dwarka Mor Metro Station', morningTime: '07:15 AM', eveningTime: '03:05 PM' },
          { name: 'Sector 10 Main Road', morningTime: '07:25 AM', eveningTime: '03:15 PM' },
          { name: 'Greenfield Public School Campus', morningTime: '07:45 AM', eveningTime: '02:30 PM' }
        ]
      }
    ]
  },

  // 11. HOSTEL (FRD §14)
  hostel: {
    buildings: [
      { id: 'BLD-A', name: 'Vivekananda Boys Hostel', gender: 'Boys', totalRooms: 40, totalBeds: 120, warden: 'Mr. Arvind Saxena', wardenPhone: '+91 98333 44556' },
      { id: 'BLD-B', name: 'Sarojini Naidu Girls Hostel', gender: 'Girls', totalRooms: 35, totalBeds: 105, warden: 'Mrs. Shobha Sharma', wardenPhone: '+91 98444 55667' }
    ],
    rooms: [
      { id: 'HR-101', buildingId: 'BLD-A', buildingName: 'Vivekananda Boys Hostel', roomNumber: '101', type: 'Triple Bed AC', capacity: 3, occupied: 2, feePerTerm: 25000 },
      { id: 'HR-204', buildingId: 'BLD-A', buildingName: 'Vivekananda Boys Hostel', roomNumber: '204', type: 'Double Bed Non-AC', capacity: 2, occupied: 1, feePerTerm: 18000 }
    ]
  },

  // 12. HOMEWORK & ASSIGNMENTS (FRD §17)
  homework: [
    {
      id: 'HW-2026-091',
      title: 'Polynomials Problem Set 2.3 & 2.4',
      subject: 'Mathematics',
      class: '10',
      section: 'A',
      assignedDate: '2026-08-12',
      dueDate: '2026-08-17',
      assignedBy: 'Mr. Rajesh Kumar',
      description: 'Solve all exercise problems on zeros of polynomials and factorization theorem.',
      totalPoints: 20,
      attachments: [{ name: 'Polynomials_Worksheet_Set2.pdf', size: '1.2 MB' }],
      submissions: {
        'STU108902': {
          submittedAt: '2026-08-14',
          fileName: 'Aarav_Sharma_Math_HW.pdf',
          status: 'Submitted',
          marks: 19,
          feedback: 'Very thorough solutions. Great work!'
        }
      }
    },
    {
      id: 'HW-2026-092',
      title: 'Light Reflection & Refraction Ray Diagrams',
      subject: 'Science',
      class: '10',
      section: 'A',
      assignedDate: '2026-08-13',
      dueDate: '2026-08-18',
      assignedBy: 'Mrs. Sunita Rao',
      description: 'Draw neat ray diagrams for convex and concave lenses in laboratory notebook.',
      totalPoints: 15,
      attachments: [{ name: 'Optics_Reference_Guide.pdf', size: '2.4 MB' }],
      submissions: {}
    }
  ],

  // 13. COMMUNICATION & ANNOUNCEMENTS (FRD §18)
  announcements: [
    {
      id: 'ANN-2026-041',
      title: 'Independence Day Celebrations & Flag Hoisting Ceremony',
      targetAudience: 'All',
      category: 'Events',
      publishDate: '2026-08-12',
      publisherName: 'Dr. S. Chatterjee (Principal)',
      content: 'All students, teachers, and parents are cordially invited to attend the 79th Independence Day Flag Hoisting ceremony on 15th August at 08:30 AM in the school main ground.',
      isUrgent: false
    },
    {
      id: 'ANN-2026-042',
      title: 'Parent-Teacher Meeting (PTM) Schedule for Term 1',
      targetAudience: 'Parents',
      category: 'Academic',
      publishDate: '2026-08-10',
      publisherName: 'Vikramaditya Rao (School Admin)',
      content: 'PTM for Classes 6 to 12 will be conducted on Saturday, 23rd August from 09:00 AM to 01:00 PM. Parents can discuss Unit Test 1 performance with subject teachers.',
      isUrgent: true
    },
    {
      id: 'ANN-2026-043',
      title: 'Faculty Workshop on Innovative Teaching Pedagogies',
      targetAudience: 'Teachers',
      category: 'Staff Notice',
      publishDate: '2026-08-08',
      publisherName: 'Meenakshi Iyer (HR Dept)',
      content: 'All teaching faculty are requested to assemble in AV Room 1 on Friday at 03:00 PM for the digital pedagogy workshop.',
      isUrgent: false
    }
  ],

  // 14. CAMPUS EVENTS & CALENDAR (FRD §19)
  events: [
    {
      id: 'EVT-2026-101',
      title: '79th Independence Day Cultural Program',
      category: 'National Event',
      date: '2026-08-15',
      time: '08:30 AM - 11:30 AM',
      location: 'School Main Ground',
      organizer: 'Cultural Committee',
      description: 'Patriotic song performances, march past by NCC cadets, and distribution of sweets.',
      rsvps: ['STU108902', 'EMP101', 'EMP102']
    },
    {
      id: 'EVT-2026-102',
      title: 'Inter-School Science & Robotics Fair 2026',
      category: 'Academic Competition',
      date: '2026-08-29',
      time: '09:00 AM - 04:00 PM',
      location: 'Multi-Purpose Auditorium',
      organizer: 'Science Department',
      description: 'Students from 25 schools presenting working IoT and AI models.',
      rsvps: ['STU108902']
    }
  ],

  // 15. INVENTORY & ASSETS (FRD §20)
  inventory: [
    { id: 'AST-001', itemName: 'Dell OptiPlex 7090 Desktop PCs', category: 'IT Equipment', quantity: 45, unit: 'Units', location: 'CS Lab 1 & 2', purchaseDate: '2025-06-15', supplier: 'Dell India Pvt Ltd', status: 'In Service', condition: 'Good' },
    { id: 'AST-002', itemName: 'Olympus Binocular Biological Microscopes', category: 'Lab Equipment', quantity: 30, unit: 'Pieces', location: 'Biology Laboratory', purchaseDate: '2025-07-20', supplier: 'Scientific Supplies Corp', status: 'In Service', condition: 'Good' },
    { id: 'AST-003', itemName: 'Ergonomic Dual Student Benches', category: 'Furniture', quantity: 200, unit: 'Sets', location: 'Classrooms 9 & 10', purchaseDate: '2024-11-10', supplier: 'Godrej Interio', status: 'In Service', condition: 'Good' }
  ],

  // 16. SYSTEM AUDIT LOG (FRD §24.5, §27)
  auditLogs: [
    { id: 'AUD-991', action: 'USER_LOGIN', user: 'admin', role: 'School Admin', details: 'School Admin session initiated', timestamp: '2026-08-14T08:00:15.000Z', ip: '192.168.1.10' },
    { id: 'AUD-992', action: 'MARKS_PUBLISHED', user: 'admin', role: 'School Admin', details: 'Unit Test 1 marks approved and published for Class 10', timestamp: '2026-08-14T09:30:00.000Z', ip: '192.168.1.10' },
    { id: 'AUD-993', action: 'FEE_COLLECTED', user: 'accountant', role: 'Accountant', details: 'Receipt RCT-2026-0003 collected for Aarav Sharma (INR 12,000)', timestamp: '2026-08-14T11:00:22.000Z', ip: '192.168.1.12' }
  ]
};
