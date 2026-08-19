import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useToast } from '../../components/ui/Toast';
import { academicPortalApi, feePortalApi } from '../../../../shared/api/client';
import { Layers, ListChecks, Loader2, Pencil, Plus, Settings, Trash2 } from 'lucide-react';

const inputClass =
  'h-11 w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white';

export const FeeStructuresIndex = () => {
  const navigate = useNavigate();
  const { showToast, ToastComponent } = useToast();
  const [loading, setLoading] = useState(true);
  const [structures, setStructures] = useState([]);
  const [years, setYears] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingStructure, setEditingStructure] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [form, setForm] = useState({
    academicYearId: '',
    classId: '',
    name: '',
    description: '',
    status: 'ACTIVE',
  });

  // Load reference Academic Years and Classes
  useEffect(() => {
    Promise.all([
      academicPortalApi.years({ limit: 100 }),
      academicPortalApi.classes({ limit: 100 }),
    ])
      .then(([yRes, cRes]) => {
        const yearList = yRes.data || [];
        setYears(yearList);
        setClasses((cRes.data || []).filter((c) => c.status === 'ACTIVE'));
      })
      .catch(() => {});
  }, []);

  const loadStructures = useCallback(async () => {
    setLoading(true);
    try {
      const res = await feePortalApi.structures({
        academicYearId: selectedYear || undefined,
        limit: 100,
      });
      setStructures(res.data || []);
    } catch (error) {
      showToast(error.message || 'Unable to load fee structures', 'error');
    } finally {
      setLoading(false);
    }
  }, [selectedYear, showToast]);

  useEffect(() => {
    loadStructures();
  }, [loadStructures]);

  const statusCounts = useMemo(() => {
    return {
      ALL: structures.length,
      ACTIVE: structures.filter((s) => s.status === 'ACTIVE').length,
      DRAFT: structures.filter((s) => s.status === 'DRAFT').length,
      INACTIVE: structures.filter((s) => s.status === 'INACTIVE').length,
    };
  }, [structures]);

  const filteredStructures = useMemo(() => {
    return structures.filter((s) => {
      if (statusFilter !== 'ALL' && s.status !== statusFilter) return false;
      return true;
    });
  }, [structures, statusFilter]);

  const handleClassChange = (classId) => {
    const clsObj = classes.find((c) => c.id === classId);
    const yrObj = years.find((y) => y.id === (form.academicYearId || selectedYear));
    const autoName = clsObj && yrObj ? `${clsObj.name} - ${yrObj.name} Fee Structure` : form.name;
    setForm((prev) => ({ ...prev, classId, name: autoName }));
  };

  const handleYearChange = (academicYearId) => {
    const clsObj = classes.find((c) => c.id === form.classId);
    const yrObj = years.find((y) => y.id === academicYearId);
    const autoName = clsObj && yrObj ? `${clsObj.name} - ${yrObj.name} Fee Structure` : form.name;
    setForm((prev) => ({ ...prev, academicYearId, name: autoName }));
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingStructure) {
        await feePortalApi.updateStructure(editingStructure.id, {
          name: form.name,
          description: form.description,
          status: form.status,
        });
        showToast('Fee structure updated', 'success');
      } else {
        const res = await feePortalApi.createStructure({
          ...form,
          academicYearId: form.academicYearId || selectedYear,
        });
        showToast('Fee structure created! Now add fee line items.', 'success');
        navigate(`/school-admin/fees/structures/${res.data.id}`);
      }
      setModalOpen(false);
      setEditingStructure(null);
      loadStructures();
    } catch (error) {
      showToast(error.message || 'Failed to save fee structure', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (structure) => {
    setEditingStructure(structure);
    setForm({
      academicYearId: structure.academicYear?.id || '',
      classId: structure.class?.id || '',
      name: structure.name || '',
      description: structure.description || '',
      status: structure.status || 'ACTIVE',
    });
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await feePortalApi.deleteStructure(deleteTarget.id);
      showToast('Fee structure and items deleted', 'success');
      loadStructures();
    } catch (error) {
      showToast(error.message || 'Unable to delete fee structure', 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  const openCreateModal = () => {
    const yrObj = years.find((y) => y.id === selectedYear);
    const firstClass = classes[0];
    const defaultName = firstClass && yrObj ? `${firstClass.name} - ${yrObj.name} Fee Structure` : '';
    setEditingStructure(null);
    setForm({
      academicYearId: selectedYear || '',
      classId: firstClass?.id || '',
      name: defaultName,
      description: '',
      status: 'ACTIVE',
    });
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Class Fee Structures"
        subtitle="Manage dynamic fee line items and charge schedules configured per Class and Academic Year."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/school-admin/fees/heads')}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              <ListChecks className="h-3.5 w-3.5" /> Manage Fee Heads Master
            </button>
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-white shadow-sm"
            >
              <Plus className="h-3.5 w-3.5" /> Create Fee Structure
            </button>
          </div>
        }
      />

      {/* Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 select-none">Academic Year:</span>
            <div className="relative">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="h-10 rounded-xl border border-slate-200 bg-slate-50/80 pl-3.5 pr-9 text-xs font-semibold outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white appearance-none cursor-pointer"
              >
                <option value="">All Academic Years</option>
                {years.map((y) => (
                  <option key={y.id} value={y.id}>
                    {y.name} {y.isCurrent ? '(Current)' : ''}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 select-none">Status:</span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'ALL', label: 'All Statuses', count: statusCounts.ALL },
                { id: 'ACTIVE', label: 'Active', count: statusCounts.ACTIVE },
                { id: 'DRAFT', label: 'Draft', count: statusCounts.DRAFT },
                { id: 'INACTIVE', label: 'Inactive', count: statusCounts.INACTIVE },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setStatusFilter(item.id)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all duration-200 ${
                    statusFilter === item.id
                      ? 'bg-primary text-white shadow-sm shadow-primary/20'
                      : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-350 dark:hover:bg-slate-850'
                  }`}
                >
                  {item.label}{' '}
                  <span className={`ml-1 text-[10px] ${statusFilter === item.id ? 'opacity-80' : 'text-slate-400 dark:text-slate-500'}`}>
                    ({item.count})
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <table className="w-full text-xs">
            <thead className="border-b border-slate-100 bg-slate-50/70 text-slate-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
              <tr>
                {['#', 'Structure Name', 'Class', 'Academic Year', 'Configured Line Items', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-center font-bold text-slate-500 dark:text-slate-400">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 4 }).map((_, index) => (
                <tr key={index} className="border-b border-slate-50 dark:border-slate-850 animate-pulse">
                  <td className="px-4 py-4 text-center"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-6 mx-auto" /></td>
                  <td className="px-4 py-4 text-center"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-36 mx-auto" /></td>
                  <td className="px-4 py-4 text-center"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-16 mx-auto" /></td>
                  <td className="px-4 py-4 text-center"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-20 mx-auto" /></td>
                  <td className="px-4 py-4 text-center"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-16 mx-auto" /></td>
                  <td className="px-4 py-4 text-center"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-14 mx-auto" /></td>
                  <td className="px-4 py-4"><div className="h-8 bg-slate-100 dark:bg-slate-800 rounded-lg w-24 mx-auto" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : filteredStructures.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
          <Layers className="h-10 w-10 text-slate-400" />
          <p className="mt-3 text-sm font-bold text-slate-700 dark:text-slate-200">No fee structures configured</p>
          <p className="mt-1 text-xs text-slate-400">
            Create fee structures for classes (e.g. Class 10 - 2026-27) and attach tuition, exam, and other fee components.
          </p>
          <button
            type="button"
            onClick={openCreateModal}
            className="mt-4 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm"
          >
            + Create Class Fee Structure
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <table className="w-full text-xs">
            <thead className="border-b border-slate-100 bg-slate-50/70 text-slate-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
              <tr>
                {['#', 'Structure Name', 'Class', 'Academic Year', 'Configured Line Items', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-center font-bold text-slate-500 dark:text-slate-400">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredStructures.map((st, index) => (
                <tr key={st.id} className="border-b border-slate-50 dark:border-slate-850 hover:bg-slate-50/50 dark:hover:bg-slate-850/50">
                  <td className="px-4 py-3.5 text-center font-semibold text-slate-500">{index + 1}</td>
                  <td className="px-4 py-3.5 text-center font-bold text-slate-800 dark:text-white">
                    <button
                      type="button"
                      onClick={() => navigate(`/school-admin/fees/structures/${st.id}`)}
                      className="hover:text-primary transition-colors text-left"
                    >
                      {st.name}
                    </button>
                  </td>
                  <td className="px-4 py-3.5 text-center font-semibold text-slate-700 dark:text-slate-300">
                    {st.class?.name || '—'}
                  </td>
                  <td className="px-4 py-3.5 text-center text-slate-600 dark:text-slate-400">
                    {st.academicYear?.name || '—'}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
                      {st.itemsCount || 0} Fees
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <Badge variant={st.status === 'ACTIVE' ? 'success' : st.status === 'DRAFT' ? 'warning' : 'default'}>
                      {st.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => navigate(`/school-admin/fees/structures/${st.id}`)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-primary hover:bg-primary/5 dark:border-slate-700"
                        title="Configure Line Items"
                      >
                        <Settings className="h-3.5 w-3.5" /> Setup Items
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEdit(st)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-primary hover:text-primary dark:border-slate-700"
                        title="Edit Structure Details"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(st)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-rose-500 hover:border-rose-300 hover:bg-rose-50 dark:border-slate-700 dark:hover:bg-rose-950/20"
                        title="Delete Structure"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingStructure(null);
        }}
        title={editingStructure ? 'Edit Fee Structure' : 'Create Class Fee Structure'}
      >
        <form onSubmit={handleCreateOrUpdate} className="space-y-4">
          {!editingStructure && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-500">Academic Year *</label>
                <select
                  className={inputClass}
                  value={form.academicYearId || selectedYear}
                  onChange={(e) => handleYearChange(e.target.value)}
                  required
                >
                  {years.map((y) => (
                    <option key={y.id} value={y.id}>
                      {y.name} {y.isCurrent ? '(Current)' : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-500">Class Standard *</label>
                <select
                  className={inputClass}
                  value={form.classId}
                  onChange={(e) => handleClassChange(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select Class
                  </option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div>
            <label className="mb-1 block text-xs font-bold text-slate-500">Structure Title *</label>
            <input
              className={inputClass}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Class 10 - 2026-27 Regular Fee Structure"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-slate-500">Description</label>
            <input
              className={inputClass}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Optional notes or eligibility terms"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold text-slate-500">Status</label>
            <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-950">
              {['ACTIVE', 'DRAFT', 'INACTIVE'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setForm({ ...form, status: st })}
                  className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                    form.status === st
                      ? st === 'ACTIVE'
                        ? 'bg-emerald-500 text-white'
                        : st === 'DRAFT'
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-700 text-white'
                      : 'text-slate-600 hover:bg-white dark:text-slate-300 dark:hover:bg-slate-900'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="rounded-xl px-4 py-2 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm disabled:opacity-60"
            >
              {saving ? 'Saving...' : editingStructure ? 'Update Structure' : 'Proceed to Add Fee Items'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete Fee Structure"
        message={`Delete "${deleteTarget?.name}" and all attached fee line items?`}
        confirmText="Delete Structure"
        variant="danger"
      />

      <ToastComponent />
    </div>
  );
};

export default FeeStructuresIndex;
