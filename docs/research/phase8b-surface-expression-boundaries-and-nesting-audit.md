# Arcane Phase 8B — surface expression boundaries and nesting audit

**Status:** Source-grounded parser audit; proposals remain non-canonical  
**Date:** 2026-10-15  
**Canon effect:** none  
**New forms:** 0  
**Tests run during this phase:** none; repository test source was inspected, not executed

## 1. Purpose

The previous milestone called for a focused investigation of expression boundaries, nesting and the distinction between surface-like syntax and abstract audit notation. This document performs that investigation against the canonical v3.0-L, Phase 2 audit, the current provisional surface parser and its existing test file.

It also clarifies a potentially misleading summary in Phase 8A: KWAM/KWAT are absent from the *Phase 2 audit parser's* arity registry, but they **are** handled by the separate *Phase 6G provisional surface parser*. These are two different parsers with different grammars. Neither is thereby established as the complete canonical Arcane parser.

## 2. Evidence and scope boundaries

### Canonical statements

The v3.0-L specification records:
- surface pattern: `HEAD + ARGUMENTS + MODIFIERS`;
- fixed argument counts for core operators and a requirement not to rely on precedence to determine grouping;
- the requirement that executable Formal Performed Arcana have exactly one recoverable interpretation;
- a distinction between surface syntax and the separate spell representation `HEAD + CORE + PARAMETERS + CONSTRAINTS + CONTROL`;
- conceptual examples `KWAM 1 E`, `KWAT 1`, and `KWAK 1`, while leaving identifier representation and evaluation semantics for formalisation.

### Provisional abstract audit notation

Phase 2 proposes `OPERATOR⟨argument₁, argument₂, …⟩`. The angle brackets and commas are test notation, not established Arcane words. Its nested example `FRAPA⟨KI, FRAPA⟨TO, MU⟩⟩` is structurally explicit, but it does not establish how that same structure is spoken or written in surface Arcane.

### Provisional surface-like parser

`src/engine/surfaceParser.ts` identifies itself as a narrow port of the archived Phase 6G design. It tokenises on whitespace, constructs a syntax tree for a limited set of forms, supports certain operator classes and legacy aliases, and returns parse diagnostics. Its own comments say it does not load the canonical lexicon by default, type-check expressions, evaluate spells or establish canon.

Therefore the parser's acceptance means only “accepted by this provisional parser under its options”, not “canonical”, “semantically valid” or “physically feasible”.

## 3. The two parsers must not be conflated

| Capability | Phase 2 audit parser | Phase 6G surface parser |
|---|---|---|
| Notation | Explicit angle-bracket calls | Whitespace-tokenised surface-like forms |
| Arity coverage | Small mathematical operator registry | Broader provisional operator registry |
| KWAM/KWAT | Not in its arity table | Special handling exists |
| Identifier | Generic audit symbol only | Digit-token sequence closed by SHO |
| Control blocks | Not the relevant grammar | METO/DOGU block handling for registered controls |
| Lexicon | Does not establish canonical lexicon | Optional lexicon registry; default parser has a limited internal form set |
| Semantics/type checking | No | No |
| Spell execution/physical feasibility | No | No |
| Canonical status | Provisional notation | Provisional parser |

**Correction to read alongside Phase 8A:** its claim that KWAM/KWAT are not registered refers only to `src/engine/auditParser.ts`. It must not be generalised to all parser infrastructure; `src/engine/surfaceParser.ts` contains a provisional KWAM/KWAT implementation.

## 4. What the surface parser currently encodes for bindings

The source currently specifies these parser-level behaviours:

1. `KWAM` reads an identifier first, then parses one expression as the binding's second argument.
2. `KWAT` reads an identifier and returns a one-argument call node.
3. An identifier consists of one or more recognised digit tokens and must end with `SHO`.
4. The AST represents identifiers as a node with a decimal digit string, and operators as call nodes with ordered arguments.

The existing unit-test source contains these examples:

- `kwam ki sho frapa ki sho to sho` is expected to produce a KWAM node whose first argument is identifier `1` and whose second argument is a FRAPA call.
- `kwam ki frapa ki sho to sho` is expected to fail with `IDENTIFIER_NOT_CLOSED`.
- `kwat to mu sho` is expected to produce a KWAT node referencing identifier `23`.

These are evidence of **intended parser behaviour in the current source**, not proof that the tests were executed in this phase or that the forms are canonical. The example `KWAM 1 E` in v3.0-L is conceptually consistent with identifier-first binding, but the specific digit-token spelling and SHO closure rule must retain their source/prototype provenance until canonical evidence or an approved design decision settles them.

## 5. The key unresolved boundary problem

The parser's KWAM branch parses the identifier and then calls `expression()` once for the bound expression. The parser therefore depends on its expression grammar to know where that expression ends. There is no general explicit delimiter around every expression in the whitespace-tokenised syntax.

Nested fixed-arity calls can give the parser a recoverable boundary because each registered operator consumes its required arguments. But this does not solve every boundary problem:
- leaf/atom forms may have different lexical behaviour from operator calls;
- operators with unresolved or variable argument structures cannot be safely delimited by assumed arity;
- KWAM's identifier closure and the bound expression's end are governed by different rules;
- control operators use a separate block convention with METO and DOGU;
- parser success alone does not settle modifier attachment or the mapping to the spell-representation layer.

The canonical requirement is unique recoverable interpretation. The current surface parser is one provisional attempt at that goal, not evidence that every possible construction has a unique parse.

## 6. Nesting evidence

The current test source includes a nested arithmetic example:

`frapa frama ki sho to sho fraja mu sho za sho`

The expected tree is an outer FRAPA call whose first argument is FRAMA and whose second is FRAJA. The source also includes a control example:

`bek dras ki sho to sho gt meto frapa ki sho to sho dogu`

Its expected tree retains a block node inside BEK. These fixtures indicate two current parser conventions:
- nested fixed-arity operators are parsed recursively;
- control bodies are represented as blocks bounded by METO and DOGU.

However, the comparison criterion tokens `LT/LE/EQ/NE/GE/GT` are labelled audit-only in the parser's diagnostic; their canonical surface forms remain unresolved. The test example must not be used to promote `GT` to canonical Arcane vocabulary.

## 7. Boundary and nesting risk register

| ID | Risk | Evidence-based conclusion | Next requirement |
|---|---|---|---|
| EX-01 | Abstract notation mistaken for spoken Arcane | Phase 2 explicitly says brackets/commas are audit notation | Keep notation labels visible in every fixture |
| EX-02 | Parser acceptance mistaken for canonicality | Surface parser explicitly provisional | Record parser/version/options with observations |
| EX-03 | Binding expression end is guessed | KWAM consumes one expression under parser grammar | Test and specify boundary cases for each supported expression class |
| EX-04 | Unknown arity is assumed | Phase 2 parser rejects unknown arity; surface parser has a different registry | Never transfer support from one parser to another |
| EX-05 | Control block treated as ordinary argument list | Surface parser requires METO/DOGU for control classes | Preserve block node and test missing delimiters |
| EX-06 | Comparison audit tokens promoted to canon | Parser labels criteria audit-only | Keep criteria provisional pending source recovery |
| EX-07 | AST treated as semantic proof | Neither parser type-checks or executes spells | Separate parse, type, construction and feasibility gates |
| EX-08 | Historical aliases silently replace forms | Surface parser optionally normalises aliases | Record alias option and source version per observation |
| EX-09 | Binding syntax taken as binding semantics | KWAM/KWAT AST shape says nothing about scope/lifetime/evaluation | Semantic contract remains blocked |
| EX-10 | Modifier scope assumed from head-initial order | Phase 2 marks modifier scope unresolved | Define and test attachment rules independently |

## 8. Proposed focused test plan

These are test specifications for future execution, not reported results.

| ID | Input/contrast | What to inspect | Expected caution |
|---|---|---|---|
| EX-T01 | Existing KWAM fixture | AST argument order and identifier node | Parser behaviour only |
| EX-T02 | KWAM with identifier lacking SHO | Exact diagnostic | Do not reinterpret as semantic failure |
| EX-T03 | KWAT with closed multi-digit identifier | Identifier digits preserved in order | Does not prove identifier grammar is canonical |
| EX-T04 | KWAM with nested fixed-arity expression | Where bound expression stops | Test only for operator forms supported by this parser |
| EX-T05 | KWAM with leaf atom as bound expression | Whether one atom ends the expression cleanly | Requires a registered/known atom |
| EX-T06 | KWAM with incomplete nested operator | Must reject, not consume a later token by guess | Exact diagnostic may depend on parser contract |
| EX-T07 | Nested FRAPA/FRAMA/FRAJA contrast | AST preserves outer/inner ordering | Renamed forms require explicit version/alias policy |
| EX-T08 | BEK without METO | Block-opening diagnostic | Surface parser only |
| EX-T09 | BEK without DOGU | Block-closing diagnostic | Surface parser only |
| EX-T10 | METO/DOGU outside control | Reject block delimiters in unsupported context | Surface parser only |
| EX-T11 | Two top-level expressions | Reject trailing expression | No implied sequencing operator |
| EX-T12 | Same input with alias normalisation on/off | Record source and resolved operator | Never erase historical form |
| EX-T13 | Surface-like expression versus Phase 2 bracket notation | Record that these are different grammars | Do not compare acceptance as equivalent |
| EX-T14 | Parse-valid but type-invalid candidate | Parse may succeed; semantic gate remains separate | Do not claim type validity |
| EX-T15 | Parse-valid expression intended to change physics | Parse is irrelevant to feasibility | Mechanism/feasibility gates still required |

## 9. Practical conclusions for language design

1. There is already a provisional parser-level answer for one narrow question: in the Phase 6G surface parser, KWAM consumes an identifier followed by one recursively parsed expression, while KWAT consumes an identifier only.
2. There is not yet a canonical answer that all formal Arcane expressions have reliably encoded boundaries in the real spoken/written language.
3. The explicit bracket notation is useful for structural research, but cannot be silently substituted for the canonical surface grammar.
4. The parser's identifier format is evidence of a prototype convention. It should be treated as a candidate to compare against historical source material, not a canon rule solely because tests describe it.
5. Control blocks, modifiers, lexical ambiguity, types and physical feasibility are separate concerns and must stay separate.

## 10. Decision ledger and next phase

- **Decision ID:** P8B-EXPRESSION-BOUNDARIES-01
- **Canon changes:** none
- **New vocabulary:** none
- **Application files changed:** none
- **Tests run:** none
- **Source inspection:** canonical v3.0-L, Phase 2 audit, Phase 7Y/8A dossiers, surface parser and its test source
- **Next step:** recover source provenance for the surface parser's SHO-closed identifier convention and METO/DOGU control delimiters. Compare those conventions to historical language sources and alias strata before proposing any canon-level boundary rule. In parallel, author a compact test traceability matrix that clearly distinguishes “source example”, “parser test authored”, “test executed”, and “canon rule”.
