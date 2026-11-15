# Phase 8CU — Evidence provenance, freshness and temporal validity

**Date:** 2026-11-14  
**Canon effect:** NONE. **New spoken forms:** 0. **Grammar changes:** none.  
**Tests authored:** INC-EVID-001–028. **Tests executed:** not executed locally.

## Sources
- `docs/canon/arcane-incantations-v1.7-state-predicates-and-preconditions.md` §§2–8: predicate result states, freshness, uncertainty, coverage, provenance classes, temporal operators and postconditions.
- `docs/canon/arcane-incantations-v1.2-preconditions-constraints-and-failure.md` §§1–8: evaluation sequence, condition scope, invariant monitoring, failure and dependency gates.
- The terms ASSERTED, DERIVED, OBSERVED and VERIFIED are evidence classes in modern design canon, not a universal trust ranking and not historical spoken forms.

## Implementation
`src/engine/incantationEvidenceModel.ts` introduces four bounded reviewers:
- `reviewEvidenceRecord`: checks source/method, provenance acceptance, UTC observation and expiry timestamps, maximum age, declared uncertainty/coverage thresholds and required derivation/verification contracts.
- `reviewEvidenceSet`: identifies conflicting accepted TRUE/FALSE records for the same subject and predicate. It preserves all evidence IDs and refuses to choose a winner by order or convenience.
- `reviewTemporalContract`: checks required declarations for THROUGHOUT/CONTINUOUS/UNTIL monitoring contracts, UNTIL stopping events, WITHIN-INTERVAL boundaries, and rejects continuity claims from BEFORE-AND-AFTER observations.
- `reviewPostcondition`: an unattempted operation remains NOT-EVALUATED; TRUE after an attempt is SATISFIED, FALSE is FAILED, and UNKNOWN/ERROR remains UNVERIFIED. Only a satisfied result releases the declared dependency.

## Limits
These are declaration/evidence-shape checks, not an observation system, trusted clock, sensor integration, predicate evaluator or monitor. Caller-supplied timestamps and results are not independently authenticated. The model cannot establish that an evidence source is trustworthy, a derivation is correct, a measurement is accurate, a monitor actually ran, or an outcome physically occurred. A structurally valid monitoring contract does not establish continuous invariance; `continuityEstablished` is always false. The model does not authorise or execute operations.

## Tests and deployment
Twenty-eight Vitest cases are authored and registered; they have not been executed locally. Vercel preview runs the configured TypeScript/Vite build, not these Vitest or browser tests. No Actions dispatched; no merge, production deployment, spoken-language change or canon change.
