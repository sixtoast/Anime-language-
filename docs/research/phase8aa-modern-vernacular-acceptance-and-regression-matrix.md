# Arcane Phase 8AA — Modern Vernacular v1.0 acceptance and regression matrix

**Status:** Implementation-ready test specification; not a claim that tests have been implemented or executed  
**Date:** 2026-10-18  
**Authority:** `docs/canon/arcane-modern-vernacular-v1.0-locked-core.md`  
**Canon effect:** none  
**New vocabulary:** none  
**Runtime changes:** none  
**Tests executed by this document:** none

## 1. Why this phase exists

The Modern Vernacular v1.0 locked core already defines a deliberately narrow grammar. The next useful step is not to expand the grammar or create more free-form dialogue. It is to turn each locked rule and each explicit boundary into a repeatable acceptance suite so that future teaching tools, documentation, or a parser can be checked against the same contract.

This matrix is subordinate to the locked core. If a row here appears to conflict with that file, the locked core wins and the discrepancy must be recorded rather than silently resolved.

## 2. Scope and notation

The suite covers only the v1.0 core:

- two overt participants in the bounded `wish` (“see”) frame;
- participant-slot questions using `shuk` and `zosh`;
- simple polar questions using clause-final `pun`;
- simple preverbal clause negation using `nava`;
- standalone responses `wang`, `kor`, and `gep`;
- explicit rejection of unsupported constructions.

These examples are **Modern Vernacular design canon**, not evidence of historical Arcane. This is a semantic/grammar acceptance matrix, not a claim that a surface parser currently implements these rules.

## 3. Positive acceptance fixtures

| ID | Input | Expected interpretation | Contract |
|---|---|---|---|
| MV1-P01 | `teshi wish fezo` | The person sees the friend. | A is perceiver; B is perceived entity. |
| MV1-P02 | `fezo wish teshi` | The friend sees the person. | Reversing participants reverses their roles. |
| MV1-P03 | `shuk wish fezo` | Who sees the friend? | `shuk` replaces participant A. |
| MV1-P04 | `teshi wish zosh` | What does the person see? | `zosh` replaces participant B. |
| MV1-P05 | `teshi wish fezo pun` | Does the person see the friend? | `pun` marks the supported simple polar question. |
| MV1-P06 | `teshi nava wish fezo` | The person does not see the friend. | `nava` immediately precedes `wish`. |
| MV1-P07 | `fezo nava wish teshi` | The friend does not see the person. | Negation and participant roles remain distinct. |
| MV1-P08 | `wang` | Yes. | Standalone response only. |
| MV1-P09 | `kor` | No. | Standalone response only; not a clause negator. |
| MV1-P10 | `gep` | Maybe. | Standalone uncertainty response only. |

## 4. Required rejection or blocked fixtures

A conforming implementation or teaching validator must not guess a meaning for these cases. If it has no validator yet, these rows remain authored requirements rather than executed tests.

| ID | Input | Expected status | Reason |
|---|---|---|---|
| MV1-N01 | `teshi nava wish fezo pun` | BLOCKED | Negative polar questions are outside v1.0. |
| MV1-N02 | `shuk wish fezo pun` | BLOCKED | Information questions cannot combine with `pun` in v1.0. |
| MV1-N03 | `teshi nava wish zosh` | BLOCKED | Negation plus an information question has unresolved scope. |
| MV1-N04 | `teshi nava fam wish fezo` | BLOCKED | Negation with ability/modality is outside v1.0. |
| MV1-N05 | `kor wish fezo` | REJECTED | `kor` is not a clause-negation operator. |
| MV1-N06 | `teshi wish fezo wish teshi` | BLOCKED | Multi-clause/sequenced predicate construction is not defined by this core. |
| MV1-N07 | `teshi nava zir fezo` | BLOCKED | The `zir` argument frame is not specified by the locked core. |
| MV1-N08 | `teshi wish fezo nava` | REJECTED | Clause-final `nava` violates the locked preverbal pattern. |
| MV1-N09 | `GRASH wish fezo` | REJECTED | Formal operator syntax cannot be substituted into the Vernacular template. |
| MV1-N10 | `teshi wish zosh pun` | BLOCKED | Information question plus polar particle is explicitly out of scope. |

The exact diagnostic category is an implementation decision unless a separate runtime contract defines one. Do not report a parser error code as implemented merely because this matrix names an expected outcome.

## 5. Semantic contrast tests

These pairs are essential because surface similarity must not collapse distinct meanings.

| ID | Contrast | Expected distinction |
|---|---|---|
| MV1-C01 | `teshi wish fezo` / `fezo wish teshi` | Agent/perceiver and theme/perceived participant reverse. |
| MV1-C02 | `kor` / `teshi nava wish fezo` | Negative response vs negative proposition. |
| MV1-C03 | `teshi nava wish fezo` / intended “the person cannot see the friend” | Simple negation does not encode inability. |
| MV1-C04 | `teshi nava wish fezo` / intended “the person must not see the friend” | Simple negation does not encode prohibition. |
| MV1-C05 | `teshi nava wish fezo` / intended “the person does not always see the friend” | Simple negation does not encode frequency scope. |
| MV1-C06 | `teshi wish fezo pun` / `teshi nava wish fezo pun` | The first is supported; the second is blocked, not interpreted by analogy. |
| MV1-C07 | `shuk wish fezo` / `teshi wish zosh` | Question word identifies which participant slot is unknown. |
| MV1-C08 | Modern Vernacular `nava` / Formal `GRASH` or historical alias `GRAK` | Register and operator contracts remain separate. |

## 6. Fixture metadata contract

When these cases are converted into machine-readable fixtures, each record should include:

- a stable `id`;
- `grammarVersion`: `MODERN-VERNACULAR-1.0`;
- `notation`: `CANONICAL-SURFACE` only for forms explicitly established by the locked design specification;
- `input`;
- `expectedStatus`: one of `ACCEPT`, `REJECT`, or `BLOCKED`;
- `expectedMeaning` only when the core defines one;
- `ruleRefs` pointing to the relevant section/rule in the locked core;
- `evidenceStatus`: `LOCKED-DESIGN`, not `HISTORICAL-SOURCE`;
- `executionStatus`: initially `NOT-RUN`, changed only by a real test run;
- optional `diagnosticCategory` only when the implementation has a stable, tested diagnostic contract.

A blocked case is not interchangeable with a malformed input: it may be well-formed under a larger possible grammar, but the v1.0 core does not license an interpretation. Keep that distinction in reports.

## 7. Implementation order

1. Audit the existing fixture schema and test registry before adding duplicate formats.
2. Add the positive and rejection rows to the existing test infrastructure if it can represent the status distinctions without distortion.
3. If the current schema cannot represent `BLOCKED`, extend it deliberately and test the display/counting logic; do not map `BLOCKED` to pass or fail.
4. Keep this grammar suite separate from the existing Phase 2 audit parser and Phase 6G surface-parser prototype unless their documented version contracts explicitly support Modern Vernacular v1.0.
5. Run focused unit tests, the complete test suite, type-check, production build, and browser acceptance checks.
6. Record exact commands, run URL/commit, exit codes, and step-level results. Until these exist, execution status remains `NOT-RUN`.

## 8. Release and change-control gates

Do not mark the Modern Vernacular core as parser-implemented based on documentation alone. Do not promote proposed v5 lexicon entries beyond the locked subset. Do not add new verbs, question combinations, modal constructions, or temporal/spatial adjunct rules in this phase.

Any future amendment must follow the locked core's amendment policy: identify the failure or new evidence, version the decision, show old and new behaviour, check lexical/register collisions, and update both positive and negative regression fixtures.

## 9. Exit criteria

This phase is ready to be considered implemented only when:

- all positive fixtures have executable assertions;
- all blocked/rejected fixtures assert their intended status distinctly;
- the validator does not silently reinterpret unsupported constructions;
- the website clearly separates authored fixtures from executed results;
- unit tests, type-check, build, and browser acceptance outcomes are recorded from a real run;
- no Formal Arcane or historical claim has been inferred from this modern design subset.

**Current outcome:** specification and acceptance matrix authored; runtime integration and test execution remain outstanding.
