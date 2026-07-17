import React, { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Tabs } from '../../components/ui/Tabs';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { 
  MOCK_TEACHERS, 
  MOCK_STUDENTS, 
  MOCK_EMPLOYEES 
} from '../../utils/constants';
import { 
  Plus, 
  Upload, 
  Download, 
  Key, 
  UserX, 
  UserCheck, 
  Edit3,
  ShieldCheck
} from 'lucide-react';

export const UserManagement = () => {
  const [activeTab, setActiveTab] = useState('teachers');
  const { showToast, ToastComponent } = useToast();

  // User lists state
  const [teachers, setTeachers] = useState(MOCK_TEACHERS);
  const [students, setStudents] = useState(MOCK_STUDENTS);
  const [employees, setEmployees] = useState(MOCK_EMPLOYEES);

  // Edit / Details Modals States
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [roleAssignModalOpen, setRoleAssignModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Teacher',
    class: '',
    section: ''
  });

  // Action Handlers
  const handleToggleStatus = (user, listType) => {
    const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
    const updater = (prev) => prev.map(u => u.id === user.id ? { ...u, status: newStatus } : u);

    if (listType === 'teachers') setTeachers(updater);
    else if (listType === 'students') setStudents(updater);
    else setEmployees(updater);

    showToast(`User status updated to ${newStatus}`, 'success');
  };

  const handleResetPassword = (user) => {
    showToast(`Password reset link sent to ${user.email}`, 'info');
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    const mockId = Date.now().toString();
    const createdUser = {
      id: mockId,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      department: 'General',
      qualification: 'N/A',
      status: 'Active',
      role: newUser.role,
      admissionNo: `ADM-${mockId.slice(-4)}`,
      class: newUser.class || '10',
      section: newUser.section || 'A'
    };

    if (newUser.role === 'Teacher') {
      setTeachers(prev => [createdUser, ...prev]);
    } else if (newUser.role === 'Student') {
      setStudents(prev => [createdUser, ...prev]);
    } else {
      setEmployees(prev => [createdUser, ...prev]);
    }

    setCreateModalOpen(false);
    showToast('New user account created!', 'success');
  };

  const handleAssignRole = () => {
    showToast(`Assigned new role privileges to ${selectedUser.name}`, 'success');
    setRoleAssignModalOpen(false);
  };

  // Columns Definitions
  const teacherColumns = [
    { header: 'Teacher Name', key: 'name' },
    { header: 'Department', key: 'department' },
    { header: 'Email', key: 'email' },
    { header: 'Phone', key: 'phone' },
    { header: 'Classes Allocated', key: 'classes' },
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
            className="p-1 hover:bg-slate-100 rounded text-slate-500"
          >
            {row.status === 'Active' ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
          </button>
          <button 
            onClick={() => handleResetPassword(row)}
            title="Reset Password"
            className="p-1 hover:bg-slate-100 rounded text-slate-500"
          >
            <Key className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => {
              setSelectedUser(row);
              setRoleAssignModalOpen(true);
            }}
            title="Assign Roles/Permissions"
            className="p-1 hover:bg-slate-100 rounded text-slate-500"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
          </button>
        </div>
      )
    }
  ];

  const studentColumns = [
    { header: 'Roll No / Adm No', key: 'admissionNo' },
    { header: 'Student Name', key: 'name' },
    { header: 'Class', key: 'class', render: (val, row) => `${val}-${row.section}` },
    { header: 'Guardian Name', key: 'parentName' },
    { header: 'Contact Phone', key: 'phone' },
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
            className="p-1 hover:bg-slate-100 rounded text-slate-500"
          >
            {row.status === 'Active' ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
          </button>
          <button 
            onClick={() => handleResetPassword(row)}
            className="p-1 hover:bg-slate-100 rounded text-slate-500"
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
            className="p-1 hover:bg-slate-100 rounded text-slate-500"
          >
            {row.status === 'Active' ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
          </button>
          <button 
            onClick={() => handleResetPassword(row)}
            className="p-1 hover:bg-slate-100 rounded text-slate-500"
          >
            <Key className="w-3.5 h-3.5" />
          </button>
        </div>
      )
    }
  ];

  const handleBulkImport = () => {
    showToast('Bulk import file parsed. Added 42 records.', 'success');
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="User & Account Management" 
        subtitle="Provision logins, reset credentials, deactivate profiles, assign roles, and manage list imports."
        actions={
          <>
            <button
              onClick={handleBulkImport}
              className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold rounded-xl"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Bulk Import CSV</span>
            </button>
            <button
              onClick={() => setCreateModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create User Account</span>
            </button>
          </>
        }
      />

      <Tabs 
        tabs={[
          { id: 'teachers', label: 'Teachers', count: teachers.length },
          { id: 'students', label: 'Students', count: students.length },
          { id: 'employees', label: 'Staff & Support Employees', count: employees.length }
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        {activeTab === 'teachers' && (
          <DataTable 
            columns={teacherColumns} 
            data={teachers} 
            searchPlaceholder="Search teachers..." 
            exportFilename="teachers_list.csv"
          />
        )}
        {activeTab === 'students' && (
          <DataTable 
            columns={studentColumns} 
            data={students} 
            searchPlaceholder="Search students..." 
            exportFilename="students_list.csv"
          />
        )}
        {activeTab === 'employees' && (
          <DataTable 
            columns={employeeColumns} 
            data={employees} 
            searchPlaceholder="Search staff..." 
            exportFilename="staff_employees_list.csv"
          />
        )}
      </div>

      {/* CREATE USER MODAL */}
      <Modal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Create User Login Profile">
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400">Full Display Name</label>
            <input 
              type="text" 
              required
              placeholder="e.g. John Doe"
              value={newUser.name}
              onChange={(e) => setNewUser({...newUser, name: e.target.value})}
              className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400">Primary Role</label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border focus:outline-none"
              >
                <option value="Teacher">Teacher</option>
                <option value="Student">Student</option>
                <option value="Accountant">Accountant</option>
                <option value="Librarian">Librarian</option>
                <option value="Transport Manager">Transport Manager</option>
                <option value="HR Manager">HR Staff</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400">Email Address</label>
              <input 
                type="email" 
                required
                placeholder="email@school.edu"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400">Contact Number</label>
            <input 
              type="text" 
              required
              placeholder="+91 99999 00000"
              value={newUser.phone}
              onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
              className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border focus:outline-none"
            />
          </div>

          {newUser.role === 'Student' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400">Class Allocation</label>
                <input 
                  type="text" 
                  placeholder="e.g. 10" 
                  value={newUser.class} 
                  onChange={(e) => setNewUser({...newUser, class: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border focus:outline-none" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400">Section Allocation</label>
                <input 
                  type="text" 
                  placeholder="e.g. A" 
                  value={newUser.section} 
                  onChange={(e) => setNewUser({...newUser, section: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold rounded-xl border focus:outline-none" 
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={() => setCreateModalOpen(false)} className="px-4 py-2 text-xs font-semibold rounded-xl hover:bg-slate-100">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl">Create Account</button>
          </div>
        </form>
      </Modal>

      {/* ROLE ASSIGN MODAL */}
      <Modal isOpen={roleAssignModalOpen} onClose={() => setRoleAssignModalOpen(false)} title={`Assign Privileges for: ${selectedUser?.name}`}>
        <div className="space-y-4">
          <p className="text-xs text-slate-500">Modify role templates for the user. System privileges are adjusted instantly.</p>
          <div className="space-y-2">
            {['School Admin', 'Teacher', 'Head of Department', 'Invigilator'].map((roleOpt) => (
              <label key={roleOpt} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-xl cursor-pointer">
                <input 
                  type="radio" 
                  name="user-role-select" 
                  defaultChecked={roleOpt === 'Teacher'} 
                  className="text-indigo-600 focus:ring-indigo-500" 
                />
                <span className="text-xs font-bold text-slate-850 dark:text-slate-200">{roleOpt}</span>
              </label>
            ))}
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button onClick={() => setRoleAssignModalOpen(false)} className="px-4 py-2 text-xs font-semibold rounded-xl hover:bg-slate-100">Cancel</button>
            <button onClick={handleAssignRole} className="px-4 py-2 bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl">Apply Role Permissions</button>
          </div>
        </div>
      </Modal>

      <ToastComponent />
    </div>
  );
};
export default UserManagement;
