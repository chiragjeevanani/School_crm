import React, { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Tabs } from '../../components/ui/Tabs';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { Plus, Library, BookOpen } from 'lucide-react';

export const LibraryManagement = () => {
  const [activeTab, setActiveTab] = useState('books');
  const { showToast, ToastComponent } = useToast();

  const [books, setBooks] = useState([
    { id: '1', title: 'Concepts of Physics (Vol 1)', author: 'H.C. Verma', category: 'Science', isbn: '978-8177091878', stock: 12, issued: 4 },
    { id: '2', title: 'Higher Algebra', author: 'Hall & Knight', category: 'Mathematics', isbn: '978-9351761501', stock: 8, issued: 2 },
    { id: '3', title: 'A Brief History of Time', author: 'Stephen Hawking', category: 'Science', isbn: '978-0553380163', stock: 5, issued: 0 }
  ]);

  const [issuedLogs, setIssuedLogs] = useState([
    { id: '1', title: 'Concepts of Physics (Vol 1)', studentName: 'Aarav Sharma', issueDate: '2026-07-10', dueDate: '2026-07-24', status: 'Issued' },
    { id: '2', title: 'Higher Algebra', studentName: 'Diya Patel', issueDate: '2026-07-12', dueDate: '2026-07-26', status: 'Issued' }
  ]);

  // Modal control
  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [newIssue, setNewIssue] = useState({ bookId: '1', studentName: '', durationDays: 14 });

  const handleIssueBook = (e) => {
    e.preventDefault();
    const targetBook = books.find(b => b.id === newIssue.bookId);
    if (!targetBook) return;

    const issueDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(issueDate.getDate() + Number(newIssue.durationDays));

    const newLog = {
      id: Date.now().toString(),
      title: targetBook.title,
      studentName: newIssue.studentName,
      issueDate: issueDate.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      status: 'Issued'
    };

    setIssuedLogs(prev => [newLog, ...prev]);
    setBooks(prev => prev.map(b => b.id === targetBook.id ? { ...b, issued: b.issued + 1 } : b));
    setIssueModalOpen(false);
    showToast('Book circulation issue logged successfully!', 'success');
  };

  const handleReturnBook = (row) => {
    setIssuedLogs(prev => prev.map(log => log.id === row.id ? { ...log, status: 'Returned' } : log));
    setBooks(prev => prev.map(b => b.title === row.title ? { ...b, issued: Math.max(0, b.issued - 1) } : b));
    showToast('Book return logged successfully!', 'success');
  };

  const bookColumns = [
    { header: 'Book Title', key: 'title', render: (val) => <span className="font-bold text-slate-900 dark:text-white">{val}</span> },
    { header: 'Author', key: 'author' },
    { header: 'ISBN Index', key: 'isbn' },
    { header: 'Subject Category', key: 'category', render: (val) => <Badge variant="info">{val}</Badge> },
    { header: 'Stock Status', key: 'stock', render: (val, row) => (
      <span className="font-semibold">{row.stock - row.issued} / {row.stock} Copies available</span>
    )}
  ];

  const issueColumns = [
    { header: 'Circulated Title', key: 'title' },
    { header: 'Issued Student', key: 'studentName', render: (val) => <span className="font-bold">{val}</span> },
    { header: 'Issue Date', key: 'issueDate' },
    { header: 'Due Return Date', key: 'dueDate' },
    { header: 'Status', key: 'status', render: (val) => <Badge variant={val === 'Returned' ? 'success' : 'warning'}>{val}</Badge> },
    {
      header: 'Actions',
      key: 'actions',
      render: (_, row) => {
        if (row.status === 'Returned') return null;
        return (
          <button
            onClick={() => handleReturnBook(row)}
            className="text-xs font-bold text-indigo-650 hover:underline"
          >
            Log Return
          </button>
        );
      }
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Library Inventory & Circulation" 
        subtitle="Catalog academic book items, maintain subject indexes, issue borrowings, and track overdue logs."
        actions={
          <button
            onClick={() => setIssueModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Issue Catalog Book</span>
          </button>
        }
      />

      <Tabs 
        tabs={[
          { id: 'books', label: 'Books Catalogue Inventory', count: books.length },
          { id: 'issues', label: 'Circulation & Borrow Logs', count: issuedLogs.length }
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        {activeTab === 'books' && <DataTable columns={bookColumns} data={books} />}
        {activeTab === 'issues' && <DataTable columns={issueColumns} data={issuedLogs} />}
      </div>

      {/* ISSUE BOOK MODAL */}
      <Modal isOpen={issueModalOpen} onClose={() => setIssueModalOpen(false)} title="Issue Catalog Book">
        <form onSubmit={handleIssueBook} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400">Select Book Item</label>
            <select
              value={newIssue.bookId}
              onChange={(e) => setNewIssue({...newIssue, bookId: e.target.value})}
              className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border focus:outline-none"
            >
              {books.map(b => (
                <option key={b.id} value={b.id} disabled={b.stock === b.issued}>
                  {b.title} by {b.author} ({b.stock - b.issued} Left)
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400">Borrower Student</label>
              <input 
                type="text" 
                required
                placeholder="e.g. Aarav Sharma" 
                value={newIssue.studentName} 
                onChange={(e) => setNewIssue({...newIssue, studentName: e.target.value})} 
                className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400">Duration (Days)</label>
              <select
                value={newIssue.durationDays}
                onChange={(e) => setNewIssue({...newIssue, durationDays: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border focus:outline-none"
              >
                <option value="7">7 Days (1 Week)</option>
                <option value="14">14 Days (2 Weeks)</option>
                <option value="30">30 Days (1 Month)</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={() => setIssueModalOpen(false)} className="px-4 py-2 text-xs font-semibold rounded-xl hover:bg-slate-100">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl">Register Issue</button>
          </div>
        </form>
      </Modal>

      <ToastComponent />
    </div>
  );
};
export default LibraryManagement;
