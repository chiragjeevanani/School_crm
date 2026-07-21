import React, { useState } from 'react';
import { Card, Button, Badge } from '../../components/ui/Button';
import { Select } from '../../components/ui/Input';
import { useSuperAdminNotifications } from '../../context/SuperAdminNotificationContext';
import { mockSchools } from '../../data/mockData';
import { ShieldCheck, ToggleLeft, ToggleRight } from 'lucide-react';

export default function ModulesIndex() {
  const { addNotification } = useSuperAdminNotifications();
  const [selectedSchoolId, setSelectedSchoolId] = useState(mockSchools[0]?.id || '');

  // Core module toggle states
  const [modules, setModules] = useState({
    student: true,
    teacher: true,
    parent: true,
    attendance: true,
    fees: true,
    examinations: true,
    homework: true,
    library: false,
    transport: false,
    hostel: false,
    payroll: false,
    inventory: false,
    events: true,
    communication: true,
    reports: true,
    analytics: false,
  });

  const handleToggle = (key) => {
    setModules((prev) => {
      const nextVal = !prev[key];
      addNotification('info', `Module [${key}] toggled state to ${nextVal ? 'ON' : 'OFF'}`);
      return { ...prev, [key]: nextVal };
    });
  };

  const handleSaveModules = () => {
    const activeSchoolName = mockSchools.find((s) => s.id === selectedSchoolId)?.name || 'Tenant';
    addNotification('success', `Dynamic routing modules re-synchronized for tenant: ${activeSchoolName}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Enterprise Feature Modules Matrix</h1>
          <p className="text-xs text-slate-400">Enable or disable system features dynamically per school database boundary.</p>
        </div>
        <Button onClick={handleSaveModules}>
          <ShieldCheck size={14} className="mr-1.5" />
          Synchronize Features
        </Button>
      </div>

      <Card className="max-w-md space-y-3">
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Select Isolated School Domain</label>
        <Select value={selectedSchoolId} onChange={(e) => setSelectedSchoolId(e.target.value)}>
          {mockSchools.map((school) => (
            <option key={school.id} value={school.id}>
              {school.name} ({school.schoolId})
            </option>
          ))}
        </Select>
      </Card>

      {/* Grid of Modular toggles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.keys(modules).map((modKey) => (
          <Card
            key={modKey}
            className={`flex items-center justify-between p-4 cursor-pointer hover:border-indigo-500/40 border transition-all ${
              modules[modKey] ? 'bg-indigo-900/10 border-indigo-500/20' : 'bg-slate-950/20 border-slate-900'
            }`}
            onClick={() => handleToggle(modKey)}
          >
            <div>
              <span className="text-sm font-semibold capitalize text-slate-200 block">{modKey}</span>
              <span className="text-[10px] text-slate-500">{modules[modKey] ? 'Active in frontend route' : 'Disabled for tenant'}</span>
            </div>
            <button className="text-slate-400 hover:text-slate-100 transition-colors">
              {modules[modKey] ? (
                <ToggleRight className="h-6 w-6 text-indigo-400" />
              ) : (
                <ToggleLeft className="h-6 w-6 text-slate-600" />
              )}
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}
