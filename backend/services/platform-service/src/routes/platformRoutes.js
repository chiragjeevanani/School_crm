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
  schoolAdminLogin,
  schoolPortalMe,
  schoolPortalPlans,
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
  registerDevice,
  sendNotification,
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
import { requireSuperAdmin } from '../middleware/requireSuperAdmin.js';
import { requireSchoolAdmin } from '../middleware/requireSchoolAdmin.js';

const router = Router();

router.get('/health', healthCheck);
router.get('/schools', requireSuperAdmin, listSchools);
router.post('/schools', requireSuperAdmin, createSchool);
router.put('/schools/:id', requireSuperAdmin, updateSchool);
router.patch('/schools/:id/status', requireSuperAdmin, updateSchoolStatus);
router.post('/schools/:id/reset-login', requireSuperAdmin, resetSchoolLogin);
router.delete('/schools/:id', requireSuperAdmin, deleteSchool);
router.post('/school-auth/login', schoolAdminLogin);
router.get('/school-portal/me', requireSchoolAdmin, schoolPortalMe);
router.get('/school-portal/plans', requireSchoolAdmin, schoolPortalPlans);
router.post('/school-portal/select-plan', requireSchoolAdmin, schoolSelectPlan);
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
router.get('/support/school/:schoolId/tickets', listSchoolTickets);
router.post('/support/school/:schoolId/tickets', createSchoolTicket);
router.get('/support/school/:schoolId/tickets/:id', getSchoolTicket);
router.post('/support/school/:schoolId/tickets/:id/replies', replySchoolTicket);
router.get('/', getServiceInfo);
router.use(notFound);

export default router;
