# Operator contract registry — evidence and limits

**Status:** Provisional research metadata; not an executable operator type system.

## Purpose

The registry at `src/engine/operatorContracts.ts` makes operator claims inspectable without promoting audit proposals into canon. Each entry records an operator label, any supported arity metadata, source anchors, dimensional/evaluation limitations, and the unresolved questions that must be answered before implementation.

## Evidence policy

- **provisional-audit-signature**: arity copied from the proposed Phase 2 signature table. The parser can check that count in the abstract audit notation; this does not establish accepted input types, output types, commutativity, units, or execution semantics.
- **canon-described-incomplete**: a source supports a limited semantic statement, but not a complete executable signature. SIMA is described as producing an observation; its arity and measurement pathway remain unfinished.
- **unresolved**: the current evidence is insufficient to register an exact signature or arity. A conceptual description is retained as a question, not treated as executable behaviour.

## Current coverage

| Operator group | Registered claim | Explicitly not claimed |
|---|---|---|
| FRAPA, FRATA, FRAKA, FRALA, FRASHA, DRAN, DREM, DRIM, DRAL | Provisional Phase 2 arities: 2, 2, 2, 2, 1, 1, 2, 2, 3 | Canonical approval, complete typing, dimensional acceptance, evaluation |
| SIMA | Observation output is described | Complete arity, sensor/pathway model, resolution, uncertainty, executable evaluator |
| NES, GAMA, DAVE, KWAM, KWAT, KWAK, GRAN, GRAT, GRAK, BEK, ZET | Names/conceptual notes are recorded for traceability | Locked arity, complete input/output types, side effects and evaluation rules |

## Guardrails

1. Do not infer a signature from an English gloss.
2. Do not infer that the same arity implies the same semantics.
3. Do not treat GAMA assignment as physical causation or KWAM binding as creation of matter/energy.
4. Do not treat SIMA as knowledge creation without a physical measurement pathway.
5. Keep dimensional rules separate from operator type acceptance until both are specified and connected.
6. Parser acceptance means only that the provisional audit notation passed its current structural and arity checks.

## Tests

Stable cases `OPC-001`–`OPC-008` cover provisional arity metadata, no invented types, SIMA's limited observation claim, unresolved conceptual operators, source/open-question presence, case-normalized lookup, safeguards, and explicit non-executable dimensional/evaluation statements. CI determines whether these tests pass; this document alone does not assert that they have passed.

## Next work

Recover the exact source passages for each operator, resolve cross-document naming/signature gaps, approve signatures through the decision ledger, and only then design an operator-specific type checker. Numerical evaluation and spell feasibility must remain separate from parsing.
