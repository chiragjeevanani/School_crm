import { Student } from '../models/Student.js';
import { Teacher } from '../models/Teacher.js';
import { SchoolUser } from '../models/SchoolUser.js';
import { SchoolClass } from '../models/SchoolClass.js';
import { Section } from '../models/Section.js';
import { StaffAttendance } from '../models/StaffAttendance.js';
import { FeeInvoice } from '../models/FeeInvoice.js';
import { FeePayment } from '../models/FeePayment.js';
import { LibraryBook } from '../models/LibraryBook.js';
import { LibraryIssue } from '../models/LibraryIssue.js';
import { Hostel } from '../models/Hostel.js';
import { HostelRoom } from '../models/HostelRoom.js';
import { HostelBed } from '../models/HostelBed.js';
import { HostelAllocation } from '../models/HostelAllocation.js';
import { Vehicle } from '../models/Vehicle.js';
import { TransportRoute } from '../models/TransportRoute.js';
import { RouteStop } from '../models/RouteStop.js';
import { StudentTransportAssignment } from '../models/StudentTransportAssignment.js';
import { Exam } from '../models/Exam.js';
import { ExamResult } from '../models/ExamResult.js';

export const schoolReportsService = {
  async getReportsSummary(schoolId) {
    if (!schoolId) throw new Error('School ID is required');

    const [
      studentsCount,
      staffCount,
      feeInvoicesCount,
      libraryCount,
      hostelCount,
      transportCount,
      examsCount,
    ] = await Promise.all([
      Student.countDocuments({ schoolId }),
      SchoolUser.countDocuments({ schoolId }),
      FeeInvoice.countDocuments({ schoolId }),
      LibraryBook.countDocuments({ schoolId }),
      HostelAllocation.countDocuments({ schoolId, status: 'ACTIVE' }),
      StudentTransportAssignment.countDocuments({ schoolId, status: 'ACTIVE' }),
      Exam.countDocuments({ schoolId }),
    ]);

    return {
      studentsCount,
      staffCount,
      feeInvoicesCount,
      libraryCount,
      hostelCount,
      transportCount,
      examsCount,
    };
  },

  async getCategoryReport(schoolId, category, query = {}) {
    if (!schoolId) throw new Error('School ID is required');

    switch (category) {
      case 'students': {
        const students = await Student.find({ schoolId })
          .select('admissionNumber firstName lastName className sectionName gender rollNumber phone guardianName guardianPhone status')
          .sort({ className: 1, rollNumber: 1 })
          .lean();

        return students.map((s) => ({
          'Admission No': s.admissionNumber || `ADM-${s._id.toString().slice(-4).toUpperCase()}`,
          'Student Name': `${s.firstName || ''} ${s.lastName || ''}`.trim(),
          'Class & Section': `${s.className || '10'} - ${s.sectionName || 'A'}`,
          'Roll Number': s.rollNumber || 'N/A',
          'Gender': s.gender || 'Not Specified',
          'Guardian Name': s.guardianName || 'Parent',
          'Contact Phone': s.guardianPhone || s.phone || 'N/A',
          'Status': s.status || 'ACTIVE',
        }));
      }

      case 'fees': {
        const payments = await FeePayment.find({ schoolId })
          .populate('studentId', 'firstName lastName admissionNumber className')
          .sort({ createdAt: -1 })
          .limit(100)
          .lean();

        return payments.map((p) => ({
          'Receipt No': p.receiptNumber || `REC-${p._id.toString().slice(-4).toUpperCase()}`,
          'Student Name': p.studentId ? `${p.studentId.firstName} ${p.studentId.lastName}` : 'Student',
          'Class': p.studentId?.className || 'N/A',
          'Amount Paid': `₹${(p.amount || 0).toLocaleString()}`,
          'Payment Mode': p.paymentMethod || 'ONLINE',
          'Date': p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'Today',
          'Status': p.status || 'SUCCESS',
        }));
      }

      case 'fee_dues': {
        const invoices = await FeeInvoice.find({ schoolId, status: { $in: ['PENDING', 'PARTIAL', 'OVERDUE'] } })
          .populate('studentId', 'firstName lastName admissionNumber className')
          .sort({ dueDate: 1 })
          .limit(100)
          .lean();

        return invoices.map((inv) => ({
          'Invoice No': inv.invoiceNumber || `INV-${inv._id.toString().slice(-4).toUpperCase()}`,
          'Student Name': inv.studentId ? `${inv.studentId.firstName} ${inv.studentId.lastName}` : 'Student',
          'Class': inv.studentId?.className || 'N/A',
          'Total Fee': `₹${(inv.totalAmount || 0).toLocaleString()}`,
          'Paid Amount': `₹${(inv.paidAmount || 0).toLocaleString()}`,
          'Pending Due': `₹${(inv.balanceAmount || inv.totalAmount || 0).toLocaleString()}`,
          'Due Date': inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : 'N/A',
          'Status': inv.status || 'PENDING',
        }));
      }

      case 'attendance': {
        const staffAttendance = await StaffAttendance.find({ schoolId })
          .sort({ date: -1 })
          .limit(30)
          .lean();

        return staffAttendance.map((att) => ({
          'Date': att.date,
          'Total Staff': att.totalEmployees || att.records?.length || 0,
          'Present Count': att.presentCount || att.records?.filter((r) => r.status === 'PRESENT').length || 0,
          'Absent Count': att.absentCount || att.records?.filter((r) => r.status !== 'PRESENT').length || 0,
          'Attendance %': att.totalEmployees ? `${Math.round(((att.presentCount || 0) / att.totalEmployees) * 100)}%` : '0%',
        }));
      }

      case 'hostel': {
        const allocations = await HostelAllocation.find({ schoolId, status: 'ACTIVE' })
          .populate('studentId', 'firstName lastName rollNumber className')
          .populate('hostelId', 'name type')
          .populate('roomId', 'roomNumber blockName')
          .populate('bedId', 'bedCode')
          .sort({ createdAt: -1 })
          .lean();

        return allocations.map((a) => ({
          'Student Name': a.studentId ? `${a.studentId.firstName} ${a.studentId.lastName}` : 'Resident',
          'Class': a.studentId?.className || 'N/A',
          'Hostel Building': a.hostelId?.name || 'Hostel',
          'Room No': a.roomId?.roomNumber || 'N/A',
          'Bed Code': a.bedId?.bedCode || 'N/A',
          'Monthly Fee': `₹${(a.monthlyFee || 0).toLocaleString()}`,
          'Check-in Date': a.allocationDate ? new Date(a.allocationDate).toLocaleDateString() : 'N/A',
          'Status': a.status || 'ACTIVE',
        }));
      }

      case 'transport': {
        const assignments = await StudentTransportAssignment.find({ schoolId, status: 'ACTIVE' })
          .populate('studentId', 'firstName lastName rollNumber className')
          .populate('routeId', 'routeName routeCode')
          .populate('pickupStopId', 'stopName pickupTime')
          .populate('dropStopId', 'stopName dropTime')
          .sort({ createdAt: -1 })
          .lean();

        return assignments.map((a) => ({
          'Student Name': a.studentId ? `${a.studentId.firstName} ${a.studentId.lastName}` : 'Student',
          'Class': a.studentId?.className || 'N/A',
          'Route': a.routeId?.routeCode || a.routeId?.routeName || 'N/A',
          'Pickup Stop': a.pickupStopId?.stopName || 'N/A',
          'Pickup Time': a.pickupStopId?.pickupTime || 'N/A',
          'Monthly Fee': `₹${(a.monthlyFee || 0).toLocaleString()}`,
          'Status': a.status || 'ACTIVE',
        }));
      }

      case 'library': {
        const books = await LibraryBook.find({ schoolId }).sort({ title: 1 }).lean();

        return books.map((b) => ({
          'Book Code': b.bookCode || `BK-${b._id.toString().slice(-4).toUpperCase()}`,
          'Title': b.title,
          'Author': b.author,
          'Category': b.category || 'GENERAL',
          'Total Copies': b.totalCopies || 0,
          'Available Copies': b.availableCopies || 0,
          'Issued Copies': Math.max(0, (b.totalCopies || 0) - (b.availableCopies || 0)),
          'Rack & Shelf': `${b.rackNumber || 'N/A'} / Shelf ${b.shelfNumber || 'N/A'}`,
        }));
      }

      case 'staff': {
        const staff = await SchoolUser.find({ schoolId, status: 'ACTIVE' })
          .select('fullName email phone designation role')
          .sort({ fullName: 1 })
          .lean();

        return staff.map((s) => ({
          'Staff Name': s.fullName || 'Staff Member',
          'Role': s.role || 'STAFF',
          'Designation': s.designation || 'Staff',
          'Email Address': s.email || 'N/A',
          'Contact Phone': s.phone || 'N/A',
          'Status': 'ACTIVE',
        }));
      }

      case 'exams': {
        const exams = await Exam.find({ schoolId }).sort({ startDate: -1 }).lean();

        return exams.map((e) => ({
          'Exam Name': e.name || e.title || 'Exam',
          'Term / Code': e.term || e.examCode || 'TERM-1',
          'Start Date': e.startDate ? new Date(e.startDate).toLocaleDateString() : 'N/A',
          'End Date': e.endDate ? new Date(e.endDate).toLocaleDateString() : 'N/A',
          'Status': e.status || 'SCHEDULED',
        }));
      }

      default:
        return [];
    }
  },
};
