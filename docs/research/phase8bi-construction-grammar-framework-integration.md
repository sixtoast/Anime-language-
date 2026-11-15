# Phase 8BI — Construction grammar framework integration

**Date:** 2026-11-14  
**Canon effect:** none. **Grammar changes:** none.  
**Tests authored:** no new test cases. Existing Phase 8BH five-case suite remains authored-unverified.

## Purpose

Phase 8BH introduced an explicit evidence model for the interaction between reference persistence and the phrase separator in the Phase 5.22 fixture. Phase 8BI connects that model to the actual Construction workspace so the limitation is visible where a user inspects a reference binding.

## Language framework

The seven performed stages remain:

1. Reference
2. Spatial role / vector
3. Construction Feet
4. Couplings
5. Quantity
6. Control
7. Release

The historical source establishes six adjacent PRECEDES relations only. It does not establish data dependencies, stage cardinality, optionality, required inputs/outputs, or a general executable grammar. Existing stage contract profiles retain the distinction between partial evidence, provisional glosses, order-only stages and example-only evidence.

The reference interaction review now makes the boundary explicit:
- no replacement: apply recovered UNTIL-REPLACED persistence;
- valid replacement: apply the recovered replacement behaviour;
- phrase boundary: preserve the current binding only as an inspection state and return UNRESOLVED for grammatical effect;
- no punctuation-driven scope reset or implicit reference creation.

The Playground now displays this result immediately beneath the reference context. It is not wired into the spoken parser or any execution path.

## Important repository correction

A source re-read found that the missing comma between SRC-COMP-002 and CON-BOUND-001 still remained in `testRegistry.ts` after the previous correction was attempted. Phase 8BI fixes the actual array separator and registers CON-REF-BOUND-001/002. This is recorded transparently; no TypeScript build is claimed.

## Outstanding language work

The next grammar work should recover interfaces from source rather than guess them. Each of the six stage boundaries needs evidence for: accepted input type, produced output type, attachment target, multiplicity, omission/requiredness, failure behaviour and version provenance. Until these fields are supported, the stage graph remains a precedence map, not a data-flow graph.

The CVC / optional-coda discrepancy, provisional parameter vowels, provisional H-series domain mappings, incomplete relation-coda inventory and unresolved K-series macro contracts remain open.
