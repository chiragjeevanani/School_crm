import React from 'react';
import { useLibrarianAuth } from '../context/LibrarianAuthContext';
import { useLibrarianNotifications } from '../context/LibrarianNotificationContext';
import { 
  BookOpen, 
  BookCopy, 
  FileCheck, 
  FileX, 
  Receipt, 
  Bookmark, 
  AlertTriangle,
  FolderOpen,
  ArrowRight,
  PlusCircle,
  Search,
  CalendarDays,
  FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StatCard } from '../components/ui/StatCard';
import { Badge } from '../components/ui/Badge';
import { AreaChart } from '../components/ui/Charts/AreaChart';
import { BarChart } from '../components/ui/Charts/BarChart';
import { PieChart } from '../components/ui/Charts/PieChart';
import { formatDate, formatCurrency } from '../utils/formatters';
import { MOCK_BOOKS, MOCK_ISSUES, MOCK_FINES, MOCK_LOGS, MOCK_CATEGORIES, MOCK_RESERVATIONS } from '../utils/constants';

export const Dashboard = () => {
  const { user } = useLibrarianAuth();
  const navigate = useNavigate();
  
  // Compute Dashboard Statistics
  const totalBooksCount = MOCK_BOOKS.reduce((acc, curr) => acc + curr.totalCopies, 0);
  const availableBooksCount = MOCK_BOOKS.reduce((acc, curr) => acc + curr.availableCopies, 0);
  const issuedBooksCount = MOCK_ISSUES.filter(x => x.status === 'Issued' || x.status === 'Overdue').length;
  const overdueBooksCount = MOCK_ISSUES.filter(x => x.status === 'Overdue').length;
  
  const todayIssuesCount = MOCK_ISSUES.filter(x => x.issueDate === '2026-07-17' || x.issueDate.startsWith('2026-07-17')).length;
  const todayReturnsCount = MOCK_ISSUES.filter(x => x.returnDate === '2026-07-17' || (x.returnDate && x.returnDate.startsWith('2026-07-17'))).length;
  
  const todayFineCollection = MOCK_FINES
    .filter(x => x.status === 'Paid' && x.paymentDate === '2026-07-17')
    .reduce((acc, curr) => acc + curr.totalFine, 0);

  const pendingFines = MOCK_FINES
    .filter(x => x.status === 'Unpaid')
    .reduce((acc, curr) => acc + curr.totalFine, 0);

  // Charts Datasets
  const categoryChartData = MOCK_CATEGORIES.map(cat => ({
    name: cat.name,
    value: cat.bookCount
  }));

  const issueTrendData = [
    { name: 'Mon', Issues: 12, Returns: 8 },
    { name: 'Tue', Issues: 19, Returns: 14 },
    { name: 'Wed', Issues: 15, Returns: 18 },
    { name: 'Thu', Issues: 24, Returns: 10 },
    { name: 'Fri', Issues: 30, Returns: 22 },
    { name: 'Sat', Issues: 10, Returns: 15 }
  ];

  const fineCollectionData = [
    { name: 'Week 1', Collection: 150 },
    { name: 'Week 2', Collection: 320 },
    { name: 'Week 3', Collection: 210 },
    { name: 'Week 4', Collection: 450 }
  ];

  const quickActions = [
    { name: 'Add New Book', icon: PlusCircle, path: '/librarian/books', state: { openAddWizard: true }, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/20' },
    { name: 'Issue Book', icon: FileCheck, path: '/librarian/issue', color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/20' },
    { name: 'Return Book', icon: FileX, path: '/librarian/return', color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/20' },
    { name: 'Collect Fine', icon: Receipt, path: '/librarian/fines', color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/20' },
    { name: 'Search Directory', icon: Search, path: '/librarian/books', color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/20' },
    { name: 'View Reports', icon: FileText, path: '/librarian/reports', color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/20' }
  ];

  return (
    <div className="space-y-6">
      {/* Header Profile Section */}
      <div className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-3xl p-6 md:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md shadow-amber-900/10">
        <div className="flex items-center gap-4">
          <img
            src={user?.photoUrl}
            alt={user?.name}
            className="h-16 w-16 rounded-full border-2 border-white/20 shrink-0"
          />
          <div className="space-y-1">
            <h2 className="text-xl md:text-2xl font-black">Welcome back, {user?.name}!</h2>
            <p className="text-xs text-amber-100 font-semibold flex items-center gap-1.5 opacity-90">
              <span>{user?.schoolName}</span>
              <span className="h-1 w-1 bg-white/40 rounded-full" />
              <span>Session {user?.academicSession}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-xs px-4 py-2.5 rounded-2xl self-start md:self-auto border border-white/15">
          <CalendarDays className="h-4.5 w-4.5 text-amber-200" />
          <span className="text-xs font-bold font-mono uppercase tracking-wider">{formatDate(new Date())}</span>
        </div>
      </div>

      {/* Grid statistics (10 Stats) */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <StatCard title="Total Books Copies" value={totalBooksCount} icon={BookOpen} trend="+12%" subtitle="since last month" />
        <StatCard title="Available Copies" value={availableBooksCount} icon={BookCopy} />
        <StatCard title="Active Issues" value={issuedBooksCount} icon={FileCheck} />
        <StatCard title="Overdue Books" value={overdueBooksCount} icon={AlertTriangle} trend={overdueBooksCount > 0 ? `+${overdueBooksCount}` : '0'} subtitle="requires attention" />
        <StatCard title="Today's Issues" value={todayIssuesCount} icon={FileCheck} />
        <StatCard title="Today's Returns" value={todayReturnsCount} icon={FileX} />
        <StatCard title="Today's Fine Collected" value={formatCurrency(todayFineCollection)} icon={Receipt} />
        <StatCard title="Pending Fines" value={formatCurrency(pendingFines)} icon={Receipt} />
        <StatCard title="Reserved Queue" value={MOCK_RESERVATIONS.filter(x => x.status === 'Pending').length} icon={Bookmark} />
        <StatCard title="Damaged Books" value={MOCK_FINES.filter(x => x.fineType.includes('Damage')).length} icon={AlertTriangle} />
      </div>

      {/* Quick Actions Panel */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Quick Circulation Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map((act) => {
            const Icon = act.icon;
            return (
              <button
                key={act.name}
                onClick={() => navigate(act.path, { state: act.state })}
                className="flex flex-col items-center justify-center p-4 border border-slate-200 dark:border-slate-850 hover:border-amber-400 dark:hover:border-amber-900/50 rounded-2xl hover:shadow-xs transition-all duration-200 group text-center"
              >
                <div className={`p-3 rounded-xl mb-3 group-hover:scale-105 transition-transform duration-200 ${act.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-350">{act.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Charts & Activities Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Issue Trends Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Weekly Issue & Return Trend</h3>
            <Badge variant="amber">Mon - Sat</Badge>
          </div>
          <AreaChart data={issueTrendData} dataKey="Issues" xKey="name" />
        </div>

        {/* Categories Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Books by Category</h3>
          <PieChart data={categoryChartData} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fine Collection Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Fine Collection (INR)</h3>
          <BarChart data={fineCollectionData} dataKey="Collection" xKey="name" />
        </div>

        {/* Recent Activity Log */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Recent Library Activity</h3>
              <button 
                onClick={() => navigate('/librarian/audit')}
                className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1"
              >
                <span>View audit logs</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
            <div className="space-y-4">
              {MOCK_LOGS.slice(0, 4).map((log) => (
                <div key={log.id} className="flex gap-3">
                  <div className="h-2 w-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <div className="flex-1 space-y-0.5">
                    <p className="text-xs text-slate-800 dark:text-slate-200 font-semibold">{log.details}</p>
                    <div className="flex items-center gap-2 text-3xs text-slate-450">
                      <span>{log.operatorName}</span>
                      <span>•</span>
                      <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
