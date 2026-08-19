import { Router } from 'express';
import {
  getServiceInfo,
  healthCheck,
  notFound,
} from '../controllers/platform.controller.js';
import {
  getLegalDocuments,
  updateLegalDocuments,
} from '../controllers/legal.controller.js';
import {
  createSchoolTicket,
  createTicket,
  getSchoolTicket,
  getTicket,
  listSchoolTickets,
  listTickets,
  replySchoolTicket,
  replyTicket,
  updateTicketStatus,
} from '../controllers/support.controller.js';
import {
  createSchool,
  deleteSchool,
  listSchools,
  resetSchoolLogin,
  schoolAdminForgotPassword,
  schoolAdminLogin,
  schoolAdminResetPassword,
  schoolBranding,
  schoolPortalChangePassword,
  schoolPortalConfig,
  schoolPortalMe,
  schoolPortalPlans,
  schoolPortalSettings,
  schoolPortalUpdateBranding,
  schoolPortalUpdateConfig,
  schoolPortalUpdateEmail,
  schoolPortalUpdateTheme,
  schoolSelectPlan,
  updateSchool,
  updateSchoolStatus,
} from '../controllers/school.controller.js';
import {
  createPlan,
  deletePlan,
  listPlans,
  updatePlan,
} from '../controllers/subscription.controller.js';
import {
  inboxNotifications,
  listNotifications,
  listSchoolNotifications,
  registerDevice,
  sendNotification,
  sendSchoolNotification,
} from '../controllers/notification.controller.js';
import {
  cancelInvoice,
  createInvoice,
  createRazorpayOrder,
  getInvoice,
  getPaymentGateway,
  listInvoices,
  markInvoicePaid,
  refundInvoice,
  verifyRazorpayPayment,
} from '../controllers/billing.controller.js';
import {
  getReportSummary,
  listInvoiceReports,
  listNotificationReports,
  listSchoolReports,
  listSubscriptionReports,
} from '../controllers/report.controller.js';
import {
  activateAcademicYear,
  addClassToYear,
  addSectionSubject,
  archiveAcademicYear,
  unarchiveAcademicYear,
  completeAcademicYear,
  createAcademicYear,
  createClass,
  createSection,
  createSubject,
  createTeacher,
  deleteAcademicYear,
  deleteClass,
  deleteSection,
  deleteSectionSubject,
  deleteSubject,
  getAcademicYear,
  getClass,
  getSection,
  getTeacher,
  listAcademicYears,
  listClasses,
  listAllSectionSubjects,
  listSectionSubjects,
  createSectionSubjectDirect,
  listSections,
  listSubjects,
  listTeachers,
  listYearClasses,
  removeClassFromYear,
  seedClasses,
  setCurrentAcademicYear,
  updateAcademicYear,
  updateClass,
  updateSection,
  updateSectionSubject,
  updateSubject,
  updateTeacher,
  updateTeacherStatus,
  deleteTeacher,
} from '../controllers/academic.controller.js';
import {
  createStudent,
  deleteStudent,
  getStudent,
  listStudents,
  updateStudent,
  updateStudentStatus,
} from '../controllers/student.controller.js';
import {
  addStructureItem,
  autoAssignStudentFees,
  createFeeHead,
  createFeeStructure,
  deleteFeeHead,
  deleteFeeStructure,
  deleteStructureItem,
  generateFeeInvoice,
  getFeeHead,
  getFeeInvoice,
  getFeePayment,
  getFeeStructure,
  listFeeHeads,
  listFeeInvoices,
  listFeePayments,
  listFeeStructures,
  listStructureItems,
  listStudentAssignments,
  payFeeInvoice,
  seedDefaultFeeHeads,
  updateFeeHead,
  updateFeeStructure,
  updateStructureItem,
  updateStudentAssignment,
} from '../controllers/fee.controller.js';
import {
  changeUserPassword,
  createUser,
  deleteUser,
  getUser,
  listUsers,
  seedUsers,
  sendUserCredentials,
  updateUser,
  updateUserStatus,
} from '../controllers/user.controller.js';
import {
  createPayroll,
  deletePayroll,
  getEligibleEmployees,
  getPayroll,
  listPayrolls,
  releaseAllPayrolls,
  updatePayrollStatus,
} from '../controllers/payroll.controller.js';
import {
  getAttendanceReport,
  getDailyAttendance,
  getMonthlySummary,
  markAllStatus,
  saveDailyAttendance,
  updateSingleStatus,
} from '../controllers/staffAttendance.controller.js';
import { requireSuperAdmin } from '../middleware/requireSuperAdmin.js';
import { requireSchoolAdmin } from '../middleware/requireSchoolAdmin.js';
import { assertSchoolAccess } from '../middleware/assertSchoolAccess.js';
import { uploadStudentFiles, convertStudentImages } from '../middleware/uploadStudentPhoto.js';
import { convertTeacherImages, uploadTeacherFiles } from '../middleware/uploadTeacherPhoto.js';
import { convertSchoolUserImages, uploadSchoolUserFiles } from '../middleware/uploadSchoolUser.js';

const router = Router();

router.get('/health', healthCheck);
router.get('/schools', requireSuperAdmin, listSchools);
router.post('/schools', requireSuperAdmin, createSchool);
router.put('/schools/:id', requireSuperAdmin, updateSchool);
router.patch('/schools/:id/status', requireSuperAdmin, updateSchoolStatus);
router.post('/schools/:id/reset-login', requireSuperAdmin, resetSchoolLogin);
router.delete('/schools/:id', requireSuperAdmin, deleteSchool);
router.get('/school-auth/branding', schoolBranding);
router.post('/school-auth/login', schoolAdminLogin);
router.post('/school-auth/forgot-password', schoolAdminForgotPassword);
router.post('/school-auth/reset-password', schoolAdminResetPassword);
router.get('/school-portal/me', requireSchoolAdmin, schoolPortalMe);
router.get('/school-portal/plans', requireSchoolAdmin, schoolPortalPlans);
router.post('/school-portal/select-plan', requireSchoolAdmin, schoolSelectPlan);
router.get('/school-portal/config', requireSchoolAdmin, schoolPortalConfig);
router.patch('/school-portal/config', requireSchoolAdmin, schoolPortalUpdateConfig);
router.get('/school-portal/settings', requireSchoolAdmin, schoolPortalSettings);
router.patch('/school-portal/settings/theme', requireSchoolAdmin, schoolPortalUpdateTheme);
router.patch('/school-portal/settings/branding', requireSchoolAdmin, schoolPortalUpdateBranding);
router.patch('/school-portal/settings/password', requireSchoolAdmin, schoolPortalChangePassword);
router.patch('/school-portal/settings/email', requireSchoolAdmin, schoolPortalUpdateEmail);
router.get('/school-portal/notifications', requireSchoolAdmin, listSchoolNotifications);
router.post('/school-portal/notifications', requireSchoolAdmin, sendSchoolNotification);
router.get('/school-portal/academic/years', requireSchoolAdmin, listAcademicYears);
router.post('/school-portal/academic/years', requireSchoolAdmin, createAcademicYear);
router.get('/school-portal/academic/years/:id', requireSchoolAdmin, getAcademicYear);
router.patch('/school-portal/academic/years/:id', requireSchoolAdmin, updateAcademicYear);
router.delete('/school-portal/academic/years/:id', requireSchoolAdmin, deleteAcademicYear);
router.post('/school-portal/academic/years/:id/activate', requireSchoolAdmin, activateAcademicYear);
router.post('/school-portal/academic/years/:id/set-current', requireSchoolAdmin, setCurrentAcademicYear);
router.post('/school-portal/academic/years/:id/archive', requireSchoolAdmin, archiveAcademicYear);
router.post('/school-portal/academic/years/:id/unarchive', requireSchoolAdmin, unarchiveAcademicYear);
router.post('/school-portal/academic/years/:id/complete', requireSchoolAdmin, completeAcademicYear);
router.get('/school-portal/academic/years/:yearId/classes', requireSchoolAdmin, listYearClasses);
router.post('/school-portal/academic/years/:yearId/classes', requireSchoolAdmin, addClassToYear);
router.delete('/school-portal/academic/years/:yearId/classes/:classId', requireSchoolAdmin, removeClassFromYear);
router.get('/school-portal/academic/classes', requireSchoolAdmin, listClasses);
router.post('/school-portal/academic/classes', requireSchoolAdmin, createClass);
router.post('/school-portal/academic/classes/seed', requireSchoolAdmin, seedClasses);
router.get('/school-portal/academic/classes/:id', requireSchoolAdmin, getClass);
router.patch('/school-portal/academic/classes/:id', requireSchoolAdmin, updateClass);
router.delete('/school-portal/academic/classes/:id', requireSchoolAdmin, deleteClass);
router.get('/school-portal/academic/sections', requireSchoolAdmin, listSections);
router.post('/school-portal/academic/sections', requireSchoolAdmin, createSection);
router.get('/school-portal/academic/sections/:id', requireSchoolAdmin, getSection);
router.patch('/school-portal/academic/sections/:id', requireSchoolAdmin, updateSection);
router.delete('/school-portal/academic/sections/:id', requireSchoolAdmin, deleteSection);
router.get('/school-portal/academic/subjects', requireSchoolAdmin, listSubjects);
router.post('/school-portal/academic/subjects', requireSchoolAdmin, createSubject);
router.patch('/school-portal/academic/subjects/:id', requireSchoolAdmin, updateSubject);
router.delete('/school-portal/academic/subjects/:id', requireSchoolAdmin, deleteSubject);
router.get('/school-portal/academic/section-subjects', requireSchoolAdmin, listAllSectionSubjects);
router.post('/school-portal/academic/section-subjects', requireSchoolAdmin, createSectionSubjectDirect);
router.get('/school-portal/academic/sections/:sectionId/subjects', requireSchoolAdmin, listSectionSubjects);
router.post('/school-portal/academic/sections/:sectionId/subjects', requireSchoolAdmin, addSectionSubject);
router.patch('/school-portal/academic/section-subjects/:id', requireSchoolAdmin, updateSectionSubject);
router.delete('/school-portal/academic/section-subjects/:id', requireSchoolAdmin, deleteSectionSubject);
router.get('/school-portal/academic/teachers', requireSchoolAdmin, listTeachers);
router.post('/school-portal/academic/teachers', requireSchoolAdmin, uploadTeacherFiles, convertTeacherImages, createTeacher);
router.get('/school-portal/academic/teachers/:id', requireSchoolAdmin, getTeacher);
router.patch('/school-portal/academic/teachers/:id', requireSchoolAdmin, uploadTeacherFiles, convertTeacherImages, updateTeacher);
router.patch('/school-portal/academic/teachers/:id/status', requireSchoolAdmin, updateTeacherStatus);
router.delete('/school-portal/academic/teachers/:id', requireSchoolAdmin, deleteTeacher);
router.get('/school-portal/students', requireSchoolAdmin, listStudents);
router.post('/school-portal/students', requireSchoolAdmin, uploadStudentFiles, convertStudentImages, createStudent);
router.get('/school-portal/students/:id', requireSchoolAdmin, getStudent);
router.patch('/school-portal/students/:id', requireSchoolAdmin, uploadStudentFiles, convertStudentImages, updateStudent);
router.patch('/school-portal/students/:id/status', requireSchoolAdmin, updateStudentStatus);
router.delete('/school-portal/students/:id', requireSchoolAdmin, deleteStudent);

// School User Management Routes (Teachers, Librarians, HR, Accountants, Transport)
router.get('/school-portal/users', requireSchoolAdmin, listUsers);
router.post('/school-portal/users', requireSchoolAdmin, uploadSchoolUserFiles, convertSchoolUserImages, createUser);
router.post('/school-portal/users/seed', requireSchoolAdmin, seedUsers);
router.get('/school-portal/users/:id', requireSchoolAdmin, getUser);
router.patch('/school-portal/users/:id', requireSchoolAdmin, uploadSchoolUserFiles, convertSchoolUserImages, updateUser);
router.patch('/school-portal/users/:id/status', requireSchoolAdmin, updateUserStatus);
router.patch('/school-portal/users/:id/password', requireSchoolAdmin, changeUserPassword);
router.post('/school-portal/users/:id/send-credentials', requireSchoolAdmin, sendUserCredentials);
router.delete('/school-portal/users/:id', requireSchoolAdmin, deleteUser);

// Fee Management Routes
router.get('/school-portal/fees/heads', requireSchoolAdmin, listFeeHeads);
router.post('/school-portal/fees/heads', requireSchoolAdmin, createFeeHead);
router.post('/school-portal/fees/heads/seed', requireSchoolAdmin, seedDefaultFeeHeads);
router.get('/school-portal/fees/heads/:id', requireSchoolAdmin, getFeeHead);
router.patch('/school-portal/fees/heads/:id', requireSchoolAdmin, updateFeeHead);
router.delete('/school-portal/fees/heads/:id', requireSchoolAdmin, deleteFeeHead);

router.get('/school-portal/fees/structures', requireSchoolAdmin, listFeeStructures);
router.post('/school-portal/fees/structures', requireSchoolAdmin, createFeeStructure);
router.get('/school-portal/fees/structures/:id', requireSchoolAdmin, getFeeStructure);
router.patch('/school-portal/fees/structures/:id', requireSchoolAdmin, updateFeeStructure);
router.delete('/school-portal/fees/structures/:id', requireSchoolAdmin, deleteFeeStructure);

router.get('/school-portal/fees/structures/:structureId/items', requireSchoolAdmin, listStructureItems);
router.post('/school-portal/fees/structures/:structureId/items', requireSchoolAdmin, addStructureItem);
router.patch('/school-portal/fees/items/:id', requireSchoolAdmin, updateStructureItem);
router.delete('/school-portal/fees/items/:id', requireSchoolAdmin, deleteStructureItem);

router.get('/school-portal/fees/students/:studentId/assignments', requireSchoolAdmin, listStudentAssignments);
router.post('/school-portal/fees/students/:studentId/auto-assign', requireSchoolAdmin, autoAssignStudentFees);
router.patch('/school-portal/fees/assignments/:id', requireSchoolAdmin, updateStudentAssignment);

router.get('/school-portal/fees/invoices', requireSchoolAdmin, listFeeInvoices);
router.post('/school-portal/fees/invoices/generate', requireSchoolAdmin, generateFeeInvoice);
router.get('/school-portal/fees/invoices/:id', requireSchoolAdmin, getFeeInvoice);
router.post('/school-portal/fees/invoices/:invoiceId/pay', requireSchoolAdmin, payFeeInvoice);

router.get('/school-portal/fees/payments', requireSchoolAdmin, listFeePayments);
router.get('/school-portal/fees/payments/:id', requireSchoolAdmin, getFeePayment);

// Payroll & HR Endpoints
router.get('/school-portal/payroll/employees', requireSchoolAdmin, getEligibleEmployees);
router.get('/school-portal/payroll', requireSchoolAdmin, listPayrolls);
router.post('/school-portal/payroll', requireSchoolAdmin, createPayroll);
router.post('/school-portal/payroll/release', requireSchoolAdmin, releaseAllPayrolls);
router.get('/school-portal/payroll/:id', requireSchoolAdmin, getPayroll);
router.patch('/school-portal/payroll/:id/status', requireSchoolAdmin, updatePayrollStatus);
router.delete('/school-portal/payroll/:id', requireSchoolAdmin, deletePayroll);

// Staff Attendance Endpoints
router.get('/school-portal/attendance/staff', requireSchoolAdmin, getDailyAttendance);
router.get('/school-portal/attendance/staff/report', requireSchoolAdmin, getAttendanceReport);
router.post('/school-portal/attendance/staff', requireSchoolAdmin, saveDailyAttendance);
router.patch('/school-portal/attendance/staff/:employeeRefId', requireSchoolAdmin, updateSingleStatus);
router.post('/school-portal/attendance/staff/mark-all', requireSchoolAdmin, markAllStatus);
router.get('/school-portal/attendance/staff/monthly', requireSchoolAdmin, getMonthlySummary);

router.get('/subscriptions', requireSuperAdmin, listPlans);
router.post('/subscriptions', requireSuperAdmin, createPlan);
router.put('/subscriptions/:id', requireSuperAdmin, updatePlan);
router.delete('/subscriptions/:id', requireSuperAdmin, deletePlan);
router.post('/device-tokens', registerDevice);
router.get('/notifications/inbox', inboxNotifications);
router.get('/notifications', requireSuperAdmin, listNotifications);
router.post('/notifications', requireSuperAdmin, sendNotification);
router.get('/billings', requireSuperAdmin, listInvoices);
router.post('/billings', requireSuperAdmin, createInvoice);
router.get('/billings/gateway', requireSuperAdmin, getPaymentGateway);
router.get('/billings/:id', requireSuperAdmin, getInvoice);
router.post('/billings/:id/razorpay-order', requireSuperAdmin, createRazorpayOrder);
router.post('/billings/:id/razorpay-verify', requireSuperAdmin, verifyRazorpayPayment);
router.patch('/billings/:id/pay', requireSuperAdmin, markInvoicePaid);
router.patch('/billings/:id/refund', requireSuperAdmin, refundInvoice);
router.patch('/billings/:id/cancel', requireSuperAdmin, cancelInvoice);
router.get('/privacy-policy', getLegalDocuments);
router.put('/privacy-policy', requireSuperAdmin, updateLegalDocuments);
router.get('/reports', requireSuperAdmin, getReportSummary);
router.get('/reports/schools', requireSuperAdmin, listSchoolReports);
router.get('/reports/subscriptions', requireSuperAdmin, listSubscriptionReports);
router.get('/reports/invoices', requireSuperAdmin, listInvoiceReports);
router.get('/reports/notifications', requireSuperAdmin, listNotificationReports);
router.get('/support/tickets', requireSuperAdmin, listTickets);
router.post('/support/tickets', requireSuperAdmin, createTicket);
router.get('/support/tickets/:id', requireSuperAdmin, getTicket);
router.post('/support/tickets/:id/replies', requireSuperAdmin, replyTicket);
router.patch('/support/tickets/:id/status', requireSuperAdmin, updateTicketStatus);
router.get('/support/school/:schoolId/tickets', requireSchoolAdmin, assertSchoolAccess, listSchoolTickets);
router.post('/support/school/:schoolId/tickets', requireSchoolAdmin, assertSchoolAccess, createSchoolTicket);
router.get('/support/school/:schoolId/tickets/:id', requireSchoolAdmin, assertSchoolAccess, getSchoolTicket);
router.post('/support/school/:schoolId/tickets/:id/replies', requireSchoolAdmin, assertSchoolAccess, replySchoolTicket);
router.get('/', getServiceInfo);
router.use(notFound);

export default router;
