# Arcane Language Audit — Phase 2

**Title:** Formal syntax, operator signatures, and unique-parse validation  
**Status:** PROVISIONAL FORMALISATION  
**Source:** User-supplied Phase 2 audit.  
**Scope warning:** This document adds proposed notation for testing. It does not overwrite canon or claim that the notation is already the spoken form of Arcane.

## 1. Proposed expression representation

Provisional abstract form: `OPERATOR⟨argument₁, argument₂, …⟩`.

Example: `FRAPA⟨KI, TO⟩`, read for testing as addition of values represented by KI (1) and TO (2). Angle brackets and commas are audit notation, not established Arcane words.

Nested example: `FRAPA⟨KI, FRAPA⟨TO, MU⟩⟩`.

The representation marks argument boundaries, preserves nesting, and does not rely on ordinary mathematical precedence.

## 2. Provisional signature register

| Operator | Proposed input signature | Output | Arity | Confidence / open issue |
|---|---|---|---:|---|
| FRAPA — add | Quantity × Quantity | Quantity | 2 | Provisional; quantity/unit compatibility needs rules |
| FRATA — subtract | Quantity × Quantity | Quantity | 2 | Provisional; operand order matters |
| FRAKA — multiply | Quantity × Quantity | Quantity | 2 | Provisional; dimensional algebra needed |
| FRALA — divide | Quantity × Quantity | Quantity or ratio | 2 | Provisional; zero denominator policy missing |
| FRASHA — negate | Numeric value | Numeric value | 1 | Provisional |
| DRAN — magnitude | Vector or magnitude-bearing value | Scalar magnitude | 1 | Provisional; supported input types need listing |
| DREM — dot product | Vector × Vector | Scalar | 2 | Provisional |
| DRIM — cross product | 3D vector × 3D vector | 3D vector | 2 | Provisional |
| DRAL — compare | Comparable × Comparable × relation criterion | Boolean/logic value | 3 | Partly grounded by canonical example; criterion encoding missing |
| SIMA — measure | Target/property + measurement-pathway specification | Observation | At least 2 conceptually | Exact surface arity unresolved |
| NES — read | Available-information reference | Retrieved information | At least 1 conceptually | Exact signature unresolved |
| GAMA — assign | Destination/reference × value | Updated symbolic state or assignment | 2 conceptually | Must not be treated as physical causation |
| DAVE — infer | Evidence × inference model/rule | Hypothesis or inferred value | At least 2 conceptually | Exact signature unresolved |
| KWAM — bind | Binding identifier × expression | Binding declaration | 2 conceptually | Identifier representation unresolved |
| KWAT — reference binding | Binding identifier | Bound value/expression | 1 | Provisional |
| KWAK — live evaluation | Live expression/reference | Current evaluated value | 1 conceptually | Evaluation timing and repeated sampling unresolved |
| GRAN — AND | Boolean × Boolean | Boolean | 2 proposed | Likely binary; n-ary form not established |
| GRAT — OR | Boolean × Boolean | Boolean | 2 proposed | Likely binary; n-ary form not established |
| GRAK — NOT | Boolean | Boolean | 1 proposed | Provisional |
| BEK — IF | Condition × expression/action | Conditional control expression | 2 proposed | Else branch and evaluation semantics unresolved |
| ZET — WHILE | Condition × repeated action | Loop/control expression | 2 proposed | Termination and evaluation timing unresolved |

These are audit proposals, not all locked canonical signatures.

## 3. Typing safeguards

- Do not treat all quantities as interchangeable. Length, time, mass, velocity, and energy have different dimensions.
- Arithmetic output types depend on dimensions: length + length can yield length; length × length yields area; length ÷ time yields velocity.
- DRAL requires an explicit comparison criterion or relation value; exact representation is undefined.
- SIMA must not create knowledge without a physical measurement pathway, sensor interaction, resolution, and available information.
- GAMA assigns a representation; it does not cause the represented physical state to occur.
- KWAM creates a binding, not matter, energy, or a physical object.
- Control operators are not magical effects by themselves. Evaluation semantics must be defined separately from spell execution.

## 4. Unique-parse test proposals

| Test | Input / condition | Expected result | Evidence status |
|---|---|---|---|
| P2-T01 — Binary arity | `FRAPA⟨KI, TO⟩` | Exactly two arguments | Pass for proposed notation, by inspection |
| P2-T02 — Missing argument | `FRAPA⟨KI⟩` | Invalid under proposed binary signature; reject, do not guess | Expected, not compiler-executed |
| P2-T03 — Extra argument | `FRAPA⟨KI, TO, MU⟩` | Invalid unless a separate variadic operator is defined | Expected, not compiler-executed |
| P2-T04 — Nested parse | `FRAPA⟨KI, FRAPA⟨TO, MU⟩⟩` | One parse: outer FRAPA with KI and nested FRAPA | Pass for proposed notation, by inspection |
| P2-T05 — Order sensitivity | `FRATA⟨KI, TO⟩` vs `FRATA⟨TO, KI⟩` | Preserve operand order | Structural expectation; no parser run |
| P2-T06 — Type mismatch | `FRAPA⟨MA, SE⟩` | Reject if MA is length and SE time, unless compatible operation/conversion defined | Depends on provisional type/dimension system |
| P2-T07 — Modifier scope | Modifier on outer vs nested expression | Scope must be distinguishable | Notation unresolved |
| P2-T08 — Spoken surface | Explicit-boundary abstract notation | Spoken Arcane must reliably encode boundaries | Unverified |

The source audit describes 8 tests: 6 structural expectations directly supported by the proposed notation, 1 type test dependent on provisional dimension rules, and 1 spoken-surface test unverified. These are design-level checks, not a compiler run.

## 5. Next tasks

1. Define canonical type inventory: scalar, Boolean, vector, observation, reference, binding, temporal value, constraint, and control expression.
2. Define quantity dimensions and unit conversions before locking arithmetic signatures.
3. Define comparison criteria and relation-value representation for DRAL.
4. Define grouping and modifier notation, then test whether it can be pronounced without ambiguity.
5. Recover v2.0 morphology before choosing how argument boundaries are realised in the actual language.
