# Phase 8CQ — Incantation semantic-obligation review

**Date:** 2026-11-14  
**Canon effect:** NONE. **New spoken forms:** 0. **Grammar changes:** none.  
**Tests authored:** INC-OBL-001–014. **Tests executed:** not executed in this environment.

## 1. Purpose

The Construction work has been deliberately cautious about not treating partial morphology as a complete language. This phase applies the same evidence discipline to the Formal Arcane incantation layer.

Incantations v1.0 §2 defines seven semantic questions that a spell construction must make answerable, either explicitly or through a separately established and visible binding:

1. Operation
2. Target/reference
3. Mechanism/coupling
4. Spatial role
5. Constraints
6. Resource and feasibility
7. Outcome

The specification also says that not every spell must contain every possible role. Irrelevant roles should be omitted rather than guessed, and required roles must not be silently supplied by an interpreter. This phase turns those statements into a versioned, evidence-aware obligation ledger. It does **not** create a new spoken grammar.

## 2. Implementation

Added `src/engine/incantationObligationReview.ts` with profile `INCANTATION-OBLIGATIONS-1.0`.

Each of the seven obligations must be explicitly declared as:

- `REQUIRED` — must have a resolved evidence reference and a declared basis.
- `NOT-APPLICABLE` — must have a resolved, traceable rationale; no silent omission.
- `UNRESOLVED` — applicability is unknown and therefore blocks a complete ledger.

A required obligation can be supported by:
- `EXPLICIT` — information supplied directly in the abstract incantation record; or
- `VISIBLE-BINDING` — a separately established binding that is visible and traceable.

Operation and target/reference are mandatory in the v1.0 core frame. The reviewer rejects either being marked not applicable. Conditional dimensions are not automatically declared irrelevant; their applicability must be stated and justified.

The reviewer rejects unknown profile versions, missing obligation declarations, malformed entries and unexpected keys. It returns an obligation-accounting disposition and per-dimension explanations.

## 3. What the reviewer does not do

An `OBLIGATIONS-ACCOUNTED-FOR` result means only that the abstract ledger records all seven questions as required-and-evidenced or explicitly justified not applicable. It does not mean:

- the Arcane surface text parses;
- an operation selector has a recovered complete signature;
- a target is actually resolved in the world;
- evidence is true, trusted or current;
- a mechanism or coupling is possible;
- spatial data is geometrically valid;
- constraints or resources are sufficient;
- preconditions, authority, consent or policy gates pass;
- an executor ran or a postcondition was verified.

The module therefore hard-codes grammar validation and semantic validation as not performed, feasibility and authorisation as not assessed, and executable as false.

## 4. Construction boundary

The Incantations v1.0 term “mechanism/coupling” is not silently mapped to the Construction H-series or to the Construction stage called “couplings”. Similar labels do not establish an interface. Phase 8CP continues to record Construction stage interfaces as unrecovered and the Expression-to-Construction mapping as not established.

The Phase 5.15 CVC versus Phase 5.16 C-02 optional-coda conflict remains separate and unresolved. No Construction Foot rule is changed by this phase.

## 5. Source basis

- `docs/canon/arcane-incantations-v1.0-foundation.md` §2 — seven semantic obligations and visible-binding rule.
- Incantations v1.0 §§6–8 — bounded spell frame, semantic checklist and validation states.
- `docs/canon/arcane-incantations-v1.1-target-resolution-and-binding.md` — reference class, scope, resolution and binding are distinct.
- Incantations v1.2 — structural, reference, type, precondition, resource, feasibility, authorisation, execution and postcondition gates remain separate.
- Incantations v1.5 — well-formedness, semantic validation, authorisation, contract acceptance, attempt, observation and outcome verification remain distinct lifecycle states.
- `src/engine/constructionGrammarSpecification.ts` — Construction remains a separate evidence-limited grammar.

The v1.0–v2.1 files are locked design canon for the modern incantation layer. This implementation records their abstract obligation boundary; it does not claim those design decisions reconstruct historical spoken Arcane syntax.

## 6. Verification boundary

Fourteen Vitest cases have been authored and registered. They have not been executed locally. The repository has no local checkout in this session. The next Vercel preview build, if completed, will verify the TypeScript production build only; it will not run Vitest or browser acceptance tests.

**Decision:** Keep this review as an evidence-accounting layer only. Do not generate Arcane strings, accept a spell as valid, or enable execution from this result.
