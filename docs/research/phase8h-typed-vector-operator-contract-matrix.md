# Arcane Phase 8H — typed vector operator contract matrix

**Status:** Proposed contract matrix; not canon  
**Date:** 2026-10-15  
**Canon effect:** none  
**New vocabulary:** none  
**Tests executed:** none

## 1. Purpose

Phase 8G recommended a typed, frame-aware semantic value model without choosing a canonical surface vector constructor. This matrix applies that model to DRAN, DREM and DRIM/DRUM so that the remaining decisions become explicit and testable.

It distinguishes:
- a source-established operator gloss;
- a candidate mathematical contract;
- the types the proposal would accept;
- required compatibility checks;
- unresolved language or physical-system decisions.

Nothing in this matrix promotes a proposed type contract to canon.

## 2. Shared type metadata

Every candidate vector value used in a semantic fixture should carry these fields:

| Field | Required meaning | Missing-field behaviour in research validation |
|---|---|---|
| kind | SpatialPosition, DisplacementVector, VelocityVector, ForceVector, ManaStateVector, or another explicitly defined kind | Block typed validation |
| dimension | Number and interpretation of components | Block vector operation |
| frame | Coordinate frame or explicit declaration that frame is not applicable | Block frame-dependent spatial operation |
| components | Values and component ordering/axis labels | Reject malformed record |
| component unit | Unit or explicit dimensionless declaration | Block unit-sensitive operation |
| source status | Canonical fact, proposal, or unresolved | Never silently promote proposal |
| representation version | Schema revision used to interpret the record | Block cross-version comparison unless mapping exists |

These are research metadata labels, not Arcane words.

## 3. DRAN — magnitude

**Source-established gloss:** magnitude.  
**Candidate contract:** `DRAN(v) -> magnitude(v)` for an approved input type.

| Input | Candidate result | Status |
|---|---|---|
| DisplacementVector with complete frame/components/units | Scalar length magnitude | Plausible mathematical contract; formal Arcane contract unapproved |
| VelocityVector | Scalar speed magnitude with length/time dimension | Plausible mathematical contract; formal Arcane contract unapproved |
| ForceVector | Scalar force magnitude | Plausible mathematical contract; formal Arcane contract unapproved |
| ManaStateVector | Field-specific norm only if defined by the mana model | Blocked; no universal norm assumed |
| GenericVector with unknown kind | None | Reject typed validation |
| Malformed vector (missing component or unit metadata) | None | Reject typed validation |

Questions to settle: which kinds are accepted; how component units are reconciled; whether the magnitude is invariant under allowed frame changes; and what the operation means for field-internal vectors.

## 4. DREM — dot product

**Source-established gloss:** dot product.  
**Candidate contract:** `DREM(a,b) -> scalar` for compatible vector operands.

| Pair | Candidate result | Status |
|---|---|---|
| Two DisplacementVectors in same compatible frame and dimension | Scalar with product of component dimensions/units | Candidate; not approved canon |
| Two VelocityVectors in same compatible frame and dimension | Scalar with squared velocity dimension | Candidate; not approved canon |
| DisplacementVector and VelocityVector | Mathematically definable in some contexts, but semantic intent is not established | Block until cross-kind rules are approved |
| Spatial vector and ManaStateVector | No result under the minimal proposal | Reject; no shared vector space established |
| Vectors in different frames | No implicit result | Reject unless an explicit frame transform is defined |
| Different component dimensions or incompatible units | No result | Reject |
| Missing type/frame/component metadata | No result | Reject typed validation |

A dot product's numerical definability is not enough to establish that it is meaningful in a given Arcane construction. The accepted vector space and type relations must be specified.

## 5. DRIM / DRUM — cross product

**Source-established gloss:** cross product, with DRIM in v3.0-L and DRUM recorded as a renamed form in the v5 draft lexicon. Source version must be explicit.

**Candidate contract:** a restricted three-dimensional spatial cross product, not a universal operation on every vector-like object.

| Pair | Candidate result | Status |
|---|---|---|
| Two 3D DisplacementVectors in a compatible frame | 3D vector with product-of-length units | Candidate only |
| Two 3D VelocityVectors | 3D vector with squared velocity units | Candidate only; intended semantics may be context-dependent |
| DisplacementVector × VelocityVector | Mathematically definable but output interpretation depends on order and domain | Block until type/output semantics approved |
| 2D vectors | No result under this restricted proposal | Reject unless an explicit 2D convention is approved |
| 4D or internal ManaStateVectors | No result under this restricted proposal | Reject; no operation defined |
| Different frames or incompatible orientation conventions | No implicit result | Reject unless an explicit transform/orientation contract is approved |
| Missing components, unit metadata or vector kind | No result | Reject typed validation |

The restricted 3D contract is a conservative proposal, not a claim that the canonical Arcane operator is already limited to 3D.

## 6. Cross-operator decision matrix

| Decision | DRAN | DREM | DRIM/DRUM |
|---|---|---|---|
| Input arity | One | Two | Two |
| Gloss in v3.0-L | Yes | Yes | DRIM yes |
| Complete canonical type signature established by inspected source | No | No | No |
| Candidate minimum type metadata | Kind, dimension, components, units | Both operands' kind, dimension, frame, components, units | Both operands' kind, dimension, frame, components, units, orientation convention |
| Frame compatibility required | Depends on accepted kind; must be defined | Yes for spatial operations unless transformed explicitly | Yes for spatial operations unless transformed explicitly |
| Mixed spatial/mana vectors accepted | No by default | No by default | No by default |
| Unit/domain checks needed | Yes | Yes | Yes |
| Surface vector-literal syntax established | No | No | No |
| Parse success proves semantic validity | No | No | No |
| Semantic validity proves physical feasibility | No | No | No |

## 7. Proposed validation outcomes

Use these result labels in future fixture work:

- `ACCEPTED_BY_PROPOSED_TYPE_RULE`: record satisfies the proposal; not canon.
- `REJECTED_BY_PROPOSED_TYPE_RULE`: record violates a stated proposal; not a canon rejection.
- `BLOCKED_BY_MISSING_CONTRACT`: sources do not settle the relevant relation.
- `SURFACE_SYNTAX_UNRESOLVED`: semantic record is representable in fixture metadata but no approved Arcane surface form exists.
- `PHYSICAL_FEASIBILITY_NOT_ASSESSED`: no claim about a cast or effect.
- `CANONICALLY_ESTABLISHED`: use only when an exact canonical source establishes the specific rule.

Do not collapse these statuses into a single pass/fail field.

## 8. Minimum decision set before vector incantation drafting

Before writing candidate vector incantations intended to be more than abstract examples, explicitly decide or recover:

1. Accepted vector kinds for each operator.
2. Whether spatial vectors are always 3D for the relevant register.
3. Frame compatibility and allowed transformations.
4. Component and result unit rules.
5. DRIM/DRUM orientation convention and version spelling.
6. A canonical or explicitly provisional vector value syntax.
7. Error and diagnostic behaviour for invalid values.
8. Separation between mathematical validity and casting feasibility.

Until these gates are resolved, continue with typed abstract fixtures and do not invent a vector constructor token.

## 9. Decision ledger

- **Decision ID:** P8H-TYPED-VECTOR-OPERATOR-MATRIX-01
- **Recommendation:** use this matrix as the semantic validation checklist for future vector work.
- **Canon changes:** none.
- **New vocabulary:** none.
- **Implementation changes:** none.
- **Tests executed:** none.
- **Next phase:** examine the original spatial-frame and physical-quantity sections for any explicit conversion, dimensionality or frame rules not yet incorporated; if no further rule is found, produce a concise unresolved-decision proposal rather than repeatedly restating this matrix.
