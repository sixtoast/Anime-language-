# FRASHA Current Workbench Implementation Inventory

**Date:** 2026-10-15  
**Branch:** `work/cockpit-evidence-aware-next-task`  
**Status:** Static source inspection; tests/CI not yet confirmed for this revision  
**Canon impact:** None.

## Findings from current TypeScript sources

| Layer | Observed behaviour | Boundary |
|---|---|---|
| Operator contract metadata | `FRASHA` is listed with the provisional Phase 2 unary arity and label `negate`. The evaluation rule now links the historical mismatch audit and explicitly remains non-executable. | Metadata is not an evaluator or an approval of complete semantics. |
| Phase 2 audit parser | `parseAuditExpression("FRASHA⟨KI⟩")` returns a call AST with one symbol argument. | This validates provisional grouping/arity only; it does not compute a numeric result. |
| Phase 6G surface parser | `FRASHA` appears in the operator arity table with arity one. Digit-led numerals are parsed through a separate numeral path. There is no sign-handling branch in `parseNumeral()`; FRASHA is therefore not implemented there as a negative-literal prefix. | The parser is explicitly a provisional prototype subset, not the canonical language parser. |
| Surface numeral ambiguity | The parser deliberately rejects numeral uses containing `RE` or unit `RA` with `AMBIGUOUS_HOMOPHONE`, because it has no slot-sensitive policy. | Safe rejection is preferable to invented disambiguation, but this remains a usability limitation. |
| Evaluator / execution | The inspected files provide AST construction and operator metadata; they do not establish a current integrated FRASHA evaluator. | Record integrated evaluation as **not established by inspected sources**, not as a proven absence across the entire repository. |

## Resulting conclusion

The current inspected code supports a limited claim: **FRASHA can be represented as a provisional unary operator in parser output, but the inspected parser and metadata do not demonstrate evaluation as arithmetic negation.** The Phase 6K examples remain reference-contract evidence only.

The current Phase 6G parser also does not implement FRASHA as a negative numeral sign inside its numeral routine. That is an implementation observation about this prototype, not a decision that canonical Arcane must use a different syntax.

## Guard added

The operator-contract test suite now includes:

- `OPC-009`: historical mismatch and numeral-sign uncertainty remain visible in metadata.
- `OPC-010`: the Phase 2 parser returns an FRASHA call AST, not a computed numeric value.

Both IDs are registered in `src/engine/testRegistry.ts`. These tests are intended to preserve the implementation boundary, not define FRASHA's final semantics.

## Next decision gates

1. Recover the controlling source for FRASHA's operator meaning and negative-literal syntax.
2. Establish whether a current integrated evaluator exists elsewhere in the repository before describing evaluation as absent.
3. If evaluation is later authorised, test parser-to-evaluator integration, signed numeric values, zero, fractional values, unit preservation, and invalid operand handling.
4. Keep Boolean NOT (`GRASH`) independently specified and tested.
5. Require a successful current-head CI run before marking these new tests verified.
