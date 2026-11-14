# Phase 8CI — Construction Foot paradigm evidence-closure audit

**Date:** 2026-11-14  
**Canon effect:** NONE · **Grammar changes:** none · **Tests authored:** FOOT-CI-001–012  
**Tests executed:** not executed locally

## 1. Purpose

Phase 8BK already established the 6 × 6 frame–parameter evidence matrix. Phase 8CI does not repeat that matrix or expand it into a hypothetical lexicon. It closes the evidence review across the frame, parameter-vowel and relation-coda slots, the Phase 5.22 whole-token observations, and the unresolved coda-source conflict.

## 2. Slot evidence closure

| Slot | Recovered material | Status | What remains missing |
|---|---|---|---|
| Frame | p, b, t, d, k, g; canonical CV forms pa, ba, ta, da, ka, ga | Source-backed inventory | Individual frame semantics; exact operational mapping |
| Parameter vowel | a, u, o, e, i, ə | Provisional associations | Confirmed meanings, value representation, licensing and interaction rules |
| Relation coda | Position described in CVC summary; no complete list | Unrecovered | Inventory, relation meanings, phonological constraints and optionality context |

The 36 frame–parameter pairs remain a coverage matrix: six explicitly recorded frame forms and 30 unresolved combinations. The 30 are not declared invalid; none is promoted to a licensed form.

## 3. What the three CVC-shaped examples establish

The standalone Phase 5.22 parser source records:
- `kan` — whole example token, alias TRAK ENRA;
- `ken` — whole example token, association FREM / structure held;
- `kas` — whole example token, association SHREN / release.

The final characters `n` and `s` are observations in those spellings only. The source does not segment these tokens into Foot slots. Accordingly, this audit does not add `n` or `s` to the coda inventory, assign them relation meanings, or generate a frame × vowel × observed-coda Cartesian product.

## 4. Source conflict remains open

The Phase 5.15 summary describes CVC. Phase 5.16 C-02 describes an optional relation coda. Both are secondary recovery matrices citing the primary Phase 4 document, whose complete body and relevant tables have not yet been inspected in the current recovery environment.

The conflict remains `SECONDARY-SUMMARY-CONFLICT`; precedence is `NOT-ASSIGNED`. Neither reading is promoted. Parser readiness remains NOT-READY until Phase 4 §§3.1 and 10, their tables/footnotes and the referenced P4-T05/P4-T10 definitions are inspected.

## 5. Integration and implementation

Added `src/engine/constructionFootParadigmClosureAudit.ts`. It integrates the existing frame inventory, parameter inventory, 36-pair matrix, whole-token recovery, source adjudication, parallel coda readings and Phase 8CH lexical audit.

The audit reports:
- six source-backed frame consonants;
- six provisional parameter vowels;
- zero recovered relation-coda entries;
- six recorded CV frame forms and 30 unresolved frame–parameter pairs;
- three whole example tokens;
- two observed final letters that are not treated as coda entries;
- unresolved source precedence and NOT-READY parser status.

It is an evidence-closure report, not a lexical generator, Foot parser or executable Construction grammar.

## 6. Tests

Twelve tests are authored and registered as FOOT-CI-001–012. They cover slot inventories, provisional status, coda gaps, 36-pair coverage, whole-token boundaries, no Cartesian expansion, source-conflict retention, parser-readiness gating and cross-audit consistency. They have not been executed locally.

## 7. Next decisive source action

The next phase should prioritise reliable inspection/transcription of the complete original Phase 4 DOCX, especially §§3.1 and 10, including tables and footnotes, and recovery of P4-T05/P4-T10. That is the evidence required to decide whether the coda rule is mandatory, optional in a defined context, versioned, or misrepresented by one of the summaries.

**Decision ID:** P8CI-FOOT-PARADIGM-CLOSURE-01 · **Canon effect:** NONE
