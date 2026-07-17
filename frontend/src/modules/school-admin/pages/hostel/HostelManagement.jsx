import React, { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Tabs } from '../../components/ui/Tabs';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { Plus, Home, Users } from 'lucide-react';

export const HostelManagement = () => {
  const [activeTab, setActiveTab] = useState('buildings');
  const { showToast, ToastComponent } = useToast();

  const [buildings, setBuildings] = useState([
    { id: '1', name: 'Tagore Boy\'s Hostel', floors: 3, capacity: 120, status: 'Active' },
    { id: '2', name: 'Naidu Girl\'s Hostel', floors: 3, capacity: 120, status: 'Active' }
  ]);

  const [rooms, setRooms] = useState([
    { id: '1', building: 'Tagore Boy\'s Hostel', roomNo: '101', type: 'Double Sharing', cost: 45000, capacity: 2, occupied: 2 },
    { id: '2', building: 'Tagore Boy\'s Hostel', roomNo: '102', type: 'Double Sharing', cost: 45000, capacity: 2, occupied: 1 },
    { id: '3', building: 'Naidu Girl\'s Hostel', roomNo: '201', type: 'Single Room', cost: 80000, capacity: 1, occupied: 1 },
    { id: '4', building: 'Naidu Girl\'s Hostel', roomNo: '202', type: 'Double Sharing', cost: 45000, capacity: 2, occupied: 0 }
  ]);

  // Modal control
  const [roomModalOpen, setRoomModalOpen] = useState(false);
  const [newRoom, setNewRoom] = useState({ building: 'Tagore Boy\'s Hostel', roomNo: '', type: 'Double Sharing', cost: 45000, capacity: 2 });

  const handleCreateRoom = (e) => {
    e.preventDefault();
    setRooms(prev => [...prev, { id: Date.now().toString(), building: newRoom.building, roomNo: newRoom.roomNo, type: newRoom.type, cost: Number(newRoom.cost), capacity: Number(newRoom.capacity), occupied: 0 }]);
    setRoomModalOpen(false);
    showToast('New room catalog added to hostel inventory!', 'success');
  };

  const buildingColumns = [
    { header: 'Hostel Building Name', key: 'name', render: (val) => <span className="font-bold text-slate-900 dark:text-white">{val}</span> },
    { header: 'Total Floors', key: 'floors' },
    { header: 'Bed Capacity', key: 'capacity' },
    { header: 'Status', key: 'status', render: (val) => <Badge variant="success">{val}</Badge> }
  ];

  const roomColumns = [
    { header: 'Hostel Block', key: 'building' },
    { header: 'Room No', key: 'roomNo', render: (val) => <Badge variant="primary">{val}</Badge> },
    { header: 'Room Sharing Layout', key: 'type' },
    { header: 'Occupancy Rate', key: 'occupied', render: (val, row) => (
      <span className="font-bold">{val} / {row.capacity} Beds filled</span>
    )},
    { header: 'Annual Fee Cost', key: 'cost', render: (val) => <span className="font-bold">₹{val}</span> }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Hostel & Room Allocations" 
        subtitle="Manage campus hostel buildings, room types, student beds, and annual lodging cost plans."
        actions={
          activeTab === 'rooms' && (
            <button
              onClick={() => setRoomModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Room Record</span>
            </button>
          )
        }
      />

      <Tabs 
        tabs={[
          { id: 'buildings', label: 'Hostel Buildings', count: buildings.length },
          { id: 'rooms', label: 'Rooms & Occupancy', count: rooms.length }
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        {activeTab === 'buildings' && <DataTable columns={buildingColumns} data={buildings} />}
        {activeTab === 'rooms' && <DataTable columns={roomColumns} data={rooms} />}
      </div>

      {/* CREATE ROOM MODAL */}
      <Modal isOpen={roomModalOpen} onClose={() => setRoomModalOpen(false)} title="Add Hostel Room Record">
        <form onSubmit={handleCreateRoom} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400">Hostel Block</label>
              <select
                value={newRoom.building}
                onChange={(e) => setNewRoom({...newRoom, building: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border focus:outline-none"
              >
                <option value="Tagore Boy's Hostel">Tagore Boy's Hostel</option>
                <option value="Naidu Girl's Hostel">Naidu Girl's Hostel</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400">Room Number</label>
              <input 
                type="text" 
                required
                placeholder="e.g. 104" 
                value={newRoom.roomNo} 
                onChange={(e) => setNewRoom({...newRoom, roomNo: e.target.value})} 
                className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border focus:outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400">Sharing Layout</label>
              <select
                value={newRoom.type}
                onChange={(e) => setNewRoom({...newRoom, type: e.target.value, capacity: e.target.value === 'Single Room' ? 1 : 2})}
                className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border focus:outline-none"
              >
                <option value="Double Sharing">Double Sharing (2 Beds)</option>
                <option value="Single Room">Single Room (1 Bed)</option>
                <option value="Triple Sharing">Triple Sharing (3 Beds)</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400">Annual Cost (₹)</label>
              <input 
                type="number" 
                value={newRoom.cost} 
                onChange={(e) => setNewRoom({...newRoom, cost: Number(e.target.value)})} 
                className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border focus:outline-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={() => setRoomModalOpen(false)} className="px-4 py-2 text-xs font-semibold rounded-xl hover:bg-slate-100">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl">Add Room</button>
          </div>
        </form>
      </Modal>

      <ToastComponent />
    </div>
  );
};
export default HostelManagement;
