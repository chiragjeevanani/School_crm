import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useToast } from '../../components/ui/Toast';
import { feePortalApi } from '../../../../shared/api/client';
import { Download, FileUp, Loader2, Pencil, Plus, Sparkles, Trash2, Upload } from 'lucide-react';

const inputClass =
  'h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white';

const CATEGORIES = ['ACADEMIC', 'TRANSPORT', 'HOSTEL', 'ACTIVITY', 'OTHER'];

const CATEGORY_COLORS = {
  ACADEMIC: 'primary',
  TRANSPORT: 'warning',
  HOSTEL: 'purple',
  ACTIVITY: 'success',
  OTHER: 'default',
};

const FEE_HEAD_CSV_SAMPLE = `name,code,category,description,status\nTuition Fee,TUITION,ACADEMIC,Regular academic tuition fee,ACTIVE\nAdmission Fee,ADMISSION,ACADEMIC,One-time admission charge,ACTIVE\nTransport Fee,TRANSPORT,TRANSPORT,Bus and van charges,ACTIVE\nHostel Fee,HOSTEL,HOSTEL,Boarding and lodging,ACTIVE`;

function downloadFile(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function exportFeeHeadsCSV(heads) {
  const rows = [
    'name,code,category,description,status',
    ...heads.map((h) => [h.name, h.code, h.category, `"${(h.description || '').replace(/"/g, '""')}"`, h.status].join(',')),
  ];
  downloadFile(rows.join('\n'), 'fee_heads.csv', 'text/csv');
}

function parseFeeHeadCSV(text) {
  const lines = text.trim().split('\n').filter(Boolean);
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
  return lines
    .slice(1)
    .map((line) => {
      const cols = line.split(',').map((c) => c.trim().replace(/^"|"$/g, ''));
      const row = {};
      headers.forEach((h, i) => (row[h] = cols[i] || ''));
      return {
        name: row.name,
        code: (row.code || row.name?.slice(0, 6) || '').toUpperCase(),
        category: CATEGORIES.includes((row.category || '').toUpperCase()) ? row.category.toUpperCase() : 'ACADEMIC',
        description: row.description || '',
        status: (row.status || 'ACTIVE').toUpperCase() === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE',
      };
    })
    .filter((r) => r.name);
}

export const FeeHeadsIndex = () => {
  const { showToast, ToastComponent } = useToast();
  const [loading, setLoading] = useState(true);
  const [feeHeads, setFeeHeads] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingHead, setEditingHead] = useState(null);
  const [importing, setImporting] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const importRef = useRef();

  const [form, setForm] = useState({
    name: '',
    code: '',
    category: 'ACADEMIC',
    description: '',
    status: 'ACTIVE',
  });

  const loadFeeHeads = useCallback(async () => {
    setLoading(true);
    try {
      const res = await feePortalApi.heads({ limit: 100 });
      setFeeHeads(res.data || []);
    } catch (error) {
      showToast(error.message || 'Unable to load fee heads', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadFeeHeads();
  }, [loadFeeHeads]);

  const statusCounts = useMemo(() => {
    return {
      ALL: feeHeads.length,
      ACTIVE: feeHeads.filter((h) => h.status === 'ACTIVE').length,
      INACTIVE: feeHeads.filter((h) => h.status === 'INACTIVE').length,
    };
  }, [feeHeads]);

  const filteredHeads = useMemo(() => {
    return feeHeads.filter((h) => {
      if (statusFilter !== 'ALL' && h.status !== statusFilter) return false;
      if (categoryFilter !== 'ALL' && h.category !== categoryFilter) return false;
      return true;
    });
  }, [feeHeads, statusFilter, categoryFilter]);

  const handleSeedDefaults = async () => {
    setSeeding(true);
    try {
      const res = await feePortalApi.seedDefaultHeads();
      showToast(res.message || 'Default fee heads seeded successfully', 'success');
      loadFeeHeads();
    } catch (error) {
      showToast(error.message || 'Failed to seed default fee heads', 'error');
    } finally {
      setSeeding(false);
    }
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const parsed = parseFeeHeadCSV(ev.target.result);
      if (!parsed.length) {
        showToast('No valid rows found', 'error');
        return;
      }
      setImporting(true);
      let success = 0;
      let failed = 0;
      for (const row of parsed) {
        try {
          await feePortalApi.createHead(row);
          success++;
        } catch {
          failed++;
        }
      }
      setImporting(false);
      showToast(`${success} imported${failed ? `, ${failed} failed` : ''}`, success > 0 ? 'success' : 'error');
      if (success > 0) loadFeeHeads();
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingHead) {
        await feePortalApi.updateHead(editingHead.id, form);
        showToast('Fee head updated successfully', 'success');
      } else {
        await feePortalApi.createHead(form);
        showToast('Fee head created successfully', 'success');
      }
      setModalOpen(false);
      setEditingHead(null);
      setForm({ name: '', code: '', category: 'ACADEMIC', description: '', status: 'ACTIVE' });
      loadFeeHeads();
    } catch (error) {
      showToast(error.message || 'Failed to save fee head', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (head) => {
    setEditingHead(head);
    setForm({
      name: head.name || '',
      code: head.code || '',
      category: head.category || 'ACADEMIC',
      description: head.description || '',
      status: head.status || 'ACTIVE',
    });
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await feePortalApi.deleteHead(deleteTarget.id);
      showToast('Fee head deleted', 'success');
      loadFeeHeads();
    } catch (error) {
      showToast(error.message || 'Unable to delete fee head', 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  const openCreateModal = () => {
    setEditingHead(null);
    setForm({ name: '', code: '', category: 'ACADEMIC', description: '', status: 'ACTIVE' });
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fee Heads Master"
        subtitle="Dynamic school-wide list of chargeable fee heads (Tuition, Exam, Transport, Activity, etc.)."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {feeHeads.length === 0 && (
              <button
                type="button"
                onClick={handleSeedDefaults}
                disabled={seeding}
                className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-950/30 dark:text-indigo-300"
              >
                {seeding ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />} Seed Defaults
              </button>
            )}
            <button
              type="button"
              onClick={() => downloadFile(FEE_HEAD_CSV_SAMPLE, 'fee_heads_sample.csv', 'text/csv')}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
            >
              <Download className="h-3.5 w-3.5" /> Sample CSV
            </button>
            <button
              type="button"
              onClick={() => importRef.current?.click()}
              disabled={importing}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 disabled:opacity-60"
            >
              {importing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />} Import
            </button>
            <input ref={importRef} type="file" accept=".csv,.txt" className="hidden" onChange={handleImport} />
            {feeHeads.length > 0 && (
              <button
                type="button"
                onClick={() => exportFeeHeadsCSV(feeHeads)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
              >
                <FileUp className="h-3.5 w-3.5" /> Export
              </button>
            )}
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-white shadow-sm"
            >
              <Plus className="h-3.5 w-3.5" /> Create Fee Head
            </button>
          </div>
        }
      />

      {/* Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 select-none">Category:</span>
            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="h-10 rounded-xl border border-slate-200 bg-slate-50/80 pl-3 pr-8 text-xs font-semibold outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white appearance-none cursor-pointer"
              >
                <option value="ALL">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
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
                {['#', 'Fee Head Name', 'Code', 'Category', 'Description', 'Status', 'Actions'].map((h) => (
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
                  <td className="px-4 py-4 text-center"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-24 mx-auto" /></td>
                  <td className="px-4 py-4 text-center"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-16 mx-auto" /></td>
                  <td className="px-4 py-4 text-center"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-16 mx-auto" /></td>
                  <td className="px-4 py-4 text-center"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-32 mx-auto" /></td>
                  <td className="px-4 py-4 text-center"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-14 mx-auto" /></td>
                  <td className="px-4 py-4"><div className="h-8 bg-slate-100 dark:bg-slate-800 rounded-lg w-16 mx-auto" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : filteredHeads.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-bold text-slate-700 dark:text-slate-200">No fee heads found</p>
          <p className="mt-1 text-xs text-slate-400">
            Create fee heads like Tuition Fee, Admission Fee, Transport Fee to start building class fee structures.
          </p>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={handleSeedDefaults}
              className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300"
            >
              <Sparkles className="h-3.5 w-3.5" /> Seed Default Fee Heads
            </button>
            <button
              type="button"
              onClick={openCreateModal}
              className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm"
            >
              + Create Custom Head
            </button>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <table className="w-full text-xs">
            <thead className="border-b border-slate-100 bg-slate-50/70 text-slate-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
              <tr>
                {['#', 'Fee Head Name', 'Code', 'Category', 'Description', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-center font-bold text-slate-500 dark:text-slate-400">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredHeads.map((head, index) => (
                <tr key={head.id} className="border-b border-slate-50 dark:border-slate-850 hover:bg-slate-50/50 dark:hover:bg-slate-850/50">
                  <td className="px-4 py-3 text-center font-semibold text-slate-500">{index + 1}</td>
                  <td className="px-4 py-3 text-center font-bold text-slate-800 dark:text-white">{head.name}</td>
                  <td className="px-4 py-3 text-center font-mono font-bold text-indigo-600 dark:text-indigo-400">{head.code}</td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant={CATEGORY_COLORS[head.category] || 'default'}>{head.category}</Badge>
                  </td>
                  <td className="px-4 py-3 text-center text-slate-500">{head.description || '—'}</td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant={head.status === 'ACTIVE' ? 'success' : 'default'}>{head.status}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(head)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-primary hover:text-primary dark:border-slate-700"
                        title="Edit Fee Head"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(head)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-rose-500 hover:border-rose-300 hover:bg-rose-50 dark:border-slate-700 dark:hover:bg-rose-950/20"
                        title="Delete Fee Head"
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

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingHead(null);
        }}
        title={editingHead ? 'Edit Fee Head' : 'Create New Fee Head'}
      >
        <form onSubmit={handleCreateOrUpdate} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-bold text-slate-500">Fee Head Name *</label>
            <input
              className={inputClass}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Tuition Fee, Exam Fee, Transport Fee"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-500">Code *</label>
              <input
                className={inputClass}
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                placeholder="e.g. TUITION, EXAM"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-500">Category *</label>
              <select
                className={inputClass}
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-slate-500">Description</label>
            <input
              className={inputClass}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Optional notes or details about this fee component"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold text-slate-500">Status</label>
            <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-950">
              <button
                type="button"
                onClick={() => setForm({ ...form, status: 'ACTIVE' })}
                className={`rounded-lg px-4 py-2 text-xs font-semibold transition-colors ${
                  form.status === 'ACTIVE'
                    ? 'bg-emerald-500 text-white'
                    : 'text-slate-600 hover:bg-white dark:text-slate-300 dark:hover:bg-slate-900'
                }`}
              >
                Active
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, status: 'INACTIVE' })}
                className={`rounded-lg px-4 py-2 text-xs font-semibold transition-colors ${
                  form.status === 'INACTIVE'
                    ? 'bg-slate-700 text-white dark:bg-slate-600'
                    : 'text-slate-600 hover:bg-white dark:text-slate-300 dark:hover:bg-slate-900'
                }`}
              >
                Inactive
              </button>
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
              {saving ? 'Saving...' : editingHead ? 'Update Fee Head' : 'Save Fee Head'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete Fee Head"
        message={`Are you sure you want to delete fee head "${deleteTarget?.name}"?`}
        confirmText="Delete Fee Head"
        variant="danger"
      />

      <ToastComponent />
    </div>
  );
};

export default FeeHeadsIndex;
