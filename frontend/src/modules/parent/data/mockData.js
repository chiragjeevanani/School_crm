// Consolidated Mock Data for Parent Portal supporting multi-child accounts

export const MOCK_PARENT = {
  id: "PAR-2024-8902",
  name: "Mr. Rajesh Sharma",
  photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
  occupation: "Software Engineer",
  email: "rajesh.sharma@gmail.com",
  phone: "+91 98765 01234",
  address: "Flat 402, Pine Crest Apartments, Sector 15, Dwarka, New Delhi - 110075",
  childrenCount: 2,
  linkedChildren: [
    {
      id: "STU108902",
      name: "Aarav Sharma",
      class: "Class 10",
      section: "A",
      rollNo: "12",
      photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80",
    },
    {
      id: "STU108903",
      name: "Aanya Sharma",
      class: "Class 6",
      section: "B",
      rollNo: "05",
      photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
    }
  ]
};

// ── Linked Children Full Profiles (Read-only) ────────────────
export const MOCK_CHILDREN_PROFILES = {
  "STU108902": {
    id: "STU108902",
    admissionNo: "ADM-2024-8902",
    name: "Aarav Sharma",
    photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80",
    class: "Class 10",
    section: "A",
    rollNo: "12",
    academicSession: "2025-2026",
    dob: "2010-05-14",
    email: "aarav.sharma@school.edu",
    phone: "+91 98765 43210",
    bloodGroup: "O+",
    emergencyContact: "Rajesh Sharma (+91 98765 01234)",
    address: "Flat 402, Pine Crest Apartments, Dwarka, New Delhi - 110075",
    medical: { allergies: "Dust, Pollen", conditions: "None", medications: "None" },
    documents: [
      { name: "Birth Certificate", size: "1.5 MB", type: "PDF" },
      { name: "Aadhaar Card Copy", size: "850 KB", type: "JPG" },
      { name: "Medical Fitness Certificate", size: "2.1 MB", type: "PDF" }
    ]
  },
  "STU108903": {
    id: "STU108903",
    admissionNo: "ADM-2024-8903",
    name: "Aanya Sharma",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    class: "Class 6",
    section: "B",
    rollNo: "05",
    academicSession: "2025-2026",
    dob: "2014-09-18",
    email: "aanya.sharma@school.edu",
    phone: "+91 98765 01234",
    bloodGroup: "B+",
    emergencyContact: "Rajesh Sharma (+91 98765 01234)",
    address: "Flat 402, Pine Crest Apartments, Dwarka, New Delhi - 110075",
    medical: { allergies: "Peanuts", conditions: "Mild Asthma", medications: "Inhaler (SOS)" },
    documents: [
      { name: "Birth Certificate", size: "1.2 MB", type: "PDF" },
      { name: "Aadhaar Card Copy", size: "890 KB", type: "JPG" },
      { name: "Medical Certificate", size: "1.8 MB", type: "PDF" }
    ]
  }
};

// ── Attendance Records ──────────────────────────────────────
export const MOCK_CHILDREN_ATTENDANCE = {
  "STU108902": {
    overallPercentage: 92.5,
    present: 185,
    absent: 10,
    late: 4,
    halfDay: 1,
    leave: 2,
    analytics: [
      { month: 'Jan', percentage: 95 },
      { month: 'Feb', percentage: 93 },
      { month: 'Mar', percentage: 90 },
      { month: 'Apr', percentage: 92 },
      { month: 'May', percentage: 94 },
      { month: 'Jun', percentage: 92 },
    ],
    history: [
      { date: '2026-07-16', status: 'Present', remark: 'On time' },
      { date: '2026-07-15', status: 'Present', remark: 'On time' },
      { date: '2026-07-14', status: 'Present', remark: 'On time' },
      { date: '2026-07-13', status: 'Present', remark: 'On time' },
      { date: '2026-07-10', status: 'Late', remark: 'Missed school bus' },
      { date: '2026-07-09', status: 'Present', remark: 'On time' },
      { date: '2026-07-08', status: 'Absent', remark: 'Fever' },
      { date: '2026-07-07', status: 'Present', remark: 'On time' },
      { date: '2026-07-06', status: 'Leave', remark: 'Family Function' },
    ]
  },
  "STU108903": {
    overallPercentage: 96.8,
    present: 194,
    absent: 4,
    late: 2,
    halfDay: 0,
    leave: 1,
    analytics: [
      { month: 'Jan', percentage: 98 },
      { month: 'Feb', percentage: 97 },
      { month: 'Mar', percentage: 95 },
      { month: 'Apr', percentage: 96 },
      { month: 'May', percentage: 98 },
      { month: 'Jun', percentage: 97 },
    ],
    history: [
      { date: '2026-07-16', status: 'Present', remark: 'On time' },
      { date: '2026-07-15', status: 'Present', remark: 'On time' },
      { date: '2026-07-14', status: 'Present', remark: 'On time' },
      { date: '2026-07-13', status: 'Present', remark: 'On time' },
      { date: '2026-07-10', status: 'Present', remark: 'On time' },
      { date: '2026-07-09', status: 'Present', remark: 'On time' },
      { date: '2026-07-08', status: 'Present', remark: 'On time' },
      { date: '2026-07-07', status: 'Present', remark: 'On time' },
      { date: '2026-07-06', status: 'Present', remark: 'On time' },
    ]
  }
};

// ── Exam Schedule ────────────────────────────────────────────
export const MOCK_CHILDREN_EXAMS = {
  "STU108902": {
    seatNumber: 'A-12-10',
    examHall: 'Room 302, 3rd Floor',
    countdownToNext: '2026-09-10T09:00:00',
    schedule: [
      { id: 'ex-1', subject: 'Mathematics', date: '2026-09-10', time: '09:00 AM - 12:00 PM', hall: 'Room 302', seat: 'A-12-10' },
      { id: 'ex-2', subject: 'Science', date: '2026-09-12', time: '09:00 AM - 12:00 PM', hall: 'Room 302', seat: 'A-12-10' },
      { id: 'ex-3', subject: 'English', date: '2026-09-15', time: '09:00 AM - 12:00 PM', hall: 'Room 302', seat: 'A-12-10' },
      { id: 'ex-4', subject: 'Social Science', date: '2026-09-18', time: '09:00 AM - 12:00 PM', hall: 'Room 302', seat: 'A-12-10' },
    ]
  },
  "STU108903": {
    seatNumber: 'B-06-05',
    examHall: 'Room 102, 1st Floor',
    countdownToNext: '2026-09-11T09:00:00',
    schedule: [
      { id: 'ex-5', subject: 'English Grammar', date: '2026-09-11', time: '09:00 AM - 11:30 AM', hall: 'Room 102', seat: 'B-06-05' },
      { id: 'ex-6', subject: 'Science Basics', date: '2026-09-13', time: '09:00 AM - 11:30 AM', hall: 'Room 102', seat: 'B-06-05' },
      { id: 'ex-7', subject: 'Hindi Literature', date: '2026-09-14', time: '09:00 AM - 11:30 AM', hall: 'Room 102', seat: 'B-06-05' },
      { id: 'ex-8', subject: 'Social Studies', date: '2026-09-16', time: '09:00 AM - 11:30 AM', hall: 'Room 102', seat: 'B-06-05' },
    ]
  }
};

// ── Exam Results ─────────────────────────────────────────────
export const MOCK_CHILDREN_RESULTS = {
  "STU108902": {
    gpa: '9.4',
    rank: '3rd',
    overallPercentage: '91.8%',
    currentExam: 'Half Yearly Examination',
    subjects: [
      { subject: 'Mathematics', score: 95, total: 100, grade: 'A1', remarks: 'Superb problem solving skills.' },
      { subject: 'Science', score: 91, total: 100, grade: 'A1', remarks: 'Good experimental concept application.' },
      { subject: 'English', score: 89, total: 100, grade: 'A2', remarks: 'Creative writing can be improved.' },
      { subject: 'Social Science', score: 94, total: 100, grade: 'A1', remarks: 'Excellent understanding of historical events.' },
    ],
    previousExamCompare: [
      { subject: 'Maths', midTerm: 92, halfYearly: 95 },
      { subject: 'Science', midTerm: 88, halfYearly: 91 },
      { subject: 'English', midTerm: 95, halfYearly: 89 },
      { subject: 'Social Sci', midTerm: 90, halfYearly: 94 },
    ]
  },
  "STU108903": {
    gpa: '8.9',
    rank: '8th',
    overallPercentage: '88.5%',
    currentExam: 'Half Yearly Examination',
    subjects: [
      { subject: 'English Grammar', score: 90, total: 100, grade: 'A1', remarks: 'Very expressive answers.' },
      { subject: 'Science Basics', score: 87, total: 100, grade: 'A2', remarks: 'Concept clarity is good.' },
      { subject: 'Hindi Literature', score: 85, total: 100, grade: 'A2', remarks: 'Needs to work on spelling.' },
      { subject: 'Social Studies', score: 92, total: 100, grade: 'A1', remarks: 'Attentive and completes all tasks.' },
    ],
    previousExamCompare: [
      { subject: 'English', midTerm: 88, halfYearly: 90 },
      { subject: 'Science', midTerm: 82, halfYearly: 87 },
      { subject: 'Hindi', midTerm: 89, halfYearly: 85 },
      { subject: 'Social Sci', midTerm: 91, halfYearly: 92 },
    ]
  }
};

// ── Fee Statuses ──────────────────────────────────────────────
export const MOCK_CHILDREN_FEES = {
  "STU108902": {
    totalFees: 45000,
    paidFees: 30000,
    pendingFees: 15000,
    installments: [
      { name: 'Quarter 1 Tuition Fee', amount: 15000, dueDate: '2026-04-30', status: 'Paid', receiptNo: 'REC-0982' },
      { name: 'Quarter 2 Tuition Fee', amount: 15000, dueDate: '2026-07-30', status: 'Unpaid', receiptNo: null },
      { name: 'Quarter 3 Tuition Fee', amount: 15000, dueDate: '2026-10-30', status: 'Unpaid', receiptNo: null },
    ],
    discounts: [{ type: 'Scholarship (Academic)', amount: 5000 }],
    history: [
      { paymentId: 'PAY-8921', date: '2026-04-28', amount: 15000, mode: 'UPI (PhonePe)', receiptNo: 'REC-0982' }
    ]
  },
  "STU108903": {
    totalFees: 35000,
    paidFees: 27000,
    pendingFees: 8000,
    installments: [
      { name: 'Quarter 1 Tuition Fee', amount: 12000, dueDate: '2026-04-30', status: 'Paid', receiptNo: 'REC-0811' },
      { name: 'Quarter 2 Tuition Fee', amount: 12000, dueDate: '2026-07-30', status: 'Paid', receiptNo: 'REC-0994' },
      { name: 'Quarter 3 Tuition Fee', amount: 11000, dueDate: '2026-10-30', status: 'Unpaid', receiptNo: null },
    ],
    discounts: [],
    history: [
      { paymentId: 'PAY-7712', date: '2026-04-29', amount: 12000, mode: 'Credit Card', receiptNo: 'REC-0811' },
      { paymentId: 'PAY-8841', date: '2026-07-15', amount: 12000, mode: 'Debit Card', receiptNo: 'REC-0994' }
    ]
  }
};

// ── Academics (Syllabus and Materials) ────────────────────────
export const MOCK_CHILDREN_ACADEMICS = {
  "STU108902": {
    subjects: [
      { name: 'Mathematics', teacher: 'Mr. Rajesh Kumar', syllabusProgress: 75, rooms: 'Room 302' },
      { name: 'Science', teacher: 'Mrs. Sen', syllabusProgress: 68, rooms: 'Science Lab' },
      { name: 'English', teacher: 'Ms. Kapoor', syllabusProgress: 80, rooms: 'Room 105' },
      { name: 'Social Science', teacher: 'Mr. Khan', syllabusProgress: 60, rooms: 'Room 201' },
    ],
    materials: [
      { id: 'mat-1', title: 'Quadratic Equations Notes', type: 'PDF', size: '1.8 MB', subject: 'Mathematics', downloadUrl: '#' },
      { id: 'mat-2', title: 'Carbon Compounds Slides', type: 'PDF', size: '4.5 MB', subject: 'Science', downloadUrl: '#' },
      { id: 'mat-3', title: 'Video: Shakespeare Dramatic Structure', type: 'Video', duration: '45 mins', subject: 'English', downloadUrl: 'https://youtube.com' }
    ]
  },
  "STU108903": {
    subjects: [
      { name: 'English Grammar', teacher: 'Mrs. D. Singh', syllabusProgress: 85, rooms: 'Room 101' },
      { name: 'Science Basics', teacher: 'Mr. Joshi', syllabusProgress: 70, rooms: 'Biology Lab' },
      { name: 'Hindi Literature', teacher: 'Mrs. Sharma', syllabusProgress: 75, rooms: 'Room 108' },
      { name: 'Social Studies', teacher: 'Miss Sen', syllabusProgress: 65, rooms: 'Room 104' },
    ],
    materials: [
      { id: 'mat-4', title: 'Active & Passive Voice Rules', type: 'PDF', size: '1.1 MB', subject: 'English Grammar', downloadUrl: '#' },
      { id: 'mat-5', title: 'Photosynthesis Diagram Sheet', type: 'PDF', size: '2.3 MB', subject: 'Science Basics', downloadUrl: '#' }
    ]
  }
};

// ── Timetables ────────────────────────────────────────────────
export const MOCK_CHILDREN_TIMETABLES = {
  "STU108902": {
    monday: [
      { period: 1, subject: 'Mathematics', time: '08:30 - 09:15', teacher: 'Mr. Rajesh Kumar', room: '302' },
      { period: 2, subject: 'Science', time: '09:15 - 10:00', teacher: 'Mrs. Sen', room: 'Science Lab' },
      { period: 3, subject: 'English', time: '10:15 - 11:00', teacher: 'Ms. Kapoor', room: '105' },
      { period: 4, subject: 'Social Science', time: '11:00 - 11:45', teacher: 'Mr. Khan', room: '201' },
    ],
    tuesday: [
      { period: 1, subject: 'Science', time: '08:30 - 09:15', teacher: 'Mrs. Sen', room: 'Science Lab' },
      { period: 2, subject: 'Mathematics', time: '09:15 - 10:00', teacher: 'Mr. Rajesh Kumar', room: '302' },
      { period: 3, subject: 'Social Science', time: '10:15 - 11:00', teacher: 'Mr. Khan', room: '201' },
      { period: 4, subject: 'English', time: '11:00 - 11:45', teacher: 'Ms. Kapoor', room: '105' },
    ]
  },
  "STU108903": {
    monday: [
      { period: 1, subject: 'English Grammar', time: '08:30 - 09:15', teacher: 'Mrs. D. Singh', room: '101' },
      { period: 2, subject: 'Science Basics', time: '09:15 - 10:00', teacher: 'Mr. Joshi', room: 'Biology Lab' },
      { period: 3, subject: 'Hindi Literature', time: '10:15 - 11:00', teacher: 'Mrs. Sharma', room: '108' },
      { period: 4, subject: 'Social Studies', time: '11:00 - 11:45', teacher: 'Miss Sen', room: '104' },
    ],
    tuesday: [
      { period: 1, subject: 'Hindi Literature', time: '08:30 - 09:15', teacher: 'Mrs. Sharma', room: '108' },
      { period: 2, subject: 'English Grammar', time: '09:15 - 10:00', teacher: 'Mrs. D. Singh', room: '101' },
      { period: 3, subject: 'Social Studies', time: '10:15 - 11:00', teacher: 'Miss Sen', room: '104' },
      { period: 4, subject: 'Science Basics', time: '11:00 - 11:45', teacher: 'Mr. Joshi', room: 'Biology Lab' },
    ]
  }
};

// ── Transport Details ─────────────────────────────────────────
export const MOCK_CHILDREN_TRANSPORT = {
  "STU108902": {
    vehicleNo: 'DL 1PA 7748',
    driverName: 'Mr. Ramesh Kumar',
    driverPhone: '+91 99887 76655',
    pickupPoint: 'Dwarka Sector 15 Cross',
    dropPoint: 'Dwarka Sector 15 Cross',
    pickupTime: '07:45 AM',
    dropTime: '02:30 PM',
  },
  "STU108903": {
    vehicleNo: 'DL 1PA 8820',
    driverName: 'Mr. Harpreet Singh',
    driverPhone: '+91 98989 12121',
    pickupPoint: 'Dwarka Sector 15 Cross',
    dropPoint: 'Dwarka Sector 15 Cross',
    pickupTime: '07:50 AM',
    dropTime: '02:40 PM',
  }
};

// ── Hostel Details ────────────────────────────────────────────
export const MOCK_CHILDREN_HOSTEL = {
  "STU108902": {
    building: 'Tagore Boy’s Residency',
    floor: '2nd Floor',
    roomNumber: '204',
    roomType: '3-Sharing AC',
    feeStatus: 'Paid',
    attendance: { present: 42, absent: 3 }
  },
  "STU108903": {
    building: 'None',
    floor: 'None',
    roomNumber: 'None',
    roomType: 'Day Scholar',
    feeStatus: 'None',
    attendance: null
  }
};

// ── Library Log ──────────────────────────────────────────────
export const MOCK_CHILDREN_LIBRARY = {
  "STU108902": {
    booksIssued: [
      { title: 'Concepts of Physics (Vol 1)', author: 'H.C. Verma', issueDate: '2026-07-02', returnDate: '2026-07-22', status: 'Issued', fine: 0 },
      { title: 'RD Sharma Class 10 Math', author: 'R.D. Sharma', issueDate: '2026-06-15', returnDate: '2026-07-05', status: 'Overdue', fine: 150 }
    ],
    history: [
      { title: 'Science NCERT Class 10', author: 'NCERT', issueDate: '2026-04-12', returnDate: '2026-05-12', status: 'Returned' }
    ]
  },
  "STU108903": {
    booksIssued: [
      { title: 'Alice in Wonderland', author: 'Lewis Carroll', issueDate: '2026-07-10', returnDate: '2026-07-30', status: 'Issued', fine: 0 }
    ],
    history: [
      { title: 'Primary Science Book 6', author: 'Oxford', issueDate: '2026-04-15', returnDate: '2026-05-15', status: 'Returned' }
    ]
  }
};

// ── Static Downloads ─────────────────────────────────────────
export const MOCK_DOWNLOADS = [
  { id: 'dl-1', category: 'Student ID Card', title: 'Aarav Sharma - Digital ID Card', format: 'PDF', size: '420 KB', date: '2025-07-01' },
  { id: 'dl-2', category: 'Student ID Card', title: 'Aanya Sharma - Digital ID Card', format: 'PDF', size: '410 KB', date: '2025-07-01' },
  { id: 'dl-3', category: 'Fee Receipts', title: 'Receipt Quarter 1 — Fee Payment #8921', format: 'PDF', size: '1.1 MB', date: '2026-04-28' },
  { id: 'dl-4', category: 'Report Cards', title: 'Aarav Sharma — Term 1 Report Card', format: 'PDF', size: '1.8 MB', date: '2025-12-20' },
  { id: 'dl-5', category: 'Report Cards', title: 'Aanya Sharma — Term 1 Report Card', format: 'PDF', size: '1.6 MB', date: '2025-12-20' },
];

export const MOCK_LEAVE = [
  { id: 'lv-1', reason: 'Viral Fever', startDate: '2026-07-06', endDate: '2026-07-08', status: 'Approved', comments: 'Get well soon. Make up homework later.' },
  { id: 'lv-2', reason: 'Family Sibling Function', startDate: '2026-07-24', endDate: '2026-07-26', status: 'Pending', comments: null }
];
