import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useToast } from '../../components/ui/Toast';
import { schoolUserApi } from '../../../../shared/api/client';
import { apiMessage } from '../academics/utils';
import {
  Briefcase,
  Building2,
  CheckCircle2,
  CreditCard,
  Download,
  Edit3,
  Eye,
  FileText,
  Key,
  Loader2,
  Mail,
  Plus,
  Power,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  Trash2,
  Upload,
  UserCheck,
  UserPlus,
  Users,
  UserX,
} from 'lucide-react';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1').replace(/\/$/, '');

const ROLE_TABS = [
  { id: 'ALL', label: 'All Staff & Users' },
  { id: 'TEACHER', label: 'Teachers' },
  { id: 'LIBRARIAN', label: 'Librarians' },
  { id: 'HR', label: 'Human Resources' },
  { id: 'ACCOUNTANT', label: 'Accountants' },
  { id: 'TRANSPORT', label: 'Transport' },
];

const ROLES = [
  { id: 'TEACHER', label: 'Teacher' },
  { id: 'LIBRARIAN', label: 'Librarian' },
  { id: 'HR', label: 'HR (Human Resources)' },
  { id: 'ACCOUNTANT', label: 'Accountant' },
  { id: 'TRANSPORT', label: 'Transport Manager' },
];

const ROLE_VARIANTS = {
  TEACHER: 'primary',
  LIBRARIAN: 'info',
  HR: 'purple',
  ACCOUNTANT: 'warning',
  TRANSPORT: 'emerald',
};

const defaultForm = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  role: 'TEACHER',
  phone: '',
  gender: 'MALE',
  specialization: '',
  employeeId: '',
  joiningDate: new Date().toISOString().split('T')[0],
  department: '',
  designation: '',
  accountName: '',
  accountNumber: '',
  ifscCode: '',
  bankName: '',
  branchName: '',
  accountType: 'SALARY',
  status: 'ACTIVE',
};

function buildFileUrl(path) {
  if (!path) return '';
  if (/^(https?:|data:|blob:)/.test(path)) return path;
  return `${API_BASE_URL}/platform${path.startsWith('/') ? path : `/${path}`}`;
}

function getInitials(name) {
  return (
    (name || 'Staff')
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('') || 'ST'
  );
}

function exportUsersToCSV(users) {
  const headers = [
    'Employee ID',
    'Name',
    'Email',
    'Role',
    'Phone',
    'Department',
    'Designation',
    'Specialization',
    'Joining Date',
    'Status',
    'Bank Name',
    'Account Number',
    'IFSC Code',
    'Account Type',
  ];

  const rows = users.map((u) => [
    `"${u.employeeId || ''}"`,
    `"${u.name || ''}"`,
    `"${u.email || ''}"`,
    `"${u.role || ''}"`,
    `"${u.phone || ''}"`,
    `"${u.department || ''}"`,
    `"${u.designation || ''}"`,
    `"${u.specialization || ''}"`,
    `"${u.joiningDate ? new Date(u.joiningDate).toLocaleDateString() : ''}"`,
    `"${u.status || ''}"`,
    `"${u.bankDetails?.bankName || ''}"`,
    `"${u.bankDetails?.accountNumber || ''}"`,
    `"${u.bankDetails?.ifscCode || ''}"`,
    `"${u.bankDetails?.accountType || ''}"`,
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `staff_users_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export const UserManagement = () => {
  const { showToast, ToastComponent } = useToast();

  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0, TEACHER: 0, LIBRARIAN: 0, HR: 0, ACCOUNTANT: 0, TRANSPORT: 0 });
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  // Filters
  const [selectedRoleTab, setSelectedRoleTab] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [documentFiles, setDocumentFiles] = useState([]);
  const [existingDocs, setExistingDocs] = useState([]);

  // Change Password Modal
  const [passwordModalUser, setPasswordModalUser] = useState(null);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  // Delete Dialog
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fileInputRef = useRef();
  const docInputRef = useRef();

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await schoolUserApi.list({
        role: selectedRoleTab !== 'ALL' ? selectedRoleTab : undefined,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        search: searchQuery.trim() || undefined,
        limit: 200,
      });
      setUsers(res.data || []);
      if (res.stats) setStats(res.stats);
    } catch (error) {
      showToast(apiMessage(error, 'Unable to load staff users directory'), 'error');
    } finally {
      setLoading(false);
    }
  }, [selectedRoleTab, statusFilter, searchQuery, showToast]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleOpenCreateModal = () => {
    setEditingUser(null);
    setForm({
      ...defaultForm,
      employeeId: `EMP${Math.floor(1000 + Math.random() * 9000)}`,
      role: selectedRoleTab !== 'ALL' ? selectedRoleTab : 'TEACHER',
    });
    setPhotoFile(null);
    setPhotoPreview('');
    setDocumentFiles([]);
    setExistingDocs([]);
    setCreateModalOpen(true);
  };

  const handleOpenEditModal = (user) => {
    setEditingUser(user);
    setForm({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      password: '',
      role: user.role || 'TEACHER',
      phone: user.phone || '',
      gender: user.gender || 'MALE',
      specialization: user.specialization || '',
      employeeId: user.employeeId || '',
      joiningDate: user.joiningDate ? new Date(user.joiningDate).toISOString().split('T')[0] : '',
      department: user.department || '',
      designation: user.designation || '',
      accountName: user.bankDetails?.accountName || '',
      accountNumber: user.bankDetails?.accountNumber || '',
      ifscCode: user.bankDetails?.ifscCode || '',
      bankName: user.bankDetails?.bankName || '',
      branchName: user.bankDetails?.branchName || '',
      accountType: user.bankDetails?.accountType || 'SALARY',
      status: user.status || 'ACTIVE',
    });
    setPhotoFile(null);
    setPhotoPreview(user.photo ? buildFileUrl(user.photo) : '');
    setDocumentFiles([]);
    setExistingDocs(Array.isArray(user.documents) ? user.documents : []);
    setCreateModalOpen(true);
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast('Photo must be less than 5MB', 'error');
      return;
    }
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleDocumentSelect = (e) => {
    const files = Array.from(e.target.files || []);
    const availableSlots = 3 - existingDocs.length - documentFiles.length;
    if (files.length > availableSlots) {
      showToast(`You can only upload up to 3 documents in total (${availableSlots} slots remaining)`, 'warning');
    }
    const toAdd = files.slice(0, Math.max(0, availableSlots));
    setDocumentFiles((prev) => [...prev, ...toAdd]);
  };

  const handleRemoveNewDoc = (index) => {
    setDocumentFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingDoc = (docPath) => {
    setExistingDocs((prev) => prev.filter((d) => d !== docPath));
  };

  const handleSubmitUser = async (e) => {
    e.preventDefault();
    if (!form.firstName || !form.email || !form.employeeId || !form.role) {
      showToast('Please fill all required fields marked with *', 'error');
      return;
    }

    if (!editingUser && (!form.password || form.password.length < 6)) {
      showToast('Initial login password must be at least 6 characters', 'error');
      return;
    }

    setBusy(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          if (key === 'password' && editingUser && !val) return;
          formData.append(key, val);
        }
      });

      if (photoFile) {
        formData.append('photo', photoFile);
      }

      documentFiles.forEach((file) => {
        formData.append('documents', file);
      });

      if (editingUser) {
        const removedDocs = (editingUser.documents || []).filter((d) => !existingDocs.includes(d));
        removedDocs.forEach((d) => formData.append('removeDocuments', d));
        await schoolUserApi.update(editingUser.id, formData);
        showToast(`User "${form.firstName}" updated successfully`, 'success');
      } else {
        await schoolUserApi.create(formData);
        showToast(`Staff user "${form.firstName}" registered successfully`, 'success');
      }

      setCreateModalOpen(false);
      loadUsers();
    } catch (error) {
      showToast(apiMessage(error, 'Failed to save staff user record'), 'error');
    } finally {
      setBusy(false);
    }
  };

  const handleToggleStatus = async (user) => {
    const nextStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await schoolUserApi.updateStatus(user.id, nextStatus);
      showToast(`${user.name} marked as ${nextStatus}`, 'success');
      loadUsers();
    } catch (error) {
      showToast(apiMessage(error, 'Failed to toggle status'), 'error');
    }
  };

  const handleSendCredentials = async (user) => {
    try {
      const res = await schoolUserApi.sendCredentials(user.id);
      showToast(res.message || `Credentials dispatched to ${user.email}`, 'success');
      loadUsers();
    } catch (error) {
      showToast(apiMessage(error, 'Failed to send credentials email'), 'error');
    }
  };

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!newPasswordInput || newPasswordInput.length < 6) {
      showToast('Password must be at least 6 characters long', 'error');
      return;
    }
    setChangingPassword(true);
    try {
      const res = await schoolUserApi.changePassword(passwordModalUser.id, newPasswordInput);
      showToast(res.message || 'Password changed successfully', 'success');
      setPasswordModalUser(null);
      setNewPasswordInput('');
    } catch (error) {
      showToast(apiMessage(error, 'Failed to change password'), 'error');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleDeleteSubmit = async () => {
    if (!deleteTarget) return;
    try {
      await schoolUserApi.delete(deleteTarget.id);
      showToast(`User "${deleteTarget.name}" deleted successfully`, 'success');
      setDeleteTarget(null);
      loadUsers();
    } catch (error) {
      showToast(apiMessage(error, 'Failed to delete user'), 'error');
    }
  };

  const inputClass =
    'w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-xs font-semibold outline-none transition focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white';

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Staff & User Management"
        subtitle="Manage school staff profiles, roles, employment information, bank details, and login credentials."
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => exportUsersToCSV(users)}
              disabled={users.length === 0}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              <Download className="h-3.5 w-3.5" /> Export CSV
            </button>
            <button
              onClick={handleOpenCreateModal}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-primary/90"
            >
              <UserPlus className="h-3.5 w-3.5" /> Add Staff / User
            </button>
          </div>
        }
      />

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Total Staff</span>
            <Users className="h-4 w-4 text-primary" />
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{stats.total || 0}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Active Staff</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="mt-2 text-2xl font-black text-emerald-600">{stats.active || 0}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Teaching Staff</span>
            <Briefcase className="h-4 w-4 text-indigo-500" />
          </div>
          <p className="mt-2 text-2xl font-black text-indigo-600">{stats.TEACHER || 0}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Operations Staff</span>
            <Building2 className="h-4 w-4 text-amber-500" />
          </div>
          <p className="mt-2 text-2xl font-black text-amber-600">
            {(stats.LIBRARIAN || 0) + (stats.HR || 0) + (stats.ACCOUNTANT || 0) + (stats.TRANSPORT || 0)}
          </p>
        </div>
      </div>

      {/* Role Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-200 pb-2 dark:border-slate-800">
        {ROLE_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedRoleTab(tab.id)}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
              selectedRoleTab === tab.id
                ? 'bg-primary text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search & Status Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="relative min-w-[260px] flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Name, Employee ID, Email, Department..."
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/80 pl-9 pr-3 text-xs font-semibold outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 rounded-xl border border-slate-200 bg-slate-50/80 px-3 text-xs font-semibold outline-none focus:border-primary dark:border-slate-800 dark:bg-slate-950 dark:text-white"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          <button
            onClick={loadUsers}
            className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
            title="Refresh"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Users Data Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {loading ? (
          <div className="flex h-64 flex-col items-center justify-center gap-2 text-slate-400">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-xs font-semibold">Loading staff records...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center">
            <Users className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-700" />
            <h3 className="mt-4 text-sm font-bold text-slate-700 dark:text-slate-200">No Staff Users Found</h3>
            <p className="mt-1 text-xs text-slate-400">
              {searchQuery || selectedRoleTab !== 'ALL' || statusFilter !== 'ALL'
                ? 'Try adjusting your search or role filters.'
                : 'Get started by creating your first school staff user profile.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:border-slate-800 dark:bg-slate-950/40">
                <tr>
                  <th className="px-5 py-3.5">Staff User</th>
                  <th className="px-4 py-3.5">Emp ID</th>
                  <th className="px-4 py-3.5">Role</th>
                  <th className="px-4 py-3.5">Department</th>
                  <th className="px-4 py-3.5">Contact</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.map((user) => {
                  const avatarUrl = buildFileUrl(user.photo);
                  return (
                    <tr
                      key={user.id}
                      className="group transition hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          {avatarUrl ? (
                            <img
                              src={avatarUrl}
                              alt={user.name}
                              className="h-10 w-10 rounded-xl object-cover"
                            />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 font-bold text-primary">
                              {getInitials(user.name)}
                            </div>
                          )}
                          <div>
                            <Link
                              to={`/school-admin/users/${user.id}`}
                              className="font-bold text-slate-900 hover:text-primary dark:text-white"
                            >
                              {user.name}
                            </Link>
                            <p className="text-[11px] text-slate-400">{user.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 font-mono text-[11px] font-bold text-slate-700 dark:text-slate-300">
                        {user.employeeId}
                      </td>

                      <td className="px-4 py-3.5">
                        <Badge variant={ROLE_VARIANTS[user.role] || 'primary'}>
                          {user.role}
                        </Badge>
                      </td>

                      <td className="px-4 py-3.5">
                        <p className="font-semibold text-slate-700 dark:text-slate-300">{user.department || '—'}</p>
                        <p className="text-[10px] text-slate-400">{user.designation || 'Staff'}</p>
                      </td>

                      <td className="px-4 py-3.5 font-medium text-slate-600 dark:text-slate-300">
                        {user.phone || '—'}
                      </td>

                      <td className="px-4 py-3.5">
                        <Badge variant={user.status === 'ACTIVE' ? 'success' : 'default'}>
                          {user.status}
                        </Badge>
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/school-admin/users/${user.id}`}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-primary dark:hover:bg-slate-800"
                            title="View Full Profile"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>

                          <button
                            onClick={() => handleOpenEditModal(user)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-amber-600 dark:hover:bg-slate-800"
                            title="Edit User"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => {
                              setPasswordModalUser(user);
                              setNewPasswordInput('');
                            }}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-amber-500 dark:hover:bg-slate-800"
                            title="Change Password"
                          >
                            <Key className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => handleSendCredentials(user)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-sky-600 dark:hover:bg-slate-800"
                            title="Send Password to Email"
                          >
                            <Send className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => handleToggleStatus(user)}
                            className={`rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 ${
                              user.status === 'ACTIVE' ? 'text-amber-500' : 'text-emerald-500'
                            }`}
                            title={user.status === 'ACTIVE' ? 'Deactivate User' : 'Activate User'}
                          >
                            <Power className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => setDeleteTarget(user)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
                            title="Delete User"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit User Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title={editingUser ? `Edit Staff User: ${editingUser.name}` : 'Register New Staff User'}
      >
        <form onSubmit={handleSubmitUser} className="space-y-6">
          {/* 1. Personal & Login Details */}
          <div className="space-y-3">
            <h4 className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200">
              <ShieldCheck className="h-4 w-4 text-primary" /> 1. Personal & Login Credentials
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-[11px] font-bold text-slate-500">First Name *</label>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  placeholder="e.g. Ramesh"
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold text-slate-500">Last Name</label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  placeholder="e.g. Kumar"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-[11px] font-bold text-slate-500">Email Address *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="staff@school.edu"
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold text-slate-500">
                  {editingUser ? 'New Password (Leave blank to keep current)' : 'Login Password *'}
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder={editingUser ? '••••••••' : 'Min 6 characters'}
                  required={!editingUser}
                  minLength={6}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="mb-1 block text-[11px] font-bold text-slate-500">Staff Role *</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className={inputClass}
                  required
                >
                  {ROLES.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold text-slate-500">Phone / Mobile</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold text-slate-500">Gender</label>
                <select
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                  className={inputClass}
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* 2. Employment Details */}
          <div className="space-y-3 border-t border-slate-100 pt-4 dark:border-slate-800">
            <h4 className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200">
              <Briefcase className="h-4 w-4 text-indigo-500" /> 2. Employment & Designation
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-[11px] font-bold text-slate-500">Employee ID *</label>
                <input
                  type="text"
                  value={form.employeeId}
                  onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
                  placeholder="e.g. EMP1024"
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold text-slate-500">Joining Date</label>
                <input
                  type="date"
                  value={form.joiningDate}
                  onChange={(e) => setForm({ ...form, joiningDate: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="mb-1 block text-[11px] font-bold text-slate-500">Department</label>
                <input
                  type="text"
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                  placeholder="e.g. Science / Accounts"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold text-slate-500">Designation</label>
                <input
                  type="text"
                  value={form.designation}
                  onChange={(e) => setForm({ ...form, designation: e.target.value })}
                  placeholder="e.g. Senior Teacher"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold text-slate-500">Specialization</label>
                <input
                  type="text"
                  value={form.specialization}
                  onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                  placeholder="e.g. Mathematics / Finance"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* 3. Bank Account & Payroll */}
          <div className="space-y-3 border-t border-slate-100 pt-4 dark:border-slate-800">
            <h4 className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200">
              <CreditCard className="h-4 w-4 text-emerald-500" /> 3. Bank Account & Payroll Details
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-[11px] font-bold text-slate-500">Account Holder Name</label>
                <input
                  type="text"
                  value={form.accountName}
                  onChange={(e) => setForm({ ...form, accountName: e.target.value })}
                  placeholder="e.g. Ramesh Kumar"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold text-slate-500">Account Number</label>
                <input
                  type="text"
                  value={form.accountNumber}
                  onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
                  placeholder="e.g. 501004382910"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3">
              <div>
                <label className="mb-1 block text-[11px] font-bold text-slate-500">IFSC Code</label>
                <input
                  type="text"
                  value={form.ifscCode}
                  onChange={(e) => setForm({ ...form, ifscCode: e.target.value.toUpperCase() })}
                  placeholder="HDFC0001234"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold text-slate-500">Bank Name</label>
                <input
                  type="text"
                  value={form.bankName}
                  onChange={(e) => setForm({ ...form, bankName: e.target.value })}
                  placeholder="HDFC Bank"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold text-slate-500">Branch Name</label>
                <input
                  type="text"
                  value={form.branchName}
                  onChange={(e) => setForm({ ...form, branchName: e.target.value })}
                  placeholder="Connaught Place"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold text-slate-500">Account Type</label>
                <select
                  value={form.accountType}
                  onChange={(e) => setForm({ ...form, accountType: e.target.value })}
                  className={inputClass}
                >
                  <option value="SALARY">Salary</option>
                  <option value="SAVINGS">Savings</option>
                  <option value="CURRENT">Current</option>
                </select>
              </div>
            </div>
          </div>

          {/* 4. Photo & Document Uploads (Max 3) */}
          <div className="space-y-3 border-t border-slate-100 pt-4 dark:border-slate-800">
            <h4 className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200">
              <FileText className="h-4 w-4 text-amber-500" /> 4. Profile Photo & KYC Documents (Max 3 Images)
            </h4>

            <div className="grid grid-cols-2 gap-4">
              {/* Profile Photo */}
              <div>
                <label className="mb-1 block text-[11px] font-bold text-slate-500">Profile Photo</label>
                <div className="flex items-center gap-3">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="h-12 w-12 rounded-xl object-cover" />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400 dark:bg-slate-800">
                      <Users className="h-6 w-6" />
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                  >
                    Select Photo
                  </button>
                </div>
              </div>

              {/* Document Images (Max 3) */}
              <div>
                <label className="mb-1 block text-[11px] font-bold text-slate-500">
                  KYC / Documents (Max 3 Images)
                </label>
                <input
                  type="file"
                  ref={docInputRef}
                  accept="image/*"
                  multiple
                  onChange={handleDocumentSelect}
                  className="hidden"
                />
                <button
                  type="button"
                  disabled={existingDocs.length + documentFiles.length >= 3}
                  onClick={() => docInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                >
                  <Upload className="h-3.5 w-3.5" /> Upload Document ({existingDocs.length + documentFiles.length}/3)
                </button>
              </div>
            </div>

            {/* Document Badges / Thumbnails */}
            {(existingDocs.length > 0 || documentFiles.length > 0) && (
              <div className="flex flex-wrap gap-2 pt-2">
                {existingDocs.map((doc, idx) => (
                  <div
                    key={`exist-${idx}`}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs dark:border-slate-800 dark:bg-slate-950"
                  >
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Saved Doc #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingDoc(doc)}
                      className="text-rose-500 hover:text-rose-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {documentFiles.map((file, idx) => (
                  <div
                    key={`new-${idx}`}
                    className="flex items-center gap-1.5 rounded-xl border border-primary/20 bg-primary/5 px-2.5 py-1 text-xs text-primary"
                  >
                    <span className="font-semibold truncate max-w-[120px]">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveNewDoc(idx)}
                      className="text-rose-500 hover:text-rose-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setCreateModalOpen(false)}
              className="rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-primary/90 disabled:opacity-60"
            >
              {busy ? 'Saving...' : editingUser ? 'Update Staff User' : 'Create Staff User'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Change Password Modal */}
      {passwordModalUser && (
        <Modal
          isOpen={Boolean(passwordModalUser)}
          onClose={() => setPasswordModalUser(null)}
          title={`Change Password: ${passwordModalUser.name}`}
        >
          <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-600 dark:text-slate-300">
                New Password *
              </label>
              <input
                type="password"
                value={newPasswordInput}
                onChange={(e) => setNewPasswordInput(e.target.value)}
                placeholder="Minimum 6 characters"
                required
                minLength={6}
                className={inputClass}
              />
              <p className="mt-1 text-[11px] text-slate-400">
                Login password for {passwordModalUser.email} will be updated immediately.
              </p>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setPasswordModalUser(null)}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={changingPassword}
                className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm disabled:opacity-60"
              >
                {changingPassword ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Staff User Record"
        message={`Are you sure you want to permanently remove "${deleteTarget?.name}" (${deleteTarget?.employeeId})? This action cannot be undone.`}
        confirmLabel="Delete User"
        onConfirm={handleDeleteSubmit}
        onCancel={() => setDeleteTarget(null)}
        variant="danger"
      />

      <ToastComponent />
    </div>
  );
};

export default UserManagement;
