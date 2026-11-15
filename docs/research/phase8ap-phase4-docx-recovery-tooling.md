# Phase 8AP — Phase 4 DOCX source recovery tooling

**Date:** 2026-11-14  
**Canon effect:** none. **Grammar changes:** none. **Execution:** none.  
**Tests:** two standard-library Python regression tests authored; not executed in this environment.

## Recovery finding

The original file `sources/originals/Arcane_Language_Audit_Phase_4.docx` is present in the repository. The archive index `sources/archive-reports/mega-pack-text-index.md` also contains an extracted DOCX-text entry named `Arcane_Phase_6S_Typed_Expression_Integration/Arcane_Language_Audit_Phase_4 2.docx`, with 21,121 extracted characters and a SHA-256 recorded in the index. However, the index publishes only the first 1,800 characters of each document. This proves a readable transcription was produced during archive indexing, but does not provide the complete Phase 4 text or full table content in the checked-in index.

The DOCX is binary and the connected GitHub text retrieval path rejects it as non-UTF-8. No claim is made that the complete original DOCX has been inspected in this session.

## Added extraction utility

`tools/extract_docx_structure.py` uses only the Python standard library. It reads `word/document.xml` from a DOCX ZIP container, walks document-body paragraphs and tables in source order, preserves Unicode text, emits table rows as Markdown, and records a SHA-256 of the source bytes. It never modifies or extracts the source archive to disk.

Run from the repository root:

```bash
python tools/extract_docx_structure.py sources/originals/Arcane_Language_Audit_Phase_4.docx --output docs/research/extracted/phase4-transcription.md
```

The output path is intentionally not created or committed by this change: the utility must first be run against the actual binary file, then its output reviewed against the source before it is treated as a faithful transcription.

## Limitations

- Document-body paragraphs and tables are extracted in order; page layout is not reconstructed.
- Images, text boxes, comments, footnotes, headers/footers and tracked-change intent are not interpreted.
- Table cell text is flattened within each cell; merged-cell layout is not reconstructed.
- The SHA-256 identifies the exact source bytes and should be recorded with any reviewed transcription.
- Extracted wording is evidence, not automatic canon approval; preserve the source section numbers and decision status.

## Regression coverage

`tools/test_extract_docx_structure.py` builds a small synthetic DOCX in memory and checks paragraph/table order, Unicode section markers, cell text and SHA-256 reporting. A malformed package test checks missing `word/document.xml` handling. Tests are authored but not executed here.

## Next action

Run the utility against the repository DOCX in a local Python environment, review the complete output including all tables, then build a section-by-section evidence map for Construction §§3.1–3.3, §6 and §§8–10. Only after that should we resolve the v2.0 frame/coda and reference questions.