# Arcane Phase 8C — expression fixture evidence and status matrix

**Status:** Evidence ledger; no test execution claimed  
**Date:** 2026-10-15  
**Canon effect:** none  
**Purpose:** Prevent source examples, parser code, authored tests and verified runtime behaviour from being conflated.

## 1. Evidence states

Use the following independent labels; they are not interchangeable.

- **SOURCE-STATEMENT:** explicitly written in a canonical or historical source.
- **SOURCE-EXAMPLE:** a source includes an example, but does not necessarily define a general rule.
- **IMPLEMENTATION-CODE:** current code contains a behaviour.
- **TEST-AUTHORED:** test source expresses an expected result.
- **TEST-EXECUTED:** a test runner was actually run and its output recorded.
- **CANON-APPROVED:** the rule is explicitly normative in the selected language version.
- **PROVISIONAL:** design or prototype status only.
- **UNRESOLVED:** available evidence does not settle the rule.

A test can be authored without being executed. An implementation can exist without being canon-approved. A canonical gloss can exist without a complete executable signature.

## 2. Traceability matrix

| Subject | Source evidence | Implementation evidence | Test-source evidence | Execution evidence in this phase | Canon status |
|---|---|---|---|---|---|
| Head-initial surface pattern | v3.0-L says HEAD + ARGUMENTS + MODIFIERS | Surface parser is a limited whitespace-token parser | Parser tests cover selected recursive cases | Not run | Canon statement; full grammar incomplete |
| No precedence-based grouping | v3.0-L requires recoverable grouping and fixed arities | Recursive parser implements selected arities | Phase 2 nested example and surface nested test source exist | Not run | Canon requirement; coverage incomplete |
| Explicit bracket notation | Phase 2 labels angle brackets/commas audit notation | `auditParser.ts` parses this notation | Audit-parser tests are registered in source | Not run in this phase | Provisional test notation |
| KWAM identifier then expression | v3.0-L has conceptual `KWAM 1 E` example | Surface parser parses identifier then one expression | Test source includes a KWAM nested FRAPA fixture | Not run in this phase | Concept canonical; surface encoding provisional |
| KWAT identifier reference | v3.0-L has conceptual `KWAT 1` example | Surface parser parses a SHO-closed digit sequence | Test source includes `kwat to mu sho` | Not run in this phase | Concept canonical; exact identifier grammar unresolved |
| SHO closes identifier | Not established as canonical by inspected v3.0-L excerpt | Surface parser requires SHO | Test source expects failure without SHO | Not run in this phase | Prototype convention; canonicality unresolved |
| METO/DOGU control block | v3.0-L distinguishes control and expression layers, but inspected excerpt does not establish these delimiters as canonical | Surface parser requires METO/DOGU for registered controls | Tests authored for missing opening/closing delimiter | Not run in this phase | Provisional parser convention |
| Comparison criteria LT/LE/EQ/NE/GE/GT | Phase 2 proposes comparison semantics; surface parser diagnostic calls criteria audit-only | Surface parser accepts a limited criterion token set | Control example uses GT in a test | Not run in this phase | Audit-only until source recovery |
| KWAM evaluation timing | Canon leaves evaluation semantics open | Parser builds AST only | No semantic evaluator evidence inspected | Not run | Unresolved |
| Binding scope/lifetime | Canon leaves these rules open | Audit registry marks bindings blocked by specification | Phase 7Z proposed tests | Not run | Unresolved |
| Physical feasibility | Canon separates symbolic expression and physical mechanism | Parser does not evaluate spells | No feasibility acceptance established by these parser fixtures | Not run | Separate gate, not implied by parse |

## 3. Provenance warning for identifier syntax

The surface parser's digit vocabulary and SHO-closed identifier are visible implementation conventions. The canonical example `KWAM 1 E` is compatible with an identifier concept, but does not itself prove:
- that the identifier must be numeric;
- that digit tokens are concatenated exactly as the prototype does;
- that SHO is the canonical closure marker;
- that the same encoding is valid across all historical strata and registers.

Until original source passages are recoverable, use the prototype's identifier behaviour only when explicitly labelling a test as a Phase 6G parser fixture.

## 4. Provenance warning for control delimiters

The surface parser requires METO before a control block and DOGU after it. Its tests specify diagnostics for missing delimiters. This establishes what the prototype expects, not the canonical history or morphology of METO and DOGU. Do not promote those tokens from implementation to canon without source evidence or an explicit versioned approval.

## 5. Correction and traceability note

Phase 8A states that KWAM/KWAT are absent from the Phase 2 audit parser's arity table. This is accurate for `src/engine/auditParser.ts`, but incomplete if read as a statement about the whole repository. The separate `src/engine/surfaceParser.ts` has KWAM/KWAT branches and its own arity table. This matrix records that distinction explicitly.

## 6. Acceptance criteria for future claims

Before saying a parser test passes, record:
1. exact repository revision;
2. command and test target;
3. exit status and relevant output;
4. whether the test was authored before the run;
5. parser/fixture format and options;
6. whether the result is only syntactic or includes semantic/type/feasibility checks.

Before calling a rule canon, record:
1. source path and version;
2. section/page/entry and exact provenance;
3. whether it is an explicit rule or an example;
4. any conflicting historical or versioned form;
5. whether approval or further source recovery is required.

## 7. Next source-recovery priority

Recover primary evidence for:
- identifier closure and the relation between canonical numeral tokens and binding identifiers;
- METO/DOGU and their historical/register scope;
- operator argument boundaries in spoken/written surface Arcane;
- how surface syntax maps to HEAD + CORE + PARAMETERS + CONSTRAINTS + CONTROL.

Do not invent historical examples to fill gaps. If original DOCX source retrieval remains unavailable through the current connector, record that as a retrieval limitation and seek another supported route to the source files.
