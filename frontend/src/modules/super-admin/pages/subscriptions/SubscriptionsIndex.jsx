import React, { useState } from 'react';
import { Card, Button, Badge } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/Dialog';
import { useSuperAdminNotifications } from '../../context/SuperAdminNotificationContext';
import { mockPlans } from '../../data/mockData';
import { Plus, Edit3, Trash2, CheckCircle2 } from 'lucide-react';

export default function SubscriptionsIndex() {
  const { addNotification } = useSuperAdminNotifications();
  const [plans, setPlans] = useState(mockPlans);
  const [createOpen, setCreateOpen] = useState(false);

  // New Plan form states
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('Monthly');
  const [students, setStudents] = useState(1000);
  const [storage, setStorage] = useState(100);

  const handleCreatePlan = (e) => {
    e.preventDefault();
    if (!name || !price) return;

    const newPlan = {
      id: `plan_${Date.now()}`,
      name,
      price: parseFloat(price),
      duration,
      maxStudents: parseInt(students),
      maxStaff: Math.ceil(students / 10),
      maxStorage: parseInt(storage),
      enabledModules: ['student', 'teacher', 'parent', 'attendance', 'homework'],
      supportLevel: 'Basic'
    };

    setPlans((prev) => [...prev, newPlan]);
    addNotification('success', `Subscription plan compiled: ${name}`);
    setCreateOpen(false);

    // Reset
    setName('');
    setPrice('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">SaaS Subscription Plans</h1>
          <p className="text-xs text-slate-400">Configure global subscription prices, academic features, and storage allocations.</p>
        </div>

        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus size={14} className="mr-1.5" />
              Build SaaS Tier
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Subscription Tier Profile</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreatePlan} className="space-y-4 mt-2">
              <Input
                label="Plan Display Name"
                placeholder="Ultimate Enterprise Plan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="USD Billing Rate ($)"
                  type="number"
                  placeholder="299"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
                <Select label="Interval Cycle" value={duration} onChange={(e) => setDuration(e.target.value)}>
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Half Yearly">Half Yearly</option>
                  <option value="Yearly">Yearly</option>
                  <option value="Lifetime">Lifetime</option>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Max Allowed Students"
                  type="number"
                  value={students}
                  onChange={(e) => setStudents(e.target.value)}
                />
                <Input
                  label="Storage Space (GB)"
                  type="number"
                  value={storage}
                  onChange={(e) => setStorage(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">Publish Subscription Tier</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
           <Card key={plan.id} className="relative flex flex-col justify-between border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{plan.name}</h3>
                <Badge variant={plan.name.replace(' Plan', '')}>{plan.name.replace(' Plan', '')}</Badge>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-slate-100">${plan.price}</span>
                <span className="text-xs text-slate-500">/ {plan.duration.toLowerCase()}</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Suits education institutions looking for {plan.name.toLowerCase()}.</p>

              <hr className="border-slate-200 dark:border-slate-800" />

              {/* Resource Bounds list */}
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-indigo-400" />
                  Up to {plan.maxStudents} Students
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-indigo-400" />
                  {plan.maxStorage} GB Dedicated S3 Space
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-indigo-400" />
                  {plan.supportLevel} Support
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-indigo-400" />
                  {plan.enabledModules?.length || 5} Core System Modules Enabled
                </li>
              </ul>
            </div>

            <div className="flex gap-2 pt-4">
              <Button variant="secondary" className="w-full text-xs">
                Configure Modules
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
