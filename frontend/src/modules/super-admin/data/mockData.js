// Mock data for the Super Admin Portal

export const mockStats = {
  totalSchools: 124,
  activeSchools: 98,
  inactiveSchools: 12,
  trialSchools: 10,
  expiredSchools: 4,
  totalStudents: 45280,
  totalTeachers: 3820,
  totalEmployees: 1450,
  totalUsers: 50550,
  todayLogins: 12450,
  monthlyRevenue: 34500, // in USD
  annualRevenue: 414000,
  pendingRenewals: 8,
  storageUsed: "4.2 TB",
  storageLimit: "10 TB",
  totalApiRequests: "1.2M",
  activeSessions: 842,
  failedLogins: 42,
  platformHealth: 99.8,
};

export const mockRecentActivities = [
  { id: 1, type: "school_created", user: "Super Admin (Chirag)", school: "St. Xavier's Academy", time: "10 mins ago", ip: "192.168.1.5" },
  { id: 2, type: "plan_changed", user: "Support Staff (Anjali)", school: "Greenwood High", details: "Upgraded to Enterprise Plan", time: "45 mins ago", ip: "192.168.1.12" },
  { id: 3, type: "backup_completed", user: "System", details: "Automated daily backup successful", time: "2 hours ago", ip: "localhost" },
  { id: 4, type: "security_alert", user: "Firewall", details: "Brute force blocked from IP 185.220.101.4", time: "3 hours ago", ip: "185.220.101.4" },
  { id: 5, type: "payment_failed", user: "Stripe", school: "Beaconhouse School", details: "Invoice #INV-2026-089 failed", time: "5 hours ago", ip: "stripe_webhook" },
];

export const mockRecentRegistrations = [
  { id: 1, name: "Oakridge International", admin: "admin@oakridge.edu", plan: "Growth", status: "Trial", date: "Today, 09:30 AM" },
  { id: 2, name: "DPS Public School", admin: "principal@dps.edu", plan: "Enterprise", status: "Active", date: "Yesterday, 04:15 PM" },
  { id: 3, name: "Little Angels Academy", admin: "contact@littleangels.org", plan: "Basic", status: "Pending Approval", date: "July 18, 2026" },
  { id: 4, name: "Ryan International", admin: "ryan.admin@ryan.edu", plan: "Growth", status: "Active", date: "July 15, 2026" },
];

export const mockSchools = [
  {
    id: "sch_001",
    schoolId: "st-xaviers",
    name: "St. Xavier's Academy",
    logo: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=100&auto=format&fit=crop&q=60",
    address: "123 Park Avenue, Sector 5",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    phone: "+91 98765 43210",
    email: "info@stxaviers.edu",
    website: "www.stxaviers.edu",
    principal: "Dr. Augustine F. Pinto",
    schoolAdmin: "admin@stxaviers.edu",
    timezone: "IST (UTC+05:30)",
    language: "English",
    currency: "INR (₹)",
    academicSession: "2026-2027",
    maxStudents: 2000,
    maxStaff: 150,
    maxStorage: 200, // GB
    status: "Active",
    plan: "Enterprise",
    trial: false,
    studentsCount: 1850,
    staffCount: 120,
    storageUsed: 142.5, // GB
    createdAt: "2025-01-15",
  },
  {
    id: "sch_002",
    schoolId: "greenwood-high",
    name: "Greenwood High School",
    logo: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=100&auto=format&fit=crop&q=60",
    address: "Bannerghatta Road",
    city: "Bengaluru",
    state: "Karnataka",
    country: "India",
    phone: "+91 80234 56789",
    email: "contact@greenwoodhigh.edu.in",
    website: "www.greenwoodhigh.edu.in",
    principal: "Aloysius D'Souza",
    schoolAdmin: "admin@greenwoodhigh.edu.in",
    timezone: "IST (UTC+05:30)",
    language: "English",
    currency: "INR (₹)",
    academicSession: "2026-2027",
    maxStudents: 1000,
    maxStaff: 80,
    maxStorage: 100, // GB
    status: "Active",
    plan: "Growth",
    trial: false,
    studentsCount: 940,
    staffCount: 72,
    storageUsed: 62.1, // GB
    createdAt: "2025-03-22",
  },
  {
    id: "sch_003",
    schoolId: "oakridge-int",
    name: "Oakridge International",
    logo: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=100&auto=format&fit=crop&q=60",
    address: "Gachibowli",
    city: "Hyderabad",
    state: "Telangana",
    country: "India",
    phone: "+91 40600 12345",
    email: "admissions@oakridge.in",
    website: "www.oakridge.in",
    principal: "Jeanette Rego",
    schoolAdmin: "admin@oakridge.in",
    timezone: "IST (UTC+05:30)",
    language: "English",
    currency: "INR (₹)",
    academicSession: "2026-2027",
    maxStudents: 500,
    maxStaff: 50,
    maxStorage: 50, // GB
    status: "Trial",
    plan: "Basic",
    trial: true,
    studentsCount: 320,
    staffCount: 38,
    storageUsed: 12.8, // GB
    createdAt: "2026-07-10",
  },
  {
    id: "sch_004",
    schoolId: "beaconhouse",
    name: "Beaconhouse School System",
    logo: "https://images.unsplash.com/photo-1588072432836-e10032774350?w=100&auto=format&fit=crop&q=60",
    address: "Gulberg III",
    city: "Lahore",
    state: "Punjab",
    country: "Pakistan",
    phone: "+92 42 111 232 266",
    email: "info@beaconhouse.edu.pk",
    website: "www.beaconhouse.edu.pk",
    principal: "Kassim Kasuri",
    schoolAdmin: "portal.admin@beaconhouse.edu.pk",
    timezone: "PKT (UTC+05:00)",
    language: "English",
    currency: "PKR (₨)",
    academicSession: "2026-2027",
    maxStudents: 3000,
    maxStaff: 250,
    maxStorage: 500,
    status: "Expired",
    plan: "Enterprise",
    trial: false,
    studentsCount: 2840,
    staffCount: 210,
    storageUsed: 485.2,
    createdAt: "2024-06-01",
  },
  {
    id: "sch_005",
    schoolId: "springdale",
    name: "Springdales School",
    logo: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=100&auto=format&fit=crop&q=60",
    address: "Benito Juarez Road, Dhaula Kuan",
    city: "New Delhi",
    state: "Delhi",
    country: "India",
    phone: "+91 11 2411 6604",
    email: "springdales@vsnl.com",
    website: "www.springdales.com",
    principal: "Dr. Jyoti Bose",
    schoolAdmin: "admin@springdales.com",
    timezone: "IST (UTC+05:30)",
    language: "English",
    currency: "INR (₹)",
    academicSession: "2026-2027",
    maxStudents: 1500,
    maxStaff: 120,
    maxStorage: 150,
    status: "Suspended",
    plan: "Growth",
    trial: false,
    studentsCount: 1410,
    staffCount: 98,
    storageUsed: 89.4,
    createdAt: "2024-09-18",
  }
];

export const mockPlans = [
  {
    id: "plan_basic",
    name: "Basic Plan",
    price: 99,
    duration: "Monthly",
    maxStudents: 500,
    maxStaff: 50,
    maxStorage: 50, // GB
    maxUsers: 600,
    enabledModules: ["student", "teacher", "parent", "attendance", "homework", "communication"],
    supportLevel: "Basic",
    smsCredits: 5000,
    emailCredits: 10000,
    pushNotificationLimits: "50,000/mo",
    apiLimits: "10,000 requests/day",
    customBranding: false,
    customDomain: false,
  },
  {
    id: "plan_growth",
    name: "Growth Plan",
    price: 249,
    duration: "Monthly",
    maxStudents: 1500,
    maxStaff: 120,
    maxStorage: 200, // GB
    maxUsers: 1800,
    enabledModules: ["student", "teacher", "parent", "attendance", "fees", "examinations", "homework", "library", "communication", "reports"],
    supportLevel: "Priority (Email & Chat)",
    smsCredits: 20000,
    emailCredits: 50000,
    pushNotificationLimits: "200,000/mo",
    apiLimits: "50,000 requests/day",
    customBranding: true,
    customDomain: false,
  },
  {
    id: "plan_enterprise",
    name: "Enterprise Plan",
    price: 599,
    duration: "Monthly",
    maxStudents: 5000,
    maxStaff: 400,
    maxStorage: 1000, // GB
    maxUsers: 6000,
    enabledModules: ["student", "teacher", "parent", "attendance", "fees", "examinations", "homework", "library", "transport", "hostel", "payroll", "inventory", "events", "communication", "reports", "analytics"],
    supportLevel: "Dedicated 24/7 Account Manager",
    smsCredits: 100000,
    emailCredits: 500000,
    pushNotificationLimits: "Unlimited",
    apiLimits: "250,000 requests/day",
    customBranding: true,
    customDomain: true,
  }
];

export const mockLicenses = [
  { id: "lic_001", key: "SMS-SAAS-X892-K102-PL90", school: "St. Xavier's Academy", status: "Active", expiry: "2027-01-15", devices: 5, maxSchools: 1, maxUsers: 6000 },
  { id: "lic_002", key: "SMS-SAAS-B871-M091-G821", school: "Greenwood High School", status: "Active", expiry: "2026-11-22", devices: 3, maxSchools: 1, maxUsers: 1800 },
  { id: "lic_003", key: "SMS-SAAS-L102-J821-X992", school: "Oakridge International", status: "Active", expiry: "2026-08-10", devices: 2, maxSchools: 1, maxUsers: 600 },
  { id: "lic_004", key: "SMS-SAAS-Z901-N481-D611", school: "Beaconhouse School", status: "Suspended", expiry: "2027-06-01", devices: 10, maxSchools: 3, maxUsers: 8000 },
];

export const mockSupportTickets = [
  { id: "TCK-481", school: "St. Xavier's Academy", subject: "Payment gateway integration failing on credit cards", priority: "Critical", status: "Open", assigned: "Developer Team", created: "2 hours ago" },
  { id: "TCK-478", school: "Greenwood High School", subject: "Unable to upload student bulk CSV data", priority: "High", status: "Assigned", assigned: "Support Staff (Anjali)", created: "5 hours ago" },
  { id: "TCK-465", school: "Ryan International", subject: "Custom domain SSL not auto-renewing", priority: "Medium", status: "Open", assigned: "Developer Team", created: "1 day ago" },
  { id: "TCK-440", school: "Springdales School", subject: "Requesting custom module for Library RFID scanner", priority: "Low", status: "Resolved", assigned: "Product Team", created: "4 days ago" },
  { id: "TCK-432", school: "Oakridge International", subject: "SMS credits not showing after payment", priority: "High", status: "Closed", assigned: "Finance Team", created: "1 week ago" }
];

export const mockInvoices = [
  { id: "INV-2026-102", school: "St. Xavier's Academy", plan: "Enterprise", amount: 599.00, status: "Paid", date: "2026-07-15", pdfUrl: "#" },
  { id: "INV-2026-101", school: "Greenwood High School", plan: "Growth", amount: 249.00, status: "Paid", date: "2026-07-12", pdfUrl: "#" },
  { id: "INV-2026-100", school: "Springdales School", plan: "Growth", amount: 249.00, status: "Pending", date: "2026-07-08", pdfUrl: "#" },
  { id: "INV-2026-099", school: "Beaconhouse School", plan: "Enterprise", amount: 599.00, status: "Failed", date: "2026-07-01", pdfUrl: "#" },
  { id: "INV-2026-098", school: "Ryan International", plan: "Growth", amount: 249.00, status: "Overdue", date: "2026-06-15", pdfUrl: "#" },
];

export const mockSystemLogs = [
  { timestamp: "2026-07-20 11:05:42", level: "info", service: "auth-service", message: "User superadmin@appzeto.com successfully logged in from IP 192.168.1.1" },
  { timestamp: "2026-07-20 11:04:15", level: "error", service: "tenant-router", message: "Failed database connection for tenant: st-xaviers. Retrying..." },
  { timestamp: "2026-07-20 11:02:10", level: "warn", service: "notification-broker", message: "SMS delivery delayed for provider MSG91 queue size: 142" },
  { timestamp: "2026-07-20 11:00:00", level: "info", service: "cron-backup", message: "Database snapshot backup/db_backup_20260720.gz successfully created" },
  { timestamp: "2026-07-20 10:55:18", level: "error", service: "billing-engine", message: "Failed webhook delivery to stripe. HTTP 504 Gateway Timeout" },
];

export const mockAuditLogs = [
  { id: "AUD-9201", event: "School Creation", entity: "School", user: "Chirag (Super Admin)", ip: "192.168.1.5", device: "Chrome / Windows 11", location: "Mumbai, IN", time: "2026-07-20 09:30:15" },
  { id: "AUD-9200", event: "Subscription Upgrade", entity: "Subscription", user: "Anjali (Support)", ip: "192.168.1.12", device: "Safari / macOS", location: "Bengaluru, IN", time: "2026-07-20 08:45:22" },
  { id: "AUD-9199", event: "API Key Generated", entity: "Security", user: "Chirag (Super Admin)", ip: "192.168.1.5", device: "Chrome / Windows 11", location: "Mumbai, IN", time: "2026-07-20 08:15:00" },
  { id: "AUD-9198", event: "Backup Triggered", entity: "Backup", user: "System Scheduler", ip: "localhost", device: "Node.js Cron", location: "Cloud Server", time: "2026-07-20 06:00:00" },
];

export const mockBackups = [
  { id: "BAK-8921", name: "db_snapshot_prod_20260720_060000.tar.gz", size: "2.4 GB", type: "Automatic", status: "Success", date: "2026-07-20 06:00:00" },
  { id: "BAK-8920", name: "db_snapshot_manual_before_upgrade.tar.gz", size: "2.35 GB", type: "Manual", status: "Success", date: "2026-07-19 22:15:45" },
  { id: "BAK-8919", name: "db_snapshot_prod_20260719_060000.tar.gz", size: "2.38 GB", type: "Automatic", status: "Success", date: "2026-07-19 06:00:00" },
  { id: "BAK-8918", name: "db_snapshot_failed_attempt.tar.gz", size: "0 KB", type: "Manual", status: "Failed", date: "2026-07-18 14:02:11" },
];

export const mockActiveSessions = [
  { id: "SES-01", user: "Chirag (Super Admin)", device: "Chrome / Windows 11", ip: "192.168.1.5", location: "Mumbai, IN", current: true, lastActive: "Active Now" },
  { id: "SES-02", user: "Anjali (Support)", device: "Firefox / macOS", ip: "192.168.1.12", location: "Bengaluru, IN", current: false, lastActive: "2 mins ago" },
  { id: "SES-03", user: "Vikram (Developer)", device: "Postman API client", ip: "103.44.82.9", location: "Pune, IN", current: false, lastActive: "15 mins ago" },
];

export const mockApiKeys = [
  { id: "KEY-01", name: "Stripe Webhook API Key", key: "sk_live_51M...8a92", created: "2025-01-15", status: "Active", requests: "4.5M" },
  { id: "KEY-02", name: "School Admin Mobile App", key: "apk_live_38...b201", created: "2025-06-20", status: "Active", requests: "12.8M" },
  { id: "KEY-03", name: "Legacy reporting key (do not delete)", key: "sk_live_09...28d1", created: "2024-11-01", status: "Revoked", requests: "12" },
];

export const mockIntegrations = [
  { id: "razorpay", name: "Razorpay", category: "Payment", logo: "💳", status: "Connected", description: "Accept local credit cards, debit cards, UPI, netbanking, and mobile wallets in India." },
  { id: "stripe", name: "Stripe", category: "Payment", logo: "💸", status: "Connected", description: "Global online payment processing system for internet businesses." },
  { id: "smtp", name: "SMTP Server", category: "Email", logo: "📧", status: "Connected", description: "Standard Simple Mail Transfer Protocol configurations for default notifications." },
  { id: "sendgrid", name: "SendGrid", category: "Email", logo: "✉️", status: "Connected", description: "Email delivery platform for transactional and marketing email campaigns." },
  { id: "ses", name: "AWS SES", category: "Email", logo: "☁️", status: "Disconnected", description: "High-performance, cost-effective Amazon Simple Email Service." },
  { id: "twilio", name: "Twilio", category: "SMS", logo: "💬", status: "Connected", description: "Programmable messaging provider for global SMS and OTP notifications." },
  { id: "msg91", name: "MSG91", category: "SMS", logo: "📱", status: "Connected", description: "Enterprise grade SMS provider in India for OTP and transactional SMS." },
  { id: "s3", name: "AWS S3", category: "Storage", logo: "💾", status: "Connected", description: "Object storage service for storing school media, student records, and automated backups." },
  { id: "cloudinary", name: "Cloudinary", category: "Storage", logo: "🖼️", status: "Connected", description: "Media management service for school logos, student images, and rich banner uploads." },
  { id: "gmaps", name: "Google Maps", category: "Services", logo: "🗺️", status: "Connected", description: "Geocoding and interactive route map settings for school transport tracking." },
];

export const mockTimelineRevenue = [
  { name: "Aug 25", revenue: 21000 },
  { name: "Sep 25", revenue: 23500 },
  { name: "Oct 25", revenue: 25000 },
  { name: "Nov 25", revenue: 28200 },
  { name: "Dec 25", revenue: 27900 },
  { name: "Jan 26", revenue: 31000 },
  { name: "Feb 26", revenue: 30500 },
  { name: "Mar 26", revenue: 32000 },
  { name: "Apr 26", revenue: 33400 },
  { name: "May 26", revenue: 34100 },
  { name: "Jun 26", revenue: 33800 },
  { name: "Jul 26", revenue: 34500 },
];

export const mockTimelineGrowth = [
  { name: "Jan", schools: 80, students: 31000 },
  { name: "Feb", schools: 84, students: 32500 },
  { name: "Mar", schools: 90, students: 35000 },
  { name: "Apr", schools: 95, students: 37400 },
  { name: "May", schools: 104, students: 41200 },
  { name: "Jun", schools: 112, students: 43000 },
  { name: "Jul", schools: 124, students: 45280 },
];
