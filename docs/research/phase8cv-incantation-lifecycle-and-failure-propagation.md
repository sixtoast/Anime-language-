# Phase 8CV — Incantation lifecycle and failure propagation

**Date:** 2026-11-14  
**Canon effect:** NONE. **New spoken forms:** 0. **Grammar changes:** none.  
**Tests authored:** INC-LIFE-001–026. **Tests executed:** not executed locally.

## Primary sources
- `docs/canon/arcane-incantations-v1.5-invocation-profiles-and-execution-contracts.md` §§1–8: distinct progression from well-formed, validated, contract-accepted, authorised, ready, attempted, execution-reported and outcome-verified/failed/unknown; separate interruption states; append-only audit records.
- `docs/canon/arcane-incantations-v1.2-preconditions-constraints-and-failure.md` §§7–9: check order, first blocking failure, dependency blocking, explicit recovery branch, no implicit best-effort or rollback.
- `docs/canon/arcane-incantations-v1.0-foundation.md` §§7–8: requested effect, validation, execution and postcondition are distinct.

## Implementation
`src/engine/incantationLifecycleModel.ts`:
- `reviewInvocationLifecycle` validates legal status transitions, contiguous event sequence, unique event IDs, UTC timestamps and append-only time ordering.
- Execution cannot be attempted before validation, contract acceptance, external authorisation and READY.
- OUTCOME-VERIFIED requires an execution attempt and EXECUTION-REPORTED.
- OUTCOME-FAILED and OUTCOME-UNKNOWN are terminal in this profile; a later success cannot overwrite them. A new invocation must be separately identified.
- Interruption has an independent event stream. ACKNOWLEDGED is not STOP-CONFIRMED; STOP-PARTIAL and STOP-UNKNOWN remain distinct.
- `reviewRecoveryBranch` requires an explicitly declared branch, named failed operation, explicit independence from the failed guarantee, typed/validated branch operations and external authorisation. Eligibility is only for external review, not execution.

## Limits
The model checks status/event declarations, not whether the underlying validation, contract, authority, execution report or outcome evidence is true. It does not authenticate event sources or timestamps, execute operations, request interruption, prove cessation, rollback, contain side effects or guarantee a safe state. It does not invent a recovery plan. The audit is append-only by validation convention; this code does not provide tamper-proof storage.

## Tests and status
Twenty-six Vitest cases are authored and registered as INC-LIFE-001–026; not executed locally. Vercel preview runs TypeScript/Vite build, not Vitest or browser acceptance. No Actions dispatched, no merge or production deployment, no spoken-language/canon changes.
