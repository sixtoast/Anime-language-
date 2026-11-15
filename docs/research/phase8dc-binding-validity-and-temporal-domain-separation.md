# Phase 8DC — Binding validity and temporal-domain separation

**Status:** Implemented boundary reviewer. **Canon effect:** NONE. **Execution:** disabled. **Tests:** 10 authored and registered; not executed locally.

## Source-backed distinctions

Arcane Language v3.0-L §10 distinguishes static observation O(t₀) from live measurement O(t), and says stale information can cause mistakes. It does not define a binding expiry rule or a binding invalidation transition.

The existing `incantationEvidenceModel.ts` has an explicit evidence policy: observedAt, validUntil, maxAgeSeconds, provenance class, uncertainty and coverage. It returns ACCEPTED-BY-DECLARED-POLICY, UNKNOWN-STALE and other evidence decisions. These results apply to an evidence record under its supplied policy.

The existing `incantationLifecycleModel.ts` records append-only invocation events such as VALIDATED, READY, ATTEMPTED and OUTCOME-VERIFIED, with a separate interruption history. Its own limitation says it does not authenticate timestamps, prove cessation, verify physical outcomes or implement recovery.

The binding lifecycle evidence reviewer (Phase 8DB) separately tracks creation, identity, visibility, lifetime, mutation, freshness, invalidation and ownership.

## The four domains must not be collapsed

| Domain | What its model establishes | What it does not establish |
|---|---|---|
| Evidence validity | Whether a supplied evidence record passes a declared freshness/provenance policy at asOf | Whether a binding remains valid |
| Binding validity | Only the explicitly supplied lifecycle evidence status | Evidence acceptance or invocation outcome |
| Invocation lifecycle | Declared invocation event sequence and state coherence | Binding lifetime or referent freshness |
| Temporal contract | Structural completeness of a supplied temporal declaration | Automatic application to binding lifetime |

An expired observation may make an evidence-dependent decision unknown or stale. It does not, by itself, prove that the binding identifier has expired. Likewise, a completed or failed invocation does not prove that a binding should be destroyed, retained or invalidated. A temporal contract must not be silently reinterpreted as a binding-lifetime declaration.

## New boundary reviewer

`reviewBindingTemporalBoundaries` composes the existing evidence, binding-lifecycle, invocation-lifecycle and temporal-contract reviewers while retaining their results in separate domains. It reports when domains are missing and explains the prohibited cross-domain inferences.

It does not propagate an evidence decision into binding validity, propagate invocation state into binding lifetime, infer a binding state machine, or convert a temporal contract into expiry rules.

## Consequences for KWAM / KWAT / KWAK

- KWAM creates a binding, but exact creation-time and lifetime rules remain unformalised.
- KWAT references an established binding, but the source does not yet define the complete validity check at the point of use.
- KWAK is live evaluation; it must not be treated as a stored snapshot.
- O(t₀) versus O(t) is a source-backed conceptual distinction, not a complete freshness/invalidation algorithm.
- A future formal binding contract must explicitly define whether referent freshness is checked at creation, at each reference, continuously, or under another approved policy. This phase chooses none of these.

## Tests

Ten tests cover independent evidence acceptance/staleness, unresolved binding lifetime, invocation separation, temporal-contract separation, missing domains and non-execution boundaries. They are authored and registered but not executed locally.
