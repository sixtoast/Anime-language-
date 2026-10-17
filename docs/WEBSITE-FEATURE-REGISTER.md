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

The original documentation catalogue had **19 entries** at the time of the first-pass audit; it now has **28 entries** after adding nine incantation specification records. The initial scan found 14 explicit `sourcePath` values and 5 entries without a path. The five missing paths have now been filled with grounded repository links, so all 19 original entries had explicit paths after the audit correction; the nine newer incantation entries were added with repository paths checked against the tree. The current catalogue has 28 entries; browser acceptance is the remaining link/UI check. See [Documentation Catalogue First-Pass Link Audit](DOCUMENTATION-CATALOGUE-LINK-AUDIT.md).

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

The initial note incorrectly said 19 entries lacked an explicit `sourcePath`; that count meant total catalogue entries, not missing paths. The correct initial count was 5 missing paths out of 19 entries. Those five entries now have grounded links, with the source limitations recorded in the link audit.

## Required next audits

1. Verify all 28 catalogue source links in the browser and review the new source-type/provenance notes for accuracy; do not treat a link as proof that its content is canonical or complete.
2. Test catalogue search, selection, empty results, status labels, and source-link opening in the actual UI.
3. Audit the Overview's displayed status and task recommendation against current repository/CI data.
4. Exercise CI statuses: successful, failed, queued, running, skipped, cancelled, missing, and stale.
5. Trace Research & Review cards to actual source documents and fixture evidence; label unlinked records explicitly.
6. Record test evidence by commit. Do not upgrade any row to Verified until its acceptance checks have actually passed.


## Authoritative feature records

This section is the working tracker. The tables above are the readable overview; these stable IDs are used to carry features across phases and sessions. Priorities are relative website-work priorities, not estimates of percentage completion.

**Final-status vocabulary:** Planned, Implemented, Verified, Blocked, Out of scope. The descriptive first-pass status above may be more specific, but it must not be treated as verified. A record can be marked Verified only when its acceptance criteria have evidence tied to a commit.

| ID | Feature | Origin | Priority | Dependencies | Affected files/sections (initial, verify before edits) | Acceptance criteria | Verification evidence | Final status |
|---|---|---|---|---|---|---|---|---|
| WEB-OV-01 | Verified health and recent activity in Overview | Original five-section vision; product plan | High | CI status model; repository metadata | `src/App.tsx`, `src/styles.css`, CI workflow data | Commit/run links and timestamps are real; stale/missing data is labelled; no inferred green status | Not yet audited end-to-end | Implemented — unverified |
| WEB-OV-02 | Evidence-backed next website task recommendation | Development Cockpit proposal | High | Feature register; task priorities/dependencies; source links | src/App.tsx, src/styles.css, website plan/register | Exactly one useful next task includes reason, dependencies, files, acceptance criteria, and verification path; no fabricated progress | Overview now recommends browser acceptance of the documentation catalogue because search/filter data tests and source-path checks exist but browser interactions and responsive layouts remain unverified. Card links to Documentation, Test suite, and feature register; the task is explicitly not marked complete. | Implemented — unverified |
| WEB-DOC-01 | Searchable documentation catalogue | Existing Documentation section | High | Existing catalogue data | `src/App.tsx`, `src/documentationCatalogue.ts`, `src/documentationCatalogue.test.ts`, source inventory | Search covers titles, topics, status, and provenance; selection/status UI works; empty results are clear; source links open correctly | Six catalogue regression tests passed in run #167; type-check/build passed; overall CI failed on the existing surface-parser decimal-with-unit test; UI/browser interaction not yet checked | Implemented — unverified |
| WEB-DOC-02 | Source link and path integrity | Original source-library vision | High | WEB-DOC-01 | `src/App.tsx`, repository paths, `docs/DOCUMENTATION-CATALOGUE-LINK-AUDIT.md` | Every entry is classified; each claimed file link points to an existing file; browser interaction checked; missing sources remain explicit | 19/19 entries have explicit paths that were checked against the repository tree; WEB-DOC-REG-007 now guards path existence and repository-relative safety in CI (new check awaits CI evidence); browser interaction not checked | Partially implemented |
| WEB-DOC-03 | Provenance, authority, version, and status metadata | Product plan and original vision | High | WEB-DOC-02; source inventory | `src/App.tsx`, source inventory and documentation | Each entry shows source type and a caveat; source provenance stays distinct from canonical/provisional status and implementation verification | Source type/note fields added for all 19 catalogue entries; browser review still pending | Implemented — unverified |
| WEB-DOC-04 | Duplicate, missing-metadata, and source-recovery gap visibility | Source recovery plan | Medium | WEB-DOC-02; archive inventory | `sources/SOURCE-INVENTORY.md`, `src/App.tsx`, `src/styles.css` | UI states actual known gaps and audit depth; does not claim complete recovery without evidence | Added an Overview source-recovery panel with dated structural counts, PDF-extraction and empty-file gaps, duplicate caveat, and links to inventory/catalogue/review. Awaiting CI and browser/responsive acceptance checks. | Implemented — unverified |
| WEB-PLAY-01 | Reliable existing Playground interactions and errors | Existing Playground; Interactive Language Lab vision | High | Existing supported modes | `src/App.tsx`, `src/styles.css` | Inputs and outputs remain usable; errors/empty states are clear; failure in one area does not break app | UI and error states not yet exercised systematically | Implemented — unverified |
| WEB-PLAY-02 | Actual versus illustrative/provisional output labels | Original Playground vision | High | WEB-PLAY-01; evidence/status vocabulary | `src/App.tsx`, related docs | UI makes actual output, historical observation, illustration, and unsupported behaviour distinguishable | Not yet audited | Planned / audit required |
| WEB-PLAY-03 | Playground links to related source and test evidence | Shared-information vision | Medium | Shared IDs/relationship model; WEB-DOC-02 | `src/App.tsx`, fixture records, source catalogue | Only evidence-backed relationships are shown; missing relationships are labelled | Relationship coverage not yet audited | Planned |
| WEB-TEST-01 | Separate overall CI, tests, and website build statuses | Original Test Suite plan | High | GitHub Actions step data | `src/App.tsx`, `src/styles.css` | Build result cannot be mistaken for test or overall workflow result | Website Build card committed in `a352f0f`; runs #157–#159 show build step passed and test step failed | Implemented — unverified |
| WEB-TEST-02 | Honest workflow/step state handling and run history | Original Test Suite plan | High | WEB-TEST-01; GitHub Actions data | `src/App.tsx` | Success/failure/queued/running/skipped/cancelled/unavailable/stale states are accurate; run links are real | CI inspected through run #159; full UI state matrix not tested | Partially implemented |
| WEB-TEST-03 | Authored test count versus executed results | Original Test Suite plan | High | Existing test registry and result artifact | `src/App.tsx`, CI workflow | UI labels registered/authored cases separately from tests executed in a specific run | Existing UI path observed; count accuracy not fully audited | Partially implemented |
| WEB-TEST-04 | Website-specific regression suite | Phase 6 roadmap | High | Stable component boundaries; feature acceptance criteria | `src/**/*.test.*`, test configuration | Search, navigation, links, status rendering, errors/empty states, and responsive summary layout have website-focused regression tests | Not yet inventoried/tested | Planned |
| WEB-REV-01 | Source-backed research and review records | Existing Research & Review section; product plan | High | Source references; status vocabulary | `src/App.tsx`, `docs/research/`, `sources/originals/` | Each of the five review cards links to a grounded source document; claims, evidence, proposals, decisions, and verified implementation remain distinct | Added direct source links for FRAPA/Phase 2 syntax, Phase 4 historical audit, Phase 5 historical audit, Phase 6G lexicon audit, and Phase 6G fixture harness. Path existence is based on the current catalogue/inventory; browser click acceptance and full content traceability remain pending. | Implemented — unverified |
| WEB-REV-02 | Decision history, alternatives, and approval boundaries | Research & Decision Studio vision | Medium | WEB-REV-01; review-record model | `src/App.tsx`, research docs | Alternatives and unresolved states remain visible; proposals are never presented as approved canon | Not yet audited | Planned |
| WEB-SH-01 | Shared source, review, fixture, test, and work-item references | Shared foundation in master plan | High | Phase 0 data inventory | Existing catalogue/fixtures/research data; possible small TS/JSON/Markdown records | Shared records reused where practical; relationships only added when grounded; unknown links remain unknown | Repository structures identified, relationship map incomplete | Planned |
| WEB-SH-02 | Cross-section navigation and impact view | Original shared-data vision | Medium | WEB-SH-01; stable IDs | `src/App.tsx`, catalogue and fixture records | A user can follow known source → review/example/fixture → test evidence; incomplete coverage is disclosed | Not yet implemented/verified as a complete flow | Planned |
| WEB-COP-01 | Evidence-backed Development Copilot workflow | Six-capability vision | Medium | WEB-OV-02; WEB-SH-01; reliable status data | `src/App.tsx`, master plan/register | Recommends tasks and gathers context; any proposed change is reviewable; never silently changes canon or engine | Product-plan concept only; no verified copilot workflow found in first pass | Planned |
| WEB-UX-01 | Responsive layouts across five sections | Phase 7 roadmap | High | Existing UI inventory | `src/styles.css`, `src/App.tsx` | Core flows work at supported desktop/tablet/mobile widths without harmful overflow | Four-card CSS layout adjusted; full responsive audit pending | Partially implemented |
| WEB-UX-02 | Accessibility and keyboard usability | Phase 7 roadmap | High | WEB-UX-01; stable UI | `src/App.tsx`, `src/styles.css` | Keyboard focus, semantic labels/headings, contrast, and status announcements checked | Added a consistent `:focus-visible` outline for links, buttons, form controls, and tabindex elements, including editor/search inputs that reset native outlines. Keyboard traversal, contrast, screen-reader announcements, and browser acceptance remain unverified. | Implemented — unverified |
| WEB-REL-01 | Deployment and release verification | Phase 8 roadmap | High | Reliable tests/build; deployment access | Deployment configuration and website | Deployed primary flows and runtime configuration verified, or unavailable access documented | Deployment not verified in this audit | Planned |
| WEB-SCOPE-01 | Preserve website-only boundary | Explicit owner instruction | Critical | Applies to every task | All changes reviewed for scope | No vocabulary, grammar, parser/AST, operator, semantic, dimensional, or spell-feasibility changes without explicit owner authorisation | Boundary recorded in master plan and historical roadmap notice | Active guardrail |

## Current CI evidence snapshot

Historical baseline: catalogue regression tests and the extracted search helper are in commit `515adf7292d198bae96f3660b8eac340d860c2f5`. [Run #167](https://github.com/sixtoast/Anime-language-/actions/runs/38449423763) also failed on the decimal-numeral assertion. The latest inspected [run #492](https://github.com/sixtoast/Anime-language-/actions/runs/39015264306) passed the TypeScript/production build and all four browser acceptance tests; its unit-test failure was a test expectation mismatch: a binary `FRAPA` expression contained two operands, but the test expected one. The assertion was corrected in commit `5efda89` to check both operands without modifying parser or language semantics. Run #493 is in progress. Do not treat the suite as green until the corrected test passes in CI.

## Register maintenance rules

- Create a stable ID for each newly identified atomic website feature before implementation.
- Record origin, priority, dependencies, likely files/sections, acceptance criteria, verification evidence, and final status.
- Recheck affected paths against the current repository before editing; these paths are initial evidence, not permission to assume file contents remain unchanged.
- Update status only when evidence justifies it. Use commit SHAs and CI run links rather than “works” or “done” alone.
- If an acceptance criterion is blocked by an out-of-scope engine failure, keep that dependency explicit and continue unrelated website work where safe.
- The register tracks features across phases; phases do not replace the feature IDs.


### CI correction note (2026-10-13)

The first implementation of `WEB-DOC-REG-007` caused TypeScript build errors by importing Node filesystem modules without Node type declarations. The check has been rewritten to use Vite's repository file glob and does not add a dependency or modify engine files. Await CI results on the corrected commit before marking it passed.


### Research & Review evidence-link update (2026-10-14)

The five review cards now carry explicit repository-relative `sourcePath` values and render direct GitHub links to the related Phase 2 syntax audit, preserved Phase 4 and Phase 5 DOCX files, Phase 6G lexicon audit, and Phase 6G fixture observation harness. These links improve traceability but do not establish that a source claim is correct, canonical, or fully audited. Browser click checks and current-commit CI evidence remain pending.


### Keyboard focus baseline (2026-10-14)

A shared `:focus-visible` style now makes keyboard focus visible across links, buttons, form controls, and tabindex elements. The search and editor inputs receive an inset outline to avoid clipping at their edges. This is a baseline usability improvement, not a completed accessibility audit; keyboard traversal, contrast, screen-reader announcements, and browser-level acceptance still need checking.


### Navigation semantics baseline (2026-10-14)

The five-section sidebar is now exposed as a named navigation landmark (`Main sections`) and the active section button carries `aria-current="page"`. This is a focused semantic improvement, not evidence of a complete screen-reader audit. WEB-UX-02 remains Implemented — unverified pending browser acceptance.


### Catalogue source-path regression coverage (2026-10-14)

Added WEB-DOC-REG-008 to compare all catalogue source paths against Vite's repository file inventory at test time. This guards against broken catalogue links as files move or are renamed. CI must confirm the glob covers the intended source folders before the test is treated as verified; external/browser link behaviour remains a separate acceptance item.


### CI test-summary reporting correction (2026-10-14)

Run #179 confirmed the new `WEB-DOC-REG-008` source-path regression passes, but also exposed a reporting issue: `scripts/publish-test-summary.mjs` recognised only engine test ID families and returned exit code 1 whenever any test was unmapped. The reporting step now recognises the website catalogue regression ID family and treats remaining unmapped results as a visible warning instead of a test failure. The Vitest step remains responsible for pass/fail; the overall workflow still correctly fails when a real test fails. Verify this separation in the next CI run.


## Development Cockpit live status panel (2026-10-14)

The Overview now reuses the same live GitHub Actions state and published per-test report already fetched for the Test Suite. It distinguishes latest workflow conclusion, the type-check/build step, and per-test report availability/counts; it flags a report whose commit differs from the latest workflow commit rather than presenting the two as one coherent snapshot. The panel links directly to the Test Laboratory and latest run. This is a data-backed status summary, not a task recommendation engine or browser-verified acceptance.

### Documentation facets by status and provenance — WEB-DOC-REG-009 (2026-10-14)

Added separate source-status and provenance-type filters to the Documentation catalogue, composable with full-text search. The result count reflects the combined filters; reset clears all three, and the detail pane follows the first visible result if the previous selection is filtered out. Automated coverage exercises canonical-only filtering, historical original-source filtering, combined query/status/type filtering, and an empty status category. Browser and assistive-technology acceptance remains pending.

### Development Cockpit next-task recommendation — WEB-OV-02 (2026-10-14)

The Overview now presents one prioritized website task: perform browser-level acceptance of the documentation catalogue's combined search/status/provenance filters, result selection, repository source links, empty state, and responsive layout. This is grounded in the existing WEB-DOC-01 and WEB-DOC-02 acceptance gaps. The card records the reason, dependency, affected files, acceptance criteria, and navigation to the relevant work areas. It is a curated recommendation, not an autonomous task tracker, and it does not imply that browser acceptance has already occurred.


## Browser-level acceptance coverage (WEB-DOC-03)

A Playwright browser suite is now part of CI for the Documentation catalogue. It exercises combined search/status/provenance filtering, reset behaviour, the empty state and recovery, source links for all 28 entries, and a narrow 360px viewport. The browser suite runs even when the existing Vitest suite reports an unrelated engine failure, provided Chromium installation succeeds. Its results must be assessed independently from the Vitest test step and production build. The suite's existence is not proof that it has passed; use the CI run tied to the commit as evidence.


### Browser finding — mobile overflow (2026-10-14)

Playwright run #186 found that the Documentation view exceeded a 360px viewport by 19px. The responsive source-list/detail layout has been changed to a single column at the mobile breakpoint. The fix remains Implemented — unverified until the strict 360px browser assertion passes on a recorded commit.


### Incantation source catalogue expansion — WEB-DOC-04 (2026-10-17)

Added nine versioned incantation design specifications (v1.0–v1.8) to `src/documentationCatalogue.ts`. They use the existing five-section navigation and source-detail panel; no new top-level section or engine behaviour was introduced. Catalogue regression and browser tests were expanded from 19 to 28 entries. The initial browser run exposed a stale filtered-count expectation and 19px horizontal overflow at a 360px viewport. The count expectation and mobile header styles were corrected, and the Overview's acceptance-task wording was updated. Run #495 completed successfully on commit `52ad269`: the unit suite, TypeScript/production build and all four Documentation browser checks passed. The Vercel production deployment is READY for the same full commit SHA. The prior decimal-fixture mismatch was corrected in `5efda89` without changing parser behaviour. WEB-DOC-04 is now verified by automated CI; broader live manual accessibility checks remain open.

| ID | Feature | Origin | Priority | Dependencies | Affected files/sections | Acceptance criteria | Verification evidence | Final status |
|---|---|---|---|---|---|---|---|---|
| WEB-DOC-04 | Incantation source catalogue coverage | Current incantation design-document series; existing Documentation section | High | Existing source catalogue and valid repository paths | `src/documentationCatalogue.ts`, `src/documentationCatalogue.test.ts`, `tests/browser/documentation.spec.ts`, Documentation UI | All nine specs appear exactly once, retain correct repository paths and visible source-status caveats; filters/search still work; all 28 links open; no mobile horizontal overflow at 360px | CI #495 passed unit tests, production build and all four Documentation browser tests; subsequent Overview acceptance passed in #499. Current documentation catalogue acceptance is verified by automated CI; live manual accessibility remains separate | Verified (automated CI) |

### Website runtime status and deployment evidence — 2026-10-17

The Vercel project exists and the latest inspected production-target deployment was READY on commit `cce1d530f1603b2b245567b2d7dbb77c12612c9e`. This establishes deployment-provider state, not that every live flow has been manually tested. The project reports SSO protection enabled for deployment URLs except custom domains; the public custom domain should be checked separately for actual accessibility. Current production/browser acceptance remains open until the final commit's checks and the live site's primary flows are verified.


### Overview health panel browser acceptance — WEB-OV-03 (2026-10-17)

The Overview's next-task card was stale after the Documentation browser suite passed. It now prioritises verifying health signals and recovery states instead of claiming the catalogue browser checks are still pending. Added deterministic Playwright tests that mock GitHub Actions and the per-test report endpoint so the panel can be tested without depending on GitHub availability.

| ID | Feature | Origin | Priority | Dependencies | Affected files/sections | Acceptance criteria | Verification evidence | Final status |
|---|---|---|---|---|---|---|---|---|
| WEB-OV-03 | Overview health-signal browser acceptance | Existing Development Cockpit live-health panel and plan's evidence-first policy | High | Existing workflow/report loader and Playwright harness | `src/App.tsx`, `tests/browser/overview.spec.ts`, website implementation plan | Matching run/report commit; stale report explicitly flagged; valid report survives workflow endpoint failure; build failure shown separately; no 360px page overflow | Five deterministic Playwright checks in `tests/browser/overview.spec.ts` passed in [CI #499](https://github.com/sixtoast/Anime-language-/actions/runs/39015800969), commit `9f02494`; unit tests and production build also passed. Live manual review remains separate | Verified (automated CI) |


### WEB-OV-03 verification result — 2026-10-17

CI #499 passed all five Overview browser checks: matching health signals, stale-report detection, independent report availability during workflow API failure, separate build failure state, and no horizontal overflow at 360px. Unit tests and the production build also passed. These tests use deterministic mocked endpoints; they validate UI state handling but do not test the availability of GitHub's live APIs.


### Playground Phase 6G parser integration — WEB-PLAY-01 (2026-10-17)

The Playground previously invoked the Phase 2 audit parser while its copy implied that it was the active expression workbench. It now invokes `parseSurfaceExpression` from `src/engine/surfaceParser.ts`; the old audit parser and tests remain available as a distinct historical/provisional notation. UI examples, operator list, diagnostic token positions, and the syntax-only caveat were updated. Four browser tests were added to verify valid binary syntax, a specific malformed-numeral diagnostic, clearing prior output, and visible scope boundaries.

| ID | Feature | Origin | Priority | Dependencies | Affected files/sections | Acceptance criteria | Verification evidence | Final status |
|---|---|---|---|---|---|---|---|---|
| WEB-PLAY-01 | Connect Playground to implemented Phase 6G parser | Development Studio Plan: staged validation pipeline and truthful engine support | High | Existing `parseSurfaceExpression`, Playwright harness | `src/App.tsx`, `tests/browser/playground.spec.ts` | UI calls the surface parser; displays actual AST/diagnostics; no stale Phase 2 wording; scope caveat remains visible; browser acceptance passes | Initial four checks passed in [CI #507](https://github.com/sixtoast/Anime-language-/actions/runs/39016199842); source-aware v5 draft lexicon was then wired into the Playground with alias rewriting off by default. Three more checks cover source-backed atom recognition, collision rejection and no implicit legacy alias rewrite. [CI #510](https://github.com/sixtoast/Anime-language-/actions/runs/39016351995), commit `ace94dd`, passed unit tests, production build and browser acceptance | Verified (automated CI) |


### WEB-PLAY-01 verification — 2026-10-17

CI #510 passed the full unit suite, TypeScript/production build and browser acceptance. The Playground uses the pinned v5 draft source lexicon through the existing registry API. Seven browser cases verify parser success/diagnostics, output reset, explicit scope caveats, source-backed `pa`, ambiguity rejection, and disabled-by-default legacy alias rewriting. Source loading has no canon effect. The Phase 2 audit parser remains preserved as a separate prototype.


### WEB-PLAY-02 — Source lexicon inspector (2026-10-17)

| ID | Feature | Origin | Priority | Dependencies | Affected files/sections | Acceptance criteria | Verification evidence | Final status |
|---|---|---|---|---|---|---|---|---|
| WEB-PLAY-02 | Provenance-aware exact-form lexicon inspector | Development Studio Plan shared SourceRecord/RuleRecord model; pinned Phase 6G v5-draft lexicon | High | Bundled source CSV loader and lexicon registry | `src/App.tsx`, `src/styles.css`, `src/engine/lexiconRegistry.ts`, `tests/browser/playground.spec.ts` | Show exact source fields and status; preserve collisions; show alias evidence without auto-rewriting; unknown lookup does not declare global invalidity; responsive at 360px | [CI #516](https://github.com/sixtoast/Anime-language-/actions/runs/39016782698) passed unit tests, build and browser acceptance | Verified (automated CI) |

### WEB-PLAY-03 — Source fixture browser (2026-10-17)

| ID | Feature | Origin | Priority | Dependencies | Affected files/sections | Acceptance criteria | Verification evidence | Final status |
|---|---|---|---|---|---|---|---|---|
| WEB-PLAY-03 | Load source-derived fixtures into the Playground | Development Studio Plan: fixture-driven language laboratory | High | Versioned Phase 6G fixture JSON and provisional parser | `src/App.tsx`, `src/engine/phase6gFixtureAudit.ts`, `src/styles.css`, `tests/browser/playground.spec.ts` | Preserve fixture ID, category, source expectation, canon status, evidence and notes; load without automatic execution; show current parser output independently; highlight conditional and historical divergences | [CI #520](https://github.com/sixtoast/Anime-language-/actions/runs/39016988588) passed unit tests, build and browser acceptance | Verified (automated CI) |

### WEB-TRACE-01 verification — 2026-10-17

CI runs [#527](https://github.com/sixtoast/Anime-language-/actions/runs/39017761622) and [#528](https://github.com/sixtoast/Anime-language-/actions/runs/39017829323) verified explicit test-to-registry identity mapping and hardened report validation. Run #528 passed all 105 tests, with 105/105 stable test IDs and zero unmapped results. The reporting script validates candidate IDs against both explicit engine registry IDs and the explicit website catalogue regression IDs; remaining unknown IDs remain UNMAPPED rather than fuzzy-matched. This verifies the current reporting suite, not a universal guarantee that every future test is automatically traceable.



### WEB-TRACE-01 — Explicit test-to-source traceability queue (2026-10-17)

| ID | Feature | Origin | Priority | Dependencies | Affected files/sections | Acceptance criteria | Verification evidence | Final status |
|---|---|---|---|---|---|---|---|---|
| WEB-TRACE-01 | Map executed tests to registry entries and source fixtures where identity is explicit | Development Studio Plan: fixture-driven laboratory, shared record model and implementation evidence | High | Existing `src/engine/testRegistry.ts`, Phase 6G fixture suite, CI report generator | Overview recommendation, test registry, fixture audit, report mapping and tests | Exact identity mappings only; mapped/unmapped counts agree with report records; ambiguous records remain unmapped; every new mapping has a regression test; no fuzzy matching or canon inference | Queued based on CI #520 report showing unmapped records; implementation not yet started | Planned |


### WEB-INC-RES-01 — Incantation resource-design fixture browser (next)

| ID | Feature | Origin | Priority | Dependencies | Affected files/sections | Acceptance criteria | Verification evidence | Final status |
|---|---|---|---|---|---|---|---|---|
| WEB-INC-RES-01 | Browse v1.9 resource-accounting specification fixtures separately from executable tests | Arcane Incantations v1.9; Development Studio Plan fixture-driven validation | Medium | Locked v1.9 specification and Playground fixture browser | Playground, fixture metadata, tests, documentation catalogue | Expose all 60 RES19 fixtures with IDs and expected outcomes; label them specification fixtures, not executed tests; preserve source link and unresolved/runtime caveat; never make fixture selection appear to run a spell or prove physical feasibility | [CI #550](https://github.com/sixtoast/Anime-language-/actions/runs/39019851869) passed unit tests, production build and browser acceptance; includes 360px layout check | Verified (automated CI) |


### WEB-INC-RES-01 verification — 2026-10-17

Run [#550](https://github.com/sixtoast/Anime-language-/actions/runs/39019851869) passed. The resource browser reads all 60 fixture rows directly from the v1.9 canonical Markdown, shows stable IDs/case/expected outcome, links to the full specification, labels records as design fixtures rather than executed tests, and keeps the non-runtime caveat visible. Browser acceptance confirms fixture selection does not run a spell and the layout remains within a 360px viewport. A duplicated fragment in the Documentation browser test file was removed before the successful run.


### WEB-INC-RES-01 production reconciliation — 2026-10-17

The resource fixture browser is included in Vercel production deployment [`dpl_9GC3cyrAC9GjAyR8WwV8caud4bV5`](https://vercel.com/sixtoast1/anime-language/dpl_9GC3cyrAC9GjAyR8WwV8caud4bV5), state READY, commit `d5883c3`, with alias `https://anime-language.vercel.app/`. CI [#551](https://github.com/sixtoast/Anime-language-/actions/runs/39019993840) passed. Automated checks and deployment status are confirmed; manual live-device review remains a separate task.


### WEB-INC-AUTH-01 — Incantation authority-decision fixture browser (planned)

| ID | Feature | Origin | Priority | Dependencies | Affected files/sections | Acceptance criteria | Verification evidence | Final status |
|---|---|---|---|---|---|---|---|---|
| WEB-INC-AUTH-01 | Browse v2.0 authority-decision specification fixtures separately from executable tests | Arcane Incantations v2.0; Development Studio Plan fixture-driven validation | High | Locked v2.0 specification and existing Playground specification browser | Playground, authority fixture parser/tests, documentation catalogue, Overview queue | Expose all 60 AUTH20 fixtures with stable IDs and expected outcomes; preserve link to full source; label as design expectations, not executed permission decisions; selecting a fixture does not run parser or authority service; mobile layout remains within 360px; document that all non-permit states block the authorisation gate | Planned after v2.0 specification commit; automated acceptance not yet implemented | Planned |
