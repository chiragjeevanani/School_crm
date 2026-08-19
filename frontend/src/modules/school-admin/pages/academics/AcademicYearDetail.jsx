import React, { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useToast } from '../../components/ui/Toast';
import { academicPortalApi } from '../../../../shared/api/client';
import { AcademicBreadcrumb, CountCards, EmptyState } from './components/AcademicUi';
import { apiMessage, formatDate, YEAR_STATUS_VARIANT } from './utils';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { DetailPageSkeleton } from '../../components/ui/SkeletonLoader';

export const AcademicYearDetail = () => {
  const { yearId } = useParams();
  const { showToast, ToastComponent } = useToast();
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(null);
  const [yearClasses, setYearClasses] = useState([]);
  const [allClasses, setAllClasses] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [sectionModal, setSectionModal] = useState(null);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [saving, setSaving] = useState(false);
  const [sectionForm, setSectionForm] = useState({ name: '', capacity: 40, roomNumber: '', classTeacherId: '' });
  const [teachers, setTeachers] = useState([]);
  const [removeClassTarget, setRemoveClassTarget] = useState(null);
  const [deleteSectionTarget, setDeleteSectionTarget] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [yearRes, classesRes, allClassesRes, teachersRes] = await Promise.all([
        academicPortalApi.getYear(yearId),
        academicPortalApi.yearClasses(yearId),
        academicPortalApi.classes({ limit: 100 }),
        academicPortalApi.teachers({ status: 'ACTIVE' }),
      ]);
      setYear(yearRes.data);
      setYearClasses(classesRes.data || []);
      setAllClasses(allClassesRes.data || []);
      setTeachers(teachersRes.data || []);
    } catch (error) {
      showToast(apiMessage(error, 'Unable to load academic year'), 'error');
    } finally {
      setLoading(false);
    }
  }, [yearId, showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const availableClasses = allClasses.filter(
    (cls) => !yearClasses.some((item) => item.classId === cls.id)
  );

  const handleAddClass = async (e) => {
    e.preventDefault();
    if (!selectedClassId) return;
    setSaving(true);
    try {
      await academicPortalApi.addClassToYear(yearId, selectedClassId);
      showToast('Class added to academic year', 'success');
      setModalOpen(false);
      setSelectedClassId('');
      loadData();
    } catch (error) {
      showToast(apiMessage(error, 'Unable to add class'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveClass = async () => {
    if (!removeClassTarget) return;
    try {
      await academicPortalApi.removeClassFromYear(yearId, removeClassTarget.classId);
      showToast('Class removed from academic year', 'success');
      loadData();
    } catch (error) {
      showToast(apiMessage(error, 'Unable to remove class mapping'), 'error');
    } finally {
      setRemoveClassTarget(null);
    }
  };

  const handleDeleteSection = async () => {
    if (!deleteSectionTarget) return;
    try {
      await academicPortalApi.deleteSection(deleteSectionTarget.id);
      showToast('Section deleted successfully', 'success');
      loadData();
    } catch (error) {
      showToast(apiMessage(error, 'Unable to delete section'), 'error');
    } finally {
      setDeleteSectionTarget(null);
    }
  };

  const handleCreateSection = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await academicPortalApi.createSection({
        academicYearId: yearId,
        classId: sectionModal.classId,
        name: sectionForm.name,
        capacity: Number(sectionForm.capacity),
        roomNumber: sectionForm.roomNumber,
        classTeacherId: sectionForm.classTeacherId || undefined,
      });
      showToast('Section created', 'success');
      setSectionModal(null);
      setSectionForm({ name: '', capacity: 40, roomNumber: '', classTeacherId: '' });
      loadData();
    } catch (error) {
      showToast(apiMessage(error, 'Unable to create section'), 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <DetailPageSkeleton />;
  }

  if (!year) {
    return (
      <EmptyState
        title="Academic Year Not Found"
        description="The requested academic session does not exist or has been removed."
      />
    );
  }

  return (
    <div className="space-y-6">
      <AcademicBreadcrumb items={[{ label: 'Academic Years', href: '/school-admin/academics/years' }, { label: year.name }]} />
      <PageHeader
        title={year.name}
        subtitle={`${formatDate(year.startDate)} - ${formatDate(year.endDate)} · Code: ${year.code || '—'}`}
        badge={
          <Badge variant={YEAR_STATUS_VARIANT[year.status] || 'default'}>
            {year.isCurrent ? 'Current Session' : year.status}
          </Badge>
        }
        actions={
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-white shadow-sm"
          >
            <Plus className="h-4 w-4" /> Add Class
          </button>
        }
      />

      <CountCards
        items={[
          { label: 'Classes Mapped', value: yearClasses.length, highlight: true },
          {
            label: 'Total Sections',
            value: yearClasses.reduce((acc, c) => acc + (c.counts?.sections || 0), 0),
          },
          {
            label: 'Enrolled Students',
            value: yearClasses.reduce((acc, c) => acc + (c.counts?.students || 0), 0),
          },
          {
            label: 'Subject Mappings',
            value: yearClasses.reduce((acc, c) => acc + (c.counts?.subjectAssignments || 0), 0),
          },
        ]}
      />

      {yearClasses.length === 0 ? (
        <EmptyState
          title="No classes mapped to this year"
          description="Add classes from your school master list to start creating sections."
        />
      ) : (
        <div className="grid gap-4">
          {yearClasses.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">{item.class?.name}</h4>
                  <p className="mt-1 text-xs text-slate-500">
                    {item.counts?.sections ?? 0} sections · {item.counts?.students ?? 0} students ·{' '}
                    {item.counts?.subjectAssignments ?? 0} subject assignments
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setSectionModal({ classId: item.classId, className: item.class?.name })
                    }
                    className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold hover:border-primary hover:text-primary dark:border-slate-700"
                  >
                    + Add Section
                  </button>
                  <button
                    type="button"
                    onClick={() => setRemoveClassTarget(item)}
                    className="rounded-xl border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-rose-500 hover:bg-rose-50 hover:border-rose-300 dark:border-slate-700 dark:hover:bg-rose-950/20"
                    title="Remove class mapping from this year"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <ClassSections yearId={yearId} classId={item.classId} onChanged={loadData} onDeleteSection={(sec) => setDeleteSectionTarget(sec)} />
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Class to Academic Year">
        <form onSubmit={handleAddClass} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-bold text-slate-500">Select Class *</label>
            <select
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm dark:border-slate-800 dark:bg-slate-950"
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              required
            >
              <option value="">Choose class</option>
              {availableClasses.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>
          {availableClasses.length === 0 && (
            <p className="text-xs text-slate-500">
              No classes available.{' '}
              <Link to="/school-admin/academics/classes" className="font-bold text-primary hover:underline">
                Create classes first
              </Link>
              .
            </p>
          )}
          <div className="flex justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
            <button type="button" onClick={() => setModalOpen(false)} className="rounded-xl px-4 py-2 text-xs font-semibold">
              Cancel
            </button>
            <button type="submit" disabled={saving || !selectedClassId} className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm disabled:opacity-60">
              {saving ? 'Adding...' : 'Add Class'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={Boolean(sectionModal)}
        onClose={() => setSectionModal(null)}
        title={`Add Section (${sectionModal?.className || ''})`}
      >
        <form onSubmit={handleCreateSection} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-bold text-slate-500">Section Name *</label>
            <select
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm dark:border-slate-800 dark:bg-slate-950"
              value={sectionForm.name}
              onChange={(e) => setSectionForm({ ...sectionForm, name: e.target.value })}
              required
            >
              <option value="" disabled>Select Section</option>
              {['Section A', 'Section B', 'Section C', 'Section D', 'Section E', 'Section F'].map((sec) => (
                <option key={sec} value={sec}>
                  {sec}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-500">Capacity</label>
              <input
                type="number"
                min="1"
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm dark:border-slate-800 dark:bg-slate-950"
                value={sectionForm.capacity}
                onChange={(e) => setSectionForm({ ...sectionForm, capacity: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-500">Room Number</label>
              <input
                type="text"
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm dark:border-slate-800 dark:bg-slate-950"
                value={sectionForm.roomNumber}
                onChange={(e) => setSectionForm({ ...sectionForm, roomNumber: e.target.value })}
                placeholder="e.g. 204"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold text-slate-500">Class Teacher (Optional)</label>
            <select
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm dark:border-slate-800 dark:bg-slate-950"
              value={sectionForm.classTeacherId}
              onChange={(e) => setSectionForm({ ...sectionForm, classTeacherId: e.target.value })}
            >
              <option value="">Unassigned</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.department})
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setSectionModal(null)}
              className="rounded-xl px-4 py-2 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm disabled:opacity-60"
            >
              {saving ? 'Creating...' : 'Create Section'}
            </button>
          </div>
        </form>
      </Modal>

      <ToastComponent />
    </div>
  );
};

function ClassSections({ yearId, classId, onChanged, onDeleteSection }) {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    academicPortalApi
      .sections({ academicYearId: yearId, classId })
      .then((result) => {
        if (!cancelled) setSections(result.data || []);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [yearId, classId, onChanged]);

  if (loading) return <p className="mt-4 text-xs text-slate-400">Loading sections...</p>;
  if (!sections.length) return <p className="mt-4 text-xs text-slate-400">No sections yet.</p>;

  return (
    <div className="mt-4 overflow-x-auto">
      <table className="min-w-[700px] w-full text-left text-xs">
        <thead>
          <tr className="border-b border-slate-100 text-slate-500 dark:border-slate-800">
            {['Section', 'Class Teacher', 'Room', 'Capacity', 'Students', 'Subjects', 'Status', 'Actions'].map((h) => (
              <th key={h} className="px-2 py-2 font-bold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sections.map((section) => (
            <tr key={section.id} className="border-b border-slate-50 dark:border-slate-850">
              <td className="px-2 py-2 font-bold">{section.name}</td>
              <td className="px-2 py-2">{section.classTeacher?.name || '—'}</td>
              <td className="px-2 py-2">{section.roomNumber || '—'}</td>
              <td className="px-2 py-2">{section.capacity}</td>
              <td className="px-2 py-2">{section.counts?.students ?? 0}</td>
              <td className="px-2 py-2">{section.counts?.subjects ?? 0}</td>
              <td className="px-2 py-2">{section.status}</td>
              <td className="px-2 py-2">
                <div className="flex items-center gap-3">
                  <Link
                    to={`/school-admin/academics/years/${yearId}/sections/${section.id}`}
                    className="font-bold text-primary hover:underline"
                  >
                    Open
                  </Link>
                  <button
                    type="button"
                    onClick={() => onDeleteSection && onDeleteSection(section)}
                    className="text-rose-500 hover:text-rose-700 transition-colors p-0.5 rounded"
                    title="Delete section"
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
  );
}

export default AcademicYearDetail;
