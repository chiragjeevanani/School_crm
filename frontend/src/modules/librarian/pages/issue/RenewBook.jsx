import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { RefreshCw, Clock, CheckCircle2 } from 'lucide-react';
import { librarianApi } from '../../../../shared/api/client';
import { useToast } from '../../components/ui/Toast';
import { formatDate } from '../../utils/formatters';

export const RenewBook = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [renewingId, setRenewingId] = useState(null);
  const toast = useToast();

  const fetchRenewableLoans = async () => {
    setLoading(true);
    try {
      const res = await librarianApi.issues({ status: 'ISSUED' });
      if (res?.success && Array.isArray(res.data)) {
        setLoans(res.data);
      } else {
        setLoans([]);
      }
    } catch {
      toast.error('Failed to load renewable loans');
      setLoans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRenewableLoans();
  }, []);

  const handleRenew = async (loan) => {
    if ((loan.renewalCount || 0) >= (loan.maxRenewals || 2)) {
      toast.error(`Maximum renewal limit (${loan.maxRenewals || 2}) reached for this book loan.`);
      return;
    }

    setRenewingId(loan.id);
    try {
      const res = await librarianApi.renewBook(loan.id);
      toast.success(`Book "${loan.bookTitle}" loan renewed successfully! Due date extended to ${formatDate(res.data.dueDate)}.`);
      fetchRenewableLoans();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to renew book loan');
    } finally {
      setRenewingId(null);
    }
  };

  const columns = [
    {
      title: 'Book Title',
      key: 'bookTitle',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="font-bold text-slate-800 dark:text-slate-200 text-xs block">{val}</span>
          <span className="text-3xs text-slate-400">Copy: {row.accessionNumber || 'N/A'}</span>
        </div>
      ),
    },
    {
      title: 'Borrower',
      key: 'borrowerName',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="font-bold text-slate-800 dark:text-slate-200 text-xs block">{val}</span>
          <span className="text-3xs text-slate-400">{row.borrowerType} • {row.borrowerCode || 'STU'}</span>
        </div>
      ),
    },
    { title: 'Issued Date', key: 'issueDate', render: (val) => formatDate(val) },
    {
      title: 'Current Due Date',
      key: 'dueDate',
      sortable: true,
      render: (val) => {
        const isLate = new Date(val) < new Date();
        return (
          <span className={`font-bold text-xs ${isLate ? 'text-rose-600' : 'text-slate-700 dark:text-slate-300'}`}>
            {formatDate(val)}
          </span>
        );
      },
    },
    {
      title: 'Renewals Used',
      key: 'renewalCount',
      sortable: true,
      render: (val, row) => {
        const used = val || 0;
        const max = row.maxRenewals || 2;
        return (
          <span className={`px-2 py-0.5 rounded text-3xs font-bold ${used >= max ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>
            {used} / {max} Used
          </span>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, row) => {
        const canRenew = (row.renewalCount || 0) < (row.maxRenewals || 2);
        const isProcessing = renewingId === row.id;

        return (
          <button
            onClick={() => handleRenew(row)}
            disabled={!canRenew || isProcessing}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              canRenew
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
            }`}
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
            <span>{isProcessing ? 'Renewing...' : canRenew ? 'Renew Loan (+14d)' : 'Max Limit Reached'}</span>
          </button>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Renew Book Loans"
        subtitle="Extend circulation periods for active student and teacher loans within library policy limits."
        actions={
          <button
            onClick={fetchRenewableLoans}
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
          <span>Checking active loans and renewal quotas...</span>
        </div>
      ) : loans.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-3">
          <CheckCircle2 className="h-8 w-8 mx-auto text-emerald-500" />
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">No Active Loans to Renew</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            There are currently no active book loans eligible for renewal.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6">
          <DataTable
            columns={columns}
            data={loans}
            searchPlaceholder="Search active loans..."
            searchKeys={['bookTitle', 'borrowerName', 'accessionNumber', 'borrowerCode']}
            csvFilename="renewable_book_loans.csv"
          />
        </div>
      )}
    </div>
  );
};
export default RenewBook;
