# Context — School Management System Frontend Unification

## Task Overview
We are orchestrating the complete frontend unification of a 10-portal School Management System aligned with the Functional Requirement Document (FRD).
The project requires:
1. Centralized Reactive Store & Shared Persistence (`src/shared/store/`) serving as single source of truth across all 10 role portals.
2. Universal Authentication & Role Routing (FRD §6 & §27).
3. Global Demo Switcher & Super Admin SaaS Module Matrix (FRD §23).
4. Reports Hub & Document Export Engine (FRD §21 & §28).
5. Cross-module event workflows: Admissions -> Student roster / Attendance / Fees / Library / Transport; Unified Fee Ledger -> Receipts & Balances; Exam Marks -> Report Cards & GPA; Staff/Student Leaves -> Attendance; Library Book Loans -> Catalog sync; Universal Audit Log.
6. 0 errors on `npm run build` and `npm run lint`.

## Portals to Unify
1. Super Admin
2. School Admin
3. Principal
4. Teacher
5. Student
6. Parent
7. Accountant
8. Librarian
9. Receptionist / Front Desk
10. Transport / Driver / Fleet Manager

## Architecture Constraints
- Must remain strictly typed, robust, modern React/TypeScript/Vite.
- Zero mock failures: genuine state updates, cross-component reactivity, reactive event emissions, localStorage persistence.
- Zero build and zero lint errors.
