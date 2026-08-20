import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { Tabs } from '../../components/ui/Tabs';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { AreaChart } from '../../components/ui/Charts/AreaChart';
import { BarChart } from '../../components/ui/Charts/BarChart';
import { PieChart } from '../../components/ui/Charts/PieChart';
import { exportToCSV } from '../../utils/exportHelpers';
import { Download, RefreshCw, FileText, TrendingUp, BookOpen, AlertTriangle, Receipt, RotateCcw } from 'lucide-react';
import { librarianApi } from '../../../../shared/api/client';
import { useToast } from '../../components/ui/Toast';
import { formatDate, formatCurrency } from '../../utils/formatters';

export const Reports = () => {
  const location = useLocation();
  const toast = useToast();

  const getInitialTab = () => {
    if (location.pathname.includes('/issues')) return 'issues';
    if (location.pathname.includes('/returns')) return 'returns';
    if (location.pathname.includes('/overdue')) return 'overdue';
    if (location.pathname.includes('/fines')) return 'fines';
    if (location.pathname.includes('/most-issued')) return 'most-issued';
    return 'inventory';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReport = async () => {
    setLoading(true);
    try {
      if (activeTab === 'inventory') {
        const res = await librarianApi.report('inventory');
        setReportData(res?.data || null);
      } else if (activeTab === 'most-issued') {
        const res = await librarianApi.report('most-issued', { limit: 20 });
        setReportData(res?.data || []);
      } else if (activeTab === 'issues') {
        const [issuesRes, trendRes] = await Promise.allSettled([
          librarianApi.issues({ limit: 100 }),
          librarianApi.report('issue-trend', { months: 6 }),
        ]);
        setReportData({
          list: issuesRes.status === 'fulfilled' ? issuesRes.value?.data || [] : [],
          trend: trendRes.status === 'fulfilled' ? trendRes.value?.data || [] : [],
        });
      } else if (activeTab === 'returns') {
        const res = await librarianApi.issues({ status: 'RETURNED', limit: 100 });
        setReportData(res?.data || []);
      } else if (activeTab === 'overdue') {
        const res = await librarianApi.issues({ status: 'OVERDUE', limit: 100 });
        setReportData(res?.data || []);
      } else if (activeTab === 'fines') {
        const [finesRes, trendRes] = await Promise.allSettled([
          librarianApi.issues({ fineStatus: 'PAID', limit: 100 }),
          librarianApi.report('fine-trend', { months: 6 }),
        ]);
        setReportData({
          list: finesRes.status === 'fulfilled' ? finesRes.value?.data || [] : [],
          trend: trendRes.status === 'fulfilled' ? trendRes.value?.data || [] : [],
        });
      }
    } catch {
      toast.error('Failed to load report analytics');
      setReportData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [activeTab]);

  useEffect(() => {
    setActiveTab(getInitialTab());
  }, [location.pathname]);

  const reportTabs = [
    { id: 'inventory', label: 'Inventory Report' },
    { id: 'issues', label: 'Issue Report' },
    { id: 'returns', label: 'Return Report' },
    { id: 'overdue', label: 'Overdue Report' },
    { id: 'fines', label: 'Fine Report' },
    { id: 'most-issued', label: 'Most Issued Books' },
  ];

  const handleExportCSV = () => {
    if (!reportData) return;

    if (activeTab === 'most-issued' && Array.isArray(reportData)) {
      exportToCSV(
        reportData.map((b) => ({
          title: b.title,
          author: b.author,
          category: b.category,
          totalIssues: b.totalIssues,
          lastIssuedAt: formatDate(b.lastIssuedAt),
        })),
        'most_issued_books_report.csv'
      );
    } else if (activeTab === 'issues' && Array.isArray(reportData?.list)) {
      exportToCSV(
        reportData.list.map((i) => ({
          bookTitle: i.bookTitle,
          accessionNumber: i.accessionNumber,
          borrowerName: i.borrowerName,
          borrowerType: i.borrowerType,
          issueDate: formatDate(i.issueDate),
          dueDate: formatDate(i.dueDate),
          status: i.status,
        })),
        'issue_activity_report.csv'
      );
    } else if (activeTab === 'returns' && Array.isArray(reportData)) {
      exportToCSV(
        reportData.map((i) => ({
          bookTitle: i.bookTitle,
          accessionNumber: i.accessionNumber,
          borrowerName: i.borrowerName,
          returnDate: formatDate(i.returnDate),
          condition: i.conditionOnReturn,
          fineAmount: i.fineAmount,
        })),
        'returns_report.csv'
      );
    } else if (activeTab === 'overdue' && Array.isArray(reportData)) {
      exportToCSV(
        reportData.map((i) => ({
          bookTitle: i.bookTitle,
          accessionNumber: i.accessionNumber,
          borrowerName: i.borrowerName,
          dueDate: formatDate(i.dueDate),
          overdueDays: i.overdueDays,
          fineAccrued: i.fineAmount,
        })),
        'overdue_books_report.csv'
      );
    } else if (activeTab === 'fines' && Array.isArray(reportData?.list)) {
      exportToCSV(
        reportData.list.map((i) => ({
          bookTitle: i.bookTitle,
          borrowerName: i.borrowerName,
          returnDate: formatDate(i.returnDate),
          fineAmount: i.fineAmount,
          fineStatus: i.fineStatus,
        })),
        'fine_collections_report.csv'
      );
    } else {
      toast.info('Export ready for this dataset');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports & Analytics Hub"
        subtitle="Generate MongoDB aggregation reports, circulation trends, inventory audits, and export audit sheets."
        actions={
          <div className="flex items-center gap-2.5">
            <button
              onClick={fetchReport}
              disabled={loading}
              className="p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300 transition-colors"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleExportCSV}
              className="h-10 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-xs"
            >
              <Download className="h-4 w-4" />
              <span>Export CSV Report</span>
            </button>
          </div>
        }
      />

      {/* Tabs */}
      <Tabs tabs={reportTabs} activeTab={activeTab} onChange={setActiveTab} />

      {loading ? (
        <div className="py-20 text-center text-xs font-semibold text-slate-400 flex flex-col items-center gap-2">
          <RefreshCw className="h-6 w-6 animate-spin text-indigo-600" />
          <span>Computing report aggregation from database...</span>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Inventory Report */}
          {activeTab === 'inventory' && reportData && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
                  <span className="text-3xs font-bold text-slate-400 uppercase">Total Catalogued Titles</span>
                  <p className="text-xl font-black text-slate-900 dark:text-white mt-1">{reportData.stats?.totalTitles || 0}</p>
                </div>
                <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
                  <span className="text-3xs font-bold text-slate-400 uppercase">Total Physical Copies</span>
                  <p className="text-xl font-black text-slate-900 dark:text-white mt-1">{reportData.stats?.totalCopies || 0}</p>
                </div>
                <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
                  <span className="text-3xs font-bold text-slate-400 uppercase">Available on Shelf</span>
                  <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{reportData.stats?.availableCopies || 0}</p>
                </div>
                <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
                  <span className="text-3xs font-bold text-slate-400 uppercase">Damaged / Lost</span>
                  <p className="text-xl font-black text-rose-600 dark:text-rose-400 mt-1">{(reportData.stats?.damagedCopies || 0) + (reportData.stats?.lostCopies || 0)}</p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Stock Breakdown by Category</h3>
                <DataTable
                  columns={[
                    { title: 'Category Name', key: 'name', sortable: true },
                    { title: 'Unique Titles', key: 'count', sortable: true },
                    { title: 'Total Copies', key: 'totalCopies', sortable: true },
                    { title: 'Available Copies', key: 'availableCopies', sortable: true },
                  ]}
                  data={reportData.categories || []}
                  searchPlaceholder="Filter categories..."
                  searchKeys={['name']}
                />
              </div>
            </div>
          )}

          {/* Most Issued Books */}
          {activeTab === 'most-issued' && Array.isArray(reportData) && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Top 20 Most Borrowed Books</h3>
              </div>
              {reportData.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400 font-semibold">
                  No issue transactions recorded yet.
                </div>
              ) : (
                <DataTable
                  columns={[
                    {
                      title: 'Rank',
                      key: 'rank',
                      render: (_, __, index) => (
                        <span className="font-black text-xs text-indigo-600 dark:text-indigo-400">
                          #{index + 1}
                        </span>
                      ),
                    },
                    { title: 'Book Title', key: 'title', sortable: true },
                    { title: 'Author', key: 'author', sortable: true },
                    { title: 'Category', key: 'category' },
                    {
                      title: 'Total Circulation Count',
                      key: 'totalIssues',
                      sortable: true,
                      render: (val) => <Badge variant="indigo">{val} times issued</Badge>,
                    },
                    {
                      title: 'Last Issued Date',
                      key: 'lastIssuedAt',
                      render: (val) => formatDate(val),
                    },
                  ]}
                  data={reportData}
                  searchPlaceholder="Search titles..."
                  searchKeys={['title', 'author', 'category']}
                />
              )}
            </div>
          )}

          {/* Issue Report */}
          {activeTab === 'issues' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Issue History Log</h3>
              <DataTable
                columns={[
                  { title: 'Book Title', key: 'bookTitle' },
                  { title: 'Accession #', key: 'accessionNumber' },
                  { title: 'Borrower', key: 'borrowerName' },
                  { title: 'Type', key: 'borrowerType' },
                  { title: 'Issue Date', key: 'issueDate', render: (val) => formatDate(val) },
                  { title: 'Due Date', key: 'dueDate', render: (val) => formatDate(val) },
                  { title: 'Status', key: 'status', render: (val) => <Badge variant={val === 'RETURNED' ? 'success' : 'warning'}>{val}</Badge> },
                ]}
                data={reportData?.list || []}
                searchPlaceholder="Search issues..."
                searchKeys={['bookTitle', 'borrowerName']}
              />
            </div>
          )}

          {/* Return Report */}
          {activeTab === 'returns' && Array.isArray(reportData) && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Completed Book Returns</h3>
              <DataTable
                columns={[
                  { title: 'Book Title', key: 'bookTitle' },
                  { title: 'Accession #', key: 'accessionNumber' },
                  { title: 'Borrower', key: 'borrowerName' },
                  { title: 'Return Date', key: 'returnDate', render: (val) => formatDate(val) },
                  { title: 'Condition', key: 'conditionOnReturn' },
                  { title: 'Fine Paid', key: 'fineAmount', render: (val) => formatCurrency(val || 0) },
                ]}
                data={reportData}
                searchPlaceholder="Search returns..."
                searchKeys={['bookTitle', 'borrowerName']}
              />
            </div>
          )}

          {/* Overdue Report */}
          {activeTab === 'overdue' && Array.isArray(reportData) && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Overdue Analysis</h3>
              <DataTable
                columns={[
                  { title: 'Book Title', key: 'bookTitle' },
                  { title: 'Accession #', key: 'accessionNumber' },
                  { title: 'Borrower', key: 'borrowerName' },
                  { title: 'Due Date', key: 'dueDate', render: (val) => formatDate(val) },
                  { title: 'Days Overdue', key: 'overdueDays', render: (val) => <span className="text-rose-600 font-bold">{val || 1} days late</span> },
                  { title: 'Est. Fine', key: 'fineAmount', render: (val) => formatCurrency(val || 0) },
                ]}
                data={reportData}
                searchPlaceholder="Search overdue..."
                searchKeys={['bookTitle', 'borrowerName']}
              />
            </div>
          )}

          {/* Fine Report */}
          {activeTab === 'fines' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Fine Collection Records</h3>
              <DataTable
                columns={[
                  { title: 'Book Title', key: 'bookTitle' },
                  { title: 'Borrower', key: 'borrowerName' },
                  { title: 'Payment Date', key: 'returnDate', render: (val) => formatDate(val) },
                  { title: 'Fine Amount', key: 'fineAmount', render: (val) => <span className="font-bold text-emerald-600">{formatCurrency(val || 0)}</span> },
                  { title: 'Status', key: 'fineStatus', render: (val) => <Badge variant="success">{val}</Badge> },
                ]}
                data={reportData?.list || []}
                searchPlaceholder="Search fines..."
                searchKeys={['bookTitle', 'borrowerName']}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default Reports;
