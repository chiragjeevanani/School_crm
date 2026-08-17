# Project: School Management System Frontend Unification

## Architecture
- **Framework**: React, TypeScript, Vite, Tailwind CSS, React Router, Lucide Icons.
- **State Management**: Centralized Reactive Store & LocalStorage Persistence in `src/shared/store/` with pub-sub event propagation and React custom hooks.
- **Portals (10 Roles)**:
  1. `/super-admin` — Super Admin (SaaS Tenants, Module Toggles, Global Settings)
  2. `/school-admin` — School Admin (Admissions, Academics, Staff, Students, System Config)
  3. `/principal` — Principal (Executive Overview, Approvals, Academic Oversight)
  4. `/teacher` — Teacher (Classes, Attendance, Marks Entry, Leave Requests, Assignments)
  5. `/student` — Student (Schedule, Grades, Report Cards, Fee Payment, Library, Transport)
  6. `/parent` — Parent (Child Progress, Fee Invoices & Payment, Leave Requests, Attendance)
  7. `/accountant` — Accountant (Fee Structures, Collection Desk, Invoices, Expenses, Transactions)
  8. `/librarian` — Librarian (Book Catalog, Issue/Return, Overdue Tracking, Fines)
  9. `/receptionist` — Receptionist (Visitor Log, Inquiries, Front Desk Operations, Gate Pass)
  10. `/transport` — Transport Manager (Vehicles, Routes, Drivers, Student Allocations, Tracking)

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Central Reactive Store | Single source of truth in `src/shared/store/` with persistence & cross-tab sync | M1 | ORIGINAL_REQUEST §R1 |
| 2 | Universal Auth & Role Routing | Multi-identifier login (Email/Phone/Student ID/Staff ID) & dynamic redirect to 10 portals | M2 | ORIGINAL_REQUEST §R2 |
| 3 | Dynamic Credential Registration | Auto-register credentials when new students/staff are created | M2 | ORIGINAL_REQUEST §R2 |
| 4 | Password Reset & OTP Flow | Simulated password reset with OTP verification & audit trail | M2 | ORIGINAL_REQUEST §R2 |
| 5 | Floating Demo Switcher | 1-click active role & identity switcher floating across all pages | M4 | ORIGINAL_REQUEST §R3 |
| 6 | Super Admin SaaS Module Matrix | Tenant Greenfield Public School (`SCH-2026-09`) & dynamic feature toggles (Transport, Hostel, Library) | M4 | ORIGINAL_REQUEST §R3 |
| 7 | Admissions Propagation Pipeline | Approving admission generates student ID, updates roster, attendance, fees, library, transport | M3 | ORIGINAL_REQUEST §R1 |
| 8 | Unified Fee Ledger & Payments | Centralized fee structures, collection desk, student/parent payment, receipt generation (`RCT-2026-XXXX`) | M3 | ORIGINAL_REQUEST §R1 |
| 9 | Examination, Marks & Report Cards | Teacher bulk marks entry, admin publishing, dynamic report cards with GPA calculation | M3 | ORIGINAL_REQUEST §R1 |
| 10 | Staff & Student Leave Workflows | Leave requests, teacher/principal/HR approvals, auto-update attendance & leave balances | M3 | ORIGINAL_REQUEST §R1 |
| 11 | Library Catalog & Loan Sync | Real-time issue/return, stock decrement/increment, overdue fines, student/parent loan visibility | M3 | ORIGINAL_REQUEST §R1 |
| 12 | Fleet Transport Tracking & Stops | Vehicle/route assignment, live details on student/parent portals | M3 | ORIGINAL_REQUEST §R1 |
| 13 | Universal Audit Trail | Append-only audit logger capturing all mutations across all portals | M1, M3 | ORIGINAL_REQUEST §R1 |
| 14 | Universal Reports Hub & Exports | Real CSV downloads, Excel outputs, and formatted printable views for all report types | M5 | ORIGINAL_REQUEST §R4 |
| 15 | Zero-Error Build & Lint | 0 TypeScript errors, 0 ESLint fatal errors on `npm run build` and `npm run lint` | M6 | ORIGINAL_REQUEST §Acceptance Criteria |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M0 | Survey & Architecture Mapping | Deep codebase & route inspection across all 10 portals | none | IN_PROGRESS |
| M1 | Central Reactive Store & Shared Persistence | Build reactive stores under `src/shared/store/` with mock seed data & local persistence | M0 | PLANNED |
| M2 | Universal Auth & Role Routing | Implement universal `/login`, dynamic auth context, route guards, demo switcher integration | M1 | PLANNED |
| M3 | 10-Portal Deep Integration & Event Pipelines | Wire all 10 portals to store events: Admissions, Fees, Exams, Leaves, Library, Transport | M1, M2 | PLANNED |
| M4 | Super Admin SaaS Matrix & Demo Switcher | Multi-tenant config, Greenfield Public School SCH-2026-09, dynamic module toggles & quick switcher | M1, M2, M3 | PLANNED |
| M5 | Universal Reports Hub & Document Export Engine | Export engine (CSV, Excel, Print) across finance, academic, attendance, audit reports | M3 | PLANNED |
| M6 | Verification, Lint & Production Build Validation | `npm run lint` & `npm run build` zero-error validation + forensic audit | M1..M5 | PLANNED |

## Code Layout
- `src/shared/store/` — Central reactive state stores (auth, tenant, students, academics, finance, attendance, leaves, library, transport, audit, reports).
- `src/shared/types/` — Shared TypeScript data models, interfaces, and enums.
- `src/shared/utils/` — Export helpers (CSV, Excel, PDF/Print), formatters, ID generators (`RCT-2026-XXXX`, `STD-2026-XXXX`).
- `src/shared/components/` — Global Floating Role Switcher, universal Navbar/Sidebar, Module Guard, Export Buttons.
- `src/modules/` or `src/pages/` or `src/portals/` — 10 Portal implementations and dashboards.
- `src/routes/` or `src/App.tsx` — Universal route definitions, role guards, and auth redirection.
