# Phase 8CT — Condition evidence and prerequisite gate model

**Date:** 2026-11-14  
**Canon effect:** NONE. **New spoken forms:** 0. **Grammar changes:** none.  
**Tests authored:** INC-COND-001–022. **Tests executed:** not executed locally.

## Primary design sources

- `docs/canon/arcane-incantations-v1.2-preconditions-constraints-and-failure.md` §§1–9: typed semantic condition record; check times and scopes; blocking failures; dependent-operation blocking; no implicit recovery or best-effort mode.
- `docs/canon/arcane-incantations-v1.7-state-predicates-and-preconditions.md` §§1–10: versioned predicate identity, typed bindings, required result, temporal operator, evidence policy, TRUE/FALSE/UNKNOWN/ERROR/INVALID distinctions, freshness and evidence provenance.
- `docs/canon/arcane-incantations-v1.3-mechanism-and-effect-semantics.md` §§1, 6–8: passing predicates does not establish mechanism support, feasibility, authorisation or execution.

These are locked modern design contracts, not recovered historical spoken syntax.

## Implementation

Added `src/engine/incantationConditionModel.ts`:
- `reviewIncantationConditions(input)` validates declaration shape, unique IDs, predicate identity/version, bindings array, required result, temporal operator, check time, scope, evidence policy and failure policy.
- Safety-critical conditions cannot use REPORT-ONLY.
- `reviewPrerequisiteGate(input)` applies explicit result matching: only the exact required TRUE or FALSE releases the declared gate.
- UNKNOWN, ERROR, INVALID and NOT-EVALUATED always block.
- Gate release does not execute an operation and does not establish authority or feasibility.

## Explicit non-capabilities

This is not a predicate registry or evaluator. It does not verify that a predicate implementation exists, evaluate its truth, validate evidence freshness, resolve/type-check bindings, monitor DURING/CONTINUOUS invariants, estimate resources, model abort latency, implement recovery branches, rollback or containment. It does not infer temporal semantics from the temporal operator string. It does not authorise or execute anything.

A structurally complete declaration is not a validated spell. A released prerequisite gate is only a local result decision based on the supplied predicate result; its provenance and correctness remain external.

## Tests and status

Twenty-two Vitest cases are authored and registered as INC-COND-001–022; they have not been executed locally. Vercel preview build checks TypeScript and Vite bundling, not Vitest or browser acceptance. No GitHub Actions workflow is dispatched. No production deployment, merge or canon change is made.
