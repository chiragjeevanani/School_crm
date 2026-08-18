import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from '../pages/Dashboard';
import { SchoolConfig } from '../pages/school-config/SchoolConfig';
import { RolesAndPermissions } from '../pages/roles/RolesAndPermissions';
import { UserManagement } from '../pages/users/UserManagement';
import { AdmissionManagement } from '../pages/admissions/AdmissionManagement';
import { AcademicManagement } from '../pages/academics/AcademicManagement';
import AcademicIndex from '../pages/academics/AcademicIndex';
import AcademicYearsIndex from '../pages/academics/AcademicYearsIndex';
import AcademicYearDetail from '../pages/academics/AcademicYearDetail';
import ClassesIndex from '../pages/academics/ClassesIndex';
import SubjectsIndex from '../pages/academics/SubjectsIndex';
import SectionDetail from '../pages/academics/SectionDetail';
import { SubjectAssignments } from '../pages/academics/SubjectAssignments';
import { ClassTeachers } from '../pages/academics/ClassTeachers';
import { AttendanceManagement } from '../pages/attendance/AttendanceManagement';
import { ExamManagement } from '../pages/exams/ExamManagement';
import { FeeManagement } from '../pages/fees/FeeManagement';
import { StudentManagement } from '../pages/students/StudentManagement';
import StudentDetail from '../pages/students/StudentDetail';
import { TeacherManagement } from '../pages/teachers/TeacherManagement';
import TeacherDetail from '../pages/teachers/TeacherDetail';
import { HomeworkMonitor } from '../pages/homework/HomeworkMonitor';
import { CommunicationHub } from '../pages/communication/CommunicationHub';
import NotificationsIndex from '../pages/notifications/NotificationsIndex';
import { TransportManagement } from '../pages/transport/TransportManagement';
import { HostelManagement } from '../pages/hostel/HostelManagement';
import { LibraryManagement } from '../pages/library/LibraryManagement';
import { HRAndPayroll } from '../pages/hr/HRAndPayroll';
import { InventoryManagement } from '../pages/inventory/InventoryManagement';
import { EventsManagement } from '../pages/events/EventsManagement';
import { ReportsHub } from '../pages/reports/ReportsHub';
import { AuditLogs } from '../pages/audit/AuditLogs';
import { Support } from '../pages/support/Support';
import { Settings } from '../pages/settings/Settings';
import SubscriptionPlans from '../pages/plans/SubscriptionPlans';

export const SchoolAdminRoutes = () => {
  return (
    <Routes>
      <Route path="plans" element={<SubscriptionPlans />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="school-config" element={<SchoolConfig />} />
      <Route path="roles" element={<RolesAndPermissions />} />
      <Route path="users" element={<UserManagement />} />
      <Route path="admissions" element={<AdmissionManagement />} />
      <Route path="academics" element={<AcademicIndex />} />
      <Route path="academics/years" element={<AcademicYearsIndex />} />
      <Route path="academics/years/:yearId" element={<AcademicYearDetail />} />
      <Route path="academics/years/:yearId/sections/:sectionId" element={<SectionDetail />} />
      <Route path="academics/classes" element={<ClassesIndex />} />
      <Route path="academics/subjects" element={<SubjectsIndex />} />
      <Route path="academics/subject-assignments" element={<SubjectAssignments />} />
      <Route path="academics/class-teachers" element={<ClassTeachers />} />
      <Route path="academics/legacy" element={<AcademicManagement />} />
      <Route path="attendance" element={<AttendanceManagement />} />
      <Route path="exams" element={<ExamManagement />} />
      <Route path="fees" element={<FeeManagement />} />
      <Route path="students" element={<StudentManagement />} />
      <Route path="students/:studentId" element={<StudentDetail />} />
      <Route path="teachers" element={<TeacherManagement />} />
      <Route path="teachers/:teacherId" element={<TeacherDetail />} />
      <Route path="homework" element={<HomeworkMonitor />} />
      <Route path="communication" element={<CommunicationHub />} />
      <Route path="notifications" element={<NotificationsIndex />} />
      <Route path="transport" element={<TransportManagement />} />
      <Route path="hostel" element={<HostelManagement />} />
      <Route path="library" element={<LibraryManagement />} />
      <Route path="hr" element={<HRAndPayroll />} />
      <Route path="inventory" element={<InventoryManagement />} />
      <Route path="events" element={<EventsManagement />} />
      <Route path="reports" element={<ReportsHub />} />
      <Route path="audit" element={<AuditLogs />} />
      <Route path="support" element={<Support />} />
      <Route path="settings" element={<Settings />} />
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  );
};
export default SchoolAdminRoutes;
