import React, { useState } from 'react';
import { Card, Button, Badge } from '../../components/ui/Button';
import { Select } from '../../components/ui/Input';
import { useSuperAdminNotifications } from '../../context/SuperAdminNotificationContext';
import { mockSchools } from '../../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { HardDrive, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function StorageIndex() {
  const { addNotification } = useSuperAdminNotifications();
  const [selectedSchool, setSelectedSchool] = useState(mockSchools[0]);

  // Simulated storage category size breakdown
  const storageData = [
    { name: 'Student Files', size: 45 },
    { name: 'Teacher Records', size: 12 },
    { name: 'Assignments', size: 28 },
    { name: 'SaaS Images', size: 18 },
    { name: 'System Documents', size: 15 },
  ];

  const handleIncreaseLimit = () => {
    addNotification('success', `Dedicated S3 bucket boundary limits adjusted to: ${selectedSchool.maxStorage + 100} GB`);
  };

  const handleClearCache = () => {
    addNotification('info', `Simulating automated cleanup engine: Completed. Saved 4.2 GB in temporary uploads cache.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">S3 Cloud Storage Allocation</h1>
          <p className="text-xs text-slate-400">Track and prune school media libraries, system logs, and teacher/student attachments.</p>
        </div>

        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={handleClearCache}>
            Clear Temp Cache
          </Button>
          <Button size="sm" onClick={handleIncreaseLimit}>
            Increase Allocation Limit (+100GB)
          </Button>
        </div>
      </div>

      <Card className="max-w-md space-y-3">
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Select Isolated Tenant</label>
        <Select
          value={selectedSchool.id}
          onChange={(e) => {
            const sch = mockSchools.find((s) => s.id === e.target.value);
            setSelectedSchool(sch);
          }}
        >
          {mockSchools.map((school) => (
            <option key={school.id} value={school.id}>
              {school.name}
            </option>
          ))}
        </Select>
      </Card>

      {/* Storage stats meters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <HardDrive size={16} className="text-indigo-400" />
              S3 bucket allocation usage meter
            </span>
            <Badge variant="warning">
              {((selectedSchool.storageUsed / selectedSchool.maxStorage) * 100).toFixed(1)}% Used
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${(selectedSchool.storageUsed / selectedSchool.maxStorage) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold">
              <span>{selectedSchool.storageUsed} GB occupied</span>
              <span>{selectedSchool.maxStorage} GB limit allocation</span>
            </div>
          </div>
        </Card>

        {/* Info panel */}
        <Card className="flex items-center gap-4 bg-slate-100 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80">
          <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 dark:text-indigo-400">
            <ShieldCheck size={20} />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wide">Storage Security Policy</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Files uploaded inside any tenant subdomain boundary belong exclusively to their S3 isolation key block. Platform admins cannot browse file content directory files directly.
            </p>
          </div>
        </Card>
      </div>

      {/* Recharts chart breakdown of category sizes */}
      <Card className="space-y-4">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Storage Category Sizes (GB)</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={storageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9' }} />
              <Bar dataKey="size" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
