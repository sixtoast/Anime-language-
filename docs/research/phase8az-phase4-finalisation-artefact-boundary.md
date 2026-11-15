# Phase 8AZ — Phase 4 finalisation artefact boundary

**Date:** 2026-11-14  
**Canon effect:** none. **Grammar changes:** none. **Execution:** none.  
**Tests authored:** CON-SRC-016–017. **Tests executed:** not executed in this environment.

## 1. Additional Phase 4 artefacts located

The repository tree contains `sources/originals/phase4 finalize.pdf`:
- Git blob SHA: `7caad1753cafbb5c4da971ebb3722fd117099291`
- Size: 48,240 bytes
- Archive SHA-256: `1dd42bfe203069149d72c98a136be2500c667ada21794f256e7c47604a9bca9d`

The archive report lists two member names, `phase4 finalize.pdf` and `phase4_finalize.pdf`, with the same SHA-256 and sizes. They are duplicate archive names for the same PDF content, not two independent sources.

The searchable text index also contains `phase4_finalize.txt`:
- SHA-256: `086122ac5568183db4e5bc5ae38d5933057a096a015ae8b7d8e88f3f09cf7209`
- Extracted characters: 7,852
- Indexed preview: first 1,800 characters only.

Its visible opening identifies it as a Phase 4 generator that assembles a draft lexicon, runs example/numeral tests, and writes CSV/results JSON. It imports `arcane_lexicon_tools` and the Phase 3 checker and reads `phase4_report.json`.

## 2. Evidence classification

These are related implementation artefacts, not automatically normative grammar sources:
- The PDF body has not been extracted or inspected in this environment.
- The script's complete body is not available in the index preview.
- The script's stated purpose is draft lexicon generation and mechanical checking; that purpose does not establish a complete productive Construction Foot paradigm.
- The archive report's matching hashes establish that its two PDF member names resolve to the same bytes. They do not establish the PDF's relationship to the original v2.0 design source.

The Phase 4 audit DOCX and its three indexed transcriptions remain separate records. The finalisation PDF and script have therefore been added as related artefacts, not counted as additional Phase 4 transcriptions.

## 3. Construction morphology consequences

No new Foot rule is established by this discovery. The following evidence positions remain unchanged:
- Phase 5.15 describes CVC frame + parameter vowel + relation coda.
- Phase 5.16 C-02 describes an optional relation coda.
- Six canonical CV forms remain frame-form evidence, not proof that CV forms are complete Feet.
- Parameter-family mappings remain provisional.
- Relation-coda inventory and coda meanings remain unrecovered.
- D-006 and D-007 remain unresolved.
- KAN/KEN/KAS remain whole-token, hand-flame-example evidence.

The finalisation script may be useful for tracing how the Phase 4 draft lexicon was generated, but it must not be used as a substitute for the missing source definitions or decision ledger.

## 4. Concordance and regression changes

Added two related-artifact records to `constructionSourceConcordance.ts`:
- `phase4-finalize-pdf`
- `phase4-finalize-script-index`

Added CON-SRC-016–017 to the test suite and registry. The Research & Review page now includes Phase 8AZ as item 15.

These tests are authored and registered, not executed. No claim is made that the PDF was extracted, that the complete script was reviewed, or that the local test suite ran.

## 5. Next evidence gate

The next step is to recover the PDF's actual text and the full generator script, then compare their contents with the Phase 4 audit DOCX and the archive transcriptions. The PDF's title, pages, sections and actual Construction content must be established before it is used as morphology evidence.

Until then, the source boundary remains explicit: related implementation output is not equivalent to an authoritative v2.0 grammar specification.
