# Phase 8CJ — Construction macro version provenance audit

**Date:** 2026-11-14  
**Canon effect:** NONE · **Grammar changes:** none · **Tests authored:** MACRO-CJ-001–012  
**Tests executed:** not executed locally

## 1. Purpose

This phase checks whether the six operational macro forms in the historical Construction evidence are also present in the supplied v3.0 canonical vocabulary and the v5 draft lexicon. It distinguishes lexical continuity from continuity of grammar, signatures and physical operation.

## 2. Source comparison

The Phase 4 / Phase 5.15 evidence ledger records:
- TRAK — alter; described p/t/k frame-group association.
- KREN — establish; proposed b/d/g reinforced counterpart, owner confirmation required.
- FREM — maintain; partial hand-flame example association.
- SHREN — release; partial hand-flame example association.
- BRAN — couple; h-domain coupling-family association.
- VARE — prefer; soft-requirement modifier role.

The supplied canonical document `docs/canon/magic-system-v3.0.md`, §13 “Spell design and grammar”, lists all six forms with the same glosses. The v5 draft CSV also lists all six as CANON entries, but its `source` column cites `Magic v3.0 §26`.

## 3. Provenance discrepancy

The available canonical Markdown source places the operational vocabulary in §13. The v5 draft CSV cites §26. This is a traceability mismatch that requires checking against the original Magic v3.0 source or its section numbering. It may refer to a different source edition, a different numbering scheme or an outdated citation; the present evidence does not establish which.

The CSV citation is retained exactly as written. It is not silently rewritten to §13.

## 4. What is confirmed

- Six matching spellings are listed in the supplied v3.0 canonical specification.
- Their six glosses agree with the historical macro ledger.
- The v5 draft CSV records those forms as CANON with a Magic v3.0 §26 source citation.

## 5. What is not established

Matching spelling and gloss do not prove:
- unchanged lexical identity across versions;
- unchanged Construction Foot composition or morphology;
- identical macro expansion, arity or argument order;
- identical stage scope, preconditions or side effects;
- continuity of physical/resource semantics;
- that later v3.0 canon retroactively resolves Phase 4's KREN proposal status.

In particular, KREN remains PROPOSED in the Phase 4 evidence record. Its later inclusion in v3.0 canon does not prove that the earlier v2.0 Construction proposal was confirmed at that time.

## 6. Implementation

Added `src/engine/constructionMacroVersionProvenanceAudit.ts`:
- cross-checks all six Phase 4 macro records against the supplied v3.0 canonical vocabulary;
- records exact gloss agreement;
- preserves the v5 CSV's `Magic v3.0 §26` source string;
- flags the available §13/§26 citation discrepancy;
- blocks backward promotion of historical evidence and leaves signatures non-executable.

Twelve tests are authored and registered as MACRO-CJ-001–012.

## 7. Next source action

Inspect the original Magic v3.0 source edition cited by the CSV, if it exists, and determine whether §26 is a valid section reference in that edition. Separately, the Phase 4 DOCX remains the necessary primary source for resolving the historical Foot/coda discrepancy. Neither source gap is settled by this phase.

**Decision ID:** P8CJ-CONSTRUCTION-MACRO-VERSION-PROVENANCE-01 · **Canon effect:** NONE
