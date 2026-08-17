import React, { useState } from 'react';
import { Card, Button, Badge } from '../../components/ui/Button';
import { Select } from '../../components/ui/Input';
import { useSuperAdminNotifications } from '../../context/SuperAdminNotificationContext';
import { useAppStore } from '../../../../shared/store/useAppStore';
import { ShieldCheck, ToggleLeft, ToggleRight, CheckCircle2 } from 'lucide-react';

export default function ModulesIndex() {
  const { addNotification } = useSuperAdminNotifications();
  const { store, toggleSchoolModule } = useAppStore();

  const schools = store.tenant?.schools || [
    { id: 'sch-1', name: 'Greenfield Public School', schoolId: 'SCH-2026-09' }
  ];
  const [selectedSchoolId, setSelectedSchoolId] = useState(schools[0]?.id || 'sch-1');

  const currentSchool = schools.find(s => s.id === selectedSchoolId) || schools[0];
  const modules = currentSchool?.modules || {
    student: true,
    teacher: true,
    parent: true,
    attendance: true,
    fees: true,
    examinations: true,
    homework: true,
    library: true,
    transport: true,
    hostel: true,
    payroll: true,
    inventory: true,
    events: true,
    communication: true,
    reports: true,
    analytics: true
  };

  const handleToggle = (key) => {
    const nextVal = toggleSchoolModule(selectedSchoolId, key, 'SaaS Super Administrator');
    addNotification('info', `Module [${key.toUpperCase()}] is now ${nextVal ? 'ENABLED' : 'DISABLED'} for ${currentSchool?.name}`);
  };

  const handleSaveModules = () => {
    addNotification('success', `Dynamic routing module matrix re-synchronized for tenant: ${currentSchool?.name}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Enterprise Feature Modules Matrix</h1>
          <p className="text-xs text-slate-400">Enable or disable system features dynamically per school tenant database boundary (FRD §23).</p>
        </div>
        <Button onClick={handleSaveModules}>
          <ShieldCheck size={14} className="mr-1.5" />
          Synchronize Tenant Features
        </Button>
      </div>

      <Card className="max-w-md space-y-3 p-4 bg-slate-900 border-slate-800">
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Select Isolated School Domain</label>
        <Select value={selectedSchoolId} onChange={(e) => setSelectedSchoolId(e.target.value)}>
          {schools.map((school) => (
            <option key={school.id} value={school.id}>
              {school.name} ({school.schoolId})
            </option>
          ))}
        </Select>
      </Card>

      {/* Grid of Modular toggles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.keys(modules).map((modKey) => (
          <Card
            key={modKey}
            className={`flex items-center justify-between p-4 cursor-pointer hover:border-indigo-500/40 border transition-all ${
              modules[modKey] ? 'bg-indigo-950/30 border-indigo-500/40 shadow-sm' : 'bg-slate-950/40 border-slate-850'
            }`}
            onClick={() => handleToggle(modKey)}
          >
            <div>
              <span className="text-xs font-bold capitalize text-slate-200 block">{modKey}</span>
              <span className="text-[10px] text-slate-400 font-semibold">{modules[modKey] ? 'Active in Tenant Portal' : 'Disabled / Hidden'}</span>
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
