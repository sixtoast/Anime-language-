# Anime Language Development Studio — Website Master Implementation Plan

**Status:** Active planning baseline  
**Scope:** Development Studio website and its documentation, evidence, reporting, usability, and delivery workflows only  
**Repository:** [sixtoast/Anime-language-](https://github.com/sixtoast/Anime-language-)  
**Last reconciled:** 2026-10-13

> **Scope boundary:** This plan is for the website. It does not authorize changes to Arcane canon, vocabulary, grammar, parser/engine behaviour, operator semantics, spell mechanics, or physical-feasibility rules. Those are a separate project workstream and remain out of scope unless the owner explicitly changes this boundary.

## 1. Purpose and completion target

Finish a reliable, understandable, maintainable website that makes the existing Arcane source archive, research history, fixtures, and engineering status easier to inspect. The website must distinguish source evidence from interpretation, plans from implementation, and authored tests from tests actually executed.

The website can be complete while the language and magic system remain in development. Do not use website completion as evidence that the language engine is complete.

### Website completion definition

The website is ready for its first dependable release when:

- the application installs, type-checks, tests, and produces a production build reproducibly;
- all five existing sections work and are usable on desktop and mobile;
- source catalogue entries lead to real repository sources and display honest provenance/status;
- CI reporting shows the run, commit, and step-level outcomes without conflating build status with test status;
- overview recommendations and issue summaries are based on current, traceable repository data;
- research records, documents, fixtures, and test evidence link to each other where a real relationship is known;
- loading, empty, unavailable, failed, and stale states are clearly distinguished;
- accessibility, navigation, and error states receive a focused regression check;
- deployment and release status are checked and documented rather than assumed.

## 2. Product structure: retain the five existing sections

The six capabilities below are connected product capabilities, not six new top-level pages. Deliver them inside the existing navigation.

### A. Overview — Development Cockpit

- Current commit and latest CI run, with timestamps and links.
- Separate website build, automated test, and overall workflow statuses.
- Top blockers/issues ranked by impact and dependency, using verified project evidence.
- Recent website changes and source/research updates.
- Source-recovery gaps and decisions awaiting review.
- One recommended next website task with rationale, dependencies, affected files, and acceptance criteria.
- Clear stale-data, loading, unavailable, and no-data states.
- Never claim a task is complete or a check passed without evidence.

### B. Documentation — Source and Knowledge Library

- Searchable catalogue of specifications, original uploads, archive reports, transcriptions, summaries, research records, code, fixtures, and reports.
- Working links to real repository files and source locations.
- Provenance: user-supplied original, imported transcription, derived summary, proposal, implementation note, or generated report.
- Status: canonical, historical, provisional, implemented, verified, superseded, or unresolved where applicable.
- Known version/date/authority metadata and preservation status.
- Identify duplicates, missing metadata, broken links, untraceable entries, and source-recovery gaps.
- Preserve originals; do not silently overwrite, rename, discard, or promote material.
- Clearly label archive inventory as structural or content-audited, whichever is actually true.

### C. Playground — Interactive Workspace

- Reliable input/output and clear diagnostic display for the existing supported modes.
- Explicitly label illustrative, provisional, historical, and implemented behaviour.
- Show input errors and runtime failures without crashing the page.
- Link output and diagnostics to related documentation and fixtures when mappings exist.
- Display syntax/AST or other current outputs only where the current implementation actually supports them.
- Keep unsupported features visibly unsupported or unresolved; do not invent behaviour to improve the interface.
- Do not change language semantics as part of website work.

### D. Test Suite — Build and Testing Laboratory

- Distinguish authored/registered test cases from tests executed in a particular run.
- Show latest workflow, commit, run number, timestamp, and links to GitHub Actions.
- Report overall CI, test job, test step, type-check, and production build independently.
- Display actual step statuses and conclusions, including queued, in-progress, skipped, cancelled, failed, successful, and unavailable.
- Link to failure details/logs where available; do not invent failure explanations.
- Keep historical test reports separate from fresh CI results.
- Show fixture coverage and source traceability only to the extent supported by the data.
- Do not call the whole workflow green merely because the production build passed.

### E. Research & Review — Evidence and Decision Centre

- Searchable open questions, claims, source references, candidate interpretations, decisions, and audit records.
- Clearly distinguish evidence, source-based inference, proposal, owner-approved decision, implementation, and executed test result.
- Preserve conflicting interpretations and rejected alternatives with rationale.
- Show source passages and links, not just paraphrases, when available.
- Link research questions to affected documents, fixtures, tests, and code when those links are established.
- Show unresolved and missing-evidence states honestly.
- Do not silently approve a proposal or change canon.

## 3. Six connected capabilities

1. **Language Workshop:** source-backed knowledge and rule records, lexicon/source browsing, and context-aware documentation tools. Any rule-editor functionality must remain read-only or clearly proposal-only unless explicitly authorised.
2. **Interactive Language Lab:** existing playground, supported output inspection, diagnostics, and shared examples. Website work may improve presentation and reliability but not engine semantics.
3. **Canon & Consistency Engine:** website-facing visibility into existing statuses, relationships, conflicts, and evidence. This plan does not authorise changes to the actual language canon or implement new language rules.
4. **Research & Decision Studio:** structured research questions, evidence, competing interpretations, decisions, review history, and approval boundaries.
5. **Language Test Laboratory:** test registry, shared fixture visibility, actual CI/test reporting, historical-vs-current distinctions, and regression evidence.
6. **Development Copilot:** evidence-backed task recommendations, contextual source navigation, impact summaries based on known links, and resumable project state. Suggestions must not silently edit or approve language rules.

## 4. Shared foundation

Build these as a small, consistent website data model rather than six disconnected tools:

- **Source references:** stable identifier, repository path/URL, title, known version/date, provenance, authority/status, preserved-original flag.
- **Review records:** question/claim, linked sources, alternatives, status, decision and rationale when approved.
- **Fixture references:** stable fixture ID, input/category, expected stage/result, diagnostic, status, and known source-rule links.
- **Test evidence:** workflow/run/commit, actual step status, result artifacts, and last-verified time.
- **Work items:** stable ID, priority, dependencies, linked evidence/files, acceptance criteria, and state.
- **Relationship links:** only add relationships supported by evidence; missing links remain missing rather than guessed.
- **Version-controlled state:** prefer existing TypeScript modules and JSON/Markdown files; do not add a database or external service without a demonstrated need.

## 5. Delivery phases and exit criteria

Statuses use only these meanings: **Planned** (not implemented), **Implemented** (code/content exists but not fully verified), **Verified** (acceptance checks passed for a recorded commit), **Blocked** (cannot proceed until a stated dependency is resolved), and **Out of scope** (belongs to the language-engine workstream or is otherwise explicitly excluded).

### Phase 0 — Repository baseline and complete feature inventory
**Goal:** establish what exists before adding more features.

- [x] Identify the five existing site sections and current product/roadmap documents.
- [x] Locate the source inventory and archive report; preserve the distinction between structural inventory and complete content audit.
- [x] Record the current CI run for the website build-status change.
- [x] Produce a first-pass feature-by-feature inventory mapped to existing UI and known gaps; stable feature IDs and acceptance/verification fields are recorded in [Website Feature Register](WEBSITE-FEATURE-REGISTER.md).
- [x] Record first-pass statuses without using unverified completion percentages; several features still require UI-level verification.
- [x] Reconcile the active website roadmap and label the older mixed roadmap as historical.
- [ ] Expand the register into additional atomic records whenever the detailed audits reveal subfeatures not yet tracked.

**Exit:** every requested website capability is accounted for as implemented, missing, blocked, or out of scope, with evidence or an explicit evidence gap.

### Phase 1 — Build and test reporting reliability
- [x] Add a separate Website Build card based on the actual GitHub Actions “Type-check and build” step.
- [x] Display the card with the other Test Suite summaries and adjust the layout for smaller screens.
- [ ] Verify step-status handling for success, failure, running, skipped, and unavailable states.
- [ ] Verify the test result and build result remain distinct in all UI states.
- [ ] Inspect the failing test report and identify the exact failure without changing engine behaviour.
- [ ] Verify a successful test run and production build on a recorded commit when the existing test failure is resolved through explicitly authorised scope.
- [ ] Ensure stale or missing CI data is visibly marked.

**Current evidence:** The latest checked CI run is [#159](https://github.com/sixtoast/Anime-language-/actions/runs/38447949862), commit `69754f461938f2da830fce6bf78c98a5966b8d24`. Dependency installation and “Type-check and build” succeeded; “Run tests and write machine-readable results” and the test-summary step failed; publishing latest results was skipped. The website build step passed, but the overall commit is not fully verified. The language-parser test failure is outside this website-only scope. See the [Website Feature Register](WEBSITE-FEATURE-REGISTER.md) for the current evidence snapshot.

**Exit:** the UI truthfully reports step-level results and a fresh, successful website build is recorded; test failure status is accurately shown even if its cause remains outside scope.

### Phase 2 — Documentation and source inventory
- [x] Keep the existing initial source inventory and archive report.
- [x] Catalogue audit correction: 19 entries total; 14 originally had explicit paths and 5 did not. All five now have grounded links, and all 19 paths exist in the repository tree. Browser interaction and provenance audits remain. See [Documentation Catalogue First-Pass Link Audit](DOCUMENTATION-CATALOGUE-LINK-AUDIT.md).
- [x] Add Playwright browser acceptance checks for combined search/status/provenance filters, reset, empty-state recovery, all 19 source-link entries, and a 360px viewport; review the CI result tied to the implementation commit before marking the experience Verified.
- [x] Extract catalogue data/filtering into `src/documentationCatalogue.ts` and add six catalogue regression tests; all six passed in CI run #167 and type-check/build passed. Overall CI remains failed on the existing out-of-scope surface-parser decimal-with-unit test. UI/browser checks remain.
- [ ] Identify archive content not represented in the visible catalogue.
- [ ] Separate original sources from derived summaries, historical prototypes, provisional reports, and generated outputs.
- [ ] Surface duplicates, missing metadata, broken links, missing originals, and unreviewed archive content.
- [ ] Make the inventory's coverage limitations visible in the website.

**Exit:** every catalogue entry is traceable to a real source or explicitly marked missing/unverified; catalogue coverage claims match the actual audit depth.

### Phase 3 — Overview Development Cockpit
- [ ] Show verified CI/build/test status and commit, with timestamps and links.
- [ ] Show actionable blockers, source gaps, review decisions, and recent changes using repository evidence.
- [x] Add a single evidence-backed next-task recommendation with reason, dependencies, affected files, acceptance criteria, and navigation to the relevant work areas; browser acceptance of the recommended task remains open.
- [ ] Distinguish current state from historical reports and stale data.

**Progress:** the recommendation card is implemented and explicitly distinguishes the recommendation from completed work. Its chosen next task is browser acceptance of the Documentation catalogue; it is not yet evidence that the task itself is complete.

**Exit:** the Overview helps a new session identify the next safe website task without reconstructing context from conversation history, using current evidence and honest state labels.

### Phase 4 — Shared records and cross-section connections
- [ ] Establish/reuse consistent IDs for sources, questions, fixtures, test evidence, and work items where practical.
- [ ] Link Documentation, Playground, Test Suite, and Research & Review using verified relationships.
- [ ] Reuse existing fixtures and evidence rather than duplicating records across sections.
- [ ] Display unknown/unlinked relationships honestly.
- [ ] Add a lightweight impact view based on known links, clearly indicating incomplete coverage.

**Exit:** a reviewer can follow a supported chain from a source or research question to a relevant example/fixture and its test evidence, without invented links.

### Phase 5 — Playground and research-review workflows
- [ ] Audit current input, output, diagnostic, error, and empty states.
- [ ] Make actual versus illustrative/provisional output unambiguous.
- [ ] Improve navigation from a result to related sources, fixtures, and test evidence.
- [ ] Make research claims, evidence, alternatives, decisions, and approval status easy to inspect.
- [ ] Ensure proposal/review UI cannot imply that a decision is canon or implemented before it is approved and evidenced.

**Exit:** a user can inspect supported behaviour and review evidence without confusing proposal, source claim, implementation, and verified result.

### Phase 6 — Website regression protection
- [ ] Add or strengthen website-specific tests for navigation, catalogue filtering, source links, status rendering, and error/empty states.
- [ ] Test CI-status mapping separately from language-engine tests.
- [ ] Add regression coverage for responsive summary-card layout and key interactions.
- [ ] Keep test names and summaries explicit about what was authored versus executed.
- [ ] Avoid changing engine tests or parser expectations under this website plan.

**Exit:** website-specific behaviour has reproducible regression checks, with engine failures reported separately.

### Phase 7 — Accessibility, responsive design, and usability
- [ ] Check keyboard navigation and visible focus.
- [ ] Check semantic headings, labels, contrast, and screen-reader status text.
- [ ] Check mobile layouts, overflow, and readable dense tables/cards.
- [ ] Check loading, error, unavailable, and empty states for clarity.
- [ ] Remove redundant UI only where doing so preserves required capabilities.

**Exit:** all five sections remain usable at common viewport sizes and core interactions are keyboard-accessible.

### Phase 8 — Integration, deployment, and release audit
- [ ] Confirm production build and website tests for a recorded commit.
- [ ] Inspect configured deployment provider and latest deployment status.
- [ ] Test the deployed website's primary flows if a live deployment exists and is accessible.
- [ ] Verify source links, CI links, error handling, and runtime configuration.
- [ ] Record release limitations, unresolved defects, and rollback/recovery notes.
- [ ] Mark the website release complete only after evidence supports every release criterion.

**Exit:** deployment and primary flows are verified, known limitations are documented, and the release is tied to a specific commit.

## 6. Required working protocol

For each meaningful change:

1. State the goal, why it matters, exact files/surfaces, and scope boundary before editing.
2. Inspect the current implementation and repository evidence first.
3. Make the smallest coherent change that advances an acceptance criterion.
4. Run the relevant checks or inspect their actual CI results.
5. Separate newly introduced failures, pre-existing failures, and out-of-scope failures.
6. Commit only when the repository state and available evidence support the change.
7. Report the commit, files changed, checks actually run, observed result, and next task.
8. Never claim a build, test, deployment, or feature is verified when it has not been verified.

## 7. Explicitly out of scope for this roadmap

Unless the owner explicitly changes the boundary, do not modify:

- Arcane vocabulary, lexicon entries, aliases, morphology, or word meanings;
- spoken/written grammar, notation grammar, parser acceptance/rejection, or AST semantics;
- operator signatures, bindings, type rules, dimensional algebra, or evaluation semantics;
- RE/RA and other language-policy decisions;
- spell mechanics, physical mechanisms, resource accounting, conservation, or feasibility rules;
- historical Python/TypeScript comparison policy or expected engine results.

The website may document, display, link, and report evidence about these subjects. It may not resolve or implement them under this plan.

## 8. Current next actions

1. Inspect the failing CI test result and preserve the exact failure as an out-of-scope blocker, without changing parser code.
2. Audit the current Documentation catalogue against repository paths and source inventory.
3. Complete the website feature register, mapping each capability to existing code, tests, and gaps.
4. Improve Overview using only current and traceable project data.
5. Continue through the phases above, verifying each website change independently.

## 9. Relationship to other planning documents

- This file is the **active website implementation plan**.
- `docs/DEVELOPMENT-STUDIO-PLAN.md` remains the broader product vision and capability reference.
- `docs/IMPLEMENTATION-ROADMAP.md` is a historical mixed roadmap; its language-engine phases are not active website tasks. Do not use it to override the explicit scope boundary in this file.
- `sources/SOURCE-INVENTORY.md` remains an initial structural inventory, not a complete content audit.


## Website implementation note — source recovery visibility (2026-10-13)

The Overview now has an initial source-recovery panel based on `sources/SOURCE-INVENTORY.md`. It surfaces the dated structural counts (63 loose files, 307 archive entries, 52 exact-duplicate groups inside the archive, and 150 archive members matching loose files by SHA-256), plus the pending PDF extraction, zero-byte `PHASE_2_README.txt`, and the warning that byte-identical files are not automatically semantically redundant. The panel links to the inventory, catalogue, and review section.

This is a visibility improvement, not a completed source audit. It does not claim that all archive content has been read, reconciled, or approved. WEB-DOC-04 remains Implemented — unverified until CI and browser/responsive acceptance checks pass.


## Website implementation note — Research & Review evidence links (2026-10-14)

The five existing Research & Review cards now link to the repository files that ground each topic: the Phase 2 syntax audit for FRAPA, preserved Phase 4 and Phase 5 historical audit files, the Phase 6G source-lexicon audit, and the Phase 6G fixture-observation harness. This is a navigation/traceability improvement only. It does not approve findings, resolve open questions, or change language-engine behaviour. WEB-REV-01 remains Implemented — unverified until browser link checks and acceptance evidence tied to the new commit are available.


## Website implementation note — keyboard focus baseline (2026-10-14)

Added shared CSS `:focus-visible` styling for interactive elements, with inset focus outlines for search/editor text inputs whose default outlines are reset. This addresses a basic visible-focus gap while keeping the wider accessibility audit open. Do not mark WEB-UX-02 Verified until keyboard, screen-reader, contrast, and responsive browser acceptance is recorded.


## Website implementation note — section navigation semantics (2026-10-14)

The sidebar section list now uses a named navigation landmark and exposes the selected section with `aria-current="page"`. This is a low-risk website-only accessibility improvement. It does not complete the accessibility audit; keyboard traversal, screen-reader output, contrast, and responsive browser checks remain open.


## Website implementation note — catalogue path regression (2026-10-14)

The documentation catalogue test suite now checks that every declared source path resolves to a repository file under the docs, sources, or engine Markdown trees. This protects internal repository references from future path drift. It does not validate the content or authority of a source, nor does it replace browser click acceptance.


## Website implementation note — CI summary vs test failure (2026-10-14)

The test-summary script now recognises `WEB-DOC-REG-###` IDs and does not fail merely because other test results are not yet mapped to stable IDs. Unmapped counts remain visible as warnings. Actual test failures still fail the test step and therefore the workflow; this avoids conflating incomplete metadata with a failing test.


## Website implementation note — Development Cockpit live health summary (2026-10-14)

The Overview now surfaces a compact health summary based on existing live GitHub Actions state and published test-report data. Workflow result, website build step, and per-test report are separate signals; a commit mismatch is called out to avoid combining results from different revisions. This improves the Overview without duplicating API requests or inventing status data. Responsive/browser acceptance remains pending, and the larger evidence-backed next-task recommendation remains unimplemented.

## Website implementation note — source-aware catalogue facets (2026-10-14)

The Documentation section now supports explicit source-status and provenance-type filtering in addition to search, with combined filters, result counts, a reset action, an informative empty state, and detail selection that remains valid as filters change. This is a usability improvement using existing catalogue metadata; it does not infer source authority or change any language specification. WEB-DOC-REG-009 requires CI confirmation, followed by browser/responsive acceptance.

### Browser acceptance added — 2026-10-14

Added a Playwright-based website browser suite and CI step for the Documentation catalogue. It covers filter combinations/reset, empty-state recovery, source-link presence for every catalogue entry, and a narrow mobile viewport. The suite is deliberately reported separately from Vitest and the production build so an unrelated existing engine test failure cannot hide website-level results. Browser acceptance remains **Implemented — unverified** until the run for the commit completes successfully and any failures are addressed.
