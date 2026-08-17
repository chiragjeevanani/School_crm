import React, { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { useToast } from '../../components/ui/Toast';
import { useAppStore } from '../../../../shared/store/useAppStore';
import { exportToCSV, exportToJSON } from '../../../../shared/lib/exportHelpers';
import { PrintReportModal } from '../../../../shared/components/PrintReportModal';
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
  History,
  Printer
} from 'lucide-react';

const REPORT_CATEGORIES = [
  { id: 'admissions', label: 'Admission Reports', desc: 'New enrollments pipeline status, demographic breakdown.', icon: Users },
  { id: 'students', label: 'Student Directory Reports', desc: 'Promotions logs, student rosters, class counts, fee dues.', icon: Users },
  { id: 'attendance', label: 'Attendance Reports', desc: 'Monthly summaries, absent statistics, leave counts.', icon: Calendar },
  { id: 'exams', label: 'Examination Schedule Reports', desc: 'Schedules, marks verifications, invigilator rosters.', icon: GraduationCap },
  { id: 'results', label: 'Result & Performance Reports', desc: 'Subject average scores, performance rankings, GPAs.', icon: GraduationCap },
  { id: 'fees', label: 'Fee Collection & Dues Reports', desc: 'Tuition balances aging, transaction receipts histories.', icon: IndianRupee },
  { id: 'payroll', label: 'Payroll & CTC Reports', desc: 'Salaries slips released summaries, staff designations.', icon: IndianRupee },
  { id: 'transport', label: 'Transport Fleet Reports', desc: 'Bus occupancy, route allocations, driver lists.', icon: Bus },
  { id: 'hostel', label: 'Hostel Occupancy Reports', desc: 'Bed fills records, room statuses summaries.', icon: Home },
  { id: 'library', label: 'Library Circulation Reports', desc: 'Overdue returns logs, stock catalog reports.', icon: Book },
  { id: 'inventory', label: 'Inventory Asset Reports', desc: 'Laboratory equipment stock audits, furniture.', icon: Package }
];

export const ReportsHub = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const { showToast, ToastComponent } = useToast();
  const { store } = useAppStore();

  const getCategoryData = (catId) => {
    switch (catId) {
      case 'admissions':
        return store.admissions.map(a => ({
          'Application ID': a.id,
          'Candidate Name': a.name,
          'Class': a.class,
          'Gender': a.gender,
          'Guardian': a.parentName,
          'Phone': a.phone,
          'Status': a.status,
          'Documents': a.documentsStatus
        }));
      case 'students':
        return store.students.map(s => ({
          'Admission No': s.admissionNo,
          'Student Name': s.name,
          'Class': s.class,
          'Section': s.section,
          'Guardian': s.parentName,
          'Contact': s.parentPhone || s.phone,
          'Total Fees': s.totalFees,
          'Paid Fees': s.paidFees,
          'Pending Fees': s.pendingFees,
          'Fee Status': s.feeStatus || 'Paid',
          'Transport Route': s.transportRouteId || 'None',
          'Status': s.status
        }));
      case 'attendance':
        return store.students.slice(0, 20).map(s => ({
          'Admission No': s.admissionNo,
          'Student Name': s.name,
          'Class': s.class,
          'Section': s.section,
          'Today Status': store.attendance.students['2026-08-14']?.[s.id] || 'Present',
          'Monthly Present %': '94.5%',
          'Approved Leaves': 2
        }));
      case 'exams':
        return store.exams.map(e => ({
          'Exam ID': e.id,
          'Exam Name': e.name,
          'Session': e.session,
          'Start Date': e.startDate,
          'End Date': e.endDate,
          'Status': e.status
        }));
      case 'results':
        return Object.values(store.results['EXAM-2026-UT1'] || {}).map(r => ({
          'Student ID': r.studentId,
          'Student Name': r.studentName,
          'Class': r.class,
          'Rank': r.rank,
          'Total Marks': r.totalMarks,
          'Obtained Marks': r.obtainedMarks,
          'Percentage': `${r.percentage}%`,
          'GPA': r.gpa,
          'Status': r.status
        }));
      case 'fees':
        return store.receipts.map(rc => ({
          'Receipt No': rc.receiptNo,
          'Admission No': rc.admissionNo,
          'Student Name': rc.studentName,
          'Class': rc.class,
          'Payment Date': rc.paymentDate,
          'Amount Paid (INR)': rc.paidAmount,
          'Remaining Balance': rc.remainingBalance,
          'Payment Mode': rc.paymentMethod,
          'Transaction Ref': rc.transactionRef,
          'Status': rc.status
        }));
      case 'payroll':
        return store.staff.map(st => ({
          'Employee ID': st.id,
          'Employee Name': st.name,
          'Department': st.department,
          'Role': st.role,
          'Basic Pay (INR)': st.basicSalary,
          'Allowances': st.allowances,
          'Deductions': st.deductions,
          'Net Salary': (st.basicSalary + st.allowances) - st.deductions,
          'Status': st.status
        }));
      case 'transport':
        return store.transport.routes.map(rt => ({
          'Route ID': rt.id,
          'Route Name': rt.routeName,
          'Assigned Vehicle': rt.vehicleNo,
          'Driver Name': rt.driverName,
          'Driver Contact': rt.driverPhone,
          'Morning Departure': rt.morningDeparture,
          'Afternoon Drop': rt.afternoonDrop
        }));
      case 'hostel':
        return store.hostel.rooms.map(rm => ({
          'Room ID': rm.id,
          'Building Name': rm.buildingName,
          'Room Number': rm.roomNumber,
          'Type': rm.type,
          'Capacity': rm.capacity,
          'Occupancy': `${rm.occupied}/${rm.capacity}`,
          'Term Fee': rm.feePerTerm
        }));
      case 'library':
        return store.books.map(bk => ({
          'Book Code': bk.bookCode,
          'Title': bk.title,
          'Author': bk.author,
          'ISBN': bk.isbn,
          'Category': bk.category,
          'Total Copies': bk.totalCopies,
          'Available Copies': bk.availableCopies,
          'Shelf Location': bk.location
        }));
      case 'inventory':
        return store.inventory.map(inv => ({
          'Asset ID': inv.id,
          'Item Name': inv.itemName,
          'Category': inv.category,
          'Quantity': `${inv.quantity} ${inv.unit}`,
          'Location': inv.location,
          'Supplier': inv.supplier,
          'Status': inv.status
        }));
      default:
        return [];
    }
  };

  const handleDownloadCSV = () => {
    if (!selectedCategory) return;
    const data = getCategoryData(selectedCategory.id);
    exportToCSV(data, `${selectedCategory.id}_report_${new Date().toISOString().split('T')[0]}.csv`);
    showToast(`${selectedCategory.label} exported to CSV successfully!`, 'success');
  };

  const handleDownloadJSON = () => {
    if (!selectedCategory) return;
    const data = getCategoryData(selectedCategory.id);
    exportToJSON(data, `${selectedCategory.id}_report_${new Date().toISOString().split('T')[0]}.json`);
    showToast(`${selectedCategory.label} exported to JSON successfully!`, 'success');
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Reports Hub" 
        subtitle="Access school-wide database metrics, download live audit summaries, and export spreadsheets."
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
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 hover:shadow-md rounded-2xl p-5 cursor-pointer flex items-start gap-4 transition-all"
              >
                <div className="p-3 bg-indigo-50 dark:bg-indigo-950 text-indigo-650 dark:text-indigo-400 rounded-xl shrink-0">
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
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <button
              onClick={() => setSelectedCategory(null)}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Report Categories</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">Category:</span>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-1 rounded-lg">
                {selectedCategory.label}
              </span>
            </div>
          </div>

          {/* Live Data Preview Table */}
          <div className="overflow-x-auto border border-border rounded-2xl max-h-96">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-border sticky top-0">
                <tr>
                  {Object.keys(getCategoryData(selectedCategory.id)[0] || {}).map((h, i) => (
                    <th key={i} className="p-3 text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {getCategoryData(selectedCategory.id).slice(0, 15).map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    {Object.values(row).map((val, cIdx) => (
                      <td key={cIdx} className="p-3 text-slate-700 dark:text-slate-300 font-medium">
                        {String(val)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Export triggers */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 border-t border-border">
            <span className="text-xs font-semibold text-slate-500">
              Showing top records. Total available: <strong>{getCategoryData(selectedCategory.id).length} rows</strong>
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPrintModalOpen(true)}
                className="flex items-center justify-center gap-1.5 px-4 py-2 border border-border hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 transition-all"
              >
                <Printer className="w-3.5 h-3.5 text-indigo-500" />
                <span>Print Official PDF Document</span>
              </button>
              <button
                onClick={handleDownloadJSON}
                className="flex items-center justify-center gap-1.5 px-4 py-2 border border-border hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 transition-all"
              >
                <Download className="w-3.5 h-3.5 text-cyan-600" />
                <span>Export JSON</span>
              </button>
              <button
                onClick={handleDownloadCSV}
                className="flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download CSV / Excel</span>
              </button>
            </div>
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
          data={getCategoryData(selectedCategory.id)}
        >
          <div className="space-y-6">
            <div className="text-center pb-4 border-b border-border">
              <h2 className="text-xl font-black">Greenfield Public School</h2>
              <p className="text-xs text-slate-500">Affiliated to CBSE | Sector 15, Dwarka, New Delhi</p>
              <h3 className="text-sm font-bold text-indigo-600 mt-2">{selectedCategory.label}</h3>
              <span className="text-[10px] text-slate-400">Generated on: {new Date().toLocaleDateString()}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b">
                    {Object.keys(getCategoryData(selectedCategory.id)[0] || {}).map((h, i) => (
                      <th key={i} className="p-2 font-bold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {getCategoryData(selectedCategory.id).map((r, i) => (
                    <tr key={i}>
                      {Object.values(r).map((v, idx) => (
                        <td key={idx} className="p-2">{String(v)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between pt-8 text-xs font-bold text-slate-500">
              <span>Prepared by: School Administration</span>
              <span>Authorized Signature: __________________</span>
            </div>
          </div>
        </PrintReportModal>
      )}

      <ToastComponent />
    </div>
  );
};
export default ReportsHub;
