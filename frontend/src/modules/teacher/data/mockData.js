// ============================================================
// TEACHER PORTAL — COMPREHENSIVE MOCK DATA
// ============================================================

export const mockTeacher = {
  id: 'TCH-2024-001',
  name: 'Mr. Rajesh Kumar',
  employeeId: 'EMP-2019-045',
  photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  department: 'Mathematics',
  designation: 'Senior Teacher',
  classTeacher: 'Class 10 - Section A',
  subjects: ['Mathematics', 'Statistics'],
  classes: ['Class 9A', 'Class 9B', 'Class 10A', 'Class 10B'],
  email: 'rajesh.kumar@school.edu',
  phone: '+91 98765 12345',
  dob: '1985-03-15',
  gender: 'Male',
  bloodGroup: 'B+',
  address: 'Flat 204, Sunrise Apartments, Sector 22, Noida, UP - 201301',
  joiningDate: '2019-07-01',
  experience: '7 Years',
  qualification: 'M.Sc. Mathematics, B.Ed.',
  emergencyContact: { name: 'Priya Kumar', relation: 'Spouse', phone: '+91 99887 76655' },
};

// ── Classes & Students ──────────────────────────────────────
export const mockClasses = [
  { id: 'cls-9a', name: 'Class 9', section: 'A', strength: 42, subjects: ['Mathematics', 'Science', 'English', 'Hindi', 'Social Studies'] },
  { id: 'cls-9b', name: 'Class 9', section: 'B', strength: 38, subjects: ['Mathematics', 'Science', 'English', 'Hindi', 'Social Studies'] },
  { id: 'cls-10a', name: 'Class 10', section: 'A', strength: 45, subjects: ['Mathematics', 'Statistics', 'Physics', 'Chemistry', 'English'] },
  { id: 'cls-10b', name: 'Class 10', section: 'B', strength: 40, subjects: ['Mathematics', 'Statistics', 'Physics', 'Chemistry', 'English'] },
];

export const mockStudents = {
  'cls-9a': [
    { id: 's001', rollNo: '01', name: 'Aakash Sharma', photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80', gender: 'Male', dob: '2010-05-14', phone: '+91 98765 43210', parent: 'Rajesh Sharma', parentPhone: '+91 98765 01234', attendance: 92, avgMarks: 87 },
    { id: 's002', rollNo: '02', name: 'Priya Verma', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80', gender: 'Female', dob: '2010-08-22', phone: '+91 99001 55678', parent: 'Suresh Verma', parentPhone: '+91 99001 11223', attendance: 88, avgMarks: 91 },
    { id: 's003', rollNo: '03', name: 'Arjun Singh', photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80', gender: 'Male', dob: '2010-11-05', phone: '+91 97654 32100', parent: 'Vikram Singh', parentPhone: '+91 97654 32101', attendance: 75, avgMarks: 68 },
    { id: 's004', rollNo: '04', name: 'Anika Patel', photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80', gender: 'Female', dob: '2010-02-18', phone: '+91 96543 21099', parent: 'Mahesh Patel', parentPhone: '+91 96543 21000', attendance: 96, avgMarks: 95 },
    { id: 's005', rollNo: '05', name: 'Rohan Gupta', photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=100&q=80', gender: 'Male', dob: '2010-07-30', phone: '+91 95432 10988', parent: 'Rakesh Gupta', parentPhone: '+91 95432 10987', attendance: 83, avgMarks: 74 },
    { id: 's006', rollNo: '06', name: 'Ishita Nair', photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80', gender: 'Female', dob: '2010-09-12', phone: '+91 94321 09876', parent: 'Sunil Nair', parentPhone: '+91 94321 09877', attendance: 90, avgMarks: 88 },
    { id: 's007', rollNo: '07', name: 'Dev Malhotra', photo: 'https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=100&q=80', gender: 'Male', dob: '2010-03-25', phone: '+91 93210 98765', parent: 'Anil Malhotra', parentPhone: '+91 93210 98766', attendance: 65, avgMarks: 55 },
    { id: 's008', rollNo: '08', name: 'Sanya Mehta', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80', gender: 'Female', dob: '2010-06-08', phone: '+91 92109 87654', parent: 'Deepak Mehta', parentPhone: '+91 92109 87655', attendance: 94, avgMarks: 93 },
    { id: 's009', rollNo: '09', name: 'Kabir Joshi', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80', gender: 'Male', dob: '2010-12-20', phone: '+91 91098 76543', parent: 'Ravi Joshi', parentPhone: '+91 91098 76544', attendance: 79, avgMarks: 72 },
    { id: 's010', rollNo: '10', name: 'Neha Reddy', photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=100&q=80', gender: 'Female', dob: '2010-04-15', phone: '+91 90987 65432', parent: 'Srikanth Reddy', parentPhone: '+91 90987 65433', attendance: 97, avgMarks: 98 },
    { id: 's011', rollNo: '11', name: 'Vivaan Kapoor', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80', gender: 'Male', dob: '2010-01-10', phone: '+91 89876 54321', parent: 'Karan Kapoor', parentPhone: '+91 89876 54322', attendance: 85, avgMarks: 80 },
    { id: 's012', rollNo: '12', name: 'Zara Khan', photo: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?auto=format&fit=crop&w=100&q=80', gender: 'Female', dob: '2010-10-05', phone: '+91 88765 43210', parent: 'Imran Khan', parentPhone: '+91 88765 43211', attendance: 91, avgMarks: 85 },
  ],
  'cls-10a': [
    { id: 's101', rollNo: '01', name: 'Tanvi Desai', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80', gender: 'Female', dob: '2009-05-20', phone: '+91 87654 32109', parent: 'Suresh Desai', parentPhone: '+91 87654 32100', attendance: 95, avgMarks: 92 },
    { id: 's102', rollNo: '02', name: 'Arnav Mishra', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80', gender: 'Male', dob: '2009-08-14', phone: '+91 86543 21098', parent: 'Dilip Mishra', parentPhone: '+91 86543 21099', attendance: 82, avgMarks: 78 },
    { id: 's103', rollNo: '03', name: 'Kavya Iyer', photo: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=100&q=80', gender: 'Female', dob: '2009-11-30', phone: '+91 85432 10987', parent: 'Rajan Iyer', parentPhone: '+91 85432 10988', attendance: 98, avgMarks: 97 },
    { id: 's104', rollNo: '04', name: 'Dhruv Tiwari', photo: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=100&q=80', gender: 'Male', dob: '2009-03-05', phone: '+91 84321 09876', parent: 'Ashok Tiwari', parentPhone: '+91 84321 09877', attendance: 70, avgMarks: 62 },
    { id: 's105', rollNo: '05', name: 'Riya Saxena', photo: 'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?auto=format&fit=crop&w=100&q=80', gender: 'Female', dob: '2009-07-18', phone: '+91 83210 98765', parent: 'Mohan Saxena', parentPhone: '+91 83210 98766', attendance: 88, avgMarks: 84 },
    { id: 's106', rollNo: '06', name: 'Shaurya Bajaj', photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=100&q=80', gender: 'Male', dob: '2009-09-22', phone: '+91 82109 87654', parent: 'Rahul Bajaj', parentPhone: '+91 82109 87655', attendance: 93, avgMarks: 90 },
    { id: 's107', rollNo: '07', name: 'Meera Pillai', photo: 'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?auto=format&fit=crop&w=100&q=80', gender: 'Female', dob: '2009-02-10', phone: '+91 81098 76543', parent: 'Suresh Pillai', parentPhone: '+91 81098 76544', attendance: 87, avgMarks: 83 },
    { id: 's108', rollNo: '08', name: 'Aditya Bose', photo: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&q=80', gender: 'Male', dob: '2009-12-28', phone: '+91 80987 65432', parent: 'Sourav Bose', parentPhone: '+91 80987 65433', attendance: 60, avgMarks: 52 },
    { id: 'STU108902', rollNo: '12', name: 'Aarav Sharma', photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80', gender: 'Male', dob: '2010-05-14', phone: '+91 98765 43210', parent: 'Rajesh Sharma', parentPhone: '+91 98765 01234', attendance: 92, avgMarks: 87 },
  ],
};

// ── Timetable ────────────────────────────────────────────────
export const mockTimetable = {
  monday: [
    { period: 1, time: '08:00 - 08:45', subject: 'Mathematics', class: 'Class 9A', room: '101', type: 'theory' },
    { period: 2, time: '08:45 - 09:30', subject: 'Mathematics', class: 'Class 10A', room: '102', type: 'theory' },
    { period: 3, time: '09:30 - 10:15', subject: 'Statistics', class: 'Class 10B', room: '103', type: 'theory' },
    { period: 4, time: '10:30 - 11:15', subject: 'Mathematics', class: 'Class 9B', room: '101', type: 'theory' },
    { period: 5, time: '11:15 - 12:00', subject: 'Statistics', class: 'Class 10A', room: '104', type: 'theory' },
  ],
  tuesday: [
    { period: 1, time: '08:00 - 08:45', subject: 'Mathematics', class: 'Class 9B', room: '101', type: 'theory' },
    { period: 2, time: '08:45 - 09:30', subject: 'Statistics', class: 'Class 10A', room: '104', type: 'theory' },
    { period: 3, time: '09:30 - 10:15', subject: 'Mathematics', class: 'Class 10B', room: '102', type: 'theory' },
    { period: 5, time: '11:15 - 12:00', subject: 'Mathematics', class: 'Class 9A', room: '101', type: 'theory' },
  ],
  wednesday: [
    { period: 1, time: '08:00 - 08:45', subject: 'Mathematics', class: 'Class 10A', room: '102', type: 'theory' },
    { period: 2, time: '08:45 - 09:30', subject: 'Mathematics', class: 'Class 9A', room: '101', type: 'theory' },
    { period: 4, time: '10:30 - 11:15', subject: 'Statistics', class: 'Class 10B', room: '103', type: 'theory' },
    { period: 5, time: '11:15 - 12:00', subject: 'Mathematics', class: 'Class 9B', room: '101', type: 'theory' },
    { period: 6, time: '12:00 - 12:45', subject: 'Statistics', class: 'Class 10A', room: '104', type: 'theory' },
  ],
  thursday: [
    { period: 2, time: '08:45 - 09:30', subject: 'Mathematics', class: 'Class 9A', room: '101', type: 'theory' },
    { period: 3, time: '09:30 - 10:15', subject: 'Mathematics', class: 'Class 10A', room: '102', type: 'theory' },
    { period: 4, time: '10:30 - 11:15', subject: 'Mathematics', class: 'Class 9B', room: '101', type: 'theory' },
    { period: 6, time: '12:00 - 12:45', subject: 'Statistics', class: 'Class 10B', room: '103', type: 'theory' },
  ],
  friday: [
    { period: 1, time: '08:00 - 08:45', subject: 'Statistics', class: 'Class 10A', room: '104', type: 'theory' },
    { period: 2, time: '08:45 - 09:30', subject: 'Mathematics', class: 'Class 9B', room: '101', type: 'theory' },
    { period: 3, time: '09:30 - 10:15', subject: 'Mathematics', class: 'Class 10B', room: '102', type: 'theory' },
    { period: 5, time: '11:15 - 12:00', subject: 'Mathematics', class: 'Class 9A', room: '101', type: 'theory' },
    { period: 6, time: '12:00 - 12:45', subject: 'Statistics', class: 'Class 10B', room: '103', type: 'theory' },
  ],
  saturday: [
    { period: 1, time: '08:00 - 08:45', subject: 'Mathematics', class: 'Class 9A', room: '101', type: 'theory' },
    { period: 2, time: '08:45 - 09:30', subject: 'Mathematics', class: 'Class 10A', room: '102', type: 'theory' },
    { period: 3, time: '09:30 - 10:15', subject: 'Statistics', class: 'Class 10A', room: '104', type: 'theory' },
  ],
};

// ── Homework ─────────────────────────────────────────────────
export const mockHomework = [
  {
    id: 'hw001',
    class: 'Class 9A',
    section: 'A',
    subject: 'Mathematics',
    title: 'Chapter 5: Quadratic Equations — Exercise 5.3',
    instructions: 'Solve all questions from Exercise 5.3. Show all working steps. Submit neat handwritten solutions.',
    dueDate: '2025-07-20',
    createdAt: '2025-07-15',
    status: 'Active',
    totalStudents: 42,
    submitted: 28,
    evaluated: 15,
    attachments: ['exercise_5_3.pdf'],
  },
  {
    id: 'hw002',
    class: 'Class 10A',
    section: 'A',
    subject: 'Statistics',
    title: 'Data Collection & Frequency Distribution',
    instructions: 'Collect data on heights of 30 students and create a frequency distribution table with class intervals of 5 cm. Draw a histogram.',
    dueDate: '2025-07-22',
    createdAt: '2025-07-14',
    status: 'Active',
    totalStudents: 45,
    submitted: 36,
    evaluated: 20,
    attachments: [],
  },
  {
    id: 'hw003',
    class: 'Class 9B',
    section: 'B',
    subject: 'Mathematics',
    title: 'Polynomials — Review Questions',
    instructions: 'Complete questions 1-15 from the review sheet provided. Focus on factorization methods.',
    dueDate: '2025-07-18',
    createdAt: '2025-07-12',
    status: 'Overdue',
    totalStudents: 38,
    submitted: 38,
    evaluated: 30,
    attachments: ['polynomials_review.pdf'],
  },
  {
    id: 'hw004',
    class: 'Class 10B',
    section: 'B',
    subject: 'Mathematics',
    title: 'Trigonometry: Identities and Applications',
    instructions: 'Prove the 10 identities listed and solve 5 application problems.',
    dueDate: '2025-07-25',
    createdAt: '2025-07-16',
    status: 'Draft',
    totalStudents: 40,
    submitted: 0,
    evaluated: 0,
    attachments: [],
  },
];

export const mockSubmissions = [
  { id: 'sub001', hwId: 'hw001', student: { id: 's001', name: 'Aarav Sharma', rollNo: '01', photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80' }, submittedAt: '2025-07-17T10:30:00Z', files: ['aarav_hw.pdf'], marks: null, feedback: '', status: 'Pending' },
  { id: 'sub002', hwId: 'hw001', student: { id: 's002', name: 'Priya Verma', rollNo: '02', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80' }, submittedAt: '2025-07-17T09:15:00Z', files: ['priya_hw.pdf'], marks: 18, feedback: 'Excellent work!', status: 'Evaluated' },
  { id: 'sub003', hwId: 'hw001', student: { id: 's004', name: 'Anika Patel', rollNo: '04', photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80' }, submittedAt: '2025-07-16T15:00:00Z', files: ['anika_hw.pdf'], marks: 20, feedback: 'Perfect!', status: 'Evaluated' },
  { id: 'sub004', hwId: 'hw001', student: { id: 's008', name: 'Sanya Mehta', rollNo: '08', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80' }, submittedAt: '2025-07-18T08:00:00Z', files: ['sanya_hw.pdf'], marks: null, feedback: '', status: 'Pending' },
];

// ── Examination ──────────────────────────────────────────────
export const mockExams = [
  { id: 'ex001', name: 'Unit Test 1', subject: 'Mathematics', class: 'Class 9A', date: '2025-07-28', time: '10:00 AM', duration: '1.5 hrs', maxMarks: 25, type: 'Unit Test', venue: 'Room 101' },
  { id: 'ex002', name: 'Unit Test 1', subject: 'Statistics', class: 'Class 10A', date: '2025-07-29', time: '10:00 AM', duration: '1.5 hrs', maxMarks: 25, type: 'Unit Test', venue: 'Room 102' },
  { id: 'ex003', name: 'Mid Term Exam', subject: 'Mathematics', class: 'Class 10A', date: '2025-08-15', time: '09:00 AM', duration: '3 hrs', maxMarks: 80, type: 'Mid Term', venue: 'Exam Hall 1' },
  { id: 'ex004', name: 'Mid Term Exam', subject: 'Mathematics', class: 'Class 9B', date: '2025-08-16', time: '09:00 AM', duration: '3 hrs', maxMarks: 80, type: 'Mid Term', venue: 'Exam Hall 2' },
];

export const mockMarks = [
  { examId: 'ex001', studentId: 's001', studentName: 'Aarav Sharma', rollNo: '01', marks: 22, maxMarks: 25, grade: 'A+', remarks: 'Very good' },
  { examId: 'ex001', studentId: 's002', studentName: 'Priya Verma', rollNo: '02', marks: 24, maxMarks: 25, grade: 'A+', remarks: 'Excellent' },
  { examId: 'ex001', studentId: 's003', studentName: 'Arjun Singh', rollNo: '03', marks: 15, maxMarks: 25, grade: 'B', remarks: 'Needs improvement in algebra' },
  { examId: 'ex001', studentId: 's004', studentName: 'Anika Patel', rollNo: '04', marks: 25, maxMarks: 25, grade: 'A+', remarks: 'Perfect score!' },
];

// ── Announcements ─────────────────────────────────────────────
export const mockAnnouncements = [
  { id: 'ann001', title: 'Unit Test 1 Schedule Released', body: 'Unit Test 1 for all classes has been scheduled from 28th July 2025. Please ensure syllabus coverage is complete by 25th July.', type: 'Exam', date: '2025-07-14', isUrgent: false },
  { id: 'ann002', title: 'Independence Day Celebration', body: 'School will celebrate Independence Day on 15th August with various cultural events. All teachers to report by 7:30 AM.', type: 'Event', date: '2025-07-13', isUrgent: false },
  { id: 'ann003', title: 'Staff Meeting — Academic Planning', body: 'A mandatory staff meeting is scheduled for 20th July at 3:30 PM in the Conference Room. All teachers must attend.', type: 'School', date: '2025-07-12', isUrgent: true },
  { id: 'ann004', title: 'Summer Holiday Notice', body: 'School will remain closed from 20th May to 15th June for summer holidays. Revised academic calendar is attached.', type: 'Holiday', date: '2025-07-10', isUrgent: false },
  { id: 'ann005', title: 'Department-wise Syllabus Submission', body: 'Mathematics department teachers must submit the updated syllabus completion report to the HOD by 25th July.', type: 'Department', date: '2025-07-09', isUrgent: false },
  { id: 'ann006', title: 'Emergency: Water Supply Disruption', body: 'Due to maintenance work, water supply will be disrupted on 18th July from 8 AM to 2 PM. Students may bring extra water bottles.', type: 'Emergency', date: '2025-07-08', isUrgent: true },
];

// ── Events ────────────────────────────────────────────────────
export const mockEvents = [
  { id: 'ev001', title: 'Independence Day Celebration', date: '2025-08-15', time: '08:00 AM', venue: 'School Ground', type: 'National', description: 'Annual Independence Day celebration with flag hoisting, cultural programs and march past.', duty: 'Invigilator — Class 9 Block' },
  { id: 'ev002', title: 'Annual Science Exhibition', date: '2025-08-22', time: '09:00 AM', venue: 'Main Hall', type: 'Academic', description: 'Students showcase science projects. Mr. Rajesh Kumar to judge Mathematics category projects.', duty: 'Judge — Mathematics Projects' },
  { id: 'ev003', title: 'Parent-Teacher Meeting', date: '2025-08-30', time: '10:00 AM', venue: 'Classrooms', type: 'Meeting', description: 'Quarterly parent-teacher meeting to discuss student progress and performance.', duty: 'Class Teacher — Class 10A' },
  { id: 'ev004', title: 'Inter-School Maths Olympiad', date: '2025-09-05', time: '09:00 AM', venue: 'Exam Hall', type: 'Competition', description: 'Students from Classes 9 and 10 will participate in the district-level Maths Olympiad.', duty: 'Invigilator & Coordinator' },
];

// ── Leave ─────────────────────────────────────────────────────
export const mockLeave = {
  balance: {
    casual: { used: 3, total: 12 },
    medical: { used: 0, total: 6 },
    emergency: { used: 1, total: 3 },
    earned: { used: 5, total: 30 },
  },
  history: [
    { id: 'lv001', type: 'Casual Leave', from: '2025-06-10', to: '2025-06-11', days: 2, reason: 'Family function', status: 'Approved', appliedOn: '2025-06-07' },
    { id: 'lv002', type: 'Emergency Leave', from: '2025-05-22', to: '2025-05-22', days: 1, reason: 'Medical emergency of parent', status: 'Approved', appliedOn: '2025-05-22' },
    { id: 'lv003', type: 'Casual Leave', from: '2025-04-15', to: '2025-04-15', days: 1, reason: 'Personal work', status: 'Rejected', appliedOn: '2025-04-12', remark: 'Exam preparation week — not approved.' },
    { id: 'lv004', type: 'Medical Leave', from: '2025-07-19', to: '2025-07-20', days: 2, reason: 'Fever and doctor visit', status: 'Pending', appliedOn: '2025-07-18' },
  ],
};

// ── Notifications ─────────────────────────────────────────────
export const mockNotifications = [
  { id: 'n001', type: 'homework', title: 'New Submission', message: 'Aarav Sharma submitted Quadratic Equations homework for Class 9A.', time: '10 mins ago', read: false },
  { id: 'n002', type: 'attendance', title: 'Attendance Reminder', message: 'You have not marked attendance for Class 10B — Mathematics (Period 3).', time: '35 mins ago', read: false },
  { id: 'n003', type: 'exam', title: 'Marks Entry Deadline', message: 'Please submit marks for Unit Test 1 (Class 9A) by 30th July.', time: '2 hrs ago', read: false },
  { id: 'n004', type: 'message', title: 'New Message from Parent', message: 'Rajesh Sharma (Aarav\'s father) sent a message about upcoming exams.', time: '3 hrs ago', read: true },
  { id: 'n005', type: 'announcement', title: 'Staff Meeting Reminder', message: 'Mandatory staff meeting tomorrow at 3:30 PM in Conference Room.', time: '5 hrs ago', read: true },
  { id: 'n006', type: 'homework', title: 'Evaluation Pending', message: '13 submissions for Polynomials homework (Class 9B) are awaiting evaluation.', time: '1 day ago', read: true },
  { id: 'n007', type: 'leave', title: 'Leave Status Updated', message: 'Your medical leave application (19-20 July) is pending approval.', time: '2 days ago', read: true },
];

// ── Messages ──────────────────────────────────────────────────
export const mockMessages = [
  {
    id: 'msg-parent-001',
    name: 'Rajesh Sharma',
    subtitle: 'Parent of Aarav Sharma (9A)',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80',
    type: 'parent',
    unread: 2,
    chats: [
      { sender: 'them', text: 'Good morning Sir, I wanted to discuss Aarav\'s performance in Mathematics.', time: '09:15 AM' },
      { sender: 'them', text: 'He seems to be struggling with Quadratic Equations. Could you please guide?', time: '09:16 AM' },
      { sender: 'me', text: 'Good morning Mr. Sharma! Yes, I noticed Aarav needs some extra practice. I will schedule additional help sessions.', time: '10:30 AM' },
      { sender: 'them', text: 'Thank you so much, Sir. We really appreciate it.', time: '10:45 AM' },
    ],
  },
  {
    id: 'msg-admin-001',
    name: 'School Administration',
    subtitle: 'Office Administration',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&q=80',
    type: 'admin',
    unread: 0,
    chats: [
      { sender: 'them', text: 'Please submit your syllabus completion report for Q1 by Friday.', time: 'Yesterday' },
      { sender: 'me', text: 'Noted. I will submit by Thursday evening.', time: 'Yesterday' },
    ],
  },
  {
    id: 'msg-principal-001',
    name: 'Dr. Meera Patel',
    subtitle: 'Principal',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
    type: 'principal',
    unread: 1,
    chats: [
      { sender: 'them', text: 'Mr. Kumar, please prepare a detailed report on Class 10A performance for the board meeting.', time: '2 days ago' },
    ],
  },
  {
    id: 'msg-student-001',
    name: 'Neha Reddy',
    subtitle: 'Student — Class 9A, Roll 10',
    photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=100&q=80',
    type: 'student',
    unread: 0,
    chats: [
      { sender: 'them', text: 'Sir, I have a doubt in the proof of Pythagoras theorem for the assignment.', time: '3 days ago' },
      { sender: 'me', text: 'Sure Neha! The proof uses similar triangles. Check page 147 of your textbook and let me know if you still have doubts.', time: '3 days ago' },
      { sender: 'them', text: 'Thank you Sir! It\'s clear now.', time: '3 days ago' },
    ],
  },
];

// ── Study Material ─────────────────────────────────────────────
export const mockStudyMaterial = [
  { id: 'sm001', subject: 'Mathematics', class: 'Class 9A', title: 'Chapter 5 — Quadratic Equations Notes', type: 'PDF', fileUrl: '#', uploadedAt: '2025-07-10', size: '2.4 MB' },
  { id: 'sm002', subject: 'Mathematics', class: 'Class 10A', title: 'Trigonometry Formula Sheet', type: 'PDF', fileUrl: '#', uploadedAt: '2025-07-08', size: '1.1 MB' },
  { id: 'sm003', subject: 'Statistics', class: 'Class 10A', title: 'Frequency Distribution — Video Lecture', type: 'Video', fileUrl: 'https://www.youtube.com/watch?v=example', uploadedAt: '2025-07-05', size: null },
  { id: 'sm004', subject: 'Mathematics', class: 'Class 9B', title: 'Polynomials — Practice Problems', type: 'PDF', fileUrl: '#', uploadedAt: '2025-07-03', size: '3.2 MB' },
  { id: 'sm005', subject: 'Statistics', class: 'Class 10B', title: 'Data Interpretation Reference', type: 'Link', fileUrl: 'https://www.khanacademy.org', uploadedAt: '2025-06-28', size: null },
];

// ── Syllabus ──────────────────────────────────────────────────
export const mockSyllabus = {
  'Mathematics-9A': [
    { id: 'ch1', chapter: 'Chapter 1: Number Systems', topics: ['Irrational Numbers', 'Real Numbers', 'Laws of Exponents'], completed: true, completionDate: '2025-06-15' },
    { id: 'ch2', chapter: 'Chapter 2: Polynomials', topics: ['Types of Polynomials', 'Remainder Theorem', 'Factor Theorem'], completed: true, completionDate: '2025-06-30' },
    { id: 'ch3', chapter: 'Chapter 3: Linear Equations', topics: ['Solutions of Linear Equations', 'Graph of Linear Equations'], completed: true, completionDate: '2025-07-07' },
    { id: 'ch4', chapter: 'Chapter 4: Coordinate Geometry', topics: ['Cartesian Plane', 'Plotting Points'], completed: false, completionDate: null },
    { id: 'ch5', chapter: 'Chapter 5: Quadratic Equations', topics: ['Standard Form', 'Factorization Method', 'Quadratic Formula'], completed: false, completionDate: null },
    { id: 'ch6', chapter: 'Chapter 6: Triangles', topics: ['Congruence', 'Similarity', 'Pythagoras Theorem'], completed: false, completionDate: null },
  ],
};

// ── Downloads ─────────────────────────────────────────────────
export const mockDownloads = [
  { id: 'dl001', category: 'Class List', title: 'Class 9A Student List', format: 'CSV', size: '45 KB', date: '2025-07-01' },
  { id: 'dl002', category: 'Class List', title: 'Class 10A Student List', format: 'CSV', size: '42 KB', date: '2025-07-01' },
  { id: 'dl003', category: 'Attendance Reports', title: 'June Attendance Report — Class 9A', format: 'PDF', size: '1.2 MB', date: '2025-07-02' },
  { id: 'dl004', category: 'Attendance Reports', title: 'June Attendance Report — Class 10A', format: 'PDF', size: '1.1 MB', date: '2025-07-02' },
  { id: 'dl005', category: 'Marks Reports', title: 'Unit Test 1 Results — Class 9A', format: 'PDF', size: '0.8 MB', date: '2025-07-15' },
  { id: 'dl006', category: 'Timetable', title: 'Weekly Timetable — July 2025', format: 'PDF', size: '0.5 MB', date: '2025-07-01' },
  { id: 'dl007', category: 'Study Material', title: 'Mathematics Study Pack — Q1', format: 'ZIP', size: '15.3 MB', date: '2025-06-30' },
  { id: 'dl008', category: 'Teaching Resources', title: 'CBSE Mathematics Curriculum Guide', format: 'PDF', size: '4.7 MB', date: '2025-04-01' },
];
