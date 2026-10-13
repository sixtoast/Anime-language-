# Documentation Catalogue — First-Pass Link Audit

**Audit date:** 2026-10-13  
**Scope:** All 19 entries in the Documentation catalogue in `src/App.tsx`  
**Result:** 19 catalogue entries total. The first scan found 14 entries with explicit source paths and 5 without. Repository inspection found grounded files for all five source-less entries, and the catalogue now links to those files.

## What was checked

The catalogue's declared source paths were compared with the repository's recursive file tree. The original 14 explicit paths existed. The five previously source-less entries were then classified and linked to existing repository files:

| Catalogue entry | Source now linked | Why this source is appropriate | Limitation |
|---|---|---|---|
| Grammar & syntax | `docs/grammar/README.md` | The grammar documentation index explicitly defines the folder's purpose and canonical-status guardrail. | It is a landing/index document, not a completed formal grammar. |
| Operator reference | `src/engine/operatorContracts.md` | Describes the provisional operator-contract registry and explicitly states its evidence limits. | It is provisional research metadata, not an executable operator type system. |
| Phase 4 — ambiguity audit | `sources/originals/Arcane_Language_Audit_Phase_4.docx` | Links to the preserved original Phase 4 audit file. | The source is a historical original; its contents and authority have not been fully audited in this task. |
| Phase 5 — semantic audit | `sources/originals/Arcane_Language_Audit_Phase_5.docx` | Links to the preserved original Phase 5 audit file. | The source is a historical original; its contents and authority have not been fully audited in this task. |
| FRAPA contract | `docs/audits/phase-2-formal-syntax.md` | Links to the provisional formal-syntax audit where proposed arities/contracts are documented. | This does not resolve FRAPA's canonical contract or approve a language rule. |

## Corrected count and scope of verification

The earlier wording that said **19 entries lacked a source path was incorrect**. There are 19 entries total, of which 14 originally had a path and 5 did not. This correction supersedes the earlier count in the feature register and master plan.

After the update, all 19 catalogue entries have one explicit `sourcePath`, and all 19 declared paths were checked against the current repository tree. This is a path-existence check, not a browser click test, content audit, canonical-status approval, or claim that source recovery is complete.

## Follow-up required

1. Test catalogue search, selection, empty results, status labels, and opening source links in the actual UI.
2. Review whether the original Phase 4 and Phase 5 files need text extraction/transcription to be easier to inspect in the site. Do not replace the original files.
3. Improve provenance metadata so original source, index/summary, provisional audit, implementation notes, and canonical specification are clearly distinguished.
4. Continue checking that the source's status and implementation status are never conflated.

See [Website Feature Register](WEBSITE-FEATURE-REGISTER.md) for the capability mapping and remaining audits.


## Provenance display update

The Documentation catalogue now stores and displays a **source type** and a **provenance note** for each of its 19 entries. Examples include canonical specification copy, provisional audit document, derived structured catalogue, implementation documentation, product plan, documentation index, and original historical source file. These are descriptive provenance labels; they do not replace the existing status labels or establish that a source is correct, canonical, or fully implemented.

The source-type metadata and its presentation have been committed in the website. Browser-level review of the wording and source-link interactions remains part of WEB-DOC-03 and WEB-DOC-02.
