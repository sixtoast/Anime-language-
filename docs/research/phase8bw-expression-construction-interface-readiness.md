# Phase 8BW — Expression-to-Construction interface readiness specification

**Date:** 2026-11-14  
**Status:** Evidence-gated interface specification; compiler remains blocked  
**Canon effect:** NONE. **New Arcane vocabulary:** none. **Grammar changes:** none.  
**Tests authored:** P4-IFACE-001–011. **Tests executed:** not executed locally.

## 1. Purpose and source boundary

Phase 4's visible opening describes Construction v2.0 (Feet, couplings and scoped references) and Expression v3.0-L (typed prefix operators), and states that a compile bridge maps between them. The complete §3 bridge contract is not present in the checked-in text excerpt.

This phase specifies what evidence a future compiler design must have. It does not infer the missing mapping or implement compilation.

## 2. The interface is not the Incantation contract

The source/target pair under investigation is:

- Source: a validated Expression representation from the v3.0-L subsystem.
- Target: a declarative Construction-plan representation for the v2.0 subsystem.

The current workbench bridge instead records provisional Phase 6G AST paths against Incantation contract v1.0–v2.1 slots. That is a different target and cannot stand in for the Phase 4 compiler.

A Construction plan is also not assumed to be executable. Incantation authority, policy, resource, feasibility and execution contracts may interact with a later plan, but their integration point is not recovered.

## 3. Required interface evidence

The readiness gate contains twelve independently tracked requirements:

| ID | Required evidence |
|---|---|
| SOURCE | Complete Phase 4 §3 bridge source, reviewed and approved |
| VERSIONS | Exact source/target version compatibility |
| EXPRESSION-TYPES | Expression operand/result typing and validation |
| OPERATOR-MAP | Operator/operand to Construction mapping |
| REFERENCE-MAP | Scoped reference and identity mapping |
| SPATIAL-MAP | Frame, spatial role, vector and relation mapping |
| FOOT-MAP | Construction Foot and macro mapping |
| COUPLING-MAP | Coupling participant types, order and attachment |
| QUANTITY-MAP | Quantity type, unit and attachment rules |
| CONTROL-RELEASE | Control, release and lifecycle mapping |
| ERROR-MODEL | Typed diagnostics, failure and recovery semantics |
| OUTPUT-MODEL | Declarative Construction-plan representation |

A requirement may be UNRECOVERED, RECOVERED-UNREVIEWED or APPROVED. Merely finding a passage is not the same as approving its meaning and compatibility. Missing requirements remain blockers.

## 4. Minimum interface flow (research model, not grammar)

1. Identify the exact source and target versions.
2. Establish that the Expression source parsed under its own approved grammar.
3. Establish semantic typing under its own approved type rules.
4. Apply only explicitly approved mapping contracts.
5. Produce a declarative Construction plan, if and only if every required mapping is approved.
6. Return typed diagnostics when a mapping is absent or incompatible.
7. Hand the plan to a separately specified validation/authority/resource/feasibility lifecycle. Do not execute it as a side effect of compilation.

This flow is an interface-design checklist. It is not an assertion that Phase 4 §3 prescribes this exact order.

## 5. Current status

At this phase:
- Phase 4 bridge existence: recovered from the opening.
- Complete §3 contract: unrecovered.
- Expression parser: provisional Phase 6G surface parser; not equivalent to a validated v3.0-L compiler input.
- Expression semantic typing for the entire source subsystem: not established.
- Construction target plan schema: not established.
- Mapping families: unrecovered or partial in separate evidence records.
- Compiler readiness: blocked.
- Compilation/execution: disabled.

The evaluator reports the earliest blocking condition and enumerates every unresolved requirement. Even the hypothetical RESEARCH-READY state means only that a separately approved compiler design may begin; the evaluator always returns `compilePermitted: false` and `executable: false`.

## 6. Relationship to existing evidence

The gate deliberately references rather than overwrites:
- `constructionStageContractProfiles.ts`: seven stage evidence profiles, mostly partial or order-only;
- `constructionParseTreeContract.ts`: exact Phase 5.22 hand-flame fixture only;
- `constructionAxisSemantics.ts`: canonical v3.0-L signed-axis directions;
- `constructionSpatialGrammarEvidence.ts` and `constructionSpatialCompositionEvidence.ts`: inventory and composition boundaries;
- `constructionReferenceContext.ts`: bounded reference-context integrity rules;
- `operatorContracts.ts`: formal operator identity/contract records, not a Construction compiler mapping.

These sources establish fragments, not the complete cross-subsystem mapping.

## 7. Decision

Implement a non-executable readiness gate now. Do not implement a compiler, lower AST nodes, choose Foot or macro expansions, bind quantities to Construction stages, or connect Incantation runtime execution until the Phase 4 §3 source and all required mapping contracts have been recovered and approved.

**Decision ID:** P8BW-IFACE-GATE-01  
**Canon effect:** NONE  
**Surface syntax selected:** none  
**Operator signatures promoted:** none  
**Execution path added:** none
