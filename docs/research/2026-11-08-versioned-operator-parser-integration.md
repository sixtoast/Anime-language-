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
