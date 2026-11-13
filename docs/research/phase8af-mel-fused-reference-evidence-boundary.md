# Phase 8AF — MEL fused-reference evidence boundary

**Date:** 2026-11-13  
**Branch:** feat/v1-9-fixture-coverage-audit-2026-11-11  
**Canon effect:** none. **New vocabulary:** none.  
**Tests authored:** CON-REF-FUSED-001–007 (authored-unverified). **Tests executed:** none.

## Recovered source statement

The Phase 4 §8 hand-flame example records `mel` as `me` + anchor coda `l`, used for an MI surface-scope reference anchored to the hand. Phase 5.15 records the same evidence and explicitly identifies the anatomical landmark system as missing. Phase 5.16 C-05/C-09 preserve the boundary: the default scope of formal MI/NI/RI and the SELF-surface description of formal `me` do not recover the landmark morphology.

## Critical distinction

Three records must remain distinct:

1. **Formal reference context:** formal MI/NI/RI and `me` tokens, with recovered scope/persistence behaviour in `constructionReferenceContext.ts`.
2. **Performed fused example form:** `mel`, recorded as `me + l` in one hand-anchored example.
3. **General fused-reference grammar:** unresolved. No productive anchor-coda inventory, landmark paradigm, boundary geometry, identifier syntax or general fusion rule is recovered.

The new lookup therefore recognises only the exact example form `mel`. It does not parse arbitrary forms, infer additional anchors, or create/update a formal reference binding.

## Implementation

Added `src/engine/constructionFusedReferenceEvidence.ts`, a read-only evidence lookup and seven authored tests. Construction Studio now presents the lookup separately from the formal reference-context binder and explicitly states that it cannot create a binding.

## Validation

CON-REF-FUSED-001–007 are authored-unverified. No local unit tests or browser acceptance tests were executed. No GitHub Actions workflow was run. Main and production remain untouched.

## Next evidence required

The next useful language increment depends on recovering the original Phase 4 §3.3 / §8–9 source artefacts or the standalone v2.0 morphology specification. Specifically needed: full anchor-coda inventory; anatomical landmark definitions; mapping from a fused form to a reference target; and rules for scope, persistence and replacement when a fused reference is used. The summaries in Phase 5.15/5.16 are insufficient to reconstruct a productive paradigm safely.
