# Arcane Incantations v1.8 — Spatial Frames and Region Semantics

**Status:** LOCKED DESIGN CANON for the bounded modern incantation layer  
**Source anchors:** Arcane v3.0-L, §§3–5 (references, spatial axes/relations, geometry); incantation layers v1.0–v1.7  
**Validation status:** 52 specification fixtures. These are expected outcomes, not results from a geometric engine or spell runtime.

## 1. Purpose and evidence boundary

Version 1.8 defines how a spatial incantation identifies its reference frame, represents a geometric target, distinguishes spatial relations, and handles boundary uncertainty and time-dependent position.

The following forms are source-recorded in Arcane v3.0-L and retain those source meanings:
- References: MI (self), NI (field), RI (target), SU (current), WO (world), FE (frame).
- Axes: PA (−X), BA (+X), TA (−Y), DA (+Y), KA (−Z), GA (+Z), with +X = right, +Y = above, +Z = forward.
- Relations: JO (toward), JUR (away), JA (along), JE (parallel), JI (aligned/coincident).
- Geometry: PI (point), LEN (line), PLA (plane), SUR (surface), VOM (volume), PAR (path), REN (region), NET (network).
- Position quantity: PALA (position).

These source entries do not by themselves specify every coordinate encoding, region constructor, transformation signature, tolerance rule or execution mechanism. The modern contracts below are additions to the incantation design layer; they do not claim historical argument signatures or invent new spoken tokens.

## 2. Spatial value model

A spatial value is represented in specification metalanguage as:

**SPATIAL-VALUE = (GEOMETRY-TYPE, FRAME-REFERENCE, REPRESENTATION, VALIDITY, UNCERTAINTY, PROVENANCE)**

- **GEOMETRY-TYPE:** point, line, plane, surface, volume, path, region or network.
- **FRAME-REFERENCE:** a resolved frame, using FE or another explicitly supported frame reference.
- **REPRESENTATION:** the registered representation for that geometry type.
- **VALIDITY:** the time, scope and conditions under which the spatial value may be used.
- **UNCERTAINTY:** the applicable positional, boundary or topology uncertainty.
- **PROVENANCE:** source and method by which the value was defined, derived or observed.

This is a conceptual contract, not a claim that the runtime already implements these records. A spatial value missing a required frame or representation is unresolved, not silently interpreted in a convenient default frame.

## 3. Frames and coordinate interpretation

Every position, direction, path or region that depends on coordinates must identify the frame in which those coordinates are meaningful. The world and field references are not automatically interchangeable, and a target reference RI is not itself a coordinate frame.

A frame contract must specify:
- frame identity and reference resolution;
- axis convention and handedness where relevant;
- origin and orientation, if the representation uses them;
- units and dimensional conventions for coordinate magnitudes;
- frame validity and transformation provenance;
- supported transformations into another frame.

The canonical +X/+Y/+Z directional convention is recorded above. It does not alone establish a universal origin, scale, rotation, transformation algorithm or local-frame behaviour.

A transformation is permitted only if a versioned transformation contract exists for the source and destination frames. The system must not combine coordinates from different frames merely because their numeric representations look alike.

## 4. Geometry types are not interchangeable

- **PI — point:** a location under a declared frame and representation; it has no implied area or volume.
- **LEN — line:** a one-dimensional geometric object under a defined representation; a finite segment and an unbounded line are not equivalent without an explicit subtype.
- **PLA — plane:** a planar geometric object; finite patches and unbounded planes must be distinguished where the operation depends on extent.
- **SUR — surface:** a two-dimensional boundary or surface object under a defined representation; closedness and orientation are not presumed.
- **VOM — volume:** a three-dimensional extent under a declared representation; connectedness and boundary inclusion must be declared when relevant.
- **PAR — path:** an ordered spatial course with direction/order semantics supplied by its path contract; it is not merely a set of points.
- **REN — region:** a spatial domain with an explicit membership rule; shape and topology must be represented or referenced.
- **NET — network:** a network structure with declared nodes, connections and spatial embedding rules; it is not interchangeable with a continuous region.

These descriptions are conservative modern contracts informed by the source geometry vocabulary. Exact historical semantics may be narrower or broader and are not silently rewritten here.

## 5. Target, frame, region and spatial role

The following concepts remain distinct:
- **Target reference:** which entity or resource an operation addresses.
- **Frame reference:** the coordinate/reference system used to interpret spatial data.
- **Region value:** a geometric domain used by a predicate or operation.
- **Spatial role:** whether a value is used as a position, direction, movement or another explicitly typed slot.
- **Effect specification:** the requested change or condition; it is not a geometric value merely because it mentions a location.

The source role markers PO (position role), FO (direction role) and LO (movement role) are retained from their source record. This specification does not infer complete argument order or signatures for them. A concrete invocation must use the relevant registered role and operation contracts.

A target may have a position, but the target reference and position value are not the same thing. Changing a frame or a position does not silently change target identity.

## 6. Spatial relations

The source-recorded relation forms retain their listed glosses:
- JO — toward;
- JUR — away;
- JA — along;
- JE — parallel;
- JI — aligned/coincident.

They describe relations, not independent forces, transformations or guaranteed motion. To evaluate a relation, the invocation must declare the operands and the applicable relation contract. For example, “toward” requires a defined origin/participant and a defined destination/reference; the gloss alone does not determine the operation's full signature.

**Parallel** and **aligned/coincident** must not be treated as synonyms. Parallelism can describe orientation or direction without implying shared position; coincidence/alignment requires the stronger relation defined by the applicable geometry contract. Where the domain does not define this distinction sufficiently, evaluation is unresolved.

## 7. Containment, intersection, contact and boundary

Spatial predicates must name the relation being tested:
- **INSIDE:** membership in a region under its declared boundary convention.
- **CONTAINS:** a region contains a specified point, geometry or region under a declared inclusion rule.
- **INTERSECTS:** the operands share at least one point under the relevant topology and precision contract.
- **TOUCHES:** the operands meet at a boundary under a declared topological relation, without silently implying interior overlap.
- **DISJOINT:** the operands have no common points, but only where the evidence and geometry model can establish this.
- **OVERLAPS:** an explicitly defined overlap relation; not an informal substitute for intersection.

These labels are modern specification metalanguage, not new spoken Arcane tokens. Their exact mathematical definitions must be provided by the relevant geometry subsystem. The names alone are not sufficient to implement them.

A point on a boundary cannot be classified by guesswork. The predicate must use an explicit inclusive/exclusive boundary rule and a precision/tolerance contract. If uncertainty spans both inside and outside, the result is UNKNOWN unless the predicate contract explicitly supports a different sound conclusion.

## 8. Distance, tolerance and uncertainty

Distance and tolerance require compatible frames, units and representations. A tolerance is a declared parameter, not an implicit universal epsilon.

A spatial predicate or transformation must state:
- the metric or comparison rule being used;
- the units and dimensional type of any tolerance;
- whether the tolerance is absolute, relative or domain-specific;
- how measurement and representation uncertainty affect the result;
- the required confidence/coverage policy, where applicable;
- the treatment of boundary cases.

If the measured uncertainty exceeds the declared tolerance or the evidence cannot distinguish the candidate outcomes, the result is UNKNOWN or insufficient evidence. The system must not shrink uncertainty silently to force a pass.

This specification does not select a universal distance metric, tolerance, coordinate precision or uncertainty-propagation algorithm.

## 9. Motion, path and time

A spatial value may be time-independent, time-stamped or explicitly dynamic. The contract must say which.

- A position measurement is an observation valid under its stated temporal window, not proof of the target's current position.
- A path is ordered; its orientation, directionality, endpoints and time parameterisation must be declared when required.
- A movement request is distinct from a path description and from a verified position change.
- A direction is not a velocity; a velocity is not a route.
- A path's geometric validity does not prove that movement along it is physically feasible or safe.
- A time-dependent transformation must identify its time model and supported update semantics.

The source vocabulary includes PALA (position) and VANU (velocity) in the canonical quantity inventory, but this document does not invent complete operation signatures for them. A position stale under v1.6 validity rules cannot be consumed as current without an explicit permitted policy.

## 10. Frame conversion and spatial composition

Combining spatial values requires compatible frames or an explicit conversion chain. Every transformation in that chain must be defined, versioned and valid for the relevant time.

A composed path, region or network must preserve its type-specific invariants. Converting a path to a set of points can lose ordering; converting a network to a region can lose connectivity; converting a volume to its surface can discard interior extent. Such transformations require explicit, declared conversion contracts and must report information loss.

If any required frame, transformation, geometry representation or validity interval is unavailable, the result is UNDERSPECIFIED or unresolved. The system must not assume that frames coincide or that a transformation is identity.

## 11. Predicate and execution integration

Spatial checks use the v1.6 typed-value rules and v1.7 predicate outcomes:
- TRUE only when the defined spatial relation is established with sufficient evidence.
- FALSE only when evidence establishes that the relation does not hold.
- UNKNOWN when uncertainty, frame ambiguity, stale data or incomplete coverage prevents a sound result.
- ERROR when evaluation fails under its declared contract.
- INVALID when types, frames or representation contracts are violated.

A spatial predicate passing does not establish authority, resource sufficiency, mechanism support, physical feasibility, execution or outcome success. The v1.2 constraints, v1.3 mechanism rules, v1.4 sequencing and v1.5 execution contracts remain in force.

## 12. Acceptance and rejection fixtures

Specification-level expected outcomes; not executed by a geometry engine.

| ID | Condition | Expected result |
|---|---|---|
| SPA18-01 | Spatial value declares geometry type, frame, representation and validity | Accept value shape |
| SPA18-02 | Coordinate-dependent value has no resolvable frame | Unresolved |
| SPA18-03 | Target reference is treated as a coordinate frame | Reject conflation |
| SPA18-04 | Coordinates from distinct frames are combined without conversion | Reject |
| SPA18-05 | Transformation has a registered, valid frame contract | Permit conversion checks |
| SPA18-06 | Transformation is assumed to be identity without evidence | Reject |
| SPA18-07 | Point is treated as having area or volume | Reject |
| SPA18-08 | Finite line segment and unbounded line are conflated where extent matters | Reject |
| SPA18-09 | Path is converted to an unordered point set without declaring loss | Reject |
| SPA18-10 | Network is treated as a continuous region | Reject |
| SPA18-11 | Region membership has no declared rule | Predicate unavailable |
| SPA18-12 | Surface boundary convention is required but missing | UNDERSPECIFIED |
| SPA18-13 | PO, FO or LO gloss is used to invent an undocumented signature | Reject |
| SPA18-14 | Position value is treated as target identity | Reject |
| SPA18-15 | Target identity changes because its position changes | Reject |
| SPA18-16 | JO is treated as a force or guaranteed movement | Reject |
| SPA18-17 | JUR is evaluated without defined participants/reference | UNDERSPECIFIED |
| SPA18-18 | JE (parallel) is treated as JI (aligned/coincident) | Reject conflation |
| SPA18-19 | Inside test has explicit frame and boundary contract | Evaluate under contract |
| SPA18-20 | Boundary inclusion/exclusion is unspecified | UNDERSPECIFIED |
| SPA18-21 | Point uncertainty spans both inside and outside outcomes | UNKNOWN |
| SPA18-22 | INTERSECTS is used as a synonym for TOUCHES | Reject conflation |
| SPA18-23 | DISJOINT is claimed from incomplete spatial coverage | UNKNOWN |
| SPA18-24 | OVERLAPS has no registered domain definition | Predicate unavailable |
| SPA18-25 | Distance comparison uses incompatible units | TYPE-ERROR or conversion error |
| SPA18-26 | Tolerance has no declared dimension or policy | UNDERSPECIFIED |
| SPA18-27 | Tolerance is silently enlarged to force acceptance | Reject |
| SPA18-28 | Measurement uncertainty exceeds tolerance | UNKNOWN / insufficient evidence |
| SPA18-29 | Metric differs from required contract | Reject |
| SPA18-30 | Stale position is consumed as current | VALUE-STALE |
| SPA18-31 | Direction is treated as velocity | Reject |
| SPA18-32 | Velocity is treated as a route | Reject |
| SPA18-33 | Geometrically valid path is assumed physically feasible | Reject |
| SPA18-34 | Dynamic value has no declared update/time contract | UNDERSPECIFIED |
| SPA18-35 | Transformation validity interval has expired | VALUE-STALE or unresolved |
| SPA18-36 | Frame conversion chain contains an undefined step | Reject conversion |
| SPA18-37 | Region conversion loses boundary data without declaration | Reject silent loss |
| SPA18-38 | Network-to-region conversion loses connectivity silently | Reject silent loss |
| SPA18-39 | Path composition reverses order without declared operation | Reject |
| SPA18-40 | Geometry types match but representation contracts conflict | INVALID |
| SPA18-41 | Spatial predicate result is UNKNOWN coerced to FALSE | Reject |
| SPA18-42 | Spatial predicate passes but authority is absent | Execution blocked |
| SPA18-43 | Spatial predicate passes but mechanism is unsupported | Not validated |
| SPA18-44 | Frame identity is ambiguous | UNKNOWN / unresolved |
| SPA18-45 | Provenance required but absent | Insufficient evidence |
| SPA18-46 | Spatial check passes but resource budget fails | RESOURCE-INSUFFICIENT |
| SPA18-47 | Spatial check passes but operation was not executed | No outcome claim |
| SPA18-48 | Start/end checks are claimed to prove continuous containment | Reject claim |
| SPA18-49 | All required spatial checks pass with adequate evidence | Spatial predicates satisfied only |
| SPA18-50 | A coordinate axis is assumed to define an origin or scale | Reject inference |
| SPA18-51 | Region membership uses an unapproved implicit tolerance | Reject |
| SPA18-52 | Frame, geometry, provenance and uncertainty are retained in audit record | Accept record |

## 13. Explicitly unresolved

This version does not define a universal coordinate representation, frame-construction syntax, transformation registry, geometric kernel, topology engine, distance metric, tolerance default, uncertainty calculus, path parameterisation, dynamic-frame model, or canonical spoken syntax for the modern predicates. It does not establish physical movement feasibility or actual spell execution.

**Change policy:** Spatial frame and region semantics are locked for this bounded layer. New geometry operators or conversion rules must declare frame requirements, type signatures, boundary and uncertainty behaviour, information-loss policy and negative fixtures. Source vocabulary remains unchanged; no undocumented historical signatures are inferred.
