// ============================================================
// SHARED STAFF / TEACHER DIRECTORY
// Base: teacher/data/mockData.js's mockTeacher (Mr. Rajesh Kumar) as the
// first entry. Extended with the teacher roster shared by principal /
// school-admin (Dr. Ramesh Kumar, Mrs. Sunita Rao, Mr. David D'souza,
// Mrs. Priya Nair, Mr. Anil Joshi), the subject teachers mentioned in
// student/data/mockData.js's MOCK_HOMEWORK & MOCK_ACADEMICS (Mr. Verma,
// Mrs. Sen, Ms. Kapoor, Mr. Khan, plus Aanya's Class 6 teachers Mrs. D.
// Singh / Mr. Joshi / Mrs. Sharma / Miss Sen), HR's employee records, and
// each module's own front-desk leadership persona (principal, HR
// manager, accountant, transport manager, librarian).
//
// Two identity collisions were found and reconciled while building this
// file (see the report for details):
//  - HR's own employee list had a *second*, unrelated "Mr. Rajesh Kumar"
//    (a PE & Sports instructor, EMP-004) which collided with the
//    teacher module's Mr. Rajesh Kumar (Senior Maths Teacher). Renamed
//    to "Mr. Vikram Kumar" in HR/utils/constants.js to remove the clash.
//  - Mrs. Priya Nair's department disagreed between HR ("Mathematics")
//    and principal/school-admin ("Social Studies", 2 modules agreeing).
//    Canonicalized here as Social Studies; HR's record was updated to
//    match.
// ============================================================

export const MOCK_STAFF = [
  // ---- Teacher module persona (richest identity record) ----
  {
    id: 'TCH-2024-001',
    employeeId: 'EMP-2019-045',
    name: 'Mr. Rajesh Kumar',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    department: 'Mathematics',
    designation: 'Senior Teacher',
    role: 'Teacher',
    classTeacherOf: 'Class 10 - Section A',
    subjects: ['Mathematics', 'Statistics'],
    classes: ['Class 9A', 'Class 9B', 'Class 10A', 'Class 10B'],
    email: 'rajesh.kumar@greenfield.edu',
    phone: '+91 98765 12345',
    dob: '1985-03-15',
    gender: 'Male',
    bloodGroup: 'B+',
    address: 'Flat 204, Sunrise Apartments, Sector 22, Noida, UP - 201301',
    joiningDate: '2019-07-01',
    experience: '7 Years',
    qualification: 'M.Sc. Mathematics, B.Ed.',
    emergencyContact: { name: 'Priya Kumar', relation: 'Spouse', phone: '+91 99887 76655' },
  },

  // ---- Shared teacher roster (principal / school-admin / accountant) ----
  { id: 'TCH-001', name: 'Dr. Ramesh Kumar', department: 'Science', designation: 'HOD', role: 'Teacher', subjects: ['Physics', 'Applied Science'], classes: ['Class 10A', 'Class 11A', 'Class 12C'], email: 'ramesh.kumar@greenfield.edu', phone: '+91 91111 00001', qualification: 'Ph.D in Physics', experience: '12 Years' },
  { id: 'TCH-002', name: 'Mrs. Sunita Rao', department: 'Mathematics', designation: 'Senior Teacher', role: 'Teacher', subjects: ['Calculus', 'Algebra'], classes: ['Class 9A', 'Class 10A', 'Class 10B'], email: 'sunita.rao@greenfield.edu', phone: '+91 91111 00002', qualification: 'M.Sc Mathematics, B.Ed', experience: '9 Years' },
  { id: 'TCH-003', name: "Mr. David D'souza", department: 'English', designation: 'Teacher', role: 'Teacher', subjects: ['English Literature', 'Functional English'], classes: ['Class 8A', 'Class 9A', 'Class 11A'], email: 'david.d@greenfield.edu', phone: '+91 91111 00003', qualification: 'M.A English Lit', experience: '6 Years' },
  { id: 'TCH-004', name: 'Mrs. Priya Nair', department: 'Social Studies', designation: 'Senior Teacher', role: 'Teacher', subjects: ['History', 'Civics'], classes: ['Class 9B', 'Class 10B'], email: 'priya.nair@greenfield.edu', phone: '+91 99999 00001', qualification: 'M.A History, B.Ed', experience: '14 Years' },
  { id: 'TCH-005', name: 'Mr. Anil Joshi', department: 'Computer Science', designation: 'Teacher', role: 'Teacher', subjects: ['Database Systems', 'C++'], classes: ['Class 11A', 'Class 12C'], email: 'anil.joshi@greenfield.edu', phone: '+91 91111 00005', qualification: 'MCA, B.Ed', experience: '5 Years' },

  // ---- HR employee records (non-conflicting) ----
  { id: 'EMP-002', name: 'Mr. Alok Verma', department: 'Science', designation: 'HOD', role: 'Teacher', subjects: ['Quantum Mechanics', 'Optics', 'Lab Safety'], email: 'alok.verma@greenfield.edu', phone: '+91 99999 00002', qualification: 'Ph.D Physics', experience: '11 Years' },
  { id: 'EMP-003', name: 'Ms. Shalini Sen', department: 'Finance', designation: 'Accountant', role: 'Non-Teaching', subjects: [], email: 'shalini.sen@greenfield.edu', phone: '+91 99999 00003', qualification: 'M.Com', experience: '6 Years' },
  { id: 'EMP-004', name: 'Mr. Vikram Kumar', department: 'PE & Sports', designation: 'Sports Instructor', role: 'Non-Teaching', subjects: ['Athletics coaching', 'Football coaching', 'First Aid'], email: 'vikram.sports@greenfield.edu', phone: '+91 99999 00004', qualification: 'B.P.Ed', experience: '5 Years' },

  // ---- Subject teachers referenced in student/data/mockData.js (Aarav's Class 10A) ----
  { id: 'TCH-101', name: 'Mr. Verma', department: 'Mathematics', designation: 'Teacher', role: 'Teacher', subjects: ['Mathematics'], classes: ['Class 10A'], email: 'verma@greenfield.edu' },
  { id: 'TCH-102', name: 'Mrs. Sen', department: 'Science', designation: 'Teacher', role: 'Teacher', subjects: ['Science'], classes: ['Class 10A'], email: 'sen.science@greenfield.edu' },
  { id: 'TCH-103', name: 'Ms. Kapoor', department: 'English', designation: 'Teacher', role: 'Teacher', subjects: ['English'], classes: ['Class 10A'], email: 'kapoor@greenfield.edu' },
  { id: 'TCH-104', name: 'Mr. Khan', department: 'Social Studies', designation: 'Teacher', role: 'Teacher', subjects: ['Social Science'], classes: ['Class 10A'], email: 'khan@greenfield.edu' },

  // ---- Subject teachers referenced in parent/data/mockData.js (Aanya's Class 6B) ----
  { id: 'TCH-105', name: 'Mrs. D. Singh', department: 'English', designation: 'Teacher', role: 'Teacher', subjects: ['English Grammar'], classes: ['Class 6B'], email: 'd.singh@greenfield.edu' },
  { id: 'TCH-106', name: 'Mr. Joshi', department: 'Science', designation: 'Teacher', role: 'Teacher', subjects: ['Science Basics'], classes: ['Class 6B'], email: 'joshi.science@greenfield.edu' },
  { id: 'TCH-107', name: 'Mrs. Sharma', department: 'Hindi', designation: 'Teacher', role: 'Teacher', subjects: ['Hindi Literature'], classes: ['Class 6B'], email: 'sharma.hindi@greenfield.edu' },
  { id: 'TCH-108', name: 'Miss Sen', department: 'Social Studies', designation: 'Teacher', role: 'Teacher', subjects: ['Social Studies'], classes: ['Class 6B'], email: 'sen.socialstudies@greenfield.edu' },

  // ---- Front-desk leadership personas (each module's own logged-in user) ----
  { id: 'PRN-001', name: 'Dr. S. Chatterjee', department: 'Administration', designation: 'Principal', role: 'Leadership', email: 'principal@greenfield.edu', phone: '+91 99999 77777' },
  { id: 'HR-001', name: 'Mr. Suresh Kumar', department: 'Administration', designation: 'HR & Admin Manager', role: 'Non-Teaching', email: 'suresh.kumar@greenfield.edu', phone: '+91 99999 00000' },
  { id: 'ACC-001', name: 'Mr. Suresh Mehta', department: 'Finance', designation: 'School Accountant', role: 'Non-Teaching', email: 'suresh.mehta@greenfield.edu', phone: '+91 99999 55555' },
  { id: 'TM-001', name: 'Manish Dave', department: 'Transport', designation: 'Transport Manager', role: 'Non-Teaching', email: 'manish.dave@greenfield.edu' },
  { id: 'LIB-001', name: 'Sanjay Kumar', department: 'Library', designation: 'Librarian', role: 'Non-Teaching', email: 'sanjay.kumar@greenfield.edu' },
];

export const findStaff = (id) => MOCK_STAFF.find((s) => s.id === id);
export const findStaffByName = (name) => MOCK_STAFF.find((s) => s.name === name);
