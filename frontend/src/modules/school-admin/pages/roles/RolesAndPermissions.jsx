import React, { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Tabs } from '../../components/ui/Tabs';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { 
  Plus, 
  ShieldAlert, 
  Check, 
  X, 
  Save, 
  Edit2, 
  Copy,
  Trash2
} from 'lucide-react';

const MODULES = [
  'Configuration',
  'Admissions',
  'Academics',
  'Student Management',
  'Teacher Management',
  'User Management',
  'Attendance Management',
  'Examination Management',
  'Fee Management',
  'Homework Management',
  'HR & Payroll',
  'Inventory',
  'Transport',
  'Hostel',
  'Library',
  'Communication',
  'Reports',
  'Audit Logs'
];

const ACTIONS = ['View', 'Create', 'Update', 'Delete', 'Approve', 'Export'];

export const RolesAndPermissions = () => {
  const [activeTab, setActiveTab] = useState('list');
  const { showToast, ToastComponent } = useToast();

  const [roles, setRoles] = useState([
    { id: '1', name: 'School Admin', description: 'Full access to school data and system settings. Direct single-school dashboard access.', userCount: 2, systemRole: true },
    { id: '2', name: 'Teacher', description: 'Can mark student attendance, evaluate homework, allocate exam scores.', userCount: 48, systemRole: true },
    { id: '3', name: 'Student', description: 'Access classes, report cards, view schedules, upload assignments.', userCount: 900, systemRole: true },
    { id: '4', name: 'Parent', description: 'View student profile progress, pay tuition fees, verify reports.', userCount: 880, systemRole: true },
    { id: '5', name: 'Accountant', description: 'Full access to fee categories, collection registers, invoice printing.', userCount: 3, systemRole: true },
    { id: '6', name: 'Librarian', description: 'Manage book categories, issue/return logs, catalog audits.', userCount: 2, systemRole: true },
    { id: '7', name: 'Transport Manager', description: 'Manage vehicles, assign routes/bus stops, allocate driver rosters.', userCount: 1, systemRole: false }
  ]);

  const [selectedRole, setSelectedRole] = useState('2'); // Defaults to Teacher for matrix
  const [permissions, setPermissions] = useState({
    // RoleID: { Module_Action: boolean }
    '1': MODULES.reduce((acc, m) => {
      ACTIONS.forEach(a => { acc[`${m}_${a}`] = true; });
      return acc;
    }, {}),
    '2': {
      'Academics_View': true, 'Academics_Update': true,
      'Student Management_View': true,
      'Attendance Management_View': true, 'Attendance Management_Create': true, 'Attendance Management_Update': true,
      'Examination Management_View': true, 'Examination Management_Create': true, 'Examination Management_Update': true,
      'Homework Management_View': true, 'Homework Management_Create': true, 'Homework Management_Update': true, 'Homework Management_Delete': true,
      'Communication_View': true, 'Communication_Create': true,
      'Reports_View': true
    }
  });

  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [newRole, setNewRole] = useState({ name: '', description: '' });

  const roleColumns = [
    { header: 'Role Name', key: 'name', render: (val, row) => (
      <div className="flex items-center gap-2">
        <span className="font-bold">{val}</span>
        {row.systemRole && <Badge variant="primary">System</Badge>}
      </div>
    )},
    { header: 'Description', key: 'description' },
    { header: 'Active Users', key: 'userCount', render: (val) => <span className="font-bold">{val}</span> },
    {
      header: 'Actions',
      key: 'actions',
      render: (_, row) => (
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <button 
            onClick={() => {
              setSelectedRole(row.id);
              setActiveTab('matrix');
            }} 
            className="text-xs font-bold text-indigo-650 hover:underline"
          >
            Configure
          </button>
          {!row.systemRole && (
            <button 
              onClick={() => {
                setRoles(prev => prev.filter(r => r.id !== row.id));
                showToast('Role deleted successfully.', 'success');
              }}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-rose-500"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )
    }
  ];

  const handleCreateRole = () => {
    const roleId = Date.now().toString();
    setRoles(prev => [...prev, { id: roleId, ...newRole, userCount: 0, systemRole: false }]);
    setRoleModalOpen(false);
    showToast('New role created successfully!', 'success');
  };

  const handleTogglePermission = (module, action) => {
    const key = `${module}_${action}`;
    setPermissions(prev => {
      const rolePerms = { ...(prev[selectedRole] || {}) };
      rolePerms[key] = !rolePerms[key];
      return { ...prev, [selectedRole]: rolePerms };
    });
  };

  const currentRoleName = roles.find(r => r.id === selectedRole)?.name || 'Role';

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Roles & Permissions" 
        subtitle="Configure access boundaries. Ensure your School Admin coordinates modules securely."
      />

      <Tabs 
        tabs={[
          { id: 'list', label: 'System Roles' },
          { id: 'matrix', label: 'Permission Matrix' }
        ]} 
        activeTab={activeTab} 
        onChange={setActiveTab} 
      />

      {activeTab === 'list' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-indigo-650">System Roles Table</h4>
            <button
              onClick={() => setRoleModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl text-xs font-bold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Custom Role</span>
            </button>
          </div>
          <DataTable columns={roleColumns} data={roles} />
        </div>
      )}

      {activeTab === 'matrix' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-850">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Permission Settings for: <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">{currentRoleName}</span>
              </h4>
              <p className="text-xs text-slate-450 mt-1">Check action boundaries to assign functional controls.</p>
            </div>
            
            <div className="flex gap-2">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-2.5 focus:outline-none"
              >
                {roles.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>

              <button
                onClick={() => showToast('Permissions saved successfully!', 'success')}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Matrix</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50">
                  <th className="p-4 text-xs font-bold text-slate-500">Module / Resource Name</th>
                  {ACTIONS.map(act => (
                    <th key={act} className="p-4 text-xs font-bold text-slate-500 text-center w-24">{act}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MODULES.map((mod) => (
                  <tr key={mod} className="border-b border-slate-100 dark:border-slate-850 hover:bg-slate-50/50 text-xs font-semibold text-slate-700 dark:text-slate-350">
                    <td className="p-4 font-bold">{mod}</td>
                    {ACTIONS.map(act => {
                      const key = `${mod}_${act}`;
                      const isAllowed = !!(permissions[selectedRole] && permissions[selectedRole][key]);
                      
                      // Super admin override displays mock lock
                      const isSuperAdmin = selectedRole === '1';
                      
                      return (
                        <td key={act} className="p-4 text-center">
                          <button
                            type="button"
                            disabled={isSuperAdmin}
                            onClick={() => handleTogglePermission(mod, act)}
                            className={`p-1.5 rounded-lg border transition-all ${
                              isAllowed
                                ? 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-650 dark:text-indigo-400 border-indigo-200 dark:border-indigo-850'
                                : 'bg-slate-50 dark:bg-slate-950 text-slate-300 dark:text-slate-800 border-slate-200 dark:border-slate-850'
                            }`}
                          >
                            {isAllowed ? <Check className="w-4 h-4 stroke-[3px]" /> : <X className="w-4 h-4 stroke-[3px] opacity-25" />}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL */}
      <Modal isOpen={roleModalOpen} onClose={() => setRoleModalOpen(false)} title="Create New Role">
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400">Role Label</label>
            <input 
              type="text" 
              placeholder="e.g. Lab Assistant" 
              value={newRole.name} 
              onChange={(e) => setNewRole({...newRole, name: e.target.value})} 
              className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400">Role Description</label>
            <input 
              type="text" 
              placeholder="Brief description..." 
              value={newRole.description} 
              onChange={(e) => setNewRole({...newRole, description: e.target.value})} 
              className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border focus:outline-none"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button onClick={() => setRoleModalOpen(false)} className="px-4 py-2 text-xs font-semibold rounded-xl hover:bg-slate-100">Cancel</button>
            <button onClick={handleCreateRole} className="px-4 py-2 bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl">Create Role</button>
          </div>
        </div>
      </Modal>

      <ToastComponent />
    </div>
  );
};
export default RolesAndPermissions;
