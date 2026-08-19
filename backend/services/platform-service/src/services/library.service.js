import { AppError } from '../../../shared/AppError.js';
import { libraryRepository } from '../repositories/library.repository.js';

function requireText(value, label) {
  const text = typeof value === 'string' ? value.trim() : '';
  if (!text) throw new AppError(`${label} is required`, 400);
  return text;
}

function optionalText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

const DEFAULT_STARTER_BOOKS = [
  {
    title: 'Concepts of Physics (Vol 1)',
    author: 'Dr. H.C. Verma',
    isbn: '978-8177091878',
    bookCode: 'BK-PHY-01',
    category: 'SCIENCE',
    publisher: 'Bharti Bhawan',
    edition: '2025 Edition',
    rackNumber: 'A-1',
    shelfNumber: '1',
    totalCopies: 10,
    availableCopies: 10,
    price: 495,
    description: 'Foundation textbook in physics for secondary & senior secondary students.',
  },
  {
    title: 'Higher Algebra',
    author: 'Hall & Knight',
    isbn: '978-9351761501',
    bookCode: 'BK-MATH-02',
    category: 'MATHEMATICS',
    publisher: 'Arihant Publications',
    edition: 'Classical Series',
    rackNumber: 'A-2',
    shelfNumber: '2',
    totalCopies: 8,
    availableCopies: 8,
    price: 350,
    description: 'Comprehensive algebra problems and theoretical concepts.',
  },
  {
    title: 'A Brief History of Time',
    author: 'Stephen Hawking',
    isbn: '978-0553380163',
    bookCode: 'BK-SCI-03',
    category: 'SCIENCE',
    publisher: 'Bantam Books',
    edition: 'Updated Illustrated',
    rackNumber: 'B-1',
    shelfNumber: '1',
    totalCopies: 5,
    availableCopies: 5,
    price: 650,
    description: 'Landmark volume in cosmology, space-time, and modern astrophysics.',
  },
  {
    title: 'Gitanjali (Song Offerings)',
    author: 'Rabindranath Tagore',
    isbn: '978-8129118745',
    bookCode: 'BK-LIT-04',
    category: 'LITERATURE',
    publisher: 'Rupa Publications',
    edition: 'Nobel Centenary Edition',
    rackNumber: 'C-3',
    shelfNumber: '1',
    totalCopies: 6,
    availableCopies: 6,
    price: 295,
    description: 'Nobel prize-winning collection of poetry and spiritual literature.',
  },
  {
    title: 'Computer Science with Python',
    author: 'Sumita Arora',
    isbn: '978-9389599206',
    bookCode: 'BK-CS-05',
    category: 'COMPUTERS',
    publisher: 'Dhanpat Rai & Co',
    edition: 'Revised 2026',
    rackNumber: 'D-1',
    shelfNumber: '3',
    totalCopies: 12,
    availableCopies: 12,
    price: 580,
    description: 'Standard computer science reference for secondary curricula.',
  },
];

class LibraryService {
  async getStats(schoolId) {
    return libraryRepository.getLibraryStats(schoolId);
  }

  async listBooks(schoolId, query = {}) {
    let result = await libraryRepository.listBooks(schoolId, query);
    
    // Auto-seed starter books if catalog is empty and no query filters applied
    if (result.total === 0 && !query.search && (!query.category || query.category === 'ALL')) {
      for (const item of DEFAULT_STARTER_BOOKS) {
        await libraryRepository.createBook({
          schoolId,
          ...item,
          status: 'AVAILABLE',
        });
      }
      result = await libraryRepository.listBooks(schoolId, query);
    }

    return {
      data: result.items.map((b) => b.toPublicJSON()),
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / result.limit) || 1,
      },
    };
  }

  async getBook(schoolId, id) {
    const book = await libraryRepository.findBookById(schoolId, id);
    if (!book) throw new AppError('Library book not found', 404);
    return book.toPublicJSON();
  }

  async createBook(schoolId, payload = {}) {
    const title = requireText(payload.title, 'Book title');
    const author = requireText(payload.author, 'Author');
    const category = optionalText(payload.category) || 'GENERAL';
    const totalCopies = Math.max(1, Number(payload.totalCopies) || 1);
    const availableCopies = payload.availableCopies !== undefined ? Math.max(0, Number(payload.availableCopies)) : totalCopies;

    const book = await libraryRepository.createBook({
      schoolId,
      title,
      author,
      isbn: optionalText(payload.isbn),
      bookCode: optionalText(payload.bookCode),
      category: category.toUpperCase(),
      publisher: optionalText(payload.publisher),
      edition: optionalText(payload.edition),
      rackNumber: optionalText(payload.rackNumber),
      shelfNumber: optionalText(payload.shelfNumber),
      totalCopies,
      availableCopies,
      price: Math.max(0, Number(payload.price) || 0),
      description: optionalText(payload.description),
      status: availableCopies > 0 ? 'AVAILABLE' : 'OUT_OF_STOCK',
    });

    return book.toPublicJSON();
  }

  async updateBook(schoolId, id, payload = {}) {
    const book = await libraryRepository.findBookById(schoolId, id);
    if (!book) throw new AppError('Library book not found', 404);

    const updates = {};
    if (payload.title) updates.title = payload.title.trim();
    if (payload.author) updates.author = payload.author.trim();
    if (payload.isbn !== undefined) updates.isbn = optionalText(payload.isbn);
    if (payload.bookCode !== undefined) updates.bookCode = optionalText(payload.bookCode);
    if (payload.category) updates.category = payload.category.trim().toUpperCase();
    if (payload.publisher !== undefined) updates.publisher = optionalText(payload.publisher);
    if (payload.edition !== undefined) updates.edition = optionalText(payload.edition);
    if (payload.rackNumber !== undefined) updates.rackNumber = optionalText(payload.rackNumber);
    if (payload.shelfNumber !== undefined) updates.shelfNumber = optionalText(payload.shelfNumber);
    if (payload.price !== undefined) updates.price = Math.max(0, Number(payload.price) || 0);
    if (payload.description !== undefined) updates.description = optionalText(payload.description);

    if (payload.totalCopies !== undefined) {
      const newTotal = Math.max(1, Number(payload.totalCopies));
      const currentlyIssued = Math.max(0, book.totalCopies - book.availableCopies);
      updates.totalCopies = newTotal;
      updates.availableCopies = Math.max(0, newTotal - currentlyIssued);
      updates.status = updates.availableCopies > 0 ? 'AVAILABLE' : 'OUT_OF_STOCK';
    }

    const updated = await libraryRepository.updateBook(schoolId, id, updates);
    return updated.toPublicJSON();
  }

  async deleteBook(schoolId, id) {
    const book = await libraryRepository.findBookById(schoolId, id);
    if (!book) throw new AppError('Library book not found', 404);

    // Check if any copies are currently issued
    const activeIssues = await libraryRepository.listIssues(schoolId, { bookId: id, status: 'ISSUED' });
    if (activeIssues.total > 0) {
      throw new AppError('Cannot delete book while copies are currently issued to students/staff.', 400);
    }

    await libraryRepository.deleteBook(schoolId, id);
    return { message: 'Library book deleted successfully' };
  }

  // Issues / Circulation
  async listIssues(schoolId, query = {}) {
    const result = await libraryRepository.listIssues(schoolId, query);
    return {
      data: result.items.map((i) => i.toPublicJSON()),
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / result.limit) || 1,
      },
    };
  }

  async issueBook(schoolId, payload = {}) {
    const bookId = requireText(payload.bookId, 'Book');
    const borrowerRefId = requireText(payload.borrowerRefId, 'Borrower selection');
    const borrowerType = (payload.borrowerType || 'STUDENT').toUpperCase();

    // 1. Verify book availability
    const book = await libraryRepository.findBookById(schoolId, bookId);
    if (!book) throw new AppError('Selected book not found', 404);
    if (book.availableCopies <= 0) {
      throw new AppError(`"${book.title}" is currently out of stock (All copies issued).`, 400);
    }

    // 2. Check borrower active unreturned issues
    const activeBorrowerIssues = await libraryRepository.listIssues(schoolId, {
      borrowerRefId,
      status: 'ISSUED',
    });

    const maxAllowed = borrowerType === 'TEACHER' ? 5 : 3;
    if (activeBorrowerIssues.total >= maxAllowed) {
      throw new AppError(
        `Borrower already has ${activeBorrowerIssues.total} unreturned books (Limit: ${maxAllowed}). Please return an earlier book first.`,
        400
      );
    }

    // 3. Due Date calculation
    const issueDate = payload.issueDate ? new Date(payload.issueDate) : new Date();
    const durationDays = Math.max(1, Number(payload.durationDays) || 14);
    let dueDate = payload.dueDate ? new Date(payload.dueDate) : null;
    if (!dueDate || isNaN(dueDate.getTime())) {
      dueDate = new Date(issueDate);
      dueDate.setDate(dueDate.getDate() + durationDays);
    }

    const issue = await libraryRepository.createIssue({
      schoolId,
      bookId,
      bookTitle: book.title,
      bookCode: book.bookCode || `BK-${book._id.toString().slice(-4).toUpperCase()}`,
      borrowerType,
      borrowerRefId,
      borrowerName: requireText(payload.borrowerName, 'Borrower name'),
      borrowerCode: optionalText(payload.borrowerCode),
      borrowerClass: optionalText(payload.borrowerClass),
      issueDate,
      dueDate,
      status: 'ISSUED',
      remarks: optionalText(payload.remarks),
    });

    return issue.toPublicJSON();
  }

  async returnBook(schoolId, issueId, payload = {}) {
    const issue = await libraryRepository.findIssueById(schoolId, issueId);
    if (!issue) throw new AppError('Library loan record not found', 404);
    if (issue.status === 'RETURNED') {
      throw new AppError('This book has already been returned', 400);
    }

    const returnDate = payload.returnDate ? new Date(payload.returnDate) : new Date();
    let fineAmount = Number(payload.fineAmount);
    if (isNaN(fineAmount) || fineAmount < 0) {
      // Auto-calculate fine if late (e.g. ₹5 per day)
      if (returnDate > new Date(issue.dueDate)) {
        const diffTime = Math.max(0, returnDate - new Date(issue.dueDate));
        const overdueDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        fineAmount = overdueDays * 5;
      } else {
        fineAmount = 0;
      }
    }

    const fineStatus = fineAmount > 0 ? payload.fineStatus || 'PAID' : 'NONE';

    const updated = await libraryRepository.returnIssue(schoolId, issueId, {
      returnDate,
      fineAmount,
      fineStatus,
      conditionOnReturn: payload.conditionOnReturn || 'GOOD',
      remarks: payload.remarks,
    });

    return updated.toPublicJSON();
  }

  async getEligibleBorrowers(schoolId) {
    return libraryRepository.getEligibleBorrowers(schoolId);
  }
}

export const libraryService = new LibraryService();
