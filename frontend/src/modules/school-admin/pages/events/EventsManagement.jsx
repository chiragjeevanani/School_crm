import React, { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Tabs } from '../../components/ui/Tabs';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { Plus, Calendar } from 'lucide-react';

export const EventsManagement = () => {
  const [activeTab, setActiveTab] = useState('events');
  const { showToast, ToastComponent } = useToast();

  const [events, setEvents] = useState([
    { id: '1', name: 'Parent Teacher Association Meeting', type: 'PTM', date: '2026-07-28', venue: 'School Conference Room', audience: 'Parents & Teachers' },
    { id: '2', name: 'Annual Sports Day Meet', type: 'Sports', date: '2026-11-20', venue: 'Main Sports Complex Stadium', audience: 'All Students' },
    { id: '3', name: 'Independence Day Celebrations', type: 'Cultural', date: '2026-08-15', venue: 'Central Assembly Courtyard', audience: 'All Students & Staff' }
  ]);

  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ name: '', type: 'PTM', date: '', venue: '', audience: 'All Students' });

  const handleCreateEvent = (e) => {
    e.preventDefault();
    setEvents(prev => [...prev, { id: Date.now().toString(), name: newEvent.name, type: newEvent.type, date: newEvent.date, venue: newEvent.venue, audience: newEvent.audience }]);
    setEventModalOpen(false);
    showToast('New school event created and scheduled on calendar!', 'success');
  };

  const columns = [
    { header: 'Event Title', key: 'name', render: (val) => <span className="font-bold text-slate-900 dark:text-white">{val}</span> },
    { header: 'Event Format', key: 'type', render: (val) => <Badge variant="info">{val}</Badge> },
    { header: 'Target Date', key: 'date' },
    { header: 'Venue / Hall Location', key: 'venue' },
    { header: 'Audience targeted', key: 'audience', render: (val) => <Badge variant="primary">{val}</Badge> }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Events & Campus Scheduling" 
        subtitle="Manage PTM schedules, coordinate sports meets, log cultural ceremonies, and organize dates."
        actions={
          <button
            onClick={() => setEventModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Schedule Campus Event</span>
          </button>
        }
      />

      <Tabs 
        tabs={[
          { id: 'events', label: 'Campus Events Directory', count: events.length }
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <DataTable columns={columns} data={events} searchPlaceholder="Search events..." />
      </div>

      {/* CREATE EVENT MODAL */}
      <Modal isOpen={eventModalOpen} onClose={() => setEventModalOpen(false)} title="Schedule Campus Event">
        <form onSubmit={handleCreateEvent} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400">Event Title Name</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Science Fair Exhibition" 
              value={newEvent.name} 
              onChange={(e) => setNewEvent({...newEvent, name: e.target.value})} 
              className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400">Format</label>
              <select
                value={newEvent.type}
                onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border focus:outline-none"
              >
                <option value="PTM">PTM (Parent Meeting)</option>
                <option value="Sports">Sports Meet</option>
                <option value="Cultural">Cultural Ceremonies</option>
                <option value="Seminar">Educational Seminar</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400">Date</label>
              <input 
                type="date" 
                required
                value={newEvent.date} 
                onChange={(e) => setNewEvent({...newEvent, date: e.target.value})} 
                className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border focus:outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400">Venue</label>
              <input 
                type="text" 
                placeholder="e.g. Conference Auditorium" 
                value={newEvent.venue} 
                onChange={(e) => setNewEvent({...newEvent, venue: e.target.value})} 
                className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400">Audience targeted</label>
              <select
                value={newEvent.audience}
                onChange={(e) => setNewEvent({...newEvent, audience: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border focus:outline-none"
              >
                <option value="All Students">All Students</option>
                <option value="Parents & Teachers">Parents & Teachers</option>
                <option value="Staff Only">Staff Only</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={() => setEventModalOpen(false)} className="px-4 py-2 text-xs font-semibold rounded-xl hover:bg-slate-100">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl">Schedule Event</button>
          </div>
        </form>
      </Modal>

      <ToastComponent />
    </div>
  );
};
export default EventsManagement;
