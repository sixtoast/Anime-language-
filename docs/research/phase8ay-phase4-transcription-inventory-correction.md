# Phase 8AY — Phase 4 transcription inventory correction

**Date:** 2026-11-14  
**Canon effect:** none. **Grammar changes:** none. **Execution:** none.  
**Tests authored:** CON-SRC-014–015. **Tests executed:** not executed in this environment.

## 1. Discovery

A complete re-enumeration of Phase 4 document headings in `sources/archive-reports/mega-pack-text-index.md` found three distinct indexed text artifacts, not two:

| Archive member | Type | Extracted characters | SHA-256 |
|---|---|---:|---|
| `Arcane_Language_Audit_Phase_4 2.docx` | DOCX TEXT | 21,121 | `c8204667c204227ba474fd0b5245fd66f1ba081565671f5a28cf65efb513eaea` |
| `Arcane_Language_Audit_Phase_4 4.txt` | TXT | 22,019 | `247ccc59f074309d6bed69213acff68ddd4fc09ced80565f7176a10d2515e450` |
| `Arcane_Language_Audit_Phase_4.txt` | TXT | 21,846 | `e82d13dbbf1fa3e48b3f50282490bb4436877d1a3c039a451b413dd26c3ba652` |

Each index entry stores only its first 1,800 characters. The visible openings match in title, date and introductory wording. This is evidence of a shared opening, not proof of full-text identity, source ancestry or correctness.

The loose original remains present at `sources/originals/Arcane_Language_Audit_Phase_4.docx` (27,027 bytes; Git blob `e3dca2ef236f89be442556c989e79d5b977a82b1`). The archive report records nine DOCX member names with the same source SHA-256 `c8204667c204227ba474fd0b5245fd66f1ba081565671f5a28cf65efb513eaea` and byte size, proving exact binary copies of the loose original. The extracted text index still contains only 1,800 characters per entry; complete document-body review is not established.

## 2. Concordance correction

Updated `src/engine/constructionSourceConcordance.ts` to add `phase4-text-index-2` with its own member name, SHA-256 and extracted character count. The existing two records remain unchanged.

The inventory now contains six artifacts: one loose binary original, three separately identified archive-index text transcriptions, and the Phase 5.15 and Phase 5.16 Construction matrices.

The DOCX index entry's source-byte identity is now VERIFIED against the loose original, but its extracted-text completeness remains unverified because only a 1,800-character excerpt is stored. The two TXT variants remain unverified against the original and against one another; the archive report separately shows that three TXT member names share one exact text-file hash, while the other TXT variant has a different hash. Byte-identical copies within a TXT group do not establish equivalence to the DOCX source.

## 3. Construction implications

This discovery improves provenance tracking but does not settle the morphology:
- Phase 5.15 still records a CVC Foot structure.
- Phase 5.16 C-02 still describes an optional relation coda.
- The complete relation-coda inventory and coda-to-relation meanings remain unrecovered.
- Parameter-family glosses remain provisional.
- The complete v2.0 frame × parameter × relation paradigm remains unavailable.
- The Phase 5.22 KAN/KEN/KAS evidence remains whole-token and fixture-scoped.

No language rule, token, phoneme meaning, parser behaviour or canon decision has changed.

## 4. Regression coverage

Added `CON-SRC-014` for the three independent transcription records and `CON-SRC-015` for the second TXT record's distinct, unverified identity. Both are registered as `authored-unverified`. They have not been run here. The Python DOCX extractor was not run against the binary source, and no build or test suite execution is claimed.

## 5. Next evidence gate

The next productive source-recovery step is to obtain a full, independently checkable transcription of the original DOCX (or the complete archive members), compare document-body text and tables, and record extraction differences. Only then can the original Phase 4 morphology sections and decision ledger be reconciled responsibly.

Until that evidence is available, D-006/D-007 and the CVC/optional-coda discrepancy remain open. Do not invent a replacement morphology merely to make the current prototype executable.
