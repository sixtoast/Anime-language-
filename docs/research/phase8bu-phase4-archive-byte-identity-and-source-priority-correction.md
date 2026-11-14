# Phase 8BU — Phase 4 archive byte identity and source-priority correction

**Date:** 2026-11-14  
**Canon effect:** NONE. **Grammar changes:** none.  
**Tests authored:** CON-SRC-018–020. **Tests executed:** not executed locally.

## 1. New verified provenance fact

A focused review of `sources/archive-reports/mega-pack-report.md` found an explicit archive-to-repository comparison:

- Original: `sources/originals/Arcane_Language_Audit_Phase_4.docx`
- Original size: 27,027 bytes
- Original Git blob SHA: `e3dca2ef236f89be442556c989e79d5b977a82b1`
- Source-byte SHA-256 recorded by archive report: `c8204667c204227ba474fd0b5245fd66f1ba081565671f5a28cf65efb513eaea`

The report lists nine archive member names for this DOCX (the unnumbered name and numbered variants 2–9), each matching the loose original by SHA-256 and byte size. This is positive evidence of **binary byte identity**. The earlier Phase 8AQ/8AY wording that no byte-identity proof existed was too broad and is corrected.

The Git blob SHA and the file SHA-256 are different hash schemes and must not be compared as if they were the same digest.

## 2. Binary identity is not transcription completeness

The text index entry labelled DOCX TEXT reports 21,121 extracted characters and a SHA-256 equal to the DOCX source-byte hash. That hash identifies the DOCX bytes, not the extracted text string. The index stores only the first 1,800 characters.

Therefore:
- The archive DOCX copies are byte-identical to the loose original: VERIFIED.
- The extracted DOCX body is not fully present in the checked-in index: VERIFIED limitation.
- The full text transcription has not been independently reviewed against every DOCX paragraph/table: NOT VERIFIED.
- The TXT transcriptions are separate extracted-text artefacts. Their full contents and ancestry are not established by the 1,800-character excerpts.
- The archive report groups three TXT member names under one text-file SHA-256 and records another TXT variant under a different SHA-256. Exact duplicate TXT copies are identical to one another, not thereby proven identical to the DOCX body.

## 3. What the visible opening establishes

The first 1,800 characters of the DOCX-derived index entry identify the document as:

- `ARCANE LANGUAGE AUDIT — PHASE 4`
- “Whole-language audit and consolidated fixes”
- Working control document dated 10 October 2026
- Status: “DECIDED BY DELEGATION, UNTESTED BY LISTENERS”

The opening describes two subsystems in one language:
1. Construction system (v2.0 Feet, couplings, scoped references), describing what mana does.
2. Expression system (v3.0-L typed prefix operators), computing values, selecting targets and controlling timing.
3. A compile bridge between the two.

This is useful evidence that the Phase 4 artefact is a **consolidation/control document** reconciling v2.0, v3.0-L and Phase 1–3 findings. It is not proof that the raw original v2.0 specification is contained in full or that every consolidation decision was tested by listeners.

## 4. Construction implications

This discovery improves provenance, not the missing morphology itself:
- The exact binary source is now traceable through its archive duplicates.
- The complete §3, §6, §8–10 body and §11 decision ledger are still not available in the checked-in text index.
- Phase 5.15 CVC versus Phase 5.16 C-02 optional relation coda remains unresolved.
- Complete relation-coda inventory and coda meanings remain unrecovered.
- Parameter vowel semantics, full productive Foot paradigm, and stage-internal syntax remain open.
- PO/FO/LO and JO/JUR/JA/JE/JI signatures are not promoted by this provenance correction.

No new Arcane form, grammar rule, signature or parser behaviour is added.

## 5. Implementation and records

Updated `src/engine/constructionSourceConcordance.ts`:
- records the original DOCX's source-byte SHA-256 separately from its Git blob SHA;
- adds the nine archive DOCX copies as a byte-identical group;
- records the DOCX index entry's verified source-byte identity separately from unverified transcription completeness;
- keeps TXT transcription equivalence unresolved.

Corrected Phase 8AQ and Phase 8AY documentation and Research & Review descriptions. Added CON-SRC-018–020 to the test file and registry.

## 6. Remaining recovery action

The next decisive step remains a complete extraction and review of the original DOCX body (paragraphs and tables), with source-byte hash, extraction warnings and section-level concordance. The repository already contains `tools/extract_docx_structure.py` and `tools/source_intake.py`. These must be run in a local repository checkout or another environment with the binary source available. The current session can inspect Git metadata and checked-in text, but cannot execute those local scripts against the repository binary.

Until that is done, do not settle the CVC/optional-coda discrepancy or invent missing Construction signatures.
