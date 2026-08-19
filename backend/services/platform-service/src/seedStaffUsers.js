import bcrypt from 'bcryptjs';
import { School } from './models/School.js';
import { SchoolUser } from './models/SchoolUser.js';

const DEFAULT_STAFF_USERS = [
  {
    employeeId: 'LIB-101',
    firstName: 'Meenakshi',
    lastName: 'Sundaram',
    role: 'LIBRARIAN',
    phone: '+91 98234 56701',
    gender: 'FEMALE',
    specialization: 'Cataloging, Digital Archives & Koha LMS',
    joiningDate: new Date('2021-06-15'),
    department: 'Library & Information Resource',
    designation: 'Chief Librarian',
    basicSalary: 38000,
    bankDetails: {
      accountName: 'Meenakshi Sundaram',
      accountNumber: '501002348911',
      ifscCode: 'HDFC0001024',
      bankName: 'HDFC Bank',
      branchName: 'Sector 18',
      accountType: 'SALARY',
    },
    emailPrefix: 'meenakshi.lib',
  },
  {
    employeeId: 'HR-201',
    firstName: 'Rohan',
    lastName: 'Verma',
    role: 'HR',
    phone: '+91 98456 12389',
    gender: 'MALE',
    specialization: 'Talent Acquisition, Compliance & Staff Welfare',
    joiningDate: new Date('2020-04-01'),
    department: 'Human Resources & Admin',
    designation: 'HR & Operations Lead',
    basicSalary: 45000,
    bankDetails: {
      accountName: 'Rohan Verma',
      accountNumber: '409100889123',
      ifscCode: 'SBIN0004512',
      bankName: 'State Bank of India',
      branchName: 'Noida Main Branch',
      accountType: 'SALARY',
    },
    emailPrefix: 'rohan.hr',
  },
  {
    employeeId: 'ACC-301',
    firstName: 'Suresh',
    lastName: 'Gupta',
    role: 'ACCOUNTANT',
    phone: '+91 97112 34567',
    gender: 'MALE',
    specialization: 'School Fee Ledger, Tally ERP, Auditing & Taxation',
    joiningDate: new Date('2019-07-10'),
    department: 'Finance & Accounts',
    designation: 'Senior Accounts Officer',
    basicSalary: 42000,
    bankDetails: {
      accountName: 'Suresh Gupta',
      accountNumber: '601234908122',
      ifscCode: 'ICIC0000123',
      bankName: 'ICICI Bank',
      branchName: 'Sector 29',
      accountType: 'SALARY',
    },
    emailPrefix: 'suresh.accounts',
  },
  {
    employeeId: 'TRN-401',
    firstName: 'Gurpreet',
    lastName: 'Singh',
    role: 'TRANSPORT',
    phone: '+91 99887 76655',
    gender: 'MALE',
    specialization: 'GPS Fleet Tracking, Bus Route Optimization & Safety',
    joiningDate: new Date('2022-01-10'),
    department: 'Transport & Logistics',
    designation: 'Transport Fleet In-Charge',
    basicSalary: 32000,
    bankDetails: {
      accountName: 'Gurpreet Singh',
      accountNumber: '302199485710',
      ifscCode: 'PUNB0021300',
      bankName: 'Punjab National Bank',
      branchName: 'City Central Branch',
      accountType: 'SALARY',
    },
    emailPrefix: 'gurpreet.transport',
  },
];

export async function seedStaffUsers() {
  const schools = await School.find({}).select('_id name contact');
  const defaultPasswordHash = await bcrypt.hash('Password@123', 10);
  let totalSeeded = 0;

  for (const school of schools) {
    const domain = school.contact?.email ? school.contact.email.split('@')[1] : 'school.edu';

    for (const staff of DEFAULT_STAFF_USERS) {
      const email = `${staff.emailPrefix}@${domain}`.toLowerCase();
      const existingUser = await SchoolUser.findOne({
        schoolId: school._id,
        $or: [{ email }, { employeeId: staff.employeeId }],
      });

      if (!existingUser) {
        await SchoolUser.create({
          schoolId: school._id,
          employeeId: staff.employeeId,
          firstName: staff.firstName,
          lastName: staff.lastName,
          name: `${staff.firstName} ${staff.lastName}`.trim(),
          email,
          passwordHash: defaultPasswordHash,
          role: staff.role,
          phone: staff.phone,
          gender: staff.gender,
          specialization: staff.specialization,
          joiningDate: staff.joiningDate,
          department: staff.department,
          designation: staff.designation,
          basicSalary: staff.basicSalary,
          bankDetails: staff.bankDetails,
          documents: [],
          photo: '',
          status: 'ACTIVE',
        });
        totalSeeded++;
      } else if (!existingUser.basicSalary) {
        existingUser.basicSalary = staff.basicSalary;
        await existingUser.save();
      }
    }
  }

  if (totalSeeded > 0) {
    console.log(`Staff users seeded: ${totalSeeded} (Librarian, HR, Accountant, Transport)`);
  }
  return totalSeeded;
}
