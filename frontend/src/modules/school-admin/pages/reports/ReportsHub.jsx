import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { useToast } from '../../components/ui/Toast';
import { exportToCSV, exportToJSON } from '../../../../shared/lib/exportHelpers';
import { PrintReportModal } from '../../../../shared/components/PrintReportModal';
import { schoolPortalApi } from '../../../../shared/api/client';
import { useSchoolAdminAuth } from '../../context/SchoolAdminAuthContext';
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bed,
  Book,
  BookOpen,
  Briefcase,
  Building,
  Bus,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  FileCheck,
  FileSpreadsheet,
  FileText,
  GraduationCap,
  History,
  Home,
  IndianRupee,
  Layers,
  Loader2,
  MapPin,
  Package,
  Printer,
  RefreshCw,
  Search,
  Shield,
  Sparkles,
  Tag,
  TrendingUp,
  UserCheck,
  Users,
  Wrench,
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';

const REPORT_CATEGORIES = [
  {
    id: 'students',
    label: 'Student Directory & Roster',
    desc: 'Complete student profiles, roll numbers, class sections, and parent contact information.',
    icon: Users,
    color: 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400',
    tag: 'Academic',
  },
  {
    id: 'fees',
    label: 'Fee Payment Receipts Log',
    desc: 'Real-time payment transactions register, mode of payment (UPI/Cash), receipt numbers.',
    icon: IndianRupee,
    color: 'bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400',
    tag: 'Finance',
  },
  {
    id: 'fee_dues',
    label: 'Fee Dues & Defaulter Register',
    desc: 'Outstanding tuition balances, invoice due dates, and pending collection aging lists.',
    icon: AlertTriangle,
    color: 'bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400',
    tag: 'Finance',
  },
  {
    id: 'attendance',
    label: 'Staff Attendance & Leave Logs',
    desc: 'Daily campus staff presence statistics, absenteeism counts, and monthly attendance rates.',
    icon: Calendar,
    color: 'bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400',
    tag: 'Operations',
  },
  {
    id: 'hostel',
    label: 'Hostel Residential Allocations',
    desc: 'Building occupancy registers, room numbers, allocated bed codes, and stay durations.',
    icon: Bed,
    color: 'bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400',
    tag: 'Residency',
  },
  {
    id: 'transport',
    label: 'Transport Fleet & Bus Riders',
    desc: 'Route stop mappings, morning pickup/evening drop timings, and student bus subscriptions.',
    icon: Bus,
    color: 'bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400',
    tag: 'Logistics',
  },
  {
    id: 'library',
    label: 'Library Catalog & Stock Circulation',
    desc: 'Book inventory, ISBNs, shelf rack locations, total copies, and active issued book loans.',
    icon: BookOpen,
    color: 'bg-indigo-50 dark:bg-indigo-950 text-indigo-650 dark:text-indigo-400',
    tag: 'Library',
  },
  {
    id: 'staff',
    label: 'Faculty & Employee Directory',
    desc: 'Teaching faculty, administrative staff, assigned designations, departments, and emails.',
    icon: UserCheck,
    color: 'bg-violet-50 dark:bg-violet-950 text-violet-600 dark:text-violet-400',
    tag: 'HR & Staff',
  },
  {
    id: 'exams',
    label: 'Examination & Assessment Schedules',
    desc: 'Scheduled examination terms, subject timetables, academic sessions, and test dates.',
    icon: GraduationCap,
    color: 'bg-fuchsia-50 dark:bg-fuchsia-950 text-fuchsia-600 dark:text-fuchsia-400',
    tag: 'Examination',
  },
];

export const ReportsHub = () => {
  const { user } = useSchoolAdminAuth();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const { showToast, ToastComponent } = useToast();

  const fetchReportData = useCallback(async (categoryObj) => {
    if (!categoryObj) return;
    setLoading(true);
    try {
      const res = await schoolPortalApi.reportData(categoryObj.id);
      if (res?.data) {
        setReportData(res.data);
      } else {
        setReportData([]);
      }
    } catch (err) {
      showToast(err.message || 'Failed to load report dataset', 'error');
      setReportData([]);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const handleSelectCategory = (categoryObj) => {
    setSelectedCategory(categoryObj);
    setSearchQuery('');
    fetchReportData(categoryObj);
  };

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return reportData;
    const q = searchQuery.toLowerCase();
    return reportData.filter((row) =>
      Object.values(row).some((val) => String(val).toLowerCase().includes(q))
    );
  }, [reportData, searchQuery]);

  const handleDownloadCSV = () => {
    if (!selectedCategory || filteredData.length === 0) return;
    exportToCSV(filteredData, `${selectedCategory.id}_report_${new Date().toISOString().split('T')[0]}.csv`);
    showToast(`${selectedCategory.label} exported to CSV!`, 'success');
  };

  const handleDownloadJSON = () => {
    if (!selectedCategory || filteredData.length === 0) return;
    exportToJSON(filteredData, `${selectedCategory.id}_report_${new Date().toISOString().split('T')[0]}.json`);
    showToast(`${selectedCategory.label} exported to JSON!`, 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Institutional Reports & Audit Hub"
        subtitle="Generate live official reports, analyze cross-module datasets, download spreadsheets, and print official documentation."
      />

      {!selectedCategory ? (
        /* Categories Cards Grid */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Select Report Dataset Category
            </h3>
            <span className="text-xs font-semibold text-slate-500">
              {REPORT_CATEGORIES.length} Live Operational Datasets Available
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {REPORT_CATEGORIES.map((cat) => {
              const CatIcon = cat.icon;
              return (
                <div
                  key={cat.id}
                  onClick={() => handleSelectCategory(cat)}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-800 hover:shadow-md rounded-3xl p-6 cursor-pointer flex flex-col justify-between space-y-4 transition-all group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className={`p-3.5 rounded-2xl ${cat.color} group-hover:scale-110 transition-transform`}>
                        <CatIcon className="w-6 h-6" />
                      </div>
                      <Badge variant="secondary">{cat.tag}</Badge>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
                        <span>{cat.label}</span>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {cat.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-indigo-650 dark:text-indigo-400">
                    <span>Generate live dataset</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Report Category Preview & Actions Panel */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setSelectedCategory(null)}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Categories Hub</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">Selected Dataset:</span>
              <span className="text-xs font-bold text-indigo-650 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-xl">
                {selectedCategory.label}
              </span>
            </div>
          </div>

          {/* Search & Actions Control Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={`Search in ${selectedCategory.label}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/80 pl-9 pr-3.5 text-xs font-semibold outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchReportData(selectedCategory)}
                disabled={loading}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
                title="Refresh Dataset"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>

              <button
                onClick={() => setPrintModalOpen(true)}
                disabled={loading || filteredData.length === 0}
                className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 transition-all"
              >
                <Printer className="w-3.5 h-3.5 text-indigo-600" />
                <span>Print Official PDF</span>
              </button>

              <button
                onClick={handleDownloadJSON}
                disabled={loading || filteredData.length === 0}
                className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 transition-all"
              >
                <Download className="w-3.5 h-3.5 text-cyan-600" />
                <span>Export JSON</span>
              </button>

              <button
                onClick={handleDownloadCSV}
                disabled={loading || filteredData.length === 0}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Excel / CSV</span>
              </button>
            </div>
          </div>

          {/* Live Data Preview Table */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-650 mb-3" />
              <p className="text-xs font-bold text-slate-400">Compiling report dataset...</p>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-16 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
              <FileSpreadsheet className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">No records found</h4>
              <p className="text-xs text-slate-400">Try adjusting your search filter or select another category.</p>
            </div>
          ) : (
            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto max-h-[500px]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <tr>
                      <th className="p-3.5">#</th>
                      {Object.keys(filteredData[0] || {}).map((h, i) => (
                        <th key={i} className="p-3.5 whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold text-slate-700 dark:text-slate-300">
                    {filteredData.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/40">
                        <td className="p-3.5 text-slate-400 font-mono text-[11px]">{idx + 1}</td>
                        {Object.values(row).map((val, cIdx) => (
                          <td key={cIdx} className="p-3.5 whitespace-nowrap">
                            {String(val) === 'ACTIVE' || String(val) === 'SUCCESS' ? (
                              <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 font-bold text-[10px]">
                                {String(val)}
                              </span>
                            ) : String(val) === 'OVERDUE' || String(val) === 'PENDING' ? (
                              <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-600 font-bold text-[10px]">
                                {String(val)}
                              </span>
                            ) : (
                              String(val)
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Footer stats */}
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 pt-2">
            <span>
              Showing <strong>{filteredData.length}</strong> of <strong>{reportData.length}</strong> total records
            </span>
            <span className="text-slate-400">Institutional Database Live Synchronized</span>
          </div>
        </div>
      )}

      {/* Print Document Modal */}
      {selectedCategory && (
        <PrintReportModal
          isOpen={printModalOpen}
          onClose={() => setPrintModalOpen(false)}
          title={`Official Report — ${selectedCategory.label}`}
          documentType={selectedCategory.label}
          data={filteredData}
        >
          <div className="space-y-6">
            <div className="text-center pb-4 border-b border-slate-200">
              <h2 className="text-xl font-black text-slate-900">
                {user?.schoolName || 'Greenfield Public School'}
              </h2>
              <p className="text-xs text-slate-500">Affiliated to CBSE / State Board • Session 2026-2027</p>
              <h3 className="text-sm font-bold text-indigo-650 mt-2">{selectedCategory.label}</h3>
              <span className="text-[10px] text-slate-400">Generated on: {new Date().toLocaleDateString()}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b">
                    <th className="p-2 font-bold">#</th>
                    {Object.keys(filteredData[0] || {}).map((h, i) => (
                      <th key={i} className="p-2 font-bold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredData.map((r, i) => (
                    <tr key={i}>
                      <td className="p-2">{i + 1}</td>
                      {Object.values(r).map((v, idx) => (
                        <td key={idx} className="p-2">
                          {String(v)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between pt-8 text-xs font-bold text-slate-500">
              <span>Prepared by: School Administration</span>
              <span>Authorized Principal Signature: __________________</span>
            </div>
          </div>
        </PrintReportModal>
      )}

      <ToastComponent />
    </div>
  );
};

export default ReportsHub;
