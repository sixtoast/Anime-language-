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

The documentation catalogue in `src/App.tsx` has **19 entries total**. The initial scan found 14 explicit `sourcePath` values and 5 entries without a path. The five missing paths have now been filled with grounded repository links, so all 19 entries have an explicit path; all 19 paths were checked against the current repository tree. See [Documentation Catalogue First-Pass Link Audit](DOCUMENTATION-CATALOGUE-LINK-AUDIT.md).

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

1. Verify all 19 catalogue source links in the browser and review the new source-type/provenance notes for accuracy; do not treat a link as proof that its content is canonical or complete.
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

Catalogue regression tests and the extracted search helper are in commit `515adf7292d198bae96f3660b8eac340d860c2f5`. [Run #167](https://github.com/sixtoast/Anime-language-/actions/runs/38449423763) completed with overall failure: all six new catalogue regression cases passed and type-check/build passed, but the existing surface-parser test “parses a decimal numeral with an explicit unit” failed. This parser test is outside the website-only scope and was not modified. The catalogue's pure filtering/data checks have CI evidence; UI/browser interaction remains unverified.

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

A Playwright browser suite is now part of CI for the Documentation catalogue. It exercises combined search/status/provenance filtering, reset behaviour, the empty state and recovery, source links for all 19 entries, and a narrow 360px viewport. The browser suite runs even when the existing Vitest suite reports an unrelated engine failure, provided Chromium installation succeeds. Its results must be assessed independently from the Vitest test step and production build. The suite's existence is not proof that it has passed; use the CI run tied to the commit as evidence.


### Browser finding — mobile overflow (2026-10-14)

Playwright run #186 found that the Documentation view exceeded a 360px viewport by 19px. The responsive source-list/detail layout has been changed to a single column at the mobile breakpoint. The fix remains Implemented — unverified until the strict 360px browser assertion passes on a recorded commit.

### Evidence-aware Development Cockpit recommendation — 2026-10-14

The Overview recommendation now derives its next action from the actual `Run website browser acceptance` step in the latest loaded CI run. A successful browser step advances the recommendation to shared source/research/fixture/test references (WEB-SH-01 / WEB-SH-02); a failed step keeps browser acceptance blocking; loading, missing, unavailable, skipped, or cancelled evidence cannot be interpreted as success. The card links to the exact latest CI run and displays its derived state. Added browser tests for successful, failed, and cancelled browser-step outcomes. This change is **Implemented — unverified** until CI executes the build and browser tests for its commit.

### Mobile overflow follow-up — CI run #188 (2026-10-14)

CI confirmed the first responsive-layout adjustment did not remove the 19px overflow: the page still measured 379px at a 360px viewport. The browser run also confirmed all three new Development Cockpit recommendation tests pass. A follow-up CSS fix now hides the nonessential specification-version chip at viewports up to 420px so the mobile top bar can fit its navigation and search controls. The strict 360px assertion remains unchanged; rerun CI before treating the fix as successful.

### Shared evidence-chain explorer — 2026-10-14

Added an initial, explicitly curated evidence-chain explorer to Research & Review. It currently links three known areas: provisional operator arity (LAN-005/LAN-006), dimensional primitives (LAN-010/LAN-011), and the recovered Phase 6G fixture-observation workflow. Each chain connects only repository paths and relationships that were checked against existing records, includes stable IDs where available, and carries a scope caveat. The explorer explicitly states that the graph is incomplete and that links do not prove implementation completeness or test success. Added integrity tests for stable IDs, duplicate/missing relationship detection and caveat presence, plus browser tests for visible chains, key links, and 360px overflow. Status: **Implemented — unverified** pending CI for this branch.

### Evidence-chain browser-test adjustment — 2026-10-14

The first browser run for the evidence-chain explorer confirmed the production build and existing seven browser checks, but the two new explorer checks timed out before reaching the content because the test required an exact accessible name that did not match the sidebar navigation button (which includes its navigation count). The selector now scopes to the sidebar and matches the navigation label. This is a test-harness correction, not a product acceptance pass; rerun CI on the corrected test commit before upgrading status.

### Evidence-chain mobile acceptance follow-up — 2026-10-14

The first corrected run confirms the explorer's three-chain rendering test passes and the production build passes. Its 360px test still timed out because it was using a navigation interaction that was not available in that mobile state. The test now follows the same working overview feature-card route as the desktop test before measuring document width. CI run #205 is checking this adjustment. The existing decimal-with-unit parser unit test remains the only reported unit failure; no Arcane parser behaviour was changed as part of this website work.

### Rule impact filtering in shared evidence explorer — 2026-10-14

Added a rule-ID selector to Research & Review. Selecting a mapped rule narrows the visible evidence chains to records explicitly associated with that rule, summarises the number of related chains and linked record references by record kind, and offers a clear-filter action. This is curated traceability, not automatic dependency discovery: only currently documented relationships appear, and unlinked or unrepresented dependencies remain possible. The selector is responsive at narrow viewports. Browser acceptance now exercises rule selection, chain filtering, and reset. Status: **Implemented — unverified** pending CI on this change.

### Documentation-to-evidence navigation — 2026-10-14

Documentation detail panels now show related curated evidence chains when the selected entry's source path exactly matches a node in the shared evidence model. A direct action opens Research & Review focused on that chain, with a clear return to all chains. The rule selector clears a focused-source view when the user chooses a rule, avoiding conflicting filters. Entries without a mapped chain do not show a fabricated relationship. Browser acceptance covers the source-to-chain path and restoring the full view. Status: **Implemented — unverified** pending CI.

### Strict per-test report freshness gate — 2026-10-14

The Test Suite and Development Cockpit now accept per-test statuses only when the published report's commit SHA and CI run ID match the latest main-branch CI run loaded by the page. When either differs, the stored report is labelled stale, per-test statuses and durations are withheld, and rows show STALE REPORT rather than reusing old pass/fail outcomes. The report metadata displays both the report run and the latest CI run. Browser tests cover both a matching report and a deliberately stale report. This is still bounded to the latest run represented by the existing GitHub API response; it is not a full historical run selector. Status: **Implemented — verification pending for latest commit**.

### Curated research record register — 2026-10-14

Research & Review now includes three source-backed records with stable IDs: the Phase 6G RE/RA historical-behaviour discrepancy, unresolved operator semantics, and the dimensional-primitives integration gap. Each record states its source path, status, next evidence action, and explicit interpretation caveat. The RE/RA record links the existing P6G-FX-011 and P6G-FX-012 fixture IDs; each record can focus its linked evidence chain when one is documented. These are unresolved research records, not approved language decisions. Unit tests validate stable IDs, source existence, fixture existence, caveats, and known chain references; browser acceptance covers the record-to-chain workflow. Status: **Implemented — verification pending for latest commit**.

### Side-by-side historical/current fixture observations — 2026-10-14

The RE/RA discrepancy record now renders the preserved inputs for P6G-FX-011 and P6G-FX-012 alongside the fixture expectation, current TypeScript parser observation, and historical behaviour recorded by source inspection. The display labels the current result as a live parser observation and clearly warns that archived Python behaviour has not been freshly executed. It also shows each observation's comparison classification and interpretation note. Browser acceptance checks both inputs and the distinct current/historical outcomes. This makes the discrepancy actionable without changing fixture expectations, parser semantics, or canon. Status: **Implemented — verification pending for latest commit**.

### Repository-level test discovery correction — 2026-10-14

A verification audit found that Vitest was configured to discover only `src/**/*.test.ts`, so repository-level integrity tests under `tests/` were not included in the unit run. The Vitest include list now also covers `tests/**/*.test.ts`, activating the evidence-chain and research-record integrity suites rather than leaving them present but unexecuted. Browser specs remain under `tests/browser/*.spec.ts` and are handled by Playwright separately. This is a test-discovery correction, not a relaxation of assertions. Status: **Implemented — verification pending for latest commit**.

### Stable Phase 6G surface-parser test traceability — 2026-10-14

Added stable IDs `SURF-001` through `SURF-019` to the provisional surface-parser regression tests and registered each case in `src/engine/testRegistry.ts`. The Test Suite now has a dedicated **Surface parser** filter; the CI summary publisher recognises `SURF-*` IDs; and a browser acceptance test checks that a run-matched `SURF-002` failure is displayed on the correct case with its duration, without leaking into other groups. Repository-level tests check unique registry IDs, source-path existence, all 19 source annotations, and the known decimal-with-unit case's explicit registration. This improves traceability only; it does not change parser behaviour or convert authored tests into passing results. Status: **Implemented — verification pending for latest commit**.

### Visible unmapped test results — 2026-10-14

The Test Suite now renders current-run `UNMAPPED` test results in a dedicated traceability-gap section beneath the stable registry. Each row retains its actual result, duration, source file and source link. The section is only shown when the report matches the latest CI run by both commit and run ID; stale reports remain withheld. The existing test search also filters these rows. Browser acceptance now verifies that a passing unmapped result remains visible beside the stable `SURF-002` failure. The Surface parser group is included in the state type as well as the rendered filter, preventing a UI/type mismatch. This does not relabel unmapped results as registry cases; it makes the mapping gap inspectable. Status: **Implemented — verification pending for latest commit**.

### Lexicon and fixture-audit result mapping — 2026-10-15

Expanded stable test identity to 31 additional cases: `LEX-001`–`LEX-006`, `LEXAUD-001`–`LEXAUD-003`, `CSV-001`–`CSV-005`, `LEXREG-001`–`LEXREG-007`, and `FIX-001`–`FIX-010`. The CI summary publisher recognises these IDs; the Test Suite exposes dedicated **Lexicon** and **Fixture audit** filters; registry integrity tests ensure every added ID is present in its source test; and browser coverage checks that run-matched outcomes appear in the correct group. These IDs describe implementation and evidence checks only and do not promote source lexicon content or fixture expectations to canon. Status: **Implemented — verification pending for latest commit**.

### Evidence, research and registry integrity result mapping — 2026-10-15

Added stable IDs `EVID-001`–`EVID-006`, `RES-001`–`RES-004`, and `REG-001`–`REG-004` to the repository-level evidence-chain, research-register and test-registry checks. The CI summary mapper recognises these prefixes, and the Test Suite exposes a **Workbench integrity** filter for the related registry records. Registry integrity coverage now verifies that lexicon, fixture-audit and workbench-integrity IDs are present in their source test annotations. Browser acceptance verifies that run-matched results appear in the correct Lexicon, Fixture audit and Workbench integrity groups. Status: **Implemented — verification pending for latest commit**.

### Documentation catalogue test mapping and completeness guard — 2026-10-15

Registered `WEB-DOC-REG-001`–`WEB-DOC-REG-009` under the **Documentation** Test Suite filter, covering catalogue identity, provenance, search, filters and source-path safety. Extended registry integrity checks to verify the documentation annotations and added `REG-005`, which scans Vitest `.test.ts` files and requires each stable test ID to match the registry exactly. This closes the previously identified gap where all 119 unit-test annotations were recognised by the CI report publisher but nine documentation catalogue tests were not yet represented in the workbench registry. Current source inspection found 119 unique annotated cases before the new completeness safeguard; the latest code still requires CI verification. Status: **Implemented — verification pending**.


### Source-backed Arcane grammar recovery matrix — 2026-10-15

Added `docs/grammar/GRAMMAR-RECOVERY-MATRIX.md` and linked it from the grammar index. The matrix separates the v3.0-L canonical baseline from Phase 5/6 historical prototype claims and current TypeScript capability, then assigns acceptance gates across surface syntax, alias lineage, lexical collisions, fixed arity, semantic typing, units/angles, bindings, control blocks, numerals, registers and physical feasibility. It prioritises recovering the exact Phase 4/decision evidence and resolving the `re`/`ra` collisions before changing parser behaviour. The matrix is a recovery index, not a new specification; no language forms or canonical decisions were changed. Status: **Documentation added — source recovery and CI verification remain open**.


## Language-development milestone — operator spelling lineage audit (2026-10-15)

Added [Operator Spelling Lineage Audit 01](research/operator-spelling-lineage-audit-01.md), based on the searchable archive index and the imported v3.0-L specification. The audit records seven historical alias-registry mappings, explicitly documents the conflicts with the currently imported canonical spellings, and names the missing Phase 4 §5.1 / D-032 / D-017 evidence required to resolve them. It also separates the `re`/`ra` lexical collisions from operator aliases. **No language form or parser behaviour was changed.** This is a source-reconciliation milestone, not a canon decision or a test-pass claim.


## Language-development milestone — FRASHA semantic recovery (2026-10-15)

Added [Semantic Recovery Audit 01 — FRASHA and the runtime boundary](research/semantic-recovery-audit-01-frasha.md). It captures archived Phase 6J/6K/6L evidence for a historical negate-versus-absolute-value mismatch, distinguishes arithmetic negation from negative numeral syntax and Boolean NOT, and sets integration criteria without assuming historical runtime code exists in the current TypeScript workbench. No parser, evaluator, or canon changes were made.


## Workbench implementation milestone — FRASHA caveat surfaced in operator registry (2026-10-15)

The provisional `FRASHA` operator contract in `src/engine/operatorContracts.ts` now links the semantic recovery audit and explicitly reports that archived Phase 6J/6K/6L evidence flags a historical negate-versus-absolute-value mismatch. It also keeps the negative-numeral-sign distinction and separation from Boolean NOT (`GRASH`) as open questions. No evaluation rule was enabled and no canon was changed. Added `[OPC-009]` in `src/engine/operatorContracts.test.ts` and registered it in `src/engine/testRegistry.ts`. During this update, the missing comma between `OPC-008` and `SURF-001` registry entries was corrected so the registry array is syntactically valid. CI run [#296](https://github.com/sixtoast/Anime-language-/actions/runs/38734036890) was pending at the last check; do not treat the change as verified until it completes.


## FRASHA implementation inventory and structural-parser guard (2026-10-15)

Added [FRASHA Current Workbench Implementation Inventory](research/frasha-current-workbench-inventory.md) after inspecting `operatorContracts.ts`, `auditParser.ts`, and `surfaceParser.ts`. The Phase 2 parser returns a structural call AST only; the Phase 6G prototype treats FRASHA as a unary operator and has no negative-prefix branch in its numeral routine. An integrated evaluator was not established by the inspected files, so the record avoids claiming no evaluator exists anywhere in the repository. Added `OPC-010` to verify that audit parsing yields an AST rather than a computed value, and registered it in the test catalogue. CI must confirm the new tests before they are marked verified.


## Operator alias evidence chain strengthened (2026-10-15)

Expanded `docs/research/operator-spelling-lineage-audit-01.md` after recovering the surrounding Phase 5.5/5.6 report excerpts from the archive index. The reconciliation report explicitly attributes seven legacy aliases to Phase 4 §5.1 and D-032; the Phase 5.6 report records 42/42 registry/lexicon consistency checks for each of v4 and v5 but cautions this does not prove parser/compiler integration. Static inspection now also documents the current TypeScript boundary: the CSV loader ingests explicit aliases, registry construction builds an alias map, and Phase 6G normalisation is opt-in. Canon and default parser behaviour remain unchanged.
