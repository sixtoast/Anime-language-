# Phase 8DF — Fixed-arity and nested-expression evidence

**Status:** Cross-phase grammar reconciliation. **Canon effect:** NONE. **Parser:** unchanged. **Execution:** disabled. **Tests:** 14 authored and registered; not executed locally.

## 1. Current Formal Arcane structure

Arcane Language v3.0-L §2 establishes head-initial expression order: HEAD + ARGUMENTS + MODIFIERS. It also says core operators have fixed argument counts and that precedence must not be relied upon to resolve grouping. Its examples describe ADD(A,B), NEGATE(A) and COMPARE(A,B,R), supporting the illustrative counts 2, 1 and 3 respectively.

This is a structural principle, not a complete operator registry. It does not specify every operator's arity, typed signature, spoken argument boundary, nested-expression encoding or modifier attachment.

## 2. Historical Phase 4 grammar rules

Phase 4 §6 G-1 is explicit: every head has one arity and a typed signature, and argument boundaries need no separator. G-3 says there are no optional arguments; defaults may come only from context bindings in scope, and missing required context is a static rejection.

These are historical Formal grammar rules. They support the principle that an expression reader must know each head's arity and must not guess omitted arguments. They do not, by themselves, provide the full current v3.0-L operator signature table.

## 3. Historical numeral-boundary tests

Phase 4 §10 Table 15 supplies concrete boundary fixtures:

- P4-T11: FRAPA KI DL TO MU DL → exactly one parse, arguments 1 and 23.
- P4-T12: FRAPA KI TO DL MU DL → exactly one parse, arguments 12 and 3.
- P4-T13: FRAPA KI TO MU → no parse because the numeral is unterminated.
- P4-T14a/b/c: a plain numeral did not fill the identifier slot; a distinct identifier rule was added and the identifier examples then parsed.

The two FRAPA fixtures demonstrate how unit closure plus known fixed arity can segment adjacent numeric arguments without commas in that historical profile. They do not establish DL as a spoken lexical form. Phase 4 G-2/D-019 says SHO, while the test strings display DL; the mismatch remains recorded in Phase 8DE.

## 4. Nested expression notation in Phase 2

Phase 2 §1 proposes an abstract representation such as FRAPA⟨KI, FRAPA⟨TO, MU⟩⟩. Its angle brackets and commas are expressly audit notation, not established Arcane words. Phase 2 §2 lists proposed arities and types, but the document labels itself provisional and says it does not overwrite canon. Its tests are largely design-level expectations, not compiler-executed results.

The nested example proves that the project has a proposed abstract tree representation. It does not recover how the same nesting is spoken or written in the current language.

## 5. What a correct reader must eventually do

A reader for the approved language will need, at minimum:

1. A source-approved operator registry with fixed arity and argument types.
2. A numeral reader that recognises digit sequences, decimal/negative markers and approved unit closure.
3. A distinct identifier reader, once its current surface form is approved.
4. Recursive expression parsing: each operator consumes exactly its required arguments, and each argument may itself be an expression.
5. A modifier-scope rule that distinguishes modifiers of an outer expression from modifiers of nested arguments.
6. Rejection of missing arguments, extra top-level expressions, invalid boundaries and missing required context.

This is a requirements list, not an assertion that all six rules have been canonically specified.

## 6. Present readiness

**Recovered:** head-initial order; fixed-arity principle; no optional arguments in the historical grammar; unit-closed numeric boundaries in historical fixtures; identifier slot distinguished from ordinary quantity; a provisional abstract nested-tree notation.

**Not recovered:** complete current operator arity/type table; current spoken nested-expression syntax; current identifier closure spelling; binding signatures; modifier attachment and grouping in nested spoken expressions.

The Phase 6G parser demonstrates a provisional recursive implementation for a subset. Its arity table, identifier SHO closure and legacy aliases are not a substitute for current canon. This phase does not modify that parser.

Fourteen tests are authored and registered; they check the evidence ledger and non-promotion boundaries. They have not been executed locally.
