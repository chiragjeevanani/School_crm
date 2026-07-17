import React, { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Tabs } from '../../components/ui/Tabs';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { Plus, Bus, Navigation } from 'lucide-react';

export const TransportManagement = () => {
  const [activeTab, setActiveTab] = useState('vehicles');
  const { showToast, ToastComponent } = useToast();

  const [vehicles, setVehicles] = useState([
    { id: '1', number: 'DL-1CA-5582', type: 'Bus (52-Seater)', capacity: 52, status: 'Active' },
    { id: '2', number: 'DL-1CA-1284', type: 'Minibus (32-Seater)', capacity: 32, status: 'Active' },
    { id: '3', number: 'DL-1CA-9041', type: 'Bus (52-Seater)', capacity: 52, status: 'Maintenance' }
  ]);

  const [drivers, setDrivers] = useState([
    { id: '1', name: 'Manpreet Singh', license: 'DL-LIC-99824', phone: '+91 99110 02233', status: 'Active' },
    { id: '2', name: 'Harish Yadav', license: 'DL-LIC-55612', phone: '+91 99110 88241', status: 'Active' }
  ]);

  const [routes, setRoutes] = useState([
    { id: '1', name: 'Route 1 (Dwarka Sec-15 to School)', stops: 'Dwarka Sec-15, Sec-10, Sec-4', cost: 1500, driver: 'Manpreet Singh' },
    { id: '2', name: 'Route 2 (Janakpuri to School)', stops: 'Janakpuri East, Uttam Nagar, Dwarka', cost: 1800, driver: 'Harish Yadav' }
  ]);

  // Modal control
  const [vehicleModalOpen, setVehicleModalOpen] = useState(false);
  const [newVehicle, setNewVehicle] = useState({ number: '', type: 'Bus (52-Seater)', capacity: 52 });

  const handleCreateVehicle = (e) => {
    e.preventDefault();
    setVehicles(prev => [...prev, { id: Date.now().toString(), number: newVehicle.number, type: newVehicle.type, capacity: Number(newVehicle.capacity), status: 'Active' }]);
    setVehicleModalOpen(false);
    showToast('New vehicle registered to fleet!', 'success');
  };

  const vehicleColumns = [
    { header: 'Plate Number', key: 'number', render: (val) => <span className="font-bold text-slate-900 dark:text-white">{val}</span> },
    { header: 'Vehicle Class Type', key: 'type' },
    { header: 'Seating Capacity', key: 'capacity' },
    { header: 'Status', key: 'status', render: (val) => <Badge variant={val === 'Active' ? 'success' : 'danger'}>{val}</Badge> }
  ];

  const driverColumns = [
    { header: 'Driver Name', key: 'name', render: (val) => <span className="font-bold">{val}</span> },
    { header: 'Commercial License', key: 'license' },
    { header: 'Contact Phone', key: 'phone' },
    { header: 'Status', key: 'status', render: (val) => <Badge variant="success">{val}</Badge> }
  ];

  const routeColumns = [
    { header: 'Route Title', key: 'name' },
    { header: 'Bus Stops / Pickups', key: 'stops' },
    { header: 'Assigned Driver', key: 'driver' },
    { header: 'Cost per Term', key: 'cost', render: (val) => <span className="font-bold">₹{val}</span> }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Transport Fleet & Routes" 
        subtitle="Manage school buses, commercial driver licenses, transport routes, and pickup points."
        actions={
          activeTab === 'vehicles' && (
            <button
              onClick={() => setVehicleModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register Vehicle</span>
            </button>
          )
        }
      />

      <Tabs 
        tabs={[
          { id: 'vehicles', label: 'Fleets & Vehicles', count: vehicles.length },
          { id: 'drivers', label: 'Drivers Log', count: drivers.length },
          { id: 'routes', label: 'Routes & Cost Plans', count: routes.length }
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        {activeTab === 'vehicles' && <DataTable columns={vehicleColumns} data={vehicles} />}
        {activeTab === 'drivers' && <DataTable columns={driverColumns} data={drivers} />}
        {activeTab === 'routes' && <DataTable columns={routeColumns} data={routes} />}
      </div>

      {/* CREATE VEHICLE MODAL */}
      <Modal isOpen={vehicleModalOpen} onClose={() => setVehicleModalOpen(false)} title="Register Fleet Vehicle">
        <form onSubmit={handleCreateVehicle} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400">License Plate Number</label>
            <input 
              type="text" 
              required
              placeholder="e.g. DL-1CA-1234" 
              value={newVehicle.number} 
              onChange={(e) => setNewVehicle({...newVehicle, number: e.target.value})} 
              className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400">Vehicle Type</label>
              <select
                value={newVehicle.type}
                onChange={(e) => setNewVehicle({...newVehicle, type: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border focus:outline-none"
              >
                <option value="Bus (52-Seater)">Bus (52-Seater)</option>
                <option value="Minibus (32-Seater)">Minibus (32-Seater)</option>
                <option value="Van (14-Seater)">Van (14-Seater)</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400">Seating Capacity</label>
              <input 
                type="number" 
                value={newVehicle.capacity} 
                onChange={(e) => setNewVehicle({...newVehicle, capacity: Number(e.target.value)})} 
                className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border focus:outline-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={() => setVehicleModalOpen(false)} className="px-4 py-2 text-xs font-semibold rounded-xl hover:bg-slate-100">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl">Register Vehicle</button>
          </div>
        </form>
      </Modal>

      <ToastComponent />
    </div>
  );
};
export default TransportManagement;
