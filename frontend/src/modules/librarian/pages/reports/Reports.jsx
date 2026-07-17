import React, { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Tabs } from '../../components/ui/Tabs';
import { StatCard } from '../../components/ui/StatCard';
import { AreaChart } from '../../components/ui/Charts/AreaChart';
import { BarChart } from '../../components/ui/Charts/BarChart';
import { PieChart } from '../../components/ui/Charts/PieChart';
import { LineChart } from '../../components/ui/Charts/LineChart';
import { exportToCSV } from '../../utils/exportHelpers';
import { MOCK_BOOKS, MOCK_ISSUES, MOCK_FINES, MOCK_MEMBERS, MOCK_CATEGORIES } from '../../utils/constants';
import { Download, FileText, BarChart3 } from 'lucide-react';

export const Reports = () => {
  const [activeTab, setActiveTab] = useState('inventory');

  // Compute reports statistics
  const totalBooks = MOCK_BOOKS.reduce((acc, curr) => acc + curr.totalCopies, 0);
  const issuedBooks = MOCK_ISSUES.filter(x => x.status === 'Issued' || x.status === 'Overdue').length;
  const overdueBooks = MOCK_ISSUES.filter(x => x.status === 'Overdue').length;
  
  const finesCollected = MOCK_FINES.filter(x => x.status === 'Paid').reduce((acc, curr) => acc + curr.paidAmount, 0);
  const outstandingFines = MOCK_FINES.filter(x => x.status === 'Unpaid').reduce((acc, curr) => acc + curr.totalFine, 0);

  const reportTabs = [
    { id: 'inventory', label: 'Inventory Auditing' },
    { id: 'issues', label: 'Book Issue Activity' },
    { id: 'fines', label: 'Fine Collection Reports' }
  ];

  // Chart datasets
  const categoryData = MOCK_CATEGORIES.map(c => ({ name: c.name, value: c.bookCount }));
  const monthlyLoansData = [
    { month: 'Jan', Loans: 85, Returns: 70 },
    { month: 'Feb', Loans: 110, Returns: 95 },
    { month: 'Mar', Loans: 130, Returns: 110 },
    { month: 'Apr', Loans: 155, Returns: 140 },
    { month: 'May', Loans: 170, Returns: 165 },
    { month: 'Jun', Loans: 120, Returns: 145 },
    { month: 'Jul', Loans: 95, Returns: 80 }
  ];

  const finesData = [
    { name: 'Mon', Fines: 4 },
    { name: 'Tue', Fines: 8 },
    { name: 'Wed', Fines: 12 },
    { name: 'Thu', Fines: 6 },
    { name: 'Fri', Fines: 20 },
    { name: 'Sat', Fines: 2 }
  ];

  const handleExportData = () => {
    let dataToExport = [];
    let filename = '';

    if (activeTab === 'inventory') {
      dataToExport = MOCK_BOOKS.map(b => ({
        id: b.id,
        code: b.bookCode,
        title: b.title,
        author: b.author,
        category: b.category,
        totalStock: b.totalCopies,
        available: b.availableCopies,
        cost: b.bookCost
      }));
      filename = 'library_inventory_report.csv';
    } else if (activeTab === 'issues') {
      dataToExport = MOCK_ISSUES.map(i => ({
        id: i.id,
        bookCode: i.bookCode,
        title: i.bookTitle,
        borrower: i.memberName,
        type: i.memberType,
        issueDate: i.issueDate,
        dueDate: i.dueDate,
        status: i.status
      }));
      filename = 'library_loan_issues_report.csv';
    } else if (activeTab === 'fines') {
      dataToExport = MOCK_FINES.map(f => ({
        id: f.id,
        borrower: f.memberName,
        fineType: f.fineType,
        overdueDays: f.daysOverdue,
        totalFine: f.totalFine,
        paid: f.paidAmount,
        status: f.status
      }));
      filename = 'library_fine_ledgers_report.csv';
    }

    exportToCSV(dataToExport, filename);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports & Analytics"
        subtitle="View consolidated charts, catalog stock totals, and download audited reports."
        actions={
          <button
            onClick={handleExportData}
            className="h-10 px-4 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all duration-150 shadow-xs"
          >
            <Download className="h-4 w-4" />
            <span>Download CSV Report</span>
          </button>
        }
      />

      {/* Stats summaries */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Inventory Copies" value={totalBooks} icon={BarChart3} />
        <StatCard title="Active Issued Out" value={issuedBooks} icon={FileText} />
        <StatCard title="Overdue Warning books" value={overdueBooks} icon={BarChart3} />
        <StatCard title="Total Cash Fines Collected" value={`₹${finesCollected}`} icon={BarChart3} />
      </div>

      {/* Tabs */}
      <Tabs tabs={reportTabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab Panels with charts */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6">
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Book Stock Categories Distribution</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <PieChart data={categoryData} />
              </div>
              <div className="space-y-4 text-xs">
                <p className="font-semibold text-slate-550">Overview Insights:</p>
                <div className="grid grid-cols-2 gap-y-2 border-t pt-3">
                  <span className="text-slate-450">Active Catalog Titles:</span>
                  <span className="font-bold text-slate-850 dark:text-slate-200">{MOCK_BOOKS.length}</span>
                  <span className="text-slate-450">Total Physical Copies:</span>
                  <span className="font-bold text-slate-850 dark:text-slate-200">{totalBooks}</span>
                  <span className="text-slate-450">Out-Of-Stock Books:</span>
                  <span className="font-bold text-slate-850 dark:text-slate-200">{MOCK_BOOKS.filter(x => x.availableCopies === 0).length}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'issues' && (
          <div className="space-y-6">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Monthly Loan Issues vs Returns</h4>
            <AreaChart data={monthlyLoansData} dataKey="Loans" xKey="month" />
          </div>
        )}

        {activeTab === 'fines' && (
          <div className="space-y-6">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Daily Fine Collection Analysis (Weekly view)</h4>
            <BarChart data={finesData} dataKey="Fines" xKey="name" />
          </div>
        )}
      </div>
    </div>
  );
};
