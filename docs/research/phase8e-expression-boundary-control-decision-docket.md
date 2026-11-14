# Arcane Phase 8E — expression boundary and control-block decision docket

**Status:** Decision docket; recommendations are proposals, not canon  
**Date:** 2026-10-15  
**Canon effect:** none  
**New forms:** 0  
**Tests executed:** none

## 1. Objective

This docket converts the Phase 8B–8D findings into a short list of decisions that directly unblock nested formal constructions. It does not attempt to redesign the language's entire control system.

The canonical requirements are: one recoverable parse; head-initial surface structure; no unapproved dependence on precedence; and a distinct spell-representation layer. The available evidence does not yet establish the full mapping between surface argument boundaries and spell CONTROL structure.

## 2. Decisions ranked by dependency

### D1 — Declare which notation a fixture uses

**Problem:** The same visual string may be interpreted under the Phase 2 abstract audit grammar or the Phase 6G whitespace-tokenised prototype grammar.

**Recommendation:** Every fixture must declare one of:
- `P2-AUDIT`: angle-bracket abstract operator notation;
- `P6G-SURFACE-PROTOTYPE`: whitespace-tokenised prototype surface notation;
- `CANONICAL-SURFACE`: only when a canonical source actually establishes the form.

Never compare a parse result from one notation as if it validated another.

**Gate:** Documentation and traceability can adopt this immediately without altering canon or code.

### D2 — Decide expression boundary policy for fixed-arity calls

**Evidence:** Canon requires a uniquely recoverable parse; the prototype recursively consumes registered argument counts. This is a plausible implementation strategy, but it does not itself define all surface grammar cases.

**Recommendation:** For the prototype only, continue to parse known fixed-arity operators recursively and reject unknown/incomplete operators. Do not infer a missing argument from later tokens and do not add precedence-based recovery.

**Unresolved:** Whether this strategy is the complete canonical surface rule, especially for modifiers, variable-arity constructs, and historical forms.

### D3 — Decide whether SHO closes identifiers

**Evidence:** SHO is PROPOSED as a dimensionless-unit terminator in the v5 lexicon. Its use as an identifier terminator is found in prototype code/tests, not established in the inspected canonical spec.

**Recommendation:** Keep identifier closure as a versioned prototype convention. Do not promote it to canon without a primary-source passage or explicit language-design approval.

**Unresolved:** If accepted, define how the grammar distinguishes identifier context from numeral context and whether other identifier forms exist.

### D4 — Decide status of METO/DOGU

**Evidence:** Both are marked PROPOSED in the v5 lexicon; the prototype uses them as block delimiters.

**Recommendation:** Retain as provisional block delimiters for parser experiments, not canonical tokens.

**Minimum eventual block contract:**
- owning control operator;
- condition/parameter boundary;
- body starts and ends;
- empty body permitted or forbidden;
- one or multiple body expressions;
- nesting and matching closure;
- error behaviour for missing/misplaced delimiters;
- relationship to the CONTROL layer in spell representation.

### D5 — Decide slot-sensitive homophone resolution

**Evidence:** RE is digit 4 and TARGET-surface reference; RA is radian and TARGET-path reference. The prototype rejects ambiguous cases because it has no contextual disambiguator.

**Recommendation:** Do not globally rewrite or universally reject these forms as a language rule. Specify a context-sensitive resolution table by grammatical slot, register and version, preserving an ambiguity diagnostic where the slot does not decide the analysis.

**Unresolved:** Which slots are already canonically distinguishable, and whether spoken prosody or orthographic boundary markers may contribute.

## 3. Minimal safe construction envelope

Until D1–D5 have stronger evidence, the following limits are recommended for research work:

1. Use P2-AUDIT notation for nested mathematical structure when a source does not establish the surface spelling.
2. Use P6G-SURFACE-PROTOTYPE only to test the prototype's declared grammar and record parser options.
3. Do not call either representation an executable incantation merely because it parses.
4. Do not use KWAM/KWAT examples to infer scope, lifetime or evaluation semantics.
5. Do not use METO/DOGU blocks as canonical control forms.
6. Keep comparison criteria LT/LE/EQ/NE/GE/GT audit-only until source recovery or approval.
7. Keep all physical-feasibility claims outside syntax-test results.

## 4. Minimal future acceptance suite

| ID | Requirement | Evidence needed |
|---|---|---|
| BD-01 | Fixture identifies notation and version | Metadata present and checked |
| BD-02 | Nested fixed-arity expression has one parse | Executed parser test and expected AST |
| BD-03 | Unknown operator signature is rejected | Executed negative test |
| BD-04 | Incomplete nested expression is rejected | Executed negative test |
| BD-05 | SHO identifier closure is labelled prototype-only | Source/version metadata |
| BD-06 | METO/DOGU use is labelled proposed | Lexicon status plus parser version |
| BD-07 | RE/RA collision never silently guessed | Executed tests in each supported context |
| BD-08 | Alias normalisation records original and resolved form | Executed tests with alias option on/off |
| BD-09 | Parse success not reported as semantic validation | Separate status gates |
| BD-10 | Surface parse not reported as physical feasibility | Separate construction/feasibility gates |

## 5. Research decisions versus canon decisions

Some decisions can be made immediately at the project-process level: fixture notation labels, provenance metadata, no-guessing policy for ambiguous tests, and independent reporting of syntax, semantics and feasibility.

Other decisions change Arcane itself and must remain open pending source evidence or explicit approval: canonical identifier syntax, identifier closure, block delimiters, empty-block rules, control-body cardinality, and the exact surface-to-spell mapping.

This separation allows development to proceed without smuggling prototype choices into the language specification.

## 6. Decision ledger

- **Decision ID:** P8E-BOUNDARY-DOCKET-01
- **Recommended process decisions:** notation labels; reject unknown/incomplete prototype operators; retain source/version/options for parser results; never infer semantic or physical validity from parse success.
- **Language decisions left open:** identifier grammar/SHO closure; METO/DOGU canon status; block cardinality/nesting; RE/RA resolution; surface-to-spell mapping.
- **Canon changes:** none
- **New forms:** none
- **Tests executed:** none
- **Next phase:** choose one tractable construction family—fixed-arity arithmetic/vector expressions—and prepare a version-labelled reference suite from canonical operator inventory and prototype test coverage. Avoid control blocks until their boundary contract is settled.
