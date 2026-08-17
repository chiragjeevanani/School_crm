# Orchestration Plan — School Management System

## Phase 0: Survey & Technical Mapping (Parallel Explorers)
- **Explorer 1 (State & Data Models)**: Inspect `src/`, investigate existing state/mock data/stores across all modules, structure of `src/shared/`, types, and persistence layer.
- **Explorer 2 (Routing, Auth & Portals)**: Inspect router configuration, login flows, auth contexts, portal layouts, role protections, navigation bars, and demo switchers across all 10 roles.
- **Explorer 3 / Spec Miner (Workflows, FRD Mapping & Exports)**: Map cross-portal workflows (Admissions -> Fees/Roster/Transport/Library, Fee Payments -> Receipts, Exams -> GPA/Cards, Leaves -> Attendance, Library -> Loans/Fines, Reports/Export Engine, SaaS Tenant Module Matrix).

## Phase 1: Store & Centralized Reactive State Architecture
- Design & implement `src/shared/store/` with sub-stores:
  - `authStore` (current user, active role, credentials, session)
  - `tenantStore` (active tenant SCH-2026-09 Greenfield Public School, module toggles matrix)
  - `studentStore` & `admissionsStore` (students, admissions, enrollments)
  - `academicsStore` (classes, sections, subjects, exam schedules, marks, grading, GPA calculator)
  - `financeStore` (fee structures, fee allocations, invoices, payments, receipts `RCT-2026-XXXX`, expenses)
  - `attendanceStore` (student attendance, staff attendance)
  - `leaveStore` (student leaves, staff leaves, approval workflows)
  - `libraryStore` (books catalog, copies, issues/returns, overdue fines)
  - `transportStore` (vehicles, routes, driver allocations, student stops)
  - `auditStore` (universal append-only activity trail)
  - `reportsStore` & export utilities (CSV, Excel-compatible, print formatter)
- Storage synchronization and custom event bus / reactive subscription hooks (`useStore`, `useAuth`, `useTenant`, etc.).

## Phase 2: Universal Auth & Role-Based Routing
- Central `/login` accepting Email, Mobile, Student ID, or Employee ID + password.
- Identity resolution and auto-redirect to appropriate role dashboard (`/super-admin`, `/school-admin`, `/principal`, `/teacher`, `/student`, `/parent`, `/accountant`, `/librarian`, `/receptionist`, `/transport`).
- Registration of new credentials on creation of students/staff.
- Password reset simulation with OTP & audit logging.

## Phase 3: 10-Portal Deep Integration & Cross-Module Workflows
- School Admin / Admissions: Approving admission auto-propagates across roster, class list, attendance, library, transport, fees.
- Accountant & Student/Parent Fee Payment: Real-time payment processing, instant balance updates, receipt generation.
- Teacher & Principal/Admin Marks & Grading: Bulk marks entry, verification, GPA computation, dynamic report cards.
- Leaves Workflow: Teacher/Principal/HR approval updating attendance.
- Library & Fleet Transport: Real-time stock sync, overdue tracking, route visualization.
- Audit Log display and instrumentation on all operations.

## Phase 4: Super Admin SaaS Matrix & Floating Demo Switcher
- Super Admin Tenant management (Greenfield Public School `SCH-2026-09`) with dynamic module toggles (Hostel, Transport, Library, etc.).
- Module toggle enforcement: dynamically showing/hiding routes and sidebar items across all portals.
- Floating quick role switcher with 1-click active identity switching for all 10 roles.

## Phase 5: Universal Reports Hub & Document Export Engine
- Real CSV file generation/download and Excel-compatible tables.
- Formatted printable views for Fee Receipts, Report Cards, ID Cards, Transfer Certificates, Attendance Registers.

## Phase 6: Verification, Type Checking, Lint & Build
- Run `npm run lint` and fix all warnings/errors.
- Run `npm run build` and ensure 0 errors.
- Run complete E2E adversarial review and forensic audits.
