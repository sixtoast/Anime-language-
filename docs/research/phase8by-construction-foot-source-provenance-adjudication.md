# Phase 8BY — Construction Foot source-provenance adjudication

**Date:** 2026-11-14  
**Status:** Conflicting secondary summaries identified; primary-source adjudication pending  
**Canon effect:** NONE · **Grammar changes:** none · **Tests authored:** CON-FOOT-PROV-001–008  
**Tests executed:** not executed locally

## 1. The important provenance correction

The Phase 5.15 Construction Contract Matrix says the Foot shape is CVC (frame consonant + parameter vowel + relation coda), citing Phase 4 §3.1, §10 and tests P4-T05/P4-T10.

The Phase 5.16 Construction Recovery Matrix says frame + parameter vowel + optional relation coda, citing Phase 4 §3.1 and lexicon tools.

These are both recovery summaries. Neither is the primary Phase 4 source. Both cite §3.1, and the 5.15 record additionally cites §10 and two test identifiers. The full Phase 4 DOCX body and relevant tables have not been inspected in the current environment. The archive report establishes byte identity of copies, not that the primary text has been read.

Therefore, it is not justified to describe Phase 5.15 as the definitive primary rule or Phase 5.16 as a correction. Nor is it justified to assume the difference is typographical.

## 2. Adjudication state

| Claim | Source | Claim status |
|---|---|---|
| CVC required | Phase 5.15 matrix | Secondary summary |
| Coda optional | Phase 5.16 C-02 | Secondary summary |
| Actual primary rule | Phase 4 DOCX §§3.1 and 10 | Not yet inspected |

**Decision:** precedence is NOT-ASSIGNED. The source conflict remains open.

The primary Phase 4 document must be inspected, including relevant tables and footnotes. The P4-T05/P4-T10 definitions must also be recovered to determine whether they test shape recognition, a full Foot, or a context-specific form.

## 3. What remains safe to implement

The current structural recogniser may continue to:
- recognise the six documented CV frame forms: pa, ba, ta, da, ka, ga;
- recognise a CVC-shaped string as occupying three orthographic positions;
- reject malformed lengths and slot characters;
- mark all coda-bearing forms semantically unresolved;
- report the two source readings independently.

It must not:
- declare CV a complete Foot;
- declare every Foot obligatorily CVC;
- treat any arbitrary final consonant as a licensed relation coda;
- infer relation meaning from the final letter;
- promote either recovery matrix over the uninspected primary source.

## 4. Other Construction morphology evidence retained

The six frame consonants and their canonical CV frame forms remain source-backed inventory. Parameter-vowel families remain provisional. TRAK's p/t/k association is a described macro-level pattern; KREN's b/d/g association remains a proposal requiring owner confirmation. Individual frame-consonant meanings are not recovered.

The H-series forms remain recorded with glosses (hə mana, he matter, ha energy, hu living, hi information, ho field), while their physical mappings, participant order, coupling signatures and vector relations remain provisional or unresolved. BRAN's family association does not turn those six labels into an executable coupling operation.

The hand-flame tokens kan, ken and kas remain whole-token Phase 5.22 example records. Their written CVC appearance does not settle the general Foot-coda rule or provide a coda inventory.

## 5. Implementation

Added `src/engine/constructionFootSourceAdjudication.ts` as a provenance record and read-only review function. It explicitly records both secondary claims, the primary source and its inspection status, the missing evidence, and the prohibition on assigning precedence.

Eight tests are authored and registered as CON-FOOT-PROV-001–008. No tests have been executed locally. No grammar, parser, compiler or execution behaviour is changed.

## 6. Required next source action

Obtain a reliably readable copy of `Arcane_Language_Audit_Phase_4.docx` or its complete faithful text extraction. Inspect §§3.1 and 10, including all tables/footnotes, and recover P4-T05/P4-T10. Only then can we classify the conflict as contextual optionality, version difference, summary error or a true source contradiction.

**Decision ID:** P8BY-FOOT-PROVENANCE-01 · **Canon effect:** NONE
