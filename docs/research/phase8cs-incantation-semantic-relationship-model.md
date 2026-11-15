# Phase 8CS — Incantation semantic relationship and dependency model

**Date:** 2026-11-14  
**Canon effect:** NONE. **New spoken forms:** 0. **Grammar changes:** none.  
**Tests authored:** INC-REL-001–020. **Tests executed:** not executed locally.

## Primary design sources

- `docs/canon/arcane-incantations-v1.3-mechanism-and-effect-semantics.md` §§1, 3–8: desired state → proposed transition → mechanism → participants/coupling → constraints/resources → feasibility → external authorisation/execution → observed outcome. Goal, transition, mechanism, coupling and outcome evidence are distinct records.
- `docs/canon/arcane-incantations-v1.2-preconditions-constraints-and-failure.md` §§1, 3–7, 10: condition records, guard relationships, dependent-operation blocking, resource bounds and failure propagation.
- `docs/canon/arcane-incantations-v1.8-spatial-frames-and-region-semantics.md` §§2–6, 10–11: target, frame, region, spatial role and effect remain distinct; typed spatial values require explicit frame and representation contracts.
- Incantations v1.0–v1.1: operation and target/reference obligations; reference resolution and binding remain separate.

These are modern locked design contracts, not recovered historical spoken syntax.

## Graph vocabulary

Profile: `INCANTATION-RELATIONSHIPS-1.0`.

Nodes preserve semantic identity as separate records: OPERATION, REFERENCE, VALUE, GOAL, ACCEPTANCE-TEST, TRANSITION, MECHANISM, PARTICIPANT, COUPLING, CONDITION, RESOURCE-BUDGET, SPATIAL-ROLE, SPATIAL-VALUE, FRAME, FEASIBILITY, AUTHORIZATION, EXECUTION and OUTCOME.

The typed relationship vocabulary includes:
- GOAL → subject reference, property value, acceptance test and proposed transition.
- TRANSITION → initial and final state values.
- MECHANISM → supported transition, participants and coupling.
- COUPLING → participants.
- CONDITION / RESOURCE-BUDGET → guarded or bounded operation.
- SPATIAL-ROLE → spatial value → frame.
- FEASIBILITY → mechanism.
- AUTHORIZATION → execution; execution → attempted operation; outcome → observed execution and tested goal.
- OPERATION → prerequisite operation.

The endpoint type table is explicit in `src/engine/incantationRelationshipModel.ts`. It checks declared relationships; it does not infer missing edges or require every possible node.

## Dependency handling

Only `OPERATION-DEPENDS-ON-OPERATION` is treated as a prerequisite graph. Self-dependencies and cycles are rejected. Other semantic links are not globally topologically sorted: the central v1.3 chain is a semantic dependency narrative, not a universal syntax order or proof that every spell must instantiate every node.

The model does not implement the v1.2 condition evaluator. It only represents CONDITION-GUARDS-OPERATION and RESOURCE-BOUNDS-OPERATION links. The actual truth of predicates, resource sufficiency and dependent-operation abort behaviour remain unimplemented.

## Reviewer and boundaries

Added `src/engine/incantationRelationshipModel.ts` and `reviewIncantationRelationships(input)`. It checks profile, node/edge identity, endpoint existence, endpoint types, unresolved endpoints, duplicate relationships and operation prerequisite cycles.

A structurally coherent graph does not establish completeness, causation, model evidence, type compatibility, geometric validity, constraint satisfaction, feasibility, authorisation, execution or outcome success. All such fields remain explicitly unassessed or unperformed. No relationship is automatically supplied from the presence of a node.

No Construction Foot, H-series or macro mapping is inferred. The CVC versus optional-coda discrepancy remains unresolved. No spoken Arcana or Construction grammar is changed.

Twenty Vitest cases are authored and registered, not executed locally. Vercel build checks TypeScript compilation and bundling only; it does not run Vitest or browser acceptance.
