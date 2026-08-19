import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useToast } from '../../components/ui/Toast';
import { academicPortalApi } from '../../../../shared/api/client';
import { EmptyState } from './components/AcademicUi';
import { apiMessage, ENTITY_STATUS_VARIANT } from './utils';
import {
  BookOpen,
  Plus,
  Trash2,
  Loader2,
  Search,
  RotateCcw,
  Pencil,
  Download,
  Filter,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  Layers,
  Users,
  UserCheck,
  UserX,
  Sparkles
} from 'lucide-react';

const inputClass =
  'h-10 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 text-xs outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white';

const selectClass =
  'h-10 w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3 text-xs outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white';

function downloadFile(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function exportAssignmentsCSV(assignments) {
  const rows = [
    'Academic Year,Class,Section,Subject Code,Subject Name,Subject Type,Assigned Teacher,Teacher Department,Teacher Email,Status',
    ...assignments.map((a) =>
      [
        `"${a.academicYear?.name || ''}"`,
        `"${a.class?.name || ''}"`,
        `"${a.section?.name || ''}"`,
        `"${a.subject?.code || ''}"`,
        `"${a.subject?.name || ''}"`,
        `"${a.subject?.subjectType || 'THEORY'}"`,
        `"${a.teacher?.name || 'Vacant / Unassigned'}"`,
        `"${a.teacher?.department || ''}"`,
        `"${a.teacher?.email || ''}"`,
        `"${a.status || 'ACTIVE'}"`,
      ].join(',')
    ),
  ];
  downloadFile(rows.join('\n'), 'subject_assignments.csv', 'text/csv');
}

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

  // All Assignments data from API
  const [assignments, setAssignments] = useState([]);

  // Filters
  const [search, setSearch] = useState('');
  const [yearFilter, setYearFilter] = useState('ALL');
  const [classFilter, setClassFilter] = useState('ALL');
  const [sectionFilter, setSectionFilter] = useState('ALL');
  const [teacherFilter, setTeacherFilter] = useState('ALL'); // 'ALL' | 'ASSIGNED' | 'VACANT' | teacherId
  const [subjectFilter, setSubjectFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Form for Assign Subject Modal
  const [assignForm, setAssignForm] = useState({
    academicYearId: '',
    classId: '',
    sectionId: '',
    subjectId: '',
    teacherId: '',
    maxMarks: 100,
    passingMarks: 33,
    isOptional: false,
    status: 'ACTIVE',
  });

  // Form for Edit Modal
  const [editForm, setEditForm] = useState({
    teacherId: '',
    maxMarks: 100,
    passingMarks: 33,
    isOptional: false,
    status: 'ACTIVE',
  });

  // Load all reference data and all assignments
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [yearRes, classRes, sectionRes, subjectRes, teacherRes, assignRes] = await Promise.all([
        academicPortalApi.years({ limit: 100 }),
        academicPortalApi.classes({ limit: 100 }),
        academicPortalApi.sections({ limit: 1000 }),
        academicPortalApi.subjects({ limit: 1000 }),
        academicPortalApi.teachers({ limit: 1000 }),
        academicPortalApi.allSectionSubjects(),
      ]);

      const yearsData = yearRes.data || [];
      const classesData = (classRes.data || []).filter((c) => c.status === 'ACTIVE');
      const sectionsData = (sectionRes.data || []).filter((s) => s.status === 'ACTIVE');
      const subjectsData = (subjectRes.data || []).filter((s) => s.status === 'ACTIVE');
      const teachersData = (teacherRes.data || []).filter((t) => t.status === 'ACTIVE');

      setYears(yearsData);
      setClasses(classesData);
      setSections(sectionsData);
      setSubjects(subjectsData);
      setTeachers(teachersData);
      setAssignments(assignRes.data || []);

      const activeYear = yearsData.find((y) => y.isCurrent || y.status === 'ACTIVE');
      if (activeYear && !assignForm.academicYearId) {
        setAssignForm((prev) => ({ ...prev, academicYearId: activeYear.id }));
      }
    } catch (error) {
      showToast(apiMessage(error, 'Failed to load subject assignments'), 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Reload assignments list after updates
  const refreshAssignments = useCallback(async () => {
    try {
      const res = await academicPortalApi.allSectionSubjects();
      setAssignments(res.data || []);
    } catch (error) {
      showToast(apiMessage(error, 'Failed to refresh subject assignments'), 'error');
    }
  }, [showToast]);

  // Fast lookups
  const subjectMap = useMemo(() => new Map(subjects.map((s) => [s.id, s])), [subjects]);
  const teacherMap = useMemo(() => new Map(teachers.map((t) => [t.id, t])), [teachers]);
  const classMap = useMemo(() => new Map(classes.map((c) => [c.id, c])), [classes]);
  const sectionMap = useMemo(() => new Map(sections.map((s) => [s.id, s])), [sections]);
  const yearMap = useMemo(() => new Map(years.map((y) => [y.id, y])), [years]);

  // Dynamic sections available for filtering based on class filter
  const filteredSectionsForFilter = useMemo(() => {
    return sections.filter((s) => {
      if (yearFilter !== 'ALL' && s.academicYearId !== yearFilter) return false;
      if (classFilter !== 'ALL' && s.classId !== classFilter) return false;
      return true;
    });
  }, [sections, yearFilter, classFilter]);

  // Dynamic sections available in Assign Modal
  const modalSections = useMemo(() => {
    if (!assignForm.classId) return [];
    return sections.filter((s) => {
      if (assignForm.academicYearId && s.academicYearId !== assignForm.academicYearId) return false;
      return s.classId === assignForm.classId;
    });
  }, [sections, assignForm.classId, assignForm.academicYearId]);

  // Filtered assignments list for display
  const filteredAssignments = useMemo(() => {
    return assignments.filter((item) => {
      // Academic Year filter
      if (yearFilter !== 'ALL' && item.academicYearId !== yearFilter) return false;

      // Class filter
      if (classFilter !== 'ALL' && item.classId !== classFilter) return false;

      // Section filter
      if (sectionFilter !== 'ALL' && item.sectionId !== sectionFilter) return false;

      // Subject filter
      if (subjectFilter !== 'ALL' && item.subjectId !== subjectFilter) return false;

      // Status filter
      if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;

      // Teacher filter
      if (teacherFilter === 'ASSIGNED' && !item.teacherId) return false;
      if (teacherFilter === 'VACANT' && item.teacherId) return false;
      if (teacherFilter !== 'ALL' && teacherFilter !== 'ASSIGNED' && teacherFilter !== 'VACANT' && item.teacherId !== teacherFilter) {
        return false;
      }

      // Search query across Subject name, code, class, section, teacher
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const subName = (item.subject?.name || subjectMap.get(item.subjectId)?.name || '').toLowerCase();
        const subCode = (item.subject?.code || subjectMap.get(item.subjectId)?.code || '').toLowerCase();
        const clsName = (item.class?.name || classMap.get(item.classId)?.name || '').toLowerCase();
        const secName = (item.section?.name || sectionMap.get(item.sectionId)?.name || '').toLowerCase();
        const tName = (item.teacher?.name || teacherMap.get(item.teacherId)?.name || '').toLowerCase();
        const tDept = (item.teacher?.department || teacherMap.get(item.teacherId)?.department || '').toLowerCase();
        const yName = (item.academicYear?.name || yearMap.get(item.academicYearId)?.name || '').toLowerCase();

        const match =
          subName.includes(q) ||
          subCode.includes(q) ||
          clsName.includes(q) ||
          secName.includes(q) ||
          tName.includes(q) ||
          tDept.includes(q) ||
          yName.includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [
    assignments,
    yearFilter,
    classFilter,
    sectionFilter,
    subjectFilter,
    teacherFilter,
    statusFilter,
    search,
    subjectMap,
    classMap,
    sectionMap,
    teacherMap,
    yearMap,
  ]);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = assignments.length;
    const uniqueClasses = new Set(assignments.map((a) => a.classId)).size;
    const uniqueSections = new Set(assignments.map((a) => a.sectionId)).size;
    const assignedCount = assignments.filter((a) => Boolean(a.teacherId)).length;
    const vacantCount = assignments.filter((a) => !a.teacherId).length;

    return {
      total,
      classesCovered: uniqueClasses,
      sectionsCovered: uniqueSections,
      assignedCount,
      vacantCount,
    };
  }, [assignments]);

  // Clear all filters
  const handleResetFilters = () => {
    setSearch('');
    setYearFilter('ALL');
    setClassFilter('ALL');
    setSectionFilter('ALL');
    setTeacherFilter('ALL');
    setSubjectFilter('ALL');
    setStatusFilter('ALL');
  };

  const hasActiveFilters =
    search ||
    yearFilter !== 'ALL' ||
    classFilter !== 'ALL' ||
    sectionFilter !== 'ALL' ||
    teacherFilter !== 'ALL' ||
    subjectFilter !== 'ALL' ||
    statusFilter !== 'ALL';

  // Inline Teacher Assignment change
  const handleInlineTeacherChange = async (assignmentId, teacherId) => {
    setBusy(true);
    try {
      await academicPortalApi.updateSectionSubject(assignmentId, {
        teacherId: teacherId || null,
      });
      showToast('Assigned teacher updated successfully', 'success');
      await refreshAssignments();
    } catch (error) {
      showToast(apiMessage(error, 'Failed to update teacher assignment'), 'error');
    } finally {
      setBusy(false);
    }
  };

  // Open Assign Modal with default/reset state
  const handleOpenAssignModal = () => {
    const activeYear = years.find((y) => y.isCurrent || y.status === 'ACTIVE');
    const defaultYearId = yearFilter !== 'ALL' ? yearFilter : activeYear ? activeYear.id : years[0]?.id || '';
    const defaultClassId = classFilter !== 'ALL' ? classFilter : classes[0]?.id || '';
    const matchingSections = sections.filter((s) => s.academicYearId === defaultYearId && s.classId === defaultClassId);
    const defaultSectionId = sectionFilter !== 'ALL' ? sectionFilter : matchingSections[0]?.id || '';

    setAssignForm({
      academicYearId: defaultYearId,
      classId: defaultClassId,
      sectionId: defaultSectionId,
      subjectId: '',
      teacherId: '',
      maxMarks: 100,
      passingMarks: 33,
      isOptional: false,
      status: 'ACTIVE',
    });
    setAssignModalOpen(true);
  };

  // Submit Assign Subject
  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    if (!assignForm.sectionId || !assignForm.subjectId) {
      showToast('Please select Class, Section, and Subject', 'warning');
      return;
    }
    setBusy(true);
    try {
      await academicPortalApi.addSectionSubject(assignForm.sectionId, {
        subjectId: assignForm.subjectId,
        teacherId: assignForm.teacherId || null,
        maxMarks: Number(assignForm.maxMarks) || 100,
        passingMarks: Number(assignForm.passingMarks) || 33,
        isOptional: Boolean(assignForm.isOptional),
        status: assignForm.status || 'ACTIVE',
      });
      showToast('Subject successfully assigned to section', 'success');
      setAssignModalOpen(false);
      await refreshAssignments();
    } catch (error) {
      showToast(apiMessage(error, 'Failed to assign subject'), 'error');
    } finally {
      setBusy(false);
    }
  };

  // Open Edit Modal
  const handleOpenEditModal = (assignment) => {
    setEditingAssignment(assignment);
    setEditForm({
      teacherId: assignment.teacherId || '',
      maxMarks: assignment.maxMarks ?? 100,
      passingMarks: assignment.passingMarks ?? 33,
      isOptional: Boolean(assignment.isOptional),
      status: assignment.status || 'ACTIVE',
    });
    setEditModalOpen(true);
  };

  // Save Edit Assignment
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingAssignment) return;
    setBusy(true);
    try {
      await academicPortalApi.updateSectionSubject(editingAssignment.id, {
        teacherId: editForm.teacherId || null,
        maxMarks: Number(editForm.maxMarks) || 100,
        passingMarks: Number(editForm.passingMarks) || 33,
        isOptional: Boolean(editForm.isOptional),
        status: editForm.status || 'ACTIVE',
      });
      showToast('Subject assignment updated successfully', 'success');
      setEditModalOpen(false);
      setEditingAssignment(null);
      await refreshAssignments();
    } catch (error) {
      showToast(apiMessage(error, 'Failed to update assignment'), 'error');
    } finally {
      setBusy(false);
    }
  };

  // Delete Assignment
  const handleDeleteAssignment = async () => {
    if (!deleteTarget) return;
    setBusy(true);
    try {
      await academicPortalApi.deleteSectionSubject(deleteTarget.id);
      showToast('Subject assignment removed successfully', 'success');
      setDeleteTarget(null);
      await refreshAssignments();
    } catch (error) {
      showToast(apiMessage(error, 'Failed to remove subject assignment'), 'error');
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse p-2">
        <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded-xl w-1/3" />
        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-xl w-1/2" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4" />
          ))}
        </div>
        <div className="h-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4" />
        <div className="h-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Subject Assignments"
        subtitle="Manage subject allocations, teachers, and evaluation criteria across all class sections."
        actions={
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => exportAssignmentsCSV(filteredAssignments)}
              disabled={filteredAssignments.length === 0}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 disabled:opacity-50"
              title="Export visible list to CSV"
            >
              <Download className="h-3.5 w-3.5" />
              Export CSV
            </button>
            <button
              onClick={handleOpenAssignModal}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-primary/95 transition-all"
            >
              <Plus className="h-4 w-4" />
              Assign Subject
            </button>
          </div>
        }
      />

      {/* Summary Metric Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex items-center gap-3">
          <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Assignments</p>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white">{stats.total}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex items-center gap-3">
          <div className="rounded-xl bg-indigo-500/10 p-2.5 text-indigo-600 dark:text-indigo-400">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Classes Covered</p>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white">{stats.classesCovered}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex items-center gap-3">
          <div className="rounded-xl bg-sky-500/10 p-2.5 text-sky-600 dark:text-sky-400">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Sections Mapped</p>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white">{stats.sectionsCovered}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex items-center gap-3">
          <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-600 dark:text-emerald-400">
            <UserCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Teachers Assigned</p>
            <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">{stats.assignedCount}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex items-center gap-3">
          <div className={`rounded-xl p-2.5 ${stats.vacantCount > 0 ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'}`}>
            <UserX className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Vacant Slots</p>
            <p className={`text-xl font-extrabold ${stats.vacantCount > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-700 dark:text-slate-300'}`}>
              {stats.vacantCount}
            </p>
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {/* Search Box */}
          <div className="relative sm:col-span-2 lg:col-span-2">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Subject, Code, Class, Section, Teacher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/80 pl-9 pr-3.5 text-xs outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
            />
          </div>

          {/* Academic Year Filter */}
          <div>
            <select
              value={yearFilter}
              onChange={(e) => {
                setYearFilter(e.target.value);
                setSectionFilter('ALL');
              }}
              className={selectClass}
            >
              <option value="ALL">All Academic Years</option>
              {years.map((y) => (
                <option key={y.id} value={y.id}>
                  {y.name} {y.isCurrent ? '(Current)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Class Filter */}
          <div>
            <select
              value={classFilter}
              onChange={(e) => {
                setClassFilter(e.target.value);
                setSectionFilter('ALL');
              }}
              className={selectClass}
            >
              <option value="ALL">All Classes</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Section Filter */}
          <div>
            <select
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
              className={selectClass}
            >
              <option value="ALL">All Sections</option>
              {filteredSectionsForFilter.map((s) => {
                const cls = classMap.get(s.classId);
                return (
                  <option key={s.id} value={s.id}>
                    {cls ? `${cls.name} - ` : ''}{s.name}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Teacher / Allocation Filter */}
          <div>
            <select
              value={teacherFilter}
              onChange={(e) => setTeacherFilter(e.target.value)}
              className={selectClass}
            >
              <option value="ALL">All Teachers</option>
              <option value="ASSIGNED">Assigned Only</option>
              <option value="VACANT">Vacant / Unassigned Only</option>
              <option disabled>──────────</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.department})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Secondary filters row & Reset */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3 dark:border-slate-800/80">
          <div className="flex flex-wrap items-center gap-3">
            {/* Subject Filter */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-500">Subject:</span>
              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="h-8 rounded-lg border border-slate-200 bg-slate-50/80 px-2.5 text-xs outline-none focus:border-primary dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              >
                <option value="ALL">All Subjects</option>
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name} ({sub.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-500">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-8 rounded-lg border border-slate-200 bg-slate-50/80 px-2.5 text-xs outline-none focus:border-primary dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>

            <span className="text-xs text-slate-400">
              Showing <strong className="text-slate-700 dark:text-slate-200">{filteredAssignments.length}</strong> of {assignments.length} assignments
            </span>
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/20"
            >
              <RotateCcw className="h-3 w-3" />
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Details List Table */}
      {filteredAssignments.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <EmptyState
            title="No Subject Assignments Found"
            description={
              hasActiveFilters
                ? 'No subject assignments match your active search and filter criteria. Try resetting the filters.'
                : 'No subjects have been mapped to sections yet. Assign subjects to classes to build your curriculum schedule.'
            }
            action={
              hasActiveFilters ? (
                <button
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Clear All Filters
                </button>
              ) : (
                <button
                  onClick={handleOpenAssignModal}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-primary/95"
                >
                  <Plus className="h-4 w-4" />
                  Assign First Subject
                </button>
              )
            }
          />
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-950/40">
                <tr>
                  <th className="px-5 py-3.5">Class & Section</th>
                  <th className="px-5 py-3.5">Subject Information</th>
                  <th className="px-5 py-3.5">Assigned Teacher</th>
                  <th className="px-5 py-3.5">Academic Year</th>
                  <th className="px-5 py-3.5 text-center">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredAssignments.map((assignment) => {
                  const sub = assignment.subject || subjectMap.get(assignment.subjectId);
                  const cls = assignment.class || classMap.get(assignment.classId);
                  const sec = assignment.section || sectionMap.get(assignment.sectionId);
                  const yr = assignment.academicYear || yearMap.get(assignment.academicYearId);
                  const tch = assignment.teacher || teacherMap.get(assignment.teacherId);

                  return (
                    <tr
                      key={assignment.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors"
                    >
                      {/* Class & Section */}
                      <td className="px-5 py-3.5">
                        <div className="flex flex-col gap-1">
                          <span className="font-bold text-slate-900 dark:text-white">
                            {cls?.name || 'Class'}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                              {sec?.name || 'Section'}
                            </span>
                            {sec?.roomNumber && (
                              <span className="text-[10px] text-slate-400">
                                Room {sec.roomNumber}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Subject Information */}
                      <td className="px-5 py-3.5">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-primary dark:text-primary-light">
                              {sub?.name || '—'}
                            </span>
                            {sub?.code && (
                              <span className="rounded-md border border-primary/20 bg-primary/5 px-1.5 py-0.5 text-[10px] font-extrabold text-primary">
                                {sub.code}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-semibold text-slate-500 uppercase">
                              {sub?.subjectType || 'THEORY'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Assigned Teacher (with Quick Selector) */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <select
                            value={assignment.teacherId || ''}
                            onChange={(e) => handleInlineTeacherChange(assignment.id, e.target.value)}
                            disabled={busy}
                            className="h-8 max-w-[210px] rounded-lg border border-slate-200 bg-slate-50/90 px-2 text-xs font-semibold text-slate-800 outline-none focus:border-primary dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 disabled:opacity-50"
                          >
                            <option value="">Vacant / Not Assigned</option>
                            {teachers.map((t) => (
                              <option key={t.id} value={t.id}>
                                {t.name} ({t.department || 'Faculty'})
                              </option>
                            ))}
                          </select>

                          {!assignment.teacherId && (
                            <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-950/30 dark:text-amber-300">
                              <AlertCircle className="h-3 w-3" />
                              Vacant
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Academic Year */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {yr?.name || '—'}
                          </span>
                          {yr?.isCurrent && (
                            <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[9px] font-extrabold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
                              CURRENT
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5 text-center">
                        <Badge variant={ENTITY_STATUS_VARIANT[assignment.status] || 'default'}>
                          {assignment.status || 'ACTIVE'}
                        </Badge>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(assignment)}
                            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                            title="Edit Assignment"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(assignment)}
                            className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/20"
                            title="Unassign Subject"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
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
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {/* Academic Year */}
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-500">Academic Year *</label>
              <select
                value={assignForm.academicYearId}
                onChange={(e) => {
                  setAssignForm((prev) => ({
                    ...prev,
                    academicYearId: e.target.value,
                    sectionId: '',
                  }));
                }}
                required
                className={selectClass}
              >
                <option value="">Select Academic Year</option>
                {years.map((y) => (
                  <option key={y.id} value={y.id}>
                    {y.name} {y.isCurrent ? '(Current)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Class */}
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-500">Class Standard *</label>
              <select
                value={assignForm.classId}
                onChange={(e) => {
                  setAssignForm((prev) => ({
                    ...prev,
                    classId: e.target.value,
                    sectionId: '',
                  }));
                }}
                required
                className={selectClass}
              >
                <option value="">Select Class</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Section */}
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-500">Section *</label>
              <select
                value={assignForm.sectionId}
                onChange={(e) => setAssignForm((prev) => ({ ...prev, sectionId: e.target.value }))}
                required
                disabled={!assignForm.classId || modalSections.length === 0}
                className={selectClass}
              >
                <option value="">Select Section</option>
                {modalSections.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              {assignForm.classId && modalSections.length === 0 && (
                <p className="mt-1 text-[11px] text-amber-600">No active sections found for this class and year.</p>
              )}
            </div>

            {/* Subject */}
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-500">Subject *</label>
              <select
                value={assignForm.subjectId}
                onChange={(e) => {
                  const sid = e.target.value;
                  const selectedSub = subjectMap.get(sid);
                  setAssignForm((prev) => ({
                    ...prev,
                    subjectId: sid,
                    maxMarks: selectedSub?.maxMarks || 100,
                    passingMarks: selectedSub?.passingMarks || 33,
                  }));
                }}
                required
                className={selectClass}
              >
                <option value="">Select Subject</option>
                {subjects.map((sub) => {
                  const isAssigned = assignments.some(
                    (a) => a.sectionId === assignForm.sectionId && a.subjectId === sub.id
                  );
                  return (
                    <option key={sub.id} value={sub.id} disabled={isAssigned}>
                      {sub.name} ({sub.code || 'N/A'}) {isAssigned ? '— Already Assigned' : ''}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Assigned Teacher */}
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-bold text-slate-500">Subject Teacher (Optional)</label>
              <select
                value={assignForm.teacherId}
                onChange={(e) => setAssignForm((prev) => ({ ...prev, teacherId: e.target.value }))}
                className={selectClass}
              >
                <option value="">Leave Vacant (Assign Later)</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.department || 'Faculty'}) — {t.email || t.employeeId || 'ID'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setAssignModalOpen(false)}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-primary/95 disabled:opacity-60"
            >
              {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Assign Subject
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Subject Assignment Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditingAssignment(null);
        }}
        title="Edit Subject Assignment"
        size="md"
      >
        {editingAssignment && (
          <form onSubmit={handleSaveEdit} className="space-y-4">
            {/* Read-only Context Box */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-950">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400">Class & Section:</span>
                  <p className="font-bold text-slate-800 dark:text-slate-200">
                    {editingAssignment.class?.name || classMap.get(editingAssignment.classId)?.name} —{' '}
                    {editingAssignment.section?.name || sectionMap.get(editingAssignment.sectionId)?.name}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Subject:</span>
                  <p className="font-bold text-primary">
                    {editingAssignment.subject?.name || subjectMap.get(editingAssignment.subjectId)?.name} (
                    {editingAssignment.subject?.code || subjectMap.get(editingAssignment.subjectId)?.code || '—'})
                  </p>
                </div>
              </div>
            </div>

            {/* Teacher Selection */}
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-500">Assigned Teacher</label>
              <select
                value={editForm.teacherId}
                onChange={(e) => setEditForm((prev) => ({ ...prev, teacherId: e.target.value }))}
                className={selectClass}
              >
                <option value="">Leave Vacant (No Teacher)</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.department || 'Faculty'}) — {t.email}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-500">Assignment Status</label>
              <select
                value={editForm.status}
                onChange={(e) => setEditForm((prev) => ({ ...prev, status: e.target.value }))}
                className={selectClass}
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setEditModalOpen(false);
                  setEditingAssignment(null);
                }}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-primary/95 disabled:opacity-60"
              >
                {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Save Changes
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Confirm Unassign / Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteAssignment}
        title="Unassign Subject"
        message={
          deleteTarget
            ? `Are you sure you want to remove ${
                deleteTarget.subject?.name || subjectMap.get(deleteTarget.subjectId)?.name || 'this subject'
              } from ${deleteTarget.class?.name || classMap.get(deleteTarget.classId)?.name || 'Class'} (${
                deleteTarget.section?.name || sectionMap.get(deleteTarget.sectionId)?.name || 'Section'
              })?`
            : 'Are you sure you want to remove this subject mapping?'
        }
        confirmText="Remove Subject"
        variant="danger"
      />

      <ToastComponent />
    </div>
  );
};

export default SubjectAssignments;
