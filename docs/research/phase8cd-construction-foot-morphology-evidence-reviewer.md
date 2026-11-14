# Phase 8CD — Construction Foot morphology evidence reviewer

**Date:** 2026-11-14  
**Canon effect:** NONE · **Grammar changes:** none · **Tests authored:** FOOT-MORPH-001–010  
**Tests executed:** not executed locally

## 1. Source evidence retained

The existing source ledger records six CV frame forms `pa, ba, ta, da, ka, ga` (Phase 4 L-03; Phase 5.15). These are frame forms, not proven complete Feet.

Six parameter vowels have provisional family labels:
- `a`: Energy
- `u`: Motion
- `o`: Extent
- `e`: Structure/form
- `i`: Information
- `ə`: Baseline

The family assignments are not executable semantics.

## 2. Foot-shape discrepancy

Phase 5.15 describes a CVC Foot as frame consonant + parameter vowel + relation coda. Phase 5.16 C-02 summarises the coda as optional. This remains an unresolved source discrepancy. The complete relation-coda inventory and its meanings have not been recovered.

This phase deliberately does not choose one interpretation. A CV form is classified only as a recorded frame. A three-character candidate with a known frame consonant and provisional parameter vowel is classified as CVC-shaped only. No coda meaning or lexical Foot validity is inferred.

## 3. Macro associations

- TRAK: described p/t/k voiceless-stop frame group associated with discrete change.
- KREN: proposed b/d/g voiced-stop counterpart, pending owner confirmation.

Neither mapping establishes individual consonant meanings, macro expansion, arity, Foot validity or physical effect.

## 4. Implementation

Added `src/engine/constructionFootMorphologyReview.ts`. It provides:
- source-backed CV frame recognition;
- CVC structural-candidate recognition only;
- provisional parameter-family lookup;
- macro-group association lookup;
- explicit unresolved coda and lexical validity fields;
- non-executable, fail-closed outcomes.

It does not generate the 6×6×coda paradigm or present that cartesian product as a valid lexicon.

## 5. Tests

Ten tests are authored and registered as FOOT-MORPH-001–010. They cover six CV forms, CVC candidate boundaries, unresolved coda meanings, provisional vowels, TRAK/KREN distinction, malformed inputs and disabled execution. They have not been executed locally.

## 6. Outstanding source recovery

1. Full Phase 4 §3.2 and any referenced Foot diagrams/tables.
2. Complete relation-coda inventory and coda-to-relation definitions.
3. Whether coda optionality is context-specific or a transcription/summary discrepancy.
4. Productive frame × parameter × relation combinations.
5. Whether macros operate on individual Feet, Foot sequences or larger Construction structures.
6. Exact KREN owner confirmation.

**Decision ID:** P8CD-CONSTRUCTION-FOOT-MORPHOLOGY-REVIEW-01 · **Canon effect:** NONE
