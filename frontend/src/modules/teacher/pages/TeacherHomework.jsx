import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { FilterBar } from '../components/ui/FilterBar';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { FileUpload } from '../components/ui/FileUpload';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { useToast } from '../components/ui/Toast';
import { mockHomework, mockClasses } from '../data/mockData';
import {
  BookOpen, Plus, Clock, Users, CheckCircle, Edit3, Trash2,
  Send, ChevronRight, FileText, Eye
} from 'lucide-react';

const statusVariant = { Active: 'success', Pending: 'warning', Submitted: 'info', Closed: 'default' };

export const TeacherHomework = () => {
  const toast = useToast();
  const [tab, setTab] = useState('active');
  const [showCreate, setShowCreate] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selectedHw, setSelectedHw] = useState(null);
  const [evaluating, setEvaluating] = useState(null);

  const [evalMarks, setEvalMarks] = useState('');
  const [evalFeedback, setEvalFeedback] = useState('');

  const [homeworkList, setHomeworkList] = useState(() => {
    const stored = localStorage.getItem('school_homework');
    if (stored) return JSON.parse(stored);
    localStorage.setItem('school_homework', JSON.stringify(mockHomework));
    return mockHomework;
  });

  const [form, setForm] = useState({
    title: '', class: mockClasses[0].id, section: 'A', subject: 'Mathematics',
    instructions: '', dueDate: '', isDraft: false,
  });

  // Sync state with localStorage changes in other contexts/tabs
  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem('school_homework');
      if (stored) setHomeworkList(JSON.parse(stored));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const activeHw = homeworkList.filter(h => h.status === 'Active' || h.status === 'Pending' || h.status === 'Submitted');

  // A student submission is pending evaluation if student has submitted it but marks are not yet assigned
  const pendingEvalSubmissions = homeworkList
    .filter(h => h.submission && !h.submission.marks)
    .map(h => ({
      hwId: h.id,
      title: h.title || h.description.substring(0, 35) + '...',
      subject: h.subject,
      student: {
        id: 'STU108902',
        name: 'Aarav Sharma',
        photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80',
      },
      submittedAt: h.submission.submittedAt,
      fileName: h.submission.fileName
    }));

  const handleCreate = (e) => {
    e.preventDefault();
    const newHw = {
      id: `hw-${Math.floor(100 + Math.random() * 900)}`,
      subject: form.subject,
      teacher: 'Mr. Rajesh Kumar',
      title: form.title,
      description: form.instructions,
      instructions: form.instructions,
      dueDate: form.dueDate || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      status: form.isDraft ? 'Draft' : 'Pending',
      priority: 'Medium',
      attachments: []
    };

    const updated = [newHw, ...homeworkList];
    setHomeworkList(updated);
    localStorage.setItem('school_homework', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));

    toast.success(form.isDraft ? 'Homework saved as draft!' : 'Homework published successfully!');
    setShowCreate(false);
    setForm({
      title: '', class: mockClasses[0].id, section: 'A', subject: 'Mathematics',
      instructions: '', dueDate: '', isDraft: false,
    });
  };

  const handleEvaluateSubmit = () => {
    if (!evaluating) return;
    const updated = homeworkList.map(h => {
      if (h.id === evaluating.hwId) {
        return {
          ...h,
          submission: {
            ...h.submission,
            marks: `${evalMarks}/10`,
            feedback: evalFeedback
          }
        };
      }
      return h;
    });

    setHomeworkList(updated);
    localStorage.setItem('school_homework', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));

    toast.success('Evaluation submitted successfully!');
    setEvaluating(null);
    setEvalMarks('');
    setEvalFeedback('');
  };

  const handleDelete = (id) => {
    const updated = homeworkList.filter(h => h.id !== id);
    setHomeworkList(updated);
    localStorage.setItem('school_homework', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
    toast.success('Homework deleted successfully.');
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-foreground">Homework</h2>
          <p className="text-xs text-slate-500 mt-0.5">Create, manage and evaluate assignments</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-xs font-bold shadow-premium hover:bg-primary-hover active:scale-95 transition-all select-none"
          id="homework-create-btn"
        >
          <Plus className="w-4 h-4" /> Create
        </button>
      </div>

      <FilterBar
        filters={[
          { value: 'active', label: 'Active & Pending' },
          { value: 'evaluate', label: `Pending Eval. (${pendingEvalSubmissions.length})` },
          { value: 'history', label: 'History' },
        ]}
        active={tab}
        onChange={setTab}
      />

      {/* Active Homework */}
      {tab === 'active' && (
        <div className="space-y-4">
          {activeHw.length === 0 ? (
            <EmptyState title="No active homework" description="Create your first homework assignment" icon={BookOpen} action={() => setShowCreate(true)} actionLabel="Create Homework" />
          ) : (
            activeHw.map(hw => (
              <Card key={hw.id}>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-500 shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <Badge variant={statusVariant[hw.status] || 'default'}>{hw.status}</Badge>
                      <Badge variant="info">{hw.class || 'Class 10 - Sec A'}</Badge>
                      <Badge variant="purple">{hw.subject}</Badge>
                    </div>
                    <h4 className="text-sm font-bold text-foreground mt-1 mb-0.5">{hw.title || hw.description.substring(0, 45) + '...'}</h4>
                    <p className="text-[10px] text-slate-400 line-clamp-1">{hw.description}</p>

                    {/* Stats */}
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-[10px] text-slate-500">
                          {hw.submission ? '1' : '0'}/45 Submitted
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-[10px] text-slate-500">
                          {hw.submission?.marks ? '1' : '0'} Evaluated
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-rose-400" />
                        <span className="text-[10px] text-slate-500">Due: {hw.dueDate}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <button onClick={() => setSelectedHw(hw)} className="p-2 rounded-xl text-sky-500 bg-sky-500/10 hover:bg-sky-500/20 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => setDeleteTarget(hw)} className="p-2 rounded-xl text-rose-500 bg-rose-500/10 hover:bg-rose-500/20 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Pending Evaluation */}
      {tab === 'evaluate' && (
        <div className="space-y-4">
          {pendingEvalSubmissions.length === 0 ? (
            <EmptyState title="All caught up!" description="No student submissions pending evaluation right now." icon={CheckCircle} />
          ) : (
            pendingEvalSubmissions.map(sub => (
              <Card key={sub.hwId}>
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-border">
                  <div>
                    <h4 className="text-xs font-bold text-foreground">{sub.title}</h4>
                    <p className="text-[10px] text-slate-400">{sub.subject}</p>
                  </div>
                  <Badge variant="warning">Submitted</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-slate-50/50 dark:bg-slate-900/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl overflow-hidden shrink-0">
                      <img src={sub.student.photo} alt={sub.student.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-foreground">{sub.student.name}</h5>
                      <p className="text-[10px] text-slate-400">File: {sub.fileName}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setEvaluating(sub)}
                    className="px-3 py-1.5 bg-primary text-white rounded-xl text-[10px] font-bold hover:bg-primary-hover transition-colors"
                  >
                    Evaluate
                  </button>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* History */}
      {tab === 'history' && (
        <div className="space-y-3">
          {homeworkList.map(hw => (
            <Card key={hw.id}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={statusVariant[hw.status] || 'default'}>{hw.status}</Badge>
                    <Badge variant="info">{hw.subject}</Badge>
                  </div>
                  <h4 className="text-xs font-bold text-foreground">{hw.title || hw.description.substring(0, 45) + '...'}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Due: {hw.dueDate}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Homework Modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create Homework" size="lg">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Class</label>
              <select
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                id="hw-class-select"
                value={form.class}
                onChange={(e) => setForm(p => ({ ...p, class: e.target.value }))}
              >
                {mockClasses.map(c => <option key={c.id} value={c.id}>{c.name} - {c.section}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Subject</label>
              <select 
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20" 
                id="hw-subject-select"
                value={form.subject}
                onChange={(e) => setForm(p => ({ ...p, subject: e.target.value }))}
              >
                <option>Mathematics</option>
                <option>Science</option>
                <option>English</option>
                <option>Social Science</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Due Date</label>
              <input 
                type="date" 
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20" 
                id="hw-due-date"
                value={form.dueDate}
                onChange={(e) => setForm(p => ({ ...p, dueDate: e.target.value }))}
              />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Title</label>
            <input 
              type="text" 
              required 
              placeholder="e.g. Chapter 5 Exercise 5.3" 
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20" 
              id="hw-title" 
              value={form.title}
              onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Instructions</label>
            <textarea 
              rows={4} 
              placeholder="Detailed instructions for students..." 
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" 
              id="hw-instructions" 
              value={form.instructions}
              onChange={(e) => setForm(p => ({ ...p, instructions: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Attachments</label>
            <FileUpload label="Upload Reference Files" maxFiles={3} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowCreate(false)} className="flex-1 py-2.5 rounded-xl border border-border text-xs font-semibold text-slate-600 dark:text-slate-400">Cancel</button>
            <button type="button" onClick={() => handleCreate({ ...form, isDraft: true })} className="flex-1 py-2.5 rounded-xl bg-slate-700 text-white text-xs font-bold hover:bg-slate-600 active:scale-95">Save Draft</button>
            <button onClick={handleCreate} className="flex-1 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-premium hover:bg-primary-hover active:scale-95" id="hw-publish">Publish</button>
          </div>
        </form>
      </Modal>

      {/* Evaluation Modal */}
      <Modal isOpen={!!evaluating} onClose={() => setEvaluating(null)} title="Evaluate Submission" size="md">
        {evaluating && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl">
              <img src={evaluating.student.photo} alt={evaluating.student.name} className="w-12 h-12 rounded-xl object-cover" />
              <div>
                <h4 className="text-sm font-bold text-foreground">{evaluating.student.name}</h4>
                <p className="text-[10px] text-slate-400">File: {evaluating.fileName}</p>
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Marks (out of 10)</label>
              <input 
                type="number" 
                min={0} 
                max={10} 
                placeholder="Enter marks" 
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" 
                id="eval-marks" 
                value={evalMarks}
                onChange={(e) => setEvalMarks(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Feedback</label>
              <textarea 
                rows={3} 
                placeholder="Write feedback for the student..." 
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" 
                id="eval-feedback" 
                value={evalFeedback}
                onChange={(e) => setEvalFeedback(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setEvaluating(null)} className="flex-1 py-2.5 rounded-xl border border-border text-xs font-semibold text-slate-600 dark:text-slate-400">Cancel</button>
              <button onClick={handleEvaluateSubmit} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-premium hover:bg-primary-hover active:scale-95" id="eval-submit">
                <Send className="w-3.5 h-3.5" /> Submit Evaluation
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Detail View Modal */}
      <Modal isOpen={!!selectedHw} onClose={() => setSelectedHw(null)} title="Homework Details" size="md">
        {selectedHw && (
          <div className="space-y-4">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Subject</span>
              <p className="text-xs font-bold text-foreground">{selectedHw.subject}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Title</span>
              <p className="text-xs font-bold text-foreground">{selectedHw.title || selectedHw.description.substring(0, 45)}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Instructions</span>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{selectedHw.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Due Date</span>
                <p className="text-xs font-bold text-foreground">{selectedHw.dueDate}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Status</span>
                <p className="text-xs font-bold text-foreground">{selectedHw.status}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Homework?"
        message={`Are you sure you want to delete this homework? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={() => handleDelete(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
        variant="danger"
      />
    </div>
  );
};
