# Semantic Recovery Audit 01 — FRASHA and the runtime boundary

**Date:** 2026-10-15  
**Status:** Source-backed discrepancy; no implementation or canon change  
**Canon impact:** None.

## Finding

The searchable archive index includes the Phase 6J semantic registry, Phase 6K corrective validation report, and Phase 6L operator-contract registry. These historical records describe FRASHA as **negate**, while reporting that a Phase 6H evaluator implemented absolute value (`abs`). This is a concrete historical specification/implementation mismatch, but it does not establish what the current TypeScript workbench does.

Phase 6K records these reference-contract examples for unary arithmetic negation: `FRASHA(3) = -3`, `FRASHA(-3) = 3`, `FRASHA(0) = 0`, and `FRASHA(1.25) = -1.25`. Crucially, that report says it tested a reference contract function rather than the full parser/evaluator, and that the Phase 6H runtime was not present in the recovered working directory at that time. These historical tests do not prove that a current runtime implements the behaviour.

## Three concepts to keep separate

1. **Arithmetic unary negation:** changes a numeric quantity's sign.
2. **Negative numeral syntax:** FRASHA is also reported as a negative numeral sign, but the exact grammar distinction between a sign in a literal and an operator in an expression remains unresolved.
3. **Boolean logical NOT:** the recovered registry associates this with GRASH. Do not conflate it with arithmetic negation.

## Current implementation boundary

Before changing code, inspect the current repository for FRASHA in the lexicon, operator signature registry, expression parser, numeral parser, evaluator dispatch, unit/dimension handling, and tests. Record each path as implemented, absent, or provisional. Do not assume historical Phase 6H runtime code exists in the TypeScript workbench.

## Safe next-step criteria

After the controlling source and syntax distinction are resolved, any implementation task should test positive, negative, zero, and fractional values; unit/dimension preservation; invalid operand handling; negative numeral syntax separately; GRASH Boolean NOT separately; and parser-to-evaluator integration. Add stable test IDs and require current-run CI evidence. A standalone reference function is not enough.

## Related status conflicts

The Phase 6J/6K records also flag SHO (dimensionless numeral closure), METO and DOGU (block delimiters), and KOLE (UNTIL) as used by Phase 4 material while marked PROPOSED in the Phase 5 draft lexicon. These are version/status conflicts, not permission to promote prototype behaviour to canon.

## Decision

Record FRASHA as a high-priority semantic integration discrepancy. Do not patch current runtime or grammar from historical reports alone. First inventory current implementation paths, then establish the source-backed syntax contract and integration tests.