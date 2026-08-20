import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { useToast } from '../../components/ui/Toast';
import { hrApi } from '../../../../shared/api/client';
import { Award, Plus, RefreshCw, Star, Trash2, Users } from 'lucide-react';

export const PerformanceManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState({ totalReviews: 0, averageRating: 0, breakdown: {} });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [selectedEmpId, setSelectedEmpId] = useState('');
  const [reviewPeriod, setReviewPeriod] = useState('2026 Q1 Appraisal');
  const [rating, setRating] = useState(5);
  const [strengths, setStrengths] = useState('');
  const [areasOfImprovement, setAreasOfImprovement] = useState('');
  const [goals, setGoals] = useState('');
  const [comments, setComments] = useState('');

  const { showToast, ToastComponent } = useToast();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const [revRes, empRes] = await Promise.all([
        hrApi.reviews(),
        hrApi.employees({ limit: 200 }),
      ]);
      if (revRes?.success) {
        setReviews(revRes.data || []);
        if (revRes.stats) setStats(revRes.stats);
      }
      if (empRes?.success) {
        setEmployees(empRes.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!selectedEmpId) return;

    setSubmitting(true);
    try {
      const emp = employees.find((e) => e.id === selectedEmpId);
      const payload = {
        employeeRefId: selectedEmpId,
        employeeType: emp?.employeeType || 'STAFF',
        employeeId: emp?.employeeId || 'EMP',
        employeeName: emp?.name || 'Staff',
        department: emp?.department || '',
        designation: emp?.designation || '',
        reviewPeriod,
        rating: Number(rating),
        strengths: strengths.trim(),
        areasOfImprovement: areasOfImprovement.trim(),
        goals: goals.trim(),
        comments: comments.trim(),
      };

      const res = await hrApi.createReview(payload);
      setReviews((prev) => [res.data, ...prev]);
      showToast(`Performance appraisal recorded for ${emp?.name}!`, 'success');
      setShowModal(false);
      fetchReviews();
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Failed to submit review', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (id) => {
    try {
      await hrApi.deleteReview(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
      showToast('Appraisal record deleted.', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Failed to delete review', 'error');
    }
  };

  return (
    <div className="space-y-6 text-xs font-semibold">
      <PageHeader
        title="Faculty & Staff Performance Appraisals"
        subtitle="Manage quarterly evaluation scorecards, competencies reviews, and annual institutional appraisal rankings."
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={fetchReviews}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Record Appraisal</span>
            </button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400">Total Appraisals Conducted</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {stats.totalReviews || 0}
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <span className="text-[11px] font-bold text-amber-500">Average School-wide Score</span>
          <div className="text-2xl font-black text-amber-500 mt-1 flex items-center gap-1.5">
            <Star className="w-5 h-5 fill-amber-500" />
            <span>{stats.averageRating || 0} / 5.0</span>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">5-Star Top Performers</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {stats.breakdown?.[5] || 0} Staff
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 p-4 rounded-2xl text-rose-700 dark:text-rose-400 text-xs font-semibold flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchReviews} className="underline font-bold cursor-pointer">Retry</button>
        </div>
      )}

      {/* Reviews Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="h-12 bg-slate-100 dark:bg-slate-800/60 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <Award className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700" />
            <p>No appraisal records found. Click "Record Appraisal" to score staff performance.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 text-[11px]">
                  <th className="py-3">Staff Member</th>
                  <th>Department</th>
                  <th>Cycle Period</th>
                  <th>Rating</th>
                  <th>Key Strengths & Goals</th>
                  <th>Evaluator</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-850">
                {reviews.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/50 transition-colors">
                    <td className="py-3.5 font-bold text-slate-900 dark:text-white">
                      <div>
                        <span>{r.employeeName}</span>
                        <span className="text-[10px] text-slate-400 font-mono block">{r.employeeId}</span>
                      </div>
                    </td>
                    <td className="text-slate-600 dark:text-slate-400">{r.department || 'General'}</td>
                    <td className="text-slate-700 dark:text-slate-300 font-semibold">{r.reviewPeriod}</td>
                    <td>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-black text-xs">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        <span>{r.rating} / 5</span>
                      </span>
                    </td>
                    <td className="text-slate-500 max-w-xs truncate">
                      {r.strengths || r.comments || r.goals || '—'}
                    </td>
                    <td className="text-slate-400 text-[11px]">{r.reviewerName || 'HR Evaluator'}</td>
                    <td className="text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteReview(r.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                        title="Delete Appraisal"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Record Appraisal Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-100">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              Record Faculty / Staff Performance Appraisal
            </h3>

            <form onSubmit={handleSubmitReview} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-slate-700 dark:text-slate-300 font-bold">Select Staff Member *</label>
                <select
                  required
                  value={selectedEmpId}
                  onChange={(e) => setSelectedEmpId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-xs font-semibold cursor-pointer"
                >
                  <option value="">Choose an employee...</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.employeeId || 'ID'}) • {emp.department}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700 dark:text-slate-300 font-bold">Appraisal Cycle *</label>
                  <input
                    type="text"
                    required
                    value={reviewPeriod}
                    onChange={(e) => setReviewPeriod(e.target.value)}
                    placeholder="e.g. 2026 Q1"
                    className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-xs font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 dark:text-slate-300 font-bold">Overall Rating (1 - 5) *</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-xs font-bold cursor-pointer"
                  >
                    <option value="5">★★★★★ (5.0 - Exceptional)</option>
                    <option value="4">★★★★☆ (4.0 - Exceeds Expectations)</option>
                    <option value="3">★★★☆☆ (3.0 - Meets Expectations)</option>
                    <option value="2">★★☆☆☆ (2.0 - Needs Improvement)</option>
                    <option value="1">★☆☆☆☆ (1.0 - Unsatisfactory)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 dark:text-slate-300 font-bold">Key Strengths & Contributions</label>
                <textarea
                  value={strengths}
                  onChange={(e) => setStrengths(e.target.value)}
                  rows="2"
                  placeholder="Notable strengths, student pass rates, punctual habits..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 dark:text-slate-300 font-bold">Goals for Next Quarter</label>
                <textarea
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                  rows="2"
                  placeholder="Target competencies, pedagogy workshops..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-xs cursor-pointer disabled:opacity-60"
                >
                  {submitting ? 'Saving...' : 'Save Appraisal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastComponent />
    </div>
  );
};
export default PerformanceManagement;
