# Arcane Phase 8Q — spatial relation semantics and contrastive construction bank

**Status:** Canon-grounded semantic bank; syntax proposals deliberately withheld  
**Date:** 2026-10-15  
**Canon effect:** none  
**New vocabulary:** none  
**Implementation changes:** none  
**Tests executed:** none

## 1. Purpose

This phase returns from information provenance to Arcane's spatial language. The canonical v3.0-L specification explicitly lists three-dimensional axes and five formal spatial relations. The task here is to make their meanings more usable by defining contrastive interpretation requirements, without inventing argument signatures or surface syntax.

The main result is a distinction between:
- the canonical relation inventory;
- the geometric frame and axis convention;
- the entities/paths/regions a relation may connect;
- a complete expression that would encode the relation.

Only the first two are directly established by the inspected canonical source. The latter two still need specification.

## 2. Canonical spatial inventory

### 2.1 Axes

| Direction | Canonical form | Source-supported interpretation |
|---|---|---|
| −X | PA | Negative X direction |
| +X | BA | Positive X direction |
| −Y | TA | Negative Y direction |
| +Y | DA | Positive Y direction |
| −Z | KA | Negative Z direction |
| +Z | GA | Positive Z direction |

The v3.0-L convention defines +X as right, +Y as above, and +Z as forward. These are frame conventions, not universal statements about every possible observer's orientation. A usable spatial value still needs a known frame when its interpretation depends on orientation.

### 2.2 Formal relations

| Form | Canonical gloss | Safe semantic minimum |
|---|---|---|
| JO | Toward | Orientation/relational direction towards a reference |
| JUR | Away | Orientation/relational direction away from a reference |
| JA | Along | Relation to a line, path, axis or other extended reference remains to be typed |
| JE | Parallel | Parallel relation; exact accepted geometric kinds and dimensions unresolved |
| JI | Aligned/coincident | Alignment or coincidence relation; exact distinction between alignment and coincidence needs clarification |

The canonical source explicitly says these are relations, not independent magical forces. None of these glosses by itself supplies a physical cause, a motion event, a completed arrival, a source role, or a syntactic slot.

The word “away” is retained as the source gloss. Do not silently replace it with a more precise “away from” construction until the reference argument is specified.

## 3. Five relations are not five motion verbs

The relation names must not be used as if their English glosses fully specify a predicate's event structure.

- **JO / toward:** direction relative to a reference does not entail that anything moves.
- **JUR / away:** direction away from a reference does not entail that an entity originated at that reference.
- **JA / along:** a path relation does not entail that the path was traversed completely, or that the mover reached its endpoint.
- **JE / parallel:** a geometric relationship does not entail contact, coincidence, equal length or shared location.
- **JI / aligned/coincident:** the source gloss joins two concepts. Whether it denotes one relation with context-dependent readings or two formally distinct relations remains unresolved.

These are semantic constraints grounded in the glosses and the prior motion audit. They are not newly approved operator signatures.

## 4. Contrastive semantic fixture bank

The following are interpretation tests, not Arcane surface sentences. They intentionally use English semantic descriptions so they cannot be mistaken for invented canonical clauses.

| ID | Positive interpretation | Contrast that must remain distinct | Required result |
|---|---|---|---|
| SP-01 | Direction is toward reference R | Entity is already at R | JO does not entail location at R |
| SP-02 | Direction is away from R | Motion originated at R | JUR does not entail source |
| SP-03 | A trajectory follows path P | A reaches endpoint E | JA does not entail arrival |
| SP-04 | Line A is parallel to line B | A and B are coincident | JE does not entail coincidence |
| SP-05 | Two directions/axes are aligned | Two geometric objects occupy the same position | Alignment does not automatically entail coincidence |
| SP-06 | A point lies at a location | A point moves towards that location | Static position and directional relation differ |
| SP-07 | An entity moves from A to B | An entity moves toward B but stops short | Goal-directed motion and orientation differ |
| SP-08 | An entity enters region R | An entity moves along R's boundary | Interior entry and boundary path differ |
| SP-09 | A path has a chosen reference frame | The same coordinates are interpreted in a different frame | Frame provenance must be preserved |
| SP-10 | A vector has known components in the declared frame | Components are known but frame is missing | A frame-dependent interpretation is blocked |
| SP-11 | A line is parallel to another line | Two lines have the same direction but distinct origins | Parallelism does not entail common origin |
| SP-12 | A spatial relation is explicitly represented | Only the English intention is known | Do not claim an executable Arcane form without syntax/arity evidence |

## 5. Reference-frame obligations

The canonical specification identifies FE as the frame role and defines the axis convention. This does not yet settle all frame semantics.

A spatial expression or typed spatial value may need to establish:
1. which frame is being used;
2. whether coordinates are local or world-relative;
3. which entity or origin anchors the frame;
4. whether the frame is static or changes over time;
5. whether a direction, point, line, path or region is the relation's argument;
6. how unknown or incompatible frames are handled.

These are research questions and proposed metadata obligations, not established argument slots for JO/JUR/JA/JE/JI. The language must not compare raw components from different frames as if they were automatically commensurate.

## 6. Geometry typing: candidate minimum

The canonical source lists PI (point), LEN (line), PLA (plane), SUR (surface), VOM (volume), and PAR (path). The inventory gives useful type candidates, but it does not fully specify the signatures of the five spatial relations.

A cautious candidate compatibility table is therefore deliberately partial:

| Relation | Candidate relevant kinds | Status |
|---|---|---|
| JO / JUR | Direction/orientation and a declared reference | Argument kinds and order unresolved |
| JA | Path/line/axis and a related direction or trajectory | Exact signature unresolved |
| JE | Geometric objects with a defined notion of parallelism | Supported object types unresolved |
| JI | Directions or geometric objects for alignment/coincidence | Alignment/coincidence semantics unresolved |

Do not implement these candidate kinds as canonical type signatures yet. For example, “parallel” may apply to lines, directions, planes or other entities under different mathematical definitions; the specification must choose which are admitted.

## 7. Relation versus mechanism

Spatial relation semantics are not physical causation. Describing a target as directed toward another target does not by itself provide:
- a force or energy source;
- a trajectory that is dynamically feasible;
- a coupling mechanism;
- a speed, duration or endpoint condition;
- collision avoidance or boundary conditions;
- evidence that motion actually occurred.

The existing magic-system model separates representation, mana, energy, force, coupling and physical effect. Spatial relation operators must preserve that separation. A well-formed spatial relation is not proof that an effect can be cast or will occur.

## 8. Relationship to vernacular grammar

The vernacular entries `desh` (“in/at”), `ding` (“with”), and other Phase 5 proposals remain proposed. There is no established one-to-one mapping from `desh` to JO, JUR, JA, JE or JI. Nor do the formal role forms PO (position role), FO (direction role) and LO (movement role) have recovered signatures sufficient to use them as ordinary prepositions or case markers.

Accordingly:
- preserve Formal versus Vernacular register boundaries;
- do not generate learner sentences by simply substituting JO for “toward” or desh for every locative;
- use English semantic prompts as tests until a construction has an approved form;
- when a form is eventually proposed, include positive, negative and ambiguity cases.

## 9. Decision docket

| ID | Question | Recommended research default | Canon status |
|---|---|---|---|
| SP-DEC-01 | Does JO describe orientation, motion, or both? | Minimum gloss supports “toward”; do not infer motion | Unresolved beyond gloss |
| SP-DEC-02 | Does JUR identify a source argument? | No such inference without a signature | Unresolved |
| SP-DEC-03 | What kinds can JA relate? | Require an explicitly typed path/reference in the eventual contract | Unresolved |
| SP-DEC-04 | Which object types are accepted by JE? | Do not restrict or broaden without source evidence | Unresolved |
| SP-DEC-05 | Is JI one relation or two (aligned/coincident)? | Preserve combined historical gloss and flag ambiguity | Unresolved |
| SP-DEC-06 | What are PO/FO/LO signatures? | Do not use as surface markers until original definitions recovered | Unresolved |
| SP-DEC-07 | What is the surface syntax for spatial relations? | No invented syntax; maintain abstract semantic fixtures | Unresolved |
| SP-DEC-08 | How is FE attached to a relation? | Preserve frame metadata; do not infer a slot | Unresolved |

## 10. Outcome and next step

This phase makes the formal spatial inventory more usable by defining what must and must not be inferred from each gloss. It does not simply repeat the earlier register audit: it creates a focused contrast bank and a relation-by-type decision docket that can be used to assess future proposals.

- **Decision ID:** P8Q-SPATIAL-RELATION-SEMANTICS-01
- **Canon changes:** none.
- **New vocabulary:** none.
- **Implementation changes:** none.
- **Tests executed:** none.
- **Grounded facts:** axis labels/conventions, five formal spatial relations, and geometric inventory.
- **Proposal:** semantic contrast conditions and frame/type metadata requirements.
- **Next phase:** prepare a bounded, owner-reviewable formal relation contract proposal with explicit alternatives for JO/JUR/JA/JE/JI, then move to useful typed example patterns only after the signatures and frame policy are clear.
