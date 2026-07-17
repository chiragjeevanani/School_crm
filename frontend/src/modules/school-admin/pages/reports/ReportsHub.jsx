import React, { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { useToast } from '../../components/ui/Toast';
import { 
  FileText, 
  Download, 
  ChevronRight, 
  ArrowLeft,
  Users,
  Calendar,
  GraduationCap,
  IndianRupee,
  Bus,
  Home,
  Book,
  Package,
  History
} from 'lucide-react';

const REPORT_CATEGORIES = [
  { id: 'admissions', label: 'Admission Reports', desc: 'New enrollments pipeline status, demographic breakdown.', icon: Users },
  { id: 'students', label: 'Student Reports', desc: 'Promotions logs, inactive student rosters, class counts.', icon: Users },
  { id: 'attendance', label: 'Attendance Reports', desc: 'Monthly heatmaps, absent statistics, leave counts.', icon: Calendar },
  { id: 'exams', label: 'Examination Reports', desc: 'Schedules, marks verifications, invigilator rosters.', icon: GraduationCap },
  { id: 'results', label: 'Result & CGPA Reports', desc: 'Subject average scores, performance rankings.', icon: GraduationCap },
  { id: 'fees', label: 'Fee & Financial Reports', desc: 'Tuition balances aging, transaction histories.', icon: IndianRupee },
  { id: 'payroll', label: 'Payroll & CTC Reports', desc: 'Salaries slips released summaries, HR stats.', icon: IndianRupee },
  { id: 'transport', label: 'Transport Route Reports', desc: 'Bus occupancy, route allocations, driver lists.', icon: Bus },
  { id: 'hostel', label: 'Hostel Occupancy Reports', desc: 'Beds fills records, room statuses summaries.', icon: Home },
  { id: 'library', label: 'Library Circulation Reports', desc: 'Overdue returns logs, stock catalog reports.', icon: Book },
  { id: 'inventory', label: 'Inventory Asset Reports', desc: 'Laboratory equipment stock audits, furniture.', icon: Package }
];

export const ReportsHub = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { showToast, ToastComponent } = useToast();

  const handleTriggerExport = (type) => {
    showToast(`${selectedCategory.label} successfully exported to ${type} file!`, 'success');
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Reports Hub" 
        subtitle="Access school-wide database metrics, download audit summaries, and export Excel spreadsheets."
      />

      {!selectedCategory ? (
        /* Categories Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {REPORT_CATEGORIES.map((cat) => {
            const CatIcon = cat.icon;
            return (
              <div
                key={cat.id}
                onClick={() => setSelectedCategory(cat)}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-750 hover:shadow-sm rounded-2xl p-5 cursor-pointer flex items-start gap-4 transition-all"
              >
                <div className="p-3 bg-indigo-50 dark:bg-indigo-950 text-indigo-650 dark:text-indigo-400 rounded-xl">
                  <CatIcon className="w-5 h-5" />
                </div>
                <div className="flex-1 space-y-1">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
                    <span>{cat.label}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </h4>
                  <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 leading-normal">{cat.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Report Category Preview & Actions Panel */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b">
            <button
              onClick={() => setSelectedCategory(null)}
              className="flex items-center gap-1 text-xs font-bold text-slate-655 hover:text-slate-800 dark:text-slate-400"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Reports</span>
            </button>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Preview: {selectedCategory.label}</h3>
          </div>

          {/* Dummy visual preview block */}
          <div className="border border-dashed rounded-2xl p-8 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 space-y-3">
            <FileText className="w-12 h-12 text-slate-350" />
            <div className="text-center space-y-1">
              <span className="text-xs font-bold text-slate-800 dark:text-white">Sample Data Generated</span>
              <p className="text-[10px] text-slate-400">Database query results matching {selectedCategory.label.toLowerCase()} is ready for download.</p>
            </div>
          </div>

          {/* Export triggers */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
            <button
              onClick={() => handleTriggerExport('PDF')}
              className="flex items-center justify-center gap-1.5 px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300"
            >
              <Download className="w-3.5 h-3.5 text-rose-500" />
              <span>Download PDF Document</span>
            </button>
            <button
              onClick={() => handleTriggerExport('Excel')}
              className="flex items-center justify-center gap-1.5 px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>Download Excel Sheet</span>
            </button>
            <button
              onClick={() => handleTriggerExport('CSV')}
              className="flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV File</span>
            </button>
          </div>
        </div>
      )}

      <ToastComponent />
    </div>
  );
};
export default ReportsHub;
