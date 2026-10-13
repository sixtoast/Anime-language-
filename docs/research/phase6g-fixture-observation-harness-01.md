# Phase 6G fixture observation harness

**Status:** harness and tests committed; test execution not yet verified  
**Canon effect:** none

## Purpose

The recovered fixture file contains 16 source-derived cases. Several are direct accept/reject cases, while others explicitly depend on lexical context, parser slots, unresolved operator signatures, or the distinction between syntax and physical feasibility.

`src/engine/phase6gFixtureAudit.ts` now executes the fixtures against the current provisional TypeScript parser and records one observation per stable fixture ID. It does not rewrite the source fixtures or reinterpret archived prototype results as current test evidence.

## Comparison labels

- `match`: the observed result matches a simple, directly comparable accept/reject expectation, or the explicitly enabled legacy alias resolves to the expected operator.
- `mismatch`: a directly comparable expectation was not met.
- `conditional-unresolved`: the parser rejects an input whose fixture says context may resolve the ambiguity. This is recorded as a conservative observation, not a complete disambiguation implementation.
- `context-dependent`: the fixture requires a parser slot, source-backed operator signature, or error-family equivalence that the generic harness cannot safely assume.
- `scope-guardrail-confirmed`: the parser returns a syntax result without asserting physical feasibility; this is a scope check, not a validity result.

The audit summary deliberately uses the status `observations-generated-not-acceptance`. It is not a green/red release gate and does not claim every fixture passes.

## Root-node checks

The harness now records the observed root AST node kind (when a parse succeeds) and compares it to `expectedNode` for directly comparable positive fixtures. This avoids counting a parse as a match when the parser accepts the text but returns the wrong top-level node kind. For the identifier-slot fixtures, the harness now performs a separate probe by wrapping the unchanged fixture input in `KWAT`, whose first argument is parsed by the current implementation as an identifier. It records the observed child node or diagnostic while leaving the original fixture input and its context-dependent status intact. This is implementation evidence only, not canonical grammar approval. The harness also records the structural shape `Call-with-Block` when a successful call AST contains a block argument. This makes the control-block structure visible while keeping fixture 008 context-dependent: it does not validate the condition signature or establish that the form is canonical.

## Tests authored

`src/engine/phase6gFixtureAudit.test.ts` checks:

1. Every recovered fixture ID produces exactly one observation.
2. The FRATA case normalises to FRAJA only because the fixture explicitly enables legacy aliases.
3. RE/RA ambiguity cases remain rejected by the current parser.
4. The harness does not claim canon approval or fixture acceptance.
5. The control fixture exposes its `Call-with-Block` AST shape while retaining a context-dependent comparison status.
6. Identifier-slot fixtures receive a separate `KWAT`-wrapped probe; accepted/rejected observations remain context-dependent and do not silently become passes.
7. Eight explicitly mapped historical diagnostic families are compared against current diagnostic codes, including the identifier-slot diagnostic via its probe. A mapped diagnostic match is syntax evidence only, not canon or semantic acceptance.

## What remains

- Execute Vitest and the TypeScript/Vite build in CI.
- Review every direct mismatch from the generated report.
- Implement slot-aware comparison only when the recovered source defines the slot contract.
- Compare historical error families only through an explicit, narrow mapping to current diagnostic codes; unmatched families remain not-comparable rather than guessed.
- Keep syntax success distinct from semantic typing, mechanism validity, conservation/resource accounting, and physical feasibility.

No canonical specification, lexicon entry, alias policy, or spell semantics were changed by this harness.
