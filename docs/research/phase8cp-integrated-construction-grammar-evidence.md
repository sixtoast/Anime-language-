# Phase 8CP — Integrated Construction grammar evidence specification

**Date:** 2026-11-14 · **Specification:** `0.1.0-evidence`  
**Canon effect:** NONE · **Grammar change:** none · **Compiler:** disabled  
**Tests authored:** GRAMMAR-8CP-001–012 · **Tests executed:** not executed locally

## 1. Purpose

This phase consolidates recovered Construction evidence into a versioned specification. It is an evidence specification, not a complete grammar. A recogniser can identify a recorded form; it cannot thereby validate a complete Construction or prove a physical effect.

## 2. Seven-stage model

The recovered order is Reference → Spatial role/vector → Construction Feet → Couplings → Quantity → Control → Release. The six adjacent relationships are PRECEDES only. Interfaces are UNRECOVERED and data dependencies NOT-ESTABLISHED. No mandatory presence, cardinality, I/O types, omission rules or execution transitions are inferred.

## 3. Stage evidence register

| Stage | Recovered evidence | Unresolved contract |
|---|---|---|
| Reference | MI/NI/RI → DEFAULT-VOLUME; me → SELF-SURFACE; UNTIL-REPLACED in recovered context | Landmark identity, spoken syntax and boundary scope |
| Spatial role/vector | Versioned spatial inventory; six v3.0-L signed-axis glosses | Frame/origin, vector syntax and integration with Construction Feet |
| Construction Feet | Six CV frame forms; six provisional parameter-family labels | Coda requirement, coda inventory, productive combinations and composition |
| Couplings | H-series hə/he/ha/hu/hi/ho; he/matter and ha/energy fixture associations | Participant identity/order, direction, general domain mapping and resource costs |
| Quantity | Bounded 0.2 metre phrase in hand-flame fixture | General numeric/unit syntax, dimensions and attachment |
| Control | ken/held-energy association in one fixture | General control syntax, conditions, duration and termination |
| Release | kas/release association in one fixture | Target, mode, safety conditions and resource semantics |

## 4. Foot morphology boundary

The six documented canonical CV frame forms are `pa ba ta da ka ga`. Parameter vowels `a u o e i ə` have provisional family labels. These lists do not establish that all 36 pairings are licensed, and the CV forms are not complete Feet.

The source summaries conflict: Phase 5.15 describes CVC with a relation coda; Phase 5.16 C-02 describes the coda as optional. Both readings remain open. The complete coda inventory and coda-to-relation meanings have not been recovered. A candidate is not valid merely because it occupies three character positions.

## 5. Macro contract boundary

The six macros are TRAK, KREN, FREM, SHREN, BRAN and VARE. Their role evidence is uneven; signatures remain incomplete. The readiness gate identifies missing dimensions including input/output signatures, Foot cardinality, sequence scope, preconditions, resource semantics, side effects, termination and composition. No macro is compiler-ready. The fixture associations for `ken` and `kas` do not provide general FREM/SHREN expansions.

## 6. Reference and Expression boundaries

Recovered formal reference tokens/scopes remain distinct from performed lower-case reference evidence. The trace blocks continuity inference after phrase/clause boundaries because their scope effect is unrecovered.

Formal Expression and Construction macros remain separate. No AST-to-Construction mapping table or end-to-end translation trace has been recovered. Lexical or conceptual similarity is not a translation rule.

## 7. Evidence review API

Added `reviewConstructionGrammarEvidence(input)`. It composes the Phase 8CO candidate reviewer and reports:
- `EVIDENCE-RECOGNISED-NOT-GRAMMAR-VALIDATED`
- `CANDIDATE-REQUIRES-SOURCE-ADJUDICATION`
- `NO-BOUNDED-EVIDENCE-MATCH`

Every result states that grammar validation was not performed and the input cannot be accepted as a valid Construction. The last disposition is not a canonical invalidity judgement.

## 8. Implementation and tests

Added `src/engine/constructionGrammarSpecification.ts`, its Vitest tests, Research & Review item 42 and 12 test registry entries. The module exposes the versioned seven-stage register, stage precedence, unresolved boundaries, macro readiness summary and evidence-review API.

Tests are authored but have not been executed locally. Vercel build verifies TypeScript compilation and bundling only, not Vitest or browser acceptance.

## 9. Next source recovery requirements

1. Complete transcription/review of original Phase 4 DOCX §§3.1–3.3 and §10.
2. Recover P4-T05 and P4-T10 definitions and expected outcomes.
3. Adjudicate Phase 5.15 versus Phase 5.16 C-02 coda wording against the primary source.
4. Recover macro signatures, Foot cardinality and stage interfaces.
5. Recover reference landmark and boundary grammar.
6. Recover an approved Expression-to-Construction bridge before compiler work.

**Decision ID:** P8CP-INTEGRATED-CONSTRUCTION-GRAMMAR-EVIDENCE-01 · **Canon effect:** NONE
