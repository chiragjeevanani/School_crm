import React, { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Tabs } from '../../components/ui/Tabs';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../components/ui/Toast';
import { BarChart } from '../../components/ui/Charts/BarChart';
import { BookOpen, FileCheck } from 'lucide-react';

export const HomeworkMonitor = () => {
  const [activeTab, setActiveTab] = useState('assignments');
  const { showToast, ToastComponent } = useToast();

  const [homeworkList] = useState([
    { id: '1', class: 'Class 10-A', subject: 'Physics', teacher: 'Dr. Ramesh Kumar', title: 'Electromagnetic Induction Numericals', dueDate: '2026-07-20', submissions: '28 / 32', rate: 87 },
    { id: '2', class: 'Class 10-B', subject: 'Mathematics', teacher: 'Mrs. Sunita Rao', title: 'Quadratic Equations Exercise 4.2', dueDate: '2026-07-19', submissions: '30 / 33', rate: 90 },
    { id: '3', class: 'Class 9-A', subject: 'English', teacher: 'Mr. David D\'souza', title: 'Essay: The Impact of Artificial Intelligence', dueDate: '2026-07-22', submissions: '15 / 40', rate: 37 }
  ]);

  const [analyticsData] = useState([
    { name: 'Phys 10-A', rate: 87 },
    { name: 'Math 10-B', rate: 90 },
    { name: 'Eng 9-A', rate: 37 }
  ]);

  const columns = [
    { header: 'Class Section', key: 'class' },
    { header: 'Subject', key: 'subject', render: (val) => <Badge variant="info">{val}</Badge> },
    { header: 'Title / Assignment Description', key: 'title' },
    { header: 'Instructor', key: 'teacher' },
    { header: 'Due Date', key: 'dueDate' },
    { header: 'Submissions Count', key: 'submissions', render: (val) => <span className="font-bold">{val}</span> },
    { header: 'Submission Rate %', key: 'rate', render: (val) => (
      <div className="flex items-center gap-2">
        <span className="font-extrabold">{val}%</span>
        <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className="bg-indigo-600 h-full" style={{ width: `${val}%` }}></div>
        </div>
      </div>
    )}
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Homework & Assignment Monitoring" 
        subtitle="Track student assignment submission ratios and monitor teacher curricular progress."
      />

      <Tabs 
        tabs={[
          { id: 'assignments', label: 'All Active Assignments', count: homeworkList.length },
          { id: 'analytics', label: 'Submission Analytics' }
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        {activeTab === 'assignments' && (
          <DataTable columns={columns} data={homeworkList} searchPlaceholder="Search assignments..." />
        )}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="p-4 bg-slate-50 dark:bg-slate-950 border rounded-2xl flex items-center gap-3">
              <FileCheck className="w-6 h-6 text-indigo-600" />
              <div className="text-xs font-semibold">
                <span className="font-bold text-slate-800 block">Class 10 Math leads submissions rate</span>
                <span className="text-slate-450 block">High submission rate correlates with upcoming unit test schedules.</span>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Class Submission Rates Chart (%)</h4>
              <BarChart data={analyticsData} xKey="name" yKey="rate" barColor="#6366f1" />
            </div>
          </div>
        )}
      </div>

      <ToastComponent />
    </div>
  );
};
export default HomeworkMonitor;
