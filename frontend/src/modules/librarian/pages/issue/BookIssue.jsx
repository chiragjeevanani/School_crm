import React, { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { IssueSlip } from '../../components/ui/IssueSlip';
import { useToast } from '../../components/ui/Toast';
import { useAppStore } from '../../../../shared/store/useAppStore';
import { Search, User, BookOpen, Calendar, CheckCircle2, ChevronRight, CornerDownLeft } from 'lucide-react';
import { cn } from '../../utils/cn';

export const BookIssue = () => {
  const toast = useToast();
  const { store, issueBook } = useAppStore();

  const [step, setStep] = useState(1);
  const [memberQuery, setMemberQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  
  const [bookQuery, setBookQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });

  const [issueSlipOpen, setIssueSlipOpen] = useState(false);
  const [createdIssue, setCreatedIssue] = useState(null);

  const books = store.books || [];
  const members = store.students.map(s => ({
    id: s.id,
    memberId: `LIB-${s.admissionNo?.slice(-4) || '101'}`,
    memberName: s.name,
    admissionNo: s.admissionNo,
    memberType: 'Student',
    class: s.class,
    booksIssued: store.bookLoans.filter(l => l.studentId === s.id && l.status === 'Issued').length,
    maxBooksAllowed: 4,
    membershipStatus: s.status === 'Active' ? 'Active' : 'Suspended'
  }));

  // Search Members
  const filteredMembers = members.filter(m => 
    m.memberName.toLowerCase().includes(memberQuery.toLowerCase()) ||
    m.memberId.toLowerCase().includes(memberQuery.toLowerCase()) ||
    (m.admissionNo && m.admissionNo.toLowerCase().includes(memberQuery.toLowerCase()))
  );

  // Search Books
  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(bookQuery.toLowerCase()) ||
    b.bookCode.toLowerCase().includes(bookQuery.toLowerCase()) ||
    b.isbn.toLowerCase().includes(bookQuery.toLowerCase())
  );

  const handleSelectMember = (member) => {
    if (member.membershipStatus === 'Suspended') {
      toast.error('Cannot issue book to a suspended member.');
      return;
    }
    if (member.booksIssued >= member.maxBooksAllowed) {
      toast.error(`Member has reached the limit of ${member.maxBooksAllowed} issued books.`);
      return;
    }
    setSelectedMember(member);
    setStep(2);
  };

  const handleSelectBook = (book) => {
    if (book.availableCopies <= 0) {
      toast.error('This book is currently out of stock (0 available copies).');
      return;
    }
    setSelectedBook(book);
    setStep(3);
  };

  const handleConfirmIssue = () => {
    const loan = issueBook(
      selectedBook.id,
      selectedMember.id,
      selectedMember.memberName,
      dueDate,
      'Mrs. Nalini Sengupta (Librarian)'
    );

    setCreatedIssue({
      id: loan?.id || `ISS-${Math.floor(Math.random() * 9000) + 1000}`,
      bookTitle: selectedBook.title,
      bookCode: selectedBook.bookCode,
      memberName: selectedMember.memberName,
      memberId: selectedMember.memberId,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: dueDate,
      memberType: 'Student',
      memberClass: selectedMember.class
    });

    toast.success(`Book "${selectedBook.title}" issued successfully! Stock decremented and student record synchronized.`);
    setIssueSlipOpen(true);
  };

  const handleReset = () => {
    setStep(1);
    setSelectedMember(null);
    setSelectedBook(null);
    setMemberQuery('');
    setBookQuery('');
    setCreatedIssue(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Issue Book Wizard"
        subtitle="3-step circulation: Select Member → Scan Book/Barcode → Set Due Date & Issue."
      />

      {/* STEP INDICATOR */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { num: 1, title: 'Select Member', desc: selectedMember ? selectedMember.memberName : 'Find student' },
          { num: 2, title: 'Select Book', desc: selectedBook ? selectedBook.title : 'Scan barcode' },
          { num: 3, title: 'Confirm & Issue', desc: 'Set due date' }
        ].map((s) => (
          <div 
            key={s.num}
            className={cn(
              "p-3.5 rounded-2xl border transition-all flex items-center gap-3",
              step === s.num 
                ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20" 
                : step > s.num
                  ? "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50"
                  : "border-slate-200 dark:border-slate-800 opacity-60"
            )}
          >
            <div className={cn(
              "w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0",
              step === s.num ? "bg-emerald-600 text-white" : step > s.num ? "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300" : "bg-slate-100 text-slate-400"
            )}>
              {step > s.num ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : s.num}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{s.title}</p>
              <p className="text-[10px] text-slate-400 truncate">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* STEP 1: SELECT MEMBER */}
      {step === 1 && (
        <div className="bg-white dark:bg-slate-900 border border-border rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2">
            <User className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Step 1: Select Student Library Member</h3>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search member by name, admission no, or Library Card ID..."
              value={memberQuery}
              onChange={(e) => setMemberQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 pl-9 pr-4 py-2.5 rounded-xl border border-border text-xs focus:outline-none"
            />
          </div>

          <div className="divide-y divide-border border border-border rounded-2xl overflow-hidden max-h-96 overflow-y-auto">
            {filteredMembers.map((m) => (
              <div 
                key={m.id}
                onClick={() => handleSelectMember(m)}
                className="p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{m.memberName}</span>
                    <Badge variant={m.membershipStatus === 'Active' ? 'success' : 'danger'}>
                      {m.membershipStatus}
                    </Badge>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    ID: {m.memberId} • Class {m.class} • Books Issued: {m.booksIssued}/{m.maxBooksAllowed}
                  </p>
                </div>
                <button className="text-xs font-bold text-emerald-600 flex items-center gap-1 hover:underline">
                  <span>Select</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2: SELECT BOOK */}
      {step === 2 && (
        <div className="bg-white dark:bg-slate-900 border border-border rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-2">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Step 2: Select Catalog Book</h3>
            </div>
            <button onClick={() => setStep(1)} className="text-xs text-slate-400 hover:text-slate-600">Change Member</button>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search catalog by title, accession code, or ISBN..."
              value={bookQuery}
              onChange={(e) => setBookQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 pl-9 pr-4 py-2.5 rounded-xl border border-border text-xs focus:outline-none"
            />
          </div>

          <div className="divide-y divide-border border border-border rounded-2xl overflow-hidden max-h-96 overflow-y-auto">
            {filteredBooks.map((b) => (
              <div 
                key={b.id}
                onClick={() => handleSelectBook(b)}
                className="p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{b.title}</span>
                    <Badge variant={b.availableCopies > 0 ? 'success' : 'danger'}>
                      {b.availableCopies} Copies Available
                    </Badge>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Code: {b.bookCode} • Author: {b.author} • Shelf: {b.location}
                  </p>
                </div>
                <button className="text-xs font-bold text-emerald-600 flex items-center gap-1 hover:underline">
                  <span>Select</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 3: CONFIRM & ISSUE */}
      {step === 3 && (
        <div className="bg-white dark:bg-slate-900 border border-border rounded-3xl p-8 shadow-sm space-y-6 max-w-2xl mx-auto">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Step 3: Verify & Confirm Circulation Loan</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-border">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Selected Student</span>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1">{selectedMember.memberName}</h4>
              <p className="text-[10px] text-slate-400">Class {selectedMember.class} • {selectedMember.memberId}</p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-border">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Selected Book</span>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1">{selectedBook.title}</h4>
              <p className="text-[10px] text-slate-400">Code: {selectedBook.bookCode} • Available: {selectedBook.availableCopies}</p>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Mandatory Return Due Date *</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-border bg-slate-50 dark:bg-slate-900 text-foreground"
            />
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-border">
            <button onClick={() => setStep(2)} className="text-xs font-semibold text-slate-400 hover:text-slate-600">Back</button>
            <button
              onClick={handleConfirmIssue}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-95"
            >
              Issue Book & Print Circulation Slip
            </button>
          </div>
        </div>
      )}

      {/* ISSUE SLIP MODAL */}
      <Modal isOpen={issueSlipOpen} onClose={() => { setIssueSlipOpen(false); handleReset(); }} title="Circulation Issue Slip">
        {createdIssue && (
          <div className="space-y-4">
            <IssueSlip issueData={createdIssue} />
            <button
              onClick={() => { setIssueSlipOpen(false); handleReset(); }}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-xs font-bold rounded-xl"
            >
              Done & Issue Another
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};
export default BookIssue;
