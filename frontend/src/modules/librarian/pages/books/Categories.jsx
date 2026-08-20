import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { FolderTree, BookOpen, RefreshCw, Layers } from 'lucide-react';
import { librarianApi } from '../../../../shared/api/client';
import { useToast } from '../../components/ui/Toast';
import { useNavigate } from 'react-router-dom';

export const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await librarianApi.categories();
      if (res?.success && Array.isArray(res.data)) {
        setCategories(res.data);
      } else {
        setCategories([]);
      }
    } catch (err) {
      toast.error('Failed to load book categories');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const columns = [
    {
      title: 'Category Name',
      key: 'name',
      sortable: true,
      render: (val) => (
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400">
            <FolderTree className="h-4 w-4" />
          </div>
          <span className="font-bold text-slate-900 dark:text-white text-xs">{val || 'GENERAL'}</span>
        </div>
      ),
    },
    {
      title: 'Unique Titles',
      key: 'count',
      sortable: true,
      render: (val) => <Badge variant="neutral">{val} Titles</Badge>,
    },
    {
      title: 'Total Stock Copies',
      key: 'totalCopies',
      sortable: true,
      render: (val) => <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{val || 0}</span>,
    },
    {
      title: 'Available Copies',
      key: 'availableCopies',
      sortable: true,
      render: (val) => (
        <Badge variant={val > 0 ? 'success' : 'danger'}>
          {val || 0} Available
        </Badge>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, row) => (
        <button
          onClick={() => navigate(`/librarian/books?category=${encodeURIComponent(row.name)}`)}
          className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 text-3xs font-bold rounded-lg hover:bg-indigo-100 transition-colors"
        >
          View Books
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Book Categories"
        subtitle="Aggregated library departments, classifications, and stock distribution."
        actions={
          <button
            onClick={fetchCategories}
            disabled={loading}
            className="p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        }
      />

      {loading ? (
        <div className="py-20 text-center text-xs font-semibold text-slate-400 flex flex-col items-center gap-2">
          <RefreshCw className="h-6 w-6 animate-spin text-indigo-600" />
          <span>Analyzing library category distribution...</span>
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-3">
          <FolderTree className="h-8 w-8 mx-auto text-slate-400" />
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">No Categories Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Categories are automatically populated as you register books into the catalogue.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6">
          <DataTable
            columns={columns}
            data={categories}
            searchPlaceholder="Search categories..."
            searchKeys={['name']}
            csvFilename="library_categories.csv"
          />
        </div>
      )}
    </div>
  );
};
export default Categories;
