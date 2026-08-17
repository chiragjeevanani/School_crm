# Original User Request

## 2026-08-14T17:33:31Z

Coordinate all 10 frontend portals of the School Management System, unify state management across modules via a central reactive store, and align the entire web application with the uploaded Functional Requirement Document (FRD).

Working directory: d:\Desktop\Appzeto\education client\frontend
Integrity mode: development

## Requirements

### R1. Centralized Reactive Store & Shared State Persistence
Implement a comprehensive, reactive state management and localStorage persistence layer (`src/shared/store/`) with cross-tab and cross-component event broadcasting that serves as the single source of truth for all 10 role portals.
- Roster & Admissions: Approving an admission in School Admin automatically generates student ID and admission number, updating active student roster, teacher class lists, attendance sheets, library members, transport assignments, and fee accounts.
- Unified Fee Ledger: Centralize fee structures, collection desk records, student online payments, and parent online payments into one shared transaction store with unique receipt numbers (`RCT-2026-XXXX`).
- Examination & Report Cards: Enable multi-student/multi-subject marks entry for teachers, result verification and publishing by school admin/principal, and dynamically generated report cards with GPA, rankings, and remarks for students and parents.
- Staff & Student Leave Workflow: Support student leave requests with teacher approval, and staff leave requests with principal/HR approval that auto-update attendance records and staff leave balances.
- Library & Fleet Transport: Real-time book issue/return with stock count sync and overdue fine management; student transport assignment with live vehicle and route details displayed on student and parent dashboards.
- Universal Audit Logging: Capture all state mutations across all modules into an append-only system audit trail.

### R2. Universal Authentication & Role Routing (FRD §6 & §27)
- Central login portal at `/login` supporting email, mobile number, student ID, or employee ID + password, automatically resolving identity and redirecting to the corresponding role dashboard.
- Dynamic credential registration so newly created teachers, students, and staff members from School Admin and HR can immediately authenticate.
- Password reset flow with simulated OTP verification and login activity monitoring.

### R3. Global Demo Switcher & Super Admin SaaS Module Matrix (FRD §23)
- Floating, collapsible quick role switcher allowing 1-click switching between any of the 10 role dashboards with active identity synchronization for rapid evaluation.
- Integrate Greenfield Public School (`SCH-2026-09`) as the primary tenant in Super Admin and enforce dynamic module toggles (e.g., enabling/disabling Hostel or Transport in Super Admin dynamically toggles visibility and access in School Admin and role portals).

### R4. Reports Hub & Document Export Engine (FRD §21 & §28)
- Wire all report categories across the application with real CSV file downloads, Excel-compatible outputs, and printable formatted report/receipt views.

## Acceptance Criteria

### State Coordination & Propagation
- [ ] Admitting a student in School Admin adds the record to `/school-admin/students`, `/teacher/attendance`, `/accountant/fee-collection`, and `/transport/assignments`.
- [ ] Paying a fee in Student or Parent portal generates a receipt and updates the outstanding balance in Accountant fee collection and School Admin financial reports.
- [ ] Submitting exam marks as Teacher and publishing results in School Admin enables report card view with GPA in Student and Parent portals.
- [ ] Issuing a book in Librarian portal decrements available copies in catalog and appears under active loans in Student and Parent library pages.
- [ ] Approving a staff leave in Principal or HR portal updates the teacher's leave status and staff attendance.

### Authentication & Navigation
- [ ] `/login` authenticates valid credentials for any of the 10 roles and redirects to the correct portal.
- [ ] Global role switcher allows seamless switching between all 10 roles.
- [ ] Toggling a module off in Super Admin hides that module in School Admin and corresponding role menus.

### Codebase Integrity & Verification
- [ ] `npm run build` succeeds with zero errors.
- [ ] `npm run lint` passes with zero fatal syntax or import errors.
