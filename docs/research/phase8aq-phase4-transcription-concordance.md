# Phase 8AQ — Phase 4 transcription concordance and Construction evidence map

**Date:** 2026-11-14  
**Canon effect:** none. **Grammar/parser changes:** none. **Execution:** none.  
**Tests:** 12 Vitest cases authored; not executed in this environment.

## New recovery lead

The repository archive index `sources/archive-reports/mega-pack-text-index.md` contains two distinct Phase 4 text artifacts:

| Indexed artifact | Extracted characters | Indexed SHA-256 | Stored excerpt |
|---|---:|---|---:|
| `Arcane_Language_Audit_Phase_4 2.docx` | 21,121 | `c8204667c204227ba474fd0b5245fd66f1ba081565671f5a28cf65efb513eaea` | 1,800 characters |
| `Arcane_Language_Audit_Phase_4 4.txt` | 22,019 | `247ccc59f074309d6bed69213acff68ddd4fc09ced80565f7176a10d2515e450` | 1,800 characters |

The loose original `sources/originals/Arcane_Language_Audit_Phase_4.docx` is also present (Git blob SHA `e3dca2ef236f89be442556c989e79d5b977a82b1`, 27,027 bytes). The DOCX is binary and the connected text retrieval path cannot read it. The archive index stores only a short excerpt for each extracted artifact.

These are three distinct repository artefacts. The DOCX-derived and TXT-derived records have different hashes and character counts. There is no byte-identity or textual-equivalence proof connecting either indexed transcription to the loose DOCX. The TXT may be a transcription or transformed copy; its provenance is not established by the index metadata alone. We must not silently substitute it for the original.

## Source concordance now represented in the workbench

Added `src/engine/constructionSourceConcordance.ts` as a non-executable evidence catalogue. It separates:
- original binary source presence;
- archive-index transcription metadata;
- Phase 5.15/5.16 matrix records;
- claims and their evidence strength;
- unresolved contradictions and inference boundaries.

The seven claim groups are Foot shape, frame inventory, parameter families, relation codas, H-series couplings, six macros, and the hand-flame example.

## Construction findings retained

1. **Foot shape conflict:** Phase 5.15 states CVC; Phase 5.16 C-02 states optional relation coda. Neither is promoted as the settled universal rule.
2. **Frames:** p/b/t/d/k/g and pa/ba/ta/da/ka/ga are recorded as structural inventory; individual semantic contrasts remain missing.
3. **Parameter vowels:** a/u/o/e/i/ə family labels remain provisional.
4. **Relation codas:** coda position is documented; complete inventory and meanings are unrecovered.
5. **H-series:** six forms and glosses are recorded; physical mappings, signatures, participant order and resource costs remain unresolved.
6. **Macros:** TRAK/KREN, FREM/SHREN, BRAN and VARE have differing evidence strengths. No complete expansions or executable signatures are established.
7. **Hand-flame:** the sequence remains a tokenised partial example, not a complete parse or feasibility proof.

## Verification boundary

Twelve regression cases are authored for the concordance metadata and evidence boundaries. They have **not** been executed. No Python extractor tests were run. No TypeScript build is claimed in this record.

The existing extractor remains the correct next tool once the original binary can be read in an environment that has repository file access. A faithful transcription must record the source-byte SHA-256, preserve paragraphs/tables/diacritics, and be checked against the DOCX before its content is used to settle D-006 or D-007.

## Decision

Do not invent the missing v2.0 morphology. Do not treat the 22,019-character TXT entry as a verified duplicate of the 21,121-character DOCX extraction. The concordance is now visible in code and tests so that future work can add verified transcription evidence without rewriting or conflating the existing records.
