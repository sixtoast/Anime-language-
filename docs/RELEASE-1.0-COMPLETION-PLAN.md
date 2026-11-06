# Arcane Language and Development Studio — Release 1.0 Completion Plan

**Status:** Owner-directed completion baseline  
**Created:** 2026-11-06  
**Purpose:** Close the language and website as one deliverable without creating an endless sequence of research phases.  
**Repository:** [sixtoast/Anime-language-](https://github.com/sixtoast/Anime-language-)

> This plan is a delivery contract, not a new language canon document. It does not silently change any locked grammar, source lexicon entry, historical claim, or incantation rule. Existing canon remains authoritative. New language decisions must be recorded in the appropriate canon file and tested; proposals must remain labelled as proposals.

## 1. Release principle: finish the bounded product

Release 1.0 means a coherent, teachable, usable Arcane language release and a working website that exposes the supported language and incantation capabilities. It does **not** mean that every imaginable dialect, historical period, word, spell effect, physical law, or future feature has been invented.

The team must stop opening new research phases when an existing rule can be implemented, tested, documented, or explicitly blocked. A missing feature is either:
1. required for the defined Release 1.0 scope and therefore a blocker;
2. deliberately unsupported in Release 1.0 and documented as such; or
3. a post-release enhancement.

No fourth category called “keep researching indefinitely” is permitted.

## 2. Language completion scope

### 2.1 Modern Vernacular grammar

The current bounded design baseline is Modern Vernacular v1.0–v2.7. Preserve the versioned canon and close the gap between those specifications and an end-to-end usable language.

Release gates:

- [ ] Produce one consolidated, learner-facing grammar reference covering the locked v1.0–v2.7 constructions.
- [ ] Produce one concise pronunciation and orthography guide grounded in existing source evidence; mark any newly standardised pronunciation choices as modern design decisions.
- [ ] Produce a complete, deduplicated, register-labelled learner lexicon. Every entry must show form, meaning, part of speech/semantic type, register, provenance, status, and restrictions where known.
- [ ] Audit the grammar for missing essential everyday functions. Any essential gap must be resolved with a bounded rule or explicitly listed as unsupported; do not create rules merely for theoretical completeness.
- [ ] Reconcile cross-version interactions and publish one compatibility table showing which constructions can combine, which are blocked, and why.
- [ ] Create a practical teaching sequence with examples, translations, minimal contrasts, exercises, and answer keys.
- [ ] Implement parser support for every construction claimed as supported by the workbench. Unsupported constructions must produce honest diagnostics.
- [ ] Establish a release fixture set for every locked rule, including positive, negative, malformed, ambiguous, and boundary examples where applicable.
- [ ] Distinguish source-attested forms, source-derived interpretations, and modern design coinages throughout the learner materials.

The v2.7 ceiling is the Release 1.0 grammar scope unless a defect prevents a coherent basic language. New grammar beyond v2.7 is not a release prerequisite by default.

### 2.2 Formal Arcane and historical strata

- [ ] Preserve the source archive and historical strata without rewriting them to match Modern Vernacular.
- [ ] Reconcile the canonical Formal vocabulary and operator inventory against original source records.
- [ ] Mark each entry as attested, alias/preferred spelling, proposed, modern coinage, uncertain, or unresolved.
- [ ] Provide a cross-register reference only where a real semantic and grammatical bridge is justified.
- [ ] Do not invent historical evidence to fill gaps. A deliberately designed modern form is acceptable when labelled honestly.

Historical reconstruction and modern language design are separate deliverables. Release 1.0 can include a usable modern register while clearly documenting unresolved historical material.

### 2.3 Incantations

The current bounded incantation design baseline is v1.0–v2.1. Finish the model by integrating the existing specifications; do not keep adding specification versions without implementing the existing ones.

- [ ] Consolidate the incantation grammar, typed parameters, targeting, spatial frames, preconditions, mechanisms, effects, resources, authority and policy composition into one execution lifecycle reference.
- [ ] Define a single canonical invocation state machine and map each existing gate to it.
- [ ] Connect parsing, type/shape validation, target resolution, precondition evaluation, resource preflight, authority/policy decisions, execution eligibility, interruption/termination and result reporting.
- [ ] Ensure failed, unknown, unavailable, stale, denied, malformed and unsupported states remain distinct and fail safely.
- [ ] Make resource reservations, settlement, release and ledger projection consistent across the lifecycle.
- [ ] Define what counts as a declared effect, attempted operation, reported outcome, independently verified outcome and physical-world result.
- [ ] Provide end-to-end fixtures for successful eligibility, each blocking gate, unresolved evidence, resource shortage, authority denial, policy conflict, cancellation and partial/unknown outcome.
- [ ] Clearly state that a software contract or simulated result is not proof of supernatural or physical efficacy. No physical spell simulator is claimed unless an actual validated model exists.

The release target is a complete, testable **incantation specification and conservative execution/validation model**, not a claim that arbitrary magical effects have been made physically real.

## 3. Website completion scope

Retain the existing five-section product structure: Overview, Documentation, Playground, Test Suite, and Research & Review.

- [ ] The Playground exposes every implemented Modern Vernacular parser version and the supported incantation validation workflow.
- [ ] Version selection is explicit; unified dispatch is predictable and does not silently repair user input.
- [ ] Results show the selected grammar/version, structured interpretation where implemented, diagnostics, provenance and relevant source/fixture links.
- [ ] The Documentation section presents a consolidated learner grammar and lexicon alongside source documents and canon, without confusing them.
- [ ] The Research & Review section distinguishes evidence, proposal, decision, implementation and executed verification.
- [ ] The Test Suite distinguishes authored tests from tests executed in a named run and reports actual statuses.
- [ ] Overview identifies real release blockers and links to the files/tests that establish them.
- [ ] All five sections work on desktop and mobile; loading, empty, stale, unavailable and error states are usable.
- [ ] Accessibility, navigation, source links and key workflows receive a final acceptance audit.
- [ ] Production deployment is verified against the exact release commit.

## 4. Required release artefacts

The following artefacts must exist before Release 1.0 is declared:

1. **Arcane Modern Vernacular Grammar v1.0** — consolidated learner-facing reference for the bounded v1.0–v2.7 grammar.
2. **Arcane Learner Lexicon v1.0** — deduplicated, register- and provenance-aware vocabulary.
3. **Pronunciation and Writing Guide v1.0** — orthography, pronunciation, stress/phonotactics only to the extent supported or explicitly standardised.
4. **Grammar Compatibility Matrix v1.0** — licensed combinations, blocked combinations and unresolved boundaries.
5. **Incantation Lifecycle and Execution Contract v1.0** — one integrated lifecycle mapping the v1.0–v2.1 canon.
6. **Release Fixture Catalogue v1.0** — source-linked tests for the language and incantation model.
7. **Website Release Checklist v1.0** — five-section acceptance and deployment evidence.

These are consolidation and integration artefacts. They must reuse existing decisions and cite the governing canon rather than duplicate or silently supersede it.

## 5. Work order and stop conditions

### Track A — Language closure
1. Inventory the existing grammar, lexicon, source archive and parser support.
2. Resolve only essential gaps in the bounded Modern Vernacular.
3. Consolidate grammar, lexicon, pronunciation and compatibility references.
4. Build and run rule-linked fixtures.
5. Freeze the Release 1.0 language scope; move optional extensions to post-release.

### Track B — Incantation closure
1. Map every v1.0–v2.1 specification requirement to an implementation module and fixture.
2. Complete the lifecycle orchestration and missing gate integration.
3. Test all terminal and indeterminate outcomes.
4. Publish one complete invocation reference.
5. Freeze the Release 1.0 incantation scope; move speculative mechanisms and physical models to post-release.

### Track C — Website closure
1. Connect existing parser versions and incantation capabilities to the Playground.
2. Finish the consolidated language documentation and lexicon views.
3. Close the remaining five-section UX, accessibility and evidence gaps.
4. Run a single release verification batch when GitHub Actions capacity is available.
5. Verify the production deployment and publish release notes.

Tracks A and B are not subordinate to website work: language and incantation completeness are release gates in their own right.

## 6. Verification policy while CI capacity is exhausted

Until GitHub Actions capacity is available:
- inspect and edit repository files;
- run local/static checks only where a local execution environment is actually available;
- add tests but label them authored/unexecuted;
- use independent code review and source-level consistency checks;
- do not trigger repeated workflows merely to obtain a green badge;
- do not describe an unexecuted test as passing.

When capacity returns, run one consolidated verification batch against the release candidate, fix all release-blocking failures, and rerun the affected checks.

## 7. Release acceptance

Release 1.0 may be declared only when all of the following are true:

- The bounded Modern Vernacular grammar is coherent, teachable, and represented in the learner grammar and lexicon.
- The language's source provenance and modern design decisions are clearly distinguished.
- The parser supports every construction advertised as executable by the website.
- The incantation lifecycle integrates the existing v1.0–v2.1 contracts and fails safely on unresolved or unsupported gates.
- The website's five sections expose the finished product without misleading status claims.
- Release fixtures and the consolidated verification run pass, or any explicitly non-blocking limitation is documented and approved.
- The exact production deployment corresponds to the accepted release commit.

**Release status remains IN DEVELOPMENT until these gates are evidenced.** A completed plan, authored test, passing build, or READY deployment alone is not sufficient evidence of full language completion.

## 8. Post-release by default

Unless a critical defect is discovered, defer:
- additional Modern Vernacular grammar beyond v2.7;
- additional incantation specification versions beyond v2.1;
- speculative historical reconstruction unsupported by source material;
- new physical-effect models without a defined validation basis;
- cosmetic website redesigns that do not fix usability or accessibility defects;
- new top-level website sections.

The next increment should close an existing release gate, not create another research phase.
