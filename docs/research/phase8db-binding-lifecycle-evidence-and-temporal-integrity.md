# Phase 8DB — Binding lifecycle evidence and temporal integrity

**Status:** Evidence-completeness model; all lifecycle rules remain open pending source recovery and owner approval.  
**Canon effect:** NONE · **Execution:** disabled · **Tests:** 12 authored and registered; not executed locally.

## Source boundary

Arcane Language v3.0-L §10 establishes three distinct concepts: KWAM creates a binding, KWAT references an established binding, and KWAK performs live evaluation. Its example uses `KWAM 1 E`, `KWAT 1` and `KWAK 1`. The same section explicitly leaves identifier representation and evaluation semantics for formalisation. It distinguishes a static observation O(t₀) from live observation O(t).

The integrated Incantation review models temporal contracts and lifecycle events, but it does not define the lifetime of a KWAM binding. Its invocation lifecycle states (VALIDATED, READY, ATTEMPTED, etc.) describe an invocation, not binding validity. These two lifecycle domains must not be conflated.

## Eight dimensions that must be specified

| Dimension | Required decision/evidence | Current canonical status |
|---|---|---|
| Creation | What expression/value is established, and when | NOT-ESTABLISHED |
| Identity | Identifier form, uniqueness and referent identity | NOT-FORMALISED |
| Visibility | Where KWAT may resolve the binding | NOT-ESTABLISHED |
| Lifetime | Start, expiry and end conditions | NOT-ESTABLISHED |
| Mutation | Whether rebinding/reassignment is possible | NOT-ESTABLISHED |
| Freshness | How snapshot validity and staleness are represented | PARTIAL-CONCEPTUAL |
| Invalidation | What happens when a referent changes or disappears | NOT-ESTABLISHED |
| Ownership | Who/what may establish, use or invalidate it | NOT-ESTABLISHED |

The source's static/live distinction supports preserving temporal mode, but does not supply a complete freshness policy, expiry rule or invalidation mechanism. The SPELL/CURRENT-STEP scope proposal remains experimental and is not adopted here.

## Existing model boundary

The Incantation evidence reviewer already checks timestamps, declared validity windows, maximum age and evidence provenance for evidence records. Those checks concern supplied evidence records; they do not automatically establish binding lifetime. Likewise, invocation lifecycle ordering cannot be reused as a binding state machine without an explicit contract.

## New reviewer

`reviewBindingLifecycleEvidence` audits eight caller-supplied claims: creation, identity, visibility, lifetime, mutation, freshness, invalidation and ownership. It reports missing, unresolved, conflicting, duplicate or unsupported claims. It does not prescribe allowed transitions, choose expiry semantics, infer owner authority, generate identifiers, rewrite text or execute.

A complete evidence inventory is only **EVIDENCE-COMPLETE-FOR-OWNER-REVIEW**. It is not a canonical grammar approval or proof that a proposed lifecycle is correct.

## Temporal and compression consequences

- A snapshot O(t₀) and live O(t) remain distinct.
- KWAT cannot be substituted for KWAK merely because the surface expression looks repeated.
- A binding's existence does not prove its referent remains valid.
- Reuse eligibility still depends on exact expression identity, type, scope, lifetime, referent and effect evidence (Phase 8DA).
- Freshness, invalidation and mutation must be explicit before safe reuse can be considered.
- No claim is made that every binding must support mutation, expiry, or invalidation in a particular way; the language must specify whether each applies and how.

## Deliberate non-goals

No identifier syntax, lifecycle state machine, scope policy, mutation rule, freshness threshold, invalidation transition, KWAM/KWAT/KWAK arity, parser change, semantic-equivalence algorithm, binding creation, evaluation or execution is introduced.

## Tests

Twelve Vitest cases are authored and registered for completeness, unresolved dimensions, conflicts, malformed evidence, duplicate claims and non-execution boundaries. They have not been executed locally.
