import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from '../pages/Dashboard';
import { SchoolConfig } from '../pages/school-config/SchoolConfig';
import { RolesAndPermissions } from '../pages/roles/RolesAndPermissions';
import { UserManagement } from '../pages/users/UserManagement';
import { AdmissionManagement } from '../pages/admissions/AdmissionManagement';
import { AcademicManagement } from '../pages/academics/AcademicManagement';
import { AttendanceManagement } from '../pages/attendance/AttendanceManagement';
import { ExamManagement } from '../pages/exams/ExamManagement';
import { FeeManagement } from '../pages/fees/FeeManagement';
import { StudentManagement } from '../pages/students/StudentManagement';
import { TeacherManagement } from '../pages/teachers/TeacherManagement';
import { HomeworkMonitor } from '../pages/homework/HomeworkMonitor';
import { CommunicationHub } from '../pages/communication/CommunicationHub';
import { TransportManagement } from '../pages/transport/TransportManagement';
import { HostelManagement } from '../pages/hostel/HostelManagement';
import { LibraryManagement } from '../pages/library/LibraryManagement';
import { HRAndPayroll } from '../pages/hr/HRAndPayroll';
import { InventoryManagement } from '../pages/inventory/InventoryManagement';
import { EventsManagement } from '../pages/events/EventsManagement';
import { ReportsHub } from '../pages/reports/ReportsHub';
import { AuditLogs } from '../pages/audit/AuditLogs';
import { Settings } from '../pages/settings/Settings';

export const SchoolAdminRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="school-config" element={<SchoolConfig />} />
      <Route path="roles" element={<RolesAndPermissions />} />
      <Route path="users" element={<UserManagement />} />
      <Route path="admissions" element={<AdmissionManagement />} />
      <Route path="academics" element={<AcademicManagement />} />
      <Route path="attendance" element={<AttendanceManagement />} />
      <Route path="exams" element={<ExamManagement />} />
      <Route path="fees" element={<FeeManagement />} />
      <Route path="students" element={<StudentManagement />} />
      <Route path="teachers" element={<TeacherManagement />} />
      <Route path="homework" element={<HomeworkMonitor />} />
      <Route path="communication" element={<CommunicationHub />} />
      <Route path="transport" element={<TransportManagement />} />
      <Route path="hostel" element={<HostelManagement />} />
      <Route path="library" element={<LibraryManagement />} />
      <Route path="hr" element={<HRAndPayroll />} />
      <Route path="inventory" element={<InventoryManagement />} />
      <Route path="events" element={<EventsManagement />} />
      <Route path="reports" element={<ReportsHub />} />
      <Route path="audit" element={<AuditLogs />} />
      <Route path="settings" element={<Settings />} />
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  );
};
export default SchoolAdminRoutes;
