## 2026-08-14T17:34:35Z
Mission:
Extract precise functional specifications and map cross-module event workflows required across all 10 portals:
1. Examine ORIGINAL_REQUEST.md, the FRD, and the frontend codebase.
2. Detail the exact workflows and data propagation rules for:
   - Admissions Pipeline: School Admin approval -> Student ID (`STD-2026-XXXX`), Roster, Class lists, Attendance sheets, Fee account, Library member, Transport allocation.
   - Unified Fee Ledger: Fee structures, Collection desk, Student/Parent online payment, Receipts (`RCT-2026-XXXX`), Balance sync across Accountant & Admin reports.
   - Examination & Results: Teacher bulk marks entry, Admin verification/publishing, Dynamic report cards with GPA calculation and ranking.
   - Staff & Student Leaves: Submission, Teacher/Principal/HR approval, Attendance status & leave balance updates.
   - Library & Fleet Transport: Book issue/return with stock sync, overdue fines, vehicle/route details and live student stops.
   - Universal Audit Trail: Append-only audit logger capturing all mutations across all portals.
   - SaaS Module Matrix: Greenfield Public School (`SCH-2026-09`) dynamic module toggling (Hostel, Transport, Library, etc.) affecting UI visibility.
   - Reports Hub & Document Export Engine: CSV, Excel, Print/PDF exports across all modules.
3. Create a gap analysis comparing these requirements with current frontend implementations.
