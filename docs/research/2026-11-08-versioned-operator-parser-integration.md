# Versioned Formal Arcane operator profiles — implementation record

**Date:** 2026-11-08  
**Work branch:** `feat/versioned-arcane-operator-identities-2026-11-08`  
**Purpose:** record the implementation, evidence boundaries, tests and deployment verification for the first integrated version-aware Formal Arcane operator workflow.  
**Status:** implementation on an isolated feature branch; not merged; not canon promotion.

## 1. What was added

### Source-backed identity registry

`src/engine/operatorIdentityRegistry.ts` records stable operator identities separately from spellings and parser grammar. It contains 21 Formal Arcane operators from the v3.0-L inventory and six operational Construction macros from Magic System v3.0.

The two documentary spelling profiles are:
- `v3.0-L`: preserves the forms in `docs/canon/arcane-language-v3.0-L.md`.
- `phase4-renamed`: uses the Phase 4 preferred spellings evidenced by the Phase 5.5 reconciliation and Phase 5.12 registry.

The registry intentionally does not treat the v5 draft CSV as a complete language or parser profile.

### Six operator rename relationships

| Stable identity | v3.0-L form | Phase 4 preferred form |
|---|---|---|
| subtract | FRATA | FRAJA |
| multiply | FRAKA | FRAMA |
| cross product | DRIM | DRUM |
| compare | DRAL | DRAS |
| NOT | GRAK | GRASH |
| live evaluation | KWAK | KWASH |

The resolver distinguishes `RESOLVED`, `ALIAS-DISABLED`, `VERSION-NOT-LICENSED` and `UNKNOWN`. Compatibility aliases are opt-in. It returns both the input and resolved spelling.

REN/BEN is not in this operator registry: it is a region/geometry lexical rename. HƏ/HE/HA/HU/HI/HO are coupling vocabulary, not ordinary operators. Proposal-only tokens are not promoted.

KREN, TRAK, FREM, SHREN, BRAN and VARE are classified as Construction macros. Their signatures remain OPEN; no arity is invented.

## 2. Parser integration

`src/engine/surfaceParser.ts` now accepts an optional `operatorProfile`. When supplied:
- the parser resolves the operator against the selected documentary profile;
- cross-version forms produce a version-mismatch diagnostic;
- historical aliases require explicit opt-in;
- the AST retains `operator` (resolved spelling), `surfaceForm` (entered spelling), `operatorId` (stable identity) and `operatorProfile`;
- recognised identities without an implemented Phase 6G grammar remain unresolved;
- the parser uses a separate explicit grammar-shape table for the small Phase 6G subset it already handles. Identity metadata is not treated as a complete grammar or executable signature.

When no profile is supplied, the original Phase 6G compatibility parser path remains available. Existing parser behaviour was deliberately retained to reduce disruption to earlier fixtures and consumers.

## 3. Semantic integration

`src/engine/semanticAnalysis.ts` uses a version-resolved stable identity to locate the source-backed contract spelling when the AST carries identity metadata. For example, Phase 4 FRAJA resolves to the stable subtract identity and uses the existing FRATA contract record. The original surface spelling remains in the AST and diagnostic subject.

This fixes the prior mismatch in which alias rewriting produced FRAJA but exact semantic lookup had only a FRATA contract. It does **not** make the contract complete: provisional arity and absent input/output types still produce `SEMANTIC_SIGNATURE_UNRESOLVED`. Legacy manually-authored ASTs without identity metadata continue to use exact lookup and do not get silent canonicalisation.

## 4. Website integration

`src/App.tsx` now includes:
- a shared operator spelling-profile selector for the Phase 6G playground;
- an explicit checkbox for accepting documented historical aliases;
- a profile-driven list of the operators supported by the current provisional parser grammar;
- parser invocation using the selected profile and alias setting.

The contract worksheet label was corrected from v1.0–v2.0 to v1.0–v2.1. The runtime preview evaluator count was corrected from five to four, matching the four visible evaluator layers. Existing caveats about provisional syntax, semantics, physical feasibility and execution remain.

The five-section website structure is unchanged. The v5 draft lexicon inspector remains separately labelled as versioned evidence, not blanket canon.

## 5. Tests authored and registry coverage

New unit tests:
- `src/engine/operatorIdentityRegistry.test.ts`: OP-ID-001 through OP-ID-010.
- `src/engine/surfaceParser.test.ts`: P6G-V-001 through P6G-V-006.
- `src/engine/semanticAnalysis.test.ts`: SEM-A-013.

The website's `src/engine/testRegistry.ts` now lists these 17 new cases. All are marked `authored-unverified` until an actual test run is available.

Coverage includes profile primary forms, cross-version rejection, opt-in aliases, original spelling retention, Construction macro separation, incomplete signatures, unsupported parser grammar and legacy parser compatibility.

## 6. Build and verification record

- An initial integrated commit failed Vercel TypeScript compilation because the new raw-token and alias-option fields were not initialised. This was corrected in commit `e27b71c25d47bbb4be9846ee46b8d3d3130dec30`.
- Vercel deployment `dpl_GpX2zBfaSqXneWUnXGP9hGL4XgRh` for that corrected integration commit reached READY. Its build logs show `tsc --noEmit` completed and Vite transformed 2,096 modules and completed the production build.
- A subsequent follow-up commit briefly failed TypeScript because an unused import remained after tightening unresolved-operator handling. The unused import was removed in commit `48589d312cd6713a335346e78243e5c37c308a25`. That commit also ensures unresolved-signature diagnostics retain the entered surface spelling.
- The integrated READY build at `e27b71c...` predates the last diagnostic, test-catalogue and documentation follow-ups; it does not prove the exact latest branch head. The latest implementation commit before this documentation refresh is `48589d312cd6713a335346e78243e5c37c308a25`; its Vercel deployment was BUILDING at the last status check.
- No GitHub Actions run was triggered for this branch. No workflow was manually dispatched or rerun.
- Unit tests have **not** been executed. A successful Vercel production build is not a test-suite pass.
- Main and production were not changed. The branch is not merged and no PR has been opened.

## 7. Known remaining work and limitations

1. Verify the latest Vercel deployment after the final branch commit.
2. Execute the new and existing unit tests when an approved test runner / Actions budget is available. Add browser acceptance for the profile selector and alias toggle.
3. Reconcile remaining source questions: the complete D-032 decision, exact Phase 4 §5.1 source, KOLE provenance, WEKI/RUKI status, and the full H-series coupling evidence.
4. The parser profile table represents only the implemented Phase 6G subset. It does not mean every registered operator is parseable.
5. The v3.0-L and Phase 4 profiles are documentary spelling profiles, not proof of a fully recovered spoken grammar.
6. The operator contract registry still has incomplete semantic signatures; no operator execution is enabled.
7. The selector currently governs the parser profile and parser operator inventory. The lexicon inspector is still pinned to the v5 draft snapshot and is not yet switched by this profile selector. A later versioned dictionary selector must not pretend v5 is a full grammar version.
8. The source registry is an implementation index, not a canon amendment. Any disputed source relationship must be revisited before release approval.

## 8. Next increment

Continue from this branch by verifying the latest preview, reviewing the parser diff and semantic regression cases, then implement a version-aware operator explorer with explicit readiness axes (identity, parser grammar, signature, semantic contract and execution). Keep the dictionary's v5 draft source snapshot visibly distinct. Follow with runtime hardening of the Incantation gates and v1.9 ledger review, and keep website/release documentation in sync.

**Release boundary:** parse recognition is not semantic validity; semantic annotation is not physical feasibility; feasibility is not authority; authority is not execution; and execution is not a verified outcome.


## 9. Follow-up after the initial integration record

- `src/engine/testRegistry.ts` now includes 10 OP-ID cases, six P6G-V cases and SEM-A-013. These 17 entries remain `authored-unverified`.
- `src/engine/surfaceParser.ts` retains the original unresolved-operator rejection for forms such as WEKI/RUKI even when an explicit spelling profile is selected. The operator identity import was removed after the parser guard was simplified, avoiding an unused-import TypeScript failure.
- `src/engine/semanticAnalysis.ts` now uses the entered `surfaceForm` as the subject for signature-unresolved diagnostics, while the AST continues to expose the resolved preferred spelling and stable identity.
- `src/App.tsx` imports the parser inventory helper through its existing surface-parser import, and the runtime preview count is now four.
- The previous two preview failures are recorded rather than hidden: the first exposed missing constructor initialisation for raw token provenance/options; a later follow-up exposed an unused import. Both source issues have corresponding fixes. Do not call the final head verified until its own Vercel build completes.
- Main, production, and GitHub Actions remain untouched by this work.


## 10. Operator Explorer and browser acceptance follow-up

### Website feature

`src/App.tsx` now includes a dedicated Operator Explorer immediately before the Phase 6G editor. It displays the 27 source-backed identity records and, for the currently selected spelling profile, shows:
- the primary form (or explicitly says no form is recorded for that profile);
- the alternate spelling from the other documentary profile;
- stable identity ID, kind and category;
- whether the form has an implemented Phase 6G grammar shape;
- signature status and audit arity (clearly labelled non-executable);
- source records and unresolved limitations.

The profile selector and alias toggle are positioned before the explorer, so changing the profile updates the explorer and the parser inventory together. Search filters by stable ID, gloss, either spelling, category or identity kind. The v5 draft lexicon inspector remains a separate pinned source view; it is not falsely presented as switching with the operator spelling profile.

### Browser acceptance authored

`tests/browser/operator-profiles.spec.ts` adds two Playwright scenarios:
- P6G-UI-001: switch from Phase 4 preferred spellings to v3.0-L and verify the primary subtraction spelling changes from FRAJA to FRATA.
- P6G-UI-002: verify FRATA is rejected as a Phase 4 alias by default, then enable compatibility aliases and check the AST retains FRAJA as the resolved form, FRATA as the entered surface form and `subtract` as the stable identity.

Both are registered in `src/engine/testRegistry.ts` and marked `authored-unverified`. The health endpoints are mocked with deterministic responses. These browser tests have not been executed.

### Build follow-up

- The first Operator Explorer commit failed TypeScript because the `operatorSearch` state was declared after the memo that consumed it. The state was moved before the derived memo in commit `eb54f9b0f89943fc6cad77b5645654b81b2e22bc`.
- Vercel deployment `dpl_AJ71KckMx5g46mWhAdusMJkc8qfP` for that corrected feature commit reached READY; the TypeScript and Vite build passed.
- The subsequent browser-fixture adjustment is committed as `b1d75a40225a63c11382ad55377d8c99e6612564`; its Vercel deployment was BUILDING at the last check.
- The two earlier failed builds are retained as diagnostic history, not hidden. Their causes and fixes are recorded above.
- No unit or browser tests have been run. GitHub Actions remains unused for this branch.

### Current feature boundary

The Operator Explorer is a searchable evidence viewer, not a language-authoring interface. It does not promote aliases, approve signatures, create grammar rules, or enable execution. The parser grammar subset remains intentionally smaller than the identity registry.


## 11. Lexical alias coexistence and current verification

- The versioned parser initially bypassed all lexicon alias normalisation to protect operator tokens from being rewritten before stable identity resolution. That also suppressed non-operator lexical aliases such as REN → BEN.
- `src/engine/surfaceParser.ts` now distinguishes known operator spellings from other tokens before applying lexicon alias resolution. Operator spellings are kept raw for version-aware identity resolution; non-operator lexical forms continue to use the source lexicon's explicit alias registry when alias acceptance is enabled.
- `src/engine/surfaceParser.test.ts` adds P6G-V-007, proving the REN → BEN lexical alias still resolves as an atom under an explicit Phase 4 operator profile when aliases are enabled. `src/engine/testRegistry.ts` records this case.
- Browser tests remain two cases (P6G-UI-001/002). Current new registry entries total 20: OP-ID-001–010, P6G-V-001–007, P6G-UI-001/002 and SEM-A-013. All remain `authored-unverified`.
- The source change is commit `f6b51f84a6ed5821689748776687a3f4f0a45348`; Vercel deployment `dpl_C3mkho3YNb49GxjxsMT3gERey3cj` reached READY.
- The browser test fixture update `b1d75a40225a63c11382ad55377d8c99e6612564` also reached READY at `dpl_7WWicXtt51QXCX2q6VZMrnriNavm`.
- The latest test addition commit at the time of this note is `712a23c3c43b57975e0d9c65b9b3168eb0aaa9ee`; its Vercel deployment was BUILDING at the last check. This build validates TypeScript and bundling only; it does not execute Vitest or Playwright.
- No GitHub Actions run has been triggered. The unit and browser tests are authored but not executed. Main and production remain unchanged.


## 10. Lexicon alias regression and latest verified preview

**Latest implementation commit at this checkpoint:** `f6b51f84a6ed5821689748776687a3f4f0a45348`.

A final parser regression was found while integrating the profile selector: the explicit operator-profile token path could short-circuit the lexicon resolver for non-operator lexical forms. This matters because the Phase 4 rename REN → BEN is a geometry/region vocabulary change, not an operator identity. The correction preserves the source-backed lexicon alias path for non-operator tokens while keeping registered operator profile resolution separate.

- `src/engine/surfaceParser.ts`: versioned operator token resolution and non-operator lexicon alias resolution remain distinct.
- `src/engine/surfaceParser.test.ts`: added P6G-V-007, which verifies that REN resolves to BEN as a GEOM atom when the documented lexicon alias is explicitly enabled under the Phase 4 operator profile.
- `src/engine/testRegistry.ts`: P6G-V-007 is registered as `authored-unverified`.
- Vercel deployment `dpl_C3mkho3YNb49GxjxsMT3gERey3cj` for exact commit `f6b51f84a6ed5821689748776687a3f4f0a45348` reached **READY**. Build events show `npm run build`, `tsc --noEmit && vite build`, 2,096 modules transformed and Vite completed. The build emits a non-blocking large-chunk warning (approximately 699 kB minified JS); no TypeScript or Vite build error was reported.
- This is a build verification only. Unit tests and the two browser acceptance scenarios remain unexecuted. No GitHub Actions workflow was triggered. The latest feature branch remains isolated from main and production.

The source spelling profile selector controls operator identity and operator grammar selection; it does not change the separately pinned v5 draft lexicon snapshot. Non-operator lexical alias resolution still uses the lexicon registry's own explicit opt-in and evidence. The two version systems are not treated as interchangeable.


## 11. Incantation invocation-gate runtime hardening

**Implementation commit:** `6f8c8652cf70fbe1ea324b5632bc439d61241ba7`.

The next Incantation increment hardens `src/engine/invocationGates.ts` at its runtime boundary. TypeScript interfaces alone do not protect this function when callers supply external JSON, JavaScript values or unsafe casts.

### Changes
- Added a runtime object-shape guard before any nested property access.
- Validates all eight top-level gate states against the exact `PASS | BLOCK | UNRESOLVED | UNAVAILABLE` allowlist.
- Validates policy composition outcome and strategy against their supported enumerations.
- Requires the policy `blocking` flag to agree with its outcome; a forged `COMPOSED-PERMIT` with `blocking: true`, or a non-permit with `blocking: false`, is malformed.
- Validates authority outcome and requires `gateSatisfied` to be a real boolean consistent with a permit-eligible authority outcome. A truthy string such as `"false"` can no longer be treated as a pass.
- Validates independent-gate arrays and every result entry before mapping or iteration. Null collections, null entries, unknown states and malformed identifiers return a blocked input-contract trace instead of throwing or being interpreted as a pass.
- Rejects whitespace-padded gate identifiers and duplicate identifiers.
- Malformed inputs return `BLOCKED`, `eligibleToProceed: false`, and `executionStarted: false`.

### Regression cases
Added INV-GATE-010 through INV-GATE-015 to `src/engine/invocationGates.test.ts` and the central test registry. They cover unknown states, truthy non-boolean authority flags, contradictory authority outcomes, unknown/inconsistent policy outcomes, null/malformed independent gate collections and whitespace-padded identifiers.

All six new cases are `authored-unverified`. They have not yet been executed. The gate coordinator remains a consumer of upstream evidence and does not verify the evidence itself.

### Remaining hardening
This is a first fail-closed increment, not a claim that every Incantation runtime boundary is hardened. The next work should apply the same explicit runtime-contract validation to policy composition, authority evaluation, contract-record kind dispatch, scenario selection and resource preflight. Each evaluator should preserve its own outcome distinctions and avoid broad exception swallowing.


### Invocation-gate build correction

The first Vercel build after the invocation-gate hardening failed at TypeScript compilation because the six new central test-registry entries used a group label (`Invocation gates`) that is not part of the registry's declared group union. The evaluator and tests were not the cause of this failure.

- Failed build: `dpl_7sPFtC3sRzwREM9dkEQpuWbTXYEr`, commit `8c4468f82cc83ae884409562505ba78b542a2c9a`.
- Exact compiler issue: six TS2322 errors at `src/engine/testRegistry.ts` lines 239–244; the accepted group is `Incantation contracts`.
- Corrected in commit `cfa2bf6a9ec191ed27b4f373b91be1cf634321d7` by using the existing `Incantation contracts` group. No runtime semantics were changed in this correction.
- The corrected commit's own Vercel build still requires verification. The previous failed build is retained in this record.


## 12. Incantation policy-composition runtime hardening

**Implementation commits:** `e7a79cf705fae8615c8dd0fdd154077d14f82069` and `b61d09f79b254d53bcc01d4a4410132c41cd288a`.

The v2.1 policy composer previously trusted TypeScript types at runtime. An unknown strategy could fall through into the multi-profile path; malformed applicability/trust/freshness values could be skipped or treated as usable; an unknown decision could leave the blocker unset and reach the final COMPOSED-PERMIT return. This increment adds a fail-closed runtime contract.

### Changes
- Validates the input object before reading profile collections.
- Accepts only the three bounded strategies: `SINGLE-APPLICABLE`, `ALL-MUST-PERMIT`, `DENY-OVERRIDES`.
- Validates plan trust and the exact `true | false | UNKNOWN` plan-validity domain.
- Validates every profile's non-empty canonical ID/version, boolean flags, applicability, trust, freshness and authority-decision enums.
- Validates optional `conditionsSatisfied` as boolean when present.
- Rejects null arrays, null profile records, malformed profile fields and unknown enum values with `COMPOSITION-ERROR`.
- Keeps malformed strategy reporting explicit as `strategy: INVALID`; no substitute strategy is applied. The result remains blocking and states that no strategy was applied.
- Preserves existing distinction between applicability uncertainty, untrusted profiles, stale/expired/unavailable profiles, explicit denial, conditional permit and indeterminate decisions.

### Regression cases
Added POLICY-COMP-011 through POLICY-COMP-015 and central registry entries. They cover unknown strategies, invalid profile enums, malformed profile booleans, invalid plan-validity values and null/malformed profile collections. All are `authored-unverified`.

### Verification
- Vercel deployment `dpl_GyREVonLyXUbDs4d1F4KQTGXLApZ` for `e7a79cf705fae8615c8dd0fdd154077d14f82069` reached READY, confirming the policy validator and new test source compile.
- A follow-up type refinement in `b61d09f79b254d53bcc01d4a4410132c41cd288a` reports invalid strategy as `INVALID` rather than substituting a real strategy. Its exact-commit deployment is still BUILDING at this documentation checkpoint.
- Unit tests remain unexecuted. A successful build is not a test-suite pass.

### Scope
This validates the profile-evaluation inputs consumed by the policy composer. It does not validate the underlying trust evidence, evaluate applicability predicates, establish scope, verify decision signatures, or execute policy rulesets.
