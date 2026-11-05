# Phase 6H — Semantic Analysis Integration Contract

**Status:** DESIGN CONTRACT — implementation integration not yet complete  
**Prepared:** 2026-11-05  
**Depends on:** Phase 6G provisional surface parser; `dimensions.ts`; `semanticTypes.ts`; `operatorContracts.ts`  
**Authority boundary:** This document governs implementation architecture. It does not add or amend Arcane canon.

## 1. Repository baseline discovered

The Phase 6H foundation already exists in the repository:

- `src/engine/surfaceParser.ts` emits a provisional AST with atom, quantity, identifier, call and block nodes.
- `src/engine/dimensions.ts` defines a limited unit registry and dimension-vector arithmetic.
- `src/engine/semanticTypes.ts` defines distinct semantic kinds and conservative implicit compatibility.
- `src/engine/operatorContracts.ts` records proposed arities and explicitly unresolved operator signatures.
- `src/engine/semanticTypes.test.ts` tests type distinctions and compatibility boundaries.

These modules are not yet an integrated semantic analyser. In particular, the surface parser does not invoke dimensional analysis or operator contracts, and the existing type vocabulary does not assign inferred types to parsed expressions.

## 2. Core design rule

Semantic analysis consumes a successful parse result. It must never repair, reinterpret or silently reparse source text.

The pipeline is:

**source → Phase 6G parse → provisional AST → semantic analysis → typed/unresolved analysis result**

Physical feasibility, external authority, execution contracts and outcome verification remain separate downstream concerns. Semantic analysis must not report that an operation is feasible, authorised, executable or executed.

## 3. AST-to-type policy

| AST node | Safe initial treatment | Prohibited inference |
|---|---|---|
| Quantity with registered unit MA, SE, KE, KU or RA | Quantity with the dimension vector returned by the existing unit registry | Do not infer a physical mechanism or convert to an unregistered unit |
| Quantity with SHO | Scalar/dimensionless numeric value, explicitly labelled as an implementation convention pending canon review | Do not assume it is interchangeable with every quantity |
| Atom | Unknown semantic type unless a separate source-traceable symbol contract defines its type | Do not infer a type from the English gloss or lexical class alone |
| Identifier | Unresolved reference until binding environment and scope rules are specified | Do not assume an identifier exists or infer its payload type |
| KWAM/KWAT/KWAK calls | Unresolved semantic result until binding identity, scope, lifetime, mutability and evaluation timing are specified | Do not treat binding creation as physical creation |
| Operator call | Consult exact operator contract; unresolved unless input/output signature and required semantic rules are sufficiently specified | Do not infer signature from parser arity, token name or English gloss |
| Block | Preserve ordered child expressions; result type unresolved until control-flow and block-result semantics are specified | Do not assume a block returns its last expression or executes |

RA is represented dimensionlessly in the current SI-style dimension algebra. Preserve this as an explicit implementation convention, not a final decision about the language's treatment of angle.

## 4. Operator-contract requirements

The current operator registry correctly distinguishes proposed parser arity from semantic contracts. The analyser must preserve that distinction.

An operator can be semantically checked only when the registry supplies all required fields:

- exact operator identity;
- evidence status and source reference;
- accepted input semantic types;
- output semantic type or a documented type function;
- arity and argument-role mapping;
- dimensional constraints;
- unresolved conditions and diagnostic policy.

A provisional arity by itself is insufficient to type-check a call.

Where a contract is incomplete, emit an unresolved diagnostic such as `SEMANTIC_SIGNATURE_UNRESOLVED`. Do not report a type mismatch when the expected type is unknown. Do not report success merely because the number of arguments matches.

## 5. Analysis result contract

The integration should return a result shaped conceptually as follows:

```ts
interface SemanticAnalysisResult {
  status: "valid" | "invalid" | "unresolved";
  notation: "phase-6g-provisional";
  typedAst?: TypedSurfaceNode;
  diagnostics: SemanticDiagnostic[];
  limitations: string[];
}
```

The exact exported TypeScript types should be designed to fit existing project conventions before implementation. This illustrative shape is not a request to copy it blindly.

Required diagnostic fields:

- stable diagnostic code;
- severity: error, warning or unresolved;
- AST path or source token location;
- operator or node identity;
- expected type/signature when known;
- actual type when known;
- evidence/source reference;
- plain-language explanation.

A single expression may contain multiple independently discoverable diagnostics. Preserve deterministic ordering. Never erase a blocking diagnostic because another check later succeeds.

## 6. Status semantics

- **valid:** every semantic rule applicable to the expression is defined and passes.
- **invalid:** at least one defined semantic rule is known to fail.
- **unresolved:** required semantic evidence or a required rule is missing, and no known invalidity has already established failure.
- If both a known error and unresolved questions exist, status is invalid and both diagnostics remain visible.

Parse failure remains a parse result, not a semantic result. The analyser should not accept a failed parse as an empty or partial AST.

## 7. Initial implementation slices

### 6H-A — AST and type foundations

- Define typed AST wrappers without mutating the parser's AST.
- Infer types only for source-backed, unambiguous literals.
- Preserve source AST and operand order.
- Test registered units, dimensionless SHO convention, unknown atoms and unresolved identifiers.
- Ensure invalid or unknown unit symbols cannot be silently accepted.

### 6H-B — Contract-driven operator analysis

- Adapt the existing operator registry into a typed lookup boundary.
- Keep proposed arity, canonical description and executable semantic contract as separate fields.
- Implement only operators with complete approved contracts.
- Emit unresolved diagnostics for incomplete contracts.
- Add positive, negative and boundary fixtures for each implemented signature.

### 6H-C — Bindings and control structures

Do not implement inferred binding or block semantics until scope, lifetime, evaluation timing, branch behaviour, termination and result semantics have source-backed decisions. Build an unresolved diagnostic path and fixtures first.

### 6H-D — Playground integration

- Show parse output and semantic output in separate panels.
- Allow semantic analysis only after successful parsing.
- Show type evidence, operator-contract provenance and unresolved questions.
- Never use a green semantic status to imply physical feasibility or execution.
- Maintain responsive layout and browser tests.

## 8. Required regression safeguards

1. All existing Phase 6G parser fixtures and expected parser results remain unchanged.
2. Semantic analysis is deterministic for the same AST and contract registry.
3. Unknown operators and incomplete signatures remain unresolved.
4. Information, mana-state, energy, force, coupling and effect remain distinct semantic kinds.
5. Quantities with different dimensions cannot be treated as implicitly compatible.
6. No implicit unit conversion is introduced unless the unit registry and source specification define it.
7. Nested expressions preserve exact structure and argument order.
8. A known type mismatch is reported as invalid, not unresolved or parse failure.
9. An unknown type is reported as unresolved, not guessed.
10. No semantic result claims physical feasibility, authorisation, execution or verified outcome.
11. Unit tests, TypeScript build and browser tests must pass before any slice is marked verified.

## 9. Open specification decisions

The following are blockers for broader semantic coverage:

- Full canonical operator input/output signatures.
- Quantity versus scalar distinctions and the status of dimensionless values.
- Unit conversion and derived-unit naming.
- Vector representation and component semantics.
- Observation freshness, uncertainty, sensor pathway and measurement effects.
- Comparison criterion representation for DRAL/its unresolved surface counterpart.
- Binding identifier identity, scope, lifetime, mutability and evaluation.
- Conditional and loop semantics, block result and termination.
- Mapping between the surface grammar and the separate spell representation.

These are specification tasks, not merely programming tasks. Record decisions in the canon/audit ledger before treating them as established rules.

## 10. Completion definition

Phase 6H is not complete when a few expressions produce types. It is complete only when the supported semantic subset is explicitly bounded, source-traceable, tested for positive/negative/boundary cases, integrated into the Playground without conflating later magic-system gates, and all required verification evidence is recorded.
