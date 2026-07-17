import React, { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { IssueSlip } from '../../components/ui/IssueSlip';
import { useToast } from '../../components/ui/Toast';
import { MOCK_MEMBERS, MOCK_BOOKS } from '../../utils/constants';
import { Search, User, BookOpen, Calendar, CheckCircle2, ChevronRight, CornerDownLeft } from 'lucide-react';
import { cn } from '../../utils/cn';

export const BookIssue = () => {
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [memberQuery, setMemberQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  
  const [bookQuery, setBookQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14); // Default 14 days circulation limit
    return d.toISOString().split('T')[0];
  });

  const [issueSlipOpen, setIssueSlipOpen] = useState(false);
  const [createdIssue, setCreatedIssue] = useState(null);

  // Search Members
  const filteredMembers = MOCK_MEMBERS.filter(m => 
    m.memberName.toLowerCase().includes(memberQuery.toLowerCase()) ||
    m.memberId.toLowerCase().includes(memberQuery.toLowerCase()) ||
    m.admissionNo.toLowerCase().includes(memberQuery.toLowerCase())
  );

  // Search Books
  const filteredBooks = MOCK_BOOKS.filter(b => 
    b.title.toLowerCase().includes(bookQuery.toLowerCase()) ||
    b.bookCode.toLowerCase().includes(bookQuery.toLowerCase()) ||
    b.isbn.toLowerCase().includes(bookQuery.toLowerCase())
  );

  const handleSelectMember = (member) => {
    if (member.membershipStatus === 'Suspended') {
      toast.error('Cannot issue book to a suspended member. Clear pending fines first.');
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
    const newIssue = {
      id: `ISS-${Math.floor(Math.random() * 9000) + 1000}`,
      bookId: selectedBook.id,
      bookTitle: selectedBook.title,
      bookCode: selectedBook.bookCode,
      memberId: selectedMember.memberId,
      memberName: selectedMember.memberName,
      memberType: selectedMember.memberType,
      memberClass: selectedMember.class,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: dueDate,
      returnDate: null,
      status: 'Issued',
      fineAmount: 0
    };

    setCreatedIssue(newIssue);
    toast.success('Book issued successfully!');
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
        subtitle="3-step circulation: Select Member → Scan Book/Barcode → Set Due Date & Print Receipt."
      />

      {/* Progress Line */}
      <div className="flex items-center gap-2 max-w-lg mx-auto border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 py-3 rounded-2xl">
        <span className={cn("text-xs font-bold", step >= 1 ? "text-amber-600 dark:text-amber-400" : "text-slate-400")}>1. Member</span>
        <ChevronRight className="h-4.5 w-4.5 text-slate-300 shrink-0" />
        <span className={cn("text-xs font-bold", step >= 2 ? "text-amber-600 dark:text-amber-400" : "text-slate-400")}>2. Book Code</span>
        <ChevronRight className="h-4.5 w-4.5 text-slate-300 shrink-0" />
        <span className={cn("text-xs font-bold", step >= 3 ? "text-amber-600 dark:text-amber-400" : "text-slate-400")}>3. Due Date</span>
      </div>

      <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8">
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-850 dark:text-slate-200">Search and Select Member</h3>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-450" />
              <input
                type="text"
                placeholder="Enter Student Name, Admission No, or Employee ID..."
                value={memberQuery}
                onChange={(e) => setMemberQuery(e.target.value)}
                className="w-full h-11 pl-11 pr-4 border border-slate-200 dark:border-slate-850 rounded-2xl text-xs bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            {/* List Results */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-60 overflow-y-auto no-scrollbar border border-slate-200 dark:border-slate-800 rounded-2xl">
              {filteredMembers.length > 0 ? (
                filteredMembers.map(m => (
                  <div
                    key={m.id}
                    onClick={() => handleSelectMember(m)}
                    className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-850/50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-650 rounded-xl">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white block">{m.memberName}</span>
                        <span className="text-3xs text-slate-450 block mt-0.5">{m.class} | ID: {m.memberId}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={m.membershipStatus === 'Active' ? 'success' : 'danger'}>
                        {m.membershipStatus}
                      </Badge>
                      <Badge variant="amber">
                        {m.booksIssued} / {m.maxBooksAllowed} Books
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="p-6 text-center text-xs text-slate-450">No members found matching query.</p>
              )}
            </div>
          </div>
        )}

        {step === 2 && selectedMember && (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-950 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl">
              <div>
                <span className="text-4xs font-bold text-slate-400 uppercase tracking-widest block">Selected Member</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{selectedMember.memberName}</span>
              </div>
              <button 
                onClick={() => setStep(1)} 
                className="text-xs text-rose-600 hover:text-rose-700 font-bold"
              >
                Change
              </button>
            </div>

            <h3 className="text-sm font-bold text-slate-850 dark:text-slate-200">Search and Select Book to Issue</h3>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-450" />
              <input
                type="text"
                placeholder="Search by Title, Book Code, or scan Barcode (ISBN)..."
                value={bookQuery}
                onChange={(e) => setBookQuery(e.target.value)}
                className="w-full h-11 pl-11 pr-4 border border-slate-200 dark:border-slate-850 rounded-2xl text-xs bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* List Results */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-60 overflow-y-auto no-scrollbar border border-slate-200 dark:border-slate-800 rounded-2xl">
              {filteredBooks.length > 0 ? (
                filteredBooks.map(b => (
                  <div
                    key={b.id}
                    onClick={() => handleSelectBook(b)}
                    className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-850/50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-650 rounded-xl">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white block">{b.title}</span>
                        <span className="text-3xs text-slate-450 block mt-0.5">{b.author} | Rack: {b.rackNumber}</span>
                      </div>
                    </div>
                    <Badge variant={b.availableCopies > 0 ? 'success' : 'danger'}>
                      {b.availableCopies} Left
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="p-6 text-center text-xs text-slate-450">No books found matching query.</p>
              )}
            </div>
          </div>
        )}

        {step === 3 && selectedMember && selectedBook && (
          <div className="space-y-6">
            {/* Selections details summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-slate-950 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1">
                <span className="text-4xs font-bold text-slate-400 uppercase tracking-widest block">Borrower Member</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">{selectedMember.memberName}</span>
                <span className="text-3xs text-slate-450 block">{selectedMember.class} | ID: {selectedMember.memberId}</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-950 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1">
                <span className="text-4xs font-bold text-slate-400 uppercase tracking-widest block">Book Selected</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">{selectedBook.title}</span>
                <span className="text-3xs text-slate-450 block">{selectedBook.author} | Code: {selectedBook.bookCode}</span>
              </div>
            </div>

            {/* Set Due Date */}
            <div className="space-y-1.5">
              <label className="text-2xs font-bold text-slate-550 dark:text-slate-450">Select Circulation Due Date <span className="text-rose-500">*</span></label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-450" />
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-850">
              <button
                onClick={() => setStep(2)}
                className="h-10 px-4 text-sm font-semibold border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-xl"
              >
                Back
              </button>
              <button
                onClick={handleConfirmIssue}
                className="h-10 px-4 text-sm font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-xs flex items-center gap-1.5"
              >
                <CheckCircle2 className="h-4.5 w-4.5" />
                <span>Confirm & Issue Book</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Printable Receipt Modal */}
      {createdIssue && (
        <Modal
          isOpen={issueSlipOpen}
          onClose={() => {
            setIssueSlipOpen(false);
            handleReset();
          }}
          title="Print Circulation Slip"
          size="md"
        >
          <IssueSlip
            issue={createdIssue}
            onClose={() => {
              setIssueSlipOpen(false);
              handleReset();
            }}
          />
        </Modal>
      )}
    </div>
  );
};
