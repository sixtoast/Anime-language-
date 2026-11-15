# Phase 8BT — Position and displacement relation contracts

**Date:** 2026-11-14  
**Status:** Bounded mathematical contract proposal; not Arcane grammar  
**Canon effect:** NONE. **New vocabulary:** none.  
**Tests authored:** 13. **Tests executed locally:** not executed.

## 1. Source-recovery gate

Phase 8U requires primary Phase 4 DOCX recovery before historical spatial signatures are settled. The binary source exists at `sources/originals/Arcane_Language_Audit_Phase_4.docx`; Phase 8AP added `tools/extract_docx_structure.py`. The connected GitHub reader cannot inspect this binary and this environment has no local repository checkout or execution path for that script. The Phase 4 DOCX is therefore still not fully inspected. No claim is made that missing PO/FO/LO or relation signatures have been recovered.

This phase is not another inventory. It is a bounded, owner-reviewable mathematical proposal for two elementary typed relationships.

## 2. Concepts kept distinct

- Position: a point/location relative to a coordinate frame and origin/reference.
- Displacement: a difference between two positions.
- Velocity: rate of displacement over time; it is not accepted as displacement.
- Spatial relation: JO/JUR/JA/JE/JI; exact signatures remain unrecovered.
- Role: PO/FO/LO are lexicon role labels, but their full signatures and relationship to v3.0-L relations remain unrecovered.

These English labels are research metalanguage, not Arcane type constructors.

## 3. Candidate contracts

### A — position difference

`difference(source, destination) -> DisplacementVector`, with `D = destination - source`.

The proposal requires both positions to pass the Phase 8BS validator, share a concrete frame identity, coordinate convention and origin/reference identity, and have matching component dimensions and unit labels. Unit conversion is not implemented. Non-finite results are rejected.

Different frames/origins or incompatible unit labels are blocked for lack of a transformation/conversion contract. Malformed records are rejected by the explicit proposal validator.

### B — position translation

`translate(position, displacement) -> SpatialPosition`, with `P_new = P + D`.

The position and displacement must pass their Phase 8BS validators, share frame identity and coordinate convention, and have matching component dimensions and unit labels. Velocity and force are not silently coerced to displacement. The output retains the position's origin/reference identity as proposal bookkeeping, not as a recovered Arcane binding rule.

### C — position plus position

No operation is defined in this profile. The result is `BLOCKED_BY_MISSING_CONTRACT`, not a canonically invalid expression. No source-backed prohibition has been recovered.

## 4. Why frame and origin are both checked

Frame identity identifies the coordinate system in which components are interpreted. Origin/reference identity identifies the zero/reference point for position coordinates. The conservative proposal requires both to match for direct subtraction. It does not assert that distinct origins can never be related; it says the current tool has no transform contract to reconcile them.

## 5. Relation and role forms remain separate

The v3.0-L relation inventory contains JO (toward), JUR (away), JA (along), JE (parallel), and JI (aligned/coincident). The v5 draft lexicon records PO (position role), FO (direction role), and LO (movement role). The Phase 8S recommendation is to keep role, relation and value separate in neutral bookkeeping.

Phase 8BT does not assign subtraction or translation to any of these forms:
- subtraction is not assigned to JUR;
- translation is not assigned to LO;
- direction is not equated with displacement;
- position arithmetic does not prove movement or arrival;
- no surface order, arity or argument syntax is introduced.

## 6. Implementation

Added `src/engine/spatialPositionRelations.ts` and its test file. Updated Construction Studio with the three candidate contracts and their fixture outcomes. Registered 13 cases as `POSITION-REL-001–013` in the Test Suite.

The module is proposal-only: it does not parse expressions, invoke Arcane operators, transform frames/origins, or model physical effects.

## 7. Verification and next action

Thirteen Vitest cases are authored but not executed locally. No GitHub Actions workflow was dispatched because the Actions budget is exhausted. The next step is to run the DOCX extraction utility in a local Python environment, review its full paragraph/table output and source hash, and only then resume historical PO/FO/LO and relation-contract decisions. Do not add more position/relation operation families before that primary-source gate is satisfied.
