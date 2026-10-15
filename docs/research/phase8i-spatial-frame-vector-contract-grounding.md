# Arcane Phase 8I — spatial frame and vector contract grounding

**Status:** Source-grounded rule extraction plus explicitly non-canonical recommendations  
**Date:** 2026-10-15  
**Canon effect:** none  
**New vocabulary:** none  
**Tests executed:** none

## 1. Why this phase exists

Phases 8G–8H established a proposed typed vector model. This phase checks it against the exact spatial and mathematical statements in the canonical language specification and the physical model, then separates what those sources actually establish from the additional contracts still needed.

The purpose is to stop treating familiar vector mathematics as though every detail were already specified by Arcane.

## 2. Rules directly grounded in canonical sources

The inspected canonical language file `docs/canon/arcane-language-v3.0-L.md` establishes:

1. Arcane is a typed formal system; incompatible types must not be accepted without a defined operation or conversion (§2).
2. Core operators have fixed argument counts and grouping must not rely on precedence (§2).
3. `FE` denotes the frame role (§3).
4. The signed spatial axes are `PA = −X`, `BA = +X`, `TA = −Y`, `DA = +Y`, `KA = −Z`, `GA = +Z`; the convention is +X right, +Y above, +Z forward (§4).
5. `JO`, `JUR`, `JA`, `JE`, and `JI` express toward, away, along, parallel, and aligned/coincident relations (§4).
6. `DRAN`, `DREM`, and `DRIM` are listed as magnitude, dot product, and cross product (§8).
7. The specification provides a conceptual binding example but leaves identifier representation and evaluation semantics open (§10).
8. The canonical unit inventory includes metre `MA`, second `SE`, kilogram `KE`, radian `RA`, and kelvin `KU` (§11); collisions must be handled without silently deleting historical senses.

The inspected magic-system file `docs/canon/magic-system-v3.0.md` separately establishes that information, mana, energy, force, coupling and effect are distinct; mana's internal vector degrees of freedom are not thereby an ordinary electromagnetic vector field; and every physical state transition needs a physical mechanism with resource, coupling, control and stability checks.

## 3. What the sources do not establish

The inspected passages do not define:
- a canonical surface vector literal or component-list constructor;
- whether every vector-like value has exactly three components;
- a canonical component order for general vectors;
- a universal rule for binding a vector to a frame;
- whether `FE` itself supplies a frame value or merely marks a frame role;
- a canonical transformation between frames;
- the accepted input types, result units, domains or failure cases for all three vector operators;
- whether the spatial `DRIM` contract is necessarily the only cross-product contract;
- any operation that converts a mana-state vector into a spatial displacement, velocity or force vector.

A reference to the signed spatial axes is not itself a vector-literal grammar. Likewise, a frame role is not a complete frame-binding expression.

## 4. Frame contract: minimum safe research rule

**Proposal, not canon:** a spatial vector fixture should include a named frame identity in addition to the frame role and axis components. `FE` may label the role of a frame reference, but a test must not assume that writing `FE` alone identifies a specific coordinate frame.

Represent the metadata in the research harness as:

`frame = { role: FE, identity: <declared-frame-id>, convention: (+X right, +Y above, +Z forward) }`

The angle-bracketed placeholder above is meta-notation, not Arcane syntax.

For research validation:
- Missing frame identity blocks frame-dependent spatial operations.
- Two frame identities are not presumed compatible merely because both use the canonical axis names.
- Cross-frame operations require an explicit transformation contract or remain blocked.
- Do not invent a transformation operator or conversion token in this phase.

## 5. Dimensionality and units: minimum safe research rule

The canonical axes define three spatial directions, but this alone does not prove that every mathematical or mana-state vector is three-dimensional. Keep these questions distinct:
- **Spatial coordinate dimension:** the three signed axes in the current canonical convention.
- **Value kind:** displacement, velocity, force, or a field-internal state.
- **Component dimension:** the physical units attached to each component.
- **Representation dimension:** the number and interpretation of stored components.

**Proposal, not canon:** a spatial vector fixture intended to use the current coordinate convention must supply one component for each of X, Y and Z, each with compatible component units. A generic vector or mana-state vector may not be forced into this rule without its own model.

Unit checks should follow the intended operation:
- Displacement components ordinarily carry length units.
- Velocity components ordinarily carry length/time units.
- Force components ordinarily carry force units.
- Products produce units only under an approved operator contract.
These are dimensional-analysis expectations for the proposal, not new Arcane canon.

## 6. Operator grounding and open decisions

| Operator | Grounded fact | Additional contract still needed |
|---|---|---|
| DRAN | Glossed as magnitude; v3.0-L notes DRAN produces a Scalar | Accepted input kinds, norm, unit/result-domain rules |
| DREM | Glossed as dot product | Compatible operand types, frame handling, units and result domain |
| DRIM | Glossed as cross product | Accepted vector kinds, dimensionality, orientation, frames, result type and units |

A mathematical signature such as `DREM(Vector, Vector) → Scalar` is a useful research hypothesis, but it must not be mistaken for a fully approved canonical signature. The v3.0-L type example specifically states `DRAN → Scalar`; it does not, in the inspected passage, complete all DRAN input and norm semantics.

## 7. Acceptance matrix for future research fixtures

| ID | Fixture condition | Safe research outcome | Canon status |
|---|---|---|---|
| SF-01 | Spatial vector has explicit X/Y/Z components, compatible units and declared frame identity | Eligible for proposed spatial type checking | Proposal |
| SF-02 | Spatial vector omits frame identity | Block frame-dependent validation | Process recommendation |
| SF-03 | Two operands use different frame identities, no transform declared | Block operation; do not guess | Process recommendation |
| SF-04 | Components omit or mix incompatible units | Block dimensional validation | Process recommendation |
| SF-05 | Mana-state vector supplied to a spatial operation | Block unless a specific cross-domain contract is sourced/approved | Process recommendation |
| SF-06 | Spatial value has only two of the three current signed-axis components | Reject as incomplete under the proposed 3D spatial record | Proposal |
| SF-07 | Vector literal written using an invented `VEC` token | Mark surface syntax unresolved; do not accept as canonical | Process recommendation |
| SF-08 | DREM parses with two arbitrary scalar operands | Syntax may be valid in prototype; vector semantic gate remains blocked | Existing layer separation |
| SF-09 | DRIM result is used to claim a physical force/effect | Require separate mechanism and physical-feasibility assessment | Canonical physical-model constraint |
| SF-10 | Same spelling appears in different source versions | Preserve version/provenance and do not globally normalise | Source-stratification rule |

These are proposed validation outcomes, not results from a test run.

## 8. Decisions now sufficiently clear to use

The following process rules can be applied without changing Arcane's canon:

1. Label vector records as abstract research metadata, not surface clauses.
2. For current spatial fixtures, include X/Y/Z components and a declared frame identity.
3. Keep vector kind and units explicit.
4. Never silently coerce a mana-state vector into a spatial vector.
5. Do not infer a cross-frame transform.
6. Keep syntax, semantic typing, and physical feasibility as separate gates.
7. Preserve source version and spelling when comparing `DRIM` and `DRUM`.

These make research fixtures more reliable immediately while leaving the language's unresolved grammar and semantic decisions open.

## 9. Decision ledger and next phase

- **Decision ID:** P8I-SPATIAL-FRAME-GROUNDING-01
- **Canon changes:** none.
- **New vocabulary:** none.
- **Implementation changes:** none.
- **Tests executed:** none.
- **Grounded contribution:** exact extraction of the canonical signed axes, frame role, typed-system rule, operator glosses, and physical-model separation.
- **Proposal contribution:** named-frame metadata and conservative acceptance rules for spatial research fixtures.
- **Next phase:** stop repeating general vector requirements and move to a worked, typed abstract example using only declared metadata. Demonstrate the validation path for one displacement vector, one velocity vector, DRAN and DREM, explicitly showing where current canon ends and proposal-level rules begin. Do not invent an Arcane surface vector constructor.
