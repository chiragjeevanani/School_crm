import mongoose from 'mongoose';
import { LibraryTransaction } from '../models/LibraryTransaction.js';
import { LibraryIssue } from '../models/LibraryIssue.js';
import { LibraryBook } from '../models/LibraryBook.js';
import { BookCopy } from '../models/BookCopy.js';

function toObjectId(id) {
  if (!id) return null;
  if (id instanceof mongoose.Types.ObjectId) return id;
  try {
    return new mongoose.Types.ObjectId(id);
  } catch {
    return id;
  }
}

class LibraryTransactionRepository {
  async logTransaction(data) {
    return LibraryTransaction.create({
      ...data,
      schoolId: toObjectId(data.schoolId),
      issueId: data.issueId ? toObjectId(data.issueId) : null,
      bookId: toObjectId(data.bookId),
      copyId: data.copyId ? toObjectId(data.copyId) : null,
      borrowerRefId: toObjectId(data.borrowerRefId),
    });
  }

  async listTransactions(schoolId, query = {}) {
    const filter = { schoolId: toObjectId(schoolId) };

    if (query.type && query.type !== 'ALL') {
      if (query.type.includes(',')) {
        filter.type = { $in: query.type.split(',').map((t) => t.trim().toUpperCase()) };
      } else {
        filter.type = query.type.toUpperCase();
      }
    }

    if (query.bookId) {
      filter.bookId = toObjectId(query.bookId);
    }

    if (query.borrowerRefId) {
      filter.borrowerRefId = toObjectId(query.borrowerRefId);
    }

    if (query.startDate || query.endDate) {
      filter.performedAt = {};
      if (query.startDate) filter.performedAt.$gte = new Date(query.startDate);
      if (query.endDate) {
        const end = new Date(query.endDate);
        end.setHours(23, 59, 59, 999);
        filter.performedAt.$lte = end;
      }
    }

    if (query.search?.trim()) {
      const regex = new RegExp(query.search.trim(), 'i');
      filter.$or = [
        { bookTitle: regex },
        { accessionNumber: regex },
        { borrowerName: regex },
        { borrowerCode: regex },
        { performedBy: regex },
        { details: regex },
      ];
    }

    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(200, Math.max(1, Number(query.limit) || 50));
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      LibraryTransaction.find(filter)
        .sort({ performedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit),
      LibraryTransaction.countDocuments(filter),
    ]);

    return {
      items,
      total,
      page,
      limit,
    };
  }

  // Aggregation for Most Issued Books
  async getMostIssuedBooks(schoolId, limit = 10) {
    const schoolObjId = toObjectId(schoolId);

    const agg = await LibraryIssue.aggregate([
      { $match: { schoolId: schoolObjId } },
      {
        $group: {
          _id: '$bookId',
          bookTitle: { $first: '$bookTitle' },
          bookCode: { $first: '$bookCode' },
          borrowerType: { $last: '$borrowerType' },
          totalIssues: { $sum: 1 },
          lastIssuedAt: { $max: '$issueDate' },
        },
      },
      { $sort: { totalIssues: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'librarybooks',
          localField: '_id',
          foreignField: '_id',
          as: 'bookInfo',
        },
      },
      {
        $project: {
          bookId: '$_id',
          title: { $ifNull: [{ $arrayElemAt: ['$bookInfo.title', 0] }, '$bookTitle'] },
          author: { $ifNull: [{ $arrayElemAt: ['$bookInfo.author', 0] }, ''] },
          category: { $ifNull: [{ $arrayElemAt: ['$bookInfo.category', 0] }, 'GENERAL'] },
          bookCode: { $ifNull: [{ $arrayElemAt: ['$bookInfo.bookCode', 0] }, '$bookCode'] },
          totalIssues: 1,
          lastIssuedAt: 1,
        },
      },
    ]);

    return agg;
  }

  // Monthly Issue / Return stats (Trend chart)
  async getIssueReturnTrend(schoolId, months = 6) {
    const schoolObjId = toObjectId(schoolId);
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    const issues = await LibraryTransaction.aggregate([
      {
        $match: {
          schoolId: schoolObjId,
          performedAt: { $gte: startDate },
          type: { $in: ['ISSUE', 'RETURN', 'RENEW'] },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$performedAt' },
            month: { $month: '$performedAt' },
            type: '$type',
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    return issues;
  }

  // Fine collection trend
  async getFineTrend(schoolId, months = 6) {
    const schoolObjId = toObjectId(schoolId);
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    const fines = await LibraryIssue.aggregate([
      {
        $match: {
          schoolId: schoolObjId,
          returnDate: { $gte: startDate },
          fineAmount: { $gt: 0 },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$returnDate' },
            month: { $month: '$returnDate' },
            fineStatus: '$fineStatus',
          },
          totalAmount: { $sum: '$fineAmount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    return fines;
  }
}

export const libraryTransactionRepository = new LibraryTransactionRepository();
