# Arcane Phase 8S — spatial role and relation composition matrix

**Status:** Evidence-led composition study; candidate rules are proposals only  
**Date:** 2026-10-15  
**Canon effect:** none  
**New vocabulary:** none  
**Implementation changes:** none  
**Tests executed:** none

## 1. Purpose and source recovery result

This phase addresses the next concrete question after Phases 8Q–8R: how should the recorded role forms PO, FO and LO relate to the spatial relation forms JO, JUR, JA, JE and JI?

The v5 draft lexicon records:
- PO — position role — Formal, CANON, v2.0;
- FO — direction role — Formal, CANON, v2.0;
- LO — movement role — Formal, CANON, v2.0.

The canonical v3.0-L specification records FE as Frame, alongside NI Field, RI Target and SU Current. It also lists the spatial axes and five relations.

The repository files inspected in this phase do **not** provide complete PO/FO/LO signatures, formal examples containing them, or a documented composition rule linking role forms to spatial relations. GitHub content search for the original audit names also returned no matching excerpts. This is a limitation of the available retrieval path, not evidence that the original source documents contain no such information. The original Phase 4/5 DOCX materials have previously failed UTF-8 text retrieval; they must not be reconstructed from memory or glosses.

## 2. Core distinction: role versus relation

For research purposes, keep three concepts separate:

1. **Role:** the semantic job an entity/value plays in a larger representation.
2. **Relation:** the spatial relationship asserted between spatial values/entities.
3. **Value:** the point, direction, path, line, surface, volume or other typed object being related.

This distinction is a proposed explanatory model, not a recovered definition of the historical operators.

An intuitive contrast:
- “position role” suggests that a value contributes as a position;
- “direction role” suggests that a value contributes as a direction;
- “movement role” suggests that a value contributes to a movement representation;
- “toward” describes a relation, not by itself a grammatical role.

The glosses do not establish whether PO/FO/LO are operators, labels, constructors, case-like markers, argument introducers, or higher-level slots. Do not commit to any one implementation from their names alone.

## 3. Evidence and confidence matrix

| Item | Directly recorded fact | Not established by inspected sources | Confidence |
|---|---|---|---|
| PO | Glossed “position role”; formal/canon; v2.0 | Signature, input/output types, argument order, syntax, scope | High for inventory entry; low for contract |
| FO | Glossed “direction role”; formal/canon; v2.0 | Signature, whether it takes direction values or relates two values, syntax | High for inventory entry; low for contract |
| LO | Glossed “movement role”; formal/canon; v2.0 | Whether it represents an event, trajectory, displacement, or role slot | High for inventory entry; low for contract |
| JO | Glossed “toward”; formal/canon; v3.0-L | Full signature, relation argument kinds, syntax | High for gloss; low for contract |
| JUR | Glossed “away”; formal/canon; v3.0-L | Full signature, source-role relationship, syntax | High for gloss; low for contract |
| JA | Glossed “along”; formal/canon; v3.0-L | Accepted path/reference types, traversal/event implications | High for gloss; low for contract |
| JE | Glossed “parallel”; formal/canon; v3.0-L | Admissible geometric types and exact criterion | High for gloss; low for contract |
| JI | Glossed “aligned/coincident”; formal/canon; v3.0-L | Whether one or two senses, exact geometry and signature | High for combined gloss; low for contract |
| FE | Glossed “Frame” in v3.0-L role table | Binding/inheritance rules for every spatial expression | High for label; incomplete semantics |

## 4. Candidate composition models

The following are alternatives to evaluate, not descriptions of existing canon.

### Model A — role slot plus relation

A role identifies how a value participates; a separate relation specifies the spatial relationship.

Illustrative metalanguage:
`SpatialDescription(position_role = P, relation = JO, reference = R, frame = F)`

Advantages:
- separates the position/direction/movement role from the relation;
- makes distinctions such as location versus orientation easier to represent;
- keeps frame provenance visible.

Risks:
- could be unnecessarily redundant if historical PO/FO/LO already include relation semantics;
- requires a defined representation for composing role and relation.

### Model B — role operators introduce typed arguments

PO/FO/LO could introduce or constrain values of different spatial kinds, and JO/JUR/JA/JE/JI could then relate compatible values.

Illustrative metalanguage:
`FO(direction_value) + JO(direction_value, reference, frame)`

Advantages:
- makes type expectations explicit;
- potentially allows a relation to be checked independently of its syntactic realization.

Risks:
- assumes PO/FO/LO have type-introducing behavior not yet evidenced;
- the example's apparent argument structure is only a placeholder, not Arcane syntax.

### Model C — roles and relations are independent alternatives

PO/FO/LO and JO/JUR/JA/JE/JI may belong to different representation layers or may not compose directly.

Advantages:
- avoids inventing a composition rule;
- accommodates historical systems in which role labels and relation operators serve separate purposes.

Risks:
- does not yet provide a unified spatial grammar;
- requires historical examples to establish intended use.

### Recommendation

Keep all three models open. Use **Model A only as a neutral semantic bookkeeping representation** for research fixtures, not as an asserted Arcane syntax or canon architecture. Model B needs source evidence or explicit owner approval. Model C remains possible until historical contracts are recovered.

## 5. Semantic obligations any composition rule must satisfy

A future contract should distinguish at least these cases:

| ID | Case A | Case B | Failure to avoid |
|---|---|---|---|
| ROLE-SPACE-01 | Entity is located at P | Entity is directed toward P | Position confused with orientation |
| ROLE-SPACE-02 | Direction is away from P | Movement originated at P | Direction confused with source |
| ROLE-SPACE-03 | Trajectory follows path P | Position is on path P | Motion/path relation confused with static location |
| ROLE-SPACE-04 | Object A is parallel to B | Object A coincides with B | Parallelism confused with coincidence |
| ROLE-SPACE-05 | Direction vectors align | Geometric objects coincide | Alignment confused with shared position |
| ROLE-SPACE-06 | Movement role describes an event | Direction role describes orientation | Event and orientation types collapsed |
| ROLE-SPACE-07 | Spatial values share frame F | Values have different or unknown frames | Raw coordinates compared without frame policy |
| ROLE-SPACE-08 | Spatial value is typed as a path | Spatial value is typed as a point | Geometry-kind compatibility guessed |
| ROLE-SPACE-09 | Relation is present but mechanism absent | Physical mechanism is separately established | Relation treated as causal proof |
| ROLE-SPACE-10 | Role is explicit | Role is omitted and ambiguous | Checker silently assigns a role |

These tests are designed to catch semantic category errors even before surface syntax is decided.

## 6. Neutral research representation

Until a formal syntax and signature are established, a spatial research record can use the following fields as *metadata*:

```text
spatial_record:
  role_label: PO | FO | LO | unresolved
  relation_label: JO | JUR | JA | JE | JI | none | unresolved
  subject_value_kind: point | line | plane | surface | volume | path | direction | event | unresolved
  reference_value_kind: point | line | plane | surface | volume | path | direction | event | unresolved
  frame: explicit-id | unresolved
  intended_reading: controlled natural-language description
  excluded_readings: list
  source: document-and-version
  status: canon-fact | proposal | unresolved
```

This is a proposed research schema only. It is not executable Arcane, not a grammar, and not a claim that every field is an argument to a canonical operator. The labels “direction” and “event” here are descriptive research kinds, not confirmed constructors in the formal type system.

## 7. Frame, reference, and coordinate safeguards

Any future spatial checker or evaluator should not:
- assume that FE is always a final argument or that it has one fixed surface position;
- compare coordinates from different frames without a transform or explicit compatibility rule;
- treat a direction as a point or a path as a line without a defined conversion;
- infer a motion event from a direction relation;
- infer source, goal, arrival, or entry from an English preposition;
- treat geometric relations as forces or causes;
- promote a provisional research record to canonical syntax.

These safeguards follow from the documented incompleteness of the signatures and the magic-system distinction between spatial representation and physical mechanism.

## 8. Decision docket

| ID | Decision | Current disposition |
|---|---|---|
| P8S-01 | Exact historical meaning of PO | Recover source examples/definition |
| P8S-02 | Exact historical meaning of FO | Recover source examples/definition |
| P8S-03 | Exact historical meaning of LO | Recover source examples/definition |
| P8S-04 | Whether roles and relations compose | Unresolved; compare Models A–C |
| P8S-05 | Accepted value kinds for each role | Unresolved |
| P8S-06 | Accepted value kinds for each relation | Unresolved |
| P8S-07 | FE argument, scope, and inheritance policy | Unresolved |
| P8S-08 | Surface syntax and argument order | Do not invent |
| P8S-09 | How role/relation ambiguity is reported | Proposal: explicit unresolved diagnostic in tooling |
| P8S-10 | Relationship to vernacular spatial phrases | Keep register boundary; no automatic mapping |

## 9. Practical outcome and next step

Phase 8S gives the language project a usable conceptual separation and a focused test suite without pretending that a complete spatial grammar has been recovered. It also records the source-retrieval limitation accurately.

The next phase should move from analysis to a small set of **typed, abstract spatial reference examples** that demonstrate the distinctions in Sections 2 and 5. Those examples should remain metalanguage fixtures until the owner approves relation signatures or historical evidence is recovered. In parallel, the original v2.0 definitions should be re-examined through a retrieval route capable of extracting DOCX content, rather than approximated from lexicon glosses.

- **Decision ID:** P8S-ROLE-RELATION-COMPOSITION-01
- **Canon changed:** no.
- **New vocabulary:** none.
- **Implementation changes:** none.
- **Tests executed:** none.
- **Deliverable:** evidence matrix, three composition alternatives, ten semantic obligations, and neutral research record schema.
