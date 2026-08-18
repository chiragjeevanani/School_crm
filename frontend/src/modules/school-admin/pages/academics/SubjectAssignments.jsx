import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useToast } from '../../components/ui/Toast';
import { academicPortalApi } from '../../../../shared/api/client';
import { apiMessage } from './utils';
import {
  BookOpen,
  Plus,
  Trash2,
  Loader2,
  Info
} from 'lucide-react';

const selectClass =
  'h-10 rounded-xl border border-slate-200 bg-slate-50/80 px-3 text-xs outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 dark:border-slate-800 dark:bg-slate-950';

export const SubjectAssignments = () => {
  const { showToast, ToastComponent } = useToast();
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  
  // Reference data
  const [years, setYears] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);

  // Selections
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');

  // Assignments data
  const [assignments, setAssignments] = useState([]);

  // Modals
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Modal form
  const [assignForm, setAssignForm] = useState({
    subjectId: '',
    teacherId: '',
  });

  const loadReferenceData = useCallback(async () => {
    setLoading(true);
    try {
      const [yearRes, classRes, sectionRes, subjectRes, teacherRes] = await Promise.all([
        academicPortalApi.years({ limit: 100 }),
        academicPortalApi.classes({ limit: 100 }),
        academicPortalApi.sections({ limit: 1000 }),
        academicPortalApi.subjects({ limit: 1000 }),
        academicPortalApi.teachers({ limit: 1000 }),
      ]);

      setYears(yearRes.data || []);
      setClasses((classRes.data || []).filter((c) => c.status === 'ACTIVE'));
      setSections((sectionRes.data || []).filter((s) => s.status === 'ACTIVE'));
      setSubjects((subjectRes.data || []).filter((s) => s.status === 'ACTIVE'));
      setTeachers((teacherRes.data || []).filter((t) => t.status === 'ACTIVE'));

      const activeYear = yearRes.data?.find((y) => y.isCurrent || y.status === 'ACTIVE');
      if (activeYear) setSelectedYear(activeYear.id);
    } catch (error) {
      showToast(apiMessage(error, 'Failed to load configuration data'), 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadReferenceData();
  }, [loadReferenceData]);

  // Filter sections and assignments
  const filteredSections = useMemo(() => {
    if (!selectedYear || !selectedClass) return [];
    return sections.filter(
      (s) => s.academicYearId === selectedYear && s.classId === selectedClass
    );
  }, [selectedYear, selectedClass, sections]);

  const loadAssignments = useCallback(async () => {
    if (!selectedSection) {
      setAssignments([]);
      return;
    }
    setBusy(true);
    try {
      const res = await academicPortalApi.sectionSubjects(selectedSection);
      setAssignments(res.data || []);
    } catch (error) {
      showToast(apiMessage(error, 'Failed to load assignments'), 'error');
    } finally {
      setBusy(false);
    }
  }, [selectedSection, showToast]);

  useEffect(() => {
    loadAssignments();
  }, [loadAssignments]);

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    if (!selectedSection) return;
    setBusy(true);
    try {
      await academicPortalApi.addSectionSubject(selectedSection, {
        subjectId: assignForm.subjectId,
        teacherId: assignForm.teacherId || null,
        maxMarks: 100,
        passingMarks: 33,
        isOptional: false,
      });
      showToast('Subject assigned successfully', 'success');
      setAssignModalOpen(false);
      setAssignForm({
        subjectId: '',
        teacherId: '',
      });
      loadAssignments();
    } catch (error) {
      showToast(apiMessage(error, 'Failed to map subject to section'), 'error');
    } finally {
      setBusy(false);
    }
  };

  const handleTeacherChange = async (assignmentId, teacherId) => {
    setBusy(true);
    try {
      await academicPortalApi.updateSectionSubject(assignmentId, {
        teacherId: teacherId || null,
      });
      showToast('Assigned teacher updated', 'success');
      loadAssignments();
    } catch (error) {
      showToast(apiMessage(error, 'Failed to assign teacher'), 'error');
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteAssignment = async () => {
    if (!deleteTarget) return;
    setBusy(true);
    try {
      await academicPortalApi.deleteSectionSubject(deleteTarget.id);
      showToast('Subject assignment removed', 'success');
      loadAssignments();
    } catch (error) {
      showToast(apiMessage(error, 'Failed to remove subject'), 'error');
    } finally {
      setDeleteTarget(null);
      setBusy(false);
    }
  };

  const subjectMap = useMemo(() => {
    return new Map(subjects.map((s) => [s.id, s]));
  }, [subjects]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded-xl w-1/3" />
        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-xl w-1/2" />
        <div className="h-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 flex gap-4">
          <div className="h-9 bg-slate-100 dark:bg-slate-800 rounded-xl w-1/4" />
          <div className="h-9 bg-slate-100 dark:bg-slate-800 rounded-xl w-1/4" />
          <div className="h-9 bg-slate-100 dark:bg-slate-800 rounded-xl w-1/4" />
        </div>
        <div className="h-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6">
          <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded-xl w-full mb-4" />
          <div className="space-y-4">
            <div className="h-7 bg-slate-100 dark:bg-slate-800/60 rounded-lg w-full" />
            <div className="h-7 bg-slate-100 dark:bg-slate-800/60 rounded-lg w-full" />
            <div className="h-7 bg-slate-100 dark:bg-slate-800/60 rounded-lg w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subject Assignments"
        subtitle="Assign teachers to subjects for class sections."
        actions={
          selectedSection && (
            <button
              onClick={() => setAssignModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white hover:bg-primary/95 shadow-sm"
            >
              <Plus className="h-3.5 w-3.5" /> Assign Subject
            </button>
          )
        }
      />

      {/* Filter panel */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="grid gap-4 sm:grid-cols-3 max-w-2xl">
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-500 dark:text-slate-400">Academic Year</label>
            <select
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value);
                setSelectedClass('');
                setSelectedSection('');
              }}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
            >
              <option value="">Select Year</option>
              {years.map((y) => (
                <option key={y.id} value={y.id}>
                  {y.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-500 dark:text-slate-400">Class Standard</label>
            <select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setSelectedSection('');
              }}
              disabled={!selectedYear}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white disabled:opacity-60"
            >
              <option value="">Select Class</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-500 dark:text-slate-400">Section</label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              disabled={!selectedClass || filteredSections.length === 0}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white disabled:opacity-60"
            >
              <option value="">Select Section</option>
              {filteredSections.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {selectedSection ? (
        busy && assignments.length === 0 ? (
          <div className="flex py-12 justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : assignments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 py-16 text-center dark:border-slate-800">
            <BookOpen className="mx-auto h-8 w-8 text-slate-300 dark:text-slate-700" />
            <h3 className="mt-4 text-xs font-bold text-slate-700 dark:text-slate-300">No Subjects Assigned</h3>
            <p className="mt-1 text-[11px] text-slate-500">Map subjects and assign teachers to this section.</p>
            <button
              onClick={() => setAssignModalOpen(true)}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-bold text-white shadow-sm"
            >
              <Plus className="h-3.5 w-3.5" /> Assign Subject
            </button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <table className="w-full border-collapse text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="border-b border-slate-200 bg-slate-50/80 text-xs font-bold text-slate-500 dark:border-slate-800 dark:bg-slate-950/40">
                <tr>
                  <th className="px-6 py-4">Subject Code</th>
                  <th className="px-6 py-4">Subject Name</th>
                  <th className="px-6 py-4">Assigned Teacher</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {assignments.map((assignment) => {
                  const subObj = subjectMap.get(assignment.subjectId);
                  return (
                    <tr key={assignment.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/10">
                      <td className="px-6 py-3.5 font-bold text-primary">{subObj?.code || '—'}</td>
                      <td className="px-6 py-3.5 font-semibold text-slate-950 dark:text-white">{subObj?.name || '—'}</td>
                      <td className="px-6 py-3.5">
                        <select
                          value={assignment.teacherId || ''}
                          onChange={(e) => handleTeacherChange(assignment.id, e.target.value)}
                          className="h-9 w-64 rounded-xl border border-slate-200 bg-slate-50 px-2.5 text-xs font-semibold outline-none focus:border-primary dark:border-slate-800 dark:bg-slate-950"
                        >
                          <option value="">Not Assigned (Vacant)</option>
                          {teachers.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.name} ({t.department})
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(assignment)}
                          className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                          aria-label="Remove subject mapping"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center dark:border-slate-800 dark:bg-slate-900">
          <Info className="mx-auto h-8 w-8 text-slate-400 dark:text-slate-600" />
          <h3 className="mt-4 text-xs font-bold text-slate-800 dark:text-slate-200">Select Section</h3>
          <p className="mt-1 text-[11px] text-slate-500">Please choose Academic Year, Class, and Section above to manage subject-teacher mapping.</p>
        </div>
      )}

      {/* Assign Subject Modal */}
      <Modal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        title="Assign Subject to Section"
        size="md"
      >
        <form onSubmit={handleCreateAssignment} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-bold text-slate-500">Subject *</label>
            <select
              value={assignForm.subjectId}
              onChange={(e) => setAssignForm((prev) => ({ ...prev, subjectId: e.target.value }))}
              required
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 dark:border-slate-800 dark:bg-slate-950"
            >
              <option value="">Select Subject</option>
              {subjects
                .filter((sub) => !assignments.some((a) => a.subjectId === sub.id))
                .map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name} ({sub.code})
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-slate-500">Teacher (Optional)</label>
            <select
              value={assignForm.teacherId}
              onChange={(e) => setAssignForm((prev) => ({ ...prev, teacherId: e.target.value }))}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 dark:border-slate-800 dark:bg-slate-950"
            >
              <option value="">Leave Vacant</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.department})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setAssignModalOpen(false)}
              className="rounded-xl px-4 py-2 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white disabled:opacity-60"
            >
              Map Subject
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteAssignment}
        title="Unassign Subject"
        message={`Are you sure you want to remove this subject mapping? This will delete the subject from the selected section.`}
        confirmText="Remove Subject"
        variant="danger"
      />

      <ToastComponent />
    </div>
  );
};

export default SubjectAssignments;
