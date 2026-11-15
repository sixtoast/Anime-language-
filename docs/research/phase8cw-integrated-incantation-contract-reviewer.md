# Phase 8CW — Integrated Incantation contract reviewer

**Date:** 2026-11-14  
**Canon effect:** NONE. **Spoken forms added:** 0. **Grammar changes:** none.  
**Tests authored:** INC-INT-CW-001–024. **Execution:** not run locally.

## Purpose
Integrate the bounded argument, semantic relationship, condition, evidence, temporal, postcondition, lifecycle and recovery reviewers into one orchestration report. This is a contract review workbench, not a spell compiler or executor.

## Inputs
- `operations[]`: stable operation ID plus the existing v1.0–v1.8 argument record.
- `relationships`: v1.3 relationship graph. Every declared operation must have a matching OPERATION node; orphan OPERATION nodes are reported.
- `conditions`: v1.2 condition profile. An explicit empty array means no conditions were declared; it is not inferred from omission.
- `evidence`: records, explicit policy and UTC as-of timestamp, reviewed using Phase 8CU.
- `temporalContracts[]`: temporal declarations reviewed using Phase 8CU.
- `postconditions[]`: explicit attempted/result declarations reviewed using Phase 8CU.
- `lifecycleRecords[]`: invocation status and interruption event streams reviewed using Phase 8CV.
- `recoveryBranches[]`: explicit branches reviewed using Phase 8CV.

## Cross-checks and dispositions
- Operation IDs are unique and linked to graph OPERATION nodes.
- Every subreview's issues are surfaced with section-qualified paths.
- Dependency cycles are counted and relationship graph findings preserved.
- Evidence is accepted only under the supplied policy; this does not establish predicate truth or automatically bind evidence to a condition.
- Failed, unknown or unverified postconditions are blockers.
- Ineligible recovery branches are warnings and remain unexecuted.
- Lifecycle outcome is reported as a declaration, never as authenticated fact.
- Structural coherence means only that the submitted declarations pass the bounded reviewers. It does not prove semantic completeness.

## Deliberate limits
No automatic mapping from evidence records to predicate conditions, no implicit condition evaluation, no automatic prerequisite ordering, no unspoken recovery, no operation scheduling, no authority authentication, no spoken syntax parsing, no type compatibility, no geometry/mechanism feasibility, no physical execution, no safety/containment guarantee. Omitted arrays are not silently treated as empty; where the profile expects an explicit declaration, the caller must supply it.

## Sources
- `docs/canon/arcane-incantations-v1.0-foundation.md` §§2–8.
- `docs/canon/arcane-incantations-v1.2-preconditions-constraints-and-failure.md` §§7–9.
- `docs/canon/arcane-incantations-v1.5-invocation-profiles-and-execution-contracts.md` §§1–8.
- Phase 8CR–8CV research documents and corresponding reviewers.

## Verification
Twenty-four Vitest cases authored and registered as INC-INT-CW-001–024; not executed locally. Preview deployment may verify TypeScript/Vite build only. No Actions dispatch, merge or production deployment.
