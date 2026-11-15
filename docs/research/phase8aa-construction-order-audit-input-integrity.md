# Phase 8AA — Construction order audit input integrity

**Status:** Implementation hardening; evidence-bounded  
**Canon effect:** none  
**New vocabulary:** none  
**Grammar/signature effect:** none  
**Tests added:** CON-ORDER-007–009  
**Execution status:** authored-unverified until the repository test runner executes them

## 1. Existing contract

The recovered performed Construction order is:

1. reference
2. spatial-role/vector
3. Construction Feet
4. couplings
5. quantity
6. control
7. release

The existing order audit intentionally does not decide whether stages may be omitted, their cardinality, internal syntax, semantic interpretation, physical feasibility or execution. This increment does not change that boundary.

## 2. Defect found

The previous implementation accepted a statically typed array but silently ignored any runtime value that was not a member of the seven-stage registry. Consequently, malformed input such as `["reference", "invented-stage", "release"]` could be reported as `ORDER_CONSISTENT`. A non-array value supplied across an untyped boundary could also fail before a structured diagnostic was returned.

This was an input-integrity defect, not a language-rule ambiguity: the audit must not claim consistency when part of its input was not examined.

## 3. Change

The order audit now accepts an unknown runtime input and validates the outer collection and every stage value before making an ordering claim.

- Non-array input returns `INVALID_SEQUENCE` with `SEQUENCE_NOT_ARRAY`.
- An unrecognised stage returns `INVALID_SEQUENCE` with `UNKNOWN_STAGE` and its source index.
- Recognised out-of-order stages continue to return `STAGE_OUT_OF_ORDER`.
- When malformed and out-of-order values coexist, both diagnostics are retained.
- `ordered` is `null` when the sequence is invalid or insufficient; it is not falsely set to `true`.
- Repeated known stages remain allowed. No stage-cardinality rule has been invented.
- Empty and partial recognised sequences retain their previous interpretation; the audit does not infer mandatory stage presence.

The output's `stages` contains only recognised stage tokens. Consumers must use `status` and `issues` before treating that projection as an audited input.

## 4. Regression coverage

Added:
- CON-ORDER-007 — unknown runtime stage is not silently skipped.
- CON-ORDER-008 — non-array input returns a structured invalid result.
- CON-ORDER-009 — simultaneous order and unknown-stage defects remain visible.

All three are registered in `src/engine/testRegistry.ts` as `authored-unverified`. They have not yet been executed in this development session.

## 5. Canon and scope

No canon document, source lexicon, spoken form, Construction stage order, Foot inventory, coupling signature or macro signature is changed. This is a fail-closed implementation correction around the already recovered order. It does not make an order-consistent sequence a complete Construction or an executable operation.

## 6. Verification record

- Source branch: `feat/v1-9-fixture-coverage-audit-2026-11-11`
- Parent commit: `bbcced72fab93ce86905a96a3b80b1c96abad5ce`
- Build/test status at authoring: not run here.
- Vercel deployment status: pending exact-commit verification.
- GitHub Actions: no workflow dispatch or rerun requested.
