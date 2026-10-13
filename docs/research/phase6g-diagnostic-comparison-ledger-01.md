# Phase 6G diagnostic-family comparison ledger

**Status:** comparison logic and regression tests authored; execution against current CI is unverified  
**Canon effect:** none  
**Scope:** current provisional TypeScript surface parser only

## Why this ledger exists

The recovered 16-case Phase 6G fixture suite contains two distinct kinds of comparison:

1. **Syntax comparison** — whether the current parser's accept/reject result and, where declared, root AST node match a directly comparable expectation.
2. **Diagnostic-family comparison** — whether a current diagnostic matches an explicitly mapped historical error family.

These must remain separate. A diagnostic can match the expected family while the wider expression remains provisional, context-dependent, semantically unchecked, or non-canonical.

## Explicit historical family mappings

| Historical fixture label | Current TypeScript diagnostic |
| --- | --- |
| `unterminated-numeral` | `UNTERMINATED_NUMERAL` |
| `malformed-decimal` | `MALFORMED_DECIMAL` |
| `identifier-not-closed` | `IDENTIFIER_NOT_CLOSED` |
| `missing-block-open` | `MISSING_BLOCK_OPEN` |
| `missing-block-close` | `MISSING_BLOCK_CLOSE` |
| `homophone-ambiguity` | `AMBIGUOUS_HOMOPHONE` (except known historical implementation divergences below) |
| `unresolved-operator-signature` | `UNRESOLVED_OPERATOR` |
| `delimiter-outside-control` | `BLOCK_DELIMITER_OUTSIDE_CONTROL` |

The identifier-slot rejection uses the separate KWAT-wrapped probe's diagnostics because the fixture's unwrapped input is not itself a test of that argument slot. The source fixture remains unchanged and its main comparison remains context-dependent.

### Known discrepancy: RE/RA homophone fixtures

The archived Python implementation's `numeral()` accepts `RE MA` as a closed numeral (RE is consumed as digit 4, then MA is accepted as the unit) and accepts `KI RA` as a closed numeral (RA is in its unit set). The report prose and the recovered fixture labels instead describe these as ambiguous contexts that should fail closed unless context resolves them. The current TypeScript parser intentionally rejects both forms.

Consequently, fixtures `P6G-FX-011` and `P6G-FX-012` are marked `not-comparable` for historical diagnostic-family comparison. Their TypeScript diagnostics match the prose-level expectation, but they do **not** match the archived Python executable behaviour. This is a source/prototype discrepancy to investigate, not a TypeScript pass or failure against the historical implementation. The fixture records are preserved unchanged.

Mappings are intentionally exact and narrow. No fuzzy matching, substring matching, or inferred equivalence is used. If a historical family has no explicit mapping, the audit reports `not-comparable`.

## Summary fields

The fixture audit reports these independent metrics:

- `directlyComparable`, `directMatches`, `directMismatches`: only direct syntax comparisons.
- `nonDirectComparisons`: conditional, context-dependent, and scope-guardrail observations.
- `diagnosticFamilyMatches`, `diagnosticFamilyMismatches`, `diagnosticFamiliesNotComparable`: only explicit diagnostic-family comparisons.

The counts can coincide by chance; they do not represent the same evidence. Neither metric is a substitute for running the automated test suite.

## Regression coverage authored

- Each recovered stable fixture ID produces one observation.
- Expected root AST kinds are checked for directly accepted fixtures.
- The identifier-slot probe records its child node and diagnostic codes without altering the fixture input.
- Historical diagnostic mappings are checked for fixture IDs P6G-FX-003, 004, 006, 009, 010, 013 and 015. P6G-FX-011 and 012 are explicitly not-comparable because the archived Python implementation accepts those numeral/unit combinations despite the prose-level ambiguity expectation.
- An intentionally unmapped family must be reported as `not-comparable`.
- A separate summary assertion ensures diagnostic-family counts are not treated as syntax comparison counts.
- Control-block structure is recorded without approving its signature.
- Alias normalisation is enabled only for the explicitly historical alias fixture.

## Known limitations and next actions

1. The test assertions are authored but have not been confirmed by a fresh CI run for the latest commits.
2. The archived Python prototype is historical evidence. A proper cross-implementation ledger still needs the relevant archived case-level outputs, not just the reported aggregate test count.
3. The current harness reports observations at runtime; it does not persist a machine-readable baseline artifact with commit SHA and parser version.
4. The audit does not type-check, evaluate, account for mana/resources, establish mechanisms, or assess physical feasibility.
5. A future comparison artifact should record fixture ID, source evidence, expected behaviour, current TypeScript output, historical Python output where available, AST shape, diagnostic comparison, commit SHA, and an explicit unresolved reason.

No canonical grammar, lexicon entry, alias policy, operator signature, or spell semantics are changed by this work.
