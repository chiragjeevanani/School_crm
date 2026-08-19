import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useToast } from '../../components/ui/Toast';
import { useSchoolAdminAuth } from '../../context/SchoolAdminAuthContext';
import { libraryPortalApi } from '../../../../shared/api/client';
import { apiMessage } from '../academics/utils';
import {
  AlertCircle,
  AlertTriangle,
  BookMarked,
  BookOpen,
  BookmarkCheck,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Coins,
  Download,
  FileCheck,
  FileSpreadsheet,
  FileText,
  Filter,
  GraduationCap,
  Layers,
  LayoutGrid,
  Library,
  List,
  Loader2,
  Pencil,
  Plus,
  Printer,
  RefreshCw,
  Search,
  Sparkles,
  Tag,
  Trash2,
  UserCheck,
  Users,
  XCircle,
} from 'lucide-react';
import { SkeletonTable } from '../../components/ui/SkeletonLoader';

const inputClass =
  'h-11 w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 text-xs font-semibold outline-none focus:border-primary focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white';

const CATEGORIES = [
  { id: 'ALL', label: 'All Categories' },
  { id: 'SCIENCE', label: 'Science' },
  { id: 'MATHEMATICS', label: 'Mathematics' },
  { id: 'LITERATURE', label: 'Literature & Fiction' },
  { id: 'LANGUAGES', label: 'Languages (English/Hindi)' },
  { id: 'SOCIAL_SCIENCE', label: 'Social Science & History' },
  { id: 'COMPUTERS', label: 'Computers & IT' },
  { id: 'GENERAL', label: 'General Knowledge' },
  { id: 'REFERENCE', label: 'Reference & Encyclopedia' },
  { id: 'OTHER', label: 'Other' },
];

const CATEGORY_COLORS = {
  SCIENCE: 'primary',
  MATHEMATICS: 'info',
  LITERATURE: 'purple',
  LANGUAGES: 'warning',
  SOCIAL_SCIENCE: 'default',
  COMPUTERS: 'info',
  GENERAL: 'default',
  REFERENCE: 'primary',
  OTHER: 'default',
};

function formatDisplayDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function exportToCSV(filename, rows) {
  if (!rows || !rows.length) return;
  const processRow = (row) =>
    row
      .map((val) => {
        if (val === null || val === undefined) return '""';
        return `"${String(val).replace(/"/g, '""')}"`;
      })
      .join(',');

  const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(processRow).join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export const LibraryManagement = () => {
  const { showToast, ToastComponent } = useToast();
  const { user } = useSchoolAdminAuth();
  const schoolName = user?.schoolName || 'Greenfield Public School';

  // Active Tab: 'books' | 'issues' | 'overdue'
  const [activeTab, setActiveTab] = useState('books');

  // Stats State
  const [stats, setStats] = useState({
    totalTitles: 0,
    totalCopies: 0,
    availableCopies: 0,
    issuedCopies: 0,
    totalIssues: 0,
    activeIssued: 0,
    overdueCount: 0,
    totalFinesCollected: 0,
    totalPendingFines: 0,
  });

  // Books State
  const [books, setBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [bookSearch, setBookSearch] = useState('');
  const [bookCategoryFilter, setBookCategoryFilter] = useState('ALL');
  const [bookStatusFilter, setBookStatusFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'

  // Issues State
  const [issues, setIssues] = useState([]);
  const [loadingIssues, setLoadingIssues] = useState(false);
  const [issueSearch, setIssueSearch] = useState('');
  const [issueStatusFilter, setIssueStatusFilter] = useState('ALL');

  // Eligible Borrowers list (for autocomplete)
  const [borrowers, setBorrowers] = useState([]);
  const [loadingBorrowers, setLoadingBorrowers] = useState(false);

  // Modals Control
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [savingBook, setSavingBook] = useState(false);
  const [deleteBookTarget, setDeleteBookTarget] = useState(null);

  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [savingIssue, setSavingIssue] = useState(false);

  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [savingReturn, setSavingReturn] = useState(false);

  // Receipt Modal
  const [returnReceiptOpen, setReturnReceiptOpen] = useState(false);
  const [returnedRecord, setReturnedRecord] = useState(null);

  // Book Form State
  const [bookForm, setBookForm] = useState({
    title: '',
    author: '',
    isbn: '',
    bookCode: '',
    category: 'SCIENCE',
    publisher: '',
    edition: '',
    rackNumber: '',
    shelfNumber: '',
    totalCopies: 5,
    price: '',
    description: '',
  });

  // Issue Form State
  const [issueForm, setIssueForm] = useState({
    bookId: '',
    borrowerRefId: '',
    borrowerType: 'STUDENT',
    borrowerName: '',
    borrowerCode: '',
    borrowerClass: '',
    durationDays: 14,
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    remarks: '',
  });

  // Return Form State
  const [returnForm, setReturnForm] = useState({
    returnDate: new Date().toISOString().split('T')[0],
    fineAmount: 0,
    fineStatus: 'PAID',
    conditionOnReturn: 'GOOD',
    remarks: '',
  });

  // Load Library Stats
  const loadStats = useCallback(async () => {
    try {
      const res = await libraryPortalApi.stats();
      if (res.data) setStats(res.data);
    } catch {
      // ignore
    }
  }, []);

  // Load Books Catalog
  const loadBooks = useCallback(async () => {
    setLoadingBooks(true);
    try {
      const res = await libraryPortalApi.books({
        category: bookCategoryFilter !== 'ALL' ? bookCategoryFilter : undefined,
        status: bookStatusFilter !== 'ALL' ? bookStatusFilter : undefined,
        search: bookSearch.trim() || undefined,
        limit: 150,
      });
      setBooks(res.data || []);
    } catch (err) {
      showToast(apiMessage(err, 'Failed to load books catalog'), 'error');
    } finally {
      setLoadingBooks(false);
    }
  }, [bookCategoryFilter, bookStatusFilter, bookSearch, showToast]);

  // Load Issues
  const loadIssues = useCallback(async () => {
    setLoadingIssues(true);
    try {
      const res = await libraryPortalApi.issues({
        status: issueStatusFilter !== 'ALL' ? issueStatusFilter : undefined,
        search: issueSearch.trim() || undefined,
        limit: 150,
      });
      setIssues(res.data || []);
    } catch (err) {
      showToast(apiMessage(err, 'Failed to load loan records'), 'error');
    } finally {
      setLoadingIssues(false);
    }
  }, [issueStatusFilter, issueSearch, showToast]);

  // Load Borrowers
  const loadBorrowers = useCallback(async () => {
    setLoadingBorrowers(true);
    try {
      const res = await libraryPortalApi.borrowers();
      setBorrowers(res.data || []);
    } catch {
      // ignore
    } finally {
      setLoadingBorrowers(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
    loadBorrowers();
  }, [loadStats, loadBorrowers]);

  useEffect(() => {
    if (activeTab === 'books') {
      loadBooks();
    } else {
      loadIssues();
    }
  }, [activeTab, loadBooks, loadIssues]);

  // Handle Book Modal Open
  const handleOpenAddBook = () => {
    setEditingBook(null);
    setBookForm({
      title: '',
      author: '',
      isbn: '',
      bookCode: '',
      category: 'SCIENCE',
      publisher: '',
      edition: '',
      rackNumber: '',
      shelfNumber: '',
      totalCopies: 5,
      price: '',
      description: '',
    });
    setBookModalOpen(true);
  };

  const handleOpenEditBook = (book) => {
    setEditingBook(book);
    setBookForm({
      title: book.title || '',
      author: book.author || '',
      isbn: book.isbn || '',
      bookCode: book.bookCode || '',
      category: book.category || 'SCIENCE',
      publisher: book.publisher || '',
      edition: book.edition || '',
      rackNumber: book.rackNumber || '',
      shelfNumber: book.shelfNumber || '',
      totalCopies: book.totalCopies || 1,
      price: book.price || '',
      description: book.description || '',
    });
    setBookModalOpen(true);
  };

  // Submit Add / Edit Book
  const handleSaveBook = async (e) => {
    e.preventDefault();
    setSavingBook(true);
    try {
      if (editingBook) {
        await libraryPortalApi.updateBook(editingBook.id, bookForm);
        showToast('Library book updated successfully', 'success');
      } else {
        await libraryPortalApi.createBook(bookForm);
        showToast('New book added to library catalog', 'success');
      }
      setBookModalOpen(false);
      setEditingBook(null);
      loadBooks();
      loadStats();
    } catch (err) {
      showToast(apiMessage(err, 'Failed to save library book'), 'error');
    } finally {
      setSavingBook(false);
    }
  };

  // Delete Book
  const handleConfirmDeleteBook = async () => {
    if (!deleteBookTarget) return;
    try {
      await libraryPortalApi.deleteBook(deleteBookTarget.id);
      showToast('Book removed from library catalog', 'success');
      loadBooks();
      loadStats();
    } catch (err) {
      showToast(apiMessage(err, 'Failed to delete book'), 'error');
    } finally {
      setDeleteBookTarget(null);
    }
  };

  // Open Issue Modal
  const handleOpenIssueModal = (preselectedBook = null) => {
    const today = new Date().toISOString().split('T')[0];
    const due = new Date();
    due.setDate(due.getDate() + 14);

    setIssueForm({
      bookId: preselectedBook ? preselectedBook.id : (books.find((b) => b.availableCopies > 0)?.id || ''),
      borrowerRefId: borrowers[0]?.id || '',
      borrowerType: borrowers[0]?.type || 'STUDENT',
      borrowerName: borrowers[0]?.name || '',
      borrowerCode: borrowers[0]?.code || '',
      borrowerClass: borrowers[0]?.class || '',
      durationDays: 14,
      issueDate: today,
      dueDate: due.toISOString().split('T')[0],
      remarks: '',
    });
    setIssueModalOpen(true);
  };

  const handleBorrowerSelect = (borrowerId) => {
    const target = borrowers.find((b) => b.id === borrowerId);
    if (!target) return;
    setIssueForm((prev) => ({
      ...prev,
      borrowerRefId: target.id,
      borrowerType: target.type,
      borrowerName: target.name,
      borrowerCode: target.code,
      borrowerClass: target.class,
    }));
  };

  const handleDurationChange = (days) => {
    const issueDate = new Date(issueForm.issueDate || new Date());
    const due = new Date(issueDate);
    due.setDate(due.getDate() + Number(days));
    setIssueForm((prev) => ({
      ...prev,
      durationDays: Number(days),
      dueDate: due.toISOString().split('T')[0],
    }));
  };

  // Submit Issue
  const handleSaveIssue = async (e) => {
    e.preventDefault();
    if (!issueForm.bookId) {
      showToast('Please select a book to issue', 'error');
      return;
    }
    if (!issueForm.borrowerRefId) {
      showToast('Please select a borrower student or teacher', 'error');
      return;
    }

    setSavingIssue(true);
    try {
      await libraryPortalApi.issueBook(issueForm);
      showToast(`Book issued to ${issueForm.borrowerName}`, 'success');
      setIssueModalOpen(false);
      loadBooks();
      loadIssues();
      loadStats();
    } catch (err) {
      showToast(apiMessage(err, 'Failed to issue book'), 'error');
    } finally {
      setSavingIssue(false);
    }
  };

  // Open Return Modal
  const handleOpenReturnModal = (issue) => {
    setSelectedIssue(issue);
    const today = new Date();
    const returnDateStr = today.toISOString().split('T')[0];

    // Compute overdue fine (₹5 per late day)
    let fine = 0;
    if (issue.dueDate && today > new Date(issue.dueDate)) {
      const diffTime = Math.max(0, today - new Date(issue.dueDate));
      const overdueDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      fine = overdueDays * 5;
    }

    setReturnForm({
      returnDate: returnDateStr,
      fineAmount: fine,
      fineStatus: fine > 0 ? 'PAID' : 'NONE',
      conditionOnReturn: 'GOOD',
      remarks: '',
    });
    setReturnModalOpen(true);
  };

  // Submit Return
  const handleSaveReturn = async (e) => {
    e.preventDefault();
    if (!selectedIssue) return;

    setSavingReturn(true);
    try {
      const res = await libraryPortalApi.returnBook(selectedIssue.id, returnForm);
      showToast(`Book returned successfully`, 'success');
      setReturnModalOpen(false);
      setReturnedRecord(res.data);
      loadBooks();
      loadIssues();
      loadStats();
      if (res.data?.fineAmount > 0) {
        setReturnReceiptOpen(true);
      }
    } catch (err) {
      showToast(apiMessage(err, 'Failed to process return'), 'error');
    } finally {
      setSavingReturn(false);
    }
  };

  // Export CSV Handler
  const handleExportCSV = () => {
    if (activeTab === 'books') {
      const rows = [
        ['Book Code', 'Title', 'Author', 'ISBN', 'Category', 'Rack', 'Shelf', 'Total Copies', 'Available Copies', 'Price'],
        ...books.map((b) => [
          b.bookCode,
          b.title,
          b.author,
          b.isbn,
          b.category,
          b.rackNumber,
          b.shelfNumber,
          b.totalCopies,
          b.availableCopies,
          b.price,
        ]),
      ];
      exportToCSV(`library_catalog_${new Date().toISOString().split('T')[0]}.csv`, rows);
      showToast('Library catalog CSV exported', 'success');
    } else {
      const rows = [
        ['Book Code', 'Book Title', 'Borrower Type', 'Borrower Name', 'Borrower Code', 'Class/Dept', 'Issue Date', 'Due Date', 'Return Date', 'Status', 'Fine (₹)', 'Fine Status'],
        ...issues.map((i) => [
          i.bookCode,
          i.bookTitle,
          i.borrowerType,
          i.borrowerName,
          i.borrowerCode,
          i.borrowerClass,
          formatDisplayDate(i.issueDate),
          formatDisplayDate(i.dueDate),
          i.returnDate ? formatDisplayDate(i.returnDate) : '—',
          i.status,
          i.fineAmount,
          i.fineStatus,
        ]),
      ];
      exportToCSV(`library_circulation_report_${new Date().toISOString().split('T')[0]}.csv`, rows);
      showToast('Circulation report CSV exported', 'success');
    }
  };

  // Overdue Filtered list for Tab 3
  const overdueIssuesList = useMemo(() => {
    return issues.filter((i) => i.status === 'OVERDUE' || (i.fineAmount > 0 && i.fineStatus === 'PENDING'));
  }, [issues]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Library Inventory & Circulation"
        subtitle="Catalog book titles, track shelf stock, issue borrowings to students and teachers, and manage returns & overdue fines."
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              title="Export to CSV"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              type="button"
              onClick={() => handleOpenIssueModal()}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-indigo-700"
            >
              <BookmarkCheck className="h-3.5 w-3.5" />
              <span>Issue Book</span>
            </button>

            <button
              type="button"
              onClick={handleOpenAddBook}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-primary/90"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add New Book</span>
            </button>
          </div>
        }
      />

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {/* Total Titles */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Catalog Titles</span>
            <BookOpen className="h-4 w-4 text-primary" />
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            {stats.totalTitles}
          </p>
          <span className="mt-0.5 text-[11px] font-semibold text-slate-400">
            {stats.totalCopies} Total physical copies
          </span>
        </div>

        {/* Currently Issued */}
        <div className="rounded-2xl border border-indigo-200/80 bg-indigo-50/40 p-4 shadow-sm dark:border-indigo-900/50 dark:bg-indigo-950/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">
              Currently Borrowed
            </span>
            <BookmarkCheck className="h-4 w-4 text-indigo-500" />
          </div>
          <p className="mt-2 text-2xl font-black text-indigo-600 dark:text-indigo-400">
            {stats.activeIssued}
          </p>
          <span className="mt-0.5 text-[11px] font-semibold text-indigo-600/80">
            Active student & teacher loans
          </span>
        </div>

        {/* Available on Shelves */}
        <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/40 p-4 shadow-sm dark:border-emerald-900/50 dark:bg-emerald-950/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
              Available on Shelves
            </span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {stats.availableCopies}
          </p>
          <span className="mt-0.5 text-[11px] font-semibold text-emerald-600/80">
            Ready for instant issue
          </span>
        </div>

        {/* Overdue Loans */}
        <div className="rounded-2xl border border-rose-200/80 bg-rose-50/40 p-4 shadow-sm dark:border-rose-900/50 dark:bg-rose-950/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-700 dark:text-rose-300">
              Overdue Returns
            </span>
            <Clock className="h-4 w-4 text-rose-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-2xl font-black text-rose-600 dark:text-rose-400">
              {stats.overdueCount}
            </p>
            {stats.totalFinesCollected > 0 && (
              <span className="text-xs font-bold text-emerald-600">
                (₹{stats.totalFinesCollected} collected)
              </span>
            )}
          </div>
          <span className="mt-0.5 text-[11px] font-semibold text-rose-600/80">
            Past due return date
          </span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200/80 pb-3 dark:border-slate-800">
        {[
          { id: 'books', label: 'Books Catalog & Inventory', icon: BookOpen, count: books.length },
          { id: 'issues', label: 'Active Loans & Circulation', icon: BookmarkCheck, count: issues.length },
          { id: 'overdue', label: 'Overdue & Fine Registry', icon: Clock, count: stats.overdueCount },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition shadow-sm ${
                isActive
                  ? 'bg-primary text-white shadow-primary/20'
                  : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: BOOKS CATALOG & INVENTORY */}
      {activeTab === 'books' && (
        <div className="space-y-4">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Search */}
              <div className="relative min-w-[220px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={bookSearch}
                  onChange={(e) => setBookSearch(e.target.value)}
                  placeholder="Search book title, author, ISBN..."
                  className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50/80 pl-8 pr-3 text-xs font-semibold outline-none focus:border-primary focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                />
              </div>

              {/* Category Dropdown */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-400">Category:</span>
                <select
                  value={bookCategoryFilter}
                  onChange={(e) => setBookCategoryFilter(e.target.value)}
                  className="h-9 rounded-xl border border-slate-200 bg-slate-50/80 px-2.5 text-xs font-bold text-slate-800 outline-none focus:border-primary focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Stock Status Filter */}
              <select
                value={bookStatusFilter}
                onChange={(e) => setBookStatusFilter(e.target.value)}
                className="h-9 rounded-xl border border-slate-200 bg-slate-50/80 px-2.5 text-xs font-bold text-slate-800 outline-none focus:border-primary focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white cursor-pointer"
              >
                <option value="ALL">All Stock Statuses</option>
                <option value="AVAILABLE">Available on Shelf</option>
                <option value="OUT_OF_STOCK">Out of Stock</option>
              </select>
            </div>

            {/* View Mode & Actions */}
            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-xl bg-slate-100 p-1 dark:bg-slate-950">
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={`rounded-lg p-1.5 transition ${
                    viewMode === 'table'
                      ? 'bg-white text-primary shadow-sm dark:bg-slate-900 dark:text-white'
                      : 'text-slate-400 hover:text-slate-700'
                  }`}
                  title="Table View"
                >
                  <List className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`rounded-lg p-1.5 transition ${
                    viewMode === 'grid'
                      ? 'bg-white text-primary shadow-sm dark:bg-slate-900 dark:text-white'
                      : 'text-slate-400 hover:text-slate-700'
                  }`}
                  title="Grid Cards View"
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                </button>
              </div>

              <button
                type="button"
                onClick={loadBooks}
                className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                title="Refresh Catalog"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loadingBooks ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Books List View */}
          {loadingBooks ? (
            <SkeletonTable rows={6} columns={6} />
          ) : books.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <BookOpen className="h-10 w-10 text-slate-300 dark:text-slate-700" />
              <h4 className="mt-3 text-sm font-bold text-slate-700 dark:text-slate-200">
                No Library Books Found
              </h4>
              <p className="mt-1 text-xs text-slate-400 max-w-sm">
                Add book titles (Physics, Mathematics, Literature, Encyclopedias) to build the school library catalog.
              </p>
              <button
                type="button"
                onClick={handleOpenAddBook}
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-primary/90"
              >
                <Plus className="h-3.5 w-3.5" /> Add First Book
              </button>
            </div>
          ) : viewMode === 'table' ? (
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-100 bg-slate-50/70 text-slate-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
                    <tr>
                      <th className="px-4 py-3 font-bold">Book Title & Code</th>
                      <th className="px-3 py-3 font-bold">Author / Publisher</th>
                      <th className="px-3 py-3 font-bold">Category</th>
                      <th className="px-3 py-3 font-bold">Shelf / Location</th>
                      <th className="px-3 py-3 text-center font-bold">Copies Available</th>
                      <th className="px-4 py-3 text-right font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {books.map((b) => (
                      <tr
                        key={b.id}
                        className="group transition hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                      >
                        {/* Title & Code */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 font-bold text-indigo-600 dark:text-indigo-400">
                              <BookOpen className="h-4 w-4" />
                            </div>
                            <div>
                              <span className="font-bold text-slate-900 dark:text-white">
                                {b.title}
                              </span>
                              <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
                                <span>{b.bookCode}</span>
                                {b.isbn && <span>• ISBN: {b.isbn}</span>}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Author */}
                        <td className="px-3 py-3.5">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {b.author}
                          </span>
                          {b.publisher && (
                            <span className="block text-[11px] text-slate-400">
                              {b.publisher}
                            </span>
                          )}
                        </td>

                        {/* Category */}
                        <td className="px-3 py-3.5">
                          <Badge variant={CATEGORY_COLORS[b.category] || 'default'}>
                            {b.category}
                          </Badge>
                        </td>

                        {/* Location */}
                        <td className="px-3 py-3.5 font-medium text-slate-600 dark:text-slate-300">
                          {b.rackNumber || b.shelfNumber
                            ? `Rack ${b.rackNumber || '—'} / Shelf ${b.shelfNumber || '—'}`
                            : '—'}
                        </td>

                        {/* Stock Status with Mini Bar */}
                        <td className="px-3 py-3.5 text-center">
                          <div className="inline-flex flex-col items-center">
                            <span
                              className={`font-black ${
                                b.availableCopies > 0 ? 'text-emerald-600' : 'text-rose-600'
                              }`}
                            >
                              {b.availableCopies} / {b.totalCopies}
                            </span>
                            <div className="mt-1 h-1.5 w-16 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                              <div
                                className={`h-full ${
                                  b.availableCopies > 0 ? 'bg-emerald-500' : 'bg-rose-500'
                                }`}
                                style={{
                                  width: `${Math.round(
                                    (b.availableCopies / (b.totalCopies || 1)) * 100
                                  )}%`,
                                }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3.5 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            {b.availableCopies > 0 && (
                              <button
                                type="button"
                                onClick={() => handleOpenIssueModal(b)}
                                className="inline-flex items-center gap-1 rounded-xl bg-indigo-50 px-2.5 py-1.5 text-xs font-bold text-indigo-700 transition hover:bg-indigo-600 hover:text-white dark:bg-indigo-950/50 dark:text-indigo-300"
                                title="Issue Book"
                              >
                                <BookmarkCheck className="h-3.5 w-3.5" />
                                <span>Issue</span>
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => handleOpenEditBook(b)}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:border-primary hover:text-primary dark:border-slate-800 dark:text-slate-300"
                              title="Edit Book Details"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => setDeleteBookTarget(b)}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:border-rose-300 hover:text-rose-600 dark:border-slate-800"
                              title="Delete Book"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Grid View */
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {books.map((b) => (
                <div
                  key={b.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 font-bold text-indigo-600 dark:text-indigo-400">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <Badge variant={CATEGORY_COLORS[b.category] || 'default'}>
                      {b.category}
                    </Badge>
                  </div>

                  <h4 className="mt-3 font-bold text-slate-900 dark:text-white line-clamp-1">
                    {b.title}
                  </h4>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    By {b.author}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs dark:border-slate-800">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Location</span>
                      <p className="font-semibold text-slate-700 dark:text-slate-300">
                        {b.rackNumber ? `Rack ${b.rackNumber}` : '—'}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Available</span>
                      <p
                        className={`font-black ${
                          b.availableCopies > 0 ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {b.availableCopies} / {b.totalCopies}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-end gap-1.5 border-t border-slate-100 pt-3 dark:border-slate-800">
                    {b.availableCopies > 0 && (
                      <button
                        type="button"
                        onClick={() => handleOpenIssueModal(b)}
                        className="inline-flex items-center gap-1 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700"
                      >
                        <BookmarkCheck className="h-3 w-3" /> Issue
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleOpenEditBook(b)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:border-primary hover:text-primary dark:border-slate-800"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteBookTarget(b)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:border-rose-300 hover:text-rose-600 dark:border-slate-800"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ACTIVE LOANS & CIRCULATION */}
      {activeTab === 'issues' && (
        <div className="space-y-4">
          {/* Issues Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative min-w-[240px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={issueSearch}
                  onChange={(e) => setIssueSearch(e.target.value)}
                  placeholder="Search borrower or book title..."
                  className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50/80 pl-8 pr-3 text-xs font-semibold outline-none focus:border-primary focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                />
              </div>

              <div className="flex items-center rounded-xl bg-slate-100 p-1 dark:bg-slate-950">
                {[
                  { id: 'ALL', label: 'All Records' },
                  { id: 'ISSUED', label: 'Active Loans' },
                  { id: 'OVERDUE', label: 'Overdue' },
                  { id: 'RETURNED', label: 'Returned' },
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setIssueStatusFilter(st.id)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                      issueStatusFilter === st.id
                        ? 'bg-white text-primary shadow-sm dark:bg-slate-900 dark:text-white'
                        : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleOpenIssueModal()}
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700"
              >
                <BookmarkCheck className="h-3.5 w-3.5" /> Issue Book
              </button>

              <button
                type="button"
                onClick={loadIssues}
                className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                title="Refresh Circulation"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loadingIssues ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Issues Table */}
          {loadingIssues ? (
            <SkeletonTable rows={5} columns={6} />
          ) : issues.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <BookmarkCheck className="h-10 w-10 text-slate-300 dark:text-slate-700" />
              <h4 className="mt-3 text-sm font-bold text-slate-700 dark:text-slate-200">
                No Book Circulation Logs Found
              </h4>
              <p className="mt-1 text-xs text-slate-400 max-w-sm">
                Issue library books to enrolled students or faculty members to begin circulation tracking.
              </p>
              <button
                type="button"
                onClick={() => handleOpenIssueModal()}
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-700"
              >
                <BookmarkCheck className="h-3.5 w-3.5" /> Issue First Book
              </button>
            </div>
          ) : (
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-100 bg-slate-50/70 text-slate-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
                    <tr>
                      <th className="px-4 py-3 font-bold">Circulated Book</th>
                      <th className="px-4 py-3 font-bold">Borrower Member</th>
                      <th className="px-3 py-3 font-bold">Issue Date</th>
                      <th className="px-3 py-3 font-bold">Due Return Date</th>
                      <th className="px-3 py-3 text-center font-bold">Status</th>
                      <th className="px-4 py-3 text-right font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {issues.map((i) => {
                      const isOverdue = i.status === 'OVERDUE';
                      const isReturned = i.status === 'RETURNED';

                      return (
                        <tr
                          key={i.id}
                          className="group transition hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                        >
                          {/* Book */}
                          <td className="px-4 py-3.5">
                            <span className="font-bold text-slate-900 dark:text-white">
                              {i.bookTitle}
                            </span>
                            <span className="block font-mono text-[11px] text-slate-400">
                              {i.bookCode}
                            </span>
                          </td>

                          {/* Borrower */}
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 dark:text-white">
                                {i.borrowerName}
                              </span>
                              <Badge
                                variant={i.borrowerType === 'TEACHER' ? 'primary' : 'info'}
                                className="text-[10px]"
                              >
                                {i.borrowerType}
                              </Badge>
                            </div>
                            <span className="text-[11px] text-slate-400">
                              {i.borrowerCode} • {i.borrowerClass || '—'}
                            </span>
                          </td>

                          {/* Dates */}
                          <td className="px-3 py-3.5 text-slate-600 dark:text-slate-300">
                            {formatDisplayDate(i.issueDate)}
                          </td>

                          <td className="px-3 py-3.5">
                            <span
                              className={`font-semibold ${
                                isOverdue ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              {formatDisplayDate(i.dueDate)}
                            </span>
                            {isOverdue && i.overdueDays > 0 && (
                              <span className="block text-[10px] font-bold text-rose-500">
                                ({i.overdueDays} days late)
                              </span>
                            )}
                          </td>

                          {/* Status */}
                          <td className="px-3 py-3.5 text-center">
                            <Badge
                              variant={
                                isReturned
                                  ? 'success'
                                  : isOverdue
                                  ? 'danger'
                                  : 'warning'
                              }
                            >
                              {i.status}
                            </Badge>
                          </td>

                          {/* Action */}
                          <td className="px-4 py-3.5 text-right">
                            {!isReturned ? (
                              <button
                                type="button"
                                onClick={() => handleOpenReturnModal(i)}
                                className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                <span>Return Book</span>
                              </button>
                            ) : (
                              <span className="text-[11px] font-semibold text-emerald-600">
                                Returned on {formatDisplayDate(i.returnDate)}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: OVERDUE & FINE REGISTRY */}
      {activeTab === 'overdue' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-4 text-xs dark:border-amber-900/40 dark:bg-amber-950/20">
            <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
              <Coins className="h-4 w-4 text-amber-600" />
              <span>Library Overdue Fine Policy</span>
            </div>
            <p className="mt-1 text-slate-600 dark:text-slate-400">
              Standard overdue fine is charged at <strong>₹5 per day</strong> after the designated Due Date.
              Admins can collect the fine upon return or waive it.
            </p>
          </div>

          {overdueIssuesList.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto" />
              <h4 className="mt-3 text-sm font-bold text-slate-700 dark:text-slate-200">
                No Overdue Books!
              </h4>
              <p className="mt-1 text-xs text-slate-400">
                All borrowed library books are within their active loan period.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-100 bg-slate-50/70 text-slate-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
                    <tr>
                      <th className="px-4 py-3 font-bold">Borrower Name</th>
                      <th className="px-4 py-3 font-bold">Book Title</th>
                      <th className="px-3 py-3 font-bold">Due Date</th>
                      <th className="px-3 py-3 font-bold">Days Late</th>
                      <th className="px-3 py-3 font-bold">Fine Accrued</th>
                      <th className="px-4 py-3 text-right font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {overdueIssuesList.map((i) => {
                      const lateDays = i.overdueDays || 1;
                      const calculatedFine = lateDays * 5;

                      return (
                        <tr key={i.id} className="transition hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                          <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-white">
                            {i.borrowerName} ({i.borrowerCode})
                          </td>
                          <td className="px-4 py-3.5 font-semibold text-slate-800 dark:text-slate-200">
                            {i.bookTitle}
                          </td>
                          <td className="px-3 py-3.5 text-rose-600 font-semibold">
                            {formatDisplayDate(i.dueDate)}
                          </td>
                          <td className="px-3 py-3.5 font-bold text-rose-600">
                            {lateDays} Days
                          </td>
                          <td className="px-3 py-3.5 font-black text-rose-600">
                            ₹{calculatedFine}
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <button
                              type="button"
                              onClick={() => handleOpenReturnModal(i)}
                              className="inline-flex items-center gap-1 rounded-xl bg-primary px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-primary/90"
                            >
                              <Coins className="h-3.5 w-3.5" /> Return & Collect
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ADD / EDIT BOOK MODAL */}
      <Modal
        isOpen={bookModalOpen}
        onClose={() => setBookModalOpen(false)}
        title={editingBook ? 'Edit Library Book' : 'Add New Book to Catalog'}
        size="lg"
      >
        <form onSubmit={handleSaveBook} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                Book Title *
              </label>
              <input
                type="text"
                value={bookForm.title}
                onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
                placeholder="e.g. Concepts of Physics Vol 1"
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                Author *
              </label>
              <input
                type="text"
                value={bookForm.author}
                onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
                placeholder="e.g. Dr. H.C. Verma"
                required
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                Subject Category *
              </label>
              <select
                value={bookForm.category}
                onChange={(e) => setBookForm({ ...bookForm, category: e.target.value })}
                className={inputClass}
              >
                {CATEGORIES.filter((c) => c.id !== 'ALL').map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                ISBN Number
              </label>
              <input
                type="text"
                value={bookForm.isbn}
                onChange={(e) => setBookForm({ ...bookForm, isbn: e.target.value })}
                placeholder="978-8177091878"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                Book Code / Accession #
              </label>
              <input
                type="text"
                value={bookForm.bookCode}
                onChange={(e) => setBookForm({ ...bookForm, bookCode: e.target.value.toUpperCase() })}
                placeholder="BK-PHY-01"
                className={`${inputClass} font-mono uppercase`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                Total Copies *
              </label>
              <input
                type="number"
                min="1"
                value={bookForm.totalCopies}
                onChange={(e) => setBookForm({ ...bookForm, totalCopies: e.target.value })}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                Rack #
              </label>
              <input
                type="text"
                value={bookForm.rackNumber}
                onChange={(e) => setBookForm({ ...bookForm, rackNumber: e.target.value })}
                placeholder="A-12"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                Shelf #
              </label>
              <input
                type="text"
                value={bookForm.shelfNumber}
                onChange={(e) => setBookForm({ ...bookForm, shelfNumber: e.target.value })}
                placeholder="3"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                Price (₹)
              </label>
              <input
                type="number"
                min="0"
                value={bookForm.price}
                onChange={(e) => setBookForm({ ...bookForm, price: e.target.value })}
                placeholder="450"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
              Description / Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={bookForm.description}
              onChange={(e) => setBookForm({ ...bookForm, description: e.target.value })}
              placeholder="Standard physics textbook for senior secondary curriculum."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/80 p-3 text-xs font-semibold outline-none focus:border-primary focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setBookModalOpen(false)}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={savingBook}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-primary/90"
            >
              {savingBook ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
              <span>{editingBook ? 'Save Changes' : 'Add Book'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* ISSUE BOOK CIRCULATION MODAL */}
      <Modal
        isOpen={issueModalOpen}
        onClose={() => setIssueModalOpen(false)}
        title="Issue Book to Student or Teacher"
        size="lg"
      >
        <form onSubmit={handleSaveIssue} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
              Select Book to Issue *
            </label>
            <select
              value={issueForm.bookId}
              onChange={(e) => setIssueForm({ ...issueForm, bookId: e.target.value })}
              required
              className={inputClass}
            >
              <option value="">-- Choose Available Book --</option>
              {books.map((b) => (
                <option key={b.id} value={b.id} disabled={b.availableCopies <= 0}>
                  {b.title} ({b.bookCode}) — {b.availableCopies} available of {b.totalCopies}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
              Select Borrower (Student / Teacher / Staff) *
            </label>
            {loadingBorrowers ? (
              <div className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 text-xs text-slate-400">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" /> Loading eligible members...
              </div>
            ) : (
              <select
                value={issueForm.borrowerRefId}
                onChange={(e) => handleBorrowerSelect(e.target.value)}
                required
                className={inputClass}
              >
                <option value="">-- Choose Borrower Member --</option>
                {borrowers.map((bm) => (
                  <option key={bm.id} value={bm.id}>
                    [{bm.type}] {bm.name} ({bm.code}) — {bm.class}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                Loan Period
              </label>
              <select
                value={issueForm.durationDays}
                onChange={(e) => handleDurationChange(e.target.value)}
                className={inputClass}
              >
                <option value="7">7 Days (1 Week)</option>
                <option value="14">14 Days (2 Weeks - Standard)</option>
                <option value="21">21 Days (3 Weeks)</option>
                <option value="30">30 Days (1 Month)</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                Issue Date *
              </label>
              <input
                type="date"
                value={issueForm.issueDate}
                onChange={(e) => {
                  setIssueForm({ ...issueForm, issueDate: e.target.value });
                  handleDurationChange(issueForm.durationDays);
                }}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                Due Return Date *
              </label>
              <input
                type="date"
                value={issueForm.dueDate}
                onChange={(e) => setIssueForm({ ...issueForm, dueDate: e.target.value })}
                required
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
              Circulation Notes / Remarks (Optional)
            </label>
            <input
              type="text"
              value={issueForm.remarks}
              onChange={(e) => setIssueForm({ ...issueForm, remarks: e.target.value })}
              placeholder="e.g. Issued for Science Exhibition preparation"
              className={inputClass}
            />
          </div>

          <div className="flex justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIssueModalOpen(false)}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={savingIssue}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
            >
              {savingIssue ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <BookmarkCheck className="h-3.5 w-3.5" />}
              <span>Confirm & Issue Book</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* RETURN BOOK MODAL */}
      <Modal
        isOpen={returnModalOpen}
        onClose={() => setReturnModalOpen(false)}
        title={`Return Book: ${selectedIssue?.bookTitle || ''}`}
        size="md"
      >
        {selectedIssue && (
          <form onSubmit={handleSaveReturn} className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3.5 text-xs dark:border-slate-800 dark:bg-slate-950">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Borrower</span>
                  <p className="font-bold text-slate-900 dark:text-white">{selectedIssue.borrowerName}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Book Code</span>
                  <p className="font-mono font-bold text-indigo-600">{selectedIssue.bookCode}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Issue Date</span>
                  <p className="font-semibold">{formatDisplayDate(selectedIssue.issueDate)}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Due Date</span>
                  <p className="font-semibold text-rose-600">{formatDisplayDate(selectedIssue.dueDate)}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Return Date *
                </label>
                <input
                  type="date"
                  value={returnForm.returnDate}
                  onChange={(e) => setReturnForm({ ...returnForm, returnDate: e.target.value })}
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Book Condition
                </label>
                <select
                  value={returnForm.conditionOnReturn}
                  onChange={(e) => setReturnForm({ ...returnForm, conditionOnReturn: e.target.value })}
                  className={inputClass}
                >
                  <option value="GOOD">Good / Intact</option>
                  <option value="DAMAGED">Minor Damage</option>
                  <option value="LOST">Lost by Borrower</option>
                </select>
              </div>
            </div>

            {returnForm.fineAmount > 0 && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-3.5 dark:border-rose-900/50 dark:bg-rose-950/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-800 dark:text-rose-300">
                    Late Overdue Fine:
                  </span>
                  <span className="text-lg font-black text-rose-600">
                    ₹{returnForm.fineAmount}
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div>
                    <label className="mb-1 block text-[11px] font-bold text-slate-600 dark:text-slate-300">
                      Fine Amount (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={returnForm.fineAmount}
                      onChange={(e) => setReturnForm({ ...returnForm, fineAmount: Number(e.target.value) })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] font-bold text-slate-600 dark:text-slate-300">
                      Fine Status
                    </label>
                    <select
                      value={returnForm.fineStatus}
                      onChange={(e) => setReturnForm({ ...returnForm, fineStatus: e.target.value })}
                      className={inputClass}
                    >
                      <option value="PAID">Paid / Received Cash</option>
                      <option value="WAIVED">Waived by Admin</option>
                      <option value="PENDING">Pending Dues</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                Return Remarks (Optional)
              </label>
              <input
                type="text"
                value={returnForm.remarks}
                onChange={(e) => setReturnForm({ ...returnForm, remarks: e.target.value })}
                placeholder="e.g. Returned on time in good condition"
                className={inputClass}
              />
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setReturnModalOpen(false)}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingReturn}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700"
              >
                {savingReturn ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                <span>Confirm Book Return</span>
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* RETURN RECEIPT PRINT MODAL */}
      {returnedRecord && (
        <Modal
          isOpen={returnReceiptOpen}
          onClose={() => setReturnReceiptOpen(false)}
          title="Fine Payment Receipt"
          size="md"
        >
          <div className="space-y-4">
            <div id="library-fine-receipt" className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
              <div className="border-b border-dashed border-slate-200 pb-3 text-center dark:border-slate-800">
                <h4 className="text-base font-black uppercase text-slate-900 dark:text-white">
                  {schoolName}
                </h4>
                <p className="text-xs font-bold text-primary">LIBRARY OVERDUE FINE RECEIPT</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Date: {formatDisplayDate(returnedRecord.returnDate)}</p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-xs border-b border-dashed border-slate-200 pb-4 dark:border-slate-800">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Borrower</span>
                  <p className="font-bold text-slate-900 dark:text-white">{returnedRecord.borrowerName}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Book Title</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{returnedRecord.bookTitle}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Due Date</span>
                  <p className="font-semibold text-slate-700 dark:text-slate-300">{formatDisplayDate(returnedRecord.dueDate)}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Status</span>
                  <div><Badge variant="success">{returnedRecord.fineStatus}</Badge></div>
                </div>
              </div>

              <div className="mt-4 rounded-xl bg-emerald-50/60 p-4 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Fine Collected</span>
                <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                  ₹{returnedRecord.fineAmount}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setReturnReceiptOpen(false)}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const printWin = window.open('', '_blank');
                  printWin.document.write(`
                    <!DOCTYPE html>
                    <html>
                      <head>
                        <title>Library Receipt - ${returnedRecord.borrowerName}</title>
                        <style>
                          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 24px; color: #0f172a; }
                          .header { text-align: center; border-bottom: 2px dashed #cbd5e1; padding-bottom: 12px; margin-bottom: 16px; }
                          .school { font-size: 18px; font-weight: 900; text-transform: uppercase; margin: 0; }
                          .sub { font-size: 12px; font-weight: 700; color: #4f46e5; margin: 4px 0; }
                          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; border-bottom: 1px dashed #cbd5e1; padding-bottom: 16px; margin-bottom: 16px; font-size: 12px; }
                          .amount-box { background: #f0fdf4; border: 2px solid #86efac; border-radius: 8px; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; }
                          .sign { margin-top: 40px; display: flex; justify-content: flex-end; }
                          .sign-box { text-align: center; border-top: 1px solid #94a3b8; width: 160px; font-size: 11px; font-weight: 700; padding-top: 4px; }
                        </style>
                      </head>
                      <body>
                        <div class="header">
                          <h1 class="school">${schoolName}</h1>
                          <div class="sub">LIBRARY FINE COLLECTION RECEIPT</div>
                          <div>Date: ${formatDisplayDate(returnedRecord.returnDate)}</div>
                        </div>
                        <div class="grid">
                          <div><strong>Borrower:</strong> ${returnedRecord.borrowerName} (${returnedRecord.borrowerCode})</div>
                          <div><strong>Book:</strong> ${returnedRecord.bookTitle}</div>
                          <div><strong>Due Date:</strong> ${formatDisplayDate(returnedRecord.dueDate)}</div>
                          <div><strong>Fine Status:</strong> ${returnedRecord.fineStatus}</div>
                        </div>
                        <div class="amount-box">
                          <span style="font-weight: 700; color: #166534;">Fine Paid:</span>
                          <span style="font-size: 18px; font-weight: 900; color: #15803d;">₹${returnedRecord.fineAmount}</span>
                        </div>
                        <div class="sign">
                          <div class="sign-box">Librarian Signature</div>
                        </div>
                      </body>
                    </html>
                  `);
                  printWin.document.close();
                  printWin.focus();
                  printWin.print();
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-primary/90"
              >
                <Printer className="h-3.5 w-3.5" /> Print Receipt
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* CONFIRM DELETE BOOK DIALOG */}
      <ConfirmDialog
        isOpen={Boolean(deleteBookTarget)}
        title="Remove Book from Library"
        message={`Are you sure you want to remove "${deleteBookTarget?.title}" (${deleteBookTarget?.bookCode}) from the library catalog?`}
        confirmLabel="Delete Book"
        onConfirm={handleConfirmDeleteBook}
        onCancel={() => setDeleteBookTarget(null)}
        variant="danger"
      />

      <ToastComponent />
    </div>
  );
};

export default LibraryManagement;
