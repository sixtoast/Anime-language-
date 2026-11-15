# Phase 8CM — Phase 4 DOCX retrieval and reproducible extraction

**Date:** 2026-11-14  
**Canon effect:** NONE · **Grammar changes:** none · **Execution:** none  
**Tests authored:** DOCX-8CM-001–006 · **Tests executed:** not executed in this environment

## 1. New retrieval finding

The GitHub repository's binary-file reader has two modes. Its default UTF-8 mode cannot display the original DOCX as text, but the same file can be retrieved successfully with `encoding: base64`.

For `sources/originals/Arcane_Language_Audit_Phase_4.docx`, the base64 response reports:
- Git blob SHA: `e3dca2ef236f89be442556c989e79d5b977a82b1`;
- original file size recorded by the repository archive report: 27,027 bytes;
- source-byte SHA-256 recorded by the archive report: `c8204667c204227ba474fd0b5245fd66f1ba081565671f5a28cf65efb513eaea`;
- GitHub base64 payload length returned in this session: 36,637 characters (including line wrapping).

This corrects the overly broad wording in earlier recovery notes: **binary transport retrieval is possible in base64 mode**. It does not mean that the DOCX has been decoded, extracted, or reviewed. No decoded-byte hash or extracted paragraph/table comparison was performed in this session.

## 2. Reproducible extraction pipeline

Extended `tools/extract_docx_structure.py`:
- extracted the document-body logic into `extract_docx_bytes(raw, filename)`;
- added `decode_base64_docx(encoded, expected_sha256)`;
- added CLI support for a saved base64 payload using `--base64-input`;
- added optional SHA-256 verification before parsing;
- retained the original direct-DOCX path and source-order paragraph/table extraction;
- does not write a temporary decoded DOCX file.

Example for a base64 payload saved as `phase4.docx.b64`:

```bash
python tools/extract_docx_structure.py phase4.docx.b64 --base64-input \
  --expected-sha256 c8204667c204227ba474fd0b5245fd66f1ba081565671f5a28cf65efb513eaea \
  --output docs/research/extracted/phase4-transcription.md
```

The base64 file must contain only the GitHub API's `content` value, not its surrounding JSON. Whitespace and line wrapping are accepted. Invalid base64 and digest mismatches fail closed.

## 3. Test-source audit

A repository-wide text-index search found the identifiers `P4-T05` and `P4-T10` only in the Phase 5.15 Construction Contract Matrix references. Their actual test definitions were not present in the indexed text available here. The Phase 5.15 results file contains 12 matrix-integrity checks, not the original P4-T05/P4-T10 test bodies.

Therefore the exact test assertions, fixtures, inputs and expected outputs remain **unrecovered**. The matrix's statement that those tests support CVC shape is secondary evidence until the primary test definitions are inspected.

## 4. Current source concordance

| Item | Verified now | Still not verified |
|---|---|---|
| Loose Phase 4 DOCX | Repository presence, Git blob identity and archive SHA metadata | Decoded bytes and full content review in this session |
| Archive DOCX copies | Nine entries match the loose binary by recorded SHA-256 and byte size | Whether any archive copy has additional external context |
| DOCX-derived index entry | 21,121 extracted characters are reported; 1,800-character preview is stored | Full transcription and paragraph/table fidelity |
| TXT transcriptions | Two distinct hashes and character counts are recorded | Equivalence to DOCX or each other |
| P4-T05/P4-T10 | Identifiers cited by Phase 5.15 matrix | Original test definitions and results |
| Phase 5.15/5.16 matrices | Full CSV files are present in repository and readable | Their cited Phase 4 passages are not independently transcribed in full |

The CVC versus optional relation-coda conflict remains open. The phase does not promote either reading.

## 5. Construction findings unchanged

- Construction and Expression remain separate subsystems.
- The seven-stage sequence is an ordering statement, not a complete grammar.
- Parameter-vowel semantics and H-series physical mappings remain provisional.
- The complete relation-coda inventory is unrecovered.
- KREN remains proposed; FREM/SHREN remain fixture-limited; macro signatures remain incomplete.
- The hand-flame example remains tokenised but not a complete parse or feasibility proof.

No new Arcana token, phoneme, grammar rule, signature or executable behaviour is introduced.

## 6. Next source-recovery gate

Use the new base64 extraction path on the actual GitHub payload, verify the decoded source-byte SHA-256 against the archive report, inspect every paragraph and table in order, and then create a section-level concordance for §§3.1–3.3, §6 G-4 and §§8–10. Recover the P4-T05/P4-T10 test definitions separately; do not infer them from the matrix summary.

**Decision ID:** P8CM-PHASE4-DOCX-RETRIEVAL-AND-EXTRACTION-01 · **Canon effect:** NONE
