# Phase 8BV — Phase 4 compile-bridge boundary audit

**Date:** 2026-11-14  
**Status:** Architecture statement recovered; compile contract not recovered  
**Canon effect:** NONE. **Grammar/parser/compiler changes:** none.  
**Tests authored:** P4-BRIDGE-001–007. **Tests executed:** not executed locally.

## 1. Source-backed architecture statement

The visible opening (first 1,800 characters) of the Phase 4 DOCX-derived index entry identifies the document as a whole-language audit and consolidated-fixes control document dated 10 October 2026. It states that three layers had drifted apart: v2.0, v3.0-L and Phase 1–3 audit findings.

It then describes two subsystems in one language:

| Subsystem | Version | Opening-summary description | Purpose |
|---|---|---|---|
| Construction | v2.0 | Feet, couplings, scoped references | Says what the mana does |
| Expression | v3.0-L | Typed prefix operators | Computes values, selects targets and controls timing |

The same opening says: “A compile bridge maps one to the other (§3).”

This is evidence that a compile bridge is part of the Phase 4 architecture. It does not expose the actual §3 rules. The source is a consolidation/control document; its opening status says “DECIDED BY DELEGATION, UNTESTED BY LISTENERS”. No claim of listener validation is made.

## 2. Current website tool is not that compiler

The current `src/engine/expressionConstructionBridge.ts` has a different contract:

- Source: provisional Phase 6G surface AST.
- Target: Incantation contract v1.0–v2.1 fields.
- Operation: records manually supplied AST-path traceability to target slots.
- Mapping rules: deliberately absent.
- Execution: disabled.
- Canon effect: none.

The App labels it “Expression → Incantation boundary” and describes it as a traceability boundary, not a translator. It must not be renamed or presented as the Phase 4 Expression-to-Construction compiler.

These are different interfaces:
1. Phase 4: Expression subsystem ↔ Construction subsystem.
2. Current workbench: provisional Phase 6G AST ↔ Incantation contract field traceability.

The Incantation contract layer is not interchangeable with the Phase 4 Construction subsystem.

## 3. What remains unknown

The visible excerpt does not recover:
- source/target representations and exact version compatibility;
- directionality or round-trip behaviour;
- parse and semantic-analysis preconditions;
- operator/operand to Foot, macro and coupling mapping;
- reference, spatial-role, quantity, control and release mapping;
- ordering, arity, type rules and diagnostics;
- whether output is a declarative Construction plan or executable instruction sequence;
- how authority, policy, resources, feasibility and the Incantation contract interact with this bridge.

No translation rule, lowering rule, AST node mapping or executable code is proposed here.

## 4. Implementation

Added an evidence-only module `src/engine/phase4CompileBridgeEvidence.ts` and seven tests. Added a Research & Review item and clarified the existing editor copy so it no longer implies that the current traceability review is the recovered compiler.

The module exposes the two-subsystem statement, compiler existence status, the separate current workbench interface and explicit unknowns. It has no parser, translator, code-generation or execution path.

## 5. Next source gate

Recover the complete Phase 4 §3 and the related Construction definitions in §§3.1–3.3, §6 and §§8–11. Compare those passages against the current AST, operator registry, Construction stage records, Feet and Incantation contract model. Only then design a typed, version-aware compiler contract.

Until the actual §3 text is available, the correct state is **bridge existence recovered; bridge semantics unresolved**.
