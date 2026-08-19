import mongoose from 'mongoose';
import { LibraryBook } from '../models/LibraryBook.js';
import { LibraryIssue } from '../models/LibraryIssue.js';
import { Student } from '../models/Student.js';
import { Teacher } from '../models/Teacher.js';
import { SchoolUser } from '../models/SchoolUser.js';

function toObjectId(id) {
  if (!id) return null;
  if (id instanceof mongoose.Types.ObjectId) return id;
  try {
    return new mongoose.Types.ObjectId(id);
  } catch {
    return id;
  }
}

class LibraryRepository {
  // Books CRUD
  async listBooks(schoolId, query = {}) {
    const filter = { schoolId: toObjectId(schoolId) };

    if (query.category && query.category !== 'ALL') {
      filter.category = query.category.toUpperCase();
    }

    if (query.status && query.status !== 'ALL') {
      if (query.status === 'AVAILABLE') {
        filter.availableCopies = { $gt: 0 };
      } else if (query.status === 'OUT_OF_STOCK') {
        filter.availableCopies = { $lte: 0 };
      }
    }

    if (query.search?.trim()) {
      const regex = new RegExp(query.search.trim(), 'i');
      filter.$or = [
        { title: regex },
        { author: regex },
        { isbn: regex },
        { bookCode: regex },
        { publisher: regex },
        { category: regex },
      ];
    }

    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(200, Math.max(1, Number(query.limit) || 100));
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      LibraryBook.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      LibraryBook.countDocuments(filter),
    ]);

    return {
      items,
      total,
      page,
      limit,
    };
  }

  async findBookById(schoolId, id) {
    return LibraryBook.findOne({ schoolId: toObjectId(schoolId), _id: toObjectId(id) });
  }

  async createBook(data) {
    return LibraryBook.create({
      ...data,
      schoolId: toObjectId(data.schoolId),
    });
  }

  async updateBook(schoolId, id, updates) {
    return LibraryBook.findOneAndUpdate(
      { schoolId: toObjectId(schoolId), _id: toObjectId(id) },
      { $set: updates },
      { new: true, runValidators: true }
    );
  }

  async deleteBook(schoolId, id) {
    return LibraryBook.findOneAndDelete({ schoolId: toObjectId(schoolId), _id: toObjectId(id) });
  }

  // Issues & Circulation
  async listIssues(schoolId, query = {}) {
    const filter = { schoolId: toObjectId(schoolId) };

    if (query.status && query.status !== 'ALL') {
      if (query.status === 'OVERDUE') {
        filter.status = 'ISSUED';
        filter.dueDate = { $lt: new Date() };
      } else {
        filter.status = query.status.toUpperCase();
      }
    }

    if (query.borrowerType && query.borrowerType !== 'ALL') {
      filter.borrowerType = query.borrowerType.toUpperCase();
    }

    if (query.borrowerRefId) {
      filter.borrowerRefId = toObjectId(query.borrowerRefId);
    }

    if (query.bookId) {
      filter.bookId = toObjectId(query.bookId);
    }

    if (query.search?.trim()) {
      const regex = new RegExp(query.search.trim(), 'i');
      filter.$or = [
        { bookTitle: regex },
        { bookCode: regex },
        { borrowerName: regex },
        { borrowerCode: regex },
        { borrowerClass: regex },
      ];
    }

    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(200, Math.max(1, Number(query.limit) || 100));
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      LibraryIssue.find(filter)
        .sort({ issueDate: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit),
      LibraryIssue.countDocuments(filter),
    ]);

    return {
      items,
      total,
      page,
      limit,
    };
  }

  async findIssueById(schoolId, id) {
    return LibraryIssue.findOne({ schoolId: toObjectId(schoolId), _id: toObjectId(id) });
  }

  async createIssue(payload) {
    const schoolObjId = toObjectId(payload.schoolId);
    const bookObjId = toObjectId(payload.bookId);

    // 1. Create issue record
    const issue = await LibraryIssue.create({
      ...payload,
      schoolId: schoolObjId,
      bookId: bookObjId,
      borrowerRefId: toObjectId(payload.borrowerRefId),
    });

    // 2. Decrement availableCopies in book atomically
    await LibraryBook.updateOne(
      { _id: bookObjId, schoolId: schoolObjId },
      {
        $inc: { availableCopies: -1 },
      }
    );

    return issue;
  }

  async returnIssue(schoolId, issueId, returnData) {
    const schoolObjId = toObjectId(schoolId);
    const issueObjId = toObjectId(issueId);

    const issue = await LibraryIssue.findOne({ schoolId: schoolObjId, _id: issueObjId });
    if (!issue) return null;

    // 1. Update issue record
    issue.returnDate = returnData.returnDate || new Date();
    issue.status = 'RETURNED';
    issue.fineAmount = Number(returnData.fineAmount) || 0;
    issue.fineStatus = returnData.fineStatus || (issue.fineAmount > 0 ? 'PAID' : 'NONE');
    issue.conditionOnReturn = returnData.conditionOnReturn || 'GOOD';
    if (returnData.remarks) issue.remarks = returnData.remarks;
    await issue.save();

    // 2. Increment availableCopies in book atomically
    await LibraryBook.updateOne(
      { _id: issue.bookId, schoolId: schoolObjId },
      {
        $inc: { availableCopies: 1 },
      }
    );

    return issue;
  }

  // Aggregate Stats
  async getLibraryStats(schoolId) {
    const schoolObjId = toObjectId(schoolId);

    const [bookAgg, issueAgg] = await Promise.all([
      LibraryBook.aggregate([
        { $match: { schoolId: schoolObjId } },
        {
          $group: {
            _id: null,
            totalTitles: { $sum: 1 },
            totalCopies: { $sum: '$totalCopies' },
            availableCopies: { $sum: '$availableCopies' },
          },
        },
      ]),
      LibraryIssue.aggregate([
        { $match: { schoolId: schoolObjId } },
        {
          $group: {
            _id: null,
            totalIssues: { $sum: 1 },
            activeIssued: {
              $sum: { $cond: [{ $eq: ['$status', 'ISSUED'] }, 1, 0] },
            },
            overdueCount: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $eq: ['$status', 'ISSUED'] },
                      { $lt: ['$dueDate', new Date()] },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            totalFinesCollected: {
              $sum: {
                $cond: [{ $eq: ['$fineStatus', 'PAID'] }, '$fineAmount', 0],
              },
            },
            totalPendingFines: {
              $sum: {
                $cond: [{ $eq: ['$fineStatus', 'PENDING'] }, '$fineAmount', 0],
              },
            },
          },
        },
      ]),
    ]);

    const b = bookAgg[0] || {};
    const i = issueAgg[0] || {};

    return {
      totalTitles: b.totalTitles || 0,
      totalCopies: b.totalCopies || 0,
      availableCopies: b.availableCopies || 0,
      issuedCopies: Math.max(0, (b.totalCopies || 0) - (b.availableCopies || 0)),
      totalIssues: i.totalIssues || 0,
      activeIssued: i.activeIssued || 0,
      overdueCount: i.overdueCount || 0,
      totalFinesCollected: i.totalFinesCollected || 0,
      totalPendingFines: i.totalPendingFines || 0,
    };
  }

  // Eligible Borrowers list (Students & Teachers)
  async getEligibleBorrowers(schoolId) {
    const schoolObjId = toObjectId(schoolId);

    const [students, teachers, staff] = await Promise.all([
      Student.find({ schoolId: schoolObjId, status: 'ACTIVE' })
        .select('_id admissionNumber enrollmentId firstName lastName rollNumber')
        .lean(),
      Teacher.find({ schoolId: schoolObjId, status: 'ACTIVE' })
        .select('_id employeeId personalDetails employmentDetails')
        .lean(),
      SchoolUser.find({ schoolId: schoolObjId, status: 'ACTIVE' })
        .select('_id employeeId name firstName lastName email role department')
        .lean(),
    ]);

    const formattedStudents = (students || []).map((s) => ({
      id: s._id.toString(),
      type: 'STUDENT',
      name: `${s.firstName || ''} ${s.lastName || ''}`.trim() || 'Student',
      code: s.admissionNumber || s.enrollmentId || 'STU',
      class: 'Student',
    }));

    const formattedTeachers = (teachers || []).map((t) => ({
      id: t._id.toString(),
      type: 'TEACHER',
      name: `${t.personalDetails?.firstName || ''} ${t.personalDetails?.lastName || ''}`.trim() || 'Teacher',
      code: t.employeeId || 'TCH',
      class: t.employmentDetails?.department || 'Academic Faculty',
    }));

    const formattedStaff = (staff || []).map((st) => ({
      id: st._id.toString(),
      type: 'STAFF',
      name: st.name || `${st.firstName || ''} ${st.lastName || ''}`.trim() || 'Staff',
      code: st.employeeId || 'STAFF',
      class: st.department || st.role || 'Staff',
    }));

    return [...formattedStudents, ...formattedTeachers, ...formattedStaff];
  }
}

export const libraryRepository = new LibraryRepository();
