# Arcane Phase 8T — typed abstract spatial reference fixtures

**Status:** Research fixtures; not Arcane surface sentences and not executable spell notation  
**Date:** 2026-10-15  
**Canon effect:** none  
**New vocabulary:** none  
**Implementation changes:** none  
**Tests executed:** none

## 1. Purpose

Phases 8Q–8S established the canonical spatial inventory, relation contrasts, and the unresolved boundary between role forms (PO/FO/LO) and relation forms (JO/JUR/JA/JE/JI). This phase turns those distinctions into concrete, typed examples that can be reused when formal signatures are eventually approved.

Every fixture is written in neutral research metalanguage. Field names and type labels are not Arcane tokens, operator signatures, or surface syntax. The fixtures test intended interpretation, type compatibility questions, and excluded readings.

## 2. Type-label policy

The canonical inventory directly names PI (point), LEN (line), PLA (plane), SUR (surface), VOM (volume), and PAR (path). It does not in the inspected source provide a complete type constructor or signature for direction, motion event, coordinate frame, or every spatial relation.

Accordingly:
- `Point`, `Line`, `Plane`, `Surface`, `Volume`, and `Path` are English research labels corresponding to the listed geometry concepts;
- `DirectionValue`, `MotionEvent`, `FrameId`, and `SpatialRelationRecord` are provisional metalanguage types;
- a type label in a fixture is not proof that Arcane's formal type system already declares it;
- a rejected fixture is a semantic requirement, not a claim that an existing parser has been run.

## 3. Fixture format

Each fixture records:
- **input scenario** — the intended abstract spatial situation;
- **candidate record** — a neutral representation of its relevant values;
- **must preserve** — what the representation must mean;
- **must not infer** — readings that are not licensed;
- **open contract** — what still needs a canonical signature or owner-approved rule.

The record format is a research aid. It does not dictate argument order.

## 4. Positive fixtures

### SREF-001 — orientation toward a point

**Input scenario:** A direction is oriented toward point P in frame F.

```text
role_label: FO (candidate role; exact contract unresolved)
relation_label: JO
subject_value_kind: DirectionValue
reference_value_kind: Point
frame: F
intended_reading: orientation toward P
```

**Must preserve:** direction is related to P as a reference in F.  
**Must not infer:** motion occurred; P was reached; the direction was caused by P.  
**Open contract:** whether FO composes with JO and whether a direction value is an accepted JO argument.

### SREF-002 — orientation away from a point

**Input scenario:** A direction is oriented away from point P in frame F.

```text
role_label: FO (candidate role; exact contract unresolved)
relation_label: JUR
subject_value_kind: DirectionValue
reference_value_kind: Point
frame: F
intended_reading: orientation away from P
```

**Must preserve:** the direction is relative to P.  
**Must not infer:** motion began at P; the represented entity was previously located at P.  
**Open contract:** whether JUR is defined over direction values, motion events, or both.

### SREF-003 — motion along a path

**Input scenario:** A motion event has a trajectory related to path P.

```text
role_label: LO (candidate role; exact contract unresolved)
relation_label: JA
subject_value_kind: MotionEvent
reference_value_kind: Path
frame: F
intended_reading: event trajectory follows or relates to P
```

**Must preserve:** the path relation and motion event are distinct semantic objects.  
**Must not infer:** complete traversal, constant speed, a particular direction of travel, or endpoint arrival.  
**Open contract:** whether JA takes an event, a trajectory, or an entity/path pair.

### SREF-004 — two distinct parallel lines

**Input scenario:** Line L1 is parallel to line L2 in frame F, and L1 is not coincident with L2.

```text
role_label: unresolved
relation_label: JE
subject_value_kind: Line
reference_value_kind: Line
frame: F
intended_reading: parallel, distinct lines
```

**Must preserve:** parallelism and non-coincidence.  
**Must not infer:** contact, shared position, equal length, or common origin.  
**Open contract:** whether JE admits lines and which mathematical definition of parallelism is canonical.

### SREF-005 — alignment without established coincidence

**Input scenario:** Two direction values have aligned orientation, but the position of their origins is unknown.

```text
role_label: unresolved
relation_label: JI
subject_value_kind: DirectionValue
reference_value_kind: DirectionValue
frame: F
intended_reading: alignment candidate
```

**Must preserve:** orientation alignment is the intended reading of this research fixture.  
**Must not infer:** coincident points or geometric objects.  
**Open contract:** JI's combined gloss remains unresolved; this fixture is a test of a proposed sense, not a decision that the sense is canonical.

### SREF-006 — position at a point

**Input scenario:** Entity E is located at point P in frame F.

```text
role_label: PO (candidate role; exact contract unresolved)
relation_label: none
subject_value_kind: Entity
reference_value_kind: Point
frame: F
intended_reading: static position at P
```

**Must preserve:** a static location description.  
**Must not infer:** movement toward P, departure from P, or an event that placed E there.  
**Open contract:** PO's historical meaning and the formal representation of static location.

## 5. Contrastive and negative fixtures

### SREF-007 — toward does not mean arrival

**Scenario A:** Direction D points toward P.  
**Scenario B:** Entity E reaches P.

Expected result: these are not interchangeable. JO's minimum gloss alone cannot encode the completed arrival claim.

**Failure condition:** a relation-only record is automatically interpreted as successful arrival.

### SREF-008 — away does not mean source

**Scenario A:** Direction D points away from P.  
**Scenario B:** Motion event M starts at P.

Expected result: orientation-away and source-origin are distinct.

**Failure condition:** JUR is assigned an origin/source role without an explicit contract.

### SREF-009 — along does not imply full traversal

**Scenario A:** Motion follows part of path P and stops before endpoint E.  
**Scenario B:** Motion traverses P to E.

Expected result: the relation label JA alone must not force Scenario B.

**Failure condition:** complete traversal is inferred solely from “along”.

### SREF-010 — parallel does not mean coincident

**Scenario A:** L1 and L2 are distinct parallel lines.  
**Scenario B:** L1 and L2 occupy the same line.

Expected result: JE and the coincidence reading must remain distinct unless a future formal definition explicitly says otherwise.

**Failure condition:** parallelism is implemented as equality/coincidence.

### SREF-011 — missing frame

**Scenario:** A direction has numerical components, but the frame is unknown.

Expected result: a frame-dependent comparison is marked unresolved or rejected until the frame is supplied or a canonical default rule applies.

**Failure condition:** components are silently interpreted using the global convention despite unresolved frame context.

### SREF-012 — mismatched geometry kinds

**Scenario:** A proposed JE relation receives a point and a path, but its accepted argument kinds have not been specified.

Expected result: compatibility remains unresolved; do not assert a valid or invalid canonical typing rule without the signature.

**Failure condition:** the checker invents a compatibility rule based only on English plausibility.

### SREF-013 — different frames

**Scenario:** Direction D1 is expressed in frame F1 and direction D2 in frame F2, with no transformation between frames.

Expected result: a direct comparison is blocked or flagged unresolved.

**Failure condition:** raw components are compared as if F1 and F2 were identical.

### SREF-014 — relation is not a mechanism

**Scenario:** A description states that a trajectory is directed toward an object, but no force, energy source, coupling or physical feasibility has been established.

Expected result: the spatial description can be discussed as representation, but no physical effect is claimed.

**Failure condition:** the existence of a spatial relation is treated as proof of causation or executable magic.

## 6. Role/relation composition probes

These probes target the unknown relationship between PO/FO/LO and the relation inventory.

| ID | Probe | Question | Safe current result |
|---|---|---|---|
| COMP-01 | PO plus JO | Can a position role be oriented toward a reference? | Unresolved; do not synthesize a signature |
| COMP-02 | FO plus JUR | Does a direction role supply the value related by JUR? | Plausible proposal, not canon |
| COMP-03 | LO plus JA | Does a movement role supply an event whose trajectory follows a path? | Plausible proposal, not canon |
| COMP-04 | PO plus JE | Can a position role participate in parallelism? | Depends on accepted geometry kinds |
| COMP-05 | FO plus JI | Does alignment apply to directions under JI? | Candidate sense only; JI unresolved |
| COMP-06 | LO plus JO | Does a movement role imply motion toward, or does JO supply orientation independently? | Unresolved |
| COMP-07 | PO with no relation | Is a static position value well-formed without a relation operator? | Historical PO contract required |
| COMP-08 | Relation with no role | Can a relation operate directly on typed geometry values? | Historical relation signature required |

These are deliberately not written as Arcane token sequences. Doing so would falsely imply that argument order, delimiters, and composition have been established.

## 7. Acceptance policy for future implementation

When a parser or semantic checker eventually supports these constructs, each fixture should have explicit expected behaviour. Until then, these are acceptance criteria for a future implementation, not completed tests.

1. Preserve the distinction between a point, direction, path, geometric object and motion event.
2. Preserve relation meanings independently of role labels.
3. Require a documented frame policy for frame-dependent comparisons.
4. Reject or flag unknown signatures rather than guessing argument order.
5. Distinguish orientation from motion, motion from arrival, and direction from source.
6. Distinguish parallelism, alignment and coincidence.
7. Keep semantic representation separate from physical causation and feasibility.
8. Mark all provisional types and records as research-only.

## 8. What has been achieved

Phase 8T supplies fourteen reusable spatial fixtures: six positive abstract records, eight contrastive/negative scenarios, and eight role/relation composition probes. Together they make the remaining questions testable without inventing surface syntax.

This is a meaningful step toward a usable language specification: future decisions can be evaluated against stable semantic examples rather than reinterpreting glosses each time. The fixtures do not themselves resolve the historical contracts.

## 9. Next phase

The next phase should make a practical decision about the order of work:

- pursue a reliable extraction path for the original Phase 4/5 DOCX evidence for PO/FO/LO; and
- build a small formal-spatial signature proposal only where the owner can review each semantic assumption explicitly.

Do not keep producing parallel inventories indefinitely. Once the source evidence is either recovered or explicitly marked inaccessible, the project should move into an owner-reviewable draft contract and a runnable test specification, while preserving the boundary between proposal and canon.

- **Decision ID:** P8T-TYPED-SPATIAL-REFERENCE-FIXTURES-01
- **Canon changed:** no.
- **New vocabulary:** none.
- **Implementation changes:** none.
- **Tests executed:** none.
