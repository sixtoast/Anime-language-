# Phase 8CN — Construction reference trace and continuity boundary

**Date:** 2026-11-14  
**Canon effect:** NONE · **Grammar changes:** none · **Execution:** none  
**Tests authored:** REF-8CN-001–012 · **Tests executed:** not executed locally

## 1. Purpose

This phase adds a sequence-level diagnostic to the recovered Construction reference model. The existing binder supports individual MI/NI/RI/me bindings and replacement; this increment makes those transitions inspectable as a trace, while refusing to invent clause-boundary grammar.

It is intended as a companion capability in the website's research workbench, not as a Construction compiler.

## 2. Evidence carried forward

Phase 5.16 C-04/C-05, citing Phase 4 §3.3, records:
- MI, NI and RI: default-volume scope;
- me: SELF-surface;
- reference persistence: UNTIL-REPLACED.

The existing formal context implementation validates the token/scope pair and a non-empty reference identifier. A valid explicit replacement replaces the previous binding as a whole. An absent replacement preserves the current binding within the recovered reference context.

The performed forms remain separate: mi, ni, ri, ne, rə, ro and ru are inventory-only; re and ra have partial readings with Shared Arcana collisions; mel is one worked-example association. None are silently accepted by this formal binder.

## 3. New sequence-level behaviour

Added `src/engine/constructionReferenceTrace.ts`.

The trace accepts explicit events:
- `REFERENCE`: a supplied MI/NI/RI/me token and reference identifier;
- `NO-REPLACEMENT`: no new reference supplied in the current context;
- `PHRASE-BOUNDARY`: the exact fixture separator `·`;
- `CLAUSE-BOUNDARY`: an externally supplied marker, with no claim that it is a canon delimiter.

It records every event, the resulting binding, the transition classification and a human-readable explanation.

### Boundary safety

A phrase or clause boundary does not automatically clear or replace a binding. Equally, the trace does not assume that a binding continues across it. After a boundary, a subsequent no-replacement event is marked `BLOCKED-ON-BOUNDARY-GRAMMAR`. An explicit valid reference can establish a new binding; this is an explicit replacement, not a deduction from the boundary.

This intentionally distinguishes:
- known persistence when no replacement is supplied within the recovered context;
- unknown behaviour at phrase/clause boundaries;
- a new, explicit reference supplied after such a boundary.

## 4. Example trace

Input events:

```text
REFERENCE(MI, target-A)
NO-REPLACEMENT
PHRASE-BOUNDARY(·)
NO-REPLACEMENT
REFERENCE(me, self)
```

Expected diagnostic sequence:

| Step | Event | Result |
|---:|---|---|
| 1 | MI → target-A | BOUND / DEFAULT-VOLUME |
| 2 | No replacement | Existing binding preserved |
| 3 | Phrase boundary | Boundary effect unresolved |
| 4 | No replacement | Continuity inference blocked |
| 5 | me → self | Explicit new SELF-SURFACE binding |

The trace does not declare the middle dot to be a universal phrase delimiter, does not infer a clause terminator, and does not claim the fifth event is syntactically legal in every Construction context.

## 5. What remains unresolved

- Complete spoken reference syntax and slot grammar.
- Anatomical landmark inventory and geometry.
- Scope semantics for performed fused references.
- Whether phrase boundaries preserve, suspend or reset reference scope.
- Clause-boundary syntax and scope behaviour.
- Productive MEL/anchor-coda morphology.
- Whether every Construction expression must establish a reference.
- Integration of reference binding with Foot/coupling signatures.

## 6. Incantation contract boundary

This Construction reference trace does not replace the Incantation Contract v1.9–v2.1 system. That system governs invocation records, authority, policy, resources and outcomes; this trace only inspects a small portion of the spoken/Performed Construction reference model. No spell authorisation or execution is performed.

## 7. Validation

Twelve Vitest cases are authored for token scope, persistence, explicit replacement, empty identifiers, phrase/clause boundary uncertainty and refusal to infer continuity. They are registered as authored/unverified and have not been executed in this environment.

**Decision ID:** P8CN-CONSTRUCTION-REFERENCE-TRACE-01 · **Canon effect:** NONE
