# Phase 8AM — Original Construction morphology recovery audit

**Date:** 2026-11-13  
**Canon effect:** none. **Implementation:** research catalogue updated; no grammar or parser changes.  
**Test execution:** no tests run or claimed.

## Scope inspected

This recovery pass examined the repository's searchable archive indexes and source records, not the binary archive members directly:

- sources/archive-reports/mega-pack-text-index.md — 152 unique readable documents indexed from sources/originals/Arcana mega pack.zip; PDF text extraction was excluded.
- sources/archive-reports/megapack2-text-index.md and megapack2-report.md — 253 unique readable text documents indexed from docs/Arcana megapack2.zip; DOCX text was extracted, PDF text was excluded.
- docs/research/phase7j-historical-morphology-recovery-boundary.md.
- sources/originals/Arcane_Phase_5_15_Construction_Contract_Matrix.csv.
- sources/originals/Arcane_Phase_5_16_Construction_Recovery_Matrix.csv.
- sources/originals/arcane_phase515_construction_gate.py.

This is an inspection of searchable text indexes and listed source records. It is not a claim that every archive member, original PDF page, or binary DOCX table was reviewed.

## Findings

### 1. The exact historical morphology remains explicitly unresolved

The archived Decision Ledger records D-006 as UNRESOLVED: recover exact v2.0 frame–vowel–coda morphology before integrating or retiring it. D-007 is UNRECOVERED: exact definitions and examples for h coupling, MEL anchoring, KAN/KEN/KAS.

The Phase 5.15 matrix states that the complete frame/coda inventory and productive semantics need the original v2.0 source. It records six frame classes and canonical CV forms, but says individual semantic contrasts need original v2.0 definitions.

### 2. What can be retained safely

- Phase 5.15 Foot shape: CVC = frame consonant + parameter vowel + relation coda.
- Six frame classes: p, b, t, d, k, g; canonical CV forms pa, ba, ta, da, ka, ga.
- Parameter-family labels a/energy, u/motion, o/extent, e/structure-form, i/information, ə/baseline are explicitly provisional.
- Relation is encoded in coda position, but the complete coda inventory and coda-to-relation mapping are missing.
- Phase 5.16 C-02 independently describes frame + parameter vowel + optional relation coda. Its conflict with the CVC statement remains unresolved.
- KAN/KEN/KAS and the hand-flame sequence provide partial example evidence only, not a complete productive paradigm.

### 3. Archive indexing does not close the gap

The archive indexes contain useful recovery material, including the Decision Ledger, Phase 5.15/5.16 matrices and a Phase 5.22 parser prototype with an explicitly example-level KAN/KEN/KAS mapping. The Phase 7J recovery report already states that exact v2.0 morphology remains unavailable and identifies readable transcriptions of original DOCX material as the next practical path.

No newly located index excerpt establishes the missing individual frame semantics, complete relation-coda inventory, or productive frame × parameter × coda rules. Absence from indexed excerpts is not proof that no such material exists anywhere in the binary originals.

## Decision

Do not author a guessed v2.0 paradigm. Keep existing evidence-only recognisers and source disagreement visible. Continue source recovery by producing a faithful, section-referenced transcription of the original Phase 4 DOCX and relevant original v2.0 source material, preserving tables, diacritics and version labels. If the source cannot be recovered, any replacement must be a separately versioned owner-approved specification, not a retroactive claim about historical v2.0.

## Website update

The Research & Review catalogue now includes Phase 8AM as an explicit source-recovery topic, linking this record and making the D-006/D-007 boundary visible beside existing research topics.