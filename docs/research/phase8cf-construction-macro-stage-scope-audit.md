# Phase 8CF — Construction macro / stage scope evidence audit

**Date:** 2026-11-14  
**Canon effect:** NONE · **Grammar changes:** none · **Tests authored:** MACRO-STAGE-001–010  
**Tests executed:** not executed locally

## 1. Question

Do the six Construction macros have a recovered place in the seven-stage Construction sequence, and does the hand-flame example show whether they operate on one Foot, several Feet or an entire configuration?

## 2. Evidence compared

The performed stage order is recorded as Reference → Spatial role/vector → Construction Feet → Couplings → Quantity → Control → Release (Phase 4 §3.3, as cited by Phase 5.15/5.16). Six adjacent PRECEDES edges are source-backed. All six have UNRECOVERED interfaces and NOT-ESTABLISHED data dependencies.

The exact Phase 5.22 hand-flame fixture has six observed segments:
1. `mel` — reference
2. `po da za shi to za ma` — fixture-only spatial/quantity parse
3. `kan ken` — partial maintenance / held-state evidence
4. `he ha` — provisional H-series coupling example
5. `sa shi za se` — fixture-only duration parse
6. `kas` — partial release evidence

This segment list is not identical to the seven-stage sequence and is not evidence that each segment is one stage. In particular, the observed `kan ken` grouping before `he ha` does not establish that FREM is a stage, that it consumes a Foot, or that it is the formal Control stage.

## 3. Macro-specific findings

- TRAK: Phase 5.22 parser notes KAN as an example-level alias of TRAK ENRA. This does not establish a general TRAK expansion or stage placement.
- FREM: KEN is associated with a held energy state in the example. Its macro-stage assignment, Foot scope and duration/termination contract remain unknown.
- SHREN: KAS is associated with release in the example. Its stage relationship is still not a complete release signature.
- KREN, BRAN and VARE: no occurrence in the exact hand-flame segment inventory is recorded. Their placement cannot be inferred from their glosses.

For every macro, scope, Foot cardinality, stage assignment and causal dependency remain unrecovered.

## 4. Implementation

Added `src/engine/constructionMacroStageScopeAudit.ts`:
- preserves all seven source-backed stages and six precedence-only edges;
- compares each macro with exact fixture segment evidence;
- keeps TRAK/KAN/ENRA, FREM/KEN and SHREN/KAS associations at their recorded evidence levels;
- exposes fixture-segment lookup without converting segment index into stage assignment;
- fails closed on unknown inputs.

## 5. Tests

Ten tests are authored and registered as MACRO-STAGE-001–010. They cover stage order, precedence-only edges, unassigned macro placement, the bounded fixture associations, absent scope/cardinality, and non-executable status. Tests have not been executed locally.

## 6. Conclusion

Current sources do not demonstrate whether macros are independent surface tokens, Foot-internal patterns, wrappers over Foot sequences, or stage-level instructions. The exact hand-flame example provides useful local associations but cannot answer those general grammar questions. The next source requirement is the complete Phase 4 §3.2/§3.3 and §8 prose/diagrams or an owner-approved replacement specification. Until then, no macro-to-stage mapping or macro execution model should be implemented.

**Decision ID:** P8CF-CONSTRUCTION-MACRO-STAGE-SCOPE-01 · **Canon effect:** NONE
