# Phase 8DA — Binding reuse eligibility and temporal preservation

**Status:** Conservative evidence-review model.  
**Canon effect:** NONE · **Execution:** disabled · **Tests:** 12 authored and registered; not executed locally.

## Purpose

Phase 8CZ reconciled the canonical operator vocabulary with the provisional parser. This phase addresses the next practical question: when may two repeated expressions be considered for one shared binding without changing what either occurrence means?

The reviewer is deliberately stricter than a text deduplicator. It does not decide that two expressions are equivalent. It accepts only caller-supplied expression identity and explicit evidence for type, scope, lifetime, referent identity and effect behaviour.

## Canonical operator distinction

Arcane Language v3.0-L §10 establishes:

- **KWAM** creates a binding.
- **KWAT** references an established binding.
- **KWAK** performs live evaluation.

The source's conceptual example is `KWAM 1 E`, `KWAT 1` and `KWAK 1`. It leaves exact identifier representation and evaluation semantics for formalisation. Therefore this phase does not authorise a new surface grammar or alter the Phase 6G parser.

## Eligibility rules encoded

A repeated pair is only marked `ELIGIBLE-FOR-OWNER-REVIEW` when all of the following are supplied and explicitly established for both occurrences:

1. The same exact expression fingerprint, supplied by the caller. The reviewer does not generate fingerprints or prove semantic equivalence.
2. The same non-empty value type.
3. The same non-empty binding scope and explicit scope evidence.
4. The same non-empty binding lifetime and explicit lifetime evidence.
5. The same non-empty referent identity and explicit referent evidence.
6. Both expressions are established as pure, with no side effects.
7. Both occurrences are snapshots, not live evaluations.

Even then, the reviewer only recommends that the pair be taken to owner review. It does not generate KWAM/KWAT source, allocate an identifier, choose a scope, rewrite an expression or approve a canon rule.

## Live evaluation protection

If either occurrence is live, the result is `PRESERVE-LIVE-EVALUATION` and the suggested operator is KWAK. A live expression must not be cached as a static binding by this reviewer. If one occurrence is live and the other is a snapshot, the result also records the mode mismatch.

This is a temporal correctness guardrail: an observation at (t_0) is not interchangeable with a live observation at (t).

## Block conditions

Reuse is blocked by missing or unresolved evidence, differing fingerprints, differing types, differing scopes, differing lifetimes, differing referent identities, unknown/side-effectful behaviour or unknown evaluation mode. No inferred default is supplied for any of these fields.

The scope/lifetime fields are evidence supplied by a caller; they do not adopt the experimental SPELL/CURRENT-STEP proposal as canon.

## Deliberate non-goals

- No identifier grammar or new spoken form.
- No change to KWAM/KWAT/KWAK parser support or canonical arity.
- No scope/lifetime policy decision.
- No expression fingerprint algorithm or semantic-equivalence proof.
- No static/live evaluation engine.
- No compression rewrite or source expansion.
- No spell execution, authority, safety or physical-outcome validation.

## Test coverage

Twelve Vitest cases are authored for eligible snapshot review, unresolved scope/lifetime, expression/type/scope/lifetime/referent mismatches, side effects, live evaluation, snapshot/live mismatch and non-execution guarantees. They are registered in the workbench but have not been executed locally.
