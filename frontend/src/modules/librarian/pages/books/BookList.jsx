import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { BookCard } from '../../components/ui/BookCard';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { AddEditBook } from './AddEditBook';
import { MOCK_BOOKS } from '../../utils/constants';
import { Plus, LayoutGrid, List } from 'lucide-react';
import { cn } from '../../utils/cn';

export const BookList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [books, setBooks] = useState(MOCK_BOOKS);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [wizardOpen, setWizardOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  // Auto-open wizard if state is passed (e.g. from Dashboard click)
  useEffect(() => {
    if (location.state?.openAddWizard) {
      setWizardOpen(true);
      window.history.replaceState({}, document.title); // clear state
    }
  }, [location.state]);

  const handleAddSuccess = (newBook) => {
    if (editingBook) {
      setBooks(prev => prev.map(b => b.id === editingBook.id ? newBook : b));
    } else {
      setBooks(prev => [...prev, newBook]);
    }
    setWizardOpen(false);
    setEditingBook(null);
  };

  const handleEditClick = (book) => {
    setEditingBook(book);
    setWizardOpen(true);
  };

  const columns = [
    { title: 'Book Code', key: 'bookCode', sortable: true },
    { title: 'Title', key: 'title', sortable: true, render: (val, row) => (
        <span 
          onClick={() => navigate(`/librarian/books/${row.id}`)}
          className="font-bold text-slate-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer"
        >
          {val}
        </span>
      )
    },
    { title: 'Author', key: 'author', sortable: true },
    { title: 'Category', key: 'category', sortable: true, filterable: true },
    { title: 'Location', key: 'rackNumber', render: (val, row) => `Rack ${val}, Shelf ${row.shelfNumber}` },
    { title: 'Available', key: 'availableCopies', render: (val, row) => (
        <Badge variant={val > 0 ? 'success' : 'danger'}>
          {val} / {row.totalCopies}
        </Badge>
      )
    },
    { title: 'Cost', key: 'bookCost', render: (val) => `₹${val}` },
    { title: 'Actions', key: 'actions', render: (_, row) => (
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/librarian/books/${row.id}`)}
            className="px-2.5 py-1 text-2xs font-bold border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-850"
          >
            View
          </button>
          <button
            onClick={() => handleEditClick(row)}
            className="px-2.5 py-1 text-2xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-700 dark:bg-amber-950/20 dark:hover:bg-amber-900/30 dark:text-amber-400 rounded-lg"
          >
            Edit
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Book Catalogue"
        subtitle="Manage library catalogs, barcode locations, and stock info."
        actions={
          <>
            {/* View Mode Toggle */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-1 flex bg-white dark:bg-slate-950">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  "p-1.5 rounded-lg transition-colors",
                  viewMode === 'grid' ? "bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400" : "text-slate-400"
                )}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  "p-1.5 rounded-lg transition-colors",
                  viewMode === 'list' ? "bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400" : "text-slate-400"
                )}
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={() => {
                setEditingBook(null);
                setWizardOpen(true);
              }}
              className="h-10 px-4 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all duration-150 shadow-xs"
            >
              <Plus className="h-4 w-4" />
              <span>Add Book</span>
            </button>
          </>
        }
      />

      {/* Grid or List rendering */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map(book => (
            <BookCard
              key={book.id}
              book={book}
              onView={(b) => navigate(`/librarian/books/${b.id}`)}
              onEdit={handleEditClick}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6">
          <DataTable
            columns={columns}
            data={books}
            searchPlaceholder="Search by title, author, or code..."
            searchKeys={['title', 'author', 'bookCode', 'isbn']}
            csvFilename="school_books_directory.csv"
          />
        </div>
      )}

      {/* Multistep Add/Edit Book Wizard Modal */}
      <Modal
        isOpen={wizardOpen}
        onClose={() => {
          setWizardOpen(false);
          setEditingBook(null);
        }}
        title={editingBook ? 'Edit Book Details' : 'Register New Book Catalog'}
        size="lg"
      >
        <AddEditBook
          book={editingBook}
          onSuccess={handleAddSuccess}
          onCancel={() => {
            setWizardOpen(false);
            setEditingBook(null);
          }}
        />
      </Modal>
    </div>
  );
};
