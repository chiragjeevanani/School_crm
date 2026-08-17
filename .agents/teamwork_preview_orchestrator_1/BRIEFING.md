# BRIEFING — 2026-08-14T17:34:40Z

## Mission
Coordinate all 10 frontend portals of the School Management System, unify state management across modules via a central reactive store (`src/shared/store/`), align the entire web application with the Functional Requirement Document (FRD), implement universal auth & role routing, floating demo switcher & SaaS tenant matrix, and reports engine with real exports. Ensure `npm run build` and `npm run lint` pass with 0 errors.

## 🔒 My Identity
- Archetype: teamwork_preview_orchestrator
- Roles: orchestrator, user_liaison, human_reporter, successor
- Working directory: d:\Desktop\Appzeto\education client\.agents\teamwork_preview_orchestrator_1
- Original parent: parent
- Original parent conversation ID: 336bbb3f-cdf3-4487-aa73-62d899d77770

## 🔒 My Workflow
- **Pattern**: Project Pattern (Dual Track: Implementation + E2E Testing)
- **Scope document**: d:\Desktop\Appzeto\education client\.agents\teamwork_preview_orchestrator_1\PROJECT.md
1. **Decompose**: Survey codebase & FRD via parallel Explorers/Spec Miners, establish unified architecture in PROJECT.md, decompose into sequential/parallel milestones.
2. **Dispatch & Execute**:
   - Survey Phase: 3 Explorers / Spec Miners in parallel to map state, routes, portal components, and FRD requirements.
   - Milestone Sub-orchestrators: Delegate each milestone (Store & Unified State, Universal Auth & Routing, 10-Portal Alignment & Event Wiring, SaaS Module Matrix & Demo Switcher, Reports Hub & Export Engine, Build/Lint & E2E Validation) to specialized worker/sub-orchestrator loops (Explorer -> Worker -> Reviewer -> Challenger -> Auditor -> Gate).
3. **On failure**:
   - Retry: nudge stuck agent or re-send task
   - Replace: spawn fresh agent with partial progress
   - Skip: proceed without (only if non-critical)
   - Redistribute: split stuck agent's remaining work
   - Redesign: re-partition decomposition
   - Escalate: report to parent (sub-orchestrators only, last resort)
4. **Succession**: Self-succeed at 16 spawns if necessary, persisting state to handoff.md.
- **Work items**:
  1. Survey & Codebase Architecture Mapping [in-progress]
  2. Central Reactive Store & Storage Persistence [pending]
  3. Universal Authentication & Role-Based Routing [pending]
  4. 10-Portal State & Event Integration (Admissions, Fees, Exams, Leaves, Library, Transport, Audit) [pending]
  5. Super Admin SaaS Module Matrix & Floating Demo Switcher [pending]
  6. Universal Reports Hub & Document Export Engine [pending]
  7. Final Verification, Lint & Production Build Validation [pending]
- **Current phase**: 0 (Survey)
- **Current focus**: Surveying codebase and FRD requirements

## 🔒 Key Constraints
- DISPATCH-ONLY orchestrator: NEVER write source code directly, NEVER run build/test commands directly, delegate ALL implementation and exploration to subagents.
- Non-negotiable audit gating: Forensic auditor integrity checks are strictly enforced.
- Target: 10 frontend portals unified, reactive store, universal auth, demo switcher, reports export, build & lint 0 errors.

## Current Parent
- Conversation ID: 336bbb3f-cdf3-4487-aa73-62d899d77770
- Updated: 2026-08-14T17:34:00Z

## Key Decisions Made
- Architecture: Centralized reactive store pattern with custom event emitters / hooks under `src/shared/store/` with local storage persistence and cross-tab/cross-component synchronization.
- Dispatched 3 survey subagents:
  1. ea2a78f0-c682-4ee0-952b-642b095ed2d6 (Explorer 1: State & Architecture)
  2. bbe2fc9f-1520-43bd-a179-03611a341df3 (Explorer 2: Routing & Auth)
  3. c8b91604-8b39-4403-ad2a-4cae21271754 (Spec Miner 3: Requirements & Workflows)

## Team Roster
| Agent | Type | Work Item | Status | Conv ID |
|-------|------|-----------|--------|---------|
| explorer_survey_1 | teamwork_preview_explorer | State & Architecture Exploration | in-progress | ea2a78f0-c682-4ee0-952b-642b095ed2d6 |
| explorer_survey_2 | teamwork_preview_explorer | Routing & Auth Exploration | in-progress | bbe2fc9f-1520-43bd-a179-03611a341df3 |
| spec_miner_survey_3 | teamwork_preview_spec_miner | Requirements & Workflow Spec Mining | in-progress | c8b91604-8b39-4403-ad2a-4cae21271754 |

## Succession Status
- Succession required: no
- Spawn count: 3 / 16
- Pending subagents: ea2a78f0-c682-4ee0-952b-642b095ed2d6, bbe2fc9f-1520-43bd-a179-03611a341df3, c8b91604-8b39-4403-ad2a-4cae21271754
- Predecessor: none
- Successor: not yet spawned

## Active Timers
- Heartbeat cron: task-25
- Safety timer: none

## Artifact Index
- d:\Desktop\Appzeto\education client\.agents\ORIGINAL_REQUEST.md — Original User Request
- d:\Desktop\Appzeto\education client\.agents\teamwork_preview_orchestrator_1\DISPATCH.md — Dispatch log
- d:\Desktop\Appzeto\education client\.agents\teamwork_preview_orchestrator_1\plan.md — Orchestration Plan
- d:\Desktop\Appzeto\education client\.agents\teamwork_preview_orchestrator_1\progress.md — Liveness & Progress
- d:\Desktop\Appzeto\education client\.agents\teamwork_preview_orchestrator_1\context.md — Context memory
- d:\Desktop\Appzeto\education client\.agents\teamwork_preview_orchestrator_1\PROJECT.md — Global project architecture & milestones
