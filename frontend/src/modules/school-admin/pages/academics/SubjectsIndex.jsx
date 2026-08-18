import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useToast } from '../../components/ui/Toast';
import { academicPortalApi } from '../../../../shared/api/client';
import { AcademicBreadcrumb, EmptyState } from './components/AcademicUi';
import { apiMessage, ENTITY_STATUS_VARIANT } from './utils';
import { Download, FileUp, Loader2, Pencil, Plus, Trash2, Upload, X } from 'lucide-react';

const inputClass =
  'h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 text-sm outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none focus:border-primary focus:ring-4 focus:ring-primary/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white';

const SUBJECT_TYPES = ['THEORY', 'PRACTICAL', 'BOTH', 'ACTIVITY'];

const SUBJECT_CSV_SAMPLE = `name,code,subjectType\nMathematics,MATH,THEORY\nScience,SCI,THEORY\nEnglish,ENG,THEORY\nPhysical Education,PE,ACTIVITY`;

function downloadFile(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function exportSubjectsCSV(subjects) {
  const rows = ['name,code,subjectType,status',
    ...subjects.map((s) => [s.name, s.code || '', s.subjectType, s.status].join(','))];
  downloadFile(rows.join('\n'), 'subjects.csv', 'text/csv');
}

function parseSubjectCSV(text) {
  const lines = text.trim().split('\n').filter(Boolean);
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
  return lines.slice(1).map((line) => {
    const cols = line.split(',').map((c) => c.trim());
    const row = {};
    headers.forEach((h, i) => (row[h] = cols[i] || ''));
    const types = ['THEORY', 'PRACTICAL', 'BOTH', 'ACTIVITY'];
    return {
      name: row.name,
      code: row.code || '',
      subjectType: types.includes((row.subjecttype || row['subject type'] || '').toUpperCase())
        ? (row.subjecttype || row['subject type']).toUpperCase() : 'THEORY',
    };
  }).filter((r) => r.name);
}

export const SubjectsIndex = () => {
  const { showToast, ToastComponent } = useToast();
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [years, setYears] = useState([]);
  const [subjectMappings, setSubjectMappings] = useState({});
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [importing, setImporting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const importRef = useRef();
  
  // Custom multi-select dropdown controls
  const dropdownRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [form, setForm] = useState({
    name: '',
    code: '',
    subjectType: 'THEORY',
    description: '',
    classIds: [],
    status: 'ACTIVE',
  });

  // Load reference classes and years
  useEffect(() => {
    Promise.all([
      academicPortalApi.classes({ limit: 100 }),
      academicPortalApi.years({ limit: 100 }),
    ])
      .then(([classesRes, yearsRes]) => {
        setClasses((classesRes.data || []).filter((c) => c.status === 'ACTIVE'));
        setYears(yearsRes.data || []);
      })
      .catch(() => {});
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const loadSubjects = useCallback(async () => {
    setLoading(true);
    try {
      // Ensure classes and years are loaded
      let activeClasses = classes;
      let activeYears = years;
      if (activeClasses.length === 0 || activeYears.length === 0) {
        const [cRes, yRes] = await Promise.all([
          academicPortalApi.classes({ limit: 100 }),
          academicPortalApi.years({ limit: 100 }),
        ]);
        activeClasses = (cRes.data || []).filter((c) => c.status === 'ACTIVE');
        activeYears = yRes.data || [];
        setClasses(activeClasses);
        setYears(activeYears);
      }

      const classMap = new Map(activeClasses.map(c => [c.id, c]));
      const activeYear = activeYears.find((y) => y.isCurrent || y.status === 'ACTIVE');

      // Fetch all sections
      const sectionsRes = await academicPortalApi.sections({ limit: 1000 });
      const currentSections = (sectionsRes.data || []).filter(
        (s) => s.academicYearId === activeYear?.id && s.status === 'ACTIVE'
      );

      // Fetch subjects mapped for each active section in parallel
      const mappingsRes = await Promise.all(
        currentSections.map(async (sec) => {
          try {
            const res = await academicPortalApi.sectionSubjects(sec.id);
            return { classId: sec.classId, subjectIds: (res.data || []).map(item => item.subjectId) };
          } catch {
            return { classId: sec.classId, subjectIds: [] };
          }
        })
      );

      const subjectClassesLookup = {};
      mappingsRes.forEach(m => {
        const clsObj = classMap.get(m.classId);
        if (clsObj) {
          m.subjectIds.forEach(sid => {
            if (!subjectClassesLookup[sid]) subjectClassesLookup[sid] = new Set();
            subjectClassesLookup[sid].add(clsObj.name);
          });
        }
      });

      // Convert sets to arrays
      const lookup = {};
      Object.keys(subjectClassesLookup).forEach(sid => {
        lookup[sid] = Array.from(subjectClassesLookup[sid]);
      });
      setSubjectMappings(lookup);

      // Load subjects
      const result = await academicPortalApi.subjects({ limit: 100 });
      setSubjects(result.data || []);
    } catch (error) {
      showToast(apiMessage(error, 'Unable to load subjects'), 'error');
    } finally {
      setLoading(false);
    }
  }, [classes, years, showToast]);

  useEffect(() => {
    loadSubjects();
  }, [loadSubjects]);

  // Filter subjects by status locally
  const filteredSubjects = useMemo(() => {
    return subjects.filter((s) => {
      if (statusFilter === 'ALL') return true;
      return s.status === statusFilter;
    });
  }, [subjects, statusFilter]);

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const parsed = parseSubjectCSV(ev.target.result);
      if (!parsed.length) { showToast('No valid rows found', 'error'); return; }
      setImporting(true);
      let success = 0, failed = 0;
      for (const row of parsed) {
        try { await academicPortalApi.createSubject(row); success++; }
        catch { failed++; }
      }
      setImporting(false);
      showToast(`${success} imported${failed ? `, ${failed} failed` : ''}`, success > 0 ? 'success' : 'error');
      if (success > 0) loadSubjects();
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        code: form.code,
        subjectType: form.subjectType,
        description: form.description,
        status: form.status,
      };

      if (editingSubject) {
        await academicPortalApi.updateSubject(editingSubject.id, payload);
        showToast('Subject updated', 'success');
      } else {
        const res = await academicPortalApi.createSubject(payload);
        const newSubject = res.data;
        showToast('Subject created', 'success');

        if (form.classIds.length > 0 && newSubject?.id) {
          const currentYear = years.find((y) => y.isCurrent || y.status === 'ACTIVE');
          if (currentYear) {
            const sectionsRes = await academicPortalApi.sections({ limit: 1000 });
            const classSections = (sectionsRes.data || []).filter(
              (s) => form.classIds.includes(s.classId) && s.academicYearId === currentYear.id && s.status === 'ACTIVE'
            );

            let mappedCount = 0;
            for (const sec of classSections) {
              try {
                await academicPortalApi.addSectionSubject(sec.id, {
                  subjectId: newSubject.id,
                  maxMarks: 100,
                  passingMarks: 33,
                  isOptional: false,
                });
                mappedCount++;
              } catch (err) {
                console.error(`Failed to assign subject to section ${sec.name}:`, err);
              }
            }
            if (mappedCount > 0) {
              showToast(`Subject automatically mapped to ${mappedCount} sections of selected classes`, 'success');
            }
          }
        }
      }
      setModalOpen(false);
      setEditingSubject(null);
      setForm({ name: '', code: '', subjectType: 'THEORY', description: '', classIds: [], status: 'ACTIVE' });
      setDropdownOpen(false);
      loadSubjects();
    } catch (error) {
      showToast(apiMessage(error, editingSubject ? 'Unable to update subject' : 'Unable to create subject'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (subject) => {
    setEditingSubject(subject);
    setForm({
      name: subject.name || '',
      code: subject.code || '',
      subjectType: subject.subjectType || 'THEORY',
      description: subject.description || '',
      classIds: [],
      status: subject.status || 'ACTIVE',
    });
    setModalOpen(true);
  };

  const handleDelete = (subject) => {
    setDeleteTarget(subject);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await academicPortalApi.deleteSubject(deleteTarget.id);
      showToast('Subject deleted', 'success');
      loadSubjects();
    } catch (error) {
      showToast(apiMessage(error, 'Unable to delete subject'), 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      <AcademicBreadcrumb items={[{ label: 'Subjects' }]} />
      <PageHeader
        title="Subjects"
        subtitle="Reusable school-wide subject master list."
        actions={
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => downloadFile(SUBJECT_CSV_SAMPLE, 'subjects_sample.csv', 'text/csv')}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
              <Download className="h-3.5 w-3.5" /> Sample CSV
            </button>
            <button type="button" onClick={() => importRef.current?.click()} disabled={importing}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 disabled:opacity-60">
              {importing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />} Import
            </button>
            <input ref={importRef} type="file" accept=".csv,.txt" className="hidden" onChange={handleImport} />
            {subjects.length > 0 && (
              <button type="button" onClick={() => exportSubjectsCSV(subjects)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                <FileUp className="h-3.5 w-3.5" /> Export
              </button>
            )}
            <button type="button" onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-bold text-white">
              <Plus className="h-3.5 w-3.5" /> Create Subject
            </button>
          </div>
        }
      />

      {/* Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2 max-w-xs">
          <span className="text-xs font-bold text-slate-500 shrink-0">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 w-40 rounded-xl border border-slate-200 bg-slate-50/80 px-3 text-xs outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Only</option>
            <option value="INACTIVE">Inactive Only</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <table className="w-full text-xs">
            <thead className="border-b border-slate-100 bg-slate-50/70 dark:border-slate-800">
              <tr>
                {['#', 'Subject', 'Code', 'Type', 'Assigned Classes', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-center font-bold text-slate-500">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, index) => (
                <tr key={index} className="border-b border-slate-50 dark:border-slate-850 animate-pulse">
                  <td className="px-4 py-4 text-center"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-6 mx-auto" /></td>
                  <td className="px-4 py-4 text-center"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-20 mx-auto" /></td>
                  <td className="px-4 py-4 text-center"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-12 mx-auto" /></td>
                  <td className="px-4 py-4 text-center"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-16 mx-auto" /></td>
                  <td className="px-4 py-4 text-center"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-24 mx-auto" /></td>
                  <td className="px-4 py-4 text-center"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-16 mx-auto" /></td>
                  <td className="px-4 py-4"><div className="h-8 bg-slate-100 dark:bg-slate-800 rounded-lg w-20 mx-auto" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : filteredSubjects.length === 0 ? (
        <EmptyState title="No subjects yet" description="Create subjects once and assign them to multiple sections." />
      ) : (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <table className="w-full text-xs">
            <thead className="border-b border-slate-100 bg-slate-50/70 dark:border-slate-800">
              <tr>
                {['#', 'Subject', 'Code', 'Type', 'Assigned Classes', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-center font-bold text-slate-500">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredSubjects.map((subject, index) => (
                <tr key={subject.id} className="border-b border-slate-50 dark:border-slate-850">
                  <td className="px-4 py-3 text-center font-semibold text-slate-500">{index + 1}</td>
                  <td className="px-4 py-3 text-center font-bold text-slate-800 dark:text-white">{subject.name}</td>
                  <td className="px-4 py-3 text-center">{subject.code}</td>
                  <td className="px-4 py-3 text-center">{subject.subjectType}</td>
                  <td className="px-4 py-3 text-center font-semibold text-slate-700 dark:text-slate-350">
                    {subjectMappings[subject.id]?.join(', ') || 'Global Only'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant={ENTITY_STATUS_VARIANT[subject.status] || 'default'}>{subject.status}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(subject)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-primary hover:text-primary dark:border-slate-700"
                        aria-label={`Edit ${subject.name}`}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(subject)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-rose-500 hover:border-rose-300 hover:bg-rose-50 dark:border-slate-700 dark:hover:bg-rose-950/20"
                        aria-label={`Delete ${subject.name}`}
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

      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingSubject(null);
          setForm({ name: '', code: '', subjectType: 'THEORY', description: '', classIds: [], status: 'ACTIVE' });
          setDropdownOpen(false);
        }}
        title={editingSubject ? 'Edit Subject' : 'Create Subject'}
      >
        <form
          onSubmit={handleCreate}
          className="space-y-4"
        >
          <div>
            <label className="mb-1 block text-xs font-bold text-slate-500">Subject Name *</label>
            <input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Mathematics" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-500">Code</label>
              <input className={inputClass} value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="e.g. MATH" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-500">Type</label>
              <select
                className={inputClass}
                value={form.subjectType}
                onChange={(e) => setForm({ ...form, subjectType: e.target.value })}
              >
                {SUBJECT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {!editingSubject && (
            <div className="relative" ref={dropdownRef}>
              <label className="mb-1.5 block text-xs font-bold text-slate-500">Assign to Class Standards (Optional)</label>
              
              {/* Custom tags dropdown trigger */}
              <div
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="min-h-[44px] py-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 text-sm flex flex-wrap gap-1.5 items-center cursor-pointer outline-none dark:border-slate-800 dark:bg-slate-950"
              >
                {form.classIds.length === 0 ? (
                  <span className="text-slate-400 select-none">Select Classes (Optional)</span>
                ) : (
                  form.classIds.map((classId) => {
                    const clsObj = classes.find((c) => c.id === classId);
                    if (!clsObj) return null;
                    return (
                      <span
                        key={classId}
                        className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-lg border border-primary/20"
                      >
                        {clsObj.name}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const newIds = form.classIds.filter((id) => id !== classId);
                            setForm({ ...form, classIds: newIds });
                          }}
                          className="hover:bg-primary/20 rounded p-0.5 text-primary transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    );
                  })
                )}
                <span className="ml-auto text-slate-400 text-[10px] select-none">▼</span>
              </div>

              {dropdownOpen && (
                <div className="absolute left-0 bottom-full mb-1.5 w-full z-50 rounded-xl border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-800 dark:bg-slate-950 max-h-44 overflow-y-auto">
                  <div className="space-y-1">
                    {classes.map((c) => {
                      const isChecked = form.classIds.includes(c.id);
                      return (
                        <button
                          type="button"
                          key={c.id}
                          onClick={() => {
                            const newIds = isChecked
                              ? form.classIds.filter((id) => id !== c.id)
                              : [...form.classIds, c.id];
                            setForm({ ...form, classIds: newIds });
                          }}
                          className={`flex items-center justify-between w-full px-3 py-2 text-left text-xs font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer select-none text-slate-800 dark:text-slate-200 ${
                            isChecked ? 'bg-primary/5 text-primary font-bold' : ''
                          }`}
                        >
                          <span>{c.name}</span>
                          {isChecked && <span className="text-primary font-extrabold text-sm">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              <p className="mt-1 text-[10px] text-slate-400">The subject will be mapped to all active sections of the checked classes for the current academic session.</p>
            </div>
          )}

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
            <button type="button" onClick={() => setModalOpen(false)} className="rounded-xl px-4 py-2 text-xs font-semibold">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white disabled:opacity-60">
              {saving ? 'Saving...' : editingSubject ? 'Update Subject' : 'Save Subject'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete Subject"
        message={`Delete subject "${deleteTarget?.name}"?`}
        confirmText="Delete Subject"
        variant="danger"
      />

      <ToastComponent />
    </div>
  );
};

export default SubjectsIndex;
