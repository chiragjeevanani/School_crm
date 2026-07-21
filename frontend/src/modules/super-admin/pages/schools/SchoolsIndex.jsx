import React, { useState } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/Table';
import { Card, Button, Badge } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/Dialog';
import { useSuperAdminNotifications } from '../../context/SuperAdminNotificationContext';
import { mockSchools } from '../../data/mockData';
import { Plus, Search, Building2, User, Globe, HardDrive } from 'lucide-react';

export default function SchoolsIndex() {
  const { addNotification } = useSuperAdminNotifications();
  const [schools, setSchools] = useState(mockSchools);
  const [search, setSearch] = useState('');
  const [filterPlan, setFilterPlan] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // Create school form states
  const [newSchoolName, setNewSchoolName] = useState('');
  const [newSchoolId, setNewSchoolId] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newPlan, setNewPlan] = useState('Growth');
  const [createOpen, setCreateOpen] = useState(false);

  const handleCreateSchool = (e) => {
    e.preventDefault();
    if (!newSchoolName || !newSchoolId || !newAdminEmail) return;

    const newSchool = {
      id: `sch_${Date.now()}`,
      schoolId: newSchoolId,
      name: newSchoolName,
      logo: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=100&auto=format&fit=crop&q=60',
      principal: 'Assigned Principal',
      schoolAdmin: newAdminEmail,
      timezone: 'IST (UTC+05:30)',
      language: 'English',
      currency: 'INR (₹)',
      maxStudents: 1000,
      maxStaff: 80,
      maxStorage: 100,
      status: 'Active',
      plan: newPlan,
      studentsCount: 0,
      staffCount: 0,
      storageUsed: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setSchools((prev) => [newSchool, ...prev]);
    addNotification('success', `Isolated tenant structure initialized: ${newSchoolName}`);
    setCreateOpen(false);

    // Reset fields
    setNewSchoolName('');
    setNewSchoolId('');
    setNewAdminEmail('');
  };

  const handleToggleStatus = (id, currentStatus) => {
    const nextStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    setSchools((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: nextStatus } : s))
    );
    addNotification('info', `School status updated to ${nextStatus}`);
  };

  const handleDeleteSchool = (id, name) => {
    setSchools((prev) => prev.filter((s) => s.id !== id));
    addNotification('error', `Tenant database container deleted: ${name}`);
  };

  const filteredSchools = schools.filter((school) => {
    const matchesSearch = school.name.toLowerCase().includes(search.toLowerCase()) || school.schoolId.toLowerCase().includes(search.toLowerCase());
    const matchesPlan = filterPlan === 'All' || school.plan === filterPlan;
    const matchesStatus = filterStatus === 'All' || school.status === filterStatus;
    return matchesSearch && matchesPlan && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Isolated Schools Directory</h1>
          <p className="text-xs text-slate-400">Manage separate database tenants, module options, and limits.</p>
        </div>

        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus size={14} className="mr-1.5" />
              Provision School Tenant
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Provision Isolated Tenant Container</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateSchool} className="space-y-4 mt-2">
              <Input
                label="School/Academy Name"
                placeholder="Greenwood High Academy"
                value={newSchoolName}
                onChange={(e) => {
                  setNewSchoolName(e.target.value);
                  setNewSchoolId(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                }}
                required
              />
              <Input
                label="Unique Tenant schoolId (Database Isolation Path)"
                placeholder="greenwood-high-academy"
                value={newSchoolId}
                onChange={(e) => setNewSchoolId(e.target.value)}
                required
              />
              <Input
                label="Primary School Admin Email"
                type="email"
                placeholder="principal@school.edu"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                required
              />
              <Select label="Initial Subscription Plan" value={newPlan} onChange={(e) => setNewPlan(e.target.value)}>
                <option value="Basic">Basic Plan</option>
                <option value="Growth">Growth Plan</option>
                <option value="Enterprise">Enterprise Plan</option>
              </Select>
              <Button type="submit" className="w-full">Create Tenant Boundary</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Query Filters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-100 dark:bg-slate-900/30 p-4 border border-slate-200 dark:border-slate-800/80 rounded-xl">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search school name or tenant ID..."
            className="w-full pl-9 h-10 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-colors"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={filterPlan} onChange={(e) => setFilterPlan(e.target.value)}>
          <option value="All">All subscription plans</option>
          <option value="Basic">Basic Plan</option>
          <option value="Growth">Growth Plan</option>
          <option value="Enterprise">Enterprise Plan</option>
        </Select>
        <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="All">All status states</option>
          <option value="Active">Active</option>
          <option value="Trial">Trial</option>
          <option value="Expired">Expired</option>
          <option value="Suspended">Suspended</option>
        </Select>
      </div>

      {/* Schools Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tenant Entity</TableHead>
            <TableHead>schoolId Path</TableHead>
            <TableHead>Enrollment Size</TableHead>
            <TableHead>S3 Allocation</TableHead>
            <TableHead>SaaS tier</TableHead>
            <TableHead>Current Status</TableHead>
            <TableHead className="text-right">Database Ops</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredSchools.map((school) => (
            <TableRow key={school.id}>
              <TableCell className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Building2 size={16} className="text-indigo-400" />
                {school.name}
              </TableCell>
              <TableCell className="font-mono text-xs text-slate-400">{school.schoolId}</TableCell>
              <TableCell>{school.studentsCount} / {school.maxStudents} Students</TableCell>
              <TableCell>{school.storageUsed || 0} GB / {school.maxStorage} GB</TableCell>
              <TableCell>
                <Badge variant={school.plan}>{school.plan}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant={school.status}>{school.status}</Badge>
              </TableCell>
              <TableCell className="text-right flex items-center justify-end gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleToggleStatus(school.id, school.status)}
                >
                  {school.status === 'Active' ? 'Suspend' : 'Activate'}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteSchool(school.id, school.name)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
