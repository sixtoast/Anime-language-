# Phase 8CY-W — Grammatical compression opportunity audit

**Status:** implemented as a non-transforming analysis.  
**Canon effect:** NONE · **Execution:** disabled · **Tests:** 16 authored, not executed locally.

## Objective

Identify one narrowly bounded possible grammatical compression: a single spell-scoped reference declaration reused across multiple operation argument records. This is a research aid for designing a future binding/abbreviation rule, not a rule that the language currently has.

## Evidence and model boundary

The existing Incantation argument profile distinguishes reference label, reference class, scope, resolution, lifetime, binding state and stable referent identity. It permits SPELL and CURRENT-STEP lifetimes and requires resolved, committed references for use. The audit treats these fields as independent; it does not infer that repeated identity alone makes two references interchangeable.

## Candidate rule under investigation

A reference can be flagged for grammar-design review only when at least two distinct operations contain an exactly identical reference record with:
- the same label, class, scope and stable referent identity;
- RESOLVED resolution;
- COMMITTED binding state; and
- SPELL lifetime.

CURRENT-STEP, unresolved, proposed, differently labelled, differently scoped or otherwise non-identical records are blocked. Repeated occurrences within one operation are also blocked because usage multiplicity may matter.

The audit also requires each occurrence to be explicitly consumed as the operation target or, for BRAN, as a coupling participant. It does not infer use from an untyped constraints array or other unknown fields. The report counts potential duplicate declarations, but does not estimate character savings: a future grammar's binding marker, scope syntax and expansion overhead are not yet defined.

## What remains unproven

Even a candidate is not yet licensed for compression. We have not established a spoken declaration syntax, its scope boundary, forward-reference behaviour, shadowing rules, lifetime rules, or a proof that hoisting preserves the semantics of every affected operation. No transformation is performed and no semantic equivalence is claimed.

## Next language-design questions

1. Where would a spell-wide reference declaration appear in the spoken grammar?
2. Does it bind before all operations, or only after declaration?
3. Can a local operation binding shadow a spell binding?
4. How are references invalidated or rebound?
5. Which other repeated structures, if any, can be factored without changing operation scope?

## Tests

Sixteen tests cover exact candidate identification, lifetime/state/resolution blockers, label/scope mismatch, operation multiplicity, identity separation, malformed inputs, immutability and non-execution boundaries.
