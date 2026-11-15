# Phase 8BS — Typed spatial values and proposal-level checks

**Date:** 2026-11-14  
**Sources:** Arcane v3.0-L §§2–4, 8, 11; Phase 8G–8K research; Phase 8I–8J frame/vector grounding and worked fixture.  
**Canon effect:** NONE. **New vocabulary:** none.  
**Tests authored:** 12. **Tests executed locally:** not executed.

## 1. Objective and source boundary

This phase turns the already documented Phase 8G–8J typed, frame-aware vector proposal into an inspectable research fixture model. It does not repeat the vector proposal or introduce an Arcane vector literal.

Source-grounded: FE is the frame role; PA/BA, TA/DA, KA/GA name the three signed spatial axes; MA, SE and KE are canonical units; DRAN, DREM and DRIM are glossed as magnitude, dot product and cross product. Arcane is a typed formal system.

Not established: a general vector constructor, whether every vector-like value is three-dimensional, a universal frame-binding syntax, transforms, complete operator signatures, or a mana-to-spatial conversion.

## 2. Typed value distinctions

The research schema distinguishes six kinds:

| Kind | Required interpretation in this profile |
|---|---|
| SpatialPosition | Point/location; requires frame identity and an explicit origin/reference identity |
| DisplacementVector | Three spatial components with length dimensions |
| VelocityVector | Three spatial components with length/time dimensions |
| ForceVector | Three components with force dimensions (M·L·T⁻²) |
| ManaStateVector | Internal mana-state degrees of freedom; not interchangeable with spatial vectors |
| GenericVector | Insufficiently typed for spatial operations |

The three-component profile applies only to the current spatial research fixture, not to every possible vector in Arcane or to ManaStateVector.

## 3. Frame and component record

Every spatial fixture explicitly records:
- kind;
- three named X/Y/Z components;
- frame role FE and a non-empty frame identity;
- the v3.0-L coordinate convention;
- a numeric component value, unit label and dimension vector;
- representation version and proposal provenance.

FE is not treated as the frame identity. A fixture label such as FRAME-TEST-01 is research metadata, not an Arcane token or canonical frame binding.

Position records additionally require an origin/reference identity. This is a conservative proposal for distinguishing a point from a displacement; it does not claim that the language's actual origin-binding syntax has been recovered.

## 4. Worked displacement fixture

Frame: FRAME-TEST-01  
Components: X = 1 m, Y = 2 m, Z = 3 m

Under the ordinary Euclidean proposal:

|D| = √(1² + 2² + 3²) = √14 m ≈ 3.742 m

D·D = 1² + 2² + 3² = 14 m²

These are mathematical results for the abstract fixture. They do not establish canonical DRAN norm semantics, the complete DREM signature, surface syntax or physical effect.

A second fixture has X = 1 m/s, Y = 0 m/s, Z = 0 m/s and kind VelocityVector. It is not accepted by the displacement-only magnitude helper. That helper is deliberately narrower than the still-unsettled canonical DRAN contract.

## 5. Validation outcomes

The proposal-level assessor uses three separate outcomes:
- ACCEPTED_BY_PROPOSED_TYPE_RULE
- REJECTED_BY_PROPOSED_TYPE_RULE
- BLOCKED_BY_MISSING_CONTRACT

A missing frame, malformed component, incompatible dimensional signature or invalid three-component profile is rejected by this explicit proposal. ManaStateVector and GenericVector are blocked because no spatial type mapping is established. These are research-tool outcomes, not canonical Arcane diagnostics.

The proposed displacement dot product additionally requires the same declared frame identity. It does not perform or infer a frame transform. The implementation currently demonstrates same-kind displacement self-dot only; mixed kinds remain outside the accepted contract.

## 6. Dimensional handling

The fixture stores a dimensional exponent vector (length, time, mass, temperature, angle) with each component. Displacement expects L; velocity expects L·T⁻¹; force expects M·L·T⁻². The dimensional labels and m/m/s display labels are research metadata, not new canonical unit tokens. The current helper requires matching component unit labels and does not implement unit conversion or derived-unit canonicalisation. Mixed labels are rejected rather than numerically combined.

## 7. Implementation

Added:
- src/engine/spatialValueModel.ts
- src/engine/spatialValueModel.test.ts

Updated:
- src/App.tsx — Construction Studio typed spatial value panel with worked results and explicit boundaries.
- src/engine/testRegistry.ts — 12 cases registered as SPATIAL-VALUE-001–012.

The model has no parser integration, no executable spell semantics and no physical effect path. It is an abstract research validator only.

## 8. Verification and next step

Thirteen tests are authored but have not been executed locally. Vercel preview build status is reported separately. No GitHub Actions workflow is dispatched; main and production remain untouched.

Next useful phase: test position-minus-position and position-plus-displacement semantics as competing typed mathematical contracts, while keeping all relation and surface-expression signatures unapproved. Do not add an Arcane token or parser production for these operations.
