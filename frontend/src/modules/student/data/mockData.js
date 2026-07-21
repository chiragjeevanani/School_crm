// Consolidated Mock Data for Student Portal
// Identity fields sourced from shared/data — see shared/data/students.js,
// shared/data/staff.js and shared/data/school.js. Records below
// (attendance log, homework, exam schedule, fees, etc.) remain local to
// this module.

import { findStudent } from '../../../shared/data/students';
import { findStaffByName } from '../../../shared/data/staff';
import { SCHOOL } from '../../../shared/data/school';

const studentIdentity = findStudent('STU108902');

// Subject teachers for Aarav's Class 10A, resolved from the shared staff
// directory instead of being hardcoded separately here.
const TEACHERS = {
  maths: findStaffByName('Mr. Verma').name,
  science: findStaffByName('Mrs. Sen').name,
  english: findStaffByName('Ms. Kapoor').name,
  social: findStaffByName('Mr. Khan').name,
};

export const MOCK_STUDENT = {
  id: studentIdentity.id,
  name: studentIdentity.name,
  photo: studentIdentity.photo,
  admissionNo: studentIdentity.admissionNo,
  class: studentIdentity.class,
  section: studentIdentity.section,
  rollNo: studentIdentity.rollNo,
  academicSession: SCHOOL.academicSession,
  dob: studentIdentity.dob,
  email: studentIdentity.email,
  phone: studentIdentity.phone,
  bloodGroup: studentIdentity.bloodGroup,
  emergencyContact: `${studentIdentity.parentName} (${studentIdentity.parentPhone})`,
  address: studentIdentity.address,
  guardian: {
    name: studentIdentity.parentName,
    relation: "Father",
    phone: studentIdentity.parentPhone,
    email: "rajesh.sharma@gmail.com",
    occupation: "Software Engineer",
  },
  medical: {
    allergies: "Dust, Pollen",
    conditions: "None",
    medications: "None"
  }
};

export const MOCK_ATTENDANCE = {
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
};

export const MOCK_HOMEWORK = [
  {
    id: 'hw-1',
    subject: 'Mathematics',
    teacher: TEACHERS.maths,
    description: 'Solve exercises 5.1 and 5.2 on Page 84. Show all steps for proving the trigonometric identities.',
    dueDate: '2026-07-20',
    status: 'Pending',
    priority: 'High',
    attachments: [{ name: 'Trig_Assg_Q.pdf', size: '1.2 MB' }]
  },
  {
    id: 'hw-2',
    subject: 'Science',
    teacher: TEACHERS.science,
    description: 'Complete the Physics lab report for Experiment 4: Focal Length of Convex Lens. Draw labeled diagram.',
    dueDate: '2026-07-18',
    status: 'Submitted',
    priority: 'Medium',
    submittedAt: '2026-07-15',
    attachments: [{ name: 'Focal_Length_Lab_Manual.pdf', size: '2.5 MB' }],
    submission: {
      fileName: 'Aarav_Physics_Report.pdf',
      submittedAt: '2026-07-15',
      marks: '9/10',
      feedback: 'Excellent work. Diagrams are drawn neatly and analysis is precise.'
    }
  },
  {
    id: 'hw-3',
    subject: 'English',
    teacher: TEACHERS.english,
    description: 'Write an essay (300 words) analyzing the main theme of the play "Julius Caesar" by William Shakespeare.',
    dueDate: '2026-07-22',
    status: 'Pending',
    priority: 'Low',
    attachments: []
  },
  {
    id: 'hw-4',
    subject: 'Social Science',
    teacher: TEACHERS.social,
    description: 'Map Work: Mark the main centers of the Indian National Movement on the provided outline map of India.',
    dueDate: '2026-07-14',
    status: 'Submitted',
    priority: 'High',
    submittedAt: '2026-07-13',
    attachments: [],
    submission: {
      fileName: 'Aarav_History_Map.jpg',
      submittedAt: '2026-07-13',
      marks: '10/10',
      feedback: 'Very accurate locations. Well colored.'
    }
  }
];

export const MOCK_EXAMS = {
  seatNumber: 'A-12-10',
  examHall: 'Room 302, 3rd Floor',
  countdownToNext: '2026-09-10T09:00:00',
  instructions: [
    'Report to the examination hall 30 minutes before the start time.',
    'Carry your physical Student ID card and Hall Ticket.',
    'Calculators are allowed only for physics and chemistry papers.',
    'No mobile phones or electronic gadgets are permitted.'
  ],
  schedule: [
    { id: 'ex-1', subject: 'Mathematics', date: '2026-09-10', time: '09:00 AM - 12:00 PM', hall: 'Room 302', seat: 'A-12-10' },
    { id: 'ex-2', subject: 'Science', date: '2026-09-12', time: '09:00 AM - 12:00 PM', hall: 'Room 302', seat: 'A-12-10' },
    { id: 'ex-3', subject: 'English', date: '2026-09-15', time: '09:00 AM - 12:00 PM', hall: 'Room 302', seat: 'A-12-10' },
    { id: 'ex-4', subject: 'Social Science', date: '2026-09-18', time: '09:00 AM - 12:00 PM', hall: 'Room 302', seat: 'A-12-10' },
  ]
};

export const MOCK_RESULTS = {
  gpa: '9.4',
  rank: '3rd',
  overallPercentage: '91.8%',
  currentExam: 'Half Yearly Examination',
  previousExamCompare: [
    { subject: 'Maths', midTerm: 92, halfYearly: 95 },
    { subject: 'Science', midTerm: 88, halfYearly: 91 },
    { subject: 'English', midTerm: 95, halfYearly: 89 },
    { subject: 'Social Sci', midTerm: 90, halfYearly: 94 },
  ],
  subjects: [
    { subject: 'Mathematics', score: 95, total: 100, grade: 'A1', remarks: 'Superb problem solving skills.' },
    { subject: 'Science', score: 91, total: 100, grade: 'A1', remarks: 'Good experimental concept application.' },
    { subject: 'English', score: 89, total: 100, grade: 'A2', remarks: 'Creative writing can be improved.' },
    { subject: 'Social Science', score: 94, total: 100, grade: 'A1', remarks: 'Excellent understanding of historical events.' },
  ]
};

export const MOCK_ACADEMICS = {
  subjects: [
    { name: 'Mathematics', teacher: TEACHERS.maths, syllabusProgress: 75, rooms: 'Room 302' },
    { name: 'Science', teacher: TEACHERS.science, syllabusProgress: 68, rooms: 'Science Lab' },
    { name: 'English', teacher: TEACHERS.english, syllabusProgress: 80, rooms: 'Room 105' },
    { name: 'Social Science', teacher: TEACHERS.social, syllabusProgress: 60, rooms: 'Room 201' },
  ],
  materials: [
    { id: 'mat-1', title: 'Quadratic Equations Notes', type: 'PDF', size: '1.8 MB', subject: 'Mathematics', downloadUrl: '#' },
    { id: 'mat-2', title: 'Carbon & its Compounds Presentation', type: 'Notes', size: '4.5 MB', subject: 'Science', downloadUrl: '#' },
    { id: 'mat-3', title: 'Recorded Lecture: Shakespearean Drama', type: 'Video', duration: '45 mins', subject: 'English', downloadUrl: '#' },
    { id: 'mat-4', title: 'French Revolution Map Guide', type: 'PDF', size: '2.1 MB', subject: 'Social Science', downloadUrl: '#' }
  ]
};

export const MOCK_TIMETABLE = {
  monday: [
    { period: 1, subject: 'Maths', time: '08:30 - 09:15', teacher: TEACHERS.maths, room: '302' },
    { period: 2, subject: 'Science', time: '09:15 - 10:00', teacher: TEACHERS.science, room: 'Science Lab' },
    { period: 3, subject: 'English', time: '10:15 - 11:00', teacher: TEACHERS.english, room: '105' },
    { period: 4, subject: 'Social Sci', time: '11:00 - 11:45', teacher: TEACHERS.social, room: '201' },
  ],
  tuesday: [
    { period: 1, subject: 'Science', time: '08:30 - 09:15', teacher: TEACHERS.science, room: 'Science Lab' },
    { period: 2, subject: 'Maths', time: '09:15 - 10:00', teacher: TEACHERS.maths, room: '302' },
    { period: 3, subject: 'Social Sci', time: '10:15 - 11:00', teacher: TEACHERS.social, room: '201' },
    { period: 4, subject: 'English', time: '11:00 - 11:45', teacher: TEACHERS.english, room: '105' },
  ],
  wednesday: [
    { period: 1, subject: 'Maths', time: '08:30 - 09:15', teacher: TEACHERS.maths, room: '302' },
    { period: 2, subject: 'Science', time: '09:15 - 10:00', teacher: TEACHERS.science, room: 'Science Lab' },
    { period: 3, subject: 'English', time: '10:15 - 11:00', teacher: TEACHERS.english, room: '105' },
    { period: 4, subject: 'Social Sci', time: '11:00 - 11:45', teacher: TEACHERS.social, room: '201' },
  ],
  thursday: [
    { period: 1, subject: 'Science', time: '08:30 - 09:15', teacher: TEACHERS.science, room: 'Science Lab' },
    { period: 2, subject: 'Maths', time: '09:15 - 10:00', teacher: TEACHERS.maths, room: '302' },
    { period: 3, subject: 'Social Sci', time: '10:15 - 11:00', teacher: TEACHERS.social, room: '201' },
    { period: 4, subject: 'English', time: '11:00 - 11:45', teacher: TEACHERS.english, room: '105' },
  ],
  friday: [
    { period: 1, subject: 'Maths', time: '08:30 - 09:15', teacher: TEACHERS.maths, room: '302' },
    { period: 2, subject: 'Science', time: '09:15 - 10:00', teacher: TEACHERS.science, room: 'Science Lab' },
    { period: 3, subject: 'English', time: '10:15 - 11:00', teacher: TEACHERS.english, room: '105' },
    { period: 4, subject: 'Social Sci', time: '11:00 - 11:45', teacher: TEACHERS.social, room: '201' },
  ]
};

export const MOCK_FEES = {
  totalFees: 45000,
  paidFees: 30000,
  pendingFees: 15000,
  installments: [
    { name: 'Quarter 1 Tuition Fee', amount: 15000, dueDate: '2026-04-30', status: 'Paid', receiptNo: 'REC-0982' },
    { name: 'Quarter 2 Tuition Fee', amount: 15000, dueDate: '2026-07-30', status: 'Unpaid', receiptNo: null },
    { name: 'Quarter 3 Tuition Fee', amount: 15000, dueDate: '2026-10-30', status: 'Unpaid', receiptNo: null },
  ],
  discounts: [
    { type: 'Scholarship (Academic Excellence)', amount: 5000 }
  ],
  lateFine: 0,
  history: [
    { paymentId: 'PAY-8921', date: '2026-04-28', amount: 15000, mode: 'UPI (PhonePe)', receiptNo: 'REC-0982' }
  ]
};

export const MOCK_TRANSPORT = {
  vehicleNo: 'DL 1PA 7748',
  driverName: 'Mr. Ramesh Kumar',
  driverPhone: '+91 99887 76655',
  pickupPoint: 'Block-C Dwarka Sector 15 Cross',
  dropPoint: 'Block-C Dwarka Sector 15 Cross',
  pickupTime: '07:45 AM',
  dropTime: '02:30 PM',
  routeMapUrl: '#'
};

export const MOCK_HOSTEL = {
  building: 'Tagore Boy’s Residency',
  floor: '2nd Floor',
  roomNumber: '204',
  roomType: '3-Sharing AC',
  roommates: [
    { name: 'Kabir Mehta', rollNo: '15' },
    { name: 'Rohan Joshi', rollNo: '24' }
  ],
  feeStatus: 'Paid (Semester 1)',
  attendance: {
    present: 42,
    absent: 3
  }
};

export const MOCK_LIBRARY = {
  booksIssued: [
    { title: 'Concepts of Physics (Vol 1)', author: 'H.C. Verma', issueDate: '2026-07-02', returnDate: '2026-07-22', status: 'Issued', fine: 0 },
    { title: 'RD Sharma Mathematics Class 10', author: 'R.D. Sharma', issueDate: '2026-06-15', returnDate: '2026-07-05', status: 'Overdue', fine: 150 }
  ],
  searchCatalog: [
    { title: 'Fundamentals of Inorganic Chemistry', author: 'J.D. Lee', available: true },
    { title: 'The Complete Works of William Shakespeare', author: 'W. Shakespeare', available: false }
  ],
  history: [
    { title: 'Science NCERT TextBook Class 10', author: 'NCERT', issueDate: '2026-04-12', returnDate: '2026-05-12', status: 'Returned' }
  ]
};

export const MOCK_LEAVE = [
  { id: 'lv-1', reason: 'Viral Fever', startDate: '2026-07-06', endDate: '2026-07-08', status: 'Approved', comments: 'Get well soon. Make up homework later.' },
  { id: 'lv-2', reason: 'Family Marriage', startDate: '2026-07-24', endDate: '2026-07-26', status: 'Pending', comments: null }
];

export const MOCK_ANNOUNCEMENTS = [
  { id: 1, title: 'Half-Yearly Examination Schedule', category: 'Exam', date: '2026-07-15', content: 'The complete date sheet for Half-Yearly exams starting from Sept 10 is uploaded in the Exams tab. Hall tickets will be downloadable from Aug 25.' },
  { id: 2, title: 'Independence Day Cultural Event Registration', category: 'Event', date: '2026-07-12', content: 'Registrations are open for the Independence Day cultural activities including speech, solo song, and drama. Contact your class teacher for submission.' },
  { id: 3, title: 'Advisory on Monsoon Precautionary Measures', category: 'School Notice', date: '2026-07-10', content: 'Due to ongoing heavy rains, students are advised to wear rain boots, carry umbrellas, and avoid waterlogged areas near the school grounds.' }
];

export const MOCK_EVENTS = {
  upcoming: [
    { title: 'Annual Sports Meet 2026', category: 'Sports', date: '2026-08-05', time: '09:00 AM', venue: 'Main Ground', registered: true },
    { title: 'Inter-School Science Fair', category: 'Competitions', date: '2026-08-18', time: '10:00 AM', venue: 'Auditorium', registered: false }
  ],
  calendar: [
    { date: '2026-08-05', type: 'sports' },
    { date: '2026-08-15', type: 'holiday' },
    { date: '2026-08-18', type: 'fair' }
  ]
};
