import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { Tabs } from '../../components/ui/Tabs';
import { Badge } from '../../components/ui/Badge';
import { BarcodeDisplay } from '../../components/ui/BarcodeDisplay';
import { DataTable } from '../../components/ui/DataTable';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { MOCK_BOOKS, MOCK_ISSUES, MOCK_RESERVATIONS } from '../../utils/constants';
import { BookOpen, User, ArrowLeft, Bookmark, Tag, MapPin, Layers } from 'lucide-react';

export const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const book = MOCK_BOOKS.find(b => b.id === id);

  if (!book) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 font-bold">Book catalog not found.</p>
        <button 
          onClick={() => navigate('/librarian/books')}
          className="text-xs text-amber-600 font-bold mt-2 hover:underline"
        >
          Back to Catalogue
        </button>
      </div>
    );
  }

  // Get specific transactions for this book
  const issueHistory = MOCK_ISSUES.filter(x => x.bookId === id);
  const reservations = MOCK_RESERVATIONS.filter(x => x.bookId === id);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'issues', label: 'Issue History', count: issueHistory.length },
    { id: 'reservations', label: 'Reservations Queue', count: reservations.length },
    { id: 'barcode', label: 'Barcode Label' }
  ];

  const issueColumns = [
    { title: 'Slip ID', key: 'id' },
    { title: 'Member Name', key: 'memberName' },
    { title: 'Type', key: 'memberType' },
    { title: 'Issue Date', key: 'issueDate', render: (val) => formatDate(val) },
    { title: 'Due Date', key: 'dueDate', render: (val) => formatDate(val) },
    { title: 'Return Date', key: 'returnDate', render: (val) => val ? formatDate(val) : '-' },
    { title: 'Status', key: 'status', render: (val) => (
        <Badge variant={val === 'Returned' ? 'success' : val === 'Overdue' ? 'danger' : 'warning'}>
          {val}
        </Badge>
      )
    }
  ];

  const reservationColumns = [
    { title: 'Queue #', key: 'queuePosition', render: (val) => `#${val}` },
    { title: 'Member Name', key: 'memberName' },
    { title: 'Reserve Date', key: 'reserveDate', render: (val) => formatDate(val) },
    { title: 'Status', key: 'status', render: (val) => (
        <Badge variant={val === 'Completed' ? 'success' : 'warning'}>
          {val}
        </Badge>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/librarian/books')}
          className="p-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Book Details Profile</span>
      </div>

      {/* Book Summary Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start">
        <div className="w-24 h-36 bg-gradient-to-br from-amber-500 to-amber-700 rounded-2xl flex items-center justify-center shrink-0 shadow-md relative overflow-hidden">
          <div className="absolute left-1.5 top-0 bottom-0 w-1.5 bg-amber-800/30" />
          <BookOpen className="h-10 w-10 text-amber-100" />
          <span className="absolute bottom-2 text-2xs text-amber-200 font-mono tracking-widest">{book.id}</span>
        </div>

        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap gap-2 items-center">
            <Badge variant={book.availableCopies > 0 ? 'success' : 'danger'}>
              {book.availableCopies} / {book.totalCopies} Copies Available
            </Badge>
            <Badge variant="amber">{book.category}</Badge>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-tight">{book.title}</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs pt-2">
            <div className="flex items-center gap-2 text-slate-550 dark:text-slate-400">
              <User className="h-4 w-4 text-amber-500" />
              <span>By {book.author}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-550 dark:text-slate-400">
              <Layers className="h-4 w-4 text-amber-500" />
              <span>Edition: {book.edition}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-550 dark:text-slate-400">
              <Tag className="h-4 w-4 text-amber-500" />
              <span>ISBN: {book.isbn}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-550 dark:text-slate-400">
              <MapPin className="h-4 w-4 text-amber-500" />
              <span>Rack {book.rackNumber}, Shelf {book.shelfNumber}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab Panels */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Classification */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest border-b pb-2">Classification & Source</h3>
                <div className="grid grid-cols-2 gap-y-3 text-xs">
                  <span className="font-semibold text-slate-450">Category:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{book.category}</span>
                  
                  <span className="font-semibold text-slate-450">Subject:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{book.subject || '-'}</span>
                  
                  <span className="font-semibold text-slate-450">Publisher:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{book.publisher}</span>
                  
                  <span className="font-semibold text-slate-450">Pub. Year:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{book.publicationYear}</span>
                  
                  <span className="font-semibold text-slate-450">Language:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{book.language}</span>
                </div>
              </div>

              {/* Acquisition Details */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest border-b pb-2">Acquisition & Inventory</h3>
                <div className="grid grid-cols-2 gap-y-3 text-xs">
                  <span className="font-semibold text-slate-450">Purchase Date:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{formatDate(book.purchaseDate)}</span>
                  
                  <span className="font-semibold text-slate-450">Book Cost:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{formatCurrency(book.bookCost)}</span>
                  
                  <span className="font-semibold text-slate-450">Supplier:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{book.supplier}</span>
                  
                  <span className="font-semibold text-slate-450">Total Stock Copies:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{book.totalCopies}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'issues' && (
          <DataTable
            columns={issueColumns}
            data={issueHistory}
            searchPlaceholder="Search issue history..."
            searchKeys={['id', 'memberName', 'memberId']}
          />
        )}

        {activeTab === 'reservations' && (
          <DataTable
            columns={reservationColumns}
            data={reservations}
            searchPlaceholder="Search reservation list..."
            searchKeys={['memberName', 'memberId']}
          />
        )}

        {activeTab === 'barcode' && (
          <div className="max-w-md mx-auto">
            <BarcodeDisplay value={book.barcode} label={book.title} />
          </div>
        )}
      </div>
    </div>
  );
};
