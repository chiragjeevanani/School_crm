import React, { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Tabs } from '../../components/ui/Tabs';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { useAppStore } from '../../../../shared/store/useAppStore';
import { 
  Plus, 
  Upload, 
  Download, 
  Key, 
  UserX, 
  UserCheck, 
  Edit3, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const UserManagement = () => {
  const [activeTab, setActiveTab] = useState('teachers');
  const { showToast, ToastComponent } = useToast();
  const { store, registerUser, updateStudentStatus, updateStore } = useAppStore();

  const teachers = store.staff.filter(s => s.role === 'Teacher');
  const students = store.students;
  const employees = store.staff.filter(s => s.role !== 'Teacher');

  // Edit / Details Modals States
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [roleAssignModalOpen, setRoleAssignModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Teacher',
    class: '10',
    section: 'A',
    department: 'Mathematics',
    password: 'password123'
  });

  // Action Handlers
  const handleToggleStatus = (user, listType) => {
    const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
    
    if (listType === 'students') {
      updateStudentStatus(user.id, newStatus, 'Vikramaditya (Admin)');
    } else {
      updateStore(prev => ({
        ...prev,
        staff: prev.staff.map(s => s.id === user.id ? { ...s, status: newStatus } : s),
        auth: {
          ...prev.auth,
          users: prev.auth.users.map(u => (u.email === user.email || u.username === user.username) ? { ...u, status: newStatus } : u)
        }
      }), 'STAFF_STATUS_UPDATED', { user: user.name, newStatus });
    }

    showToast(`${user.name} status updated to ${newStatus}`, 'success');
  };

  const handleResetPassword = (user) => {
    showToast(`Password reset link & temporary OTP dispatched to ${user.email}`, 'info');
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    const roleSlug = newUser.role.toLowerCase().replace(/\s+/g, '-');
    const mockEmpId = `EMP${Math.floor(100 + Math.random() * 900)}`;

    if (newUser.role === 'Teacher' || newUser.role === 'Accountant' || newUser.role === 'HR' || newUser.role === 'Librarian' || newUser.role === 'Transport') {
      const newStaffObj = {
        id: mockEmpId,
        employeeId: mockEmpId,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        department: newUser.department || 'General',
        designation: newUser.role,
        qualification: 'Master of Education / Relevant Degree',
        joiningDate: new Date().toISOString().split('T')[0],
        status: 'Active',
        basicSalary: newUser.role === 'Teacher' ? 45000 : 38000,
        allowances: 7500,
        deductions: 2800,
        leaveBalance: { casual: 8, sick: 10, earned: 15, unpaid: 0 }
      };

      updateStore(prev => ({
        ...prev,
        staff: [newStaffObj, ...prev.staff]
      }), 'STAFF_REGISTERED');
    }

    // Register user account in authStore so they can log in
    registerUser({
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: roleSlug === 'teacher' ? 'teacher' : (roleSlug === 'school-admin' ? 'school-admin' : roleSlug),
      employeeId: mockEmpId,
      username: newUser.email || mockEmpId,
      password: newUser.password || 'password123'
    }, 'Vikramaditya (Admin)');

    setCreateModalOpen(false);
    showToast(`User account for ${newUser.name} (${newUser.role}) created successfully! Credentials active for immediate login.`, 'success');
  };

  const handleAssignRole = () => {
    showToast(`Assigned new role privileges to ${selectedUser?.name}`, 'success');
    setRoleAssignModalOpen(false);
  };

  // Columns Definitions
  const teacherColumns = [
    { header: 'Teacher Name', key: 'name' },
    { header: 'Department', key: 'department' },
    { header: 'Email', key: 'email' },
    { header: 'Phone', key: 'phone' },
    { header: 'Classes Allocated', key: 'classes', render: (val, row) => row.classes || '10-A, 10-B' },
    {
      header: 'Status',
      key: 'status',
      render: (val) => <Badge variant={val === 'Active' ? 'success' : 'danger'}>{val}</Badge>
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (_, row) => (
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <button 
            onClick={() => handleToggleStatus(row, 'teachers')}
            title={row.status === 'Active' ? 'Deactivate User' : 'Activate User'}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500"
          >
            {row.status === 'Active' ? <UserX className="w-3.5 h-3.5 text-rose-500" /> : <UserCheck className="w-3.5 h-3.5 text-emerald-500" />}
          </button>
          <button 
            onClick={() => handleResetPassword(row)}
            title="Reset Password"
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500"
          >
            <Key className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => {
              setSelectedUser(row);
              setRoleAssignModalOpen(true);
            }}
            title="Assign Roles/Permissions"
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
          </button>
        </div>
      )
    }
  ];

  const studentColumns = [
    { header: 'Roll No / Adm No', key: 'admissionNo' },
    { header: 'Student Name', key: 'name' },
    { header: 'Class', key: 'class', render: (val, row) => `${val || ''} ${row.section ? `(${row.section})` : ''}` },
    { header: 'Guardian Name', key: 'parentName' },
    { header: 'Contact Phone', key: 'parentPhone', render: (val, row) => val || row.phone },
    {
      header: 'Status',
      key: 'status',
      render: (val) => <Badge variant={val === 'Active' ? 'success' : 'danger'}>{val}</Badge>
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (_, row) => (
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <button 
            onClick={() => handleToggleStatus(row, 'students')}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500"
          >
            {row.status === 'Active' ? <UserX className="w-3.5 h-3.5 text-rose-500" /> : <UserCheck className="w-3.5 h-3.5 text-emerald-500" />}
          </button>
          <button 
            onClick={() => handleResetPassword(row)}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500"
          >
            <Key className="w-3.5 h-3.5" />
          </button>
        </div>
      )
    }
  ];

  const employeeColumns = [
    { header: 'Employee Name', key: 'name' },
    { header: 'Assigned Role', key: 'role', render: (val) => <Badge variant="info">{val}</Badge> },
    { header: 'Department', key: 'department' },
    { header: 'Email', key: 'email' },
    { header: 'Phone', key: 'phone' },
    {
      header: 'Status',
      key: 'status',
      render: (val) => <Badge variant={val === 'Active' ? 'success' : 'danger'}>{val}</Badge>
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (_, row) => (
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <button 
            onClick={() => handleToggleStatus(row, 'employees')}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500"
          >
            {row.status === 'Active' ? <UserX className="w-3.5 h-3.5 text-rose-500" /> : <UserCheck className="w-3.5 h-3.5 text-emerald-500" />}
          </button>
          <button 
            onClick={() => handleResetPassword(row)}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500"
          >
            <Key className="w-3.5 h-3.5" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="User & Account Management" 
        subtitle="Provision employee accounts, assign permissions, audit security statuses, and manage role credentials."
        actions={
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create User Account</span>
          </button>
        }
      />

      <Tabs
        tabs={[
          { id: 'teachers', label: 'Faculty & Teachers', count: teachers.length },
          { id: 'students', label: 'Enrolled Students', count: students.length },
          { id: 'employees', label: 'Administrative Staff', count: employees.length }
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <DataTable
          columns={
            activeTab === 'teachers' ? teacherColumns :
            activeTab === 'students' ? studentColumns :
            employeeColumns
          }
          data={
            activeTab === 'teachers' ? teachers :
            activeTab === 'students' ? students :
            employees
          }
          searchPlaceholder="Search directory..."
        />
      </div>

      {/* CREATE USER MODAL */}
      <Modal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Provision New Institutional Account">
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Target Role *</label>
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              className="w-full px-3 py-2 text-xs border rounded-xl bg-slate-50 dark:bg-slate-900 border-border"
            >
              <option value="Teacher">Faculty / Teacher</option>
              <option value="Accountant">Finance / Accountant</option>
              <option value="HR">HR / Admin Staff</option>
              <option value="Librarian">Librarian</option>
              <option value="Transport">Transport Manager</option>
              <option value="Principal">School Principal</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Full Name *</label>
              <input
                type="text"
                required
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                placeholder="e.g. Dr. Ananya Sen"
                className="w-full px-3 py-2 text-xs border rounded-xl bg-slate-50 dark:bg-slate-900 border-border"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Department</label>
              <input
                type="text"
                value={newUser.department}
                onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                placeholder="e.g. Science / Mathematics"
                className="w-full px-3 py-2 text-xs border rounded-xl bg-slate-50 dark:bg-slate-900 border-border"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Email (Username) *</label>
              <input
                type="email"
                required
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                placeholder="ananya.sen@greenfield.edu"
                className="w-full px-3 py-2 text-xs border rounded-xl bg-slate-50 dark:bg-slate-900 border-border"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Phone</label>
              <input
                type="tel"
                value={newUser.phone}
                onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                placeholder="+91 98000 77777"
                className="w-full px-3 py-2 text-xs border rounded-xl bg-slate-50 dark:bg-slate-900 border-border"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Initial Password *</label>
            <input
              type="text"
              required
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              placeholder="password123"
              className="w-full px-3 py-2 text-xs border rounded-xl bg-slate-50 dark:bg-slate-900 border-border font-mono"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
          >
            Provision Account & Activate Credentials
          </button>
        </form>
      </Modal>

      {/* ROLE ASSIGN MODAL */}
      <Modal isOpen={roleAssignModalOpen} onClose={() => setRoleAssignModalOpen(false)} title="Assign RBAC Privileges">
        {selectedUser && (
          <div className="space-y-4">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Configure access privileges and modular operational scopes for <strong>{selectedUser.name}</strong>.
            </p>
            <div className="space-y-2">
              {['Academic Marks Verification', 'Attendance Modification', 'Student File Editing', 'Financial Record Access'].map((perm, idx) => (
                <label key={idx} className="flex items-center gap-2.5 p-2.5 rounded-xl border border-border bg-slate-50 dark:bg-slate-950 cursor-pointer text-xs font-semibold">
                  <input type="checkbox" defaultChecked={idx < 2} className="rounded text-indigo-600 focus:ring-indigo-500" />
                  <span>{perm}</span>
                </label>
              ))}
            </div>
            <button
              onClick={handleAssignRole}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold"
            >
              Save Permission Matrix
            </button>
          </div>
        )}
      </Modal>

      <ToastComponent />
    </div>
  );
};
export default UserManagement;
