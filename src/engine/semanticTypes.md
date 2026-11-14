# Semantic type foundations

**Status:** Provisional implementation foundation; not a complete semantic checker.  
**Canon relationship:** Implements conservative representation boundaries described by Magic System v3.0 and Arcane v3.0-L. It does not promote provisional operator signatures into canon.

## Purpose

The language is described as a typed formal system. The type model must preserve distinctions that the magic specification treats as fundamental, especially:

`Information ≠ Mana ≠ Energy ≠ Force ≠ Coupling ≠ Effect`

The implementation now defines separate semantic categories for quantities, scalars, Booleans, vectors, observations, information, mana states, energy, force, coupling, effects, references, bindings, temporal values, constraints, control expressions, and unresolved values.

## Implemented behaviour

`src/engine/semanticTypes.ts` provides:

- A discriminated `SemanticValueType` union for those categories.
- A conservative `checkImplicitCompatibility` helper.
- Semantic principle records that link implementation boundaries to canonical distinctions.

The compatibility helper answers only whether two values may be treated as the same type **without an explicit conversion**. It does not decide whether a specific operator accepts those values.

- Different semantic kinds are rejected.
- Quantity values are compatible for this limited check only when their dimension vectors match.
- Vector compatibility checks component types.
- References, bindings and observations with unspecified payload types remain unresolved and fail closed.
- Unknown types are never silently accepted.

## Explicit non-goals

This is **not** yet an operator type checker, expression evaluator, spell compiler or feasibility engine.

1. The model is not connected to `parseAuditExpression`.
2. It does not define full operator signatures for FRAPA, FRATA, FRAKA, FRALA, DRAN, DRAL, SIMA, NES, DAVE or other operators.
3. It does not define implicit unit conversion, derived-unit spellings or the final treatment of angular types.
4. It does not resolve binding scope, identifier syntax, mutability, lifetime or live-evaluation timing.
5. It does not prove measurement has a valid physical pathway.
6. It does not turn symbolic assignment into physical causation.
7. It does not validate mana coupling, energy/matter conservation or spell feasibility.

## Stable test cases

The semantic test suite uses stable IDs `SEM-001` through `SEM-008`. CI's report publisher recognises these IDs and the Test Suite explorer groups them under **Semantic types**. The displayed execution status comes only from the published CI report; registry presence alone is not evidence that a test passed.

## Next step

Before this foundation becomes a real type checker, define a source-traceable operator contract schema with input types, output type, arity, dimensional rules, conversion rules, evidence status and unresolved questions. A contract marked provisional or unresolved must not be treated as an executable semantic rule. Only then should typed AST nodes be built from parser output.
