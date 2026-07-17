import React, { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Tabs } from '../../components/ui/Tabs';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { Plus, Package } from 'lucide-react';

export const InventoryManagement = () => {
  const [activeTab, setActiveTab] = useState('assets');
  const { showToast, ToastComponent } = useToast();

  const [assets, setAssets] = useState([
    { id: '1', name: 'Science Lab Microscope', category: 'Lab Equipment', quantity: 24, cost: 120000, allocated: 'Science Dept' },
    { id: '2', name: 'Classroom Desks & Chairs', category: 'Furniture', quantity: 350, cost: 280000, allocated: 'General Classrooms' },
    { id: '3', name: 'Whiteboards & Markers', category: 'Stationery', quantity: 45, cost: 45000, allocated: 'All Departments' }
  ]);

  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', category: 'Lab Equipment', quantity: 10, cost: 15000, allocated: 'Science Dept' });

  const handleAddItem = (e) => {
    e.preventDefault();
    setAssets(prev => [...prev, { id: Date.now().toString(), name: newItem.name, category: newItem.category, quantity: Number(newItem.quantity), cost: Number(newItem.cost), allocated: newItem.allocated }]);
    setItemModalOpen(false);
    showToast('New asset items logged to school inventory!', 'success');
  };

  const columns = [
    { header: 'Asset Name', key: 'name', render: (val) => <span className="font-bold text-slate-900 dark:text-white">{val}</span> },
    { header: 'Inventory Category', key: 'category', render: (val) => <Badge variant="info">{val}</Badge> },
    { header: 'Quantity Stock', key: 'quantity', render: (val) => <span className="font-semibold">{val} Units</span> },
    { header: 'Total Value Cost', key: 'cost', render: (val) => <span className="font-bold">₹{val}</span> },
    { header: 'Allocated Location', key: 'allocated' }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="School Inventory & Assets" 
        subtitle="Catalog academic assets, track laboratory equipment supplies, monitor classroom furniture, and allocate stocks."
        actions={
          <button
            onClick={() => setItemModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Asset Item</span>
          </button>
        }
      />

      <Tabs 
        tabs={[
          { id: 'assets', label: 'Asset Catalogue list', count: assets.length }
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <DataTable columns={columns} data={assets} searchPlaceholder="Search inventory assets..." />
      </div>

      {/* CREATE ITEM MODAL */}
      <Modal isOpen={itemModalOpen} onClose={() => setItemModalOpen(false)} title="Add Asset Item">
        <form onSubmit={handleAddItem} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400">Asset Title Name</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Ergonomic Office Chairs" 
              value={newItem.name} 
              onChange={(e) => setNewItem({...newItem, name: e.target.value})} 
              className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400">Category</label>
              <select
                value={newItem.category}
                onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border focus:outline-none"
              >
                <option value="Lab Equipment">Lab Equipment</option>
                <option value="Furniture">Furniture</option>
                <option value="Stationery">Stationery</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400">Quantity Units</label>
              <input 
                type="number" 
                value={newItem.quantity} 
                onChange={(e) => setNewItem({...newItem, quantity: Number(e.target.value)})} 
                className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border focus:outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400">Cost Value (₹)</label>
              <input 
                type="number" 
                value={newItem.cost} 
                onChange={(e) => setNewItem({...newItem, cost: Number(e.target.value)})} 
                className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400">Allocated Department</label>
              <input 
                type="text" 
                placeholder="e.g. Science Labs" 
                value={newItem.allocated} 
                onChange={(e) => setNewItem({...newItem, allocated: e.target.value})} 
                className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border focus:outline-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={() => setItemModalOpen(false)} className="px-4 py-2 text-xs font-semibold rounded-xl hover:bg-slate-100">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl">Add Item</button>
          </div>
        </form>
      </Modal>

      <ToastComponent />
    </div>
  );
};
export default InventoryManagement;
