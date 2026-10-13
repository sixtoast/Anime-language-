# Arcane Phase 5.7 — Grammar and Resolver Validation

**Status:** provisional reference-harness validation; canon unchanged  
**Run date:** 2026-10-12  
**Regression result:** 15/15 checks passed  
**Important boundary:** this is a small reference validator for the audit notation `OPERATOR⟨arguments⟩`, not a complete Arcane parser, compiler, or mana execution engine.

## 1. Purpose

Phase 5.7 moves from checking lexicon/alias tables to checking a narrow subset of operator-expression behavior. The harness checks alias normalization, fixed arity, coarse input types, nesting, malformed notation, and safe rejection of unknown signatures.

The audit notation with angle brackets and commas is temporary formal notation; it is not claimed to be ordinary spoken or written Arcane surface syntax.

## 2. Results

| Test category | Result |
|---|---:|
| Legacy aliases resolve to preferred operator heads | 6/6 relevant cases passed |
| Arity enforcement | 2/2 passed |
| Coarse type enforcement | 3/3 passed |
| Nested expression handling | 1/1 passed |
| Malformed syntax rejection | 1/1 passed |
| Unknown/incomplete signature rejection | 2/2 passed |
| **Total** | **15/15 passed** |

The exact run log is included as `Arcane_Phase_5_7_Test_Results.txt`.

## 3. Covered examples

- `FRATA⟨Q:length, Q:length⟩` resolves to the preferred head `FRAJA`.
- `FRAKA⟨Q:length, Q:time⟩` resolves to `FRAMA` and passes the broad Quantity type check. This does **not** assert that any particular units or semantic kinds are valid for multiplication.
- `DRIM⟨V:3d, V:3d⟩` resolves to `DRUM`; the Phase 4 D-017 rule is noted but its physical component formula is not executed by this harness.
- `GRAK⟨Boolean⟩` resolves to `GRASH`.
- `DRAL⟨Comparable, Comparable, Criterion⟩` resolves to `DRAS`; criterion semantics remain unresolved.
- Missing/excess arguments and incorrect broad types are rejected.
- A nested expression is accepted where the provisional signatures compose.
- `BEN⟨Q:length⟩` is rejected because no validated operator signature for BEN exists in this subset. The vocabulary item BEN is a renamed geometry/region lexeme, not thereby established as an operator.

## 4. What is established by this run

The included Python harness behaves as expected for its declared subset. The 15 regression checks were executed locally against the supplied harness and passed. This is reproducible evidence for the harness, not proof that a production Arcane parser exists.

## 5. What remains unverified

1. **Actual surface grammar:** spoken/written Arcane token boundaries, modifiers, scope, and ordinary examples are not parsed here.
2. **Dimensional analysis:** the broad `Quantity` label does not validate dimensions, units, semantic kinds, or conversion rules.
3. **Alias diagnostics:** a production parser should preserve each original source token and report both source spelling and normalized preferred form. This reference harness normalizes operator lookup but is not a complete source-span diagnostic system.
4. **DRUM physical direction:** D-017 is carried as a contract note; this harness does not compute frame transformations or independently reproduce P4-T16.
5. **DRAS criterion semantics:** the third argument is type-checked as `Criterion`, but criteria are not interpreted.
6. **KWASH timing:** evaluation is not executed; timing and side effects remain unresolved.
7. **BEN/REN:** rename resolution is a lexicon compatibility decision. A full formal signature for the region lexeme/constructor is not supplied by this harness.
8. **FRAPA arithmetic semantics:** arity and broad types can be checked, but dimension/semantic-kind compatibility remains incomplete.

## 6. Canon and decision handling

- No canonical specification is amended by this report.
- Phase 2 remains the formal signature baseline.
- Phase 4 renames and D-017 are retained as later reconciliation decisions.
- Historical forms remain aliases; examples in historical documents need not be rewritten.
- Proposed signatures remain provisional wherever the source audits label them provisional or unresolved.

## 7. Next recommended phase

**Phase 5.8 — Typed Quantity and Frame Semantics.** Extend the reference harness with structured quantity dimensions and semantic kinds, then test `FRAPA`, `FRAJA`, `FRAMA`, `DRAN`, `DREM`, and `DRUM`. Add explicit source-token spans and diagnostic output. Keep full surface grammar implementation separate until grouping, modifier attachment, and spoken boundary rules are source-backed.
