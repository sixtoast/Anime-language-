# Arcane Phase 8G — vector-value representation decision proposal

**Status:** Design proposal; not canon  
**Date:** 2026-10-15  
**Canon effect:** none  
**New vocabulary:** none  
**Tests executed:** none

## 1. Executive finding

The inspected canon establishes a typed formal system, gives the spatial axes PA/BA (−X/+X), TA/DA (−Y/+Y), KA/GA (−Z/+Z), establishes FE as a frame reference, and lists DRAN (magnitude), DREM (dot product), and DRIM (cross product). It does **not**, in the inspected passages, establish a complete general vector-literal syntax, component ordering rule, vector type constructor, or complete type/unit rules for these operators.

The magic-system specification says mana can have internal vector degrees of freedom such as orientation/polarisation, while warning that this does not make mana an ordinary electromagnetic vector field. Therefore, a spatial displacement vector, a velocity vector, a force vector, and a mana-state vector must not be treated as one interchangeable type merely because each can be written with components.

This proposal recommends a typed, frame-aware vector data model for research and a separate abstract fixture notation. It does not introduce a spoken Arcane constructor or change canon.

## 2. Evidence boundary

### Established by inspected canonical sources

- Arcane is a typed formal system; incompatible types must not be accepted without a defined operation or conversion.
- Core operators have fixed argument counts and grouping must not rely on precedence.
- DRAN is magnitude, DREM dot product, DRIM cross product.
- Spatial axes are named in three signed directions, with +X right, +Y above, +Z forward.
- FE denotes a frame role.
- The magic-system model distinguishes information, mana, energy, force, coupling and physical effect.
- Mana may use vector notation for internal degrees of freedom; a scalar approximation is permitted where direction is irrelevant.

### Not established by inspected sources

- A canonical vector-literal spelling or surface constructor.
- Whether component order alone determines a vector or axis labels are mandatory.
- The complete coordinate-frame binding syntax.
- Whether all vectors are three-dimensional.
- The exact accepted types and output units of DRAN/DREM/DRIM.
- Whether dot/cross products are defined across different frames or different vector kinds.
- A conversion rule between mana-state vectors and ordinary spatial vectors.

No unresolved item below should be filled by treating familiar mathematics as automatically canonical Arcane grammar.

## 3. Requirements for any vector representation

A representation should carry enough information to answer:

1. **Kind:** what does the vector represent (for example, displacement, velocity, force, or a mana-state quantity)?
2. **Dimension:** how many components exist?
3. **Frame:** relative to which coordinate frame are components interpreted?
4. **Components:** what are their values and units?
5. **Type relation:** which operations accept this vector kind?
6. **Result:** what kind and units result from an operation?
7. **Failure:** what happens when dimensions, frames, types or units are incompatible?
8. **Provenance:** which source/version defines the representation, and is it canon, proposal or audit-only notation?

A three-number tuple without kind, frame and unit information is insufficient for reliable physical construction.

## 4. Competing representation options

### Option A — Positional component tuple

**Abstract example only:** `VEC⟨1 m, 2 m, 3 m⟩`

Components appear in a fixed X/Y/Z order, with the frame supplied by context or an explicit outer annotation.

**Advantages**
- Compact and familiar.
- Straightforward for numerical fixtures.
- Efficient for repeated vector arithmetic.

**Risks**
- Missing frame information can make the same tuple mean different physical directions.
- Omitted or reordered components are easy to miss.
- It encourages accidental mixing of spatial vectors and internal mana vectors.
- No canonical Arcane surface constructor for this form has been recovered.

**Status:** not recommended as a user-facing canonical form without explicit frame and type rules.

### Option B — Axis-labelled component record

**Abstract example only:** `VEC⟨X:1 m, Y:2 m, Z:3 m; FRAME:FE⟩`

Components are labelled by axis and the frame is explicit. The labels here are explanatory meta-notation, not proposed Arcane tokens.

**Advantages**
- Makes component order visible.
- Makes missing axes and frame omissions easier to diagnose.
- Better suited to test fixtures and validation reports.

**Risks**
- More verbose.
- Axis labels still do not specify the vector's semantic kind.
- The exact syntax is not canonically attested.

**Status:** strongest candidate for human-readable research fixtures, not approved surface syntax.

### Option C — Typed, frame-aware value record

**Abstract data model, not a surface expression:**

`VectorValue(kind, dimension, frame, components, component_unit, source_status)`

A spatial velocity and a mana-state orientation can both be represented structurally, but their `kind` fields differ and operations only accept explicitly compatible kinds.

**Advantages**
- Separates representation from spoken/surface grammar.
- Makes frame, dimension and units machine-checkable.
- Prevents treating every vector-like object as a spatial displacement.
- Supports future surface spellings without rewriting semantic rules.

**Risks**
- Requires an agreed type vocabulary and operation contracts.
- Does not by itself tell a speaker how to encode the value.
- Can become over-engineered if the first version supports every imaginable field.

**Status:** recommended internal semantic contract for research fixtures. It does not add a word or grammar rule to Arcane.

## 5. Recommendation

Adopt Option C as the **proposed semantic data model** for research and Option B as an explanatory notation in design documents. Keep all such notation explicitly labelled **ABSTRACT / NOT CANONICAL SURFACE SYNTAX**.

This recommendation separates two questions:
- what a vector value means and what types it carries;
- how Arcane speakers express that value.

Do not settle the second question merely to make the first easier to prototype.

## 6. Proposed initial type distinctions

The following are semantic categories for discussion, not new Arcane lexical items:

| Type label (meta-language) | Meaning | Example information required |
|---|---|---|
| SpatialPosition | A point/location relative to a frame | frame and coordinate convention |
| DisplacementVector | Difference between positions | frame, length unit |
| VelocityVector | Rate of displacement | frame, length/time unit, reference interval if needed |
| ForceVector | Force-like physical quantity | frame, force unit and applicable mechanism |
| ManaStateVector | Internal mana-field degrees of freedom | field model, component interpretation and units or declared non-dimensional parameters |
| GenericVector | Unclassified vector-like value | insufficient for physical construction; should be rejected by a typed physical operation |

These types must not be silently converted into one another. In particular, a ManaStateVector is not automatically a DisplacementVector or ForceVector.

## 7. Operator contracts: minimum safe proposal

These are proposed type-contract shapes, not approved executable signatures.

### DRAN — magnitude

Candidate contract: a supported vector-like value maps to a scalar magnitude whose unit/domain follows the vector kind.

Open decisions:
- Which vector kinds are accepted?
- Is magnitude invariant across all permitted frame transformations?
- For ManaStateVector, what does “magnitude” physically mean?
- Are complex or phase-bearing components permitted, and if so what norm applies?

### DREM — dot product

Candidate contract: two vectors must inhabit a compatible vector space, with compatible dimensions and frame semantics. Result type and units are derived from the operands and the defined product.

Open decisions:
- Are operands required to share a frame, or is a defined transformation allowed?
- Which vector kinds may be paired?
- Does the result always have scalar type, or can a field-specific product return another type?
- What units and sign conventions apply?

### DRIM / DRUM — cross product

Candidate contract: do not assume a valid 3D spatial cross product for every vector-like type. The familiar 3D operation is a candidate for spatial vectors only when the approved dimensionality, orientation and frame rules apply.

Open decisions:
- Is the operation restricted to three-dimensional spatial vectors?
- Is handedness/orientation fixed by the canonical axes?
- How are frame transformations handled?
- What output type and units result?
- Is any operation defined for internal mana-state vectors? No such extension is assumed here.

## 8. Fixture suite for the proposed data model

All examples below are abstract typed fixtures. They do not use an Arcane vector constructor and are not valid surface incantations.

| ID | Fixture | Expected status | Purpose |
|---|---|---|---|
| VEC-01 | 3-component DisplacementVector, frame F, length unit | Candidate well-formed record | Baseline record completeness |
| VEC-02 | Same components but no frame | Reject for frame-dependent spatial operation | Detect missing frame |
| VEC-03 | VelocityVector supplied to a function requiring DisplacementVector | Reject unless an explicit conversion/integration contract exists | Prevent type coercion |
| VEC-04 | Two vectors with different dimensions | Reject DREM/DRIM pending an explicit compatible operation | Detect dimension mismatch |
| VEC-05 | Two spatial vectors in incompatible frames | Reject or require an explicitly defined frame transformation | Prevent hidden frame assumption |
| VEC-06 | ManaStateVector passed to spatial DRIM | Reject unless a separate field-specific contract is approved | Prevent ontology collapse |
| VEC-07 | Vector components have incompatible units | Reject malformed value | Unit integrity |
| VEC-08 | DRAN on an unclassified GenericVector | Block physical/semantic validation | Prevent underspecified input |
| VEC-09 | Valid typed operands but no established surface literal syntax | Semantic fixture may be reviewed; surface fixture remains blocked | Keep data model separate from grammar |
| VEC-10 | Any typed operation proposed as a physical effect without a mechanism/resource model | Physical feasibility not established | Keep maths separate from causation |

## 9. Relationship to surface syntax and incantation readiness

The surface parser inspected in Phase 8F parses numeric quantities and supported recursive operator forms; it does not establish a general vector-literal grammar or type-check vector operands. Therefore:

- A successful DREM parse does not prove the arguments are vectors.
- A successful DRIM/DRUM parse does not prove the operands are three-dimensional or frame-compatible.
- A typed vector record does not by itself establish how to say that record in Arcane.
- A valid mathematical operation does not itself specify mana coupling, energy, mechanism, control or physical effect.

A later language-design phase may compare candidate surface encodings, but must do so as an explicit proposal and run ambiguity tests before any canon change.

## 10. Decision ledger

- **Decision ID:** P8G-VECTOR-REPRESENTATION-01
- **Recommendation:** use a typed, frame-aware semantic record for research; use axis-labelled abstract notation in human-readable fixtures.
- **Canonical surface syntax selected:** no.
- **Operator signatures promoted:** no.
- **New vocabulary:** none.
- **Canon changes:** none.
- **Tests executed:** none.
- **Next phase:** build a typed vector contract matrix for DRAN/DREM/DRIM, including valid, invalid and unresolved combinations; then decide which minimum rules can be grounded directly in canon and which require explicit approval.
