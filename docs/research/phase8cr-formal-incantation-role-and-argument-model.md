# Phase 8CR — Formal Incantation role and argument model

**Date:** 2026-11-14  
**Canon effect:** NONE. **New spoken forms:** 0. **Grammar changes:** none.  
**Tests authored:** INC-ARG-001–020. **Tests executed:** not executed locally.

## Source basis

This phase converts locked modern Incantation design records into an abstract argument reviewer. It does not recover historical spoken syntax.

- Incantations v1.0 §2: seven semantic obligations.
- v1.0 §§3–6: operation selectors, bounded operation schemata, coupling categories, spatial roles and core frame.
- v1.1 §§1–8: reference class, scope, resolution, binding, lifetime and collection cardinality.
- v1.2 §§2–8: condition records, preconditions, limits, invariants, resource checks and failure semantics.
- v1.3 §§2–4: mechanism, transition, goal and coupling semantic records.
- v1.6 §§2–5: typed-value metadata and distinction between identifier, reference, value, measurement and snapshot.
- v1.8 §§2–6 and 9–11: spatial values, frames, target identity and distinct PO/FO/LO roles.

## Operation argument obligations

| Selector | Bounded v1.0 frame | Model requirement |
|---|---|---|
| kren | target + state specification | committed target reference and typed desired state |
| trak | target + current state + new state | committed target reference and both typed states |
| frem | target + state specification | committed target reference and typed desired state |
| shren | target + release specification | committed target reference and typed release value |
| bran | coupling category + participant A + participant B | two independently resolved and committed references, distinct labels, category, relation model and validity scope |

The typed-value record follows v1.6: type, payload, provenance, validity and uncertainty. Presence is checked; compatibility and payload truth are not.

vare is retained as a preference/selection operator, not treated as a physical operation. Its preference argument contract is not implemented here.

## References and binding

Each reference preserves local label, class (SELF/FIELD/TARGET), scope (pi/len/pla/sur/vom/par/ben/net), resolution (RESOLVED/AMBIGUOUS/MISSING/STALE/INVALID), lifetime (CURRENT-STEP/SPELL), binding state (PROPOSED/COMMITTED) and referent identity.

Only a resolved, committed record with stable referent identity is usable. A kwat proposal is not a committed kwam binding. Labels are unique. Scope is not a collection selector: a volume does not select every object inside it.

This reviewer does not perform target sensing, authenticate identity or refresh stale bindings.

## Spatial roles

po (position), fo (direction) and lo (movement) remain distinct. Each carries a typed value. No coordinate system, vector, trajectory, unit, frame or conversion rule is invented. Repeated use of one marker is blocked in this bounded profile because no multiplicity rule is implemented; this is a conservative reviewer restriction, not a universal grammar rule.

A target reference and its position value are separate records.

## Constraints and gates

Constraint references may be recorded, but predicates, limits, budgets and postconditions are not evaluated. The v1.2 sequence remains: structure; references; types; preconditions; limits/resources; feasibility; external authorisation; external execution; postconditions. The v1.5 lifecycle remains separate, including its previously documented ordering note.

## Implementation and limits

Added src/engine/incantationArgumentModel.ts and reviewIncantationArguments(input). A structurally complete record is not a spoken parse, type compatibility proof, geometry calculation, feasible mechanism, passed precondition, sufficient resource budget, authority or consent decision, execution, or verified outcome.

No Construction Foot or H-series mapping is inferred. The Phase 5.15 CVC versus Phase 5.16 optional-coda discrepancy remains open. No spoken Arcana or Construction grammar is changed.

Twenty Vitest cases are authored and registered, not executed locally. The Vercel preview build checks TypeScript compilation and bundling only; it does not run Vitest or browser acceptance tests.
