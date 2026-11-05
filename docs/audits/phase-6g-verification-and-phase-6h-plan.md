# Phase 6G Verification Gate and Next-Step Plan

**Status:** ACTIVE VERIFICATION PLAN — not a test report  
**Prepared:** 2026-11-05  
**Scope:** Provisional surface-like parser, source lexicon inspection, source fixture browser, and browser regression coverage.

## 1. Current verified repository facts

- Repository: `sixtoast/Anime-language-`, default branch `main`.
- Latest inspected commit: `41e162afb83b4235221b89486811660e6081873e` (2026-11-05), which fixes quote escaping in Phase 6G Playwright selectors.
- The preceding test commit scoped fixture-browser assertions to the intended browser section.
- The browser suite contains coverage for binary operator parsing, unterminated numerals, clearing stale output, provisional-parser labelling, source-backed lexical atoms, lexical collisions, unresolved operators, lexicon provenance, alias non-rewriting, unknown forms, 360px overflow, and fixture loading/diagnostics.
- The README explicitly limits this parser to provisional Phase 2/Phase 6G notation. It is not a parser for canonical spoken/written Arcane and does not perform dimensional type checking, semantic validation, physical feasibility analysis, or spell execution.

These are repository observations, not evidence that the suite currently passes.

## 2. Verification status

| Check | Status | Evidence required to close |
|---|---|---|
| Latest selector quote fix | Committed | A successful run of the affected Playwright tests |
| Fixture-browser selector isolation | Committed | Browser run covering all fixture-browser sections |
| Unit tests | Not verified in this review | Successful `npm test` run and retained report |
| TypeScript + production build | Not verified in this review | Successful `npm run build` |
| Browser suite | Not verified in this review | Successful `npm run test:browser` on the intended CI browser matrix |
| Mobile layout | Test exists; result not verified | Passing 360px viewport assertions and no horizontal page overflow |
| Production deployment | Not verified in this review | Deployment URL and smoke-test evidence |

Do not change any row to PASS merely because the relevant code or test exists. A test definition is not an executed result.

## 3. Close Phase 6G before extending the parser

1. Run the complete unit suite.
2. Run the TypeScript and Vite production build.
3. Run the complete Playwright suite, including the fixture browsers added for resource accounting, authority decisions, policy-profile composition, and the Phase 6G parser.
4. Confirm the selectors identify the intended fixture browser when multiple browsers are present on the same page.
5. Confirm each fixture load is inert: it may populate the editor, but must not parse, authorise, reserve resources, or execute until an explicit user action.
6. Confirm the displayed source expectation and the current parser observation remain separate fields. A mismatch is evidence to investigate, not permission to rewrite the fixture or silently broaden the parser.
7. Record exact command, environment, result, failing test IDs, and commit SHA. Fix failures at their cause; do not weaken assertions to obtain a green run.
8. After a successful production build and browser run, smoke-test the deployed site and record the deployment identifier and tested URL.

## 4. Phase 6H — recommended next implementation slice

**Working title:** Typed semantic analysis for the existing provisional AST.

This phase must be a separate layer after parsing. It must not change the surface grammar or lexicon merely to make semantic checks easier.

### Scope

- Define a typed intermediate representation for the AST nodes the Phase 6G parser already emits.
- Define a small, explicit type environment using only source-backed type distinctions already present in the canonical specification (for example Quantity, Scalar, and Observation).
- Add operator signatures only where an authoritative source or an explicitly labelled provisional decision supplies the required arity and input/output types.
- Report unknown signatures as unresolved; do not guess from an English gloss.
- Preserve operand order and source spans through the typed representation.
- Return structured diagnostics with stable codes, source location, expected type/signature where known, actual type where known, and a clear unresolved status where evidence is missing.
- Keep parsing success, semantic validity, physical feasibility, authorisation, and execution as separate outcomes.

### Explicit non-goals

- No invented spoken Arcane syntax or morphology.
- No automatic legacy-alias rewriting.
- No universal implicit unit conversion.
- No assumption that GAMA causes a physical effect.
- No physical feasibility solver, resource reservation, authority service, or spell execution.
- No promotion of provisional parser notation to canon.

### Acceptance criteria

1. Existing Phase 6G parser tests remain unchanged and pass.
2. A syntactically valid expression can receive a semantic error without being misreported as a parse error.
3. Unknown operator signatures produce an explicit unresolved-signature diagnostic, not a guessed type.
4. Known type mismatches are rejected; no implicit conversion is introduced without a source-backed conversion rule.
5. Nested expressions preserve tree shape and operand order.
6. Every semantic rule has positive, negative, and boundary fixtures.
7. The UI labels this output as provisional semantic analysis and states that it is not physical feasibility or execution.
8. The unit suite, production build, and browser suite pass before the phase is marked complete.

## 5. Change-control record

Before adding any signature or type rule, record:

- rule ID and source passage;
- whether it is CANON, LOCKED DESIGN CANON, PROVISIONAL, or UNRESOLVED;
- accepted AST shape and operator signature;
- positive, negative, and boundary examples;
- expected diagnostics;
- tests executed and their results;
- any effect on existing fixtures or aliases.

A missing source definition is a visible gap, not an invitation to invent a convenient rule.

## 6. Recommended order of work

1. Close the Phase 6G verification gate.
2. Fix only demonstrated failures.
3. Freeze the parser output contract and add AST shape snapshots where needed.
4. Implement the typed semantic layer behind an independent module boundary.
5. Add the semantic fixture browser only after its fixtures and diagnostic contract are stable.
6. Update the documentation catalogue, test registry, and development plan together.
7. Verify CI and production deployment before calling the slice complete.
