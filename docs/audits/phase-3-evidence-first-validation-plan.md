# Phase 3 — Evidence-First Language Validation Plan

**Status:** PROPOSED IMPLEMENTATION PLAN  
**Scope:** Make the existing Phase 2 audit-notation playground more useful without presenting provisional notation as canonical Arcane.  
**Authority:** `docs/canon/arcane-language-v3.0-L.md`, `docs/canon/magic-system-v3.0.md`, and `docs/audits/continuity-recovery-and-test-register.md`.  
**Important:** This document is not a language-canon amendment. No unresolved grammar or operator signature becomes canon by being implemented.

## 1. Phase objective

The next increment should turn the current parser slice into an auditable validation workflow. A user should be able to tell, for every result:

1. what input was examined;
2. which notation profile was selected;
3. which rules were applied and where those rules came from;
4. whether a finding is a parse result, a type/semantic result, a physical-feasibility result, or simply an unresolved question;
5. which tests support the behaviour.

Do not expand the accepted language surface until the existing slice has repeatable, recorded evidence.

## 2. Required result model

Represent each validation run with a stable, serialisable result. Field names below are proposals for the implementation contract, not Arcane syntax.

- `profileId`: explicit profile identifier, initially `phase-2-audit-notation`.
- `input`: exact source text, preserved without silent normalisation.
- `status`: `pass`, `fail`, or `incomplete`.
- `stage`: `lexing`, `parsing`, `typing`, `semantics`, `feasibility`, or `not-run`.
- `diagnostics`: stable diagnostic code, severity, message, and source span where available.
- `ruleRefs`: IDs of catalogue entries used to reach the result.
- `assumptions`: explicit assumptions required for interpretation.
- `unvalidatedStages`: stages not executed by this profile.
- `engineVersion`: version or commit identifier for reproducibility.

A successful parse must never be displayed as proof that an expression is well-typed, semantically valid, physically feasible, or executable.

## 3. Profile boundaries

### Profile A — Phase 2 audit notation

- Accept only the syntax explicitly implemented by the current provisional parser.
- Label all parse output as audit notation.
- Keep parse errors separate from unimplemented-feature diagnostics.
- Do not infer canonical spoken boundaries, pronunciation, or morphology.
- Do not claim dimensional type checking or spell execution.

### Profile B — Canonical Arcane

- Keep unavailable until the canonical surface grammar, grouping, attachment, modifier scope, and operator signatures are sufficiently specified and tested.
- Do not route canonical user input through Profile A silently.
- When selected but unavailable, explain which specification gaps block validation rather than guessing.

## 4. Diagnostic contract

Diagnostics should be stable enough for tests and the interface to depend on their codes, not on exact prose.

| Code | Meaning | Expected behaviour |
|---|---|---|
| `PARSE_UNEXPECTED_TOKEN` | Token cannot occur at this point | Fail parsing; show source span if known |
| `PARSE_MISSING_ARGUMENT` | Required argument absent | Fail parsing; never fill it with a guessed value |
| `PARSE_EXTRA_ARGUMENT` | More arguments than the declared profile permits | Fail parsing |
| `PARSE_AMBIGUOUS` | More than one valid interpretation remains | Fail closed; show alternatives only if available |
| `PROFILE_UNSUPPORTED` | Input/profile feature is not implemented | Mark incomplete, not valid |
| `RULE_UNRESOLVED` | A needed rule is not established by the sources | Mark incomplete and link the open question |
| `TYPE_NOT_IMPLEMENTED` | Parser succeeded but type checking is not available | Do not imply type safety |
| `FEASIBILITY_NOT_IMPLEMENTED` | Physical feasibility was not evaluated | Do not imply spell feasibility |

The engine may use different internal names if equivalent stable codes and meanings are documented.

## 5. Regression tests to prioritise

These tests extend the recovery register; they do not replace its 16 design-level tests. The following are acceptance targets, not claimed results.

| ID | Scenario | Acceptance criterion |
|---|---|---|
| P3-001 | Empty input | Deterministic diagnostic; no crash |
| P3-002 | Whitespace-only input | Same documented behaviour on every run |
| P3-003 | Missing required argument | Rejected with stable code |
| P3-004 | Extra argument | Rejected unless profile explicitly defines it |
| P3-005 | Nested expression | Parse tree preserves grouping |
| P3-006 | Operand order | Reordering operands changes the tree where order is significant |
| P3-007 | Ambiguous attachment | Rejected rather than guessed |
| P3-008 | Unknown operator | Rejected or marked unsupported; never silently accepted |
| P3-009 | Canonical profile unavailable | Clear incomplete result; no fallback to audit notation |
| P3-010 | Parse-only success | Result explicitly lists typing, semantics, and feasibility as unvalidated |
| P3-011 | Source span | Error points to the relevant input region when the parser can determine it |
| P3-012 | Determinism | Same input + profile + engine version produces the same structured result |
| P3-013 | Serialisation | Result can be JSON-serialised and deserialised without losing diagnostics or rule references |
| P3-014 | Rule trace | Every rule-dependent result references known catalogue IDs |
| P3-015 | UI parity | Playground renders the same status and diagnostic codes as the engine result |
| P3-016 | Regression fixture | Existing passing fixtures remain unchanged unless a reviewed decision explains the change |

For every test, record the command, date or CI run, result, and relevant commit. A test definition is not evidence of execution.

## 6. Rule catalogue requirements

Each rule entry should carry:

- a stable rule ID;
- concise statement of the rule;
- status: `canon`, `proposal`, `unresolved`, or `implementation-only`;
- source document and section;
- implementation status;
- tests that exercise it;
- known limitations and linked decision-register IDs.

A catalogue entry marked `proposal` or `unresolved` must not be represented in the UI as canonical. Missing source references should be visible as missing evidence, not replaced with fabricated citations.

## 7. Playground behaviour

- Make the selected profile visible beside the editor and in exported results.
- Separate **Parse**, **Type check**, **Semantic validation**, and **Feasibility** states. Disable or mark unavailable any stage not implemented.
- Show parse tree and diagnostics only when the engine provides them.
- Provide a copyable structured result for bug reports.
- Include a short notice: “A successful parse is not proof of a valid or feasible spell.”
- Preserve input when changing tabs or inspecting diagnostics.
- Never silently rewrite the user's input to make it parse.

## 8. Completion gate

Phase 3 is complete only when all of the following are evidenced:

- [ ] The engine and UI share one structured result contract.
- [ ] Profile selection is explicit and visible.
- [ ] The regression cases above are implemented where applicable.
- [ ] Automated tests have actually run and their output is recorded in CI or an equivalent reproducible log.
- [ ] The production build has completed successfully.
- [ ] The README accurately reports test/build status.
- [ ] No canonical-language, type-safety, feasibility, or execution claim exceeds the implemented evidence.
- [ ] Any newly discovered language-design question is added to the decision ledger instead of being silently settled in code.

## 9. Out of scope

This phase must not invent missing morphology, resolve the KREN/TRAK/FREM/SHREN/BRAN/VARE cross-specification gap, define undocumented temporal operators, claim numeric physical feasibility, or implement spell execution. Those require source recovery and explicit design decisions before implementation.

## 10. Handoff

Start by inspecting the existing parser, rule catalogue, playground, and tests. Map current behaviour against this plan; implement the smallest missing vertical slice, then run the test suite and production build. Update this document and the README with observed results only. If the current code already satisfies a requirement, preserve it and record the evidence rather than rewriting it.
