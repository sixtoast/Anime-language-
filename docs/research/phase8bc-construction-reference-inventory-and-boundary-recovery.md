# Phase 8BC — Construction reference inventory and boundary recovery

**Date:** 2026-11-14  
**Canon effect:** none. **Grammar changes:** none. **Executable parsing:** none.  
**Tests authored:** CON-REF-INV-001–008. **Tests executed:** not executed in this environment.

## 1. Purpose

This phase consolidates reference evidence into a case-sensitive inventory. Formal MI and Performed mi look similar but belong to different evidence layers. The inventory preserves that distinction and is not a Construction parser or reference binder.

## 2. Recovered distinctions

| Exact form | Evidence class | Recovered information | Boundary |
|---|---|---|---|
| MI, NI, RI | Formal binder evidence | Default-volume scope; persistence until replaced | Existing formal binder remains separate |
| me | Formal binder evidence | SELF-surface scope; persistence until replaced | Does not define a performed fusion |
| mi, ni, ri, ne, rə, ro, ru | Performed inventory only | Listed in fused-reference inventory | Individual readings, scope and persistence not assigned |
| re | Performed partially recovered | TARGET-surface; starts Construction and persists until replaced | Shared numeral digit 4 collision; slot grammar unavailable |
| ra | Performed partially recovered | TARGET-path | Shared radian unit collision; no additional persistence rule inferred |
| mel | Worked-example only | me + anchor coda l, hand referent; MI surface-scope association | One example does not establish productive anchor-coda morphology |

Formal binder evidence is Phase 5.16 C-04/C-05 citing Phase 4 §3.3. The Performed inventory is recorded in the Phase 4 fused-reference inventory trail. Specific re/ra readings are in the standalone Phase 5.20 results JSON. MEL is supported by Phase 4 §8, Phase 5.15 MEL and Phase 5.16 C-05/C-09.

The original Phase 4 DOCX and PDF binary bodies remain unextracted in this environment. These source limitations remain; no claim of full recovery is made.

## 3. Case and layer boundaries

- Formal MI is not Performed mi.
- Formal me is not automatically a productive prefix for mel.
- mel remains one worked-example form; its coda cannot be generalised.
- re and ra remain slot-sensitive homophones. The website does not choose between Performed and Shared readings.
- A token spelling alone does not identify a unique syntactic slot.

## 4. Construction start and persistence

Phase 5.20 reports that Performed re is TARGET-surface and starts Construction, persisting until replaced. Existing formal binder evidence separately records persistence until replaced for MI/NI/RI/me. These statements are not merged into one universal rule: the full clause syntax and conditions for reference introduction/replacement remain unrecovered.

No evidence recovered here specifies a general clause delimiter, how a parser determines a homophonous token's slot, mandatory reference presence, reference cardinality, cross-clause scope, replacement syntax, landmark geometry, identity resolution or transformations. The seven-stage sequence's reference stage is not enough to infer these grammar rules.

## 5. Website and tests

Added a case-sensitive evidence register and exact-form inspector in Construction Studio. It never creates a binding. Eight Vitest cases were authored and registered; they have not been executed in this environment.

## 6. Companion source-ingestion workstream

The existing tools/extract_docx_structure.py is a useful first extractor, not a complete ingestion pipeline. The companion tool should inventory supported files read-only, extract DOCX paragraphs/tables, PDF text and ZIP members with format-specific readers, record path/byte length/SHA-256/tool version/warnings, preserve page and table provenance, compare duplicate transcriptions without assuming equivalence, and emit reviewable Markdown/JSON. Extracted claims must never be promoted automatically to canon or parser rules.

This means extracting the project's own source corpus, not indiscriminate external web scraping. Default behaviour should be read-only, and private documents should not be uploaded to third-party services.

## 7. Validation and release state

Tests are authored but not executed. No GitHub Actions were dispatched. Main and production remain untouched. Vercel preview build is the deployment check; preview readiness does not imply test execution.
