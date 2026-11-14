# Arcane Phase 8J — worked typed spatial-vector validation example

**Status:** Worked abstract example using proposal-level rules; not canon  
**Date:** 2026-10-15  
**Canon effect:** none  
**New vocabulary:** none  
**Tests executed:** none

## 1. Purpose

This phase demonstrates how a vector expression should be reviewed without inventing a canonical vector constructor. It takes the minimum research rules from Phase 8I and applies them to complete metadata records, operator candidates, and deliberate failure cases.

The example is a typed mathematical fixture, not a spoken Arcane sentence, not a parser test, and not a cast-ready incantation.

## 2. Declare the frame and values

For this worked example only, declare frame identity `FRAME-TEST-01` using the canonical convention +X right, +Y above, +Z forward. This identifier is a fixture label, not an Arcane token.

### Value D — displacement

```text
kind: DisplacementVector
dimension: 3 spatial components
frame_role: FE
frame_identity: FRAME-TEST-01
axes: X, Y, Z
components: X=1 m; Y=2 m; Z=3 m
source_status: proposal-level fixture
```

This is complete under the Phase 8I research proposal: three spatial components, one declared frame identity, and mutually compatible length units.

### Value V — velocity

```text
kind: VelocityVector
dimension: 3 spatial components
frame_role: FE
frame_identity: FRAME-TEST-01
axes: X, Y, Z
components: X=1 m/s; Y=0 m/s; Z=0 m/s
source_status: proposal-level fixture
```

This record is also complete under the proposal. Its type is distinct from D even though both have three components and share a frame.

## 3. Candidate operation: magnitude of displacement

The canonical inventory glosses `DRAN` as magnitude and explicitly gives `DRAN → Scalar` as a type example. It does not fully specify the accepted vector kinds and norm semantics in the inspected passages.

For the ordinary Euclidean norm proposed for this spatial fixture:

`|D| = sqrt(1² + 2² + 3²) m = sqrt(14) m ≈ 3.742 m`

Validation trace:

| Gate | Result | Basis |
|---|---|---|
| Value record complete | Pass under proposal | Three components, frame and units supplied |
| Input kind accepted by proposed spatial DRAN contract | Pass under proposal | D is explicitly a DisplacementVector |
| Mathematical norm | Pass | Ordinary Euclidean calculation |
| Canonical DRAN input/norm contract | Not fully established | Source gloss and Scalar output exist; full signature remains open |
| Canonical surface syntax | Not applicable | No Arcane vector literal is asserted |
| Physical/casting feasibility | Not assessed | This is a mathematical fixture only |

**Result:** mathematically well-defined and accepted by the proposed research contract; not proof of a complete canonical DRAN construction.

## 4. Candidate operation: dot product of displacement with itself

For the ordinary Euclidean dot product proposed for compatible spatial displacement vectors:

`D · D = 1×1 + 2×2 + 3×3 = 14 m²`

Validation trace:

| Gate | Result | Basis |
|---|---|---|
| Both records complete | Pass under proposal | D used twice |
| Same vector kind | Pass under proposal | Both operands are DisplacementVector |
| Same frame identity | Pass under proposal | Both use FRAME-TEST-01 |
| Compatible dimensions and component units | Pass under proposal | Three components; length on each component |
| Dot-product mathematics | Pass | Sum of component-wise products |
| Canonical DREM signature and units | Not fully established | Gloss exists; full type/unit contract is not settled |
| Canonical surface syntax | Not applicable | No vector constructor is claimed |
| Physical/casting feasibility | Not assessed | Numerical operation is not a physical effect |

**Result:** accepted by the proposed research contract, with output dimension length-squared. The result is not itself a displacement or a distance.

## 5. Deliberate negative case: displacement dotted with velocity

Candidate operands:
- D: DisplacementVector, component units m.
- V: VelocityVector, component units m/s.

A component-wise numerical product can be calculated, but the current Arcane evidence does not establish whether this mixed-kind DREM operation is semantically intended or permitted.

Under the minimal Phase 8H proposal, mixed-kind operands are blocked until an explicit cross-kind contract is approved. Therefore, the correct research outcome is:

`BLOCKED_BY_MISSING_CONTRACT`

It is not a mathematical claim that such products can never be meaningful. It is a refusal to silently invent the meaning in Arcane.

## 6. Deliberate negative case: different frames

Construct a copy of D whose frame identity is `FRAME-TEST-02`. The component values remain 1 m, 2 m and 3 m, but the identity differs.

Even though the component lists look identical, the research validator must not assume that the two frame identities share an orientation or origin. A DREM or DRIM operation between them is blocked unless an explicit frame transformation is supplied and its rules are defined.

Expected research status: `BLOCKED_BY_MISSING_CONTRACT`.

This conservative status does not establish a canonical prohibition; it identifies missing transformation semantics.

## 7. Deliberate negative case: mana-state vector

A `ManaStateVector` with three stored components is not automatically a spatial displacement vector. Its components may represent internal field degrees of freedom rather than positions or directions in ordinary space.

Passing it to the proposed spatial DRAN/DREM/DRIM contracts is blocked unless a field-specific type and operation contract exists. In particular, a numerical norm of internal field components must not automatically be described in metres or interpreted as a physical distance.

Expected research status: `BLOCKED_BY_MISSING_CONTRACT`.

## 8. Full validation pipeline

For each future vector construction, record the following gates independently:

1. **Source gate:** exact source, version and status of the operator and any notation.
2. **Representation gate:** components, dimension, frame identity, vector kind and units are complete.
3. **Syntax gate:** only applicable if a declared surface grammar is being tested; this document defines none.
4. **Type gate:** the operator accepts these operand kinds under a specified contract.
5. **Mathematics gate:** the operation is defined and its result is calculated correctly.
6. **Physical gate:** only for a claimed physical effect; check mechanism, energy/resources, coupling, control, stability and conservation as relevant.
7. **Casting gate:** only after the construction's linguistic and physical requirements have been separately established.

A pass at one gate must not be copied into the status of another gate.

## 9. What this worked example resolves—and what it does not

It demonstrates a usable research workflow for:
- a complete spatial displacement record;
- an ordinary magnitude calculation;
- a same-kind dot product with units;
- mixed-kind operands that need an explicit contract;
- cross-frame operands without a transform;
- a mana-state vector kept distinct from spatial geometry.

It does **not** decide canonical vector surface syntax, make all vectors three-dimensional, approve a universal Euclidean norm for DRAN, or promote any proposed operator signature to canon.

## 10. Decision ledger

- **Decision ID:** P8J-WORKED-VECTOR-VALIDATION-01
- **Canon changes:** none.
- **New vocabulary:** none.
- **Implementation changes:** none.
- **Tests executed:** none.
- **Worked results:** |D| = √14 m ≈ 3.742 m; D·D = 14 m² under the explicitly stated Euclidean proposal.
- **Next phase:** move from vector foundations to a different useful formal family: scalar quantity contracts and dimensional algebra for FRAPA, FRALA and FRASHA. Use explicit unit dimensions and failure cases; keep the contract proposal-level until the canon specifies them.
