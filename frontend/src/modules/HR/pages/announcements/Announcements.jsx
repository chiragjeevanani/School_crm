import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { useToast } from '../../components/ui/Toast';
import { hrApi } from '../../../../shared/api/client';
import { Megaphone, Plus, RefreshCw, Send, AlertCircle, Users } from 'lucide-react';

export const Announcements = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [targetAudience, setTargetAudience] = useState('all');
  const [body, setBody] = useState('');

  const { showToast, ToastComponent } = useToast();

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await hrApi.announcements();
      if (res?.success) {
        setNotices(res.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  const handlePostNotice = async (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    setSubmitting(true);
    try {
      let audiences = ['staff', 'teacher', 'hr'];
      if (targetAudience === 'teachers') audiences = ['teacher'];
      else if (targetAudience === 'staff') audiences = ['staff'];

      const res = await hrApi.createAnnouncement({
        title: title.trim(),
        body: body.trim(),
        audiences,
      });

      if (res?.success) {
        setNotices((prev) => [res.data, ...prev]);
        showToast(`Announcement "${title}" published successfully!`, 'success');
        setTitle('');
        setBody('');
      }
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Failed to publish announcement', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 text-xs font-semibold">
      <PageHeader
        title="Institutional Announcements & Staff Notices"
        subtitle="Broadcast administrative circulars, holiday memos, and institutional notices across staff portals."
        actions={
          <button
            onClick={fetchAnnouncements}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        }
      />

      {error && (
        <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 p-4 rounded-2xl text-rose-700 dark:text-rose-400 text-xs font-semibold flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchAnnouncements} className="underline font-bold cursor-pointer">Retry</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Post Form */}
        <form
          onSubmit={handlePostNotice}
          className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4 text-left lg:col-span-1"
        >
          <span className="text-[10px] font-bold uppercase text-slate-400 block border-b border-slate-100 dark:border-slate-800 pb-2">
            Publish New Announcement
          </span>

          <div className="space-y-1">
            <label className="text-slate-700 dark:text-slate-300 font-bold">Notice Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="e.g. Independence Day Campus Assembly..."
              className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-700 dark:text-slate-300 font-bold">Target Audience</label>
            <select
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 text-xs font-semibold cursor-pointer"
            >
              <option value="all">All School Staff & Faculty</option>
              <option value="teachers">Teaching Faculty Only</option>
              <option value="staff">Non-Teaching Staff Only</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-slate-700 dark:text-slate-300 font-bold">Notice Content / Body *</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              rows="4"
              placeholder="Full details of the announcement..."
              className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 text-xs"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-60"
          >
            <Send className="w-4 h-4" />
            <span>{submitting ? 'Publishing...' : 'Broadcast Notice'}</span>
          </button>
        </form>

        {/* Notices Feed */}
        <div className="lg:col-span-2 space-y-4">
          <span className="text-[10px] font-bold uppercase text-slate-400 block px-1">
            Active Notice Board Feed ({notices.length})
          </span>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-28 bg-slate-100 dark:bg-slate-800/60 rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : notices.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-12 text-center text-slate-400 space-y-2">
              <Megaphone className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700" />
              <p>No announcements published yet.</p>
            </div>
          ) : (
            notices.map((n) => (
              <div
                key={n.id}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-3 text-left hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{n.title}</h4>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Published {n.createdAt ? new Date(n.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'} by {n.createdBy || 'HR Desk'}
                    </span>
                  </div>
                  <span className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 rounded-lg text-[10px] font-bold uppercase shrink-0">
                    {(n.audiences || []).join(', ') || 'All Staff'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {n.body}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      <ToastComponent />
    </div>
  );
};
export default Announcements;
