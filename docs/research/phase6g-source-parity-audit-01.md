# Phase 6G TypeScript Port — Source-Parity Audit 01

**Status:** source comparison completed; corrections committed; current automated execution remains unverified.  
**Canon effect:** none.  
**Compared sources:**
- Archived parser: `sources/archive-reports/phase-audit-extracts/arcane_phase6g_surface_parser.py.extracted.txt`
- Archived report: `sources/archive-reports/phase-audit-extracts/ARCANE_PHASE_6G_SURFACE_PARSER.md.extracted.txt`
- Source parser SHA-256: `c703697e792129b831cea16802342eba0add75ab8fbf4abd8c68805fffcaa77e`
- Source report SHA-256: `ceb521416330a43e54972a7b2ef7da8479b71d62ae976948bf6e60e588c1b702`

## Findings and decisions

| Area | Archived implementation | TypeScript port | Status / action |
|---|---|---|---|
| Head-initial, fixed-arity calls | Recursive descent using explicit arity table | Separate recursive-descent parser with an explicit arity table | Structurally aligned for the enabled subset; equivalence not yet executed |
| Numerals | Digit sequence, optional SHI fraction, unit terminator | Same basic structure, with structured decimal strings | Aligned in structure; numeric values intentionally remain strings until a decimal/runtime policy is chosen |
| SHO-closed identifiers | Digit sequence followed by SHO | Separate identifier AST node | Aligned in structure |
| Control blocks | BEK/ZET/KOLE with condition and METO…DOGU block | Same delimiters and block AST | Aligned for current provisional signatures |
| DRAS criterion | Audit-only LT/LE/EQ/NE/GE/GT token | Same audit-only criterion set | Aligned as prototype syntax only; not canonical vocabulary |
| Legacy aliases | Six explicit aliases plus lexicon-derived aliases from rename notes | Six explicit aliases only | Known gap: dynamic alias recovery from the lexicon CSV is not implemented |
| Lexical class | Loads consolidated lexicon and rejects unknown forms or disabled operator classes | Requires caller-supplied `knownAtoms`; no lexical-class metadata | Known gap: not a replacement for a lexicon-backed production parser |
| RE/RA ambiguity | Rejects standalone RE/RA and certain malformed numeral contexts; its current code can accept RE or RA in some numeral/unit positions | Now rejects RE anywhere in the digit sequence and RA as the unit because no slot-sensitive disambiguator exists | Deliberately conservative safety deviation; compare and document before calling this a faithful port |
| AST adapter | Not yet adapted to Phase 6E/6F evaluator AST | Not implemented | Must remain a separate integration gate |
| Semantic / physical validity | Not checked | Not checked | Correct scope boundary |

## Homophone policy clarification

The archived report says RE/RA ambiguity should fail closed where context is ambiguous, but the archived code's checks are narrower than that statement. The TypeScript port now rejects:
- a standalone `RE` or `RA`;
- a numeral containing `RE`;
- a numeral ending in `RA`.

This is intentionally stricter than the archived code in the last two cases. It is **not** a canon decision about whether those forms may ever be valid in a fully disambiguated slot. It is a temporary fail-closed policy until lexical slot rules are recovered.

The tests now include `RE MA` and `KI RA` as rejection cases. These checks have been authored, not yet confirmed by a completed current CI run.

## Remaining parity work

1. Add a lexicon adapter that accepts an explicit, versioned lexicon dataset and exposes all homophone and lexical-class records instead of only a list of atoms.
2. Recover dynamic alias rules from the source lexicon's rename notes, while keeping historical aliases opt-in and versioned.
3. Port the complete 19-case archived harness as a separate compatibility suite. Preserve the original input strings and expected outcomes, but label source-internal inconsistencies rather than forcing the TypeScript parser to mimic a defect silently.
4. Add nested-control and disabled-operator cases from the archived harness.
5. Run tests and build in CI; record exact commit, run URL, test totals and failures.
6. Only then add a separately tested AST adapter. Do not connect it to the evaluator merely because both sides expose tree-shaped values.

## Acceptance criteria

This port should not be called source-equivalent until every archived case is classified as:
- equivalent and passing;
- intentional documented deviation;
- blocked by missing lexicon/specification;
- or a defect with a linked correction.

A parser pass establishes only structural syntax for this provisional subset. It does not establish canonical grammar, type correctness, binding correctness, dimensional validity, conservation, mechanism completeness, feasibility or spell validity.
