import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { FilterBar } from '../components/ui/FilterBar';
import { FileUpload } from '../components/ui/FileUpload';
import { useToast } from '../components/ui/Toast';
import { EmptyState } from '../components/ui/EmptyState';
import { mockLeave } from '../data/mockData';
import { LEAVE_TYPES } from '../utils/constants';
import { FilePlus, Clock, CheckCircle, XCircle, Calendar, Check, X } from 'lucide-react';

const statusVariant = { Approved: 'success', Pending: 'warning', Rejected: 'danger' };
const statusIcon = {
  Approved: <CheckCircle className="w-4 h-4 text-emerald-500" />,
  Pending: <Clock className="w-4 h-4 text-amber-500" />,
  Rejected: <XCircle className="w-4 h-4 text-rose-500" />,
};

export const TeacherLeave = () => {
  const toast = useToast();
  const [tab, setTab] = useState('apply');
  const [form, setForm] = useState({ type: LEAVE_TYPES[0], from: '', to: '', reason: '' });
  const [loading, setLoading] = useState(false);

  const [studentLeaves, setStudentLeaves] = useState(() => {
    const stored = localStorage.getItem('school_student_leaves');
    if (stored) return JSON.parse(stored);
    return [];
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem('school_student_leaves');
      if (stored) setStudentLeaves(JSON.parse(stored));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.from || !form.to) { toast.error('Please select leave dates'); return; }
    if (new Date(form.to) < new Date(form.from)) { toast.error('End date must be after start date'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    toast.success('Leave application submitted successfully!');
    setForm({ type: LEAVE_TYPES[0], from: '', to: '', reason: '' });
  };

  const handleResolveLeave = (leaveId, status) => {
    const updated = studentLeaves.map(lv => {
      if (lv.id === leaveId) {
        return {
          ...lv,
          status,
          comments: `${status} by Class Teacher Mr. Rajesh Kumar`
        };
      }
      return lv;
    });
    setStudentLeaves(updated);
    localStorage.setItem('school_student_leaves', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
    toast.success(`Student leave application ${status.toLowerCase()}!`);
  };

  const balance = mockLeave.balance;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-black text-foreground">Leave Management</h2>
        <p className="text-xs text-slate-500 mt-0.5">Apply for leave and track your application status</p>
      </div>

      <FilterBar
        filters={[
          { value: 'apply', label: 'Apply Leave' },
          { value: 'balance', label: 'Leave Balance' },
          { value: 'history', label: 'History' },
          { value: 'student_leaves', label: `Student Leaves (${studentLeaves.filter(l => l.status === 'Pending').length})` },
        ]}
        active={tab}
        onChange={setTab}
      />

      {/* Apply Leave */}
      {tab === 'apply' && (
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-primary/10 rounded-2xl text-primary">
              <FilePlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">New Leave Application</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">All fields are required</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Leave Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm(p => ({ ...p, type: e.target.value }))}
                className="w-full px-4 py-3 rounded-2xl border border-border bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                id="leave-type"
              >
                {LEAVE_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">From Date</label>
                <input
                  type="date"
                  required
                  value={form.from}
                  onChange={(e) => setForm(p => ({ ...p, from: e.target.value }))}
                  className="w-full px-4 py-3 rounded-2xl border border-border bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  id="leave-from"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">To Date</label>
                <input
                  type="date"
                  required
                  value={form.to}
                  onChange={(e) => setForm(p => ({ ...p, to: e.target.value }))}
                  className="w-full px-4 py-3 rounded-2xl border border-border bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  id="leave-to"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Reason</label>
              <textarea
                required
                rows={4}
                value={form.reason}
                onChange={(e) => setForm(p => ({ ...p, reason: e.target.value }))}
                placeholder="Provide a detailed reason for leave..."
                className="w-full px-4 py-3 rounded-2xl border border-border bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                id="leave-reason"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Supporting Document (Optional)</label>
              <FileUpload label="Upload Document" maxFiles={1} accept=".pdf,.jpg,.png" />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover disabled:opacity-70 text-white py-3.5 rounded-2xl text-sm font-bold shadow-premium transition-all active:scale-95 select-none"
              id="leave-submit"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <><FilePlus className="w-4 h-4" /> Submit Application</>
              )}
            </button>
          </form>
        </Card>
      )}

      {/* Leave Balance */}
      {tab === 'balance' && (
        <div className="space-y-4">
          {Object.entries(balance).map(([type, data]) => {
            const labels = { casual: 'Casual Leave', medical: 'Medical Leave', emergency: 'Emergency Leave', earned: 'Earned Leave' };
            const colors = { casual: 'bg-primary', medical: 'bg-emerald-500', emergency: 'bg-rose-500', earned: 'bg-amber-500' };
            const remaining = data.total - data.used;
            const pct = ((remaining / data.total) * 100).toFixed(0);
            return (
              <Card key={type}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-foreground">{labels[type]}</h4>
                  <div className="text-right">
                    <span className="text-lg font-black text-foreground">{remaining}</span>
                    <span className="text-xs text-slate-400"> / {data.total}</span>
                    <p className="text-[10px] text-slate-400">remaining</p>
                  </div>
                </div>
                <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${colors[type]}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[10px] text-slate-400">Used: {data.used}</span>
                  <span className="text-[10px] text-slate-400">{pct}% remaining</span>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* History */}
      {tab === 'history' && (
        <div className="space-y-3">
          {mockLeave.history.map(lv => (
            <Card key={lv.id}>
              <div className="flex items-start gap-4">
                <div className="shrink-0 mt-0.5">
                  {statusIcon[lv.status]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <Badge variant={statusVariant[lv.status] || 'default'}>{lv.status}</Badge>
                    <Badge variant="info">{lv.type}</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{lv.from} → {lv.to}</span>
                    <span className="font-bold text-foreground">({lv.days} day{lv.days > 1 ? 's' : ''})</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{lv.reason}</p>
                  {lv.remark && (
                    <p className="text-[10px] text-rose-500 mt-1 font-medium">Remark: {lv.remark}</p>
                  )}
                  <p className="text-[10px] text-slate-400 mt-1">Applied: {lv.appliedOn}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Student Leaves Tab */}
      {tab === 'student_leaves' && (
        <div className="space-y-4">
          {studentLeaves.length === 0 ? (
            <EmptyState
              title="No student leaves"
              description="No student leave applications exist."
              icon={Calendar}
            />
          ) : (
            studentLeaves.map(lv => (
              <Card key={lv.id} className="border border-border">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 mt-0.5">
                    {statusIcon[lv.status]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-black text-foreground">Aarav Sharma</h4>
                        <Badge variant={statusVariant[lv.status] || 'default'}>{lv.status}</Badge>
                      </div>
                      <span className="text-[9px] text-slate-400">ID: {lv.id}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 mb-2">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{lv.startDate} → {lv.endDate}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 italic">" {lv.reason} "</p>
                    {lv.comments && (
                      <p className="text-[10px] text-primary mt-2 font-bold">Feedback: {lv.comments}</p>
                    )}

                    {lv.status === 'Pending' && (
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => handleResolveLeave(lv.id, 'Approved')}
                          className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500 text-white rounded-xl text-[10px] font-bold shadow-sm hover:bg-emerald-600 active:scale-95 transition-all"
                        >
                          <Check className="w-3 h-3" /> Approve
                        </button>
                        <button
                          onClick={() => handleResolveLeave(lv.id, 'Rejected')}
                          className="flex items-center gap-1 px-3 py-1.5 bg-rose-500 text-white rounded-xl text-[10px] font-bold shadow-sm hover:bg-rose-600 active:scale-95 transition-all"
                        >
                          <X className="w-3 h-3" /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};
