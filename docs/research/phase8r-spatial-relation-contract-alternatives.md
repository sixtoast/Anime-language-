# Arcane Phase 8R — spatial relation contract alternatives and abstract reference patterns

**Status:** Owner-reviewable design proposal; no option promoted to canon  
**Date:** 2026-10-15  
**Canon effect:** none  
**New vocabulary:** none  
**Implementation changes:** none  
**Tests executed:** none

## 1. Purpose

Phase 8Q established contrastive semantics for JO, JUR, JA, JE and JI. This phase converts those contrasts into explicit design alternatives, so the project can make a focused decision rather than leave the relation contracts permanently vague.

The canonical source establishes the relation names and glosses, the coordinate-axis convention, FE as a frame role, and the geometry terms PI, LEN, PLA, SUR, VOM and PAR. It does not establish complete argument signatures or surface syntax for these relations. Therefore all signatures and abstract patterns below are proposals.

## 2. Contract layers that must not be conflated

A relation contract needs at least four separable decisions:

1. **Semantic relation:** what relationship is asserted?
2. **Argument kinds:** which types of entities or values may participate?
3. **Frame policy:** in which frame is the relation interpreted, and how is it identified?
4. **Surface realization:** how are the arguments and relation represented in Arcane syntax?

A gloss can help with the first layer without deciding the remaining three. The proposed contracts below deliberately specify the first layer conservatively and leave the other layers open.

## 3. JO — toward

### Source-grounded minimum
JO is the canonical formal spatial relation glossed “toward”.

### Candidate alternatives
- **JO-A: orientation relation.** A direction or orientation is toward a reference.
- **JO-B: directed-motion relation.** A mover's motion is directed toward a reference.
- **JO-C: general relational operator.** A broader relation whose argument types and event/state reading are selected by explicit typing.

### Recommendation
Use **JO-A as the minimum semantic interpretation** for research fixtures. It makes the fewest assumptions from the gloss. JO-B may be a typed subcase only if motion/event arguments are explicitly specified. Do not treat JO as “arrive at”, “enter”, “reach”, or “cause to move”.

### Abstract research pattern (not Arcane syntax)
`TowardRelation(direction_or_orientation, reference, frame)`

Fields are descriptive metadata, not canonical slots or argument order.

## 4. JUR — away

### Source-grounded minimum
JUR is the canonical formal spatial relation glossed “away”.

### Candidate alternatives
- **JUR-A: orientation away.** A direction/orientation is away relative to a reference.
- **JUR-B: directed motion away.** A mover's motion is directed away from a reference.
- **JUR-C: source relation.** The reference is the origin/source of movement.

### Recommendation
Use **JUR-A as the minimum**. JUR-B may be supported by an explicitly typed motion context. Do not choose JUR-C from the English gloss alone: “away from X” and “originating at X” are not equivalent.

### Abstract research pattern (not Arcane syntax)
`AwayRelation(direction_or_orientation, reference, frame)`

## 5. JA — along

### Source-grounded minimum
JA is the canonical formal spatial relation glossed “along”.

### Candidate alternatives
- **JA-A: path-following relation.** A trajectory/path is related to an extended reference such as a path, line or axis.
- **JA-B: motion event along a path.** A mover's trajectory follows a path over an interval.
- **JA-C: general coextension relation.** A broader relation between an entity/event and an extended reference.

### Recommendation
Use **JA-A as the research minimum**, but keep its argument kinds unresolved until a canonical signature is recovered or approved. JA-B needs an explicit motion event and must not imply complete traversal or endpoint arrival. The eventual contract must define whether “along” permits partial, reverse, or intermittent traversal.

### Abstract research pattern (not Arcane syntax)
`AlongRelation(trajectory_or_related_entity, path_or_extended_reference, frame)`

## 6. JE — parallel

### Source-grounded minimum
JE is the canonical formal relation glossed “parallel”.

### Candidate alternatives
- **JE-A: line/direction parallelism.** Apply to lines or direction vectors.
- **JE-B: broad geometric parallelism.** Apply to a declared set of geometric object kinds using a defined mathematical criterion.
- **JE-C: orientation similarity.** A looser relation that may tolerate angular deviation.

### Recommendation
Prefer **JE-B as a design target**, because it makes object-kind eligibility explicit, but define each accepted kind and exact criterion before use. Do not silently include tolerance, near-parallelism, contact, equal length or coincidence. JE-A is a narrower implementation subset if the formal geometry system first supports only lines/directions. JE-C should not be adopted without an explicit tolerance model.

### Abstract research pattern (not Arcane syntax)
`ParallelRelation(geometry_A, geometry_B, frame, criterion)`

The criterion is research metadata. No canonical tolerance or signature is asserted.

## 7. JI — aligned/coincident

### Source-grounded minimum
JI is listed with the combined gloss “aligned/coincident”. The source does not establish whether the two English terms are synonyms, context-dependent readings, or separate senses.

### Candidate alternatives
- **JI-A: alignment only.** Two directions or geometric objects share an orientation relation under a specified criterion.
- **JI-B: coincidence only.** Two entities occupy the same geometric locus/position under a specified criterion.
- **JI-C: documented polysemy.** JI has two explicitly typed senses, alignment and coincidence.
- **JI-D: alignment plus coincidence.** A stronger relation requiring both properties.

### Recommendation
Do **not** select among these alternatives without owner approval or stronger canonical source evidence. Preserve the historical combined gloss. For any provisional checker, report ambiguity rather than selecting a reading from context silently.

### Abstract research pattern (not Arcane syntax)
`AlignmentOrCoincidenceRelation(object_A, object_B, frame, intended_sense)`

The `intended_sense` field is a research disambiguator, not a canonical argument.

## 8. Frame policy alternatives

The canonical source names FE as a frame role and specifies +X = right, +Y = above, +Z = forward. It does not fully establish how every relation obtains or inherits a frame.

| Option | Policy | Benefit | Risk |
|---|---|---|---|
| FRAME-A | Explicit frame for every frame-dependent relation | Most transparent and auditable | More metadata and potentially more syntax |
| FRAME-B | Explicit frame or a uniquely scoped enclosing frame | Supports composition while retaining traceability | Requires precise scope/inheritance rules |
| FRAME-C | Implicit global frame by default | Concise | Can misinterpret local frames or changing observers |

**Recommendation:** use FRAME-A for research records and tests. Consider FRAME-B later if scope rules are defined. Do not assume FRAME-C is canonical merely because a default axis convention exists; a convention does not settle local-frame semantics.

## 9. Cross-relation abstract reference bank

These records are semantic test objects, not executable clauses:

```text
SPREF-01:
  relation: JO
  intended_reading: orientation toward reference R
  must_not_imply: arrival, entry, successful motion
  frame: explicit research frame

SPREF-02:
  relation: JUR
  intended_reading: orientation away from reference R
  must_not_imply: origin/source at R
  frame: explicit research frame

SPREF-03:
  relation: JA
  intended_reading: trajectory related to path P
  must_not_imply: full traversal, endpoint arrival
  frame: explicit research frame

SPREF-04:
  relation: JE
  intended_reading: geometric parallelism under declared criterion
  must_not_imply: contact, coincidence, equal length
  frame: explicit research frame

SPREF-05:
  relation: JI
  intended_reading: unresolved between alignment and coincidence
  must_not_imply: either reading selected without disambiguation
  frame: explicit research frame
```

These patterns can later be used to review formal semantic contracts, but they intentionally do not assert surface argument order or syntax.

## 10. Owner decision docket

| ID | Decision | Recommendation | Approval required |
|---|---|---|---|
| SP-8R-01 | Minimum semantics of JO | Orientation toward a reference | Yes, if made normative |
| SP-8R-02 | Minimum semantics of JUR | Orientation away from a reference | Yes, if made normative |
| SP-8R-03 | JA argument kinds and partial/full traversal | Keep path/reference typed; do not entail arrival | Yes |
| SP-8R-04 | JE admitted geometric types and criterion | Explicit list and exact criterion; no implicit tolerance | Yes |
| SP-8R-05 | JI alignment/coincidence senses | Preserve ambiguity until resolved | Yes |
| SP-8R-06 | FE attachment/inheritance | Explicit frame in research fixtures | Yes |
| SP-8R-07 | Surface syntax and argument order | Do not invent | Yes |
| SP-8R-08 | Relationship to PO/FO/LO | Keep distinct until v2.0 definitions recovered | Yes |

## 11. Practical effect and next step

This phase makes the outstanding decisions small, explicit and reviewable. It does not require another generic inventory before useful work can continue.

The next step should be a source recovery attempt for the original v2.0 PO/FO/LO definitions. If the original examples cannot be extracted through the available repository tools, record that limitation and continue with an explicitly provisional formal spatial reference grammar only after the owner has selected the desired semantics. Do not pretend missing source evidence was recovered.

- **Decision ID:** P8R-SPATIAL-RELATION-CONTRACT-ALTERNATIVES-01
- **Canon changes:** none.
- **New vocabulary:** none.
- **Implementation changes:** none.
- **Tests executed:** none.
