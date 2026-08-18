import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { useToast } from '../../components/ui/Toast';
import { academicPortalApi } from '../../../../shared/api/client';
import { apiMessage } from './utils';
import {
  UserCheck,
  User,
  Loader2,
  ChevronRight,
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const selectClass =
  'h-11 w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 dark:border-slate-800 dark:bg-slate-950';

export const ClassTeachers = () => {
  const { showToast, ToastComponent } = useToast();
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  // Reference data
  const [years, setYears] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [teachers, setTeachers] = useState([]);

  // Selections
  const [selectedYear, setSelectedYear] = useState('');

  const loadReferenceData = useCallback(async () => {
    setLoading(true);
    try {
      const [yearRes, classRes, sectionRes, teacherRes] = await Promise.all([
        academicPortalApi.years({ limit: 100 }),
        academicPortalApi.classes({ limit: 100 }),
        academicPortalApi.sections({ limit: 1000 }),
        academicPortalApi.teachers({ limit: 1000 }),
      ]);

      setYears(yearRes.data || []);
      setClasses((classRes.data || []).filter((c) => c.status === 'ACTIVE'));
      setSections((sectionRes.data || []).filter((s) => s.status === 'ACTIVE'));
      setTeachers((teacherRes.data || []).filter((t) => t.status === 'ACTIVE'));

      const activeYear = yearRes.data?.find((y) => y.isCurrent || y.status === 'ACTIVE');
      if (activeYear) setSelectedYear(activeYear.id);
    } catch (error) {
      showToast(apiMessage(error, 'Failed to load mentorship configuration data'), 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadReferenceData();
  }, [loadReferenceData]);

  const loadSections = useCallback(async () => {
    setBusy(true);
    try {
      const res = await academicPortalApi.sections({ limit: 1000 });
      setSections((res.data || []).filter((s) => s.status === 'ACTIVE'));
    } catch (error) {
      showToast(apiMessage(error, 'Failed to refresh sections data'), 'error');
    } finally {
      setBusy(false);
    }
  }, [showToast]);

  const handleClassTeacherChange = async (sectionId, teacherId) => {
    setBusy(true);
    try {
      await academicPortalApi.updateSection(sectionId, {
        classTeacherId: teacherId || null,
      });
      showToast('Class teacher assigned successfully', 'success');
      loadSections();
    } catch (error) {
      showToast(apiMessage(error, 'Failed to assign class teacher'), 'error');
      setBusy(false);
    }
  };

  const classMap = useMemo(() => {
    return new Map(classes.map((c) => [c.id, c]));
  }, [classes]);

  const teacherMap = useMemo(() => {
    return new Map(teachers.map((t) => [t.id, t]));
  }, [teachers]);

  // Filter sections by selected academic year
  const activeSections = useMemo(() => {
    if (!selectedYear) return [];
    return sections.filter((s) => s.academicYearId === selectedYear);
  }, [selectedYear, sections]);

  // Group sections by Class for display
  const groupedSectionsByClass = useMemo(() => {
    const map = {};
    activeSections.forEach((s) => {
      if (!map[s.classId]) map[s.classId] = [];
      map[s.classId].push(s);
    });
    return map;
  }, [activeSections]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded-xl w-1/3" />
        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-xl w-1/2" />
        <div className="h-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 max-w-xs">
          <div className="h-9 bg-slate-100 dark:bg-slate-800 rounded-xl w-full" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="h-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-4">
            <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded w-1/2" />
            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-3/4" />
            <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded-xl w-full" />
          </div>
          <div className="h-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-4">
            <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded w-1/2" />
            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-3/4" />
            <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded-xl w-full" />
          </div>
          <div className="h-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-4">
            <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded w-1/2" />
            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-3/4" />
            <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded-xl w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Class Teachers"
        subtitle="Assign main class teachers / class mentors to standards."
      />

      {/* Filter panel */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="max-w-xs">
          <label className="mb-1 block text-xs font-bold text-slate-500">Academic Year *</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className={selectClass}
          >
            <option value="">Select Year</option>
            {years.map((y) => (
              <option key={y.id} value={y.id}>
                {y.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedYear ? (
        activeSections.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 py-16 text-center dark:border-slate-800">
            <UserCheck className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-700" />
            <h3 className="mt-4 text-sm font-bold text-slate-700 dark:text-slate-300">No Sections Found</h3>
            <p className="mt-1 text-xs text-slate-500">Please setup academic classes and sections first.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {classes
              .filter((c) => groupedSectionsByClass[c.id]?.length > 0)
              .map((classObj) => {
                const classSections = groupedSectionsByClass[classObj.id] || [];
                return (
                  <div key={classObj.id} className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                      {classObj.name} Standard
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {classSections.map((sec) => {
                        const assignedTeacher = sec.classTeacherId ? teacherMap.get(sec.classTeacherId) : null;
                        return (
                          <div
                            key={sec.id}
                            className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                          >
                            <div>
                              <div className="flex items-center justify-between">
                                <h4 className="text-lg font-extrabold text-slate-900 dark:text-white">
                                  {classObj.name} - {sec.name}
                                </h4>
                                {assignedTeacher ? (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:bg-emerald-950/30">
                                    <CheckCircle2 className="h-3 w-3" /> Assigned
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:bg-amber-950/30">
                                    <AlertCircle className="h-3 w-3" /> Vacant
                                  </span>
                                )}
                              </div>

                              <div className="mt-4 space-y-1 text-xs text-slate-500">
                                <p>Room Number: <span className="font-bold text-slate-700 dark:text-slate-300">{sec.roomNumber || '—'}</span></p>
                                <p>Capacity Limit: <span className="font-bold text-slate-700 dark:text-slate-300">{sec.capacity || '—'} Students</span></p>
                              </div>
                            </div>

                            <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800">
                              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                Class Teacher Mentor
                              </label>
                              <select
                                value={sec.classTeacherId || ''}
                                onChange={(e) => handleClassTeacherChange(sec.id, e.target.value)}
                                disabled={busy}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold outline-none focus:border-primary dark:border-slate-800 dark:bg-slate-950"
                              >
                                <option value="">No Class Teacher (Vacant)</option>
                                {teachers.map((t) => {
                                  const otherSec = activeSections.find(
                                    (s) => s.id !== sec.id && s.classTeacherId === t.id
                                  );
                                  const isAssignedElsewhere = Boolean(otherSec);
                                  const clsName = otherSec ? (classMap.get(otherSec.classId)?.name || 'another class') : '';
                                  const assignmentInfo = otherSec
                                    ? ` (Assigned to ${clsName} - ${otherSec.name})`
                                    : '';

                                  return (
                                    <option
                                      key={t.id}
                                      value={t.id}
                                      disabled={isAssignedElsewhere}
                                    >
                                      {t.name} ({t.department}){assignmentInfo}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
          </div>
        )
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center dark:border-slate-800 dark:bg-slate-900">
          <Info className="mx-auto h-8 w-8 text-slate-400 dark:text-slate-600" />
          <h3 className="mt-4 text-sm font-bold text-slate-800 dark:text-slate-200">Select Academic Year</h3>
          <p className="mt-1 text-xs text-slate-500">Please choose an Academic Year above to assign mentorship roles.</p>
        </div>
      )}

      <ToastComponent />
    </div>
  );
};

export default ClassTeachers;
