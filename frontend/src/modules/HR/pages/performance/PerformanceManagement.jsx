import React, { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Tabs } from '../../components/ui/Tabs';
import { DataTable } from '../../components/ui/DataTable';
import { useToast } from '../../components/ui/Toast';
import { MOCK_REVIEWS, MOCK_EMPLOYEES } from '../../utils/constants';
import { Award, Plus } from 'lucide-react';

export const PerformanceManagement = () => {
  const [activeTab, setActiveTab] = useState('list');
  const { showToast, ToastComponent } = useToast();
  const [reviews, setReviews] = useState(MOCK_REVIEWS);

  // Form State
  const [employeeName, setEmployeeName] = useState('');
  const [rating, setRating] = useState(4.5);
  const [remarks, setRemarks] = useState('');

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!employeeName || !remarks) return;

    const newReview = {
      id: `REV-00${reviews.length + 1}`,
      employeeName,
      rating: Number(rating),
      remarks
    };

    setReviews([newReview, ...reviews]);
    showToast(`Performance review submitted for ${employeeName}!`, 'success');
    setActiveTab('list');

    // Reset Form
    setEmployeeName('');
    setRemarks('');
  };

  const columns = [
    { key: 'id', title: 'Review ID', sortable: true },
    { key: 'employeeName', title: 'Employee Name', sortable: true },
    { 
      key: 'rating', 
      title: 'Performance Rating Score', 
      sortable: true,
      render: (val) => (
        <span className="font-bold flex items-center gap-1 text-amber-500">
          <Award className="w-4 h-4 shrink-0" />
          <span>{val} / 5</span>
        </span>
      )
    },
    { key: 'remarks', title: 'Review Evaluation Remarks' }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Performance & Staff Appraisals" 
        subtitle="Submit Q1/Q2 staff performance scorecards, write review remarks, and rate designations." 
      />

      <Tabs 
        tabs={[
          { id: 'list', label: 'Evaluation Records History' },
          { id: 'add', label: 'Record Performance Evaluation' }
        ]} 
        activeTab={activeTab} 
        onChange={setActiveTab} 
      />

      {activeTab === 'list' && (
        <DataTable 
          columns={columns} 
          data={reviews} 
          searchPlaceholder="Search reviews..."
          searchKey="employeeName"
        />
      )}

      {activeTab === 'add' && (
        <form onSubmit={handleSubmitReview} className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4 text-xs text-left font-semibold">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label>Select Target Employee File</label>
              <select
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
                required
                className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border focus:outline-none focus:ring-1 focus:ring-rose-605 cursor-pointer"
              >
                <option value="">-- Choose Employee --</option>
                {MOCK_EMPLOYEES.map(e => (
                  <option key={e.id} value={e.name}>{e.name} ({e.designation})</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label>Punctuality & Overall Score Rating (1 - 5)</label>
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border cursor-pointer focus:outline-none focus:ring-1 focus:ring-rose-650"
              >
                <option value="5">5 - Outstanding Excellence</option>
                <option value="4.5">4.5 - Highly Exceeds Expectation</option>
                <option value="4">4 - Exceeds Expectation</option>
                <option value="3.5">3.5 - Meets Expectation</option>
                <option value="3">3 - Needs Improvement</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label>Performance Review remarks justification</label>
            <textarea
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Provide a detailed performance evaluation summary..."
              required
              className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border focus:outline-none focus:ring-1 focus:ring-rose-605"
            />
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2.5 bg-rose-600 hover:bg-rose-750 text-white rounded-xl font-bold shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Record Appraisal Review</span>
            </button>
          </div>
        </form>
      )}

      <ToastComponent />
    </div>
  );
};
export default PerformanceManagement;
