# Phase 8AD — Construction Foot coda optionality discrepancy

**Date:** 2026-11-13  
**Branch:** feat/v1-9-fixture-coverage-audit-2026-11-11  
**Canon effect:** none. **New vocabulary:** none.  
**Tests authored:** CON-FOOT-EVID-007 (authored-unverified). **Tests executed:** none.

## Finding

The supplied recovery matrices make materially different statements about the Foot coda:

- **Phase 5.15 Construction Contract Matrix:** Foot shape is CVC — frame consonant + parameter vowel + relation coda. It says the complete frame/coda inventory and productive semantics need the original v2.0 source.
- **Phase 5.16 Construction Recovery Matrix, C-02:** describes the Foot shape as frame + parameter vowel + **optional** relation coda.

These cannot be treated as identical rules. The evidence pack does not explain whether C-02 is shorthand for recognising a frame stem, an exception for a specific Foot class, or a revision of the CVC rule. There is insufficient evidence to choose.

## Current safe treatment

1. Preserve the six canonical CV forms as frame forms, not automatically complete Feet.
2. Preserve CVC as the primary structural statement from Phase 5.15.
3. Keep CVC input unresolved where coda membership and semantics cannot be validated.
4. Do not claim the coda is mandatory in every possible context until the Phase 5.16 optionality statement is reconciled.
5. Do not claim a bare CV is a complete Foot merely because C-02 uses optional-coda wording.
6. Require original v2.0 source recovery or explicit owner decision before changing the grammar contract.

## Implementation

Added `shapeEvidenceDiscrepancy` to `src/engine/constructionFootEvidence.ts`, surfaced the conflict in the Construction Studio, and added CON-FOOT-EVID-007. This is an evidence-status correction only; it does not change the shape recogniser or promote either interpretation to canon.

## Validation status

CON-FOOT-EVID-007 is authored-unverified. No local unit or browser tests were executed. The exact-commit Vercel preview is the remote deployment check; its outcome will be recorded in the continuity issue.

## Next

Recover underlying Phase 4 text/tests P4-T05/P4-T10 and original v2.0 morphology. Settle the conflict before implementing a strict full-Foot parser or generating a productive paradigm.
