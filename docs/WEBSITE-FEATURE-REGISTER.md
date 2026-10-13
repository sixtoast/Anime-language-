# Website Feature Register

**Status:** First-pass implementation audit; not a claim of full verification  
**Audit date:** 2026-10-13  
**Scope:** Anime Language Development Studio website only  
**Authoritative plan:** [Website Master Implementation Plan](WEBSITE-MASTER-IMPLEMENTATION-PLAN.md)

## Status key

- **Implemented — unverified:** a corresponding UI or data path exists, but acceptance criteria have not all been exercised.
- **Partially implemented:** some of the intended capability exists; material requirements remain.
- **Audit required:** the feature needs systematic inspection and evidence before its status can be upgraded.
- **Blocked/out of scope:** blocked by missing evidence or explicitly belongs to the separate language-engine workstream.

Do not interpret “implemented” as “verified”. A file existing or a historical test report is not proof that the current deployed website works.

## Five-section inventory

| Section/capability | Evidence in current repository | First-pass status | Main remaining work |
|---|---|---|---|
| Overview / Development Cockpit | `src/App.tsx` contains the Overview workspace, feature links, and project-principles notice. | Partially implemented | Audit whether current verified status, blockers, recent changes, source gaps, review decisions, and one evidence-backed next task are all represented and current. |
| Documentation / Source Library | `src/App.tsx` has a searchable document list, selected-document detail panel, status/category, and GitHub source link. | Partially implemented | Audit entries against repository paths; add provenance/version/authority metadata; distinguish missing source links from intentionally conceptual entries; inspect catalogue coverage. |
| Playground / Interactive Workspace | `src/App.tsx` contains the existing interactive workspace; engine code and fixtures are separate under `src/engine/` and `tests/fixtures/`. | Implemented — unverified | Exercise loading/error/empty states and verify actual-vs-illustrative labels and source/test cross-links. Do not change engine semantics under this register. |
| Test Suite / Build Laboratory | `src/App.tsx` displays test registry information, published per-test results when available, latest CI status, and a distinct Website Build card. | Partially implemented | Validate all workflow/step states, stale/unavailable handling, accurate counts, and links to logs. Fresh CI run #157 had a successful type-check/build step but failed the test step. |
| Research & Review / Evidence Centre | `src/App.tsx` displays five review topics and Phase 6G fixture observations, with caveats separating observations from CI and canon decisions. | Partially implemented | Add/verify direct evidence links for review topics, structured decision status and provenance, and relationships to sources/fixtures/tests where known. |

## Six connected capabilities

| Capability | Website-side implementation evidence | Status | Acceptance gap |
|---|---|---|---|
| Language Workshop | Documentation catalogue and source-aware rule/reference descriptions in `src/App.tsx`; rule catalogue at `docs/rules/rule-catalogue.json`. | Partially implemented | Audit provenance and rule/source relationships. Any editing remains proposal-only unless separately authorised. |
| Interactive Language Lab | Existing Playground plus parser fixture observations displayed in Research & Review. | Implemented — unverified | Verify UX and diagnostic states. Engine correctness is a separate workstream and is not implied by UI presence. |
| Canon & Consistency visibility | Rule catalogue, implementation evidence matrix, audit/research records, and status pills. | Partially implemented | Ensure the UI distinguishes canonical source, provisional interpretation, implementation, and executed test evidence. No canon changes in website work. |
| Research & Decision Studio | Five research cards, review protocol, fixture observations, and research documents. | Partially implemented | Improve source links, decision/approval records, alternatives, and relationship coverage. |
| Language Test Laboratory | Test registry, CI summary, build-step status, and fixture observation summary. | Partially implemented | Exercise step-state mapping and clearly distinguish authored tests, browser observations, historical reports, and executed CI. |
| Development Copilot | Product plan describes evidence-backed next-task recommendations; current Overview has navigation and principles but no verified recommendation workflow established by this audit. | Audit required | Confirm whether a real recommendation exists; if not, implement one derived from actual repository status with rationale, dependencies, files, and acceptance criteria. |

## First-pass source-link audit

The documentation catalogue in `src/App.tsx` currently has **14 unique explicit `sourcePath` values**. Each of those 14 paths was compared with the current recursive repository tree on 2026-10-13; all 14 paths existed at that point.

The 14 checked paths are:

- `docs/canon/magic-system-v3.0.md`
- `docs/canon/arcane-language-v3.0-L.md`
- `docs/audits/phase-2-formal-syntax.md`
- `docs/audits/continuity-recovery-and-test-register.md`
- `docs/rules/rule-catalogue.json`
- `docs/audits/canon-implementation-evidence-matrix.md`
- `src/engine/auditParser.md`
- `src/engine/dimensions.md`
- `src/engine/semanticTypes.md`
- `src/engine/operatorContracts.md`
- `docs/DEVELOPMENT-STUDIO-PLAN.md`
- `docs/research/phase6g-v5-source-lexicon-audit-01.md`
- `docs/research/phase6g-fixture-observation-harness-01.md`
- `docs/research/phase6g-diagnostic-comparison-ledger-01.md`

This is a path-existence check, not a browser click test and not a claim that the content of each document has been audited. The links are constructed from the repository's `main` branch, so they resolve to the current branch contents rather than pinning a specific commit.

The initial code scan also found **19 catalogue entries without an explicit `sourcePath`**. Some may intentionally represent open questions or conceptual topics rather than documents. They must be classified individually; do not automatically invent a file or treat every source-less entry as a defect.

## Required next audits

1. Inspect each source-less catalogue entry and classify it as a conceptual topic, an open question, a missing source, or a record that needs a real link.
2. Test catalogue search, selection, empty results, status labels, and source-link opening in the actual UI.
3. Audit the Overview's displayed status and task recommendation against current repository/CI data.
4. Exercise CI statuses: successful, failed, queued, running, skipped, cancelled, missing, and stale.
5. Trace Research & Review cards to actual source documents and fixture evidence; label unlinked records explicitly.
6. Record test evidence by commit. Do not upgrade any row to Verified until its acceptance checks have actually passed.
