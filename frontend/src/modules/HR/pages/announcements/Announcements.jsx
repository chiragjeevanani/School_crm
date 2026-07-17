import React, { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { useToast } from '../../components/ui/Toast';
import { Megaphone, Plus } from 'lucide-react';

export const Announcements = () => {
  const { showToast, ToastComponent } = useToast();
  const [notices, setNotices] = useState([
    { id: '1', title: 'Summer Holiday Notice', content: 'School campus closed for summer holidays from June 1st to July 5th.', target: 'All Staff', date: '2026-05-25' },
    { id: '2', title: 'Weekly Academics HOD Meeting', content: 'HOD assembly regarding syllabus updates scheduled in principal cabin.', target: 'HODs only', date: '2026-07-16' }
  ]);

  // Form State
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('All Staff');
  const [content, setContent] = useState('');

  const handlePostNotice = (e) => {
    e.preventDefault();
    if (!title || !content) return;

    const newNotice = {
      id: Date.now().toString(),
      title,
      target,
      content,
      date: new Date().toISOString().split('T')[0]
    };

    setNotices([newNotice, ...notices]);
    showToast(`Notice "${title}" posted successfully!`, 'success');

    // Reset Form
    setTitle('');
    setContent('');
  };

  return (
    <div className="space-y-6 text-xs font-semibold">
      <PageHeader 
        title="School Notice Board" 
        subtitle="Broadcast department circulars, calendar updates, and publish emergency announcements." 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Form */}
        <form onSubmit={handlePostNotice} className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4 text-left lg:col-span-1">
          <span className="text-[10px] font-black uppercase text-slate-400 block border-b pb-2">Post New Announcement</span>
          
          <div className="space-y-1">
            <label>Announcement Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="e.g. Independence Day celebration..."
              className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border focus:outline-none focus:ring-1 focus:ring-rose-605"
            />
          </div>

          <div className="space-y-1">
            <label>Target Audience group</label>
            <select
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-955 p-2.5 rounded-xl border cursor-pointer focus:outline-none focus:ring-1 focus:ring-rose-650"
            >
              <option value="All Staff">All Greenfield Staff</option>
              <option value="Teachers">Academics Division (Teachers)</option>
              <option value="Librarians & Accounts">Librarians & Accountants</option>
              <option value="Support Staff">Security & Cleaning Support</option>
            </select>
          </div>

          <div className="space-y-1">
            <label>Notice Content details</label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              placeholder="Provide notice text content..."
              className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border focus:outline-none focus:ring-1 focus:ring-rose-605"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-rose-600 hover:bg-rose-750 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Publish Notice</span>
          </button>
        </form>

        {/* List Feed */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border rounded-3xl p-6 shadow-sm space-y-4">
          <span className="text-[10px] font-black uppercase text-slate-455 tracking-wider block border-b pb-2">Recent Announcements Feed</span>
          <div className="space-y-4 max-h-[70vh] overflow-y-auto no-scrollbar">
            {notices.map(n => (
              <div key={n.id} className="p-4 border rounded-2xl bg-slate-50 dark:bg-slate-955 space-y-2 text-left">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="text-xs font-bold text-slate-905 dark:text-white flex items-center gap-1.5">
                    <Megaphone className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>{n.title}</span>
                  </h4>
                  <span className="text-[9px] text-slate-400 font-medium">{n.date}</span>
                </div>
                <p className="text-slate-500 font-medium leading-relaxed font-sans">{n.content}</p>
                <span className="inline-block bg-rose-50 text-rose-755 text-[9px] font-black uppercase rounded px-2 py-0.5 mt-1">{n.target}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ToastComponent />
    </div>
  );
};
export default Announcements;
